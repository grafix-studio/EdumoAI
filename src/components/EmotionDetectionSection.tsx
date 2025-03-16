
import { useState, useRef, useEffect } from "react";
import { Camera, Mic, AlertCircle, X, Play, Info } from "lucide-react";

export default function EmotionDetectionSection() {
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<{emotion: string, timestamp: number}[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Request camera permission
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission(true);
      mediaStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      return true;
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraPermission(false);
      return false;
    }
  };

  // Request microphone permission
  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission(true);
      return true;
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setMicPermission(false);
      return false;
    }
  };

  // Start emotion analysis
  const startAnalysis = async () => {
    const hasCamera = cameraPermission || await requestCameraPermission();
    const hasMic = micPermission || await requestMicPermission();
    
    if (hasCamera && hasMic) {
      setIsAnalyzing(true);
      // Simulate emotion detection with random emotions
      simulateEmotionDetection();
    }
  };

  // Stop emotion analysis
  const stopAnalysis = () => {
    setIsAnalyzing(false);
    
    // Stop all tracks from the media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Simulate emotion detection (in a real app, this would use an actual API)
  const simulateEmotionDetection = () => {
    if (!isAnalyzing) return;
    
    const emotions = ["happy", "focused", "confused", "stressed", "neutral"];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    setCurrentEmotion(randomEmotion);
    setEmotionHistory(prev => [...prev, {
      emotion: randomEmotion,
      timestamp: Date.now()
    }].slice(-10)); // Keep only last 10 emotions
    
    // Continue simulation if still analyzing
    setTimeout(simulateEmotionDetection, 3000);
  };

  // Get emotion recommendation
  const getEmotionRecommendation = () => {
    if (!currentEmotion) return null;
    
    switch (currentEmotion) {
      case "happy":
        return "Great mood detected! This is an optimal time for challenging material.";
      case "focused":
        return "You're in a focused state. Perfect for deep learning and complex topics.";
      case "confused":
        return "You seem a bit confused. Consider reviewing fundamentals or asking for clarification.";
      case "stressed":
        return "Stress detected. Try taking a short break or some deep breathing exercises.";
      default:
        return "Maintaining steady engagement. Continue your learning session.";
    }
  };

  // Get emotion color
  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return "bg-success/20 text-success border-success/30";
      case "focused":
        return "bg-primary/20 text-primary border-primary/30";
      case "confused":
        return "bg-warning/20 text-warning border-warning/30";
      case "stressed":
        return "bg-danger/20 text-danger border-danger/30";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <section id="home" className="section">
      <div className="section-header">
        <span className="chip mb-2">AI-Powered</span>
        <h1 className="text-balance">Real-time Emotion Detection</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
          Our advanced AI analyzes your facial expressions and voice to understand your emotional state,
          helping optimize your learning experience.
        </p>
      </div>
      
      <div className="max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Camera Feed & Controls */}
          <div className="glass-card p-6 flex flex-col">
            <div className="relative aspect-video bg-black/10 dark:bg-white/5 rounded-lg overflow-hidden mb-4">
              {isAnalyzing ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-muted-foreground opacity-50" />
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  cameraPermission === true ? "bg-success" : 
                  cameraPermission === false ? "bg-danger" : "bg-muted"
                }`} />
                <span className="text-sm font-medium">Camera</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  micPermission === true ? "bg-success" : 
                  micPermission === false ? "bg-danger" : "bg-muted"
                }`} />
                <span className="text-sm font-medium">Microphone</span>
              </div>
            </div>
            
            <div className="mt-auto flex justify-center">
              {!isAnalyzing ? (
                <button 
                  className="btn-primary flex items-center space-x-2"
                  onClick={startAnalysis}
                >
                  <Play className="w-4 h-4" />
                  <span>Start Detection</span>
                </button>
              ) : (
                <button 
                  className="btn-secondary flex items-center space-x-2"
                  onClick={stopAnalysis}
                >
                  <X className="w-4 h-4" />
                  <span>Stop Detection</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Analysis Results */}
          <div className="glass-card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium">Emotion Analysis</h3>
              <button 
                className="p-2 rounded-full hover:bg-secondary/80 transition-all"
                onClick={() => setShowInfo(!showInfo)}
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
            
            {showInfo && (
              <div className="mb-6 p-4 bg-secondary/50 rounded-lg text-sm">
                <p className="mb-2 font-medium">How it works:</p>
                <p className="text-muted-foreground">
                  Our AI analyzes facial micro-expressions and voice patterns to detect emotions.
                  This helps provide personalized learning recommendations based on your current
                  emotional state.
                </p>
              </div>
            )}
            
            {/* Current Emotion Display */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Current Emotional State:</p>
              {currentEmotion ? (
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getEmotionColor(currentEmotion)}`}>
                  {currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}
                </div>
              ) : (
                <div className="text-muted-foreground italic">Not analyzing</div>
              )}
            </div>
            
            {/* Recommendation */}
            {currentEmotion && (
              <div className="mb-6 p-4 bg-secondary/30 rounded-lg animate-fade-in">
                <p className="text-sm font-medium mb-1">Recommendation:</p>
                <p className="text-sm text-muted-foreground">{getEmotionRecommendation()}</p>
              </div>
            )}
            
            {/* Emotion History Timeline */}
            <div className="mt-auto">
              <p className="text-sm text-muted-foreground mb-2">Emotion History:</p>
              {emotionHistory.length > 0 ? (
                <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
                  {emotionHistory.map((item, index) => (
                    <div 
                      key={index} 
                      className={`flex-shrink-0 px-3 py-1 rounded-full text-xs border ${getEmotionColor(item.emotion)}`}
                    >
                      {item.emotion}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground italic text-sm">No history yet</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Chatbot Section */}
        <div className="glass-card mt-8 p-6">
          <h3 className="text-xl font-medium mb-4">AI Learning Assistant</h3>
          <p className="text-muted-foreground mb-6">
            Our AI assistant can answer questions and provide learning recommendations based on your emotional state.
          </p>
          
          <div className="bg-secondary/30 rounded-lg p-4 mb-4 min-h-[100px] max-h-[200px] overflow-y-auto scrollbar-hide">
            <div className="text-sm italic text-muted-foreground">
              Ask a question about your learning materials or how to optimize your study session.
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Type your question here..." 
              className="flex-1 px-4 py-2 rounded-lg bg-secondary/50 border border-border/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            <button className="btn-primary py-2">Send</button>
          </div>
        </div>
      </div>
    </section>
  );
}
