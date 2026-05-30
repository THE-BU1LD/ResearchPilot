import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Award, CheckCircle2, AlertTriangle, XCircle, Sparkles, RefreshCw,
  FileText, Lightbulb, BookOpen, PenTool, Target, Search, BarChart3,
  Users, Scale, Brain, ChevronDown, ChevronUp, Star, Trophy, Medal,
  Zap, TrendingUp, MessageSquare, Quote, List, Layers, ArrowRight, Download,
} from "lucide-react";
import { Doodle, Scribble } from "@/components/interactive/ArtisticScribbles";
import InteractiveComicDots from "@/components/interactive/InteractiveComicDots";

interface GradeCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  score: number;
  maxScore: number;
  feedback: string[];
  suggestions: string[];
  color: string;
}

interface OverallGrade {
  letter: string;
  label: string;
}

const getGradeColor = (percentage: number): string => {
  if (percentage >= 90) return "hsl(145, 70%, 45%)";
  if (percentage >= 80) return "hsl(145, 70%, 55%)";
  if (percentage >= 70) return "hsl(45, 95%, 50%)";
  if (percentage >= 60) return "hsl(25, 95%, 55%)";
  return "hsl(0, 85%, 55%)";
};

const getLetterGrade = (percentage: number): OverallGrade => {
  if (percentage >= 97) return { letter: "A+", label: "Exceptional" };
  if (percentage >= 93) return { letter: "A", label: "Excellent" };
  if (percentage >= 90) return { letter: "A-", label: "Very Good" };
  if (percentage >= 87) return { letter: "B+", label: "Good" };
  if (percentage >= 83) return { letter: "B", label: "Above Average" };
  if (percentage >= 80) return { letter: "B-", label: "Satisfactory" };
  if (percentage >= 77) return { letter: "C+", label: "Fair" };
  if (percentage >= 73) return { letter: "C", label: "Average" };
  if (percentage >= 70) return { letter: "C-", label: "Below Average" };
  if (percentage >= 60) return { letter: "D", label: "Needs Work" };
  return { letter: "F", label: "Unsatisfactory" };
};

const ScoreCircle = ({ score, maxScore, size = 80 }: { score: number; maxScore: number; size?: number }) => {
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * (size / 2 - 8);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 8} stroke="hsl(var(--border))" strokeWidth="6" fill="none" />
        <motion.circle cx={size / 2} cy={size / 2} r={size / 2 - 8} stroke={getGradeColor(percentage)} strokeWidth="6" fill="none" strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }} transition={{ duration: 1, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold text-foreground font-comic text-lg">{score}/{maxScore}</span>
      </div>
    </div>
  );
};

