
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { detectEmotion } from "@/utils/kairosService";

export default function useEmotionDetection() {
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<{emotion: string, timestamp: number, score: number}[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [stressLevel, setStressLevel] = useState<number>(0);
  const [engagementLevel, setEngagementLevel] = useState<number>(0);
  const [focusLevel, setFocusLevel] = useState<number>(0);
  const [lastDetectionTime, setLastDetectionTime] = useState<number>(0);
  const [showEmotionPopup, setShowEmotionPopup] = useState<boolean>(false);
  const [popupEmotion, setPopupEmotion] = useState<string | null>(null);

  // Face detection interval ref
  const faceDetectionIntervalRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const popupTimeoutRef = useRef<number | null>(null);

  // Request camera permission
  const requestCameraPermission = async () => {
    try {
      // Clear previous stream if it exists
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log("Stopped track:", track.kind);
        });
        mediaStreamRef.current = null;
      }
      
      // Reset video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      console.log("Requesting camera permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user" 
        } 
      });
      
      console.log("Camera permission granted, setting up video stream");
      setCameraPermission(true);
      mediaStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
            .then(() => console.log("Video playback started"))
            .catch(err => console.error("Error playing video:", err));
        };
      }
      
      return true;
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraPermission(false);
      toast.error("Camera access denied. Please enable camera permissions and try again.");
      return false;
    }
  };

  // Request microphone permission
  const requestMicPermission = async () => {
    try {
      console.log("Requesting microphone permission...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permission granted");
      setMicPermission(true);
      return true;
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setMicPermission(false);
      toast.error("Microphone access denied. Please enable microphone permissions and try again.");
      return false;
    }
  };

  // Process frames to detect emotions using Kairos API
  const processVideoFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !isAnalyzing) return;
    
    // Only run detection every 1 second to update results faster while still respecting API limits
    const now = Date.now();
    if (now - lastDetectionTime < 1000) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Draw the current video frame onto the canvas
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    try {
      // Convert canvas to base64 image
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setLastDetectionTime(now);
      
      // Call Kairos API for emotion detection
      const emotionResult = await detectEmotion(imageData);
      
      // Update emotion state immediately to reflect changes
      setCurrentEmotion(emotionResult.emotion);
      
      // Update emotion history
      setEmotionHistory(prev => [...prev, {
        emotion: emotionResult.emotion,
        timestamp: Date.now(),
        score: emotionResult.confidence
      }].slice(-12)); // Keep last 12 emotions
      
      // Update metrics based on emotion immediately
      updateMetricsBasedOnEmotion(emotionResult.emotion);
      
      // Show popup for stress or sad emotions
      if (emotionResult.emotion === "stressed" || emotionResult.emotion === "sad") {
        showEmotionalSupportPopup(emotionResult.emotion);
      }
    } catch (error) {
      console.error("Error detecting emotion:", error);
    }
  };

  // Show popup for emotional support when stress or sadness is detected
  const showEmotionalSupportPopup = (emotion: string) => {
    // Clear any existing popup timeout
    if (popupTimeoutRef.current !== null) {
      window.clearTimeout(popupTimeoutRef.current);
    }
    
    setPopupEmotion(emotion);
    setShowEmotionPopup(true);
    
    // Auto-hide popup after 8 seconds
    popupTimeoutRef.current = window.setTimeout(() => {
      setShowEmotionPopup(false);
      popupTimeoutRef.current = null;
    }, 8000);
  };

  // Update metrics based on detected emotion - more dynamic range for better visualization
  const updateMetricsBasedOnEmotion = (emotion: string) => {
    // Update stress level based on emotion - more dramatic changes
    if (emotion === "stressed") {
      setStressLevel(75 + Math.floor(Math.random() * 25));
    } else if (emotion === "confused") {
      setStressLevel(50 + Math.floor(Math.random() * 25));
    } else if (emotion === "sad") {
      setStressLevel(60 + Math.floor(Math.random() * 20));
    } else if (emotion === "neutral") {
      setStressLevel(20 + Math.floor(Math.random() * 20));
    } else if (emotion === "focused") {
      setStressLevel(10 + Math.floor(Math.random() * 15));
    } else if (emotion === "happy") {
      setStressLevel(5 + Math.floor(Math.random() * 10));
    } else {
      setStressLevel(15 + Math.floor(Math.random() * 20));
    }
    
    // Update engagement level - more dramatic changes
    if (emotion === "focused" || emotion === "happy") {
      setEngagementLevel(80 + Math.floor(Math.random() * 20));
    } else if (emotion === "neutral") {
      setEngagementLevel(50 + Math.floor(Math.random() * 30));
    } else if (emotion === "sad") {
      setEngagementLevel(20 + Math.floor(Math.random() * 30));
    } else if (emotion === "stressed") {
      setEngagementLevel(15 + Math.floor(Math.random() * 25));
    } else {
      setEngagementLevel(30 + Math.floor(Math.random() * 40));
    }
    
    // Update focus level - more dramatic changes
    if (emotion === "focused") {
      setFocusLevel(85 + Math.floor(Math.random() * 15));
    } else if (emotion === "happy") {
      setFocusLevel(70 + Math.floor(Math.random() * 20));
    } else if (emotion === "neutral") {
      setFocusLevel(50 + Math.floor(Math.random() * 20));
    } else if (emotion === "stressed") {
      setFocusLevel(15 + Math.floor(Math.random() * 20));
    } else if (emotion === "sad") {
      setFocusLevel(20 + Math.floor(Math.random() * 20));
    } else {
      setFocusLevel(30 + Math.floor(Math.random() * 30));
    }
  };

  // Start emotion analysis
  const startAnalysis = async () => {
    console.log("Starting analysis...");
    
    // Ensure media stream is cleared before requesting a new one
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log("Stopped track:", track.kind);
      });
      mediaStreamRef.current = null;
    }
    
    // Reset video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    const hasCamera = await requestCameraPermission();
    const hasMic = micPermission || await requestMicPermission();
    
    if (hasCamera && hasMic) {
      setIsAnalyzing(true);
      toast.success("Emotion detection started");
      
      // Initialize the first emotion if not set
      if (!currentEmotion) {
        setCurrentEmotion("neutral");
        setEmotionHistory([{
          emotion: "neutral", 
          timestamp: Date.now(),
          score: 0.8
        }]);
        updateMetricsBasedOnEmotion("neutral");
      }
      
      // Set up frame processing interval (increased rate for more responsive updates)
      if (faceDetectionIntervalRef.current === null) {
        faceDetectionIntervalRef.current = window.setInterval(processVideoFrame, 250);
      }
    } else {
      toast.error("Both camera and microphone access are required for emotion detection");
    }
  };

  // Stop emotion analysis
  const stopAnalysis = () => {
    console.log("Stopping analysis...");
    setIsAnalyzing(false);
    
    // Clear the detection interval
    if (faceDetectionIntervalRef.current !== null) {
      clearInterval(faceDetectionIntervalRef.current);
      faceDetectionIntervalRef.current = null;
    }
    
    // Stop all tracks from the media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log("Stopped track:", track.kind);
      });
      mediaStreamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    toast.info("Emotion detection stopped");
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (faceDetectionIntervalRef.current !== null) {
        clearInterval(faceDetectionIntervalRef.current);
      }
      
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (popupTimeoutRef.current !== null) {
        window.clearTimeout(popupTimeoutRef.current);
      }
    };
  }, []);

  return {
    cameraPermission,
    micPermission,
    isAnalyzing,
    currentEmotion,
    emotionHistory,
    showInfo,
    setShowInfo,
    stressLevel,
    engagementLevel,
    focusLevel,
    showEmotionPopup,
    setShowEmotionPopup,
    popupEmotion,
    videoRef,
    canvasRef,
    startAnalysis,
    stopAnalysis
  };
}
