import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Settings, 
  Play, 
  Pause,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Link,
  Unlink,
  Zap,
  Database,
  FileText,
  BarChart3,
  Brain,
  Send,
  Download,
  Upload,
  Filter,
  Merge,
  Split,
  GripVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface PipelineStep {
  id: string;
  type: PipelineStepType;
  name: string;
  config: Record<string, any>;
  status: "idle" | "running" | "success" | "error";
  apiEndpoint?: string;
  isApiConnected: boolean;
}

export type PipelineStepType = 
  | "data-input"
  | "data-transform"
  | "filter"
  | "merge"
  | "split"
  | "analysis"
  | "ai-process"
  | "export"
  | "api-call";

const stepTypeConfig: Record<PipelineStepType, { icon: React.ReactNode; label: string; color: string }> = {
  "data-input": { icon: <Upload className="w-5 h-5" />, label: "Data Input", color: "hsl(145 70% 45%)" },
  "data-transform": { icon: <Database className="w-5 h-5" />, label: "Transform", color: "hsl(210 100% 55%)" },
  "filter": { icon: <Filter className="w-5 h-5" />, label: "Filter", color: "hsl(45 95% 50%)" },
  "merge": { icon: <Merge className="w-5 h-5" />, label: "Merge", color: "hsl(270 70% 55%)" },
  "split": { icon: <Split className="w-5 h-5" />, label: "Split", color: "hsl(330 80% 60%)" },
  "analysis": { icon: <BarChart3 className="w-5 h-5" />, label: "Analysis", color: "hsl(185 80% 45%)" },
  "ai-process": { icon: <Brain className="w-5 h-5" />, label: "AI Process", color: "hsl(0 85% 55%)" },
  "export": { icon: <Download className="w-5 h-5" />, label: "Export", color: "hsl(25 95% 55%)" },
  "api-call": { icon: <Zap className="w-5 h-5" />, label: "API Call", color: "hsl(60 90% 50%)" },
};

interface PipelineBuilderProps {
  steps: PipelineStep[];
  onStepsChange: (steps: PipelineStep[]) => void;
  onRun: () => void;
  isRunning: boolean;
}

