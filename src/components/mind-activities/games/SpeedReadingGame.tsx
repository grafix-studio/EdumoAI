
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface SpeedReadingGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  isFinished: boolean;
}

export default function SpeedReadingGame({ onScore, onComplete, isFinished }: SpeedReadingGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [wordDisplayRate, setWordDisplayRate] = useState(400); // ms per word
  const [isPlaying, setIsPlaying] = useState(false);
  
  const passages = [
    {
      text: "The human brain is remarkably adaptable. Through neuroplasticity, it can reorganize itself by forming new neural connections throughout life. This dynamic ability allows the brain to adjust to new situations, recover from injury, and strengthen important neural pathways while weakening less used ones. Learning new skills, such as playing a musical instrument or speaking another language, creates new neural pathways in the brain. Even into old age, the human brain can create new neural connections, allowing continued development and change throughout life.",
      words: [],
      questions: [
        {
          question: "What allows the brain to adjust to new situations?",
          options: ["Neurotransmitters", "Neuroplasticity", "Neuroscience", "Neural networks"],
          correctAnswer: 1
        }
      ]
    },
    {
      text: "Artificial intelligence has made remarkable strides in recent years. Machine learning algorithms can now recognize patterns in vast datasets, enabling applications from medical diagnosis to autonomous vehicles. Deep learning, a subset of machine learning, uses neural networks with many layers to process information in increasingly abstract ways. This has led to breakthroughs in natural language processing, computer vision, and game playing. Despite these advances, artificial general intelligence—AI that can perform any intellectual task a human can—remains elusive.",
      words: [],
      questions: [
        {
          question: "What uses neural networks with many layers?",
          options: ["Machine learning", "Deep learning", "Artificial general intelligence", "Computer vision"],
          correctAnswer: 1
        }
      ]
    }
  ];
  
  // Pre-process passages to split into words
  useEffect(() => {
    passages.forEach((passage, i) => {
      passages[i].words = passage.text.split(/\s+/);
    });
  }, []);
  
  const [currentPassage, setCurrentPassage] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    if (isFinished) {
      setIsPlaying(false);
      setShowQuestion(true);
    }
  }, [isFinished]);
  
  // Word display logic
  useEffect(() => {
    if (!isPlaying) return;
    
    const wordInterval = setInterval(() => {
      if (currentWord < passages[currentPassage].words.length - 1) {
        setCurrentWord(prev => prev + 1);
        setDisplayText(passages[currentPassage].words[currentWord]);
      } else {
        clearInterval(wordInterval);
        setIsPlaying(false);
        setShowQuestion(true);
      }
    }, wordDisplayRate);
    
    return () => clearInterval(wordInterval);
  }, [isPlaying, currentWord, currentPassage, wordDisplayRate]);
  
  const startReading = () => {
    setDisplayText(passages[currentPassage].words[0]);
    setCurrentWord(0);
    setIsPlaying(true);
    setShowQuestion(false);
    setSelectedAnswer(null);
  };
  
  const checkAnswer = () => {
    if (selectedAnswer === passages[currentPassage].questions[0].correctAnswer) {
      const newScore = 50;
      setScore(prev => prev + newScore);
      onScore(newScore);
      
      // Move to next passage or complete
      if (currentPassage < passages.length - 1) {
        setCurrentPassage(prev => prev + 1);
        setShowQuestion(false);
        setSelectedAnswer(null);
      } else {
        onComplete();
      }
    } else {
      // Wrong answer
      onScore(10); // Still give some points for attempting
    }
  };
  
  const handleSpeedChange = (newSpeed: number) => {
    setWordDisplayRate(newSpeed);
  };
  
  if (showQuestion) {
    const currentQuestion = passages[currentPassage].questions[0];
    
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold">Comprehension Check</h3>
        <p className="mb-4">{currentQuestion.question}</p>
        
        <div className="grid gap-2">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              className="justify-start h-auto py-3 px-4"
              onClick={() => setSelectedAnswer(index)}
            >
              {option}
            </Button>
          ))}
        </div>
        
        <Button 
          className="mt-4"
          disabled={selectedAnswer === null}
          onClick={checkAnswer}
        >
          Submit Answer
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          {isPlaying ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-3xl font-medium">{displayText}</p>
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center gap-4">
              <h3 className="text-xl font-bold">Speed Reading Exercise</h3>
              <p>Read the text one word at a time, then answer a question about it.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 p-6">
          {!isPlaying && (
            <div className="w-full">
              <p className="text-sm mb-2">Reading Speed (words per minute):</p>
              <div className="flex items-center gap-4">
                <span>Slower</span>
                <input
                  type="range"
                  min="200"
                  max="1000"
                  step="100"
                  value={wordDisplayRate}
                  onChange={(e) => handleSpeedChange(Number(e.target.value))}
                  className="flex-1"
                />
                <span>Faster</span>
              </div>
              <div className="text-center text-sm mt-1">
                {Math.round(60000 / wordDisplayRate)} WPM
              </div>
            </div>
          )}
          
          {isPlaying ? (
            <Progress value={(currentWord / passages[currentPassage].words.length) * 100} className="w-full" />
          ) : (
            <Button onClick={startReading} className="w-full">
              {currentWord === 0 ? "Start Reading" : "Continue Reading"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
