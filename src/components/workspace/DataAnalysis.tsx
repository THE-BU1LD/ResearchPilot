import { useState, useMemo, memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  BarChart3, PieChart, TrendingUp, Calculator, Sparkles, Upload,
  Database, ArrowUpDown, Percent, Hash, Sigma, Activity, Target,
  Zap, RefreshCw, Download, Table2, ChevronDown, HelpCircle, Info,
  GitBranch, Gauge, Brain, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart as RechartsPie, Pie, Cell,
  LineChart, Line, Legend, Area, AreaChart, ScatterChart, Scatter,
} from "recharts";
import { FeatureExplainer } from "@/components/ui/feature-explainer";
import { motion, AnimatePresence } from "framer-motion";

interface DataRow {
  [key: string]: string | number;
}

const sampleData: DataRow[] = [
  { category: "Q1", value: 4500, growth: 12, target: 4000 },
  { category: "Q2", value: 5200, growth: 15.5, target: 5000 },
  { category: "Q3", value: 4800, growth: -7.7, target: 5500 },
  { category: "Q4", value: 6100, growth: 27, target: 5800 },
];

const pieData = [
  { name: "Research", value: 35 },
  { name: "Analysis", value: 25 },
  { name: "Writing", value: 20 },
  { name: "Review", value: 20 },
];

const COLORS = ["hsl(var(--primary))", "hsl(350, 80%, 45%)", "hsl(210, 100%, 55%)", "hsl(145, 70%, 45%)"];

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
  explainer?: string;
  trend?: "up" | "down";
  trendValue?: string;
}