export function PipelineBuilder({ steps, onStepsChange, onRun, isRunning }: PipelineBuilderProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<PipelineStep | null>(null);

  const addStep = (type: PipelineStepType) => {
    const newStep: PipelineStep = {
      id: `step-${Date.now()}`,
      type,
      name: stepTypeConfig[type].label,
      config: {},
      status: "idle",
      isApiConnected: false,
    };
    onStepsChange([...steps, newStep]);
    setIsAddDialogOpen(false);
  };

  const removeStep = (id: string) => {
    onStepsChange(steps.filter(s => s.id !== id));
  };

  const updateStep = (id: string, updates: Partial<PipelineStep>) => {
    onStepsChange(steps.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const toggleApiConnection = (step: PipelineStep) => {
    updateStep(step.id, { 
      isApiConnected: !step.isApiConnected,
      apiEndpoint: !step.isApiConnected ? "https://api.example.com/v1/" : undefined
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-comic text-2xl text-foreground">Research Pipeline</h3>
          <p className="text-sm text-muted-foreground">Build automated workflows for your research</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="brutal-button bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </DialogTrigger>
            <DialogContent className="brutal-card max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-comic text-2xl">Add Pipeline Step</DialogTitle>
                <DialogDescription>
                  Choose a step type to add to your research pipeline
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-3 pt-4">
                {(Object.keys(stepTypeConfig) as PipelineStepType[]).map((type) => {
                  const config = stepTypeConfig[type];
                  return (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addStep(type)}
                      className="p-4 rounded-xl border-3 border-foreground bg-card text-left transition-all hover:shadow-brutal-primary"
                      style={{ boxShadow: `4px 4px 0px ${config.color}` }}
                    >
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-2 border-2 border-foreground"
                        style={{ backgroundColor: config.color }}
                      >
                        <span className="text-white">{config.icon}</span>
                      </div>
                      <span className="font-bold text-foreground">{config.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            onClick={onRun}
            disabled={steps.length === 0 || isRunning}
            className="brutal-button bg-comic-green text-comic-green-foreground"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Pipeline
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Pipeline Steps */}
      {steps.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-12 rounded-xl border-3 border-dashed border-muted-foreground/30 text-center"
        >
          <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-muted-foreground" />
          </div>
          <h4 className="font-bold text-foreground mb-2">No steps yet</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Add steps to build your research pipeline
          </p>
          <Button 
            variant="outline" 
            onClick={() => setIsAddDialogOpen(true)}
            className="border-2 border-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Step
          </Button>
        </motion.div>
      ) : (
        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
          
          <Reorder.Group 
            axis="y" 
            values={steps} 
            onReorder={onStepsChange}
            className="space-y-4"
          >
            {steps.map((step, index) => {
              const config = stepTypeConfig[step.type];
              return (
                <Reorder.Item key={step.id} value={step}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex items-start gap-4 pl-4"
                  >
                    {/* Step node */}
                    <div 
                      className="relative z-10 w-10 h-10 rounded-lg flex items-center justify-center border-3 border-foreground cursor-grab active:cursor-grabbing"
                      style={{ backgroundColor: config.color }}
                    >
                      <span className="text-white">{config.icon}</span>
                      {step.status === "running" && (
                        <motion.div
                          className="absolute inset-0 rounded-lg border-2 border-white"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        />
                      )}
                    </div>

                    {/* Step card */}
                    <div className="flex-1 p-4 rounded-xl border-3 border-foreground bg-card shadow-brutal group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                            <input
                              type="text"
                              value={step.name}
                              onChange={(e) => updateStep(step.id, { name: e.target.value })}
                              className="font-bold text-foreground bg-transparent border-none outline-none"
                            />
                            {/* Status indicator */}
                            {step.status === "success" && <CheckCircle2 className="w-4 h-4 text-comic-green" />}
                            {step.status === "error" && <AlertCircle className="w-4 h-4 text-destructive" />}
                            {step.status === "running" && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{config.label}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleApiConnection(step)}
                            className={step.isApiConnected ? "text-comic-green" : "text-muted-foreground"}
                            title={step.isApiConnected ? "Disconnect API" : "Connect API"}
                          >
                            {step.isApiConnected ? <Link className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedStep(step)}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeStep(step.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* API Connection indicator */}
                      {step.isApiConnected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 p-2 rounded-lg bg-comic-green/10 border border-comic-green/30"
                        >
                          <div className="flex items-center gap-2 text-sm">
                            <Zap className="w-4 h-4 text-comic-green" />
                            <span className="text-comic-green font-medium">API Connected</span>
                            <input
                              type="text"
                              value={step.apiEndpoint || ""}
                              onChange={(e) => updateStep(step.id, { apiEndpoint: e.target.value })}
                              placeholder="Enter API endpoint..."
                              className="flex-1 bg-transparent border-none outline-none text-xs text-muted-foreground"
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        </div>
      )}

      {/* Step Configuration Dialog */}
      <Dialog open={!!selectedStep} onOpenChange={() => setSelectedStep(null)}>
        <DialogContent className="brutal-card">
          <DialogHeader>
            <DialogTitle className="font-comic text-xl">
              Configure: {selectedStep?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedStep && (
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-foreground">Step Name</label>
                <input
                  type="text"
                  value={selectedStep.name}
                  onChange={(e) => updateStep(selectedStep.id, { name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-foreground bg-card"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">API Endpoint (optional)</label>
                <input
                  type="text"
                  value={selectedStep.apiEndpoint || ""}
                  onChange={(e) => updateStep(selectedStep.id, { apiEndpoint: e.target.value })}
                  placeholder="https://api.example.com/v1/process"
                  className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-foreground bg-card"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="api-connected"
                  checked={selectedStep.isApiConnected}
                  onChange={() => toggleApiConnection(selectedStep)}
                  className="w-4 h-4"
                />
                <label htmlFor="api-connected" className="text-sm text-foreground">
                  Enable API integration for this step
                </label>
              </div>
              <Button 
                onClick={() => setSelectedStep(null)}
                className="w-full brutal-button bg-primary text-primary-foreground"
              >
                Save Configuration
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
