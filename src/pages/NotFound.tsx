
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="glass-card p-8 md:p-12 max-w-md w-full text-center animate-fade-in">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The page you're looking for doesn't exist
        </p>
        <a 
          href="/"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
