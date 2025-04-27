
import { useState, createContext, useContext, useEffect } from "react";

type AuthContextType = {
  user: { email: string } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => false,
  signOut: () => {},
});

export function useSupabaseAuth() {
  return useContext(AuthContext);
}

// Hardcoded admin credentials
const ADMIN_EMAIL = "admin@techhorizon.com";
const ADMIN_PASSWORD = "admin123";

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for user session in localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('techhorizon_admin');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        // If there's an error parsing, clear the storage
        localStorage.removeItem('techhorizon_admin');
      }
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simple admin email/password check
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const userData = { email };
        setUser(userData);
        // Store admin session
        localStorage.setItem('techhorizon_admin', JSON.stringify(userData));
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      return false;
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('techhorizon_admin');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
