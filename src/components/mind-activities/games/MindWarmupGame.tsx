
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

interface MindWarmupGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  isFinished: boolean;
}

export default function MindWarmupGame({ onScore, onComplete, isFinished }: MindWarmupGameProps) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [exerciseComplete, setExerciseComplete] = useState(false);
  
  // Word Recall Exercise
  const [wordRecallPhase, setWordRecallPhase] = useState<'learning' | 'recall'>('learning');
  const [wordRecallWords, setWordRecallWords] = useState<string[]>([]);
  const [wordRecallInput, setWordRecallInput] = useState<string>('');
  const [wordRecallCorrect, setWordRecallCorrect] = useState<string[]>([]);
  const [wordRecallTimeLeft, setWordRecallTimeLeft] = useState(30);
  
  // Mental Math Exercise
  const [mathProblem, setMathProblem] = useState<{num1: number, num2: number, operation: string}>({num1: 0, num2: 0, operation: '+'});
  const [mathAnswer, setMathAnswer] = useState<string>('');
  const [mathCorrect, setMathCorrect] = useState(0);
  const [mathTotal, setMathTotal] = useState(0);
  const [mathTimeLeft, setMathTimeLeft] = useState(30);
  
  // Visual Patterns Exercise
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [patternLevel, setPatternLevel] = useState(3);
  const [showingPattern, setShowingPattern] = useState(false);
  const [patternScore, setPatternScore] = useState(0);
  
  useEffect(() => {
    if (isFinished) {
      completeAllExercises();
    }
  }, [isFinished]);
  
  useEffect(() => {
    if (!started) return;
    
    if (currentExercise === 0) {
      initWordRecall();
    } else if (currentExercise === 1) {
      initMentalMath();
    } else if (currentExercise === 2) {
      initVisualPatterns();
    }
  }, [currentExercise, started]);
  
  // Word Recall Exercise Logic
  const initWordRecall = () => {
    // List of words to recall
    const words = [
      "apple", "sunset", "bicycle", "harmony", "elephant", 
      "calendar", "mountain", "telescope", "butterfly", "symphony",
      "adventure", "universe", "chocolate", "monument", "whisper"
    ];
    
    // Randomly select 10 words
    const selectedWords = words.sort(() => 0.5 - Math.random()).slice(0, 10);
    setWordRecallWords(selectedWords);
    setWordRecallPhase('learning');
    setWordRecallTimeLeft(30);
    
    // After 30 seconds, switch to recall phase
    const timer = setInterval(() => {
      setWordRecallTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setWordRecallPhase('recall');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  };
  
  const handleWordRecallSubmit = () => {
    const word = wordRecallInput.trim().toLowerCase();
    
    if (word && wordRecallWords.includes(word) && !wordRecallCorrect.includes(word)) {
      setWordRecallCorrect(prev => [...prev, word]);
      setWordRecallInput('');
      toast.success("Word remembered correctly!");
    } else if (wordRecallCorrect.includes(word)) {
      toast.error("You already entered this word");
      setWordRecallInput('');
    } else {
      toast.error("That word wasn't in the list");
      setWordRecallInput('');
    }
    
    // Complete exercise when all words are recalled or user gives up
    if (wordRecallCorrect.length + 1 >= wordRecallWords.length) {
      completeCurrentExercise(wordRecallCorrect.length * 10);
    }
  };
  
  const completeWordRecall = () => {
    const exerciseScore = wordRecallCorrect.length * 10;
    completeCurrentExercise(exerciseScore);
  };
  
  // Mental Math Exercise Logic
  const initMentalMath = () => {
    generateMathProblem();
    setMathCorrect(0);
    setMathTotal(0);
    setMathTimeLeft(30);
    
    // 30-second timer for mental math
    const timer = setInterval(() => {
      setMathTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          completeMentalMath();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  };
  
  const generateMathProblem = () => {
    const operations = ['+', '-', '×', '÷'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2;
    
    if (operation === '+') {
      num1 = Math.floor(Math.random() * 50) + 10;
      num2 = Math.floor(Math.random() * 50) + 10;
    } else if (operation === '-') {
      num1 = Math.floor(Math.random() * 50) + 30;
      num2 = Math.floor(Math.random() * 30);
    } else if (operation === '×') {
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
    } else { // Division
      num2 = Math.floor(Math.random() * 10) + 1;
      num1 = num2 * (Math.floor(Math.random() * 10) + 1);
    }
    
    setMathProblem({ num1, num2, operation });
    setMathAnswer('');
  };
  
  const checkMathAnswer = () => {
    let correctAnswer;
    
    if (mathProblem.operation === '+') {
      correctAnswer = mathProblem.num1 + mathProblem.num2;
    } else if (mathProblem.operation === '-') {
      correctAnswer = mathProblem.num1 - mathProblem.num2;
    } else if (mathProblem.operation === '×') {
      correctAnswer = mathProblem.num1 * mathProblem.num2;
    } else { // Division
      correctAnswer = mathProblem.num1 / mathProblem.num2;
    }
    
    const userAnswer = parseInt(mathAnswer);
    const isCorrect = userAnswer === correctAnswer;
    
    if (isCorrect) {
      setMathCorrect(prev => prev + 1);
      toast.success("Correct answer!");
    } else {
      toast.error(`Incorrect. The answer was ${correctAnswer}`);
    }
    
    setMathTotal(prev => prev + 1);
    generateMathProblem();
  };
  
  const completeMentalMath = () => {
    const exerciseScore = Math.round((mathCorrect / Math.max(mathTotal, 1)) * 100);
    completeCurrentExercise(exerciseScore);
  };
  
  // Visual Patterns Exercise Logic
  const initVisualPatterns = () => {
    generatePattern();
  };
  
  const generatePattern = () => {
    const newPattern = [];
    for (let i = 0; i < patternLevel; i++) {
      newPattern.push(Math.floor(Math.random() * 9));
    }
    
    setPattern(newPattern);
    setUserPattern([]);
    setShowingPattern(true);
    
    // Show pattern for 1 second per item
    setTimeout(() => {
      setShowingPattern(false);
    }, patternLevel * 1000);
  };
  
  const handlePatternClick = (index: number) => {
    if (showingPattern) return;
    
    const newUserPattern = [...userPattern, index];
    setUserPattern(newUserPattern);
    
    // Check if pattern is complete
    if (newUserPattern.length === pattern.length) {
      checkPattern(newUserPattern);
    }
  };
  
  const checkPattern = (userPatternInput: number[]) => {
    let correct = true;
    
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] !== userPatternInput[i]) {
        correct = false;
        break;
      }
    }
    
    if (correct) {
      toast.success("Pattern correct!");
      setPatternScore(prev => prev + patternLevel * 10);
      setPatternLevel(prev => Math.min(prev + 1, 7));
      
      // Generate a new pattern after a short delay
      setTimeout(() => {
        generatePattern();
      }, 1000);
    } else {
      toast.error("Pattern incorrect!");
      setPatternLevel(prev => Math.max(prev - 1, 3));
      
      // Show the correct pattern briefly
      setShowingPattern(true);
      setTimeout(() => {
        setShowingPattern(false);
        generatePattern();
      }, 2000);
    }
  };
  
  const completeVisualPatterns = () => {
    const exerciseScore = patternScore;
    completeCurrentExercise(exerciseScore);
  };
  
  // Generic exercise functions
  const completeCurrentExercise = (exerciseScore: number) => {
    setExerciseComplete(true);
    setScore(prev => prev + exerciseScore);
    onScore(exerciseScore);
  };
  
  const moveToNextExercise = () => {
    setExerciseComplete(false);
    
    if (currentExercise < 2) {
      setCurrentExercise(prev => prev + 1);
    } else {
      completeAllExercises();
    }
  };
  
  const completeAllExercises = () => {
    onComplete();
  };
  
  const startExercises = () => {
    setStarted(true);
  };
  
  // Render the appropriate exercise
  const renderExercise = () => {
    if (!started) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Mind Warm-up Challenge</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">This daily challenge consists of three short exercises:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Word Recall - Memorize and recall a list of words</li>
              <li>Mental Math - Solve math problems quickly</li>
              <li>Visual Patterns - Remember and reproduce visual sequences</li>
            </ol>
          </CardContent>
          <CardFooter>
            <Button onClick={startExercises} className="w-full">
              Start Challenge
            </Button>
          </CardFooter>
        </Card>
      );
    }
    
    if (exerciseComplete) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Exercise Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xl font-bold mb-2">Great job!</p>
            <p className="mb-4">You've completed exercise {currentExercise + 1} of 3.</p>
            {currentExercise < 2 ? (
              <p>Get ready for the next exercise: {currentExercise === 0 ? "Mental Math" : "Visual Patterns"}</p>
            ) : (
              <p>You've completed all exercises!</p>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={moveToNextExercise} className="w-full">
              {currentExercise < 2 ? (
                <span className="flex items-center">
                  Continue to Next Exercise
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              ) : (
                "Complete Challenge"
              )}
            </Button>
          </CardFooter>
        </Card>
      );
    }
    
    switch (currentExercise) {
      case 0: // Word Recall
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Exercise 1: Word Recall</span>
                {wordRecallPhase === 'learning' && (
                  <span className="text-sm font-normal">Time: {wordRecallTimeLeft}s</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {wordRecallPhase === 'learning' ? (
                <>
                  <p className="mb-4">Memorize these words:</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {wordRecallWords.map((word, index) => (
                      <div key={index} className="bg-secondary/20 p-3 rounded-md text-center">
                        {word}
                      </div>
                    ))}
                  </div>
                  <Progress value={(wordRecallTimeLeft / 30) * 100} className="mt-4" />
                </>
              ) : (
                <>
                  <p className="mb-4">Type as many words as you can remember:</p>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={wordRecallInput}
                      onChange={(e) => setWordRecallInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleWordRecallSubmit()}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Type a word and press Enter"
                    />
                    <Button onClick={handleWordRecallSubmit}>Submit</Button>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Words recalled:</span>
                    <span className="font-bold">{wordRecallCorrect.length} / {wordRecallWords.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {wordRecallCorrect.map((word, index) => (
                      <div key={index} className="bg-primary/20 px-3 py-1 rounded-full text-sm">
                        {word}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              {wordRecallPhase === 'recall' && (
                <Button onClick={completeWordRecall} className="w-full">
                  Complete Exercise
                </Button>
              )}
            </CardFooter>
          </Card>
        );
        
      case 1: // Mental Math
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Exercise 2: Mental Math</span>
                <span className="text-sm font-normal">Time: {mathTimeLeft}s</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <p className="text-3xl font-bold mb-6">
                  {mathProblem.num1} {mathProblem.operation} {mathProblem.num2} = ?
                </p>
                <div className="flex gap-2 max-w-sm mx-auto">
                  <input
                    type="number"
                    value={mathAnswer}
                    onChange={(e) => setMathAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && checkMathAnswer()}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Your answer"
                  />
                  <Button onClick={checkMathAnswer}>Submit</Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Problems solved:</span>
                <span className="font-bold">{mathTotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Correct answers:</span>
                <span className="font-bold">{mathCorrect}</span>
              </div>
              <Progress value={(mathTimeLeft / 30) * 100} className="mt-4" />
            </CardContent>
          </Card>
        );
        
      case 2: // Visual Patterns
        return (
          <Card>
            <CardHeader>
              <CardTitle>Exercise 3: Visual Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                {showingPattern 
                  ? "Memorize this pattern!" 
                  : "Reproduce the pattern you just saw."}
              </p>
              <div className="grid grid-cols-3 grid-rows-3 gap-2 max-w-xs mx-auto mb-4">
                {Array.from({ length: 9 }).map((_, index) => (
                  <button
                    key={index}
                    className={`aspect-square rounded-md ${
                      showingPattern && pattern.includes(index)
                        ? "bg-primary"
                        : userPattern.includes(index) && !showingPattern
                        ? "bg-secondary"
                        : "bg-muted"
                    }`}
                    onClick={() => handlePatternClick(index)}
                    disabled={showingPattern}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span>Level:</span>
                <span className="font-bold">{patternLevel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Score:</span>
                <span className="font-bold">{patternScore}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={completeVisualPatterns} className="w-full">
                Complete Exercise
              </Button>
            </CardFooter>
          </Card>
        );
        
      default:
        return null;
    }
  };
  
  return <div className="flex flex-col gap-4">{renderExercise()}</div>;
}
