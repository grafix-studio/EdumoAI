
import { lazy } from "react";
import useEmotionDetection from "./emotion-detection/useEmotionDetection";
import EmotionPopup from "./emotion-detection/EmotionPopup";
import CameraFeed from "./emotion-detection/CameraFeed";
import AnalysisResults from "./emotion-detection/AnalysisResults";
import EmotionCharts from "./emotion-detection/EmotionCharts";

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
    timerCount,
    videoRef,
    canvasRef,
    startAnalysis,
    stopAnalysis,
    isProcessing
  } = useEmotionDetection();

  return (
    <section id="home" className="section">
      <EmotionPopup 
        showEmotionPopup={showEmotionPopup}
        popupEmotion={popupEmotion}
        setShowEmotionPopup={setShowEmotionPopup}
      />
      
      <div className="section-header">
        <span className="chip mb-2">Face++ AI-Powered</span>
        <h1 className="text-balance">Real-time Emotion Detection</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
          Utilizing Face++ advanced AI technology to analyze your facial expressions and 
          understand your emotional state, helping optimize your learning experience.
        </p>
        {isAnalyzing && (
          <div className="mt-4 bg-primary/10 rounded-full px-6 py-2 inline-flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <span className="font-medium">Emotion update in: {timerCount}s</span>
          </div>
        )}
      </div>
      
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Camera Feed & Controls */}
          <CameraFeed 
            isAnalyzing={isAnalyzing}
            cameraPermission={cameraPermission}
            micPermission={micPermission}
            timerCount={timerCount}
            startAnalysis={startAnalysis}
            stopAnalysis={stopAnalysis}
            videoRef={videoRef}
            canvasRef={canvasRef}
            isProcessing={isProcessing}
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