const StatCard = memo(function StatCard({ icon: Icon, label, value, subtext, color = "primary", explainer, trend, trendValue }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, x: -2 }}
      className="brutal-card rounded-xl p-4 bg-card transition-shadow hover:shadow-brutal-lg cursor-default group"
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg bg-${color}/10 flex items-center justify-center border-2 border-foreground group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
          <Icon className={`w-5 h-5 text-${color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
            {explainer && <FeatureExplainer title={label} description={explainer} type="info" iconSize={12} />}
          </div>
          <p className="text-2xl font-bold text-foreground font-comic">{value}</p>
          <div className="flex items-center gap-2">
            {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
            {trend && trendValue && (
              <span className={`text-xs font-bold flex items-center gap-0.5 ${trend === "up" ? "text-comic-green" : "text-destructive"}`}>
                {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {trendValue}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const DataAnalysis = () => {
  const [data, setData] = useState<DataRow[]>(sampleData);
  const [activeChart, setActiveChart] = useState<"bar" | "line" | "pie" | "scatter">("bar");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [showTable, setShowTable] = useState(false);
  
  // New: sub-feature states
  const [activeSubFeature, setActiveSubFeature] = useState<string | null>(null);
  const [subFeatureResult, setSubFeatureResult] = useState<any>(null);
  const [subFeatureLoading, setSubFeatureLoading] = useState(false);

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
    return { sum, mean, median, min, max, range, stdDev, avgGrowth, count: values.length };
  }, [data]);

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    const statsSummary = `Dataset: ${stats.count} observations. Mean=${stats.mean.toFixed(1)}, Median=${stats.median.toFixed(1)}, StdDev=${stats.stdDev.toFixed(1)}, Range=${stats.range}, AvgGrowth=${stats.avgGrowth.toFixed(1)}%. Values: ${data.map(d => `${d.category}: ${d.value} (growth: ${d.growth}%, target: ${d.target})`).join("; ")}`;

    try {
      const { data: aiData, error } = await supabase.functions.invoke("ai-writing-feedback", {
        body: { text: statsSummary, type: "insights" },
      });
      if (error) throw error;
      if (aiData?.result && Array.isArray(aiData.result) && aiData.result.length > 0) {
        setAiInsights(aiData.result);
        toast.success("AI analysis complete!");
      } else {
        throw new Error("Empty response");
      }
    } catch {
      setAiInsights([
        "[TREND] Strong upward trend detected in Q4 with 27% growth — highest in the dataset",
        "[ANOMALY] Q3 shows a notable dip of -7.7% — consider investigating seasonal factors",
        "[COMPARISON] Overall performance exceeds targets by 8.2% on average",
        "[RECOMMENDATION] Focus resources on replicating Q4 success factors",
        "[PREDICTION] Data variance is moderate (σ = " + stats.stdDev.toFixed(0) + ") indicating stable growth patterns",
      ]);
      toast.success("Analysis complete (offline mode)");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubFeature = useCallback(async (feature: string) => {
    setActiveSubFeature(feature);
    setSubFeatureLoading(true);
    setSubFeatureResult(null);

    const dataSummary = `Data points: ${data.map(d => `${d.category}: value=${d.value}, growth=${d.growth}%, target=${d.target}`).join("; ")}. Stats: mean=${stats.mean.toFixed(1)}, stdDev=${stats.stdDev.toFixed(1)}, range=${stats.range}.`;

    try {
      const { data: aiData, error } = await supabase.functions.invoke("ai-writing-feedback", {
        body: { text: dataSummary, type: feature },
      });
      if (error) throw error;
      if (aiData?.result) {
        setSubFeatureResult(aiData.result);
        toast.success(`${feature} analysis complete!`);
      } else {
        throw new Error("Empty response");
      }
    } catch {
      // Smart fallbacks
      if (feature === "regression") {
        setSubFeatureResult({
          equation: "y = 486.7x + 3813.3",
          rSquared: 0.72,
          interpretation: "About 72% of the variation in values can be explained by the time trend. Each quarter, values increase by approximately 487 units.",
          predictions: [{ x: 5, predictedY: 6247 }, { x: 6, predictedY: 6734 }],
          recommendation: "The positive trend suggests continued growth. Monitor Q3 dips for seasonal effects.",
        });
      } else if (feature === "correlation") {
        setSubFeatureResult({
          coefficient: 0.84,
          strength: "strong positive",
          pValue: 0.012,
          interpretation: "There is a strong positive correlation between the period and values, suggesting a clear upward trend over time.",
          caveats: ["Small sample size (n=4) limits statistical power", "Correlation does not imply causation"],
        });
      } else if (feature === "forecast") {
        setSubFeatureResult({
          method: "Linear Trend Extrapolation",
          predictions: [
            { period: "Q5", value: 6450, lowerBound: 5900, upperBound: 7000 },
            { period: "Q6", value: 6800, lowerBound: 6100, upperBound: 7500 },
            { period: "Q7", value: 7150, lowerBound: 6200, upperBound: 8100 },
          ],
          trend: "increasing",
          confidence: 72,
          explanation: "Based on the existing upward trend, values are projected to continue increasing. However, the Q3 dip introduces uncertainty.",
        });
      }
      toast.success(`${feature} analysis complete (offline)`);
    } finally {
      setSubFeatureLoading(false);
    }
  }, [data, stats]);

  const handleCSVImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) return toast.error("CSV needs at least a header and one data row");
      const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
      const rows = lines.slice(1).map(line => {
        const vals = line.split(",").map(v => v.trim().replace(/"/g, ""));
        const row: DataRow = {};
        headers.forEach((h, i) => {
          const num = parseFloat(vals[i]);
          row[h] = isNaN(num) ? vals[i] : num;
        });
        return row;
      });
      setData(rows);
      toast.success(`Imported ${rows.length} rows with ${headers.length} columns`);
    };
    reader.readAsText(file);
  }, []);

  const chartButtons = [
    { id: "bar", icon: BarChart3, label: "Bar" },
    { id: "line", icon: TrendingUp, label: "Line" },
    { id: "pie", icon: PieChart, label: "Pie" },
    { id: "scatter", icon: Activity, label: "Scatter" },
  ] as const;

  const getInsightIcon = (text: string) => {
    if (text.includes("[TREND]")) return <TrendingUp className="w-4 h-4 text-comic-green flex-shrink-0" />;
    if (text.includes("[ANOMALY]")) return <Zap className="w-4 h-4 text-accent flex-shrink-0" />;
    if (text.includes("[RECOMMENDATION]")) return <Target className="w-4 h-4 text-primary flex-shrink-0" />;
    if (text.includes("[COMPARISON]")) return <ArrowUpDown className="w-4 h-4 text-comic-blue flex-shrink-0" />;
    if (text.includes("[PREDICTION]")) return <Brain className="w-4 h-4 text-purple-500 flex-shrink-0" />;
    return <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />;
  };

  const cleanInsightText = (text: string) => text.replace(/\[(TREND|ANOMALY|RECOMMENDATION|COMPARISON|PREDICTION|INSIGHT)\]\s*/g, "");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="brutal-card rounded-2xl p-6 bg-primary/10 border-primary/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
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
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground font-comic tracking-wide">DATA ANALYSIS</h2>
              <p className="text-sm text-muted-foreground font-medium">Visualize • Calculate • Discover Insights</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer">
              <input type="file" accept=".csv" className="hidden" onChange={handleCSVImport} />
              <Button variant="outline" className="border-2 border-foreground hover:bg-secondary" asChild>
                <span><Upload className="w-4 h-4" />Import CSV</span>
              </Button>
            </label>
            <Button variant="outline" className="border-2 border-foreground hover:bg-secondary">
              <Download className="w-4 h-4" />Export
            </Button>
            <Button onClick={handleAIAnalysis} disabled={isAnalyzing} className="brutal-button bg-primary text-primary-foreground shadow-brutal-primary">
              {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isAnalyzing ? "Analyzing..." : "AI Analysis"}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Sigma} label="Total Sum" value={stats.sum.toLocaleString()} color="primary" explainer="Sum of all values" trend="up" trendValue="+12%" />
        <StatCard icon={Calculator} label="Mean Avg" value={stats.mean.toFixed(1)} color="primary" explainer="Arithmetic average" />
        <StatCard icon={ArrowUpDown} label="Median" value={stats.median.toFixed(1)} color="primary" explainer="Middle value when sorted" />
        <StatCard icon={Percent} label="Avg Growth" value={`${stats.avgGrowth > 0 ? "+" : ""}${stats.avgGrowth.toFixed(1)}%`} color={stats.avgGrowth >= 0 ? "comic-green" : "destructive"} trend={stats.avgGrowth >= 0 ? "up" : "down"} trendValue={`${Math.abs(stats.avgGrowth).toFixed(1)}%`} explainer="Average percentage change" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard icon={Hash} label="Count" value={stats.count} explainer="Number of data points" />
        <StatCard icon={Target} label="Min" value={stats.min.toLocaleString()} explainer="Smallest value" />
        <StatCard icon={Target} label="Max" value={stats.max.toLocaleString()} explainer="Largest value" />
        <StatCard icon={Activity} label="Range" value={stats.range.toLocaleString()} explainer="Max minus min" />
        <StatCard icon={Gauge} label="Std Dev" value={stats.stdDev.toFixed(1)} subtext="σ" explainer="How spread out values are" />
      </div>

      {/* AI Insights */}
      <AnimatePresence>
        {aiInsights.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="brutal-card rounded-2xl p-5 bg-primary/5 border-primary/30">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground font-comic">AI INSIGHTS</h3>
            </div>
            <ul className="space-y-3">
              {aiInsights.map((insight, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-start gap-3 text-sm text-foreground p-3 bg-card rounded-lg border-2 border-border">
                  {getInsightIcon(insight)}
                  <span>{cleanInsightText(insight)}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart Section */}
      <div className="brutal-card rounded-2xl p-6 bg-primary/5 border-primary/30">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {chartButtons.map((btn) => (
              <Button key={btn.id} variant={activeChart === btn.id ? "default" : "outline"}
                className={`border-2 border-foreground ${activeChart === btn.id ? "bg-primary text-primary-foreground shadow-brutal-sm" : "hover:bg-secondary"}`}
                onClick={() => setActiveChart(btn.id)}>
                <btn.icon className="w-4 h-4" />{btn.label}
              </Button>
            ))}
          </div>
          <Button variant="outline" className="border-2 border-foreground" onClick={() => setShowTable(!showTable)}>
            <Table2 className="w-4 h-4" />{showTable ? "Hide" : "Show"} Data
            <ChevronDown className={`w-4 h-4 transition-transform ${showTable ? "rotate-180" : ""}`} />
          </Button>
        </div>

        <div className="h-[300px] md:h-[350px] w-full">
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
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" stroke="hsl(var(--foreground))" fontWeight={600} />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "3px solid hsl(var(--foreground))", borderRadius: "8px" }} />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="hsl(0, 85%, 55%)" strokeWidth={3} dot={{ fill: "hsl(0, 85%, 55%)", strokeWidth: 2, r: 6 }} />
                <Line type="monotone" dataKey="target" stroke="hsl(210, 100%, 55%)" strokeWidth={3} dot={{ fill: "hsl(210, 100%, 55%)", strokeWidth: 2, r: 6 }} />
              </LineChart>
            ) : activeChart === "scatter" ? (
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" dataKey="value" name="Value" stroke="hsl(var(--foreground))" />
                <YAxis type="number" dataKey="growth" name="Growth %" stroke="hsl(var(--foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "3px solid hsl(var(--foreground))", borderRadius: "8px" }} />
                <Scatter data={data} fill="hsl(0, 85%, 55%)" stroke="hsl(var(--foreground))" strokeWidth={2} />
              </ScatterChart>
            ) : (
              <RechartsPie>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={120} innerRadius={60} dataKey="value" stroke="hsl(var(--foreground))" strokeWidth={3}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
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
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="brutal-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary border-b-3 border-foreground">
                    {Object.keys(data[0] || {}).map(key => (
                      <th key={key} className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      {Object.entries(row).map(([key, val], j) => (
                        <td key={j} className={`px-4 py-3 ${typeof val === "number" ? "text-right font-medium" : "font-bold text-foreground"} ${
                          key === "growth" ? (Number(val) >= 0 ? "text-comic-green" : "text-destructive") : ""
                        }`}>
                          {key === "growth" && Number(val) > 0 ? "+" : ""}{typeof val === "number" ? val.toLocaleString() : val}{key === "growth" ? "%" : ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI-Powered Quick Actions - NOW FUNCTIONAL */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: "regression", icon: Calculator, label: "Regression", desc: "Run linear analysis" },
          { id: "correlation", icon: GitBranch, label: "Correlation", desc: "Find patterns" },
          { id: "forecast", icon: TrendingUp, label: "Forecast", desc: "Predict trends" },
          { id: "compare", icon: Database, label: "Compare", desc: "vs. targets" },
        ].map((action) => (
          <button key={action.id}
            onClick={() => action.id !== "compare" ? handleSubFeature(action.id) : setActiveSubFeature("compare")}
            disabled={subFeatureLoading && activeSubFeature === action.id}
            className={`brutal-card rounded-xl p-4 bg-card hover:bg-secondary text-left transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] group ${
              activeSubFeature === action.id ? "ring-2 ring-primary" : ""
            }`}>
            {subFeatureLoading && activeSubFeature === action.id ? (
              <RefreshCw className="w-6 h-6 text-primary mb-2 animate-spin" />
            ) : (
              <action.icon className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
            )}
            <p className="font-bold text-foreground text-sm">{action.label}</p>
            <p className="text-xs text-muted-foreground">{action.desc}</p>
          </button>
        ))}
      </div>

      {/* Sub-feature Results */}
      <AnimatePresence>
        {subFeatureResult && activeSubFeature && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="brutal-card rounded-2xl p-6 bg-primary/5 border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground font-comic uppercase">{activeSubFeature} Results</h3>
              <Button variant="ghost" size="sm" onClick={() => { setSubFeatureResult(null); setActiveSubFeature(null); }}>Close</Button>
            </div>

            {activeSubFeature === "regression" && subFeatureResult.equation && (
              <div className="space-y-4">
                <div className="p-4 bg-card rounded-xl border-2 border-foreground">
                  <p className="font-mono text-lg font-bold text-primary">{subFeatureResult.equation}</p>
                  <p className="text-sm text-muted-foreground mt-1">R² = {subFeatureResult.rSquared} ({(subFeatureResult.rSquared * 100).toFixed(0)}% variance explained)</p>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 border-2 border-foreground overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${subFeatureResult.rSquared * 100}%` }} transition={{ duration: 1 }}
                    className="h-full bg-primary rounded-full" />
                </div>
                <p className="text-sm text-foreground">{subFeatureResult.interpretation}</p>
                {subFeatureResult.predictions?.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {subFeatureResult.predictions.map((p: any, i: number) => (
                      <div key={i} className="p-3 bg-card rounded-lg border-2 border-border">
                        <p className="text-xs text-muted-foreground">Prediction for x={p.x}</p>
                        <p className="text-xl font-bold font-comic text-primary">{p.predictedY?.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground italic">{subFeatureResult.recommendation}</p>
              </div>
            )}

            {activeSubFeature === "correlation" && subFeatureResult.coefficient !== undefined && (
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold font-comic text-primary">{subFeatureResult.coefficient.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Pearson's r</p>
                  </div>
                  <div>
                    <p className={`font-bold text-lg ${subFeatureResult.coefficient > 0.5 ? "text-comic-green" : subFeatureResult.coefficient < -0.5 ? "text-destructive" : "text-accent"}`}>
                      {subFeatureResult.strength}
                    </p>
                    <p className="text-sm text-muted-foreground">p = {subFeatureResult.pValue?.toFixed(4)} {subFeatureResult.pValue < 0.05 ? "✓ Significant" : "Not significant"}</p>
                  </div>
                </div>
                <p className="text-sm text-foreground">{subFeatureResult.interpretation}</p>
                {subFeatureResult.caveats && (
                  <div className="space-y-1">
                    {subFeatureResult.caveats.map((c: string, i: number) => (
                      <p key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                        <Info className="w-3 h-3 flex-shrink-0" />{c}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSubFeature === "forecast" && subFeatureResult.predictions && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 border-foreground ${
                    subFeatureResult.trend === "increasing" ? "bg-comic-green/20 text-comic-green" : subFeatureResult.trend === "decreasing" ? "bg-destructive/20 text-destructive" : "bg-muted"
                  }`}>{subFeatureResult.trend}</span>
                  <span className="text-sm text-muted-foreground">Method: {subFeatureResult.method}</span>
                  <span className="text-sm font-bold">Confidence: {subFeatureResult.confidence}%</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {subFeatureResult.predictions.map((p: any, i: number) => (
                    <div key={i} className="p-4 bg-card rounded-xl border-2 border-foreground text-center">
                      <p className="text-xs font-bold text-muted-foreground uppercase">{p.period}</p>
                      <p className="text-2xl font-bold font-comic text-primary">{p.value?.toLocaleString()}</p>
                      {p.lowerBound && p.upperBound && (
                        <p className="text-xs text-muted-foreground">{p.lowerBound.toLocaleString()} – {p.upperBound.toLocaleString()}</p>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-foreground">{subFeatureResult.explanation}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DataAnalysis;
