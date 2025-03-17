
import React from "react";
import { Button } from "@/components/ui/button";

interface MindWarmupGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  isFinished: boolean;
}

export default function MindWarmupGame({ onScore, onComplete, isFinished }: MindWarmupGameProps) {
  return (
    <div className="text-center p-6">
      <h3 className="text-2xl font-bold mb-4">Today's Mind Warm-up</h3>
      <p className="mb-4">A sequence of exercises to activate different brain areas.</p>
      <div className="bg-muted p-8 rounded-lg mb-6 flex items-center justify-center">
        <p className="text-lg">Mind warm-up sequence will appear here</p>
      </div>
      <Button onClick={() => {
        onScore(50);
        onComplete();
      }}>
        Complete Demo Session
      </Button>
    </div>
  );
}
