import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Atom,
  Beaker,
  Brain,
  Calculator,
  Globe,
  Heart,
  Landmark,
  Leaf,
  Microscope,
  Palette,
  Scale,
  Users,
  Dna,
  Telescope,
  Activity,
  BookOpen,
  FileText,
  Sparkles,
  ChevronRight,
  Check,
  Zap,
  FlaskConical,
  Binary,
  Languages,
  Music,
  Film,
  PenTool,
  BarChart3,
} from "lucide-react";
import { Doodle } from "@/components/interactive/ArtisticScribbles";
import InteractiveComicDots from "@/components/interactive/InteractiveComicDots";

interface SubjectField {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
  tools: SubjectTool[];
}

interface SubjectTool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
}

const subjectFields: SubjectField[] = [
  {
    id: "natural-sciences",
    name: "Natural Sciences",
    icon: Atom,
    color: "hsl(210, 100%, 55%)",
    description: "Physics, Chemistry, Biology, Earth Sciences",
    tools: [
      { id: "lab-report", name: "Lab Report Generator", description: "Create structured lab reports with proper sections", icon: FileText },
      { id: "hypothesis", name: "Hypothesis Builder", description: "Formulate testable hypotheses", icon: Beaker },
      { id: "data-analysis", name: "Scientific Data Analysis", description: "Analyze experimental data with proper statistics", icon: BarChart3 },
      { id: "error-analysis", name: "Error Analysis", description: "Calculate and present experimental uncertainties", icon: Calculator },
      { id: "diagram-maker", name: "Scientific Diagrams", description: "Create labeled diagrams and flowcharts", icon: Microscope },
      { id: "unit-converter", name: "Unit Converter", description: "Convert between scientific units", icon: Scale },
    ],
  },
  {
    id: "social-sciences",
    name: "Social Sciences",
    icon: Users,
    color: "hsl(25, 95%, 55%)",
    description: "Psychology, Sociology, Anthropology, Economics",
    tools: [
      { id: "survey-design", name: "Survey Designer", description: "Create validated survey instruments", icon: FileText },
      { id: "interview-guide", name: "Interview Guide Builder", description: "Structure qualitative interviews", icon: Users },
      { id: "thematic-analysis", name: "Thematic Analysis", description: "Code and analyze qualitative data", icon: Brain },
      { id: "statistical-tests", name: "Social Stats Suite", description: "SPSS-like statistical analysis", icon: BarChart3 },
      { id: "ethics-check", name: "IRB Ethics Checker", description: "Ensure ethical compliance", icon: Scale },
      { id: "sampling-calc", name: "Sample Size Calculator", description: "Determine adequate sample sizes", icon: Calculator },
    ],
  },
  {
    id: "humanities",
    name: "Humanities",
    icon: BookOpen,
    color: "hsl(270, 70%, 55%)",
    description: "History, Philosophy, Literature, Languages",
    tools: [
      { id: "primary-source", name: "Primary Source Analyzer", description: "Analyze historical documents", icon: FileText },
      { id: "argument-mapper", name: "Argument Mapper", description: "Map philosophical arguments", icon: Brain },
      { id: "literary-analysis", name: "Literary Analysis Tools", description: "Analyze themes, motifs, and symbolism", icon: PenTool },
      { id: "timeline-maker", name: "Historical Timeline", description: "Create interactive timelines", icon: Landmark },
      { id: "translation-aid", name: "Translation Assistant", description: "Help with language translation", icon: Languages },
      { id: "citation-styles", name: "Citation Formatter", description: "Format in Chicago, MLA, etc.", icon: BookOpen },
    ],
  },
  {
    id: "life-sciences",
    name: "Life Sciences",
    icon: Dna,
    color: "hsl(145, 70%, 45%)",
    description: "Biology, Ecology, Genetics, Medicine",
    tools: [
      { id: "gene-analysis", name: "Gene Sequence Analyzer", description: "Analyze DNA/RNA sequences", icon: Dna },
      { id: "ecosystem-model", name: "Ecosystem Modeler", description: "Model ecological relationships", icon: Leaf },
      { id: "anatomy-guide", name: "Anatomy Reference", description: "Interactive anatomy guides", icon: Heart },
      { id: "clinical-calc", name: "Clinical Calculators", description: "Medical formulas and conversions", icon: Activity },
      { id: "species-id", name: "Species Identification", description: "Identify and classify organisms", icon: Microscope },
      { id: "protocol-writer", name: "Protocol Writer", description: "Write standardized lab protocols", icon: FileText },
    ],
  },
  {
    id: "mathematics",
    name: "Mathematics",
    icon: Calculator,
    color: "hsl(350, 80%, 50%)",
    description: "Pure Math, Statistics, Applied Math",
    tools: [
      { id: "proof-assistant", name: "Proof Assistant", description: "Structure mathematical proofs", icon: FileText },
      { id: "equation-solver", name: "Equation Solver", description: "Solve complex equations", icon: Calculator },
      { id: "graph-plotter", name: "Function Grapher", description: "Plot and analyze functions", icon: BarChart3 },
      { id: "matrix-calc", name: "Matrix Calculator", description: "Matrix operations and linear algebra", icon: Binary },
      { id: "stats-suite", name: "Statistical Suite", description: "Comprehensive statistical tools", icon: Activity },
      { id: "latex-editor", name: "LaTeX Editor", description: "Write beautiful math notation", icon: PenTool },
    ],
  },
  {
    id: "arts",
    name: "Arts & Design",
    icon: Palette,
    color: "hsl(330, 80%, 55%)",
    description: "Visual Arts, Music, Film, Design",
    tools: [
      { id: "visual-analysis", name: "Visual Analysis Guide", description: "Analyze artworks systematically", icon: Palette },
      { id: "music-theory", name: "Music Theory Tools", description: "Analyze compositions and harmony", icon: Music },
      { id: "film-analysis", name: "Film Analysis Framework", description: "Analyze cinematography and narrative", icon: Film },
      { id: "portfolio-builder", name: "Portfolio Builder", description: "Create artist statements and portfolios", icon: FileText },
      { id: "color-theory", name: "Color Theory Guide", description: "Color relationships and palettes", icon: Palette },
      { id: "critique-guide", name: "Art Critique Framework", description: "Structure thoughtful critiques", icon: PenTool },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: FlaskConical,
    color: "hsl(185, 80%, 45%)",
    description: "Mechanical, Electrical, Computer, Civil",
    tools: [
      { id: "design-doc", name: "Design Documentation", description: "Create technical specifications", icon: FileText },
      { id: "circuit-analyzer", name: "Circuit Analyzer", description: "Analyze electrical circuits", icon: Zap },
      { id: "stress-calc", name: "Stress Calculator", description: "Calculate mechanical stresses", icon: Activity },
      { id: "code-review", name: "Code Review Guide", description: "Structured code analysis", icon: Binary },
      { id: "project-planner", name: "Engineering Project Plan", description: "Plan engineering projects", icon: BarChart3 },
      { id: "testing-framework", name: "Testing Framework", description: "Design test procedures", icon: Check },
    ],
  },
  {
    id: "environmental",
    name: "Environmental Studies",
    icon: Globe,
    color: "hsl(145, 60%, 50%)",
    description: "Climate, Conservation, Sustainability",
    tools: [
      { id: "impact-assessment", name: "Impact Assessment", description: "Evaluate environmental impacts", icon: Globe },
      { id: "carbon-calc", name: "Carbon Calculator", description: "Calculate carbon footprints", icon: Leaf },
      { id: "gis-analysis", name: "GIS Data Analysis", description: "Analyze geographic data", icon: Telescope },
      { id: "sustainability-audit", name: "Sustainability Audit", description: "Assess sustainability practices", icon: Check },
      { id: "species-tracker", name: "Species Tracker", description: "Monitor wildlife populations", icon: Microscope },
      { id: "climate-model", name: "Climate Modeler", description: "Analyze climate data trends", icon: BarChart3 },
    ],
  },
];

const SubjectTools = () => {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const currentField = subjectFields.find(f => f.id === selectedField);

  return (
    <div className="space-y-6 relative">
      {/* Decorative elements */}
      <div className="absolute -top-2 -right-2 pointer-events-none opacity-20">
        <Doodle type="burst" size={50} color="hsl(var(--primary))" />
      </div>
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="brutal-card rounded-2xl p-6 bg-gradient-to-br from-primary/10 to-secondary relative overflow-hidden"
      >
        <InteractiveComicDots 
          dotColor="hsl(var(--foreground) / 0.06)" 
          dotSpacing={20} 
          minDotSize={1} 
          maxDotSize={5}
          hoverRadius={80}
        />
        <div className="relative z-10 flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center border-3 border-foreground shadow-brutal"
          >
            <Microscope className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-foreground font-comic tracking-wide">SUBJECT TOOLS</h2>
            <p className="text-sm text-muted-foreground font-medium">Specialized research tools for your field of study</p>
          </div>
        </div>
      </motion.div>

      {/* Subject Field Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {subjectFields.map((field, index) => {
          const Icon = field.icon;
          const isSelected = selectedField === field.id;
          
          return (
            <motion.button
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, rotate: isSelected ? 0 : 2 }}
              onClick={() => {
                setSelectedField(isSelected ? null : field.id);
                setActiveTool(null);
              }}
              className={`brutal-card rounded-xl p-4 text-left transition-all ${
                isSelected 
                  ? "shadow-brutal-primary" 
                  : "bg-card hover:bg-secondary"
              }`}
              style={{
                backgroundColor: isSelected ? field.color + "20" : undefined,
                borderColor: isSelected ? field.color : undefined,
              }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-foreground mb-2"
                style={{ backgroundColor: field.color + "30" }}
              >
                <Icon className="w-5 h-5" style={{ color: field.color }} />
              </div>
              <p className="font-bold text-foreground text-sm">{field.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{field.description}</p>
              {isSelected && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <Check className="w-5 h-5" style={{ color: field.color }} />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Tools for Selected Field */}
      <AnimatePresence mode="wait">
        {currentField && (
          <motion.div
            key={currentField.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="brutal-card rounded-2xl p-6 relative overflow-hidden"
            style={{ 
              backgroundColor: currentField.color + "08",
              borderColor: currentField.color + "40",
            }}
          >
            <div className="absolute top-2 right-2 opacity-20">
              <Doodle type="star" size={40} color={currentField.color} animate={false} />
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <currentField.icon className="w-6 h-6" style={{ color: currentField.color }} />
              <h3 className="font-bold text-foreground font-comic text-lg">{currentField.name} TOOLS</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentField.tools.map((tool, index) => {
                const ToolIcon = tool.icon;
                const isActive = activeTool === tool.id;
                
                return (
                  <motion.button
                    key={tool.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    onClick={() => setActiveTool(isActive ? null : tool.id)}
                    className={`brutal-card rounded-xl p-4 text-left transition-all flex items-start gap-3 ${
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-brutal-sm" 
                        : "bg-card hover:bg-secondary"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 flex-shrink-0 ${
                      isActive ? "border-primary-foreground/50 bg-primary-foreground/20" : "border-border bg-secondary"
                    }`}>
                      <ToolIcon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm ${isActive ? "text-primary-foreground" : "text-foreground"}`}>
                        {tool.name}
                      </p>
                      <p className={`text-xs line-clamp-2 ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                        {tool.description}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Tool Interface */}
      <AnimatePresence>
        {activeTool && currentField && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="brutal-card rounded-2xl p-6 bg-card overflow-hidden"
          >
            {(() => {
              const tool = currentField.tools.find(t => t.id === activeTool);
              if (!tool) return null;
              const ToolIcon = tool.icon;
              
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center border-2 border-foreground"
                        style={{ backgroundColor: currentField.color + "20" }}
                      >
                        <ToolIcon className="w-6 h-6" style={{ color: currentField.color }} />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground font-comic">{tool.name}</h4>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </div>
                    </div>
                    <Button
                      className="brutal-button bg-primary text-primary-foreground"
                    >
                      <Sparkles className="w-4 h-4" />
                      Launch Tool
                    </Button>
                  </div>
                  
                  <div className="bg-secondary rounded-xl p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <ToolIcon className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground">
                      Click "Launch Tool" to open the full {tool.name} interface with all features.
                    </p>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Selection State */}
      {!selectedField && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="brutal-card rounded-2xl p-8 text-center bg-secondary/50"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          </motion.div>
          <h3 className="text-xl font-comic text-foreground mb-2">SELECT YOUR FIELD</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Choose your research field above to access specialized tools designed for your discipline.
            Each field has curated tools to help you conduct better research.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SubjectTools;
