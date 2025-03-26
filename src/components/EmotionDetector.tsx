import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, Mic, AlertCircle } from 'lucide-react';
import { EmotionData } from '../types/emotion';
import { analyzeFaceEmotion } from '../services/emotionService';

interface Props {
  onEmotionDetected: (emotion: EmotionData) => void;
}

export const EmotionDetector: React.FC<Props> = ({ onEmotionDetected }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toggle Webcam
  const toggleWebcam = async () => {
    if (isWebcamActive) {
      // Stop the webcam properly
      if (webcamRef.current && webcamRef.current.video) {
        const stream = webcamRef.current.video.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      }
      setIsWebcamActive(false);
      return;
    }

    // Start the webcam
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setIsWebcamActive(true);
      setError(null);
    } catch (err) {
      setError('Failed to access webcam');
    }
  };

  // Toggle Microphone
  const toggleMicrophone = async () => {
    if (isMicActive) {
      // Stop microphone properly
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        stream.getTracks().forEach(track => track.stop());
      });
      setIsMicActive(false);
      return;
    }

    // Start microphone
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsMicActive(true);
      setError(null);
    } catch (err) {
      setError('Failed to access microphone');
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isWebcamActive && webcamRef.current) {
      interval = setInterval(async () => {
        try {
          const imageSrc = webcamRef.current?.getScreenshot();
          if (!imageSrc) return;

          const emotionData = await analyzeFaceEmotion(imageSrc);
          onEmotionDetected(emotionData);
          setError(null);
        } catch (err) {
          setError('Failed to analyze emotion');
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWebcamActive, onEmotionDetected]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Emotion Detection</h2>
            <div className="flex space-x-2">
              {/* Toggle Webcam Button */}
              <button
                onClick={toggleWebcam}
                className={`p-2 rounded-full ${isWebcamActive ? 'bg-red-500' : 'bg-green-500'}`}
              >
                <Camera className="w-5 h-5 text-white" />
              </button>

              {/* Toggle Microphone Button */}
              <button
                onClick={toggleMicrophone}
                className={`p-2 rounded-full ${isMicActive ? 'bg-red-500' : 'bg-green-500'}`}
              >
                <Mic className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-500 mb-4">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Webcam Display */}
          <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
            {isWebcamActive ? (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{
                  facingMode: "user"
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">Click the camera icon to start</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionDetector;