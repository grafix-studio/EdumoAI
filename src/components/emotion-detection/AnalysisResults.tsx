
import { Info, AlertCircle } from "lucide-react";
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
        <h3 className="text-xl font-medium">Emotion Analysis</h3>
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
            Our AI analyzes facial micro-expressions and voice patterns to detect emotions.
            This helps provide personalized learning recommendations based on your current
            emotional state.
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
