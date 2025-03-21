
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import useEmotionDetection from "./useEmotionDetection";
import EmotionPopup from "./EmotionPopup";
import CameraFeed from "./CameraFeed";
import AnalysisResults from "./AnalysisResults";
import EmotionCharts from "./EmotionCharts";

export default function EmotionDetectionSection() {
  const {
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
  } = useEmotionDetection();

  return (
    <section id="home" className="section">
      <EmotionPopup 
        showEmotionPopup={showEmotionPopup}
        popupEmotion={popupEmotion}
        setShowEmotionPopup={setShowEmotionPopup}
      />
      
      <div className="section-header">
        <span className="chip mb-2">AI-Powered</span>
        <h1 className="text-balance">Real-time Emotion Detection</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
          Our advanced AI analyzes your facial expressions and voice to understand your emotional state,
          helping optimize your learning experience.
        </p>
      </div>
      
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Camera Feed & Controls */}
          <CameraFeed 
            isAnalyzing={isAnalyzing}
            cameraPermission={cameraPermission}
            micPermission={micPermission}
            startAnalysis={startAnalysis}
            stopAnalysis={stopAnalysis}
            videoRef={videoRef}
            canvasRef={canvasRef}
          />
          
          {/* Analysis Results */}
          <AnalysisResults 
            currentEmotion={currentEmotion}
            stressLevel={stressLevel}
            engagementLevel={engagementLevel}
            focusLevel={focusLevel}
            showInfo={showInfo}
            setShowInfo={setShowInfo}
          />
        </div>
        
        {/* Emotion History Visualization */}
        <EmotionCharts emotionHistory={emotionHistory} />
      </div>
    </section>
  );
}
