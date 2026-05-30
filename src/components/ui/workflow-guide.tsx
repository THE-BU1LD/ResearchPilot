import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  Circle, 
  Lightbulb,
  BookOpen,
  Database,
  BarChart3,
  PenTool,
  Sparkles,
  ArrowRight,
  Clock,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  tool: string;
  icon: typeof Lightbulb;
  tips: string[];
  estimatedTime: string;
  isCompleted?: boolean;
}

const defaultWorkflowSteps: WorkflowStep[] = [
  {
    id: "ideate",
    title: "1. Brainstorm Your Topic",
    description: "Start with the Idea Generator to find a research question that excites you.",
    tool: "ideas",
    icon: Lightbulb,
    tips: [
      "Use 'Find Research Gaps' for unexplored questions",
      "Consider problems in your local community",
      "Check novelty and feasibility scores",
    ],
    estimatedTime: "30 min",
  },
  {
    id: "review",
    title: "2. Review Literature",
    description: "Search for existing papers and build your literature review foundation.",
    tool: "search",
    icon: BookOpen,
    tips: [
      "Start with broad searches, then narrow down",
      "Save papers that are highly relevant",
      "Look for gaps in existing research",
    ],
    estimatedTime: "2-3 hours",
  },
  {
    id: "collect",
    title: "3. Collect Data",
    description: "Gather your research data and organize it for analysis.",
    tool: "data",
    icon: Database,
    tips: [
      "Upload CSV files for automatic processing",
      "Keep data organized in clear columns",
      "Document your collection methodology",
    ],
    estimatedTime: "Varies",
  },
  {
    id: "analyze",
    title: "4. Analyze Results",
    description: "Run statistical tests and create visualizations to understand your data.",
    tool: "data",
    icon: BarChart3,
    tips: [
      "Start with descriptive statistics",
      "Choose the right test for your hypothesis",
      "Export charts for your paper",
    ],
    estimatedTime: "1-2 hours",
  },
  {
    id: "write",
    title: "5. Write Your Paper",
    description: "Draft, refine, and polish your research paper with AI assistance.",
    tool: "writing",
    icon: PenTool,
    tips: [
      "Start with an outline",
      "Use AI for grammar and clarity suggestions",
      "Don't forget to cite your sources!",
    ],
    estimatedTime: "3-5 hours",
  },
];

interface WorkflowGuideProps {
  steps?: WorkflowStep[];
  onNavigateToTool?: (toolId: string) => void;
  className?: string;
}

export function WorkflowGuide({ 
  steps = defaultWorkflowSteps, 
  onNavigateToTool,
  className = "",
}: WorkflowGuideProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(steps[0]?.id || null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const markComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    } else {
      setCompletedSteps(completedSteps.filter(id => id !== stepId));
    }
  };

  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-comic text-lg">Your Research Journey</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary"
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {completedSteps.length}/{steps.length}
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isExpanded = expandedStep === step.id;
          const isCompleted = completedSteps.includes(step.id);
          
          return (
            <motion.div
              key={step.id}
              initial={false}
              animate={{ 
                borderColor: isExpanded ? "hsl(var(--primary))" : "hsl(var(--border))",
              }}
              className="border-2 bg-card overflow-hidden transition-colors"
              style={{ boxShadow: isExpanded ? "var(--shadow-brutal-sm)" : "none" }}
            >
              {/* Step header */}
              <button
                onClick={() => toggleStep(step.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    markComplete(step.id);
                  }}
                  className="flex-shrink-0"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                </motion.div>
                
                <div className={`w-8 h-8 flex items-center justify-center border-2 border-foreground ${
                  isCompleted ? "bg-primary" : "bg-muted"
                }`}>
                  <Icon className={`w-4 h-4 ${isCompleted ? "text-primary-foreground" : "text-foreground"}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold text-sm ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {step.estimatedTime}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 border-t border-border">
                      {/* Tips */}
                      <div className="space-y-2 mb-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Pro Tips
                        </p>
                        {step.tips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-primary">•</span>
                            <span className="text-muted-foreground">{tip}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action button */}
                      <Button
                        onClick={() => onNavigateToTool?.(step.tool)}
                        size="sm"
                        className="w-full brutal-button bg-primary text-primary-foreground"
                      >
                        Open {step.title.split('.')[1]?.trim() || step.title}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Compact version for sidebar
export function WorkflowMiniGuide({ 
  currentTool,
  onNavigateToTool,
}: { 
  currentTool?: string;
  onNavigateToTool?: (toolId: string) => void;
}) {
  const currentIndex = defaultWorkflowSteps.findIndex(s => s.tool === currentTool);
  const nextStep = defaultWorkflowSteps[currentIndex + 1];

  if (!nextStep) return null;

  const Icon = nextStep.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 border-2 border-primary/30 bg-primary/5"
    >
      <p className="text-xs font-bold text-muted-foreground uppercase mb-2">
        Next Step
      </p>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-primary/20 border border-primary/30 flex items-center justify-center">
          <Icon className="w-3 h-3 text-primary" />
        </div>
        <span className="text-sm font-medium">{nextStep.title}</span>
      </div>
      <button
        onClick={() => onNavigateToTool?.(nextStep.tool)}
        className="text-xs text-primary font-bold flex items-center gap-1 hover:underline"
      >
        Go to {nextStep.title.split('.')[1]?.trim()}
        <ArrowRight className="w-3 h-3" />
      </button>
    </motion.div>
  );
}
