
import { useState } from "react";
import { BookOpen, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RecommendationCardProps {
  currentEmotion: string | null;
  stressLevel: number;
}

export default function RecommendationCard({ currentEmotion, stressLevel }: RecommendationCardProps) {
  // Get emotion recommendation
  const getEmotionRecommendation = () => {
    if (!currentEmotion) return null;
    
    switch (currentEmotion) {
      case "happy":
        return "Great mood detected! This is an optimal time for challenging material.";
      case "focused":
        return "You're in a focused state. Perfect for deep learning and complex topics.";
      case "confused":
        return "You seem a bit confused. Consider reviewing fundamentals or asking for clarification.";
      case "stressed":
        return "Stress detected. Try taking a short break or some deep breathing exercises.";
      case "sad":
        return "You seem a bit down. Consider a short break or switching to a more engaging topic.";
      case "bored":
        return "You seem disengaged. Try switching to interactive content or taking a short break.";
      default:
        return "Maintaining steady engagement. Continue your learning session.";
    }
  };

  // Get specific learning content recommendations based on emotion
  const getLearningContentRecommendations = () => {
    if (!currentEmotion) return [];
    
    switch (currentEmotion) {
      case "happy":
        return [
          { title: "Advanced Problem Solving", description: "Challenge yourself with complex problems that require critical thinking" },
          { title: "Project-Based Learning", description: "Work on creative projects that apply multiple concepts" },
          { title: "Peer Teaching", description: "Explain concepts to others to reinforce your understanding" }
        ];
      case "focused":
        return [
          { title: "Deep Dive Sessions", description: "Extended focus on a single complex topic" },
          { title: "Analytical Reading", description: "Critical analysis of challenging texts or research papers" },
          { title: "Technical Skill Building", description: "Practice specialized skills that require precision" }
        ];
      case "confused":
        return [
          { title: "Concept Mapping", description: "Create visual representations of relationships between concepts" },
          { title: "Simplified Tutorials", description: "Step-by-step guides covering fundamentals" },
          { title: "Interactive Demonstrations", description: "Watch visual explanations with examples" }
        ];
      case "stressed":
        return [
          { title: "Microlearning", description: "Short, focused lessons on one concept at a time" },
          { title: "Guided Practice", description: "Structured exercises with immediate feedback" },
          { title: "Review Sessions", description: "Revisit familiar material to build confidence" }
        ];
      case "sad":
        return [
          { title: "Engaging Multimedia", description: "Video-based learning with interactive elements" },
          { title: "Social Learning", description: "Collaborative activities with peers" },
          { title: "Interest-Driven Topics", description: "Focus on subjects you're personally interested in" }
        ];
      case "bored":
        return [
          { title: "Interactive Simulations", description: "Engage with dynamic content that responds to your inputs" },
          { title: "Gamified Learning", description: "Educational content presented in game format with achievements" },
          { title: "Challenge-Based Learning", description: "Push yourself with increasingly difficult problems" }
        ];
      default:
        return [
          { title: "Balanced Learning Mix", description: "Alternate between reading, practice, and application" },
          { title: "Spaced Repetition", description: "Review material at optimal intervals" },
          { title: "Self-Assessment", description: "Regular quizzes to identify knowledge gaps" }
        ];
    }
  };

  // Get stress relief recommendations
  const getStressReliefRecommendations = () => {
    // Always show stress relief for sad or stressed emotions
    if (!(currentEmotion === "sad" || currentEmotion === "stressed" || stressLevel >= 30)) {
      return [];
    }
    
    const baseRecommendations = [
      { title: "Deep Breathing", description: "Take 5 deep breaths, inhaling for 4 counts and exhaling for 6 counts" },
      { title: "Quick Stretch", description: "Stand up and stretch your arms, shoulders and neck for 30 seconds" },
      { title: "Mindful Minute", description: "Close your eyes and focus on your breathing for just one minute" }
    ];
    
    if (stressLevel >= 70 || currentEmotion === "stressed") {
      return [
        ...baseRecommendations,
        { title: "Progressive Relaxation", description: "Tense and relax each muscle group from your toes to your head" },
        { title: "Guided Meditation", description: "Follow a short 5-minute guided meditation" },
        { title: "Change of Environment", description: "Take a 10-minute break in a different location" }
      ];
    } else if (stressLevel >= 50 || currentEmotion === "sad") {
      return [
        ...baseRecommendations,
        { title: "Positive Visualization", description: "Spend a moment imagining a peaceful, calming scene" },
        { title: "Gratitude Practice", description: "Quickly note three things you're grateful for right now" }
      ];
    }
    
    return baseRecommendations;
  };

  if (!currentEmotion) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recommendations</CardTitle>
        <CardDescription>{getEmotionRecommendation()}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="learning" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="learning">Learning Content</TabsTrigger>
            <TabsTrigger value="stress">Stress Relief</TabsTrigger>
          </TabsList>
          <TabsContent value="learning" className="mt-4">
            <div className="grid gap-3">
              {getLearningContentRecommendations().map((rec, i) => (
                <div key={i} className="flex gap-2 items-start p-3 rounded-lg bg-secondary/20">
                  <BookOpen className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="stress" className="mt-4">
            <div className="grid gap-3">
              {getStressReliefRecommendations().length > 0 ? (
                getStressReliefRecommendations().map((rec, i) => (
                  <div key={i} className="flex gap-2 items-start p-3 rounded-lg bg-secondary/20">
                    <Heart className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  <p>Stress relief recommendations will appear when stress is detected.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
