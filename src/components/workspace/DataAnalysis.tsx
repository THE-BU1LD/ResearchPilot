import { useState, useMemo, memo, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
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

import {
  analyzeRows, descriptiveInsights, parseAnalysisCSV, summarizeRows, MAX_ANALYSIS_BYTES,
  type AnalysisFeature, type AnalysisRow,
} from "@/lib/data-analysis";

type DataRow = AnalysisRow;

const sampleData: DataRow[] = [
  { category: "Q1", value: 4500, growth: 12, target: 4000 },
  { category: "Q2", value: 5200, growth: 15.5, target: 5000 },
  { category: "Q3", value: 4800, growth: -7.7, target: 5500 },
  { category: "Q4", value: 6100, growth: 27, target: 5800 },
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
  const [dataSource, setDataSource] = useState("Example dataset");
  const [insightSource, setInsightSource] = useState("Calculated summary");
  const analysisRequest = useRef(0);
  const importRequest = useRef(0);
  const pieData = data.map(row => ({ name: row.category, value: row.value }));
  const supportsPie = data.every(row => row.value >= 0) && data.some(row => row.value > 0);
  const [activeChart, setActiveChart] = useState<"bar" | "line" | "pie" | "scatter">("bar");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [showTable, setShowTable] = useState(false);
  
  // New: sub-feature states
  const [activeSubFeature, setActiveSubFeature] = useState<AnalysisFeature | null>(null);
  const [subFeatureResult, setSubFeatureResult] = useState<ReturnType<typeof analyzeRows> | null>(null);
  const [subFeatureLoading, setSubFeatureLoading] = useState(false);

  const stats = useMemo(() => summarizeRows(data), [data]);

  const handleAIAnalysis = async () => {
    const request = ++analysisRequest.current;
    setIsAnalyzing(true);
    const statsSummary = `Dataset: ${stats.count} observations. Mean=${stats.mean.toFixed(1)}, Median=${stats.median.toFixed(1)}, StdDev=${stats.stdDev.toFixed(1)}, Range=${stats.range}, AvgGrowth=${stats.avgGrowth.toFixed(1)}%. Values: ${data.map(d => `${d.category}: ${d.value} (growth: ${d.growth}%, target: ${d.target})`).join("; ")}`;

    try {
      const { data: aiData, error } = await supabase.functions.invoke("ai-writing-feedback", {
        body: { text: statsSummary, type: "insights" },
      });
      if (request !== analysisRequest.current) return;
      if (error) throw error;
      if (Array.isArray(aiData?.result) && aiData.result.length > 0 && aiData.result.every((item: unknown) => typeof item === "string")) {
        setInsightSource("AI-generated commentary — check against calculated summaries");
        setAiInsights(aiData.result);
        toast.success("AI analysis complete!");
      } else {
        throw new Error("Empty response");
      }
    } catch {
      if (request !== analysisRequest.current) return;
      setInsightSource("Calculated summary");
      setAiInsights(descriptiveInsights(data));
      toast.success("Calculated summary ready");
    } finally {
      if (request === analysisRequest.current) setIsAnalyzing(false);
    }
  };

  const handleSubFeature = useCallback((feature: AnalysisFeature) => {
    setActiveSubFeature(feature);
    setSubFeatureLoading(true);
    setSubFeatureResult(null);
    try {
      setSubFeatureResult(analyzeRows(data, feature));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Analysis could not be calculated");
    } finally {
      setSubFeatureLoading(false);
    }
  }, [data]);

  const handleCSVImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    e.currentTarget.value = "";
    const request = ++importRequest.current;
    try {
      if (file.size > MAX_ANALYSIS_BYTES) throw new Error("CSV files are limited to 1 MiB");
      const rows = parseAnalysisCSV(await file.text());
      if (request !== importRequest.current) return;
      ++analysisRequest.current;
      setIsAnalyzing(false);
      setAiInsights([]);
      setSubFeatureResult(null);
      setActiveSubFeature(null);
      setActiveChart("bar");
      setData(rows);
      setDataSource(file.name);
      toast.success(`Imported ${rows.length} rows`);
    } catch (error) {
      if (request === importRequest.current) toast.error(error instanceof Error ? error.message : "CSV could not be read");
    }
  }, []);

  const exportSummary = () => {
    const blob = new Blob([JSON.stringify({ source: dataSource, summary: stats, rows: data }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "research-muse-data-summary.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const chartButtons = [
    { id: "bar", icon: BarChart3, label: "Bar" },
    { id: "line", icon: TrendingUp, label: "Line" },
    { id: "pie", icon: PieChart, label: "Pie" },
    { id: "scatter", icon: Activity, label: "Scatter" },
  ] as const;

  const getInsightIcon = (text: string) => {
    if (text.includes("[TREND]")) return <TrendingUp className="w-4 h-4 text-comic-green shrink-0" />;
    if (text.includes("[ANOMALY]")) return <Zap className="w-4 h-4 text-accent shrink-0" />;
    if (text.includes("[RECOMMENDATION]")) return <Target className="w-4 h-4 text-primary shrink-0" />;
    if (text.includes("[COMPARISON]")) return <ArrowUpDown className="w-4 h-4 text-comic-blue shrink-0" />;
    if (text.includes("[PREDICTION]")) return <Brain className="w-4 h-4 text-purple-500 shrink-0" />;
    return <Sparkles className="w-4 h-4 text-primary shrink-0" />;
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
              <p className="text-sm text-muted-foreground font-medium">{dataSource} · {stats.count} rows</p>
              <p className="text-xs text-muted-foreground">CSV columns: category, value, growth, target. Limit: 1 MiB / 10,000 rows.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer">
              <input type="file" accept=".csv" className="hidden" onChange={handleCSVImport} />
              <Button variant="outline" className="border-2 border-foreground hover:bg-secondary" asChild>
                <span><Upload className="w-4 h-4" />Import CSV</span>
              </Button>
            </label>
            <Button variant="outline" className="border-2 border-foreground hover:bg-secondary" onClick={exportSummary}>
              <Download className="w-4 h-4" />Export summary
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
        <StatCard icon={Sigma} label="Total Sum" value={stats.sum.toLocaleString()} color="primary" explainer="Sum of all values" />
        <StatCard icon={Calculator} label="Mean Avg" value={stats.mean.toFixed(1)} color="primary" explainer="Arithmetic average" />
        <StatCard icon={ArrowUpDown} label="Median" value={stats.median.toFixed(1)} color="primary" explainer="Middle value when sorted" />
        <StatCard icon={Percent} label="Avg Growth" value={`${stats.avgGrowth > 0 ? "+" : ""}${stats.avgGrowth.toFixed(1)}%`} color={stats.avgGrowth >= 0 ? "comic-green" : "destructive"} trend={stats.avgGrowth >= 0 ? "up" : "down"} trendValue={`${Math.abs(stats.avgGrowth).toFixed(1)}%`} explainer="Average percentage change" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard icon={Hash} label="Count" value={stats.count} explainer="Number of data points" />
        <StatCard icon={Target} label="Min" value={stats.min.toLocaleString()} explainer="Smallest value" />
        <StatCard icon={Target} label="Max" value={stats.max.toLocaleString()} explainer="Largest value" />
        <StatCard icon={Activity} label="Range" value={stats.range.toLocaleString()} explainer="Max minus min" />
        <StatCard icon={Gauge} label="Std Dev" value={stats.stdDev.toFixed(1)} subtext="Population σ" explainer="Population standard deviation of the displayed rows" />
      </div>

      {/* AI Insights */}
      <AnimatePresence>
        {aiInsights.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="brutal-card rounded-2xl p-5 bg-primary/5 border-primary/30">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground font-comic">{insightSource}</h3>
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
                onClick={() => setActiveChart(btn.id)}
                disabled={btn.id === "pie" && !supportsPie}
                title={btn.id === "pie" && !supportsPie ? "Pie charts require nonnegative values and a positive total" : undefined}>
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

      {/* Calculations use the current dataset directly. */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: "regression", icon: Calculator, label: "Regression", desc: "Run linear analysis" },
          { id: "correlation", icon: GitBranch, label: "Correlation", desc: "Find patterns" },
          { id: "forecast", icon: TrendingUp, label: "Extrapolate", desc: "Extend row-order trend" },
          { id: "compare", icon: Database, label: "Compare", desc: "vs. targets" },
        ].map((action) => (
          <button key={action.id}
            onClick={() => handleSubFeature(action.id as AnalysisFeature)}
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

            {subFeatureResult.kind === "regression" && (
              <div className="space-y-4">
                <div className="p-4 bg-card rounded-xl border-2 border-foreground">
                  <p className="font-mono text-lg font-bold text-primary">{subFeatureResult.equation}</p>
                  <p className="text-sm text-muted-foreground mt-1">{subFeatureResult.rSquared === null ? "R² is undefined for constant observed values" : `R² = ${subFeatureResult.rSquared.toFixed(4)} (${(subFeatureResult.rSquared * 100).toFixed(1)}% variance explained)`}</p>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 border-2 border-foreground overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(subFeatureResult.rSquared ?? 0) * 100}%` }} transition={{ duration: 1 }}
                    className="h-full bg-primary rounded-full" />
                </div>
                <p className="text-sm text-foreground">{subFeatureResult.interpretation}</p>
                {subFeatureResult.predictions?.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {subFeatureResult.predictions.map((p, i: number) => (
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

            {subFeatureResult.kind === "correlation" && (
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold font-comic text-primary">{subFeatureResult.coefficient === null ? "Undefined" : subFeatureResult.coefficient.toFixed(4)}</p>
                    <p className="text-xs text-muted-foreground">Pearson's r</p>
                  </div>
                  <div>
                    <p className={`font-bold text-lg ${(subFeatureResult.coefficient ?? 0) > 0.5 ? "text-comic-green" : (subFeatureResult.coefficient ?? 0) < -0.5 ? "text-destructive" : "text-accent"}`}>
                      {subFeatureResult.strength}
                    </p>
                    <p className="text-sm text-muted-foreground">{subFeatureResult.count} paired observations · row index and value</p>
                  </div>
                </div>
                <p className="text-sm text-foreground">{subFeatureResult.interpretation}</p>
                {subFeatureResult.caveats && (
                  <div className="space-y-1">
                    {subFeatureResult.caveats.map((c: string, i: number) => (
                      <p key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                        <Info className="w-3 h-3 shrink-0" />{c}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {subFeatureResult.kind === "compare" && (
              <div className="space-y-3">
                <p className="text-sm">Total value minus target: {subFeatureResult.totalDifference.toLocaleString()}</p>
                {subFeatureResult.comparisons.map((row, i) => (
                  <p key={i} className="text-sm">{row.category}: {row.difference.toLocaleString()} ({row.percentage === null ? "percentage undefined for a zero target" : `${row.percentage.toFixed(2)}% of absolute target`})</p>
                ))}
              </div>
            )}

            {subFeatureResult.kind === "forecast" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 border-foreground ${
                    subFeatureResult.trend === "increasing" ? "bg-comic-green/20 text-comic-green" : subFeatureResult.trend === "decreasing" ? "bg-destructive/20 text-destructive" : "bg-muted"
                  }`}>{subFeatureResult.trend}</span>
                  <span className="text-sm text-muted-foreground">Method: {subFeatureResult.method}</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {subFeatureResult.predictions.map((p, i: number) => (
                    <div key={i} className="p-4 bg-card rounded-xl border-2 border-foreground text-center">
                      <p className="text-xs font-bold text-muted-foreground uppercase">{p.period}</p>
                      <p className="text-2xl font-bold font-comic text-primary">{p.value?.toLocaleString()}</p>
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
