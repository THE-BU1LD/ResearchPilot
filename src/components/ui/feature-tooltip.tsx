import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X, ChevronRight, Sparkles } from "lucide-react";

interface FeatureTooltipProps {
  title: string;
  description: string;
  tip?: string;
  step?: number;
  totalSteps?: number;
  onNext?: () => void;
  onDismiss?: () => void;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  isOpen?: boolean;
}

export function FeatureTooltip({
  title,
  description,
  tip,
  step,
  totalSteps,
  onNext,
  onDismiss,
  position = "bottom",
  children,
  isOpen = false,
}: FeatureTooltipProps) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-3",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-3",
    left: "right-full top-1/2 -translate-y-1/2 mr-3",
    right: "left-full top-1/2 -translate-y-1/2 ml-3",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-foreground",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-foreground",
    left: "left-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-foreground",
    right: "right-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-foreground",
  };

  return (
    <div className="relative inline-block">
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: position === "top" ? 10 : position === "bottom" ? -10 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`absolute z-50 ${positionClasses[position]}`}
          >
            <div
              className="w-72 p-4 bg-foreground text-background border-3 border-foreground relative"
              style={{ boxShadow: "4px 4px 0 hsl(var(--primary))" }}
            >
              {/* Arrow */}
              <div className={`absolute w-0 h-0 ${arrowClasses[position]}`} />
              
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h4 className="font-bold text-sm">{title}</h4>
                </div>
                {onDismiss && (
                  <button
                    onClick={onDismiss}
                    className="p-1 hover:bg-background/20 rounded transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Description */}
              <p className="text-xs opacity-90 mb-3">{description}</p>

              {/* Tip */}
              {tip && (
                <div className="flex items-start gap-2 p-2 bg-background/10 rounded mb-3">
                  <Lightbulb className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs">{tip}</p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between">
                {step && totalSteps && (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          i + 1 <= step ? "bg-primary" : "bg-background/30"
                        }`}
                      />
                    ))}
                  </div>
                )}
                {onNext && (
                  <button
                    onClick={onNext}
                    className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    Next <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface QuickTipProps {
  tip: string;
  className?: string;
}

export function QuickTip({ tip, className = "" }: QuickTipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 text-xs font-medium text-primary rounded ${className}`}
    >
      <Lightbulb className="w-3 h-3" />
      {tip}
    </motion.div>
  );
}

interface ProgressStepperProps {
  steps: { label: string; description?: string }[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function ProgressStepper({ steps, currentStep, onStepClick }: ProgressStepperProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <React.Fragment key={index}>
            <motion.button
              whileHover={onStepClick ? { scale: 1.05 } : {}}
              onClick={() => onStepClick?.(index)}
              disabled={!onStepClick}
              className={`flex flex-col items-center gap-1 ${onStepClick ? "cursor-pointer" : "cursor-default"}`}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? "hsl(var(--primary))"
                    : isActive
                    ? "hsl(var(--accent))"
                    : "hsl(var(--muted))",
                }}
                className={`w-8 h-8 border-2 border-foreground flex items-center justify-center font-bold text-sm ${
                  isCompleted || isActive ? "text-primary-foreground" : "text-muted-foreground"
                }`}
                style={{ boxShadow: isActive ? "var(--shadow-brutal-sm)" : "none" }}
              >
                {isCompleted ? "✓" : index + 1}
              </motion.div>
              <span className={`text-xs font-medium hidden sm:block ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </motion.button>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition-colors ${isCompleted ? "bg-primary" : "bg-muted"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
