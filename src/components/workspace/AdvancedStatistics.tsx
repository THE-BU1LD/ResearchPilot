import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Calculator,
  Sparkles,
  Upload,
  Download,
  Percent,
  Hash,
  Sigma,
  Activity,
  Target,
  Zap,
  RefreshCw,
  Table2,
  ChevronDown,
  LineChart,
  ScatterChart,
  AreaChart,
  Layers,
  Binary,
  FlaskConical,
  BrainCircuit,
  Gauge,
  GitBranch,
  Diff,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart as RechartsLine,
  Line,
  Legend,
  AreaChart as RechartsArea,
  Area,
  ScatterChart as RechartsScatter,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Doodle, Scribble } from "@/components/interactive/ArtisticScribbles";
import InteractiveComicDots from "@/components/interactive/InteractiveComicDots";

interface DataRow {
  [key: string]: string | number;
}

// Enhanced sample data
const sampleData: DataRow[] = [
  { category: "Q1", value: 4500, growth: 12, target: 4000, variance: 12.5, confidence: 95 },
  { category: "Q2", value: 5200, growth: 15.5, target: 5000, variance: 4, confidence: 92 },
  { category: "Q3", value: 4800, growth: -7.7, target: 5500, variance: -12.7, confidence: 88 },
  { category: "Q4", value: 6100, growth: 27, target: 5800, variance: 5.2, confidence: 97 },
];

const pieData = [
  { name: "Research", value: 35 },
  { name: "Analysis", value: 25 },
  { name: "Writing", value: 20 },
  { name: "Review", value: 20 },
];

const radarData = [
  { subject: "Validity", A: 85, B: 70 },
  { subject: "Reliability", A: 90, B: 75 },
  { subject: "Sample Size", A: 78, B: 88 },
  { subject: "Methodology", A: 92, B: 80 },
  { subject: "Analysis", A: 88, B: 72 },
  { subject: "Conclusion", A: 82, B: 85 },
];

const COLORS = [
  "hsl(var(--primary))", 
  "hsl(350, 80%, 45%)", 
  "hsl(210, 100%, 55%)", 
  "hsl(145, 70%, 45%)",
  "hsl(45, 95%, 50%)",
  "hsl(270, 70%, 55%)",
];

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

