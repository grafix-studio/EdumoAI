<<<<<<< HEAD

import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
=======
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
>>>>>>> b2ce6820 (Use tech stack vite_react_shadcn_ts)

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
>>>>>>> b2ce6820 (Use tech stack vite_react_shadcn_ts)
        </a>
      </div>
    </div>
  );
};

export default NotFound;
