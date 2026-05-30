import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ComicSkeleton } from "@/components/ui/comic-skeleton";
import { supabase } from "@/integrations/supabase/client";
import { SmartPrompt, AIAssistantBubble, ContextualHelp } from "@/components/ui/smart-prompt";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Lightbulb,
  Sparkles,
  RefreshCw,
  Save,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Brain,
  Target,
  Users,
  Microscope,
  TrendingUp,
  Zap,
  MessageSquare,
  Check,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Star,
} from "lucide-react";

interface ResearchIdea {
  id: string;
  title: string;
  description: string;
  methodology: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  timeEstimate: string;
  tags: string[];
  novelty: number;
  feasibility: number;
}

const promptTemplates = [
  {
    id: "gap",
    label: "Find Research Gaps",
    icon: Target,
    prompt: "What unexplored questions exist in...",
    color: "bg-primary",
    description: "Discover overlooked areas in your field",
  },
  {
    id: "combine",
    label: "Combine Fields",
    icon: Brain,
    prompt: "How can I connect different disciplines...",
    color: "bg-accent",
    description: "Create interdisciplinary research",
  },
  {
    id: "local",
    label: "Local Impact",
    icon: Users,
    prompt: "What problems affect my community...",
    color: "bg-comic-blue",
    description: "Research that matters to you",
  },
  {
    id: "innovate",
    label: "Improve Existing",
    icon: TrendingUp,
    prompt: "How can current solutions be enhanced...",
    color: "bg-comic-green",
    description: "Build on what already exists",
  },
];

const sampleIdeas: ResearchIdea[] = [
  {
    id: "1",
    title: "Impact of Blue Light on Adolescent Sleep Quality",
    description: "Investigate how screen time before bed affects sleep patterns in teenagers, with focus on measurable sleep quality metrics.",
    methodology: "Survey + Sleep tracking app data analysis",
    difficulty: "beginner",
    timeEstimate: "2-3 months",
    tags: ["Psychology", "Health", "Technology"],
    novelty: 7,
    feasibility: 9,
  },
  {
    id: "2",
    title: "Microplastics in Local Water Sources",
    description: "Analyze the presence and concentration of microplastics in local drinking water and potential filtration methods.",
    methodology: "Lab analysis + Comparative study",
    difficulty: "intermediate",
    timeEstimate: "3-4 months",
    tags: ["Environmental", "Chemistry", "Public Health"],
    novelty: 8,
    feasibility: 7,
  },
  {
    id: "3",
    title: "AI-Assisted Language Learning Effectiveness",
    description: "Compare traditional language learning methods with AI chatbot-assisted learning in vocabulary retention.",
    methodology: "Controlled experiment + Pre/post testing",
    difficulty: "intermediate",
    timeEstimate: "2-3 months",
    tags: ["Education", "AI", "Linguistics"],
    novelty: 8,
    feasibility: 8,
  },
  {
    id: "4",
    title: "Urban Heat Island Mitigation Through Green Roofs",
    description: "Study the temperature reduction effects of rooftop gardens in urban areas using thermal imaging.",
    methodology: "Field measurements + Thermal analysis",
    difficulty: "advanced",
    timeEstimate: "4-6 months",
    tags: ["Environmental", "Urban Planning", "Climate"],
    novelty: 6,
    feasibility: 6,
  },
];

interface IdeaGeneratorProps {
  researchField?: string;
  onSaveIdea?: (idea: ResearchIdea) => void;
}

