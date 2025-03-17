
import React from "react";
import { Button } from "@/components/ui/button";

interface DualNBackGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  isFinished: boolean;
}

export default function DualNBackGame({ onScore, onComplete, isFinished }: DualNBackGameProps) {
  return (
    <div className="text-center p-6">
      <h3 className="text-2xl font-bold mb-4">Dual N-Back Training</h3>
      <p className="mb-4">Focus on both visual and auditory stimuli and identify matches.</p>
      <div className="bg-muted p-8 rounded-lg mb-6 flex items-center justify-center">
        <p className="text-lg">Dual N-Back game will appear here</p>
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
