import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Circle, Lightbulb, BookMarked, BarChart3,
  PenTool, FileCheck, Send, Trophy, ChevronDown, ChevronUp, Sparkles,
} from "lucide-react";
import { FeatureExplainer } from "@/components/ui/feature-explainer";

interface Milestone {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  toolId?: string;
}

interface ResearchMilestonesProps {
  onNavigateTool?: (toolId: string) => void;
}

const DEFAULT_MILESTONES: Milestone[] = [
  { id: "topic", label: "Choose Topic", description: "Brainstorm and select your research question", icon: Lightbulb, completed: false, toolId: "ideas" },
  { id: "literature", label: "Literature Review", description: "Find and review 5+ relevant sources", icon: BookMarked, completed: false, toolId: "literature" },
  { id: "methodology", label: "Design Method", description: "Choose your research methodology", icon: BarChart3, completed: false, toolId: "toolkit" },
  { id: "data", label: "Collect Data", description: "Gather and organize your research data", icon: BarChart3, completed: false, toolId: "data" },
  { id: "draft", label: "Write First Draft", description: "Complete your initial paper draft", icon: PenTool, completed: false, toolId: "writing" },
  { id: "review", label: "Peer Review", description: "Get feedback from peers or grader", icon: FileCheck, completed: false, toolId: "grader" },
  { id: "finalize", label: "Finalize & Export", description: "Polish and export your final paper", icon: Send, completed: false, toolId: "export" },
];

const ResearchMilestones = memo(function ResearchMilestones({ onNavigateTool }: ResearchMilestonesProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    try {
      const saved = localStorage.getItem("rm_milestones_v1");
      return saved ? JSON.parse(saved) : DEFAULT_MILESTONES;
    } catch { return DEFAULT_MILESTONES; }
  });
  const [expanded, setExpanded] = useState(true);

  const toggleMilestone = (id: string) => {
    const updated = milestones.map(m =>
      m.id === id ? { ...m, completed: !m.completed } : m
    );
    setMilestones(updated);
    try { localStorage.setItem("rm_milestones_v1", JSON.stringify(updated)); } catch {}
  };

  const completedCount = milestones.filter(m => m.completed).length;
  const progress = Math.round((completedCount / milestones.length) * 100);

  return (
    <div className="border-3 border-foreground bg-card rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-brutal-sm)" }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center border-2 border-foreground">
            <Trophy className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="text-left">
            <p className="font-comic text-sm tracking-wide">MILESTONES</p>
            <p className="text-[10px] text-muted-foreground font-bold">{completedCount}/{milestones.length} complete</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Mini progress bar */}
          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden border border-foreground/20">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-xs font-bold text-muted-foreground">{progress}%</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-1">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                const isCompleted = milestone.completed;
                return (
                  <motion.div
                    key={milestone.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center gap-3 group"
                  >
                    {/* Timeline connector */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => toggleMilestone(milestone.id)}
                        className="relative z-10"
                      >
                        {isCompleted ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                          </motion.div>
                        ) : (
                          <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                        )}
                      </button>
                      {index < milestones.length - 1 && (
                        <div className={`w-0.5 h-6 ${isCompleted ? "bg-primary" : "bg-muted"}`} />
                      )}
                    </div>

                    {/* Content */}
                    <button
                      onClick={() => milestone.toolId && onNavigateTool?.(milestone.toolId)}
                      className={`flex-1 text-left px-3 py-2 rounded-lg transition-colors ${
                        isCompleted ? "opacity-60" : "hover:bg-secondary"
                      }`}
                    >
                      <p className={`text-sm font-bold ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {milestone.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{milestone.description}</p>
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Celebration */}
            {progress === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-4 mb-4 p-3 bg-primary/10 border-2 border-primary/30 rounded-lg text-center"
              >
                <Sparkles className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="font-comic text-sm text-primary">ALL MILESTONES COMPLETE!</p>
                <p className="text-[10px] text-muted-foreground">Time to export your paper</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default ResearchMilestones;
