import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FlaskConical, 
  Brain, 
  BarChart3, 
  Dna, 
  Globe, 
  BookOpen,
  Microscope,
  Calculator,
  Leaf,
  Heart,
  Cpu,
  Scale,
  Check,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ResearchField {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  types: ResearchType[];
}

export interface ResearchType {
  id: string;
  name: string;
  description: string;
}

export const researchFields: ResearchField[] = [
  {
    id: "natural-sciences",
    name: "Natural Sciences",
    icon: <FlaskConical className="w-6 h-6" />,
    description: "Physics, Chemistry, Biology",
    color: "hsl(145 70% 45%)",
    types: [
      { id: "experimental", name: "Experimental", description: "Lab-based research with controlled experiments" },
      { id: "theoretical", name: "Theoretical", description: "Mathematical models and theories" },
      { id: "observational", name: "Observational", description: "Field observations and data collection" },
    ]
  },
  {
    id: "social-sciences",
    name: "Social Sciences",
    icon: <Globe className="w-6 h-6" />,
    description: "Psychology, Sociology, Economics",
    color: "hsl(210 100% 55%)",
    types: [
      { id: "quantitative", name: "Quantitative", description: "Statistical analysis and surveys" },
      { id: "qualitative", name: "Qualitative", description: "Interviews, case studies, ethnography" },
      { id: "mixed-methods", name: "Mixed Methods", description: "Combination of quant and qual approaches" },
    ]
  },
  {
    id: "computer-science",
    name: "Computer Science",
    icon: <Cpu className="w-6 h-6" />,
    description: "AI, Systems, Theory",
    color: "hsl(270 70% 55%)",
    types: [
      { id: "systems", name: "Systems", description: "Building and evaluating systems" },
      { id: "ml-research", name: "ML Research", description: "Machine learning experiments" },
      { id: "theory", name: "Theory", description: "Algorithms and complexity" },
    ]
  },
  {
    id: "life-sciences",
    name: "Life Sciences",
    icon: <Dna className="w-6 h-6" />,
    description: "Genetics, Molecular Biology",
    color: "hsl(330 80% 60%)",
    types: [
      { id: "genomics", name: "Genomics", description: "DNA sequencing and analysis" },
      { id: "clinical", name: "Clinical", description: "Patient studies and trials" },
      { id: "bioinformatics", name: "Bioinformatics", description: "Computational biology" },
    ]
  },
  {
    id: "humanities",
    name: "Humanities",
    icon: <BookOpen className="w-6 h-6" />,
    description: "History, Literature, Philosophy",
    color: "hsl(25 95% 55%)",
    types: [
      { id: "archival", name: "Archival", description: "Primary source research" },
      { id: "textual-analysis", name: "Textual Analysis", description: "Close reading and interpretation" },
      { id: "comparative", name: "Comparative", description: "Cross-cultural or historical comparison" },
    ]
  },
  {
    id: "health-sciences",
    name: "Health Sciences",
    icon: <Heart className="w-6 h-6" />,
    description: "Medicine, Public Health",
    color: "hsl(0 85% 55%)",
    types: [
      { id: "clinical-trial", name: "Clinical Trial", description: "Randomized controlled trials" },
      { id: "epidemiology", name: "Epidemiology", description: "Population health studies" },
      { id: "systematic-review", name: "Systematic Review", description: "Meta-analysis of existing research" },
    ]
  },
  {
    id: "environmental",
    name: "Environmental",
    icon: <Leaf className="w-6 h-6" />,
    description: "Ecology, Climate Science",
    color: "hsl(85 60% 45%)",
    types: [
      { id: "field-study", name: "Field Study", description: "On-site environmental research" },
      { id: "modeling", name: "Modeling", description: "Climate and ecosystem models" },
      { id: "remote-sensing", name: "Remote Sensing", description: "Satellite and drone data" },
    ]
  },
  {
    id: "data-science",
    name: "Data Science",
    icon: <BarChart3 className="w-6 h-6" />,
    description: "Analytics, Statistics",
    color: "hsl(185 80% 45%)",
    types: [
      { id: "exploratory", name: "Exploratory", description: "Data exploration and visualization" },
      { id: "predictive", name: "Predictive", description: "Forecasting and prediction models" },
      { id: "prescriptive", name: "Prescriptive", description: "Optimization and recommendations" },
    ]
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: <Calculator className="w-6 h-6" />,
    description: "Design, Systems, Innovation",
    color: "hsl(45 90% 50%)",
    types: [
      { id: "design", name: "Design Research", description: "Prototyping and testing designs" },
      { id: "systems-engineering", name: "Systems Engineering", description: "Complex system optimization" },
      { id: "materials", name: "Materials Science", description: "Material properties and applications" },
    ]
  },
  {
    id: "other",
    name: "Other / Custom",
    icon: <Microscope className="w-6 h-6" />,
    description: "Interdisciplinary or unique topics",
    color: "hsl(0 0% 50%)",
    types: [
      { id: "interdisciplinary", name: "Interdisciplinary", description: "Combining multiple fields" },
      { id: "exploratory-research", name: "Exploratory", description: "Open-ended investigation" },
      { id: "custom", name: "Custom Methodology", description: "Design your own approach" },
    ]
  },
];

