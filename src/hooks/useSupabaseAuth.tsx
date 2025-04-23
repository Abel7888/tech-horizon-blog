
import { useState, createContext, useContext } from "react";

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

const ADMIN_EMAIL = "admin@techhorizon.com";
const ADMIN_PASSWORD = "admin123";

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    // simple admin email/password check
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setUser({ email });
      setLoading(false);
      return true;
    } else {
      setLoading(false);
      return false;
    }
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
