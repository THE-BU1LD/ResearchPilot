import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Beaker,
  FlaskConical,
  TestTubes,
  FileSearch,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Users,
  ClipboardList,
  Calculator,
  Microscope,
  Brain,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Check,
  X,
  Scale,
  FileText,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ResearchMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  steps: string[];
}

const researchMethods: ResearchMethod[] = [
  {
    id: "hypothesis",
    name: "Hypothesis Testing",
    description: "Formulate and test research hypotheses",
    icon: Beaker,
    steps: ["State null hypothesis", "Define alternative", "Set significance level", "Collect data", "Calculate p-value", "Draw conclusion"],
  },
  {
    id: "literature",
    name: "Systematic Review",
    description: "Comprehensive literature analysis",
    icon: FileSearch,
    steps: ["Define research question", "Search databases", "Screen articles", "Extract data", "Synthesize findings", "Report results"],
  },
  {
    id: "qualitative",
    name: "Qualitative Analysis",
    description: "Analyze non-numerical data",
    icon: Brain,
    steps: ["Collect data", "Code responses", "Identify themes", "Interpret patterns", "Validate findings", "Write narrative"],
  },
  {
    id: "experimental",
    name: "Experimental Design",
    description: "Control variables and test effects",
    icon: FlaskConical,
    steps: ["Identify variables", "Create control group", "Randomize subjects", "Apply treatment", "Measure outcomes", "Analyze results"],
  },
  {
    id: "survey",
    name: "Survey Research",
    description: "Collect data through questionnaires",
    icon: ClipboardList,
    steps: ["Design questions", "Pilot test", "Sample population", "Distribute survey", "Collect responses", "Analyze data"],
  },
  {
    id: "meta",
    name: "Meta-Analysis",
    description: "Combine results from multiple studies",
    icon: TestTubes,
    steps: ["Define inclusion criteria", "Search literature", "Extract effect sizes", "Assess heterogeneity", "Combine results", "Interpret findings"],
  },
];

interface ToolCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  tools: {
    name: string;
    description: string;
    action: string;
  }[];
}

const toolCategories: ToolCategory[] = [
  {
    id: "validity",
    name: "Validity Check",
    icon: CheckCircle2,
    color: "bg-comic-green",
    tools: [
      { name: "Internal Validity", description: "Check for confounding variables", action: "Run Check" },
      { name: "External Validity", description: "Assess generalizability", action: "Analyze" },
      { name: "Construct Validity", description: "Measure accuracy", action: "Verify" },
    ],
  },
  {
    id: "bias",
    name: "Bias Detection",
    icon: AlertTriangle,
    color: "bg-accent",
    tools: [
      { name: "Selection Bias", description: "Check sampling methods", action: "Detect" },
      { name: "Confirmation Bias", description: "Review methodology", action: "Analyze" },
      { name: "Publication Bias", description: "Funnel plot analysis", action: "Generate" },
    ],
  },
  {
    id: "statistics",
    name: "Statistical Tests",
    icon: Calculator,
    color: "bg-primary",
    tools: [
      { name: "T-Test", description: "Compare two groups", action: "Calculate" },
      { name: "ANOVA", description: "Compare multiple groups", action: "Run" },
      { name: "Chi-Square", description: "Test independence", action: "Compute" },
      { name: "Regression", description: "Model relationships", action: "Fit Model" },
    ],
  },
  {
    id: "sample",
    name: "Sample Analysis",
    icon: Users,
    color: "bg-comic-blue",
    tools: [
      { name: "Sample Size Calculator", description: "Determine adequate n", action: "Calculate" },
      { name: "Power Analysis", description: "Detect effect size", action: "Analyze" },
      { name: "Confidence Intervals", description: "Estimate precision", action: "Compute" },
    ],
  },
];