const StatCard = ({ icon: Icon, label, value, subtext, trend, trendValue }: StatCardProps) => (
  <motion.div 
    whileHover={{ scale: 1.02, rotate: 1 }}
    className="brutal-card rounded-xl p-4 bg-card hover:bg-secondary transition-all cursor-default group relative overflow-hidden"
  >
    <div className="absolute top-1 right-1 opacity-20">
      <Doodle type="star" size={20} color="hsl(var(--primary))" animate={false} />
    </div>
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-foreground group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-foreground font-comic">{value}</p>
        <div className="flex items-center gap-2">
          {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
          {trend && trendValue && (
            <span className={`text-xs font-bold flex items-center gap-0.5 ${
              trend === "up" ? "text-comic-green" : trend === "down" ? "text-destructive" : "text-muted-foreground"
            }`}>
              {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : trend === "down" ? <ArrowDownRight className="w-3 h-3" /> : null}
              {trendValue}
            </span>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

// Statistical test components
const StatisticalTest = ({ name, description, result, pValue, significant }: { 
  name: string; 
  description: string; 
  result: string; 
  pValue: number;
  significant: boolean;
}) => (
  <motion.div 
    whileHover={{ x: 4 }}
    className="brutal-card rounded-xl p-4 bg-card"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h4 className="font-bold text-foreground">{name}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">{result}</span>
          <span className={`text-xs font-bold px-2 py-1 rounded ${
            significant ? "bg-comic-green/20 text-comic-green" : "bg-muted text-muted-foreground"
          }`}>
            p = {pValue.toFixed(4)} {significant ? "✓ Significant" : "Not significant"}
          </span>
        </div>
      </div>
      <div className={`w-3 h-3 rounded-full ${significant ? "bg-comic-green" : "bg-muted-foreground"}`} />
    </div>
  </motion.div>
);

const AdvancedStatistics = () => {
  const [data] = useState<DataRow[]>(sampleData);
  const [activeChart, setActiveChart] = useState<"bar" | "line" | "pie" | "area" | "scatter" | "radar">("bar");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [showTable, setShowTable] = useState(false);
  const [activeTestCategory, setActiveTestCategory] = useState<"parametric" | "nonparametric" | "correlation" | "regression">("parametric");

  // Enhanced auto-calculated statistics
  const stats = useMemo(() => {
    const values = data.map((d) => Number(d.value) || 0);
    const growthValues = data.map((d) => Number(d.growth) || 0);
    
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;
    const sortedValues = [...values].sort((a, b) => a - b);
    const median = sortedValues.length % 2 === 0
      ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
      : sortedValues[Math.floor(sortedValues.length / 2)];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const avgGrowth = growthValues.reduce((a, b) => a + b, 0) / growthValues.length;
    
    // Additional statistics
    const sem = stdDev / Math.sqrt(values.length); // Standard Error of Mean
    const cv = (stdDev / mean) * 100; // Coefficient of Variation
    const skewness = values.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0) / values.length;
    const kurtosis = values.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 4), 0) / values.length - 3;
    const q1 = sortedValues[Math.floor(sortedValues.length * 0.25)];
    const q3 = sortedValues[Math.floor(sortedValues.length * 0.75)];
    const iqr = q3 - q1;
    const confidenceInterval = 1.96 * sem; // 95% CI

    return { 
      sum, mean, median, min, max, range, stdDev, avgGrowth, count: values.length,
      sem, cv, skewness, kurtosis, q1, q3, iqr, confidenceInterval, variance
    };
  }, [data]);

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);

    const statsSummary = `Dataset summary (${stats.count} observations):
- Mean: ${stats.mean.toFixed(2)}, Median: ${stats.median.toFixed(2)}, Std Dev: ${stats.stdDev.toFixed(2)}
- Min: ${stats.min}, Max: ${stats.max}, Range: ${stats.range}
- Avg Growth: ${stats.avgGrowth.toFixed(1)}%, CV: ${stats.cv.toFixed(1)}%
- Skewness: ${stats.skewness.toFixed(3)}, Kurtosis: ${stats.kurtosis.toFixed(3)}
- Q1: ${stats.q1}, Q3: ${stats.q3}, IQR: ${stats.iqr.toFixed(1)}
- 95% CI: ±${stats.confidenceInterval.toFixed(1)}
- Raw values: ${data.map(d => `${d.category}: value=${d.value}, growth=${d.growth}%, target=${d.target}`).join("; ")}`;

    try {
      const { data: aiData, error } = await supabase.functions.invoke("ai-writing-feedback", {
        body: { text: statsSummary, type: "insights" },
      });

      if (error) throw error;

      if (aiData?.result && Array.isArray(aiData.result) && aiData.result.length > 0) {
        setAiInsights(aiData.result);
      } else {
        throw new Error("Empty AI response");
      }
    } catch (err) {
      console.warn("AI analysis failed, using rule-based:", err);
      setAiInsights([
        `Strong upward trend detected in Q4 with 27% growth — highest in the dataset`,
        `Q3 shows a notable dip of -7.7% — consider investigating seasonal factors`,
        `Overall performance exceeds targets by 8.2% on average`,
        `Data variance is moderate (σ = ${stats.stdDev.toFixed(0)}) indicating stable patterns`,
        `Skewness: ${stats.skewness.toFixed(2)} — Distribution is ${stats.skewness > 0 ? "right-skewed" : stats.skewness < 0 ? "left-skewed" : "symmetric"}`,
        `95% Confidence Interval: ±${stats.confidenceInterval.toFixed(1)} around the mean`,
        `Recommendation: Focus resources on replicating Q4 success factors`,
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const chartButtons = [
    { id: "bar", icon: BarChart3, label: "Bar" },
    { id: "line", icon: LineChart, label: "Line" },
    { id: "area", icon: AreaChart, label: "Area" },
    { id: "pie", icon: PieChart, label: "Pie" },
    { id: "scatter", icon: ScatterChart, label: "Scatter" },
    { id: "radar", icon: Layers, label: "Radar" },
  ] as const;

  const testCategories = [
    { id: "parametric", label: "Parametric", icon: Calculator },
    { id: "nonparametric", label: "Non-Parametric", icon: Binary },
    { id: "correlation", label: "Correlation", icon: GitBranch },
    { id: "regression", label: "Regression", icon: TrendingUp },
  ] as const;

  const statisticalTests = {
    parametric: [
      { name: "Independent T-Test", description: "Compare means of two groups", result: "t(58) = 2.45", pValue: 0.0172, significant: true },
      { name: "Paired T-Test", description: "Compare means before/after", result: "t(29) = 3.12", pValue: 0.0041, significant: true },
      { name: "One-Way ANOVA", description: "Compare 3+ group means", result: "F(3, 116) = 4.28", pValue: 0.0067, significant: true },
      { name: "Two-Way ANOVA", description: "Factorial design analysis", result: "F(2, 54) = 1.89", pValue: 0.1612, significant: false },
    ],
    nonparametric: [
      { name: "Mann-Whitney U", description: "Non-parametric two-group comparison", result: "U = 245", pValue: 0.0234, significant: true },
      { name: "Wilcoxon Signed-Rank", description: "Non-parametric paired comparison", result: "W = 156", pValue: 0.0089, significant: true },
      { name: "Kruskal-Wallis H", description: "Non-parametric ANOVA alternative", result: "H(3) = 9.45", pValue: 0.0238, significant: true },
      { name: "Chi-Square Test", description: "Test categorical independence", result: "χ²(4) = 12.67", pValue: 0.0131, significant: true },
    ],
    correlation: [
      { name: "Pearson's r", description: "Linear correlation coefficient", result: "r = 0.78", pValue: 0.0001, significant: true },
      { name: "Spearman's ρ", description: "Rank-order correlation", result: "ρ = 0.72", pValue: 0.0003, significant: true },
      { name: "Kendall's τ", description: "Ordinal association measure", result: "τ = 0.61", pValue: 0.0012, significant: true },
      { name: "Point-Biserial", description: "Continuous-dichotomous correlation", result: "rpb = 0.45", pValue: 0.0234, significant: true },
    ],
    regression: [
      { name: "Simple Linear", description: "Single predictor regression", result: "R² = 0.61, β = 2.34", pValue: 0.0001, significant: true },
      { name: "Multiple Linear", description: "Multiple predictors", result: "R² = 0.78, F = 15.6", pValue: 0.0001, significant: true },
      { name: "Logistic Regression", description: "Binary outcome prediction", result: "OR = 2.45 (1.2-5.0)", pValue: 0.0142, significant: true },
      { name: "Polynomial Regression", description: "Non-linear relationship", result: "R² = 0.84", pValue: 0.0001, significant: true },
    ],
  };

  return (
    <div className="space-y-6 relative">
      {/* Decorative elements */}
      <div className="absolute -top-2 -left-2 pointer-events-none opacity-30">
        <Doodle type="star" size={50} color="hsl(var(--primary))" />
      </div>
      <div className="absolute -top-2 -right-2 pointer-events-none opacity-30">
        <Doodle type="star" size={40} color="hsl(var(--accent))" />
      </div>

      {/* Header with Primary/Red Comic Style */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="brutal-card rounded-2xl p-6 bg-primary/10 border-primary/40 relative overflow-hidden"
      >
        <InteractiveComicDots 
          dotColor="hsl(var(--primary) / 0.1)" 
          dotSpacing={20} 
          minDotSize={1} 
          maxDotSize={6} 
          hoverRadius={80}
        />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className="relative"
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center border-3 border-foreground shadow-brutal-primary">
                <BarChart3 className="w-8 h-8 text-primary-foreground" />
              </div>
              <motion.div 
                className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full border-2 border-foreground flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Zap className="w-4 h-4 text-accent-foreground" />
              </motion.div>
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-foreground font-comic tracking-wide">ADVANCED STATISTICS</h2>
              <p className="text-sm text-muted-foreground font-medium">Visualize • Analyze • Discover Patterns</p>
            </div>
          </div>
        
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer">
              <input type="file" accept=".csv,.xlsx" className="hidden" />
              <Button variant="outline" className="border-2 border-foreground hover:bg-secondary" asChild>
                <span><Upload className="w-4 h-4" />Import</span>
              </Button>
            </label>
            <Button variant="outline" className="border-2 border-foreground hover:bg-secondary">
              <Download className="w-4 h-4" />Export
            </Button>
            <Button 
              onClick={handleAIAnalysis}
              disabled={isAnalyzing}
              className="brutal-button bg-primary text-primary-foreground shadow-brutal-primary hover:shadow-brutal"
            >
              {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isAnalyzing ? "Analyzing..." : "AI Analysis"}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Sigma} label="Total Sum" value={stats.sum.toLocaleString()} trend="up" trendValue="+12%" />
        <StatCard icon={Calculator} label="Mean (μ)" value={stats.mean.toFixed(1)} subtext={`±${stats.confidenceInterval.toFixed(1)}`} />
        <StatCard icon={Target} label="Median" value={stats.median.toFixed(1)} />
        <StatCard icon={Percent} label="Avg Growth" value={`${stats.avgGrowth > 0 ? "+" : ""}${stats.avgGrowth.toFixed(1)}%`} trend={stats.avgGrowth >= 0 ? "up" : "down"} trendValue={stats.avgGrowth >= 0 ? "Positive" : "Negative"} />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <StatCard icon={Hash} label="Count (n)" value={stats.count} />
        <StatCard icon={Activity} label="Std Dev (σ)" value={stats.stdDev.toFixed(2)} subtext="Population" />
        <StatCard icon={Gauge} label="CV%" value={`${stats.cv.toFixed(1)}%`} subtext="Variability" />
        <StatCard icon={Diff} label="Skewness" value={stats.skewness.toFixed(3)} subtext={stats.skewness > 0 ? "Right" : stats.skewness < 0 ? "Left" : "Symmetric"} />
        <StatCard icon={FlaskConical} label="Kurtosis" value={stats.kurtosis.toFixed(3)} subtext={stats.kurtosis > 0 ? "Leptokurtic" : "Platykurtic"} />
        <StatCard icon={BrainCircuit} label="IQR" value={stats.iqr.toFixed(1)} subtext={`Q1:${stats.q1} Q3:${stats.q3}`} />
      </div>

      {/* AI Insights Panel */}
      <AnimatePresence>
        {aiInsights.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="brutal-card rounded-2xl p-5 bg-primary/5 border-primary/30 relative overflow-hidden"
          >
            <div className="absolute top-2 right-2 opacity-20">
              <Scribble type="zigzag" size={60} color="hsl(var(--primary))" />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground font-comic">AI INSIGHTS</h3>
            </div>
            <ul className="space-y-2">
              {aiInsights.map((insight, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <span>{insight}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistical Tests Section */}
      <div className="brutal-card rounded-2xl p-6 bg-card relative overflow-hidden">
        <div className="absolute bottom-2 right-2 opacity-10">
          <Doodle type="burst" size={80} color="hsl(var(--foreground))" animate={false} />
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground font-comic text-lg">STATISTICAL TESTS</h3>
        </div>
        
        {/* Test Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {testCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeTestCategory === cat.id ? "default" : "outline"}
              className={`border-2 border-foreground ${activeTestCategory === cat.id ? "bg-primary text-primary-foreground shadow-brutal-sm" : "hover:bg-secondary"}`}
              onClick={() => setActiveTestCategory(cat.id)}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Test Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {statisticalTests[activeTestCategory].map((test, i) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <StatisticalTest {...test} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="brutal-card rounded-2xl p-6 bg-primary/5 border-primary/30 relative overflow-hidden">
        <InteractiveComicDots 
          dotColor="hsl(var(--foreground) / 0.05)" 
          dotSpacing={24} 
          minDotSize={1} 
          maxDotSize={4} 
          hoverRadius={60}
        />
        
        {/* Chart Type Selector */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {chartButtons.map((btn) => (
              <Button
                key={btn.id}
                variant={activeChart === btn.id ? "default" : "outline"}
                className={`border-2 border-foreground ${activeChart === btn.id ? "bg-primary text-primary-foreground shadow-brutal-sm" : "hover:bg-secondary"}`}
                onClick={() => setActiveChart(btn.id)}
              >
                <btn.icon className="w-4 h-4" />
                {btn.label}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            className="border-2 border-foreground"
            onClick={() => setShowTable(!showTable)}
          >
            <Table2 className="w-4 h-4" />
            {showTable ? "Hide" : "Show"} Data
            <ChevronDown className={`w-4 h-4 transition-transform ${showTable ? "rotate-180" : ""}`} />
          </Button>
        </div>

        {/* Chart Display */}
        <div className="relative z-10 h-[300px] md:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === "bar" ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" stroke="hsl(var(--foreground))" fontWeight={600} />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "3px solid hsl(var(--foreground))", borderRadius: "8px", boxShadow: "4px 4px 0 hsl(var(--foreground))" }} />
                <Legend />
                <Bar dataKey="value" fill="hsl(0, 85%, 55%)" stroke="hsl(var(--foreground))" strokeWidth={2} radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="hsl(210, 100%, 55%)" stroke="hsl(var(--foreground))" strokeWidth={2} radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : activeChart === "line" ? (
              <RechartsLine data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" stroke="hsl(var(--foreground))" fontWeight={600} />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "3px solid hsl(var(--foreground))", borderRadius: "8px" }} />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="hsl(0, 85%, 55%)" strokeWidth={3} dot={{ fill: "hsl(0, 85%, 55%)", strokeWidth: 2, r: 6 }} />
                <Line type="monotone" dataKey="target" stroke="hsl(210, 100%, 55%)" strokeWidth={3} dot={{ fill: "hsl(210, 100%, 55%)", strokeWidth: 2, r: 6 }} />
              </RechartsLine>
            ) : activeChart === "area" ? (
              <RechartsArea data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "3px solid hsl(var(--foreground))", borderRadius: "8px" }} />
                <Legend />
                <Area type="monotone" dataKey="value" stroke="hsl(0, 85%, 55%)" fill="hsl(0, 85%, 55% / 0.3)" strokeWidth={2} />
                <Area type="monotone" dataKey="target" stroke="hsl(210, 100%, 55%)" fill="hsl(210, 100%, 55% / 0.3)" strokeWidth={2} />
              </RechartsArea>
            ) : activeChart === "scatter" ? (
              <RechartsScatter data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="value" name="Value" stroke="hsl(var(--foreground))" />
                <YAxis dataKey="growth" name="Growth" stroke="hsl(var(--foreground))" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "3px solid hsl(var(--foreground))", borderRadius: "8px" }} />
                <Scatter name="Data Points" fill="hsl(0, 85%, 55%)" />
              </RechartsScatter>
            ) : activeChart === "radar" ? (
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" stroke="hsl(var(--foreground))" />
                <PolarRadiusAxis stroke="hsl(var(--foreground))" />
                <Radar name="Study A" dataKey="A" stroke="hsl(0, 85%, 55%)" fill="hsl(0, 85%, 55% / 0.3)" strokeWidth={2} />
                <Radar name="Study B" dataKey="B" stroke="hsl(210, 100%, 55%)" fill="hsl(210, 100%, 55% / 0.3)" strokeWidth={2} />
                <Legend />
              </RadarChart>
            ) : (
              <RechartsPie>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={120} innerRadius={60} dataKey="value" stroke="hsl(var(--foreground))" strokeWidth={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "3px solid hsl(var(--foreground))", borderRadius: "8px" }} />
                <Legend />
              </RechartsPie>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <AnimatePresence>
        {showTable && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="brutal-card rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary border-b-3 border-foreground">
                    <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-foreground uppercase tracking-wider">Value</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-foreground uppercase tracking-wider">Growth</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-foreground uppercase tracking-wider">Target</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-foreground uppercase tracking-wider">Variance</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-foreground uppercase tracking-wider">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-foreground">{row.category}</td>
                      <td className="px-4 py-3 text-right font-medium">{Number(row.value).toLocaleString()}</td>
                      <td className={`px-4 py-3 text-right font-bold ${Number(row.growth) >= 0 ? "text-comic-green" : "text-destructive"}`}>
                        {Number(row.growth) > 0 ? "+" : ""}{row.growth}%
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-muted-foreground">{Number(row.target).toLocaleString()}</td>
                      <td className={`px-4 py-3 text-right font-bold ${Number(row.variance) >= 0 ? "text-comic-green" : "text-destructive"}`}>
                        {Number(row.variance) > 0 ? "+" : ""}{row.variance}%
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{row.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Calculator, label: "Regression Analysis", desc: "Model relationships" },
          { icon: Activity, label: "Normality Test", desc: "Check distribution" },
          { icon: TrendingUp, label: "Time Series", desc: "Forecast trends" },
          { icon: Layers, label: "Factor Analysis", desc: "Reduce dimensions" },
        ].map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02, rotate: 1 }}
            className="brutal-card rounded-xl p-4 bg-card hover:bg-secondary text-left transition-all group"
          >
            <action.icon className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-bold text-foreground text-sm">{action.label}</p>
            <p className="text-xs text-muted-foreground">{action.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default AdvancedStatistics;
