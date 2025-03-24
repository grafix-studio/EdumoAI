
import { useState, useEffect } from "react";
import { Menu, X, User, LogIn } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signIn, signOut } = useAuth();

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="flex items-center">
        <span className="text-xl font-display font-bold">EduSense</span>
      </div>

      {/* Authentication Button */}
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        {user ? (
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={signOut}
          >
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Profile</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={signIn}
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden md:inline">Sign In</span>
          </Button>
        )}
        
        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            className="p-2 rounded-lg hover:bg-secondary/50 transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border/50 p-4 animate-slide-in-down">
          <div className="flex flex-col space-y-2">
            {!user && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={signIn}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