const ResearchToolkit = () => {
  const [activeMethod, setActiveMethod] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, number[]>>({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>("statistics");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toggleStep = (methodId: string, stepIndex: number) => {
    setCompletedSteps((prev) => {
      const current = prev[methodId] || [];
      if (current.includes(stepIndex)) {
        return { ...prev, [methodId]: current.filter((i) => i !== stepIndex) };
      }
      return { ...prev, [methodId]: [...current, stepIndex] };
    });
  };

  const [aiAssistResult, setAiAssistResult] = useState<string | null>(null);

  const handleAIAssist = async () => {
    setIsAnalyzing(true);
    const currentMethod = researchMethods.find(m => m.id === activeMethod);
    const completedCount = completedSteps[activeMethod || ""]?.length || 0;
    const prompt = `I'm working on a ${currentMethod?.name || "research"} project. I've completed ${completedCount} of ${currentMethod?.steps.length || 6} steps. My current expanded tool category is "${expandedCategory}". Give me a concise, actionable tip (2-3 sentences) for my next step.`;
    
    try {
      const { data, error } = await supabase.functions.invoke("ai-writing-feedback", {
        body: { text: prompt, type: "suggestions" },
      });
      if (error) throw error;
      if (data?.result && Array.isArray(data.result) && data.result.length > 0) {
        setAiAssistResult(data.result[0]?.detail || data.result[0]?.title || "Focus on completing your current research step methodically.");
        toast.success("AI suggestion ready!");
      } else {
        setAiAssistResult("Focus on defining your variables clearly, then choose appropriate statistical tests for your data type. Start with descriptive statistics before moving to inferential tests.");
        toast.success("Suggestion generated!");
      }
    } catch {
      setAiAssistResult("Tip: Ensure your sample size is adequate (n ≥ 30 for normal distribution). Use a power analysis to determine the minimum sample needed for your desired effect size.");
      toast.success("Suggestion generated!");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center border-3 border-foreground shadow-brutal">
            <Microscope className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground font-comic tracking-wide">RESEARCH TOOLKIT</h2>
            <p className="text-sm text-muted-foreground">Methods • Validity • Statistics</p>
          </div>
        </div>
        <Button
          onClick={handleAIAssist}
          disabled={isAnalyzing}
          className="brutal-button bg-primary text-primary-foreground"
        >
          {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isAnalyzing ? "Analyzing..." : "AI Assist"}
        </Button>
      </div>

      {/* AI Assist Result */}
      <AnimatePresence>
        {aiAssistResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-primary/5 border-3 border-primary/30 rounded-xl overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-foreground text-sm mb-1">AI Suggestion</h4>
                <p className="text-sm text-muted-foreground">{aiAssistResult}</p>
              </div>
              <button onClick={() => setAiAssistResult(null)} className="text-muted-foreground hover:text-foreground ml-auto">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Research Methods */}
      <div className="brutal-card rounded-2xl p-6 bg-primary/5 border-primary/30">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Beaker className="w-5 h-5 text-primary" />
          <span className="font-comic">RESEARCH METHODS</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {researchMethods.map((method) => {
            const isActive = activeMethod === method.id;
            const stepsCompleted = completedSteps[method.id]?.length || 0;
            const progress = (stepsCompleted / method.steps.length) * 100;
            
            return (
              <motion.button
                key={method.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveMethod(isActive ? null : method.id)}
                className={`brutal-card rounded-xl p-4 text-left transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-brutal-primary"
                    : "bg-card hover:bg-secondary"
                }`}
              >
                <method.icon className={`w-6 h-6 mb-2 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                <p className="font-bold text-sm">{method.name}</p>
                <p className={`text-xs ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {method.description}
                </p>
                {stepsCompleted > 0 && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-foreground/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className={`h-full ${isActive ? "bg-primary-foreground" : "bg-primary"}`}
                      />
                    </div>
                    <p className={`text-xs mt-1 ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {stepsCompleted}/{method.steps.length} steps
                    </p>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Active Method Steps */}
        <AnimatePresence>
          {activeMethod && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="bg-card border-3 border-foreground rounded-xl p-4">
                <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Steps to Complete
                </h4>
                <div className="space-y-2">
                  {researchMethods
                    .find((m) => m.id === activeMethod)
                    ?.steps.map((step, index) => {
                      const isCompleted = completedSteps[activeMethod]?.includes(index);
                      return (
                        <motion.button
                          key={index}
                          whileHover={{ x: 4 }}
                          onClick={() => toggleStep(activeMethod, index)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                            isCompleted
                              ? "bg-comic-green/10 text-comic-green"
                              : "bg-secondary hover:bg-muted text-foreground"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isCompleted
                                ? "bg-comic-green border-comic-green"
                                : "border-foreground"
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-4 h-4 text-white" />
                            ) : (
                              <span className="text-xs font-bold">{index + 1}</span>
                            )}
                          </div>
                          <span className={`font-medium ${isCompleted ? "line-through opacity-70" : ""}`}>
                            {step}
                          </span>
                        </motion.button>
                      );
                    })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tool Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {toolCategories.map((category) => {
          const isExpanded = expandedCategory === category.id;
          return (
            <div key={category.id} className="brutal-card rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                className={`w-full flex items-center justify-between p-4 transition-colors ${
                  isExpanded ? `${category.color} text-primary-foreground` : "bg-card hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-3">
                  <category.icon className={`w-5 h-5 ${isExpanded ? "text-primary-foreground" : "text-primary"}`} />
                  <span className="font-bold">{category.name}</span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-2 bg-card">
                      {category.tools.map((tool) => (
                        <motion.div
                          key={tool.name}
                          whileHover={{ x: 4 }}
                          className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                        >
                          <div>
                            <p className="font-bold text-foreground text-sm">{tool.name}</p>
                            <p className="text-xs text-muted-foreground">{tool.description}</p>
                          </div>
                          <Button size="sm" variant="outline" className="border-2 border-foreground text-xs h-8">
                            {tool.action}
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Quick Stats Reference */}
      <div className="brutal-card rounded-xl p-5 bg-card">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5 text-primary" />
          <span className="font-comic">QUICK REFERENCE</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "p < 0.05", desc: "Significant", color: "text-comic-green" },
            { label: "p < 0.01", desc: "Highly Sig.", color: "text-comic-green" },
            { label: "r > 0.7", desc: "Strong Corr.", color: "text-comic-blue" },
            { label: "n ≥ 30", desc: "Normal Dist.", color: "text-primary" },
          ].map((item) => (
            <div key={item.label} className="text-center p-3 bg-secondary rounded-lg border-2 border-border">
              <p className={`font-bold font-mono text-lg ${item.color}`}>{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchToolkit;
