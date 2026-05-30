import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Send, 
  Lightbulb, 
  MessageSquare,
  Wand2,
  ChevronUp,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Suggestion {
  id: string;
  text: string;
  category: string;
}

interface SmartPromptProps {
  placeholder?: string;
  suggestions?: Suggestion[];
  onSubmit: (value: string) => void;
  isLoading?: boolean;
  className?: string;
  showSuggestions?: boolean;
}

const defaultSuggestions: Suggestion[] = [
  { id: "1", text: "What unexplored questions exist in renewable energy?", category: "Research Gaps" },
  { id: "2", text: "How can I connect psychology and technology?", category: "Combine Fields" },
  { id: "3", text: "What problems affect my local community?", category: "Local Impact" },
  { id: "4", text: "How can current AI solutions be improved?", category: "Innovation" },
  { id: "5", text: "What are emerging topics in environmental science?", category: "Trending" },
  { id: "6", text: "Help me refine my research question about...", category: "Refinement" },
];

export function SmartPrompt({
  placeholder = "Describe what you want to research...",
  suggestions = defaultSuggestions,
  onSubmit,
  isLoading = false,
  className = "",
  showSuggestions = true,
}: SmartPromptProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    if (value.trim() && !isLoading) {
      onSubmit(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setValue(suggestion.text);
    textareaRef.current?.focus();
  };

  const visibleSuggestions = showAllSuggestions ? suggestions : suggestions.slice(0, 3);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main input */}
      <div
        className={`relative border-3 border-foreground bg-card transition-all ${
          isFocused ? "ring-2 ring-primary" : ""
        }`}
        style={{ boxShadow: isFocused ? "var(--shadow-brutal)" : "var(--shadow-brutal-sm)" }}
      >
        <div className="flex items-start gap-3 p-4">
          <div className="w-8 h-8 bg-primary/10 border-2 border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Wand2 className="w-4 h-4 text-primary" />
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className="flex-1 bg-transparent resize-none focus:outline-none text-foreground placeholder:text-muted-foreground font-medium min-h-[24px]"
          />
          <Button
            onClick={handleSubmit}
            disabled={!value.trim() || isLoading}
            size="sm"
            className="brutal-button bg-primary text-primary-foreground flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Character count */}
        <div className="absolute bottom-2 right-14 text-xs text-muted-foreground">
          {value.length}/500
        </div>
      </div>

      {/* Suggestions */}
      {showSuggestions && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              Quick Prompts
            </p>
            {suggestions.length > 3 && (
              <button
                onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
              >
                {showAllSuggestions ? (
                  <>Show less <ChevronUp className="w-3 h-3" /></>
                ) : (
                  <>Show more <ChevronDown className="w-3 h-3" /></>
                )}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {visibleSuggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 text-xs font-medium border-2 border-foreground bg-card hover:bg-primary hover:text-primary-foreground transition-all group"
                  style={{ boxShadow: "var(--shadow-brutal-sm)" }}
                >
                  <span className="opacity-60 group-hover:opacity-100 mr-1">
                    {suggestion.category}:
                  </span>
                  <span className="truncate max-w-[200px] inline-block align-bottom">
                    {suggestion.text.slice(0, 40)}...
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline AI assistant component
interface AIAssistantBubbleProps {
  message: string;
  isVisible: boolean;
  onAction?: () => void;
  actionLabel?: string;
  onDismiss?: () => void;
}

export function AIAssistantBubble({
  message,
  isVisible,
  onAction,
  actionLabel = "Try it",
  onDismiss,
}: AIAssistantBubbleProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="flex items-start gap-3 p-4 bg-primary/10 border-2 border-primary/30"
        >
          <div className="w-8 h-8 bg-primary border-2 border-foreground flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-foreground mb-2">{message}</p>
            <div className="flex items-center gap-2">
              {onAction && (
                <button
                  onClick={onAction}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  {actionLabel} →
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Contextual help component
interface ContextualHelpProps {
  title: string;
  description: string;
  examples?: string[];
  className?: string;
}

export function ContextualHelp({ title, description, examples, className = "" }: ContextualHelpProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`border-l-4 border-primary pl-4 ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-left w-full"
      >
        <MessageSquare className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="font-bold text-sm">{title}</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
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
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
            {examples && examples.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-xs font-bold text-muted-foreground">Examples:</p>
                {examples.map((example, i) => (
                  <p key={i} className="text-xs text-muted-foreground pl-2">• {example}</p>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
