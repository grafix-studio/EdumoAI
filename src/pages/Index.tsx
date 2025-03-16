
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import EmotionDetectionSection from "../components/EmotionDetectionSection";
import DocumentLearningSection from "../components/DocumentLearningSection";
import TaskManagerSection from "../components/TaskManagerSection";
import Footer from "../components/Footer";

const Index = () => {
  // Add meta tags on load
  useEffect(() => {
    document.title = "EduSense - AI-Powered Education & Productivity";
    
    // Add Google Fonts
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(fontLink);
    
    return () => {
      document.head.removeChild(fontLink);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-16"> {/* Add padding-top to accommodate fixed navbar */}
        <EmotionDetectionSection />
        <DocumentLearningSection />
        <TaskManagerSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
