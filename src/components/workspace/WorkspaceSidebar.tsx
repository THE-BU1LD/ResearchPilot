import { useState, useMemo, useCallback, memo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { WorkflowMiniGuide } from "@/components/ui/workflow-guide";
import {
  BookOpen,
  File,
  X,
  PenTool,
  Lightbulb,
  BookMarked,
  BarChart3,
  Quote,
  Search,
  Zap,
  Workflow,
  Microscope,
  Users,
  Download,
  Beaker,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  Keyboard, ShieldCheck,
  ShieldCheck,
} from "lucide-react";

interface UploadedFile {
  name: string;
  type: string;
  size: string;
}

interface WorkspaceSidebarProps {
  sidebarOpen: boolean;
  activeTool: string;
  setActiveTool: (tool: string) => void;
  setShowUploader: (show: boolean) => void;
  uploadedFiles: UploadedFile[];
  removeFile: (index: number) => void;
}

const tools = [
  { id: "writing", label: "Writing Studio", icon: PenTool, description: "Draft & refine", color: "hsl(0 85% 55%)", tip: "AI helps you write better, not write for you", shortcut: "1" },
  { id: "ideas", label: "Idea Generation", icon: Lightbulb, description: "Brainstorm", color: "hsl(45 95% 50%)", tip: "Start with 'What if...' questions", shortcut: "2" },
  { id: "literature", label: "Literature Review", icon: BookMarked, description: "Sources", color: "hsl(270 70% 55%)", tip: "Save papers relevant to your hypothesis", shortcut: "3" },
  { id: "data", label: "Advanced Statistics", icon: BarChart3, description: "Analyze Data", color: "hsl(0 85% 55%)", tip: "Upload CSV for automatic analysis", shortcut: "4" },
  { id: "grader", label: "Research Grader", icon: Microscope, description: "Evaluate Quality", color: "hsl(145 70% 45%)", tip: "Get feedback before submission", shortcut: "5" },
  { id: "toolkit", label: "Research Toolkit", icon: Beaker, description: "Methods & Tests", color: "hsl(185 80% 45%)", tip: "Choose the right methodology", shortcut: "6" },
  { id: "subjects", label: "Subject Tools", icon: BookOpen, description: "Field-Specific", color: "hsl(210 100% 55%)", tip: "Tools tailored to your field", shortcut: "7" },
  { id: "pipeline", label: "Pipelines", icon: Workflow, description: "Automate", color: "hsl(330 80% 55%)", tip: "Build custom data workflows", shortcut: "8" },
  { id: "collaborate", label: "Collaboration", icon: Users, description: "Team Work", color: "hsl(25 95% 55%)", tip: "Invite teammates to contribute", shortcut: "9" },
  { id: "export", label: "Export Center", icon: Download, description: "Download & Share", color: "hsl(145 70% 45%)", tip: "Export in multiple formats", shortcut: "0" },
  { id: "professors", label: "Professor Lookup", icon: Sparkles, description: "Find Mentors", color: "hsl(45 95% 50%)", tip: "Find research mentors at top universities", shortcut: "-" },
  { id: "integrity", label: "Integrity", icon: ShieldCheck, description: "Plagiarism & Ethics", color: "hsl(210 100% 55%)", tip: "Check originality and ethics before submission", shortcut: "i" },
  { id: "citations", label: "Citations", icon: Quote, description: "References", color: "hsl(270 70% 55%)", tip: "Auto-format MLA/APA/Chicago", shortcut: "=" },
  { id: "search", label: "Paper Search", icon: Search, description: "Find papers", color: "hsl(210 100% 55%)", tip: "Search millions of papers", shortcut: "+" },
];

// Memoized tool button component
const ToolButton = memo(function ToolButton({
  tool,
  isActive,
  index,
  onClick,
}: {
  tool: typeof tools[0];
  isActive: boolean;
  index: number;
  onClick: () => void;
}) {
  const Icon = tool.icon;

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative gpu-accelerate ${
        isActive
          ? "bg-primary text-primary-foreground border-3 border-foreground shadow-brutal-sm"
          : "hover:bg-secondary border-3 border-transparent hover:border-border"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 border-2 border-foreground`}
        style={{ backgroundColor: isActive ? "rgba(255,255,255,0.2)" : tool.color }}
      >
        <Icon className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-white"}`} />
      </div>
      <div className="text-left flex-1 min-w-0">
        <p className={`text-sm font-bold truncate ${isActive ? "text-primary-foreground" : "text-foreground"}`}>
          {tool.label}
        </p>
        <p className={`text-xs truncate ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {tool.description}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
          isActive ? "border-primary-foreground/30 text-primary-foreground/60" : "border-foreground/20 text-muted-foreground"
        }`}>
          {tool.shortcut}
        </span>
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 rounded-full bg-primary-foreground"
          />
        )}
      </div>
    </motion.button>
  );
});

