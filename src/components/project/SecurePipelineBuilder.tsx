import { useState, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { z } from "zod";
import {
  Plus,
  Trash2,
  Settings,
  Play,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Link,
  Unlink,
  Zap,
  Database,
  Upload,
  Download,
  Filter,
  Merge,
  Split,
  BarChart3,
  Brain,
  GripVertical,
  Shield,
  Lock,
  AlertTriangle,
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
import { ComicPanelBorder, ComicSpinner } from "@/components/interactive/ComicEffects";

// Enhanced input validation schemas with stricter rules
const urlSchema = z.string().url().or(z.literal(""));
const stepNameSchema = z.string().min(1).max(100).regex(/^[\w\s\-_.]+$/, "Only alphanumeric characters, spaces, hyphens, underscores, and periods are allowed");
const configSchema = z.record(z.unknown()).optional();
const emailSchema = z.string().email().optional();
const apiKeySchema = z.string().regex(/^[a-zA-Z0-9_-]{20,}$/, "Invalid API key format").optional();

// OWASP-aligned dangerous patterns to block
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:text\/html/gi,
  /vbscript:/gi,
  /expression\s*\(/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
  /url\s*\(\s*["']?data:/gi,
];

// Blocked TLDs and patterns for security
const BLOCKED_DOMAINS = [
  /\.onion$/,
  /\.tor2web\./,
  /localhost/i,
  /127\.0\.0\.1/,
  /0\.0\.0\.0/,
  /\[::1\]/,
  /\.local$/,
  /\.internal$/,
];

// Rate limiting tracker
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100;
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(stepId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(stepId);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(stepId, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT) {
    return false;
  }
  
  entry.count++;
  return true;
}

// Enhanced sanitization with XSS prevention
function sanitizeInput(input: string): string {
  let sanitized = input;
  
  // Remove HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, "");
  
  // Encode dangerous characters
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
  
  // Remove null bytes and control characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  
  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(sanitized)) {
      sanitized = sanitized.replace(pattern, "[BLOCKED]");
    }
  }
  
  return sanitized.trim().slice(0, 500);
}

// Validate and sanitize config objects
function validateConfig(config: Record<string, unknown>): { valid: boolean; sanitized: Record<string, unknown>; errors: string[] } {
  const errors: string[] = [];
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(config)) {
    const sanitizedKey = sanitizeInput(key);
    
    if (typeof value === "string") {
      sanitized[sanitizedKey] = sanitizeInput(value);
    } else if (typeof value === "number" || typeof value === "boolean") {
      sanitized[sanitizedKey] = value;
    } else if (value === null) {
      sanitized[sanitizedKey] = null;
    } else {
      errors.push(`Invalid value type for key: ${sanitizedKey}`);
    }
  }
  
  return { valid: errors.length === 0, sanitized, errors };
}

// Enhanced API endpoint validation with security checks
function validateApiEndpoint(endpoint: string): { valid: boolean; error?: string; severity?: "error" | "warning" } {
  if (!endpoint) return { valid: true };

  try {
    const url = new URL(endpoint);
    
    // Only allow HTTPS for security (strict enforcement)
    if (url.protocol !== "https:") {
      return { valid: false, error: "HTTPS required - HTTP connections are not secure", severity: "error" };
    }
    
    const hostname = url.hostname.toLowerCase();
    
    // Block dangerous domains
    for (const pattern of BLOCKED_DOMAINS) {
      if (pattern.test(hostname)) {
        return { valid: false, error: "This domain is not allowed for security reasons", severity: "error" };
      }
    }
    
    // Block private IP ranges (SSRF prevention)
    const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (ipv4Match) {
      const [, a, b, c, d] = ipv4Match.map(Number);
      if (
        a === 10 || // 10.0.0.0/8
        (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12
        (a === 192 && b === 168) || // 192.168.0.0/16
        a === 127 || // loopback
        a === 0 // 0.0.0.0/8
      ) {
        return { valid: false, error: "Private/local IP addresses are not allowed", severity: "error" };
      }
    }
    
    // Check for suspicious paths
    const suspiciousPaths = ["/admin", "/internal", "/debug", "/.env", "/config"];
    if (suspiciousPaths.some(p => url.pathname.toLowerCase().includes(p))) {
      return { valid: true, error: "Path contains potentially sensitive endpoints - verify this is intentional", severity: "warning" };
    }
    
    // Block file:// and other dangerous protocols
    if (!["https:", "http:"].includes(url.protocol)) {
      return { valid: false, error: "Only HTTP/HTTPS protocols are allowed", severity: "error" };
    }
    
    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid URL format", severity: "error" };
  }
}

export interface SecurePipelineStep {
  id: string;
  type: PipelineStepType;
  name: string;
  config: Record<string, unknown>;
  status: "idle" | "running" | "success" | "error";
  apiEndpoint?: string;
  isApiConnected: boolean;
  isSecure: boolean;
  validationErrors?: string[];
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

const stepTypeConfig: Record<
  PipelineStepType,
  { icon: React.ElementType; label: string; color: string; requiresAuth: boolean; description: string }
> = {
  "data-input": { icon: Upload, label: "Data Input", color: "hsl(145 70% 45%)", requiresAuth: false, description: "Import CSV, JSON, or Excel files" },
  "data-transform": { icon: Database, label: "Transform", color: "hsl(210 100% 55%)", requiresAuth: false, description: "Clean, reshape, and modify data" },
  filter: { icon: Filter, label: "Filter", color: "hsl(45 95% 50%)", requiresAuth: false, description: "Remove unwanted rows or columns" },
  merge: { icon: Merge, label: "Merge", color: "hsl(270 70% 55%)", requiresAuth: false, description: "Combine multiple datasets" },
  split: { icon: Split, label: "Split", color: "hsl(330 80% 60%)", requiresAuth: false, description: "Divide data into subsets" },
  analysis: { icon: BarChart3, label: "Analysis", color: "hsl(185 80% 45%)", requiresAuth: false, description: "Run statistical calculations" },
  "ai-process": { icon: Brain, label: "AI Process", color: "hsl(0 85% 55%)", requiresAuth: true, description: "AI-powered data processing" },
  export: { icon: Download, label: "Export", color: "hsl(25 95% 55%)", requiresAuth: false, description: "Save results to file" },
  "api-call": { icon: Zap, label: "API Call", color: "hsl(60 90% 50%)", requiresAuth: true, description: "Connect to external services" },
};

// Generate secure step ID
function generateSecureId(): string {
  const array = new Uint32Array(2);
  crypto.getRandomValues(array);
  return `step-${array[0].toString(36)}-${array[1].toString(36)}`;
}

interface SecurePipelineBuilderProps {
  steps: SecurePipelineStep[];
  onStepsChange: (steps: SecurePipelineStep[]) => void;
  onRun: () => void;
  isRunning: boolean;
}

const StepCard = memo(function StepCard({
  step,
  index,
  onUpdate,
  onRemove,
  onToggleApi,
  onConfigure,
}: {
  step: SecurePipelineStep;
  index: number;
  onUpdate: (id: string, updates: Partial<SecurePipelineStep>) => void;
  onRemove: (id: string) => void;
  onToggleApi: (step: SecurePipelineStep) => void;
  onConfigure: (step: SecurePipelineStep) => void;
}) {
  const config = stepTypeConfig[step.type];
  const Icon = config.icon;

  return (
    <Reorder.Item key={step.id} value={step}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="relative flex items-start gap-4 pl-4"
      >
        {/* Step node */}
        <div
          className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center border-3 border-foreground cursor-grab active:cursor-grabbing shadow-brutal-sm transition-transform hover:scale-105"
          style={{ backgroundColor: config.color }}
        >
          <Icon className="w-5 h-5 text-white" />
          {step.status === "running" && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-white/50"
              animate={{ scale: [1, 1.15, 1], opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          )}
          {step.isSecure && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-comic-green rounded-full flex items-center justify-center border-2 border-foreground">
              <Shield className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Step card */}
        <ComicPanelBorder variant="standard" className="flex-1 p-4 bg-card group rounded-xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                <input
                  type="text"
                  value={step.name}
                  onChange={(e) => {
                    const sanitized = sanitizeInput(e.target.value);
                    onUpdate(step.id, { name: sanitized });
                  }}
                  className="font-bold text-foreground bg-transparent border-none outline-none focus:ring-2 focus:ring-primary rounded px-1"
                  maxLength={100}
                  aria-label="Step name"
                />
                {step.status === "success" && <CheckCircle2 className="w-4 h-4 text-comic-green" />}
                {step.status === "error" && <AlertCircle className="w-4 h-4 text-destructive" />}
                {step.status === "running" && <ComicSpinner size={16} />}
                {config.requiresAuth && (
                  <span title="Requires authentication">
                    <Lock className="w-3 h-3 text-muted-foreground" />
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                {config.label}
                {step.validationErrors && step.validationErrors.length > 0 && (
                  <span className="text-destructive flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {step.validationErrors.length} issue(s)
                  </span>
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleApi(step)}
                className={step.isApiConnected ? "text-comic-green" : "text-muted-foreground"}
                title={step.isApiConnected ? "Disconnect API" : "Connect API"}
              >
                {step.isApiConnected ? <Link className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onConfigure(step)}>
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(step.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* API Connection indicator */}
          <AnimatePresence>
            {step.isApiConnected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 rounded-lg bg-comic-green/10 border-2 border-comic-green/30"
              >
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-comic-green" />
                  <span className="text-comic-green font-bold">API Connected</span>
                </div>
                <input
                  type="url"
                  value={step.apiEndpoint || ""}
                  onChange={(e) => {
                    const validation = validateApiEndpoint(e.target.value);
                    onUpdate(step.id, {
                      apiEndpoint: e.target.value,
                      validationErrors: validation.valid ? [] : [validation.error || "Invalid URL"],
                    });
                  }}
                  placeholder="https://api.example.com/v1/process"
                  className="w-full mt-2 px-3 py-2 text-xs bg-background border-2 border-foreground/20 rounded-lg focus:border-primary outline-none"
                  aria-label="API endpoint URL"
                />
                {step.validationErrors && step.validationErrors.length > 0 && (
                  <p className="text-xs text-destructive mt-1">{step.validationErrors[0]}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </ComicPanelBorder>
      </motion.div>
    </Reorder.Item>
  );
});

export const SecurePipelineBuilder = memo(function SecurePipelineBuilder({
  steps,
  onStepsChange,
  onRun,
  isRunning,
}: SecurePipelineBuilderProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<SecurePipelineStep | null>(null);

  const addStep = useCallback(
    (type: PipelineStepType) => {
      const newStep: SecurePipelineStep = {
        id: generateSecureId(),
        type,
        name: sanitizeInput(stepTypeConfig[type].label),
        config: {},
        status: "idle",
        isApiConnected: false,
        isSecure: !stepTypeConfig[type].requiresAuth,
        validationErrors: [],
      };
      onStepsChange([...steps, newStep]);
      setIsAddDialogOpen(false);
    },
    [steps, onStepsChange]
  );

  const removeStep = useCallback(
    (id: string) => {
      onStepsChange(steps.filter((s) => s.id !== id));
    },
    [steps, onStepsChange]
  );

  const updateStep = useCallback(
    (id: string, updates: Partial<SecurePipelineStep>) => {
      onStepsChange(steps.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    },
    [steps, onStepsChange]
  );

  const toggleApiConnection = useCallback(
    (step: SecurePipelineStep) => {
      updateStep(step.id, {
        isApiConnected: !step.isApiConnected,
        apiEndpoint: !step.isApiConnected ? "" : undefined,
        isSecure: step.isApiConnected, // Secure when API disconnected
      });
    },
    [updateStep]
  );

  // Validate pipeline before running
  const canRun = useMemo(() => {
    if (steps.length === 0) return false;
    if (isRunning) return false;

    // Check all steps are valid
    return steps.every((step) => {
      if (step.isApiConnected && step.apiEndpoint) {
        const validation = validateApiEndpoint(step.apiEndpoint);
        return validation.valid;
      }
      return true;
    });
  }, [steps, isRunning]);

  const securityScore = useMemo(() => {
    if (steps.length === 0) return 100;
    const secureSteps = steps.filter((s) => s.isSecure).length;
    return Math.round((secureSteps / steps.length) * 100);
  }, [steps]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center border-3 border-foreground shadow-brutal">
            <Zap className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-comic text-2xl text-foreground tracking-wide">SECURE PIPELINE</h3>
            <p className="text-sm text-muted-foreground">Build validated research workflows</p>
          </div>
        </div>

        {/* Security indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-card border-2 border-foreground/20 rounded-lg">
            <Shield className={`w-4 h-4 ${securityScore >= 80 ? "text-comic-green" : securityScore >= 50 ? "text-yellow-500" : "text-destructive"}`} />
            <span className="text-sm font-bold">{securityScore}% Secure</span>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="brutal-button bg-secondary text-secondary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </DialogTrigger>
            <DialogContent className="brutal-card max-w-2xl rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-comic text-2xl">Add Pipeline Step</DialogTitle>
                <DialogDescription>Choose a step type for your research pipeline</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-3 pt-4">
                {(Object.keys(stepTypeConfig) as PipelineStepType[]).map((type) => {
                  const config = stepTypeConfig[type];
                  const Icon = config.icon;
                  return (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => addStep(type)}
                      className="p-4 rounded-xl border-3 border-foreground bg-card text-left transition-all hover:shadow-brutal group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-foreground transition-transform group-hover:rotate-6"
                          style={{ backgroundColor: config.color }}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        {config.requiresAuth && <Lock className="w-3 h-3 text-muted-foreground" />}
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
            disabled={!canRun}
            className="brutal-button bg-comic-green text-comic-green-foreground"
          >
            {isRunning ? (
              <>
                <ComicSpinner size={16} className="mr-2" />
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
          className="p-12 rounded-2xl border-3 border-dashed border-muted-foreground/30 text-center comic-dots"
        >
          <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4 border-3 border-foreground/20">
            <Zap className="w-8 h-8 text-muted-foreground" />
          </div>
          <h4 className="font-comic text-xl text-foreground mb-2">No Steps Yet!</h4>
          <p className="text-sm text-muted-foreground mb-4">Add steps to build your secure research pipeline</p>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(true)} className="border-2 border-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add First Step
          </Button>
        </motion.div>
      ) : (
        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-[30px] top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full" />

          <Reorder.Group axis="y" values={steps} onReorder={onStepsChange} className="space-y-4">
            {steps.map((step, index) => (
              <StepCard
                key={step.id}
                step={step}
                index={index}
                onUpdate={updateStep}
                onRemove={removeStep}
                onToggleApi={toggleApiConnection}
                onConfigure={setSelectedStep}
              />
            ))}
          </Reorder.Group>
        </div>
      )}

      {/* Step Configuration Dialog */}
      <Dialog open={!!selectedStep} onOpenChange={() => setSelectedStep(null)}>
        <DialogContent className="brutal-card rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-comic text-xl flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Configure: {selectedStep?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedStep && (
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  Step Name
                  <span className="text-xs text-muted-foreground font-normal">(alphanumeric, max 100 chars)</span>
                </label>
                <input
                  type="text"
                  value={selectedStep.name}
                  onChange={(e) => {
                    const sanitized = sanitizeInput(e.target.value);
                    updateStep(selectedStep.id, { name: sanitized });
                    setSelectedStep({ ...selectedStep, name: sanitized });
                  }}
                  className="w-full mt-1 px-3 py-2 rounded-lg border-3 border-foreground bg-card focus:ring-2 focus:ring-primary outline-none"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  API Endpoint
                  <span className="text-xs text-muted-foreground font-normal">(HTTPS only)</span>
                </label>
                <input
                  type="url"
                  value={selectedStep.apiEndpoint || ""}
                  onChange={(e) => {
                    const validation = validateApiEndpoint(e.target.value);
                    updateStep(selectedStep.id, {
                      apiEndpoint: e.target.value,
                      validationErrors: validation.valid ? [] : [validation.error || "Invalid URL"],
                    });
                    setSelectedStep({
                      ...selectedStep,
                      apiEndpoint: e.target.value,
                      validationErrors: validation.valid ? [] : [validation.error || "Invalid URL"],
                    });
                  }}
                  placeholder="https://api.example.com/v1/process"
                  className="w-full mt-1 px-3 py-2 rounded-lg border-3 border-foreground bg-card focus:ring-2 focus:ring-primary outline-none"
                />
                {selectedStep.validationErrors && selectedStep.validationErrors.length > 0 && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {selectedStep.validationErrors[0]}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <input
                  type="checkbox"
                  id="api-connected"
                  checked={selectedStep.isApiConnected}
                  onChange={() => toggleApiConnection(selectedStep)}
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="api-connected" className="text-sm text-foreground font-medium">
                  Enable API integration for this step
                </label>
              </div>
              <Button onClick={() => setSelectedStep(null)} className="w-full brutal-button bg-primary text-primary-foreground">
                Save Configuration
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default SecurePipelineBuilder;
