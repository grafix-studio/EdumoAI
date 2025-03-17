
import React from "react";
import { Button } from "@/components/ui/button";

interface SpeedReadingGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  isFinished: boolean;
}

export default function SpeedReadingGame({ onScore, onComplete, isFinished }: SpeedReadingGameProps) {
  return (
    <div className="text-center p-6">
      <h3 className="text-2xl font-bold mb-4">Speed Reading Exercise</h3>
      <p className="mb-4">Read the text quickly and answer comprehension questions.</p>
      <div className="bg-muted p-8 rounded-lg mb-6 flex items-center justify-center">
        <p className="text-lg">Speed reading exercise will appear here</p>
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
