import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  Lightbulb,
  FileText,
  Upload,
  Search,
  PenTool,
  BarChart3,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateType = 
  | "projects" 
  | "ideas" 
  | "writing" 
  | "data" 
  | "search" 
  | "citations"
  | "files"
  | "generic";

interface EmptyStateConfig {
  icon: typeof Sparkles;
  title: string;
  description: string;
  actionLabel: string;
  tips: string[];
  color: string;
}

const emptyStateConfigs: Record<EmptyStateType, EmptyStateConfig> = {
  projects: {
    icon: FileText,
    title: "No projects yet!",
    description: "Create your first research project and let us guide you through every step.",
    actionLabel: "Create Your First Project",
    tips: [
      "Start with a topic that genuinely interests you",
      "Don't worry about perfection - research is iterative",
      "Most students complete their first project in 2 weeks",
    ],
    color: "bg-primary",
  },
  ideas: {
    icon: Lightbulb,
    title: "Ready to brainstorm?",
    description: "Use AI-powered prompts to discover your perfect research question.",
    actionLabel: "Generate Ideas",
    tips: [
      "Start with 'What if...' questions",
      "Consider problems in your community",
      "Combine two different fields for unique insights",
    ],
    color: "bg-accent",
  },
  writing: {
    icon: PenTool,
    title: "Your blank canvas awaits",
    description: "Start writing and get real-time suggestions for clarity and flow.",
    actionLabel: "Start Writing",
    tips: [
      "Don't worry about the introduction first",
      "Write your methods section to get started",
      "Use headings to organize your thoughts",
    ],
    color: "bg-primary",
  },
  data: {
    icon: BarChart3,
    title: "No data uploaded yet",
    description: "Upload a CSV file to run statistical tests and create visualizations.",
    actionLabel: "Upload Data",
    tips: [
      "CSV format works best",
      "Make sure your column headers are clear",
      "Include at least 10 data points for meaningful analysis",
    ],
    color: "bg-comic-blue",
  },
  search: {
    icon: Search,
    title: "Search millions of papers",
    description: "Find relevant research from OpenAlex's database of academic publications.",
    actionLabel: "Start Searching",
    tips: [
      "Use specific keywords from your topic",
      "Filter by publication year for recent work",
      "Save papers that relate to your hypothesis",
    ],
    color: "bg-accent",
  },
  citations: {
    icon: Quote,
    title: "No citations yet",
    description: "Add sources and we'll generate properly formatted citations for you.",
    actionLabel: "Add Your First Citation",
    tips: [
      "Paste a DOI for automatic metadata",
      "We support MLA, APA, and Chicago formats",
      "Citations are saved to your project",
    ],
    color: "bg-primary",
  },
  files: {
    icon: Upload,
    title: "No files uploaded",
    description: "Upload PDFs, documents, or data files to enhance your research.",
    actionLabel: "Upload Files",
    tips: [
      "PDFs are great for literature review",
      "CSV files work for data analysis",
      "Images can be included in your paper",
    ],
    color: "bg-muted",
  },
  generic: {
    icon: Sparkles,
    title: "Nothing here yet",
    description: "Get started by taking your first action.",
    actionLabel: "Get Started",
    tips: [],
    color: "bg-primary",
  },
};

interface EmptyStateProps {
  type: EmptyStateType;
  onAction?: () => void;
  customTitle?: string;
  customDescription?: string;
  customActionLabel?: string;
  showTips?: boolean;
  className?: string;
}

export function EmptyState({
  type,
  onAction,
  customTitle,
  customDescription,
  customActionLabel,
  showTips = true,
  className = "",
}: EmptyStateProps) {
  const config = emptyStateConfigs[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.1 }}
        className={`w-20 h-20 ${config.color} border-3 border-foreground flex items-center justify-center mb-6`}
        style={{ boxShadow: "var(--shadow-brutal)" }}
      >
        <Icon className="w-10 h-10 text-primary-foreground" />
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-comic text-2xl mb-2"
      >
        {customTitle || config.title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground max-w-md mb-6"
      >
        {customDescription || config.description}
      </motion.p>

      {/* Action button */}
      {onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={onAction}
            className="brutal-button bg-primary text-primary-foreground"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {customActionLabel || config.actionLabel}
          </Button>
        </motion.div>
      )}

      {/* Tips */}
      {showTips && config.tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-muted/50 border-2 border-dashed border-muted-foreground/30 max-w-md"
        >
          <p className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1 justify-center">
            <Lightbulb className="w-3 h-3" />
            Pro Tips
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {config.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}

// Inline empty state for smaller areas
interface InlineEmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: typeof Sparkles;
  className?: string;
}

export function InlineEmptyState({
  message,
  actionLabel,
  onAction,
  icon: Icon = Sparkles,
  className = "",
}: InlineEmptyStateProps) {
  return (
    <div className={`flex items-center justify-center gap-3 py-6 px-4 border-2 border-dashed border-muted-foreground/30 ${className}`}>
      <div className="w-8 h-8 bg-muted flex items-center justify-center">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
        >
          {actionLabel}
          <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