const WorkspaceSidebar = memo(function WorkspaceSidebar({
  sidebarOpen,
  activeTool,
  setActiveTool,
  setShowUploader,
  uploadedFiles,
  removeFile,
}: WorkspaceSidebarProps) {
  const [showTips, setShowTips] = useState(true);
  const [showWorkflowGuide, setShowWorkflowGuide] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const activeTip = useMemo(() => tools.find(t => t.id === activeTool)?.tip, [activeTool]);

  const handleToolClick = useCallback((toolId: string) => {
    setActiveTool(toolId);
    setShowUploader(false);
  }, [setActiveTool, setShowUploader]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      const shortcutMap: Record<string, string> = {
        "1": "writing", "2": "ideas", "3": "literature", "4": "data",
        "5": "grader", "6": "toolkit", "7": "subjects", "8": "pipeline",
        "9": "collaborate", "0": "export", "-": "professors", "=": "citations",
      };

      if (shortcutMap[e.key]) {
        e.preventDefault();
        handleToolClick(shortcutMap[e.key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleToolClick]);

  return (
    <aside
      className={`flex-shrink-0 transition-all duration-300 bg-card border-r-3 border-foreground ${
        sidebarOpen ? "w-72" : "w-0 overflow-hidden"
      }`}
    >
      <div className="p-4 h-full flex flex-col comic-dots overflow-y-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-6 group">
          <motion.div 
            whileHover={{ rotate: 6, scale: 1.05 }}
            className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center border-3 border-foreground shadow-brutal group-hover:shadow-none group-hover:translate-x-[3px] group-hover:translate-y-[3px] transition-all"
          >
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <div>
            <span className="font-bold text-foreground font-comic text-lg tracking-wide">ResearchLab</span>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-xs text-muted-foreground font-bold uppercase">Pro Mode</span>
            </div>
          </div>
        </Link>

        {/* Keyboard shortcuts toggle */}
        <button
          onClick={() => setShowShortcuts(!showShortcuts)}
          className="mb-4 flex items-center gap-2 px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
        >
          <Keyboard className="w-3 h-3" />
          Shortcuts
          {showShortcuts ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
        </button>

        <AnimatePresence>
          {showShortcuts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="p-3 bg-muted/50 border-2 border-foreground/20 rounded-lg text-xs text-muted-foreground">
                <p className="font-bold text-foreground mb-2">Quick Keys:</p>
                <p>Press <kbd className="px-1 py-0.5 bg-background border rounded font-mono">1-0</kbd> to switch tools</p>
                <p className="mt-1">Use <kbd className="px-1 py-0.5 bg-background border rounded font-mono">-</kbd> and <kbd className="px-1 py-0.5 bg-background border rounded font-mono">=</kbd> for Citations & Search</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current tool tip */}
        <AnimatePresence>
          {showTips && activeTip && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="p-3 bg-primary/10 border-2 border-primary/30 rounded-lg relative">
                <button
                  onClick={() => setShowTips(false)}
                  className="absolute top-1 right-1 p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground font-medium pr-4">{activeTip}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tools Navigation */}
        <nav className="space-y-1.5 flex-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-3 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Tools
          </p>
          {tools.map((tool, index) => (
            <ToolButton
              key={tool.id}
              tool={tool}
              isActive={activeTool === tool.id}
              index={index}
              onClick={() => handleToolClick(tool.id)}
            />
          ))}
        </nav>

        {/* Workflow mini guide */}
        <div className="border-t-3 border-foreground pt-4 mt-4">
          <button
            onClick={() => setShowWorkflowGuide(!showWorkflowGuide)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
          >
            <span className="flex items-center gap-2">
              <Target className="w-3 h-3 text-primary" />
              Workflow Guide
            </span>
            {showWorkflowGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          <AnimatePresence>
            {showWorkflowGuide && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <WorkflowMiniGuide
                  currentTool={activeTool}
                  onNavigateToTool={setActiveTool}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="border-t-3 border-foreground pt-4 mt-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-3 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full" />
              Files ({uploadedFiles.length})
            </p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary rounded-lg group transition-colors"
                >
                  <div className="w-7 h-7 rounded-md bg-secondary border-2 border-border flex items-center justify-center flex-shrink-0">
                    <File className="w-4 h-4 text-primary" />
                  </div>
                  <span className="truncate flex-1 font-medium">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="w-6 h-6 rounded-md hover:bg-destructive/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-destructive" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Help button */}
        <div className="pt-4 mt-auto">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors border-2 border-transparent hover:border-foreground/20"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="font-medium">Need help?</span>
          </motion.button>
        </div>
      </div>
    </aside>
  );
});

export default WorkspaceSidebar;
