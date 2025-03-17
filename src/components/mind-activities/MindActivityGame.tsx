
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import MemoryMatchGame from "./games/MemoryMatchGame";
import SudokuGame from "./games/SudokuGame";
import WordAssociationGame from "./games/WordAssociationGame";
import PatternRecognitionGame from "./games/PatternRecognitionGame";
import DualNBackGame from "./games/DualNBackGame";
import SpeedReadingGame from "./games/SpeedReadingGame";
import CriticalThinkingGame from "./games/CriticalThinkingGame";
import MathFluencyGame from "./games/MathFluencyGame";
import MindWarmupGame from "./games/MindWarmupGame";
import MindfulnessGame from "./games/MindfulnessGame";
import GameScore from "./GameScore";

interface MindActivityGameProps {
  id: string;
  type: "puzzle" | "exercise" | "daily";
  difficulty?: string;
}

export default function MindActivityGame({ id, type, difficulty }: MindActivityGameProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Set time based on difficulty and game type
    let initialTime = 60;
    if (difficulty === "Beginner") initialTime = 60;
    else if (difficulty === "Intermediate") initialTime = 120;
    else if (difficulty === "Advanced") initialTime = 180;
    
    // Daily challenges have fixed times
    if (type === "daily") initialTime = 300;
    
    setTimeLeft(initialTime);
    
    // Start countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isFinished) {
            setIsFinished(true);
            toast.info("Time's up! Game completed.");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [difficulty, type, isFinished]);

  const handleScoreUpdate = (points: number) => {
    setScore((prevScore) => prevScore + points);
  };

  const handleGameComplete = () => {
    setIsFinished(true);
    toast.success("Game completed successfully!");
  };

  // Render the appropriate game component based on the id
  const renderGame = () => {
    switch (id) {
      case "memory-match":
        return <MemoryMatchGame 
          onScore={handleScoreUpdate} 
          onComplete={handleGameComplete}
          isFinished={isFinished} 
        />;
      case "sudoku":
        return <SudokuGame 
          onScore={handleScoreUpdate} 
          onComplete={handleGameComplete}
          isFinished={isFinished} 
        />;
      case "word-association":
        return <WordAssociationGame 
          onScore={handleScoreUpdate} 
          onComplete={handleGameComplete}
          isFinished={isFinished} 
        />;
      case "pattern-recognition":
        return <PatternRecognitionGame 
          onScore={handleScoreUpdate} 
          onComplete={handleGameComplete}
          isFinished={isFinished} 
        />;
      case "dual-n-back":
        return <DualNBackGame 
          onScore={handleScoreUpdate} 
          onComplete={handleGameComplete}
          isFinished={isFinished} 
        />;
      case "speed-reading":
        return <SpeedReadingGame 
          onScore={handleScoreUpdate} 
          onComplete={handleGameComplete}
          isFinished={isFinished} 
        />;
      case "critical-thinking":
        return <CriticalThinkingGame 
          onScore={handleScoreUpdate} 
          onComplete={handleGameComplete}
          isFinished={isFinished} 
        />;
      case "math-fluency":
        return <MathFluencyGame 
          onScore={handleScoreUpdate} 
          onComplete={handleGameComplete}
          isFinished={isFinished} 
        />;
      case "mind-warmup":
        return <MindWarmupGame 
          onScore={handleScoreUpdate} 
          onComplete={handleGameComplete}
          isFinished={isFinished} 
        />;
      case "mindfulness":
        return <MindfulnessGame 
          onScore={handleScoreUpdate} 
          onComplete={handleGameComplete}
          isFinished={isFinished} 
        />;
      default:
        return <div className="p-8 text-center">Game not found</div>;
    }
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <GameScore score={score} timeLeft={timeLeft} />
      <div className="mt-6">
        {renderGame()}
      </div>
    </div>
  );
}
