
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/components/ui/use-toast";
import { Github, Twitter, Mail, UserPlus } from "lucide-react";
import Layout from "@/components/Layout";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!authLoading && user) {
    navigate("/");
    return null;
  }

  // Handle sign up / login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      setLoading(false);
      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success! Check your email", description: "Confirm your email to finish signing up." });
        setMode("login");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome!", description: "Logged in successfully." });
        navigate("/");
      }
    }
  };

  // Social sign-ins
  const handleProvider = async (provider: "google" | "github" | "twitter") => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    setLoading(false);
    if (error) toast({ title: "Social sign-in failed", description: error.message, variant: "destructive" });
  };

  return (
    <Layout title={mode === "login" ? "Login" : "Sign Up"}>
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md bg-white rounded-lg shadow p-7">
          <h1 className="text-2xl font-bold mb-4 text-center">{mode === "login" ? "Login" : "Sign Up"}</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (mode === "login" ? "Logging in..." : "Signing up...") : mode === "login" ? "Login" : "Sign Up"}
            </Button>
          </form>
          <div className="text-center my-3 text-gray-500 text-xs">or sign in with</div>
          <div className="flex justify-center gap-2 mb-2">
            <Button variant="outline" size="sm" onClick={() => handleProvider("google")}><Mail className="w-4 h-4 mr-2" />Google</Button>
            <Button variant="outline" size="sm" onClick={() => handleProvider("github")}><Github className="w-4 h-4 mr-2" />GitHub</Button>
            <Button variant="outline" size="sm" onClick={() => handleProvider("twitter")}><Twitter className="w-4 h-4 mr-2" />Twitter</Button>
          </div>
          <div className="mt-4 text-center">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button className="text-tech-purple underline" onClick={() => setMode("signup")}>
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button className="text-tech-purple underline" onClick={() => setMode("login")}>
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