const CategoryCard = ({ category, expanded, onToggle }: { category: GradeCategory; expanded: boolean; onToggle: () => void }) => {
  const Icon = category.icon;
  const percentage = (category.score / category.maxScore) * 100;
  return (
    <motion.div layout className="brutal-card rounded-xl overflow-hidden">
      <button onClick={onToggle} className={`w-full p-4 flex items-center justify-between transition-colors ${expanded ? "bg-primary/10" : "bg-card hover:bg-secondary"}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-foreground" style={{ backgroundColor: category.color + "20" }}>
            <Icon className="w-5 h-5" style={{ color: category.color }} />
          </div>
          <div className="text-left">
            <p className="font-bold text-foreground">{category.name}</p>
            <p className="text-xs text-muted-foreground">{percentage.toFixed(0)}% — {category.score}/{category.maxScore} points</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-16 h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.5 }} className="h-full rounded-full" style={{ backgroundColor: category.color }} />
          </div>
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-4 bg-card border-t-2 border-border space-y-4">
              <div>
                <h4 className="font-bold text-sm text-foreground mb-2 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" />Feedback</h4>
                <ul className="space-y-1">
                  {category.feedback.map((item, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-comic-green flex-shrink-0 mt-0.5" /><span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-accent" />Suggestions for Improvement</h4>
                <ul className="space-y-1">
                  {category.suggestions.map((item, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 + 0.3 }} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" /><span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ResearchGrader = () => {
  const [isGrading, setIsGrading] = useState(false);
  const [hasGraded, setHasGraded] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [researchText, setResearchText] = useState("");
  const [overallComment, setOverallComment] = useState("");
  const [strongestArea, setStrongestArea] = useState("");
  const [priorityImprovement, setPriorityImprovement] = useState("");

  const iconMap: Record<string, React.ElementType> = {
    topic: Target, literature: BookOpen, methodology: Scale, analysis: BarChart3, writing: PenTool, citations: Quote,
  };
  const colorMap: Record<string, string> = {
    topic: "hsl(0, 85%, 55%)", literature: "hsl(210, 100%, 55%)", methodology: "hsl(270, 70%, 55%)",
    analysis: "hsl(145, 70%, 45%)", writing: "hsl(45, 95%, 50%)", citations: "hsl(25, 95%, 55%)",
  };
  const nameMap: Record<string, string> = {
    topic: "Topic & Research Question", literature: "Literature Review", methodology: "Methodology",
    analysis: "Data Analysis", writing: "Writing Quality", citations: "Citations & References",
  };
  const maxScoreMap: Record<string, number> = {
    topic: 20, literature: 20, methodology: 20, analysis: 15, writing: 15, citations: 10,
  };

  const [categories, setCategories] = useState<GradeCategory[]>(
    Object.keys(nameMap).map(id => ({
      id, name: nameMap[id], icon: iconMap[id], score: 0, maxScore: maxScoreMap[id], feedback: [], suggestions: [], color: colorMap[id],
    }))
  );

  const totalScore = categories.reduce((acc, cat) => acc + cat.score, 0);
  const maxTotalScore = categories.reduce((acc, cat) => acc + cat.maxScore, 0);
  const percentage = hasGraded ? (totalScore / maxTotalScore) * 100 : 0;
  const gradeInfo = getLetterGrade(percentage);

  const fallbackGrade = () => {
    const text = researchText.toLowerCase();
    const hasHypothesis = /hypothesis|research question|we hypothesize/i.test(text);
    const hasLitReview = /literature|previous (studies|research)|according to/i.test(text);
    const hasMethodology = /method|survey|experiment|sample|participants/i.test(text);
    const hasAnalysis = /results|data|significant|p-value|found that/i.test(text);
    const hasCitations = /\(\d{4}\)|\d+et al/i.test(text);
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return [
      { id: "topic", score: hasHypothesis ? 17 : 12, feedback: hasHypothesis ? ["Clear research question identified", "Topic is relevant and specific"] : ["Research question could be more focused"], suggestions: ["Make your hypothesis more specific and testable"] },
      { id: "literature", score: hasLitReview ? 16 : 10, feedback: hasLitReview ? ["References to existing research found", "Good foundation of sources"] : ["No literature references detected"], suggestions: ["Add citations to at least 5-10 academic sources"] },
      { id: "methodology", score: hasMethodology ? 17 : 11, feedback: hasMethodology ? ["Research methods are described", "Clear approach outlined"] : ["Methods section needs more detail"], suggestions: ["Describe your data collection and analysis methods in detail"] },
      { id: "analysis", score: hasAnalysis ? 13 : 8, feedback: hasAnalysis ? ["Results are presented with data", "Data-driven conclusions"] : ["No data analysis detected"], suggestions: ["Include statistical results and visual representations"] },
      { id: "writing", score: wordCount > 500 ? 13 : wordCount > 200 ? 10 : 7, feedback: wordCount > 300 ? ["Adequate length for initial draft", "Readable writing style"] : ["Paper needs significant expansion"], suggestions: wordCount < 500 ? ["Expand your paper to at least 1000 words for depth"] : ["Consider varying sentence structure for readability"] },
      { id: "citations", score: hasCitations ? 8 : 4, feedback: hasCitations ? ["In-text citations detected", "Citation format is consistent"] : ["No formal citations found"], suggestions: ["Use APA or MLA citation format consistently throughout"] },
    ];
  };

  const handleGrade = async () => {
    if (!researchText.trim() || researchText.trim().split(/\s+/).length < 20) {
      toast.error("Please paste at least a paragraph of research text to grade.");
      return;
    }
    setIsGrading(true);
    setOverallComment("");
    setStrongestArea("");
    setPriorityImprovement("");

    try {
      const { data, error } = await supabase.functions.invoke("ai-writing-feedback", {
        body: { text: researchText, type: "grade" },
      });

      if (error) throw error;

      if (data?.result?.categories && Array.isArray(data.result.categories)) {
        setCategories(data.result.categories.map((cat: any) => ({
          id: cat.id,
          name: nameMap[cat.id] || cat.id,
          icon: iconMap[cat.id] || Target,
          score: Math.min(cat.score || 0, maxScoreMap[cat.id] || 20),
          maxScore: maxScoreMap[cat.id] || 20,
          feedback: cat.feedback || [],
          suggestions: cat.suggestions || [],
          color: colorMap[cat.id] || "hsl(0, 85%, 55%)",
        })));
        if (data.result.overallComment) setOverallComment(data.result.overallComment);
        if (data.result.strongestArea) setStrongestArea(data.result.strongestArea);
        if (data.result.priorityImprovement) setPriorityImprovement(data.result.priorityImprovement);
        toast.success("AI grading complete!");
      } else {
        throw new Error("Invalid format");
      }
    } catch (err) {
      console.warn("AI grading failed, using rule-based:", err);
      const fb = fallbackGrade();
      setCategories(fb.map(cat => ({
        ...cat, name: nameMap[cat.id], icon: iconMap[cat.id], maxScore: maxScoreMap[cat.id], color: colorMap[cat.id],
      })));
      toast.success("Grading complete (offline mode)");
    } finally {
      setIsGrading(false);
      setHasGraded(true);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="absolute -top-4 -right-4 pointer-events-none opacity-20">
        <Doodle type="star" size={60} color="hsl(var(--primary))" />
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="brutal-card rounded-2xl p-6 bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
        <InteractiveComicDots dotColor="hsl(var(--primary) / 0.08)" dotSpacing={18} minDotSize={1} maxDotSize={5} hoverRadius={70} />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className="relative">
              <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center border-3 border-foreground shadow-brutal">
                <Award className="w-8 h-8 text-primary-foreground" />
              </div>
              <motion.div className="absolute -top-2 -right-2" animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <Star className="w-6 h-6 text-accent fill-accent" />
              </motion.div>
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-foreground font-comic tracking-wide">RESEARCH GRADER</h2>
              <p className="text-sm text-muted-foreground font-medium">Evaluate Quality • Get Feedback • Improve</p>
            </div>
          </div>
          <Button onClick={handleGrade} disabled={isGrading} className="brutal-button bg-primary text-primary-foreground shadow-brutal-primary">
            {isGrading ? (<><RefreshCw className="w-4 h-4 animate-spin" />Grading...</>) : (<><Sparkles className="w-4 h-4" />Grade Research</>)}
          </Button>
        </div>
      </motion.div>

      {/* Text Input */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="brutal-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground font-comic">PASTE YOUR RESEARCH</h3>
        </div>
        <textarea value={researchText} onChange={(e) => setResearchText(e.target.value)}
          placeholder="Paste your research paper, thesis, or essay here for comprehensive AI evaluation..."
          className="w-full h-40 p-4 bg-secondary border-3 border-border rounded-xl resize-none focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground" />
        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>{researchText.split(/\s+/).filter(Boolean).length} words</span>
          <span>Supports: Essays, Research Papers, Theses, Lab Reports</span>
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {hasGraded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Overall Grade */}
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.4 }}
              className="brutal-card rounded-2xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <InteractiveComicDots dotColor={getGradeColor(percentage)} dotSpacing={15} minDotSize={2} maxDotSize={8} hoverRadius={100} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-8 mb-4">
                  <ScoreCircle score={totalScore} maxScore={maxTotalScore} size={120} />
                  <div>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }}
                      className="text-7xl font-bold font-comic" style={{ color: getGradeColor(percentage) }}>
                      {gradeInfo.letter}
                    </motion.div>
                    <p className="text-lg font-bold text-foreground">{gradeInfo.label}</p>
                    <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}% overall</p>
                  </div>
                </div>
                {/* AI Commentary */}
                {overallComment && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                    className="mt-4 p-4 bg-primary/5 rounded-xl border-2 border-primary/20 text-left">
                    <p className="text-sm text-foreground">{overallComment}</p>
                    <div className="flex gap-4 mt-3">
                      {strongestArea && (
                        <span className="text-xs px-2 py-1 bg-comic-green/20 text-comic-green font-bold rounded">
                          Strongest: {nameMap[strongestArea] || strongestArea}
                        </span>
                      )}
                      {priorityImprovement && (
                        <span className="text-xs px-2 py-1 bg-accent/20 text-accent font-bold rounded flex items-center gap-1">
                          <ArrowRight className="w-3 h-3" />Focus: {nameMap[priorityImprovement] || priorityImprovement}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Category Cards */}
            <div className="space-y-3">
              {categories.map((category, i) => (
                <motion.div key={category.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <CategoryCard category={category} expanded={expandedCategory === category.id}
                    onToggle={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)} />
                </motion.div>
              ))}
            </div>

            {/* Quick Action */}
            <div className="flex gap-3">
              <Button onClick={handleGrade} variant="outline" className="border-2 border-foreground flex-1">
                <RefreshCw className="w-4 h-4" />Re-Grade
              </Button>
              <Button className="brutal-button bg-primary text-primary-foreground flex-1"
                onClick={() => { navigator.clipboard.writeText(`Grade: ${gradeInfo.letter} (${percentage.toFixed(1)}%)\n${categories.map(c => `${c.name}: ${c.score}/${c.maxScore}`).join("\n")}`); toast.success("Report copied!"); }}>
                <Download className="w-4 h-4" />Copy Report
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State Tips */}
      {!hasGraded && !isGrading && (
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {[
            { icon: FileText, title: "Paste Your Paper", tip: "Copy-paste your research text above and click Grade" },
            { icon: Brain, title: "AI-Powered Analysis", tip: "Get scores across 6 categories with specific feedback" },
            { icon: TrendingUp, title: "Track Improvement", tip: "Re-grade after making changes to see your progress" },
          ].map((item) => (
            <div key={item.title} className="p-4 border-2 border-foreground/30 bg-muted/30 rounded-xl">
              <item.icon className="w-6 h-6 text-primary mb-2" />
              <h4 className="font-bold text-sm">{item.title}</h4>
              <p className="text-xs text-muted-foreground">{item.tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResearchGrader;
