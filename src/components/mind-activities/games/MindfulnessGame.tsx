
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Pause, Play } from "lucide-react";

interface MindfulnessGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  isFinished: boolean;
}

export default function MindfulnessGame({ onScore, onComplete, isFinished }: MindfulnessGameProps) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const [score, setScore] = useState(0);
  
  const intervalRef = useRef<number | null>(null);
  const totalTime = useRef(0);
  const elapsedTime = useRef(0);
  
  const exercises = [
    {
      name: "Focused Attention",
      description: "Concentrate on your breath. Notice the sensation of breathing in and out. When your mind wanders, gently bring it back to your breath.",
      duration: 120, // 2 minutes
      instructions: [
        "Sit comfortably with your back straight",
        "Close your eyes or maintain a soft gaze",
        "Focus your attention on the sensation of breathing",
        "Notice the rise and fall of your chest",
        "When your mind wanders, gently return focus to your breath"
      ]
    },
    {
      name: "Open Monitoring",
      description: "Observe your thoughts, feelings, and sensations without judgment. Notice them arise and pass away like clouds in the sky.",
      duration: 120, // 2 minutes
      instructions: [
        "Sit comfortably with your eyes closed",
        "Begin by focusing on your breath for a few moments",
        "Expand your awareness to include all sensations, thoughts, and emotions",
        "Observe each experience without judgment",
        "Let thoughts and feelings come and go like clouds in the sky"
      ]
    },
    {
      name: "Visualization",
      description: "Imagine a peaceful scene in vivid detail. Engage all your senses to make the experience as rich as possible.",
      duration: 120, // 2 minutes
      instructions: [
        "Close your eyes and take a few deep breaths",
        "Imagine yourself in a peaceful natural setting",
        "Notice the colors, shapes, and textures around you",
        "Hear the ambient sounds of this peaceful place",
        "Feel the temperature, breeze, or other sensations"
      ]
    }
  ];
  
  useEffect(() => {
    if (isFinished && !complete) {
      completeAllExercises();
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isFinished]);
  
  useEffect(() => {
    if (started && !paused && !complete) {
      startTimer();
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [started, paused, currentExercise]);
  
  const startSession = () => {
    setStarted(true);
    totalTime.current = exercises[currentExercise].duration;
    setTimeRemaining(totalTime.current);
    elapsedTime.current = 0;
    startTimer();
  };
  
  const startTimer = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    const startTime = Date.now() - elapsedTime.current * 1000;
    
    intervalRef.current = window.setInterval(() => {
      const elapsedSecs = Math.floor((Date.now() - startTime) / 1000);
      elapsedTime.current = elapsedSecs;
      const remaining = Math.max(0, totalTime.current - elapsedSecs);
      
      setTimeRemaining(remaining);
      setProgress((elapsedSecs / totalTime.current) * 100);
      
      if (remaining <= 0) {
        clearInterval(intervalRef.current as number);
        intervalRef.current = null;
        completeExercise();
      }
    }, 100);
  };
  
  const togglePause = () => {
    setPaused(!paused);
    
    if (!paused) {
      // Pausing
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      // Resuming
      startTimer();
    }
  };
  
  const completeExercise = () => {
    // Award points based on completion
    const exerciseScore = 50;
    setScore(prev => prev + exerciseScore);
    onScore(exerciseScore);
    
    // Move to the next exercise or complete session
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      totalTime.current = exercises[currentExercise + 1].duration;
      setTimeRemaining(totalTime.current);
      elapsedTime.current = 0;
      setProgress(0);
      setPaused(true); // Pause before starting the next exercise
    } else {
      completeAllExercises();
    }
  };
  
  const skipExercise = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Award partial points for skipping
    const exerciseScore = 10;
    setScore(prev => prev + exerciseScore);
    onScore(exerciseScore);
    
    // Move to the next exercise or complete session
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(prev => prev + 1);
      totalTime.current = exercises[currentExercise + 1].duration;
      setTimeRemaining(totalTime.current);
      elapsedTime.current = 0;
      setProgress(0);
      setPaused(true); // Pause before starting the next exercise
    } else {
      completeAllExercises();
    }
  };
  
  const completeAllExercises = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setComplete(true);
    onComplete();
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (complete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mindfulness Session Complete</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-xl font-bold mb-4">Great job!</p>
          <p>You've completed all mindfulness exercises.</p>
          <p className="mt-2">Total points earned: {score}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onComplete} className="w-full">
            Continue
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (!started) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mindfulness Session</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This session includes three mindfulness exercises:</p>
          <ol className="list-decimal list-inside space-y-2">
            {exercises.map((exercise, index) => (
              <li key={index}>{exercise.name} ({formatTime(exercise.duration)})</li>
            ))}
          </ol>
          <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
            <p className="text-sm">
              Find a quiet space where you won't be interrupted. Sit comfortably 
              with your back straight and shoulders relaxed. You can close your eyes 
              or maintain a soft gaze.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={startSession} className="w-full">
            Begin Session
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  const currentEx = exercises[currentExercise];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{currentEx.name}</span>
          <span className="text-sm font-normal">
            {formatTime(timeRemaining)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>
        
        <p className="mb-4">{currentEx.description}</p>
        
        <div className="space-y-3 bg-secondary/20 p-4 rounded-lg mb-4">
          {currentEx.instructions.map((instruction, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs">{index + 1}</span>
              </div>
              <p className="text-sm">{instruction}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-3">
        <Button 
          variant={paused ? "default" : "outline"} 
          onClick={togglePause} 
          className="flex-1"
        >
          {paused ? (
            <>
              <Play className="w-4 h-4 mr-2" />
              Resume
            </>
          ) : (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={skipExercise} 
          className="flex-1"
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          Skip
        </Button>
      </CardFooter>
    </Card>
  );
}
