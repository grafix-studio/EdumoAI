
import { lazy, Suspense, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Loader2 } from "lucide-react";
import DocumentLearningSection from "../components/DocumentLearningSection";
import { Button } from "@/components/ui/button";

// Lazy load the heavier components
const EmotionDetectionSection = lazy(() => import("../components/EmotionDetectionSection"));
const MindActivitiesSection = lazy(() => import("../components/MindActivitiesSection"));
const TaskManagerSection = lazy(() => import("../components/TaskManagerSection"));
const MentorshipSection = lazy(() => import("../components/MentorshipSection"));
const TeamSection = lazy(() => import("../components/TeamSection"));

// Loading component
const SectionLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <Loader2 className="h-10 w-10 text-primary animate-spin" />
  </div>
);

export default function Index() {
  // Add smooth scrolling to sections
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="hero-section py-24 md:py-32 px-4 md:px-6 text-center">
          <div className="container mx-auto">
            <span className="chip mb-4">Welcome to EduSense</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance max-w-4xl mx-auto">
              AI-Powered Education & Productivity Platform
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-6 text-balance">
              Enhance learning experiences, improve cognitive abilities, and boost productivity with our suite of AI-powered tools.
            </p>
            <div className="max-w-2xl mx-auto mb-12 p-4 bg-secondary/30 rounded-lg border border-border/50">
              <p className="text-primary italic">
                Welcome to our educational platform that adapts to your emotional state and learning style. 
                Start by exploring our key features below!
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <Button 
                className="p-6 h-auto text-lg font-medium flex flex-col gap-2"
                onClick={() => scrollToSection("home")}
              >
                <span className="text-xl font-bold">Emotion Detection</span>
                <span className="text-sm font-normal">Adapt learning to your emotional state</span>
              </Button>
              <Button 
                className="p-6 h-auto text-lg font-medium flex flex-col gap-2"
                onClick={() => scrollToSection("documents")}
              >
                <span className="text-xl font-bold">Learning Assistant</span>
                <span className="text-sm font-normal">AI-powered document analysis</span>
              </Button>
              <Button 
                className="p-6 h-auto text-lg font-medium flex flex-col gap-2"
                onClick={() => scrollToSection("tasks")}
              >
                <span className="text-xl font-bold">Task Manager</span>
                <span className="text-sm font-normal">Organize your learning journey</span>
              </Button>
            </div>
          </div>
        </section>
        
        <div id="features" className="space-y-24 md:space-y-32 mb-24">
          <Suspense fallback={<SectionLoader />}>
            <EmotionDetectionSection />
          </Suspense>
          
          <DocumentLearningSection />
          
          <Suspense fallback={<SectionLoader />}>
            <MindActivitiesSection />
          </Suspense>
          
          <Suspense fallback={<SectionLoader />}>
            <TaskManagerSection />
          </Suspense>
          
          <Suspense fallback={<SectionLoader />}>
            <MentorshipSection />
          </Suspense>
          
          <Suspense fallback={<SectionLoader />}>
            <TeamSection />
          </Suspense>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
