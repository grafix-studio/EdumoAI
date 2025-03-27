import { ExternalLink, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border/30">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-display font-bold">EdumoAi</h3>
            <p className="text-muted-foreground text-sm mt-1">
              AI-powered education & productivity
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <a
              href="#home"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Emotion Detection
            </a>
            <a
              href="#documents"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Learning Assistant
            </a>
            <a
              href="#tasks"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Task Manager
            </a>
          </div>
        </div>

        <div className="border-t border-border/30 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} EdumoAi. All rights reserved.
          </p>

          <div className="flex items-center space-x-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
            >
              <span className="text-sm">Privacy Policy</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
