import { useState, useEffect, useCallback, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, PenTool, Lightbulb, BookMarked, BarChart3, Quote,
  Workflow, Microscope, Users, Download, Beaker, BookOpen,
  Command, Zap, FileText, Settings, Moon, Sun, ArrowRight, ShieldCheck,
} from "lucide-react";

interface CommandAction {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  category: "tool" | "action" | "navigation";
  keywords: string[];
  onSelect: () => void;
}

interface CommandPaletteProps {
  onNavigateTool: (toolId: string) => void;
  onToggleTheme?: () => void;
}

const CommandPalette = memo(function CommandPalette({ onNavigateTool, onToggleTheme }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: CommandAction[] = [
    { id: "writing", label: "Writing Studio", description: "Draft & refine your paper", icon: PenTool, category: "tool", keywords: ["write", "draft", "essay", "paper"], onSelect: () => onNavigateTool("writing") },
    { id: "ideas", label: "Idea Generator", description: "Brainstorm research ideas", icon: Lightbulb, category: "tool", keywords: ["brainstorm", "idea", "topic"], onSelect: () => onNavigateTool("ideas") },
    { id: "literature", label: "Literature Review", description: "Manage sources", icon: BookMarked, category: "tool", keywords: ["source", "literature", "review", "paper"], onSelect: () => onNavigateTool("literature") },
    { id: "data", label: "Advanced Statistics", description: "Analyze your data", icon: BarChart3, category: "tool", keywords: ["data", "stats", "chart", "graph", "analyze"], onSelect: () => onNavigateTool("data") },
    { id: "grader", label: "Research Grader", description: "Evaluate paper quality", icon: Microscope, category: "tool", keywords: ["grade", "evaluate", "quality", "score"], onSelect: () => onNavigateTool("grader") },
    { id: "toolkit", label: "Research Toolkit", description: "Methods & statistical tests", icon: Beaker, category: "tool", keywords: ["method", "toolkit", "test", "anova", "ttest"], onSelect: () => onNavigateTool("toolkit") },
    { id: "subjects", label: "Subject Tools", description: "Field-specific tools", icon: BookOpen, category: "tool", keywords: ["subject", "field", "specific"], onSelect: () => onNavigateTool("subjects") },
    { id: "pipeline", label: "Node Pipeline", description: "Build data workflows", icon: Workflow, category: "tool", keywords: ["pipeline", "workflow", "node", "automate"], onSelect: () => onNavigateTool("pipeline") },
    { id: "collaborate", label: "Collaboration Hub", description: "Work with your team", icon: Users, category: "tool", keywords: ["team", "collaborate", "share"], onSelect: () => onNavigateTool("collaborate") },
    { id: "export", label: "Export Center", description: "Download & share", icon: Download, category: "tool", keywords: ["export", "download", "pdf", "latex"], onSelect: () => onNavigateTool("export") },
    { id: "integrity", label: "Integrity Center", description: "Plagiarism & ethics review", icon: ShieldCheck, category: "tool", keywords: ["plagiarism", "ethics", "integrity", "citation"], onSelect: () => onNavigateTool("integrity") },
    { id: "citations", label: "Citations", description: "Generate references", icon: Quote, category: "tool", keywords: ["cite", "citation", "reference", "apa", "mla"], onSelect: () => onNavigateTool("citations") },
    { id: "search", label: "Paper Search", description: "Find research papers", icon: Search, category: "tool", keywords: ["search", "find", "paper", "journal"], onSelect: () => onNavigateTool("search") },
  ];

  const filtered = query.trim()
    ? actions.filter(a => {
        const q = query.toLowerCase();
        return a.label.toLowerCase().includes(q) ||
               a.description.toLowerCase().includes(q) ||
               a.keywords.some(k => k.includes(q));
      })
    : actions;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen(prev => !prev);
      setQuery("");
    }
    if (e.key === "Escape") setOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleSelect = (action: CommandAction) => {
    action.onSelect();
    setOpen(false);
    setQuery("");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="relative w-full max-w-lg border-3 border-foreground bg-card overflow-hidden"
            style={{ boxShadow: "var(--shadow-brutal-lg)" }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b-3 border-foreground">
              <Command className="w-5 h-5 text-primary flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search tools, actions..."
                className="flex-1 bg-transparent outline-none text-foreground font-medium placeholder:text-muted-foreground"
              />
              <kbd className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-mono font-bold bg-muted border-2 border-foreground/20 text-muted-foreground">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="font-bold">No results found</p>
                  <p className="text-sm">Try a different search term</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {filtered.map((action, index) => {
                    const Icon = action.icon;
                    const isSelected = index === selectedIndex;
                    return (
                      <motion.button
                        key={action.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => handleSelect(action)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                          isSelected ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 ${
                          isSelected ? "border-primary-foreground/30 bg-primary-foreground/10" : "border-foreground/20 bg-muted"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{action.label}</p>
                          <p className={`text-xs truncate ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {action.description}
                          </p>
                        </div>
                        <ArrowRight className={`w-4 h-4 flex-shrink-0 ${isSelected ? "opacity-100" : "opacity-0"}`} />
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t-3 border-foreground/20 flex items-center gap-4 text-[10px] text-muted-foreground font-bold uppercase">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-muted border rounded font-mono">↑↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-muted border rounded font-mono">↵</kbd> Select
              </span>
              <span className="flex items-center gap-1 ml-auto">
                <kbd className="px-1 py-0.5 bg-muted border rounded font-mono">⌘K</kbd> Toggle
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default CommandPalette;
