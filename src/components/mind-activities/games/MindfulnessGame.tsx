
import React from "react";
import { Button } from "@/components/ui/button";

interface MindfulnessGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  isFinished: boolean;
}

export default function MindfulnessGame({ onScore, onComplete, isFinished }: MindfulnessGameProps) {
  return (
    <div className="text-center p-6">
      <h3 className="text-2xl font-bold mb-4">Mindfulness Session</h3>
      <p className="mb-4">Guided meditation focused on improving attention and cognitive control.</p>
      <div className="bg-muted p-8 rounded-lg mb-6 flex items-center justify-center">
        <p className="text-lg">Mindfulness session content will appear here</p>
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