export default function IdeaGenerator({ researchField, onSaveIdea }: IdeaGeneratorProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedIdeas, setGeneratedIdeas] = useState<ResearchIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedIdeas, setSavedIdeas] = useState<string[]>([]);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, "up" | "down">>({});
  const [selectedIdea, setSelectedIdea] = useState<ResearchIdea | null>(null);
  const [refinementStep, setRefinementStep] = useState(0);
  const [showAITip, setShowAITip] = useState(true);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = useCallback(async (prompt?: string) => {
    setIsGenerating(true);
    setGeneratedIdeas([]);
    setHasGenerated(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-ideas", {
        body: {
          prompt: prompt || selectedPrompt || "general research",
          field: researchField || "general science",
          count: 4,
        },
      });

      if (error) throw error;
      
      if (data?.ideas && Array.isArray(data.ideas) && data.ideas.length > 0) {
        setGeneratedIdeas(data.ideas);
      } else {
        // Fallback to samples if AI returns empty
        setGeneratedIdeas(sampleIdeas);
      }
    } catch (err) {
      console.warn("AI generation failed, using samples:", err);
      setGeneratedIdeas(sampleIdeas);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedPrompt, researchField]);

  const handleSaveIdea = (idea: ResearchIdea) => {
    setSavedIdeas([...savedIdeas, idea.id]);
    onSaveIdea?.(idea);
  };

  const handleFeedback = (ideaId: string, type: "up" | "down") => {
    setFeedbackGiven({ ...feedbackGiven, [ideaId]: type });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-comic-green";
      case "intermediate":
        return "bg-accent";
      case "advanced":
        return "bg-primary";
      default:
        return "bg-muted";
    }
  };

  const refinementQuestions = [
    {
      question: "What resources do you have access to?",
      options: ["School lab", "Home equipment", "University partnership", "Online only"],
    },
    {
      question: "How much time can you dedicate weekly?",
      options: ["2-5 hours", "5-10 hours", "10-20 hours", "20+ hours"],
    },
    {
      question: "What's your primary goal?",
      options: ["Science fair", "Publication", "Learning", "College apps"],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent border-2 border-foreground flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h2 className="font-comic text-2xl">Research Idea Generator</h2>
            <p className="text-sm text-muted-foreground">
              AI-powered brainstorming to find your perfect research question
            </p>
          </div>
        </div>
        {hasGenerated && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{savedIdeas.length} saved</span>
            <div className="w-8 h-8 bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Star className="w-4 h-4 text-primary" />
            </div>
          </div>
        )}
      </div>

      {/* AI Assistant tip */}
      <AIAssistantBubble
        message="Start by selecting a prompt template, or describe what interests you in your own words. I'll suggest research ideas tailored to your interests and resources!"
        isVisible={showAITip && !hasGenerated}
        onDismiss={() => setShowAITip(false)}
      />

      {/* Prompt Templates with descriptions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {promptTemplates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedPrompt === template.id;
          return (
            <motion.button
              key={template.id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPrompt(isSelected ? null : template.id)}
              className={`p-4 border-3 border-foreground text-left transition-all group ${
                isSelected ? template.color + " text-white" : "bg-card hover:bg-muted"
              }`}
              style={{ boxShadow: isSelected ? "var(--shadow-brutal)" : "var(--shadow-brutal-sm)" }}
            >
              <Icon className={`w-6 h-6 mb-2 transition-transform group-hover:scale-110 ${isSelected ? "text-white" : "text-primary"}`} />
              <h4 className="font-bold text-sm">{template.label}</h4>
              <p className={`text-xs mt-1 ${isSelected ? "text-white/80" : "text-muted-foreground"}`}>
                {template.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Smart Prompt Input */}
      <SmartPrompt
        placeholder="Describe your interests, available resources, or specific topics you'd like to explore..."
        onSubmit={handleGenerate}
        isLoading={isGenerating}
        showSuggestions={!hasGenerated}
      />

      {/* Generate Button - only show if user hasn't used SmartPrompt */}
      {!hasGenerated && (
        <Button
          onClick={() => handleGenerate()}
          disabled={isGenerating}
          className="w-full h-12 brutal-button bg-primary text-primary-foreground text-lg"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Generating Ideas...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Research Ideas
            </>
          )}
        </Button>
      )}

      {/* AI Loading skeleton */}
      {isGenerating && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-primary font-bold">
            <Brain className="w-4 h-4 animate-spin" />
            AI is generating personalized research ideas...
          </div>
          <ComicSkeleton variant="card" count={3} />
        </motion.div>
      )}

      {/* Refinement Questions */}
      {generatedIdeas.length > 0 && refinementStep < refinementQuestions.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 border-3 border-primary bg-primary/5"
          style={{ boxShadow: "var(--shadow-brutal-sm)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="font-bold">Quick Question {refinementStep + 1}/3</span>
          </div>
          <p className="font-medium mb-4">{refinementQuestions[refinementStep].question}</p>
          <div className="flex flex-wrap gap-2">
            {refinementQuestions[refinementStep].options.map((option) => (
              <button
                key={option}
                onClick={() => setRefinementStep(refinementStep + 1)}
                className="px-4 py-2 border-2 border-foreground bg-card hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Generated Ideas */}
      <AnimatePresence>
        {generatedIdeas.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-comic text-xl">Generated Ideas</h3>
              <Button
                variant="outline"
                onClick={() => handleGenerate()}
                className="border-2 border-foreground"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>

            <div className="grid gap-4">
              {generatedIdeas.map((idea, index) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-5 border-3 border-foreground bg-card cursor-pointer transition-all ${
                    selectedIdea?.id === idea.id ? "ring-2 ring-primary" : ""
                  }`}
                  style={{ boxShadow: "var(--shadow-brutal-sm)" }}
                  onClick={() => setSelectedIdea(selectedIdea?.id === idea.id ? null : idea)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 text-xs font-bold uppercase text-white ${getDifficultyColor(
                            idea.difficulty
                          )}`}
                        >
                          {idea.difficulty}
                        </span>
                        <span className="text-sm text-muted-foreground">{idea.timeEstimate}</span>
                      </div>
                      <h4 className="font-bold text-lg mb-2">{idea.title}</h4>
                      <p className="text-muted-foreground text-sm mb-3">{idea.description}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {idea.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-muted border border-foreground/20 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Scores */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-primary" />
                          <span>Novelty: {idea.novelty}/10</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Check className="w-4 h-4 text-comic-green" />
                          <span>Feasibility: {idea.feasibility}/10</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeedback(idea.id, "up");
                        }}
                        className={`p-2 border-2 border-foreground transition-colors ${
                          feedbackGiven[idea.id] === "up"
                            ? "bg-comic-green text-white"
                            : "bg-card hover:bg-muted"
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeedback(idea.id, "down");
                        }}
                        className={`p-2 border-2 border-foreground transition-colors ${
                          feedbackGiven[idea.id] === "down"
                            ? "bg-destructive text-white"
                            : "bg-card hover:bg-muted"
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selectedIdea?.id === idea.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t-2 border-foreground/20">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-bold mb-2 flex items-center gap-2">
                                <Microscope className="w-4 h-4" />
                                Suggested Methodology
                              </h5>
                              <p className="text-sm text-muted-foreground">{idea.methodology}</p>
                            </div>
                            <div>
                              <h5 className="font-bold mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                Next Steps
                              </h5>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• Define specific variables</li>
                                <li>• Review related literature</li>
                                <li>• Plan data collection method</li>
                              </ul>
                            </div>
                          </div>

                          <div className="flex gap-3 mt-4">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveIdea(idea);
                              }}
                              disabled={savedIdeas.includes(idea.id)}
                              className="brutal-button bg-primary text-primary-foreground"
                            >
                              {savedIdeas.includes(idea.id) ? (
                                <>
                                  <Check className="w-4 h-4 mr-2" />
                                  Saved!
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4 mr-2" />
                                  Save Idea
                                </>
                              )}
                            </Button>
                            <Button variant="outline" className="border-2 border-foreground">
                              <ArrowRight className="w-4 h-4 mr-2" />
                              Start Project
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      {generatedIdeas.length === 0 && !isGenerating && (
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[
            {
              icon: Brain,
              title: "Be Specific",
              tip: "The more details you provide, the better the suggestions",
            },
            {
              icon: Target,
              title: "Think Local",
              tip: "Consider problems in your community you could investigate",
            },
            {
              icon: Users,
              title: "Stay Curious",
              tip: "The best research starts with genuine questions you want answered",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-4 border-2 border-foreground/30 bg-muted/30"
              >
                <Icon className="w-6 h-6 text-primary mb-2" />
                <h4 className="font-bold text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.tip}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}