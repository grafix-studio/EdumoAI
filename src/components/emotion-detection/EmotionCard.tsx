
import { Smile, Frown, Meh, Brain, AlertTriangle, HeartCrack } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EmotionCardProps {
  currentEmotion: string | null;
  stressLevel: number;
  engagementLevel: number;
  focusLevel: number;
}

export default function EmotionCard({ 
  currentEmotion, 
  stressLevel, 
  engagementLevel, 
  focusLevel 
}: EmotionCardProps) {
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
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "sad":
        return "bg-warning/20 text-warning border-warning/30";
      case "bored":
        return "bg-orange-500/20 text-orange-500 border-orange-500/30";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Current State</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {currentEmotion ? (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getEmotionColor(currentEmotion)}`}>
              {currentEmotion === "happy" && <Smile className="w-4 h-4" />}
              {currentEmotion === "sad" && <Frown className="w-4 h-4" />}
              {currentEmotion === "neutral" && <Meh className="w-4 h-4" />}
              {currentEmotion === "focused" && <Brain className="w-4 h-4" />}
              {currentEmotion === "confused" && <AlertTriangle className="w-4 h-4" />}
              {currentEmotion === "stressed" && <HeartCrack className="w-4 h-4" />}
              {currentEmotion === "bored" && <Meh className="w-4 h-4" />}
              {currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}
            </div>
          ) : (
            <div className="text-muted-foreground italic">Not analyzing</div>
          )}
          
          <div className="grid gap-2">
            <div className="flex justify-between text-sm">
              <span>Stress Level</span>
              <span>{stressLevel}%</span>
            </div>
            <Progress value={stressLevel} className="h-2" />
            
            <div className="flex justify-between text-sm">
              <span>Engagement</span>
              <span>{engagementLevel}%</span>
            </div>
            <Progress value={engagementLevel} className="h-2" />
            
            <div className="flex justify-between text-sm">
              <span>Focus</span>
              <span>{focusLevel}%</span>
            </div>
            <Progress value={focusLevel} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
