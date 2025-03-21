
import { lazy, Suspense } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Loader2 } from "lucide-react";
import DocumentLearningSection from "../components/DocumentLearningSection";

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
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8 text-balance">
              Enhance learning experiences, improve cognitive abilities, and boost productivity with our suite of AI-powered tools.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#documents" className="btn-primary">Get Started</a>
              <a href="#features" className="btn-outline">Explore Features</a>
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
