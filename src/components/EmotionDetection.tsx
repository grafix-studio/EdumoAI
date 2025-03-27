import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Sun, Moon, Camera, CameraOff, Mic, MicOff, BrainCircuit, AlertCircle } from 'lucide-react';
import { useEmotionStore } from '../store/emotionStore';
import type { EmotionData, APIKeys } from '../types/emotion';
import EmotionMeters from './EmotionMeters';
import LearningContent from './LearningContent';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_KEYS: APIKeys = {
  huggingface: "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",
  mistral: "DjyJA9MFtGcViA7SvdgIp3Fg4iH7tPrW",
  facePlusPlus: {
    key: "KAA-QhU_WvIrvIw-MZdGjI7PE0Q-quJg",
    secret: "jcepSPpQNeGkxXL_HYiGU2NXxXFX647w"
  }
};

const EmotionDetection: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const chartRef = useRef<ChartJS | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const { emotions, isDarkMode, addEmotion, toggleTheme } = useEmotionStore();

  const checkMediaPermissions = async () => {
    try {
      const permissions = await Promise.all([
        navigator.permissions.query({ name: 'camera' as PermissionName }),
        navigator.permissions.query({ name: 'microphone' as PermissionName })
      ]);

      const [camera, microphone] = permissions;

      if (camera.state === 'denied' || microphone.state === 'denied') {
        setPermissionError(
          'Please enable camera and microphone access in your browser settings to use the emotion detection features.'
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  };

  const startMediaDevices = async () => {
    setPermissionError(null);
    
    const hasPermissions = await checkMediaPermissions();
    if (!hasPermissions) return;

    try {
      // Stop any existing streams
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }

      // Ensure at least one of video or audio is requested
      const constraints = {
        video: isCameraOn,
        audio: isMicOn
      };

      // If both are false, don't make the getUserMedia call
      if (!constraints.video && !constraints.audio) {
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMediaStream(stream);
    } catch (err) {
      console.error('Error accessing media devices:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setPermissionError(
            'Camera and microphone access was denied. Please enable access in your browser settings to use the emotion detection features.'
          );
        } else if (err.name === 'NotFoundError') {
          setPermissionError(
            'No camera or microphone found. Please ensure your devices are properly connected.'
          );
        } else {
          setPermissionError(
            'An error occurred while accessing your camera and microphone. Please refresh the page and try again.'
          );
        }
      }
    }
  };

  const toggleCamera = async () => {
    const newCameraState = !isCameraOn;
    setIsCameraOn(newCameraState);
    
    if (mediaStream) {
      // Stop all video tracks
      mediaStream.getVideoTracks().forEach(track => track.stop());
      
      // If turning camera on, restart media devices
      if (newCameraState || isMicOn) {
        await startMediaDevices();
      }
    }
  };

  const toggleMicrophone = async () => {
    const newMicState = !isMicOn;
    setIsMicOn(newMicState);
    
    if (mediaStream) {
      // If turning mic off, stop audio tracks
      if (!newMicState) {
        mediaStream.getAudioTracks().forEach(track => track.stop());
      }
      
      // If either camera is on or turning mic on, restart media devices
      if (isCameraOn || newMicState) {
        await startMediaDevices();
      }
    }
  };

  const analyzeEmotion = async () => {
    if (!webcamRef.current || permissionError || !isCameraOn) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      const formData = new FormData();
      formData.append('api_key', API_KEYS.facePlusPlus.key);
      formData.append('api_secret', API_KEYS.facePlusPlus.secret);
      formData.append('image_base64', imageSrc.split(',')[1]);

      const response = await axios.post(
        'https://api-us.faceplusplus.com/facepp/v3/detect',
        formData
      );

      const emotionData: EmotionData = {
        timestamp: Date.now(),
        emotion: response.data.faces[0]?.attributes?.emotion?.type || 'neutral',
        confidence: response.data.faces[0]?.attributes?.emotion?.confidence || 0,
        stress_level: Math.random() * 100
      };

      addEmotion(emotionData);
    } catch (error) {
      console.error('Error analyzing emotion:', error);
    }
  };

  useEffect(() => {
    startMediaDevices();
    const interval = setInterval(analyzeEmotion, 5000);
    return () => {
      clearInterval(interval);
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const chartData = {
    labels: emotions.map(e => new Date(e.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Stress Level',
        data: emotions.map(e => e.stress_level),
        borderColor: isDarkMode ? '#60A5FA' : '#2563EB',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  return (
    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BrainCircuit className="w-6 h-6" />
          Emotion Detection System
        </h2>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="relative">
            {permissionError ? (
              <div className={`w-full aspect-video rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="text-center p-6">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                  <p className="text-lg mb-2">Permission Required</p>
                  <p className="text-sm text-gray-500">{permissionError}</p>
                  <button
                    onClick={startMediaDevices}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <>
                {isCameraOn ? (
                  <Webcam
                    ref={webcamRef}
                    audio={isMicOn}
                    videoConstraints={{ facingMode: "user" }}
                    screenshotFormat="image/jpeg"
                    className="w-full rounded-lg"
                    mirrored={true}
                  />
                ) : (
                  <div className={`w-full aspect-video rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className="text-center">
                      <CameraOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm opacity-75">Camera is turned off</p>
                    </div>
                  </div>
                )}
              </>
            )}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={toggleCamera}
                className={`p-2 rounded-full transition-colors ${
                  isCameraOn 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
                title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {isCameraOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleMicrophone}
                className={`p-2 rounded-full transition-colors ${
                  isMicOn 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
                title={isMicOn ? 'Turn off microphone' : 'Turn on microphone'}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <EmotionMeters />
        </div>

        <div className="space-y-6">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h3 className="font-semibold mb-4">Emotion History</h3>
            <div className="h-[300px]">
              <Line
                ref={chartRef}
                data={chartData}
                options={chartOptions}
              />
            </div>
          </div>

          <LearningContent />
        </div>
      </div>
    </div>
  );
};

export default EmotionDetection;