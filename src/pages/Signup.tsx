import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, ArrowRight, Eye, EyeOff, Check, Zap } from "lucide-react";
import DraggableShape from "@/components/interactive/DraggableShape";
import { supabase } from "@/lib/supabase";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/dashboard");
  };

  const signUpWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      alert(error.message);
    }
  };

  const features = [
    "Unlimited research projects",
    "AI-powered writing assistance",
    "Citation management in all formats",
    "Data analysis tools",
  ];

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Left side */}
      <div className="hidden lg:flex flex-1 bg-primary border-r-4 border-foreground items-center justify-center p-12 relative overflow-hidden halftone-overlay">
        <div className="absolute inset-0 pointer-events-none">
          <div className="pointer-events-auto">
            <DraggableShape initialX={50} initialY={80} size={65} color="hsl(0 0% 5% / 0.15)" rotation={15} shape="star" />
            <DraggableShape initialX={300} initialY={420} size={50} color="hsl(0 0% 5% / 0.15)" rotation={-25} shape="star" />
            <DraggableShape initialX={350} initialY={120} size={55} color="hsl(0 0% 5% / 0.1)" rotation={20} shape="square" />
            <DraggableShape initialX={70} initialY={380} size={45} color="hsl(0 0% 5% / 0.1)" rotation={-8} shape="circle" />
            <DraggableShape initialX={200} initialY={50} size={60} color="hsl(0 0% 5% / 0.1)" rotation={10} shape="triangle" />
            <DraggableShape initialX={380} initialY={280} size={40} color="hsl(0 0% 5% / 0.12)" rotation={35} shape="circle" />
          </div>
        </div>

        <div className="relative z-10 brutal-card p-10 bg-card max-w-md animate-bounce-in">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-8 h-8 text-primary animate-pulse" />
            <h2 className="font-comic text-3xl text-foreground">Start Your Journey!</h2>
          </div>
          <ul className="space-y-5">
            {features.map((feature, index) => (
              <li
                key={feature}
                className={`flex items-center gap-4 transition-all cursor-pointer ${
                  hoveredFeature === index ? "translate-x-3 scale-105" : ""
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="w-10 h-10 border-3 border-foreground flex items-center justify-center bg-primary shadow-brutal-sm">
                  <Check className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-3 mb-10">
            <div className="w-14 h-14 bg-primary border-3 border-foreground flex items-center justify-center shadow-brutal">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-3xl font-comic">ResearchLab</span>
          </Link>

          <h1 className="font-comic text-5xl mb-3">Create Account!</h1>
          <p className="text-muted-foreground mb-8">Get started with your free research account</p>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full mb-6"
            onClick={signUpWithGoogle}
          >
            Continue with Google
          </Button>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : <>Create Account <ArrowRight className="ml-2" /></>}
            </Button>
          </form>

          <p className="mt-8 text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-bold">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
