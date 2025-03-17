
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface MathProblem {
  question: string;
  answer: number;
}

interface MathFluencyGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  isFinished: boolean;
}

export default function MathFluencyGame({ onScore, onComplete, isFinished }: MathFluencyGameProps) {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [streak, setStreak] = useState(0);

  // Generate new problems when the game starts
  useEffect(() => {
    generateProblems();
  }, []);

  // Check if game should complete
  useEffect(() => {
    if (totalAnswered >= 10 && !isFinished) {
      onComplete();
    }
  }, [totalAnswered, onComplete, isFinished]);

  const generateProblems = () => {
    const newProblems: MathProblem[] = [];
    
    // Generate 20 random math problems
    for (let i = 0; i < 20; i++) {
      const problemType = Math.floor(Math.random() * 4);
      let problem: MathProblem;
      
      switch (problemType) {
        case 0: // Addition
          const num1 = Math.floor(Math.random() * 50) + 1;
          const num2 = Math.floor(Math.random() * 50) + 1;
          problem = {
            question: `${num1} + ${num2} = ?`,
            answer: num1 + num2
          };
          break;
        case 1: // Subtraction
          const minuend = Math.floor(Math.random() * 50) + 50;
          const subtrahend = Math.floor(Math.random() * 50) + 1;
          problem = {
            question: `${minuend} - ${subtrahend} = ?`,
            answer: minuend - subtrahend
          };
          break;
        case 2: // Multiplication
          const factor1 = Math.floor(Math.random() * 12) + 1;
          const factor2 = Math.floor(Math.random() * 12) + 1;
          problem = {
            question: `${factor1} × ${factor2} = ?`,
            answer: factor1 * factor2
          };
          break;
        default: // Division (simple ones with whole number answers)
          const divisor = Math.floor(Math.random() * 10) + 1;
          const quotient = Math.floor(Math.random() * 10) + 1;
          const dividend = divisor * quotient;
          problem = {
            question: `${dividend} ÷ ${divisor} = ?`,
            answer: quotient
          };
      }
      
      newProblems.push(problem);
    }
    
    setProblems(newProblems);
    setCurrentProblemIndex(0);
    setUserAnswer("");
    setFeedback("");
    setCorrectAnswers(0);
    setTotalAnswered(0);
    setStreak(0);
  };

  const checkAnswer = () => {
    if (isFinished) return;
    
    const currentProblem = problems[currentProblemIndex];
    const userNumAnswer = parseInt(userAnswer);
    
    if (isNaN(userNumAnswer)) {
      setFeedback("Please enter a valid number.");
      return;
    }
    
    setTotalAnswered(prev => prev + 1);
    
    if (userNumAnswer === currentProblem.answer) {
      // Correct answer
      const newStreak = streak + 1;
      setStreak(newStreak);
      setCorrectAnswers(prev => prev + 1);
      
      // Award points (more for streaks)
      const streakBonus = Math.min(newStreak, 5);
      onScore(5 + streakBonus);
      
      setFeedback(`Correct! ${newStreak > 1 ? `Streak: ${newStreak}` : ''}`);
      
      // Move to next problem
      setTimeout(() => {
        setCurrentProblemIndex(prev => prev + 1);
        setUserAnswer("");
        setFeedback("");
      }, 1000);
    } else {
      // Incorrect answer
      setStreak(0);
      setFeedback(`Incorrect. The answer is ${currentProblem.answer}.`);
      
      // Move to next problem after showing the correct answer
      setTimeout(() => {
        setCurrentProblemIndex(prev => prev + 1);
        setUserAnswer("");
        setFeedback("");
      }, 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6 text-center">
        <p className="text-lg font-medium mb-2">
          Solve math problems as quickly as you can
        </p>
        <p className="text-sm text-muted-foreground">
          Progress: {totalAnswered}/10 | Score: {correctAnswers}/{totalAnswered || 1}
        </p>
      </div>

      {totalAnswered < 10 && currentProblemIndex < problems.length && !isFinished ? (
        <div className="space-y-6">
          <Card className="p-8 text-center">
            <h2 className="text-4xl font-bold mb-4">{problems[currentProblemIndex]?.question}</h2>
          </Card>
          
          <div className="flex gap-2">
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value.replace(/[^0-9-]/g, ''))}
              onKeyDown={handleKeyDown}
              placeholder="Enter your answer..."
              type="number"
              className="text-lg text-center"
              disabled={isFinished}
            />
            <Button onClick={checkAnswer} disabled={isFinished}>Submit</Button>
          </div>
          
          {feedback && (
            <p className={`text-center p-2 rounded ${
              feedback.includes("Correct") ? 
                "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100" : 
              feedback.includes("Incorrect") ? 
                "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100" : 
                "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
            }`}>
              {feedback}
            </p>
          )}
          
          {streak > 2 && (
            <div className="text-center">
              <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 rounded-full text-sm font-medium">
                🔥 Streak: {streak}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-6 bg-muted rounded-lg">
          <h3 className="text-2xl font-bold mb-2">Game Complete!</h3>
          <p className="mb-4">
            You got {correctAnswers} correct out of {totalAnswered} problems.
          </p>
          <Button onClick={generateProblems}>Play Again</Button>
        </div>
      )}
    </div>
  );
}
