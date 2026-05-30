import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  X,
  Lightbulb,
  PenTool,
  BarChart3,
  BookMarked,
  Zap,
  Rocket,
  CheckCircle2,
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  tip: string;
  icon: typeof Sparkles;
  color: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to ResearchLab",
    description: "Your all-in-one research companion. Let's take a quick tour of what you can do here.",
    tip: "This tour takes about 30 seconds",
    icon: Rocket,
    color: "bg-primary",
  },
  {
    id: "ideas",
    title: "Generate Ideas",
    description: "Use AI-powered brainstorming to find your perfect research question. Get novelty and feasibility scores for each idea.",
    tip: "Start with 'What if...' questions for best results",
    icon: Lightbulb,
    color: "bg-accent",
  },
  {
    id: "writing",
    title: "Writing Studio",
    description: "Draft, refine, and polish your paper with real-time suggestions for clarity, flow, and academic tone.",
    tip: "AI helps you write better, not write for you",
    icon: PenTool,
    color: "bg-primary",
  },
  {
    id: "data",
    title: "Data Analysis",
    description: "Upload CSV files, run statistical tests, and create publication-ready visualizations in one click.",
    tip: "Supports T-tests, ANOVA, Chi-square, and more",
    icon: BarChart3,
    color: "bg-comic-blue",
  },
  {
    id: "literature",
    title: "Literature Review",
    description: "Find, analyze, and organize sources. Get auto-generated citations in MLA, APA, or Chicago format.",
    tip: "Search millions of papers from OpenAlex",
    icon: BookMarked,
    color: "bg-accent",
  },
  {
    id: "ready",
    title: "You're Ready!",
    description: "Start your first project and let ResearchLab guide you through every step of the research process.",
    tip: "Most students complete their first project in under 2 weeks",
    icon: Zap,
    color: "bg-primary",
  },
];

interface OnboardingOverlayProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export function OnboardingOverlay({ onComplete, onSkip }: OnboardingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onSkip?.();
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-md mx-4"
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute -top-12 right-0 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Card */}
        <div
          className="bg-card border-3 border-foreground p-6 relative overflow-hidden"
          style={{ boxShadow: "var(--shadow-brutal-lg)" }}
        >
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {onboardingSteps.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: i === currentStep ? 1.3 : 1,
                  backgroundColor: i <= currentStep ? "hsl(var(--primary))" : "hsl(var(--muted))",
                }}
                className="w-2 h-2 rounded-full"
              />
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              {/* Icon */}
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`w-16 h-16 ${step.color} border-3 border-foreground mx-auto mb-4 flex items-center justify-center`}
                style={{ boxShadow: "var(--shadow-brutal-sm)" }}
              >
                <Icon className="w-8 h-8 text-primary-foreground" />
              </motion.div>

              <h2 className="font-comic text-2xl mb-2">{step.title}</h2>
              <p className="text-muted-foreground mb-4">{step.description}</p>

              {/* Tip */}
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/30 text-sm mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">{step.tip}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip tour
            </button>
            <Button
              onClick={handleNext}
              className="brutal-button bg-primary text-primary-foreground"
            >
              {currentStep === onboardingSteps.length - 1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Hook for managing onboarding state
export function useOnboarding(key: string = "research_lab_onboarding_v1") {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true); // Default to true to avoid flash
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(key);
    setHasSeenOnboarding(seen === "true");
    setIsLoaded(true);
  }, [key]);

  const completeOnboarding = () => {
    localStorage.setItem(key, "true");
    setHasSeenOnboarding(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(key);
    setHasSeenOnboarding(false);
  };

  return { hasSeenOnboarding, completeOnboarding, resetOnboarding, isLoaded };
}
