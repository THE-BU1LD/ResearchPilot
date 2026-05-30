import { useState, useEffect, useCallback, memo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Play, Pause, RotateCcw, X, Coffee, Brain, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type TimerMode = "focus" | "short-break" | "long-break";

const DURATIONS: Record<TimerMode, number> = {
  "focus": 25 * 60,
  "short-break": 5 * 60,
  "long-break": 15 * 60,
};

const MODE_CONFIG: Record<TimerMode, { label: string; icon: React.ElementType; color: string }> = {
  "focus": { label: "Focus", icon: Brain, color: "hsl(var(--primary))" },
  "short-break": { label: "Short Break", icon: Coffee, color: "hsl(var(--comic-green))" },
  "long-break": { label: "Long Break", icon: Zap, color: "hsl(var(--comic-blue))" },
};

const PomodoroTimer = memo(function PomodoroTimer() {
  const [collapsed, setCollapsed] = useState(true);
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(DURATIONS["focus"]);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setIsRunning(false);
            // Auto-switch mode
            if (mode === "focus") {
              setSessions(s => s + 1);
              const next: TimerMode = (sessions + 1) % 4 === 0 ? "long-break" : "short-break";
              setMode(next);
              return DURATIONS[next];
            } else {
              setMode("focus");
              return DURATIONS["focus"];
            }
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, mode, sessions, timeLeft]);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(DURATIONS[newMode]);
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setTimeLeft(DURATIONS[mode]);
    setIsRunning(false);
  }, [mode]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - timeLeft / DURATIONS[mode];
  const cfg = MODE_CONFIG[mode];
  const ModeIcon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <AnimatePresence mode="wait">
        {collapsed ? (
          <motion.button
            key="collapsed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCollapsed(false)}
            className="w-14 h-14 rounded-xl bg-card border-3 border-foreground flex items-center justify-center relative"
            style={{ boxShadow: "var(--shadow-brutal-sm)" }}
          >
            <Timer className="w-6 h-6 text-foreground" />
            {isRunning && (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary border-2 border-foreground"
              />
            )}
            <span className="absolute -bottom-5 text-[10px] font-bold text-muted-foreground font-mono">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-72 bg-card border-3 border-foreground rounded-xl overflow-hidden"
            style={{ boxShadow: "var(--shadow-brutal)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b-3 border-foreground/20">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-primary" />
                <span className="font-comic text-sm tracking-wide">FOCUS TIMER</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setCollapsed(true)} className="p-1 hover:bg-secondary rounded">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mode selector */}
            <div className="flex gap-1 px-3 pt-3">
              {(Object.keys(DURATIONS) as TimerMode[]).map(m => {
                const c = MODE_CONFIG[m];
                return (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`flex-1 px-2 py-1.5 text-[10px] font-bold uppercase rounded-lg border-2 transition-colors ${
                      mode === m
                        ? "bg-primary text-primary-foreground border-foreground"
                        : "bg-muted text-muted-foreground border-transparent hover:border-foreground/20"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            {/* Timer display */}
            <div className="px-4 py-6 text-center">
              {/* Progress ring */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                  <circle
                    cx="60" cy="60" r="54" fill="none"
                    stroke={cfg.color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={2 * Math.PI * 54 * (1 - progress)}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <ModeIcon className="w-5 h-5 text-muted-foreground mb-1" />
                  <span className="font-mono text-3xl font-bold text-foreground">
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={() => setIsRunning(!isRunning)}
                    className="brutal-button bg-primary text-primary-foreground h-10 px-6"
                  >
                    {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isRunning ? "Pause" : "Start"}
                  </Button>
                </motion.div>
                <Button variant="outline" size="icon" onClick={reset} className="border-2 border-foreground h-10 w-10">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Sessions counter */}
            <div className="px-4 py-2 border-t-3 border-foreground/20 flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-bold">Sessions today</span>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(sessions, 8) }).map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-primary border border-foreground" />
                ))}
                {sessions === 0 && <span className="text-muted-foreground">0</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default PomodoroTimer;
