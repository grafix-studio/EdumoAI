import { lazy, Suspense, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Loader2, BookOpen, CheckSquare, Activity } from "lucide-react";
import DocumentLearningSection from "../components/DocumentLearningSection";
import { Button } from "@/components/ui/button";
import { EmotionData } from "../types/emotion";

// Lazy load components
const EmotionDetector = lazy(() => import("../components/EmotionDetector"));
const EmotionHistory = lazy(() => import("../components/EmotionHistory"));
const StressAlert = lazy(() => import("../components/StressAlert"));
const MindActivitiesSection = lazy(() => import("../components/MindActivitiesSection"));
const TaskManagerSection = lazy(() => import("../components/TaskManagerSection"));
const MentorshipSection = lazy(() => import("../components/MentorshipSection"));

// Loading component
const SectionLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <Loader2 className="h-10 w-10 text-primary animate-spin" />
  </div>
);

export default function Index() {
  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([]);
  const [showStressAlert, setShowStressAlert] = useState(false);

  const handleEmotionDetected = (emotion: EmotionData) => {
    setEmotionHistory((prev) => [...prev, emotion]);

    // Show stress alert if stress level is above 20%
    if (emotion.stress_level > 0.2 && !showStressAlert) {
      setShowStressAlert(true);
    }
  };

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
        {/* Hero Section */}
        <section className="hero-section py-24 md:py-32 px-4 md:px-6 text-center">
          <div className="container mx-auto">
            <span className="chip mb-4">Welcome to EduSense</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              AI-Powered Education & Productivity Platform
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-6">
              Enhance learning experiences, improve cognitive abilities, and boost productivity with our suite of AI-powered tools.
            </p>
            <div className="max-w-2xl mx-auto mb-12 p-4 bg-secondary/30 rounded-lg border border-border/50">
              <p className="text-primary italic">
                Welcome to our educational platform that adapts to your learning style.
                Start by exploring our key features below!
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              <Button className="p-6 h-auto text-lg font-medium flex flex-col gap-2" onClick={() => scrollToSection("documents")}>
                <BookOpen className="h-6 w-6" />
                <span className="text-xl font-bold">Learning Assistant</span>
                <span className="text-sm font-normal">AI-powered document analysis</span>
              </Button>
              <Button className="p-6 h-auto text-lg font-medium flex flex-col gap-2" onClick={() => scrollToSection("tasks")}>
                <CheckSquare className="h-6 w-6" />
                <span className="text-xl font-bold">Task Manager</span>
                <span className="text-sm font-normal">Organize your learning journey</span>
              </Button>
            </div>
          </div>
        </section>

        <div id="features" className="space-y-24 md:space-y-32 mb-24">
          <Suspense fallback={<SectionLoader />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start p-6">

              {/* Left Side: Emotion Detector & Default Status Below */}
              <div className="flex flex-col w-full items-center gap-4">

                {/* Emotion Detector */}
                <EmotionDetector onEmotionDetected={handleEmotionDetected} />

                {/* Default Visible - Current Status Section */}
                <div className="bg-gray-100 w-full p-6 rounded-lg shadow-md">
                  <div className="flex items-center space-x-2 mb-3">
                    <Activity className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                    <h2 className="text-lg md:text-xl font-semibold">Current Status</h2>
                  </div>
                  <p className="text-base md:text-lg">
                    Current Emotion: <span className="font-semibold">
                      {emotionHistory.length > 0 ? emotionHistory[emotionHistory.length - 1].emotion : "Neutral"}
                    </span>
                  </p>
                  <p className="text-base md:text-lg">
                    Stress Level: <span className="font-semibold">
                      {emotionHistory.length > 0 ? `${Math.round(emotionHistory[emotionHistory.length - 1].stress_level * 100)}%` : "0%"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Right Side: Emotion History - Default Visible with Zero Graph */}
              <div className="bg-gray-50 w-full p-6 rounded-lg shadow-md">
                <h2 className="text-lg md:text-xl font-semibold mb-4">Emotion History</h2>

                {/* Scrollable Chart Section - Starts with Empty Data */}
                <div className="max-h-[400px] overflow-y-auto bg-white p-4 rounded-lg shadow-inner">
                  <Suspense fallback={<SectionLoader />}>
                    <EmotionHistory emotionHistory={emotionHistory} />
                  </Suspense>
                </div>
              </div>
            </div>
          </Suspense>



          {/* Stress Alert */}
          {showStressAlert && (
            <Suspense fallback={<SectionLoader />}>
              <StressAlert onClose={() => setShowStressAlert(false)} />
            </Suspense>
          )}

          {/* Document Learning Section */}
          <Suspense fallback={<SectionLoader />}>
            <DocumentLearningSection />
          </Suspense>

          {/* Other Sections */}
          <Suspense fallback={<SectionLoader />}>
            <MindActivitiesSection />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <TaskManagerSection />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <MentorshipSection />
          </Suspense>

        </div>
      </main>

      <Footer />
    </div>
  );
}
