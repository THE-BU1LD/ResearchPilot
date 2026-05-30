import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X, Info, Lightbulb, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ExplainerType = "info" | "tip" | "warning" | "success";

interface FeatureExplainerProps {
  title: string;
  description: string;
  type?: ExplainerType;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  iconSize?: number;
}

const typeConfig: Record<ExplainerType, { icon: typeof Info; color: string; bgColor: string }> = {
  info: { icon: Info, color: "text-primary", bgColor: "bg-primary/10 border-primary/30" },
  tip: { icon: Lightbulb, color: "text-accent", bgColor: "bg-accent/10 border-accent/30" },
  warning: { icon: AlertCircle, color: "text-yellow-500", bgColor: "bg-yellow-500/10 border-yellow-500/30" },
  success: { icon: CheckCircle2, color: "text-comic-green", bgColor: "bg-comic-green/10 border-comic-green/30" },
};

export const FeatureExplainer = memo(function FeatureExplainer({
  title,
  description,
  type = "info",
  position = "top",
  className = "",
  iconSize = 16,
}: FeatureExplainerProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            className={`inline-flex items-center justify-center rounded-full p-1 border-2 border-foreground/20 hover:border-foreground/40 transition-colors ${config.bgColor} ${className}`}
            aria-label={`Learn more about ${title}`}
          >
            <Icon className={`${config.color}`} style={{ width: iconSize, height: iconSize }} />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent
          side={position}
          className="brutal-card max-w-xs p-3 bg-card border-2 border-foreground shadow-brutal-sm z-50"
        >
          <div className="space-y-1">
            <p className="font-bold text-foreground text-sm flex items-center gap-2">
              <Icon className={`w-4 h-4 ${config.color}`} />
              {title}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

// Inline explainer badge for feature names
interface FeatureBadgeProps {
  name: string;
  explanation: string;
  icon?: React.ElementType;
  variant?: "default" | "primary" | "accent" | "muted";
  className?: string;
}

export const FeatureBadge = memo(function FeatureBadge({
  name,
  explanation,
  icon: CustomIcon,
  variant = "default",
  className = "",
}: FeatureBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const variantStyles = {
    default: "bg-card border-foreground/30 text-foreground",
    primary: "bg-primary/10 border-primary/40 text-primary",
    accent: "bg-accent/10 border-accent/40 text-accent-foreground",
    muted: "bg-muted border-muted-foreground/20 text-muted-foreground",
  };

  return (
    <motion.div
      layout
      className={`inline-flex items-center gap-2 px-3 py-1.5 border-2 rounded cursor-pointer transition-colors hover:shadow-brutal-sm ${variantStyles[variant]} ${className}`}
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {CustomIcon && <CustomIcon className="w-4 h-4" />}
      <span className="text-sm font-bold">{name}</span>
      <motion.div
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <HelpCircle className="w-3.5 h-3.5 opacity-60" />
      </motion.div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <span className="text-xs text-muted-foreground whitespace-nowrap pl-2 border-l border-foreground/20">
              {explanation}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// Expandable info card for complex features
interface FeatureInfoCardProps {
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: React.ElementType;
  features?: string[];
  className?: string;
}

export const FeatureInfoCard = memo(function FeatureInfoCard({
  title,
  shortDescription,
  fullDescription,
  icon: Icon,
  features = [],
  className = "",
}: FeatureInfoCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      layout
      className={`brutal-card p-4 bg-card cursor-pointer group ${className}`}
      onClick={() => setIsOpen(!isOpen)}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border-2 border-foreground flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-foreground">{title}</h4>
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              className="text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </motion.div>
          </div>
          <p className="text-sm text-muted-foreground">{shortDescription}</p>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-foreground/10 space-y-3">
              <p className="text-sm text-foreground">{fullDescription}</p>
              {features.length > 0 && (
                <ul className="space-y-1">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3 h-3 text-comic-green shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// Quick help button that opens modal with feature guide
interface QuickHelpProps {
  children: React.ReactNode;
  className?: string;
}

export const QuickHelp = memo(function QuickHelp({
  children,
  className = "",
}: QuickHelpProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary border-3 border-foreground shadow-brutal flex items-center justify-center text-primary-foreground hover:shadow-brutal-lg transition-shadow ${className}`}
        aria-label="Quick help"
      >
        <HelpCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-24 right-6 z-50 w-80 max-h-[60vh] overflow-auto brutal-card bg-card p-5 rounded-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-comic text-xl text-foreground">Quick Help</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

export default FeatureExplainer;
