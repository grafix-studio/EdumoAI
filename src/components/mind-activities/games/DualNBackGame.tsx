
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface DualNBackGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  isFinished: boolean;
}

export default function DualNBackGame({ onScore, onComplete, isFinished }: DualNBackGameProps) {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  
  const [nBack, setNBack] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSequence, setCurrentSequence] = useState<{letter: string, position: number}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [showingStimulus, setShowingStimulus] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  
  const [positionMatches, setPositionMatches] = useState<boolean[]>([]);
  const [letterMatches, setLetterMatches] = useState<boolean[]>([]);
  const [userPositionResponses, setUserPositionResponses] = useState<boolean[]>([]);
  const [userLetterResponses, setUserLetterResponses] = useState<boolean[]>([]);
  
  const sequenceLength = 10 + nBack; // Sequence length increases with difficulty
  const stimulusInterval = 3000 - (nBack * 200); // Faster with higher n-back
  const stimulusDuration = 500; // ms to show the stimulus
  
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (isFinished && !gameComplete) {
      endGame();
    }
  }, [isFinished]);
  
  // Generate a new sequence for the game
  const generateSequence = () => {
    const newSequence: {letter: string, position: number}[] = [];
    const newPositionMatches: boolean[] = [];
    const newLetterMatches: boolean[] = [];
    
    // Make sure we have enough items in the sequence
    for (let i = 0; i < sequenceLength; i++) {
      // Determine if this should be a match (with some probability)
      const shouldMatchPosition = i >= nBack && Math.random() < 0.3;
      const shouldMatchLetter = i >= nBack && Math.random() < 0.3;
      
      let letter, position;
      
      if (shouldMatchPosition) {
        // Position match: use the position from n steps back
        position = newSequence[i - nBack].position;
        newPositionMatches[i] = true;
      } else {
        // No match: choose a random position
        position = positions[Math.floor(Math.random() * positions.length)];
        newPositionMatches[i] = false;
      }
      
      if (shouldMatchLetter) {
        // Letter match: use the letter from n steps back
        letter = newSequence[i - nBack].letter;
        newLetterMatches[i] = true;
      } else {
        // No match: choose a random letter
        letter = letters[Math.floor(Math.random() * letters.length)];
        newLetterMatches[i] = false;
      }
      
      newSequence.push({ letter, position });
    }
    
    setCurrentSequence(newSequence);
    setPositionMatches(newPositionMatches);
    setLetterMatches(newLetterMatches);
    setUserPositionResponses(new Array(sequenceLength).fill(false));
    setUserLetterResponses(new Array(sequenceLength).fill(false));
  };
  
  // Start a new round
  const startRound = () => {
    generateSequence();
    setCurrentIndex(-1);
    setShowingStimulus(false);
    setIsPlaying(true);
    
    // Start the stimulus presentation
    nextStimulus();
  };
  
  // Show the next stimulus in the sequence
  const nextStimulus = () => {
    if (currentIndex + 1 < sequenceLength) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setShowingStimulus(true);
      
      // Hide the stimulus after stimulusDuration
      setTimeout(() => {
        setShowingStimulus(false);
      }, stimulusDuration);
      
      // Schedule the next stimulus
      intervalRef.current = window.setTimeout(() => {
        nextStimulus();
      }, stimulusInterval);
    } else {
      // Round complete
      calculateScore();
      
      if (round < 3) {
        // Prepare for next round
        setRound(prev => prev + 1);
        toast.info(`Round ${round} complete! Starting next round...`);
        startRound();
      } else {
        // Game complete
        endGame();
      }
    }
  };
  
  // Calculate the score for the current round
  const calculateScore = () => {
    let roundScore = 0;
    let correctPositions = 0;
    let correctLetters = 0;
    
    // Only consider responses after the nth position
    for (let i = nBack; i < sequenceLength; i++) {
      // Check position matches
      if (positionMatches[i] === userPositionResponses[i]) {
        correctPositions++;
      }
      
      // Check letter matches
      if (letterMatches[i] === userLetterResponses[i]) {
        correctLetters++;
      }
    }
    
    // Calculate total score - more points for higher n-back
    roundScore = (correctPositions + correctLetters) * 5 * nBack;
    
    // Update total score
    setScore(prev => prev + roundScore);
    onScore(roundScore);
    
    return roundScore;
  };
  
  // Handle user response for position match
  const handlePositionResponse = () => {
    if (!isPlaying || currentIndex < nBack) return;
    
    const updatedResponses = [...userPositionResponses];
    updatedResponses[currentIndex] = true;
    setUserPositionResponses(updatedResponses);
    
    // Visual feedback
    toast.info("Position match registered");
  };
  
  // Handle user response for letter match
  const handleLetterResponse = () => {
    if (!isPlaying || currentIndex < nBack) return;
    
    const updatedResponses = [...userLetterResponses];
    updatedResponses[currentIndex] = true;
    setUserLetterResponses(updatedResponses);
    
    // Visual feedback
    toast.info("Letter match registered");
  };
  
  // End the game and calculate final score
  const endGame = () => {
    // Clear any pending timeouts
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsPlaying(false);
    setGameComplete(true);
    
    // Calculate final score
    const finalScore = score + calculateScore();
    onComplete();
    
    toast.success(`Game complete! Final score: ${finalScore}`);
  };
  
  // Increase n-back level
  const increaseLevel = () => {
    if (nBack < 3) {
      setNBack(prev => prev + 1);
      toast.info(`Difficulty increased: ${nBack + 1}-back`);
    }
  };
  
  // Decrease n-back level
  const decreaseLevel = () => {
    if (nBack > 1) {
      setNBack(prev => prev - 1);
      toast.info(`Difficulty reduced: ${nBack - 1}-back`);
    }
  };
  
  // Get the grid position from the position index
  const getGridPosition = (position: number) => {
    const row = Math.floor(position / 3);
    const col = position % 3;
    return `row-start-${row + 1} col-start-${col + 1}`;
  };
  
  // Render the grid with the current stimulus
  const renderGrid = () => {
    const grid = [];
    
    for (let i = 0; i < 9; i++) {
      grid.push(
        <div
          key={i}
          className={`aspect-square border border-border flex items-center justify-center text-2xl font-bold ${
            showingStimulus && currentSequence[currentIndex]?.position === i
              ? "bg-primary text-primary-foreground"
              : "bg-muted/30"
          }`}
        >
          {showingStimulus && currentSequence[currentIndex]?.position === i
            ? currentSequence[currentIndex]?.letter
            : ""}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full max-w-xs mx-auto">
        {grid}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>Dual {nBack}-Back Training</span>
            <div className="text-sm font-normal bg-primary/10 px-3 py-1 rounded-full">
              Round {round}/3
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isPlaying && !gameComplete ? (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Watch for repeating positions and letters that appeared exactly {nBack} steps back in the sequence. 
                  Press the corresponding button when you detect a match.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-center items-center gap-4 my-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseLevel}
                  disabled={nBack <= 1}
                >
                  Easier
                </Button>
                <div className="font-bold">{nBack}-Back</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increaseLevel}
                  disabled={nBack >= 3}
                >
                  Harder
                </Button>
              </div>
            </div>
          ) : gameComplete ? (
            <div className="text-center py-8 space-y-4">
              <h3 className="text-xl font-bold">Game Complete!</h3>
              <p>Your final score: {score}</p>
              <Button onClick={onComplete}>Continue</Button>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              {renderGrid()}
              
              <div className="flex justify-center items-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handlePositionResponse}
                  disabled={!isPlaying || currentIndex < nBack}
                >
                  Position Match
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleLetterResponse}
                  disabled={!isPlaying || currentIndex < nBack}
                >
                  Letter Match
                </Button>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                Press when you see a match with {nBack} steps ago
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!isPlaying && !gameComplete && (
            <Button onClick={startRound} className="w-full">
              Start Game
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
