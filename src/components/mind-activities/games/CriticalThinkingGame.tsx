
import React from "react";
import { Button } from "@/components/ui/button";

interface CriticalThinkingGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  isFinished: boolean;
}

export default function CriticalThinkingGame({ onScore, onComplete, isFinished }: CriticalThinkingGameProps) {
  return (
    <div className="text-center p-6">
      <h3 className="text-2xl font-bold mb-4">Critical Thinking Scenarios</h3>
      <p className="mb-4">Analyze complex scenarios and make logical decisions.</p>
      <div className="bg-muted p-8 rounded-lg mb-6 flex items-center justify-center">
        <p className="text-lg">Critical thinking scenarios will appear here</p>
      </div>
      <Button onClick={() => {
        onScore(50);
        onComplete();
      }}>
        Complete Demo Game
      </Button>
    </div>
  );
}
