
import React from "react";
import { Brain, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GameScoreProps {
  score: number;
  timeLeft: number;
}

export default function GameScore({ score, timeLeft }: GameScoreProps) {
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Trophy className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">Score</h3>
          <p className="text-2xl font-bold">{score}</p>
        </div>
      </div>

      <div className="w-full sm:w-1/2">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Time Remaining</span>
          <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
        </div>
        <Progress value={(timeLeft / 300) * 100} className="h-2" />
      </div>
    </div>
  );
}
