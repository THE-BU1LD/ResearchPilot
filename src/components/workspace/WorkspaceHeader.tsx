import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import {
  ChevronLeft,
  Menu,
  Sparkles,
  Check,
  Zap,
  HelpCircle,
  Play,
  Target,
  ArrowRight,
  X,
} from "lucide-react";

interface WorkspaceHeaderProps {
  projectName: string;
  isNewProject: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const quickActions = [
  { id: "ideas", label: "Generate Ideas", icon: Sparkles, color: "bg-accent" },
  { id: "search", label: "Find Papers", icon: Target, color: "bg-comic-blue" },
  { id: "writing", label: "Start Writing", icon: ArrowRight, color: "bg-primary" },
];

const WorkspaceHeader = ({ projectName, isNewProject, sidebarOpen, setSidebarOpen }: WorkspaceHeaderProps) => {
  const [showQuickStart, setShowQuickStart] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card border-b-3 border-foreground">
      <div className="h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-secondary hover:bg-primary/10 transition-colors border-2 border-foreground shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <div className="h-8 w-1 bg-foreground rounded-full hidden sm:block" />
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline text-sm font-bold uppercase tracking-wide">Projects</span>
          </Link>
          <div className="h-8 w-1 bg-foreground rounded-full hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex w-6 h-6 rounded-md bg-primary/20 items-center justify-center">
              <Zap className="w-3 h-3 text-primary" />
            </div>
            <h1 className="text-sm font-bold text-foreground truncate max-w-[200px] sm:max-w-none uppercase tracking-wide">
              {isNewProject ? projectName : "Climate Change Impact Study"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick start guide toggle */}
          <button
            onClick={() => setShowQuickStart(!showQuickStart)}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase transition-all border-2 ${
              showQuickStart 
                ? "bg-primary text-primary-foreground border-foreground" 
                : "bg-card text-muted-foreground border-foreground/30 hover:border-foreground"
            }`}
          >
            <Play className="w-3 h-3" />
            Quick Start
          </button>

          <ThemeSwitcher />
          
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex border-2 border-foreground shadow-brutal-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            AI Assist
          </Button>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              size="sm" 
              className="brutal-button bg-primary text-primary-foreground font-bold uppercase tracking-wide"
            >
              <Check className="w-4 h-4 mr-1" />
              Save
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Quick start panel */}
      <AnimatePresence>
        {showQuickStart && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-foreground/20"
          >
            <div className="p-4 bg-muted/50">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  What would you like to do?
                </p>
                <button
                  onClick={() => setShowQuickStart(false)}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={action.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 px-4 py-2 ${action.color} text-white border-2 border-foreground font-bold text-sm`}
                      style={{ boxShadow: "var(--shadow-brutal-sm)" }}
                    >
                      <Icon className="w-4 h-4" />
                      {action.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Comic accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
    </header>
  );
};

export default WorkspaceHeader;