interface ResearchFieldSelectorProps {
  onSelect: (field: ResearchField, type: ResearchType) => void;
  selectedField?: string;
  selectedType?: string;
}

export function ResearchFieldSelector({ onSelect, selectedField, selectedType }: ResearchFieldSelectorProps) {
  const [activeField, setActiveField] = useState<string | null>(selectedField || null);
  const [step, setStep] = useState<"field" | "type">(selectedField ? "type" : "field");

  const currentField = researchFields.find(f => f.id === activeField);

  const handleFieldSelect = (field: ResearchField) => {
    setActiveField(field.id);
    setStep("type");
  };

  const handleTypeSelect = (type: ResearchType) => {
    if (currentField) {
      onSelect(currentField, type);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className={step === "field" ? "text-primary" : "text-muted-foreground"}>
          1. Research Field
        </span>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className={step === "type" ? "text-primary" : "text-muted-foreground"}>
          2. Research Type
        </span>
      </div>

      <AnimatePresence mode="wait">
        {step === "field" ? (
          <motion.div
            key="field-selection"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {researchFields.map((field, index) => (
              <motion.button
                key={field.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleFieldSelect(field)}
                className={`relative p-4 rounded-xl border-3 border-foreground bg-card text-left transition-all hover:scale-105 group ${
                  activeField === field.id ? "ring-2 ring-primary" : ""
                }`}
                style={{ 
                  boxShadow: activeField === field.id 
                    ? `4px 4px 0px ${field.color}` 
                    : "4px 4px 0px hsl(var(--foreground))"
                }}
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 border-2 border-foreground transition-colors"
                  style={{ backgroundColor: field.color }}
                >
                  <span className="text-white">{field.icon}</span>
                </div>
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {field.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {field.description}
                </p>
                {activeField === field.id && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-5 h-5 text-primary" />
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="type-selection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Back button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep("field")}
              className="mb-2"
            >
              ← Back to Fields
            </Button>

            {/* Selected field header */}
            {currentField && (
              <div className="flex items-center gap-3 p-4 rounded-xl border-3 border-foreground bg-card">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center border-2 border-foreground"
                  style={{ backgroundColor: currentField.color }}
                >
                  <span className="text-white">{currentField.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{currentField.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentField.description}</p>
                </div>
              </div>
            )}

            {/* Research types */}
            <div className="grid gap-3">
              {currentField?.types.map((type, index) => (
                <motion.button
                  key={type.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleTypeSelect(type)}
                  className={`p-4 rounded-xl border-3 border-foreground bg-card text-left transition-all hover:scale-[1.02] hover:shadow-brutal-primary ${
                    selectedType === type.id ? "ring-2 ring-primary shadow-brutal-primary" : "shadow-brutal"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-foreground">{type.name}</h4>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                    {selectedType === type.id && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
