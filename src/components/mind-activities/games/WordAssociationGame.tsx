
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { shuffle } from "@/lib/utils";

interface WordPair {
  word: string;
  associations: string[];
}

interface WordAssociationGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  isFinished: boolean;
}

const wordPairs: WordPair[] = [
  { word: "Ocean", associations: ["sea", "water", "beach", "wave", "tide", "blue"] },
  { word: "Book", associations: ["read", "page", "story", "novel", "author", "chapter"] },
  { word: "Tree", associations: ["leaf", "branch", "forest", "plant", "wood", "nature"] },
  { word: "Computer", associations: ["keyboard", "monitor", "screen", "mouse", "technology", "laptop"] },
  { word: "Music", associations: ["song", "sound", "melody", "rhythm", "band", "instrument"] },
  { word: "Food", associations: ["eat", "meal", "dinner", "lunch", "cook", "kitchen"] },
  { word: "Car", associations: ["drive", "road", "wheel", "vehicle", "traffic", "engine"] },
  { word: "City", associations: ["building", "street", "urban", "town", "people", "skyline"] },
  { word: "Sky", associations: ["cloud", "blue", "sun", "star", "bird", "air"] },
  { word: "Phone", associations: ["call", "mobile", "text", "talk", "communication", "device"] },
];

export default function WordAssociationGame({ onScore, onComplete, isFinished }: WordAssociationGameProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [gameWords, setGameWords] = useState<WordPair[]>([]);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [recentCorrect, setRecentCorrect] = useState(false);

  // Initialize game with shuffled words
  useEffect(() => {
    startNewGame();
  }, []);

  // Check game completion
  useEffect(() => {
    if (currentWordIndex >= 5 && !isFinished) {
      onComplete();
    }
  }, [currentWordIndex, onComplete, isFinished]);

  useEffect(() => {
    if (isFinished && currentWordIndex < 5) {
      // Show final results when time runs out
      setFeedback("Time's up! Final score shown above.");
    }
  }, [isFinished, currentWordIndex]);

  const startNewGame = () => {
    // Shuffle word pairs and take first 5
    const shuffledWords = shuffle([...wordPairs]).slice(0, 5);
    setGameWords(shuffledWords);
    setCurrentWordIndex(0);
    setUserInput("");
    setFeedback("");
    setCorrectCount(0);
    setTotalAttempts(0);
  };

  const checkAssociation = () => {
    if (isFinished) return;
    
    const input = userInput.trim().toLowerCase();
    if (input === "") return;
    
    setTotalAttempts(prev => prev + 1);
    
    const currentWord = gameWords[currentWordIndex];
    if (currentWord.associations.includes(input)) {
      // Correct association
      setFeedback("Correct! That's a valid association.");
      setCorrectCount(prev => prev + 1);
      onScore(5);
      setRecentCorrect(true);
      
      // Move to next word after a delay
      setTimeout(() => {
        setCurrentWordIndex(prev => prev + 1);
        setUserInput("");
        setFeedback("");
        setRecentCorrect(false);
      }, 1500);
    } else {
      // Incorrect association
      setFeedback("Try again! Think of a related word.");
      setRecentCorrect(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkAssociation();
    }
  };

  const handleSkip = () => {
    if (isFinished) return;
    
    setFeedback(`Moving to next word. Some valid associations were: ${gameWords[currentWordIndex].associations.slice(0, 3).join(", ")}`);
    setTimeout(() => {
      setCurrentWordIndex(prev => prev + 1);
      setUserInput("");
      setFeedback("");
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6 text-center">
        <p className="text-lg font-medium mb-2">
          Type a word that's associated with the prompt
        </p>
        <p className="text-sm text-muted-foreground">
          Progress: {Math.min(currentWordIndex, 5)}/5 | Correct: {correctCount}/{totalAttempts || 1}
        </p>
      </div>

      {currentWordIndex < 5 && !isFinished ? (
        <div className="space-y-6">
          <Card className="p-6 text-center">
            <h2 className="text-3xl font-bold mb-2">{gameWords[currentWordIndex]?.word}</h2>
            <p className="text-muted-foreground">What word comes to mind?</p>
          </Card>
          
          <div className="flex gap-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type an associated word..."
              className={recentCorrect ? "border-green-500" : ""}
              disabled={isFinished}
            />
            <Button onClick={checkAssociation} disabled={isFinished}>Submit</Button>
          </div>
          
          {feedback && (
            <p className={`text-center p-2 rounded ${
              feedback.includes("Correct") ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100" : 
              feedback.includes("Try again") ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100" :
              "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
            }`}>
              {feedback}
            </p>
          )}
          
          <div className="text-center">
            <Button variant="outline" onClick={handleSkip} disabled={isFinished}>
              Skip this word
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 bg-muted rounded-lg">
          <h3 className="text-2xl font-bold mb-2">Game Complete!</h3>
          <p className="mb-4">
            You got {correctCount} correct associations out of {totalAttempts} attempts.
          </p>
          <Button onClick={startNewGame}>Play Again</Button>
        </div>
      )}
    </div>
  );
}
