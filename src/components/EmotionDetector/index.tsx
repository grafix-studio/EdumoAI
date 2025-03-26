import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, Mic, AlertCircle, Brain, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { MistralClient } from '@mistralai/mistralai';
import axios from 'axios';

// Types
interface EmotionData {
  timestamp: number;
  emotion: string;
  confidence: number;
  stress_level: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface EmotionDetectorProps {
  onEmotionUpdate?: (data: EmotionData) => void;
}

// Constants
const FACE_API_KEY = 'KAA-QhU_WvIrvIw-MZdGjI7PE0Q-quJg';
const FACE_API_SECRET = 'jcepSPpQNeGkxXL_HYiGU2NXxXFX647w';
const FACE_API_URL = 'https://api-us.faceplusplus.com/facepp/v3/detect';
const MISTRAL_API_KEY = 'DjyJA9MFtGcViA7SvdgIp3Fg4iH7tPrW';

const mistralClient = new MistralClient(MISTRAL_API_KEY);

export const EmotionDetector: React.FC<EmotionDetectorProps> = ({ onEmotionUpdate }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showStressAlert, setShowStressAlert] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);

  const startWebcam = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setIsWebcamActive(true);
      setError(null);
      setConsecutiveErrors(0);
    } catch (err) {
      setError('Failed to access webcam');
      setIsWebcamActive(false);
    }
  };

  const startMicrophone = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsMicActive(true);
      setError(null);
    } catch (err) {
      setError('Failed to access microphone');
      setIsMicActive(false);
    }
  };

  const analyzeFaceEmotion = async (imageData: string): Promise<EmotionData> => {
    try {
      setIsAnalyzing(true);
      const base64Image = imageData.split(';base64,').pop();
      if (!base64Image) {
        throw new Error('Invalid image data');
      }

      const formData = new FormData();
      formData.append('api_key', FACE_API_KEY);
      formData.append('api_secret', FACE_API_SECRET);
      formData.append('image_base64', base64Image);
      formData.append('return_attributes', 'emotion');

      const response = await axios.post(FACE_API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (!response.data.faces || response.data.faces.length === 0) {
        setConsecutiveErrors(prev => prev + 1);
        throw new Error('Please position your face in front of the camera');
      }

      setConsecutiveErrors(0);
      const emotions = response.data.faces[0]?.attributes?.emotion || {};
      const dominantEmotion = Object.entries(emotions).reduce((a, b) => 
        (a[1] > b[1] ? a : b))[0];

      const stressLevel = calculateStressLevel(emotions);

      return {
        timestamp: Date.now(),
        emotion: dominantEmotion,
        confidence: emotions[dominantEmotion],
        stress_level: stressLevel
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to analyze emotion');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateStressLevel = (emotions: Record<string, number>): number => {
    const stressFactors = {
      sadness: 0.3,
      anger: 0.3,
      fear: 0.2,
      disgust: 0.2
    };

    return Object.entries(stressFactors).reduce((stress, [emotion, weight]) => {
      return stress + (emotions[emotion] || 0) * weight;
    }, 0) / 100;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await mistralClient.chat({
        model: 'mistral-tiny',
        messages: [{ role: 'user', content: input }]
      });

      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.choices[0].message.content
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setError('Failed to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isWebcamActive && webcamRef.current) {
      interval = setInterval(async () => {
        // Skip analysis if already analyzing or too many consecutive errors
        if (isAnalyzing || consecutiveErrors > 5) {
          return;
        }

        try {
          const imageSrc = webcamRef.current?.getScreenshot();
          if (!imageSrc) {
            console.warn('No image captured from webcam');
            return;
          }

          const emotionData = await analyzeFaceEmotion(imageSrc);
          setEmotionHistory(prev => [...prev, emotionData]);
          
          if (emotionData.stress_level > 0.2) {
            setShowStressAlert(true);
          }

          if (onEmotionUpdate) {
            onEmotionUpdate(emotionData);
          }
          
          setError(null);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Failed to analyze emotion');
          }
          
          // If we've had too many consecutive errors, pause the webcam
          if (consecutiveErrors > 5) {
            setIsWebcamActive(false);
            setError('Face detection paused. Click the camera icon to try again.');
          }
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWebcamActive, onEmotionUpdate, isAnalyzing, consecutiveErrors]);

  const formatChartData = (data: EmotionData[]) => {
    return data.map(entry => ({
      ...entry,
      time: new Date(entry.timestamp).toLocaleTimeString()
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">
              AI Emotion Detection System
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            {/* Emotion Detector */}
            <div className="relative w-full max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Emotion Detection</h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={startWebcam}
                        className={`p-2 rounded-full ${
                          isWebcamActive ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      >
                        <Camera className="w-5 h-5 text-white" />
                      </button>
                      <button
                        onClick={startMicrophone}
                        className={`p-2 rounded-full ${
                          isMicActive ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      >
                        <Mic className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center space-x-2 text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    {isWebcamActive && (
                      <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                      />
                    )}
                    {!isWebcamActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-gray-500">Click the camera icon to start</p>
                      </div>
                    )}
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-white">Analyzing...</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Status */}
            {emotionHistory.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <div className="flex items-center space-x-2 mb-4">
                  <Activity className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-semibold">Current Status</h2>
                </div>
                <div className="space-y-2">
                  <p className="text-lg">
                    Current Emotion:{' '}
                    <span className="font-semibold">
                      {emotionHistory[emotionHistory.length - 1].emotion}
                    </span>
                  </p>
                  <p className="text-lg">
                    Stress Level:{' '}
                    <span className="font-semibold">
                      {Math.round(
                        emotionHistory[emotionHistory.length - 1].stress_level * 100
                      )}%
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {/* AI Chat */}
            <div className="bg-white rounded-lg shadow-xl p-4 h-[400px] flex flex-col">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold">AI Assistant</h2>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="animate-pulse">Thinking...</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Emotion History */}
            {emotionHistory.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-semibold mb-4">Emotion History</h2>
                <div className="w-full overflow-x-auto">
                  <LineChart width={600} height={300} data={formatChartData(emotionHistory)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="confidence" stroke="#8884d8" />
                    <Line type="monotone" dataKey="stress_level" stroke="#82ca9d" />
                  </LineChart>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Stress Alert */}
      {showStressAlert && (
        <div className="fixed top-4 right-4 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg max-w-md animate-fade-in">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">High Stress Detected</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Your stress levels appear to be elevated. Consider taking a short break or trying some breathing exercises.</p>
              </div>
            </div>
            <button
              onClick={() => setShowStressAlert(false)}
              className="ml-4 flex-shrink-0 inline-flex text-red-500 hover:text-red-700 focus:outline-none"
            >
              <AlertCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionDetector;