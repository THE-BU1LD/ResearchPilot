import { useState, useRef, useCallback, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Settings, Play, Loader2, Zap, Database, Upload, Download,
  Filter, Merge, Split, BarChart3, Brain, GripVertical, Shield, CheckCircle2,
  AlertCircle, Lock, X, MousePointer2, ZoomIn, ZoomOut, Maximize2, Info, Layout, Grid3X3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { FeatureExplainer } from "@/components/ui/feature-explainer";

/* ─── Types ─── */
export interface PipelineNode {
  id: string;
  type: PipelineNodeType;
  name: string;
  x: number;
  y: number;
  config: Record<string, unknown>;
  status: "idle" | "running" | "success" | "error";
  apiEndpoint?: string;
  isApiConnected: boolean;
  outputs: string[]; // ids of nodes this connects to
}

export type PipelineNodeType =
  | "data-input" | "data-transform" | "filter" | "merge"
  | "split" | "analysis" | "ai-process" | "export" | "api-call";

const NODE_TYPES: Record<PipelineNodeType, { icon: React.ElementType; label: string; color: string; desc: string }> = {
  "data-input":     { icon: Upload,    label: "Data Input",  color: "hsl(145 70% 45%)",  desc: "Import CSV, JSON, or files" },
  "data-transform": { icon: Database,  label: "Transform",   color: "hsl(210 100% 55%)", desc: "Clean & reshape data" },
  "filter":         { icon: Filter,    label: "Filter",      color: "hsl(45 95% 50%)",   desc: "Remove unwanted rows" },
  "merge":          { icon: Merge,     label: "Merge",       color: "hsl(270 70% 55%)",  desc: "Combine datasets" },
  "split":          { icon: Split,     label: "Split",       color: "hsl(330 80% 60%)",  desc: "Divide into subsets" },
  "analysis":       { icon: BarChart3, label: "Analysis",    color: "hsl(185 80% 45%)",  desc: "Statistical calculations" },
  "ai-process":     { icon: Brain,     label: "AI Process",  color: "hsl(0 85% 55%)",    desc: "AI-powered processing" },
  "export":         { icon: Download,  label: "Export",      color: "hsl(25 95% 55%)",   desc: "Save results" },
  "api-call":       { icon: Zap,       label: "API Call",    color: "hsl(60 90% 50%)",   desc: "External service call" },
};

const NODE_W = 200;
const NODE_H = 80;
const GRID_SIZE = 20;

function genId() {
  const a = new Uint32Array(2);
  crypto.getRandomValues(a);
  return `node-${a[0].toString(36)}-${a[1].toString(36)}`;
}

/* ─── SVG Connections ─── */
function ConnectionLines({ nodes }: { nodes: PipelineNode[] }) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const lines: { x1: number; y1: number; x2: number; y2: number; status: string }[] = [];

  for (const node of nodes) {
    for (const targetId of node.outputs) {
      const target = nodeMap.get(targetId);
      if (!target) continue;
      lines.push({
        x1: node.x + NODE_W / 2,
        y1: node.y + NODE_H,
        x2: target.x + NODE_W / 2,
        y2: target.y,
        status: node.status,
      });
    }
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--foreground) / 0.4)" />
        </marker>
        <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
        </marker>
      </defs>
      {lines.map((l, i) => {
        const midY = (l.y1 + l.y2) / 2;
        const isActive = l.status === "running" || l.status === "success";
        return (
          <path
            key={i}
            d={`M ${l.x1} ${l.y1} C ${l.x1} ${midY}, ${l.x2} ${midY}, ${l.x2} ${l.y2}`}
            fill="none"
            stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--foreground) / 0.2)"}
            strokeWidth={isActive ? 3 : 2}
            strokeDasharray={l.status === "running" ? "8 4" : "none"}
            markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
          >
            {l.status === "running" && (
              <animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.6s" repeatCount="indefinite" />
            )}
          </path>
        );
      })}
    </svg>
  );
}

/* ─── Single Node ─── */
const PipelineNodeCard = memo(function PipelineNodeCard({
  node, onDrag, onDelete, onConfigure, onStartConnect, connectingFrom, onCompleteConnect,
}: {
  node: PipelineNode;
  onDrag: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
  onConfigure: (node: PipelineNode) => void;
  onStartConnect: (id: string) => void;
  connectingFrom: string | null;
  onCompleteConnect: (targetId: string) => void;
}) {
  const config = NODE_TYPES[node.type];
  const Icon = config.icon;
  const dragRef = useRef<{ startX: number; startY: number; nodeX: number; nodeY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, nodeX: node.x, nodeY: node.y };
    const handleMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      onDrag(node.id, dragRef.current.nodeX + dx, dragRef.current.nodeY + dy);
    };
    const handleUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  const isConnectTarget = connectingFrom && connectingFrom !== node.id;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`absolute group cursor-grab active:cursor-grabbing select-none ${isConnectTarget ? "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-xl" : ""}`}
      style={{ left: node.x, top: node.y, width: NODE_W, zIndex: 10 }}
      onMouseDown={handleMouseDown}
      onClick={() => { if (isConnectTarget) onCompleteConnect(node.id); }}
    >
      <div
        className="rounded-xl border-3 border-foreground bg-card shadow-brutal-sm transition-shadow hover:shadow-brutal p-3"
        style={{ borderLeftColor: config.color, borderLeftWidth: 6 }}
      >
        {/* Top row */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center border-2 border-foreground flex-shrink-0"
            style={{ backgroundColor: config.color }}
          >
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{node.name}</p>
            <p className="text-[10px] text-muted-foreground">{config.label}</p>
          </div>
          {/* Status */}
          {node.status === "success" && <CheckCircle2 className="w-4 h-4 text-comic-green flex-shrink-0" />}
          {node.status === "error" && <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />}
          {node.status === "running" && <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />}
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onStartConnect(node.id); }}
            className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
            title="Connect to another node"
          >
            <Zap className="w-3 h-3" />
            Connect
          </button>
          <div className="flex gap-1">
            <button onClick={(e) => { e.stopPropagation(); onConfigure(node); }} className="w-6 h-6 rounded flex items-center justify-center hover:bg-secondary">
              <Settings className="w-3 h-3 text-muted-foreground" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(node.id); }} className="w-6 h-6 rounded flex items-center justify-center hover:bg-destructive/10">
              <Trash2 className="w-3 h-3 text-destructive" />
            </button>
          </div>
        </div>
      </div>

      {/* Output port */}
      <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      {/* Input port */}
      <div className="absolute left-1/2 -top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent border-2 border-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
});

/* ─── Main Canvas ─── */
interface NodeCanvasProps {
  nodes: PipelineNode[];
  onNodesChange: (nodes: PipelineNode[]) => void;
  onRun: () => void;
  isRunning: boolean;
}

export default function NodeCanvas({ nodes, onNodesChange, onRun, isRunning }: NodeCanvasProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [configNode, setConfigNode] = useState<PipelineNode | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addNode = useCallback((type: PipelineNodeType) => {
    const offset = nodes.length * 40;
    const newNode: PipelineNode = {
      id: genId(),
      type,
      name: NODE_TYPES[type].label,
      x: 100 + offset,
      y: 100 + (nodes.length % 3) * 120,
      config: {},
      status: "idle",
      isApiConnected: type === "api-call",
      outputs: [],
    };
    onNodesChange([...nodes, newNode]);
    setIsAddOpen(false);
  }, [nodes, onNodesChange]);

  const updateNode = useCallback((id: string, patch: Partial<PipelineNode>) => {
    onNodesChange(nodes.map(n => n.id === id ? { ...n, ...patch } : n));
  }, [nodes, onNodesChange]);

  const deleteNode = useCallback((id: string) => {
    onNodesChange(
      nodes.filter(n => n.id !== id).map(n => ({
        ...n,
        outputs: n.outputs.filter(o => o !== id),
      }))
    );
  }, [nodes, onNodesChange]);

  const handleDrag = useCallback((id: string, x: number, y: number) => {
    // Snap to grid
    const snappedX = Math.round(Math.max(0, x) / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(Math.max(0, y) / GRID_SIZE) * GRID_SIZE;
    updateNode(id, { x: snappedX, y: snappedY });
  }, [updateNode]);

  const startConnect = useCallback((id: string) => {
    setConnectingFrom(id);
  }, []);

  const completeConnect = useCallback((targetId: string) => {
    if (!connectingFrom || connectingFrom === targetId) {
      setConnectingFrom(null);
      return;
    }
    // Avoid duplicate connections
    const source = nodes.find(n => n.id === connectingFrom);
    if (source && !source.outputs.includes(targetId)) {
      updateNode(connectingFrom, { outputs: [...source.outputs, targetId] });
    }
    setConnectingFrom(null);
  }, [connectingFrom, nodes, updateNode]);

  // Cancel connect on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConnectingFrom(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const securityScore = nodes.length === 0 ? 100 : Math.round(
    (nodes.filter(n => !["api-call", "ai-process"].includes(n.type) || n.apiEndpoint?.startsWith("https")).length / nodes.length) * 100
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center border-3 border-foreground shadow-brutal">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-comic text-2xl text-foreground tracking-wide">NODE PIPELINE</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              Drag nodes to arrange, click Connect to wire them
              <FeatureExplainer title="Node Pipeline" description="Create visual data flows by adding nodes, dragging to position, and connecting outputs to inputs. Click 'Connect' on a node then click the target." type="info" iconSize={14} />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Security score */}
          <div className="flex items-center gap-2 px-3 py-2 bg-card border-2 border-foreground/20 rounded-lg">
            <Shield className={`w-4 h-4 ${securityScore >= 80 ? "text-comic-green" : "text-destructive"}`} />
            <span className="text-sm font-bold">{securityScore}%</span>
          </div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="brutal-button bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Add Node
              </Button>
            </DialogTrigger>
            <DialogContent className="brutal-card max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-comic text-2xl">Add Pipeline Node</DialogTitle>
                <DialogDescription>Choose a node type for your research pipeline</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-3 pt-4">
                {(Object.keys(NODE_TYPES) as PipelineNodeType[]).map(type => {
                  const cfg = NODE_TYPES[type];
                  const Icon = cfg.icon;
                  return (
                    <motion.button
                      key={type}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addNode(type)}
                      className="p-4 rounded-xl border-3 border-foreground bg-card text-left transition-all hover:shadow-brutal"
                      style={{ boxShadow: `4px 4px 0px ${cfg.color}` }}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2 border-2 border-foreground" style={{ backgroundColor: cfg.color }}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold text-foreground text-sm">{cfg.label}</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{cfg.desc}</p>
                    </motion.button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={onRun}
            disabled={nodes.length === 0 || isRunning}
            className="brutal-button bg-comic-green text-white"
          >
            {isRunning ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Running...</> : <><Play className="w-4 h-4 mr-2" />Run</>}
          </Button>
        </div>
      </div>

      {/* Connecting mode banner */}
      <AnimatePresence>
        {connectingFrom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-3 bg-primary/10 border-2 border-primary/30 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-primary">
              <MousePointer2 className="w-4 h-4" />
              Click a target node to connect, or press Escape to cancel
            </div>
            <Button variant="ghost" size="sm" onClick={() => setConnectingFrom(null)}>
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative border-3 border-foreground rounded-2xl bg-card overflow-auto comic-dots"
        style={{ minHeight: 500, height: "60vh" }}
      >
        {nodes.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4 border-3 border-foreground/20">
              <Zap className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="font-bold text-foreground mb-2 font-comic text-xl">EMPTY CANVAS</h4>
            <p className="text-sm text-muted-foreground mb-4">Add nodes to build your research pipeline</p>
            <Button variant="outline" onClick={() => setIsAddOpen(true)} className="border-2 border-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add First Node
            </Button>
          </div>
        ) : (
          <>
            <ConnectionLines nodes={nodes} />
            <AnimatePresence>
              {nodes.map(node => (
                <PipelineNodeCard
                  key={node.id}
                  node={node}
                  onDrag={handleDrag}
                  onDelete={deleteNode}
                  onConfigure={setConfigNode}
                  onStartConnect={startConnect}
                  connectingFrom={connectingFrom}
                  onCompleteConnect={completeConnect}
                />
              ))}
            </AnimatePresence>
          </>
        )}
        {/* Snap grid visual */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: -1 }}>
          <defs>
            <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.5" fill="hsl(var(--foreground) / 0.3)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Minimap */}
      {nodes.length > 0 && (
        <div className="flex items-start gap-4">
          <div className="flex-1 flex items-center gap-4 text-sm text-muted-foreground">
            <span>{nodes.length} node{nodes.length !== 1 ? "s" : ""}</span>
            <span>{nodes.reduce((a, n) => a + n.outputs.length, 0)} connection{nodes.reduce((a, n) => a + n.outputs.length, 0) !== 1 ? "s" : ""}</span>
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-foreground"
              onClick={() => {
                // Auto-layout: arrange nodes in a waterfall
                const sorted = [...nodes];
                const updated = sorted.map((n, i) => ({
                  ...n,
                  x: 60 + (i % 3) * 260,
                  y: 60 + Math.floor(i / 3) * 140,
                }));
                onNodesChange(updated);
              }}
            >
              <Layout className="w-3 h-3 mr-1" />
              Auto Layout
            </Button>
          </div>
          
          {/* Minimap */}
          <div className="w-48 h-28 border-2 border-foreground/30 rounded-lg bg-card/80 relative overflow-hidden flex-shrink-0">
            <div className="absolute top-1 left-1 text-[8px] font-bold text-muted-foreground flex items-center gap-1">
              <Grid3X3 className="w-2 h-2" />
              MINIMAP
            </div>
            {(() => {
              const maxX = Math.max(...nodes.map(n => n.x + NODE_W), 800);
              const maxY = Math.max(...nodes.map(n => n.y + NODE_H), 600);
              const scaleX = 180 / maxX;
              const scaleY = 100 / maxY;
              const scale = Math.min(scaleX, scaleY, 0.15);
              return (
                <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${maxX} ${maxY}`} preserveAspectRatio="xMidYMid meet">
                  {nodes.map(n => {
                    const cfg = NODE_TYPES[n.type];
                    return (
                      <rect
                        key={n.id}
                        x={n.x}
                        y={n.y}
                        width={NODE_W}
                        height={NODE_H}
                        rx={8}
                        fill={n.status === "success" ? "hsl(145 70% 45%)" : n.status === "error" ? "hsl(0 80% 50%)" : cfg.color}
                        opacity={0.7}
                        stroke="hsl(var(--foreground))"
                        strokeWidth={4}
                      />
                    );
                  })}
                  {nodes.flatMap(n => n.outputs.map(outId => {
                    const target = nodes.find(t => t.id === outId);
                    if (!target) return null;
                    return (
                      <line
                        key={`${n.id}-${outId}`}
                        x1={n.x + NODE_W / 2}
                        y1={n.y + NODE_H}
                        x2={target.x + NODE_W / 2}
                        y2={target.y}
                        stroke="hsl(var(--foreground) / 0.4)"
                        strokeWidth={3}
                      />
                    );
                  }))}
                </svg>
              );
            })()}
          </div>
        </div>
      )}

      {/* Config Dialog */}
      <Dialog open={!!configNode} onOpenChange={() => setConfigNode(null)}>
        <DialogContent className="brutal-card">
          <DialogHeader>
            <DialogTitle className="font-comic text-xl">Configure: {configNode?.name}</DialogTitle>
          </DialogHeader>
          {configNode && (
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-foreground">Node Name</label>
                <input
                  type="text"
                  value={configNode.name}
                  onChange={e => {
                    const name = e.target.value.slice(0, 100);
                    setConfigNode({ ...configNode, name });
                    updateNode(configNode.id, { name });
                  }}
                  className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-foreground bg-card"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">API Endpoint (optional)</label>
                <input
                  type="url"
                  value={configNode.apiEndpoint || ""}
                  onChange={e => {
                    const apiEndpoint = e.target.value;
                    setConfigNode({ ...configNode, apiEndpoint });
                    updateNode(configNode.id, { apiEndpoint });
                  }}
                  placeholder="https://api.example.com/v1/process"
                  className="w-full mt-1 px-3 py-2 rounded-lg border-2 border-foreground bg-card"
                />
                {configNode.apiEndpoint && !configNode.apiEndpoint.startsWith("https") && configNode.apiEndpoint.length > 0 && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    HTTPS required for security
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Connected To</label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {configNode.outputs.length === 0 ? (
                    <span className="text-xs text-muted-foreground">No connections yet</span>
                  ) : (
                    configNode.outputs.map(outId => {
                      const target = nodes.find(n => n.id === outId);
                      return (
                        <span key={outId} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg font-bold flex items-center gap-1">
                          {target?.name || outId}
                          <button onClick={() => {
                            const newOutputs = configNode.outputs.filter(o => o !== outId);
                            setConfigNode({ ...configNode, outputs: newOutputs });
                            updateNode(configNode.id, { outputs: newOutputs });
                          }}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })
                  )}
                </div>
              </div>
              <Button onClick={() => setConfigNode(null)} className="w-full brutal-button bg-primary text-primary-foreground">
                Save Configuration
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
