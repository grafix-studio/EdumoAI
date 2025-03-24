
import { useState, useEffect, createContext, useContext } from "react";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => void;
  signUp: () => void;
  signOut: () => void;
}

interface User {
  id: string;
  email: string;
  name: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: () => {},
  signUp: () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("eduSenseUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = () => {
    // For demo purposes, show a modal or form for sign in
    const mockUser = {
      id: "user-" + Math.random().toString(36).substr(2, 9),
      email: "demo@example.com",
      name: "Demo User",
    };
    
    setUser(mockUser);
    localStorage.setItem("eduSenseUser", JSON.stringify(mockUser));
    toast.success("Successfully signed in!");
  };

  const signUp = () => {
    // For demo purposes, show a modal or form for sign up
    const mockUser = {
      id: "user-" + Math.random().toString(36).substr(2, 9),
      email: "new@example.com",
      name: "New User",
    };
    
    setUser(mockUser);
    localStorage.setItem("eduSenseUser", JSON.stringify(mockUser));
    toast.success("Successfully created account!");
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("eduSenseUser");
    toast.info("Successfully signed out");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
