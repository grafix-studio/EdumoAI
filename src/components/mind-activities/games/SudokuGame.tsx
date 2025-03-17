
import React from "react";
import { Button } from "@/components/ui/button";

interface SudokuGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  isFinished: boolean;
}

export default function SudokuGame({ onScore, onComplete, isFinished }: SudokuGameProps) {
  return (
    <div className="text-center p-6">
      <h3 className="text-2xl font-bold mb-4">Sudoku Challenge</h3>
      <p className="mb-4">Solve the Sudoku puzzle by filling in the grid.</p>
      <div className="bg-muted p-8 rounded-lg mb-6 flex items-center justify-center">
        <p className="text-lg">Sudoku game board will appear here</p>
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
