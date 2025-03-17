
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface PatternQuestion {
  sequence: (number | string)[];
  options: (number | string)[];
  correctAnswer: number | string;
}

interface PatternRecognitionGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  isFinished: boolean;
}

export default function PatternRecognitionGame({ onScore, onComplete, isFinished }: PatternRecognitionGameProps) {
  const [questions, setQuestions] = useState<PatternQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  // Generate questions on component mount
  useEffect(() => {
    generateQuestions();
  }, []);

  // Check if game should complete
  useEffect(() => {
    if (totalAnswered >= 5 && !isFinished) {
      onComplete();
    }
  }, [totalAnswered, onComplete, isFinished]);

  // Generate pattern recognition questions
  const generateQuestions = () => {
    const newQuestions: PatternQuestion[] = [];
    
    // Arithmetic sequence (e.g., 2, 4, 6, 8, ?)
    const arithmeticSequence = () => {
      const start = Math.floor(Math.random() * 5) + 1;
      const increment = Math.floor(Math.random() * 5) + 1;
      const sequence = Array.from({ length: 4 }, (_, i) => start + i * increment);
      const nextNumber = start + 4 * increment;
      
      // Generate wrong options
      const wrongOptions = [
        nextNumber - increment,
        nextNumber + 1,
        nextNumber + increment,
        nextNumber * 2
      ].filter(option => option !== nextNumber);
      
      // Shuffle and take first 3 wrong options
      const options = [nextNumber, ...wrongOptions.slice(0, 3)].sort(() => Math.random() - 0.5);
      
      return {
        sequence,
        options,
        correctAnswer: nextNumber
      };
    };
    
    // Geometric sequence (e.g., 2, 4, 8, 16, ?)
    const geometricSequence = () => {
      const start = Math.floor(Math.random() * 3) + 2;
      const ratio = Math.floor(Math.random() * 2) + 2;
      const sequence = Array.from({ length: 4 }, (_, i) => start * Math.pow(ratio, i));
      const nextNumber = start * Math.pow(ratio, 4);
      
      // Generate wrong options
      const wrongOptions = [
        nextNumber / ratio,
        nextNumber + ratio,
        nextNumber + sequence[3],
        sequence[3] * 2
      ].filter(option => option !== nextNumber);
      
      // Shuffle and take first 3 wrong options
      const options = [nextNumber, ...wrongOptions.slice(0, 3)].sort(() => Math.random() - 0.5);
      
      return {
        sequence,
        options,
        correctAnswer: nextNumber
      };
    };
    
    // Alternating pattern (e.g., A, 1, B, 2, ?)
    const alternatingPattern = () => {
      const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
      const pattern = Math.floor(Math.random() * 3);
      
      let sequence: (number | string)[] = [];
      let nextValue: number | string;
      
      if (pattern === 0) { // Letter, Number
        sequence = [letters[0], 1, letters[1], 2];
        nextValue = letters[2];
      } else if (pattern === 1) { // Number, Letter
        sequence = [1, letters[0], 2, letters[1]];
        nextValue = 3;
      } else { // Ascending letters
        sequence = letters.slice(0, 4);
        nextValue = letters[4];
      }
      
      // Generate wrong options
      let wrongOptions: (number | string)[] = [];
      
      if (typeof nextValue === 'string') {
        wrongOptions = letters
          .filter(letter => letter !== nextValue)
          .slice(0, 3);
      } else {
        wrongOptions = [nextValue + 1, nextValue - 1, nextValue * 2]
          .filter(num => num !== nextValue && num > 0);
      }
      
      // Shuffle and create options
      const options = [nextValue, ...wrongOptions].sort(() => Math.random() - 0.5);
      
      return {
        sequence,
        options,
        correctAnswer: nextValue
      };
    };
    
    // Create 5 questions using different patterns
    const questionGenerators = [
      arithmeticSequence,
      geometricSequence,
      alternatingPattern,
      arithmeticSequence,
      geometricSequence
    ];
    
    questionGenerators.forEach(generator => {
      newQuestions.push(generator());
    });
    
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback("");
    setCorrectAnswers(0);
    setTotalAnswered(0);
  };

  const checkAnswer = () => {
    if (isFinished || selectedAnswer === null) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    setTotalAnswered(prev => prev + 1);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      // Correct answer
      setCorrectAnswers(prev => prev + 1);
      onScore(10);
      setFeedback("Correct! That's the right pattern.");
    } else {
      // Incorrect answer
      setFeedback(`Incorrect. The next value in the pattern is ${currentQuestion.correctAnswer}.`);
    }
    
    // Move to next question after delay
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setFeedback("");
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6 text-center">
        <p className="text-lg font-medium mb-2">
          Identify the next item in the pattern
        </p>
        <p className="text-sm text-muted-foreground">
          Progress: {totalAnswered}/5 | Score: {correctAnswers}/{totalAnswered || 1}
        </p>
      </div>

      {currentQuestionIndex < questions.length && totalAnswered < 5 && !isFinished ? (
        <div className="space-y-6">
          <Card className="p-8">
            <div className="flex justify-center items-center gap-4 mb-6">
              {questions[currentQuestionIndex]?.sequence.map((item, index) => (
                <div key={index} className="h-16 w-16 flex items-center justify-center text-2xl font-bold bg-secondary/20 rounded-lg">
                  {item}
                </div>
              ))}
              <div className="h-16 w-16 flex items-center justify-center text-2xl font-bold bg-primary/20 rounded-lg">
                ?
              </div>
            </div>
            
            <div className="text-center mb-4">
              <p className="text-lg">What comes next in the pattern?</p>
            </div>
            
            <ToggleGroup 
              type="single" 
              value={selectedAnswer?.toString()} 
              onValueChange={(value) => setSelectedAnswer(value === '' ? null : 
                isNaN(Number(value)) ? value : Number(value))}
              className="flex flex-wrap justify-center gap-3"
              disabled={isFinished}
            >
              {questions[currentQuestionIndex]?.options.map((option, index) => (
                <ToggleGroupItem
                  key={index}
                  value={option.toString()}
                  className="h-14 w-14 text-xl"
                >
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Card>
          
          <div className="text-center">
            <Button 
              onClick={checkAnswer} 
              disabled={selectedAnswer === null || isFinished}
              size="lg"
            >
              Submit Answer
            </Button>
          </div>
          
          {feedback && (
            <p className={`text-center p-3 rounded ${
              feedback.includes("Correct") ? 
                "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100" : 
                "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100"
            }`}>
              {feedback}
            </p>
          )}
        </div>
      ) : (
        <div className="text-center p-6 bg-muted rounded-lg">
          <h3 className="text-2xl font-bold mb-2">Pattern Recognition Complete!</h3>
          <p className="mb-4">
            You identified {correctAnswers} out of {totalAnswered} patterns correctly.
          </p>
          <Button onClick={generateQuestions}>Play Again</Button>
        </div>
      )}
    </div>
  );
}
