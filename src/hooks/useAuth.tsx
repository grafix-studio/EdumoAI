
import { useState, useEffect, createContext, useContext } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => void;
  signUp: (email: string, password: string, name: string) => void;
  signInWithGoogle: () => void;
  signOut: () => void;
}

interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: () => {},
  signUp: () => {},
  signInWithGoogle: () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("eduSenseUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = (email: string, password: string) => {
    // For demo purposes, simulate API call delay
    setLoading(true);
    
    // Simulate validation
    if (!email || !password) {
      toast.error("Please provide both email and password");
      setLoading(false);
      return;
    }
    
    setTimeout(() => {
      const mockUser = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        email: email,
        name: email.split('@')[0],
      };
      
      setUser(mockUser);
      localStorage.setItem("eduSenseUser", JSON.stringify(mockUser));
      setLoading(false);
      toast.success("Successfully signed in!");
      navigate("/");
    }, 1000);
  };

  const signUp = (email: string, password: string, name: string) => {
    // For demo purposes, simulate API call delay
    setLoading(true);
    
    // Simulate validation
    if (!email || !password || !name) {
      toast.error("Please fill out all fields");
      setLoading(false);
      return;
    }
    
    setTimeout(() => {
      const mockUser = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        email: email,
        name: name,
      };
      
      setUser(mockUser);
      localStorage.setItem("eduSenseUser", JSON.stringify(mockUser));
      setLoading(false);
      toast.success("Successfully created account!");
      navigate("/");
    }, 1000);
  };

  const signInWithGoogle = () => {
    // For demo purposes, simulate Google sign-in
    setLoading(true);
    
    setTimeout(() => {
      const mockUser = {
        id: "google-" + Math.random().toString(36).substr(2, 9),
        email: "user@gmail.com",
        name: "Google User",
        photoUrl: "https://lh3.googleusercontent.com/a/default-user",
      };
      
      setUser(mockUser);
      localStorage.setItem("eduSenseUser", JSON.stringify(mockUser));
      setLoading(false);
      toast.success("Successfully signed in with Google!");
      navigate("/");
    }, 1500);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("eduSenseUser");
    toast.info("Successfully signed out");
    navigate("/signin");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
