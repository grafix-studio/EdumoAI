
import React, { useState } from "react";
import { Brain, Puzzle, Zap, Star, Clock, Award, ArrowRight, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import MindActivityGame from "./mind-activities/MindActivityGame";

export default function MindActivitiesSection() {
  const [activeTab, setActiveTab] = useState("puzzles");
  const [currentGame, setCurrentGame] = useState<{
    id: string;
    title: string;
    type: "puzzle" | "exercise" | "daily";
    difficulty?: string;
  } | null>(null);

  const puzzles = [
    {
      id: "memory-match",
      title: "Memory Match",
      description: "Test and improve your short-term memory by matching pairs of cards.",
      difficulty: "Beginner",
      timeEstimate: "5 mins",
      icon: Brain,
      color: "bg-blue-100 dark:bg-blue-950"
    },
    {
      id: "sudoku",
      title: "Sudoku Challenge",
      description: "Solve number puzzles that test your logical reasoning skills.",
      difficulty: "Intermediate",
      timeEstimate: "15 mins",
      icon: Puzzle,
      color: "bg-purple-100 dark:bg-purple-950"
    },
    {
      id: "word-association",
      title: "Word Association",
      description: "Connect related words and expand your verbal reasoning abilities.",
      difficulty: "Beginner",
      timeEstimate: "10 mins",
      icon: Zap,
      color: "bg-amber-100 dark:bg-amber-950"
    },
    {
      id: "pattern-recognition",
      title: "Pattern Recognition",
      description: "Identify and continue visual patterns to enhance cognitive flexibility.",
      difficulty: "Advanced",
      timeEstimate: "20 mins",
      icon: Star,
      color: "bg-green-100 dark:bg-green-950"
    }
  ];

  const exercises = [
    {
      id: "dual-n-back",
      title: "Dual N-Back Training",
      description: "Advanced memory exercise that trains working memory and fluid intelligence.",
      difficulty: "Advanced",
      timeEstimate: "15 mins",
      icon: Brain,
      color: "bg-red-100 dark:bg-red-950"
    },
    {
      id: "speed-reading",
      title: "Speed Reading",
      description: "Improve reading speed while maintaining comprehension.",
      difficulty: "Intermediate",
      timeEstimate: "10 mins",
      icon: Clock,
      color: "bg-emerald-100 dark:bg-emerald-950"
    },
    {
      id: "critical-thinking",
      title: "Critical Thinking Scenarios",
      description: "Analyze complex scenarios and make logical decisions.",
      difficulty: "Intermediate",
      timeEstimate: "15 mins",
      icon: Zap,
      color: "bg-sky-100 dark:bg-sky-950"
    },
    {
      id: "math-fluency",
      title: "Math Fluency",
      description: "Mental math exercises to improve numerical processing speed.",
      difficulty: "Beginner",
      timeEstimate: "5 mins",
      icon: Award,
      color: "bg-indigo-100 dark:bg-indigo-950"
    }
  ];

  const dailyExercises = [
    {
      id: "mind-warmup",
      title: "Today's Mind Warm-up",
      description: "A quick sequence of 3 exercises designed to activate different areas of your brain.",
      icon: Zap,
      exercises: ["Word Recall", "Mental Math", "Visual Patterns"]
    },
    {
      id: "mindfulness",
      title: "Mindfulness Session",
      description: "Guided meditation focused on improving attention and cognitive control.",
      icon: Brain,
      exercises: ["Focused Attention", "Open Monitoring", "Visualization"]
    }
  ];

  const startGame = (id: string, title: string, type: "puzzle" | "exercise" | "daily", difficulty?: string) => {
    setCurrentGame({ id, title, type, difficulty });
  };

  const closeGame = () => {
    setCurrentGame(null);
  };

  // If a game is active, show the game screen
  if (currentGame) {
    return (
      <section id="mind-activities" className="section">
        <div className="max-w-6xl mx-auto w-full relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{currentGame.title}</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={closeGame}
              aria-label="Close game"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <MindActivityGame 
            id={currentGame.id}
            type={currentGame.type}
            difficulty={currentGame.difficulty}
          />
        </div>
      </section>
    );
  }

  return (
    <section id="mind-activities" className="section">
      <div className="section-header">
        <span className="chip mb-2">Brain Training</span>
        <h1 className="text-balance">Mind Activities</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
          Enhance your cognitive abilities with these brain-training exercises and puzzles,
          designed to improve memory, focus, and problem-solving skills.
        </p>
      </div>

      <div className="max-w-6xl mx-auto w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="puzzles" className="flex-1">Puzzles</TabsTrigger>
            <TabsTrigger value="exercises" className="flex-1">Exercises</TabsTrigger>
            <TabsTrigger value="daily" className="flex-1">Daily Challenge</TabsTrigger>
          </TabsList>

          <TabsContent value="puzzles" className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {puzzles.map((puzzle) => (
                <Card key={puzzle.id} className="overflow-hidden">
                  <div className={`p-6 ${puzzle.color}`}>
                    <puzzle.icon className="w-10 h-10 mb-4" />
                    <h3 className="text-lg font-semibold">{puzzle.title}</h3>
                  </div>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-4">{puzzle.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {puzzle.difficulty}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {puzzle.timeEstimate}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => startGame(puzzle.id, puzzle.title, "puzzle", puzzle.difficulty)}
                    >
                      Start Puzzle
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="exercises" className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {exercises.map((exercise) => (
                <Card key={exercise.id} className="overflow-hidden">
                  <div className={`p-6 ${exercise.color}`}>
                    <exercise.icon className="w-10 h-10 mb-4" />
                    <h3 className="text-lg font-semibold">{exercise.title}</h3>
                  </div>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-4">{exercise.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {exercise.difficulty}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {exercise.timeEstimate}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => startGame(exercise.id, exercise.title, "exercise", exercise.difficulty)}
                    >
                      Start Exercise
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="daily" className="mt-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {dailyExercises.map((exercise) => (
                <Card key={exercise.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-primary/10">
                        <exercise.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{exercise.title}</CardTitle>
                        <CardDescription>{exercise.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="text-sm font-medium mb-2">Exercise Sequence:</h4>
                    <ul className="space-y-2">
                      {exercise.exercises.map((ex, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                            {i + 1}
                          </div>
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => startGame(exercise.id, exercise.title, "daily")}
                    >
                      Start Daily Challenge
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-10 text-center">
          <Button variant="outline" className="group">
            <span>View All Mind Activities</span>
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
