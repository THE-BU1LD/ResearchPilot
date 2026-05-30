import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import DraggableShape from "@/components/interactive/DraggableShape";
import { supabase } from "@/lib/supabase";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  // new states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // show friendly message
        setError(authError.message ?? "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      // successful login — redirect to dashboard
      // you can also use react-router navigate if preferred
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err?.message ?? "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3 mb-12 group">
            <div className="w-12 h-12 bg-primary border-3 border-foreground flex items-center justify-center shadow-brutal-sm transition-all group-hover:rotate-6 group-hover:scale-110">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-comic text-foreground">ResearchLab</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-comic text-4xl text-foreground mb-2">
              Welcome Back!
            </h1>
            <p className="text-muted-foreground font-medium">
              Log in to continue your research journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold uppercase text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="brutal-input"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-bold uppercase text-sm">Password</Label>
                <a href="#" className="text-sm font-bold text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="brutal-input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* show error */}
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}

            <Button 
              type="submit" 
              variant="default" 
              size="lg" 
              className="w-full group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Log In"}
              <ArrowRight className={`w-5 h-5 transition-transform ${isHovering ? "translate-x-1" : ""}`} />
            </Button>
          </form>

          {/* Sign up link */}
          <p className="mt-8 text-center text-muted-foreground font-medium">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-bold hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Decorative with interactive shapes */}
      <div className="hidden lg:flex flex-1 bg-primary border-l-3 border-foreground items-center justify-center p-12 relative overflow-hidden halftone-overlay">
        {/* Interactive draggable shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="pointer-events-auto">
            <DraggableShape
              initialX={50}
              initialY={80}
              size={60}
              color="hsl(0 0% 5% / 0.15)"
              rotation={12}
              shape="star"
            />
            <DraggableShape
              initialX={350}
              initialY={400}
              size={45}
              color="hsl(0 0% 5% / 0.15)"
              rotation={-20}
              shape="star"
            />
            <DraggableShape
              initialX={280}
              initialY={100}
              size={50}
              color="hsl(0 0% 5% / 0.1)"
              rotation={15}
              shape="square"
            />
            <DraggableShape
              initialX={80}
              initialY={350}
              size={40}
              color="hsl(0 0% 5% / 0.1)"
              rotation={-10}
              shape="circle"
            />
          </div>
        </div>
        
        <div className="relative z-10 brutal-card p-8 bg-card max-w-md animate-bounce-in">
          <h2 className="font-comic text-3xl text-foreground mb-4">
            Continue Where You Left Off!
          </h2>
          <p className="text-muted-foreground font-medium">
            Your projects, sources, and drafts are waiting for you. Pick up right where you stopped.
          </p>
          <p className="mt-4 text-sm text-muted-foreground flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4" /> Try dragging the shapes!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
