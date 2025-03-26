
import { Info, AlertCircle, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import EmotionCard from "./EmotionCard";
import RecommendationCard from "./RecommendationCard";

interface AnalysisResultsProps {
  currentEmotion: string | null;
  stressLevel: number;
  engagementLevel: number;
  focusLevel: number;
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
}

export default function AnalysisResults({
  currentEmotion,
  stressLevel,
  engagementLevel,
  focusLevel,
  showInfo,
  setShowInfo
}: AnalysisResultsProps) {
  return (
    <div className="glass-card p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-medium">Emotion Analysis</h3>
          <div className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
            <Server className="w-3 h-3" />
            <span>Face++ API</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info className="w-5 h-5" />
        </Button>
      </div>
      
      {showInfo && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>How it works</AlertTitle>
          <AlertDescription>
            Our system uses Face++ AI technology to analyze facial micro-expressions 
            and detect emotions. The API processes images from your camera to determine
            your emotional state and provides personalized learning recommendations.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Current Emotional State */}
      <div className="grid gap-6">
        <EmotionCard 
          currentEmotion={currentEmotion}
          stressLevel={stressLevel}
          engagementLevel={engagementLevel}
          focusLevel={focusLevel}
        />
        
        {/* Recommendations based on emotional state */}
        {currentEmotion && (
          <RecommendationCard 
            currentEmotion={currentEmotion}
            stressLevel={stressLevel}
          />
        )}
      </div>
    </div>
  );
}
