
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      // Get current active section based on scroll position
      const sections = document.querySelectorAll("section[id]");
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute("id") || "";

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="flex items-center">
        <span className="text-xl font-display font-bold">EduSense</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-1">
        <button 
          className={`navbar-link ${activeSection === "home" ? "navbar-link-active" : ""}`}
          onClick={() => scrollToSection("home")}
        >
          Emotion Detection
        </button>
        <button 
          className={`navbar-link ${activeSection === "documents" ? "navbar-link-active" : ""}`}
          onClick={() => scrollToSection("documents")}
        >
          Learning Assistant
        </button>
        <button 
          className={`navbar-link ${activeSection === "tasks" ? "navbar-link-active" : ""}`}
          onClick={() => scrollToSection("tasks")}
        >
          Task Manager
        </button>
        <div className="ml-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Navigation Toggle */}
      <div className="md:hidden flex items-center">
        <ThemeToggle />
        <button 
          className="p-2 ml-2 rounded-lg hover:bg-secondary/50 transition-all"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border/50 p-4 animate-slide-in-down">
          <div className="flex flex-col space-y-2">
            <button 
              className={`navbar-link ${activeSection === "home" ? "navbar-link-active" : ""} w-full text-left`}
              onClick={() => scrollToSection("home")}
            >
              Emotion Detection
            </button>
            <button 
              className={`navbar-link ${activeSection === "documents" ? "navbar-link-active" : ""} w-full text-left`}
              onClick={() => scrollToSection("documents")}
            >
              Learning Assistant
            </button>
            <button 
              className={`navbar-link ${activeSection === "tasks" ? "navbar-link-active" : ""} w-full text-left`}
              onClick={() => scrollToSection("tasks")}
            >
              Task Manager
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
