import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  FileImage,
  FileSpreadsheet,
  Presentation,
  Code2,
  Globe,
  Printer,
  Check,
  Loader2,
  Settings,
  Sparkles,
  BookOpen,
  GraduationCap,
  Award,
  Zap,
  Rocket,
  Star,
} from "lucide-react";
import { ComicPanelBorder, ActionBurst } from "@/components/interactive/ComicEffects";

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  extension: string;
  color: string;
  premium?: boolean;
}

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  formats: string[];
}

const exportFormats: ExportFormat[] = [
  { id: "pdf", name: "PDF Document", description: "Print-ready document", icon: FileText, extension: ".pdf", color: "hsl(0 85% 55%)" },
  { id: "docx", name: "Word Document", description: "Editable DOCX file", icon: FileText, extension: ".docx", color: "hsl(210 100% 55%)" },
  { id: "latex", name: "LaTeX Source", description: "For academic publishing", icon: Code2, extension: ".tex", color: "hsl(145 70% 45%)" },
  { id: "html", name: "Web Page", description: "Interactive HTML", icon: Globe, extension: ".html", color: "hsl(25 95% 55%)" },
  { id: "pptx", name: "PowerPoint", description: "Presentation slides", icon: Presentation, extension: ".pptx", color: "hsl(270 70% 55%)" },
  { id: "csv", name: "CSV Data", description: "Raw data export", icon: FileSpreadsheet, extension: ".csv", color: "hsl(145 70% 45%)" },
  { id: "png", name: "Image Export", description: "Charts & figures", icon: FileImage, extension: ".png", color: "hsl(330 80% 60%)" },
  { id: "json", name: "JSON Data", description: "Structured data", icon: Code2, extension: ".json", color: "hsl(45 95% 50%)", premium: true },
];

const exportTemplates: ExportTemplate[] = [
  {
    id: "isef",
    name: "ISEF Format",
    description: "Intel ISEF competition standard",
    icon: Award,
    formats: ["pdf", "docx"],
  },
  {
    id: "journal",
    name: "Journal Article",
    description: "Academic journal submission",
    icon: BookOpen,
    formats: ["pdf", "latex", "docx"],
  },
  {
    id: "thesis",
    name: "Thesis/Dissertation",
    description: "University thesis format",
    icon: GraduationCap,
    formats: ["pdf", "latex"],
  },
  {
    id: "poster",
    name: "Research Poster",
    description: "Conference poster layout",
    icon: Presentation,
    formats: ["pdf", "png"],
  },
];

// Memoized format card
const FormatCard = memo(function FormatCard({
  format,
  isSelected,
  onSelect,
}: {
  format: ExportFormat;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = format.icon;

  return (
    <motion.button
      whileHover={{ y: -4, rotate: isSelected ? 0 : 1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className={`relative p-4 rounded-xl border-3 text-left transition-all gpu-accelerate ${
        isSelected
          ? "border-foreground bg-card shadow-brutal"
          : "border-border bg-card hover:border-foreground"
      }`}
    >
      {format.premium && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-accent text-accent-foreground text-xs font-bold rounded-full border-2 border-foreground animate-pulse">
          PRO
        </div>
      )}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-comic-green flex items-center justify-center border-2 border-foreground"
        >
          <Check className="w-3 h-3 text-white" />
        </motion.div>
      )}
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 border-2 border-foreground transition-transform ${isSelected ? "rotate-3 scale-105" : ""}`}
        style={{ backgroundColor: format.color }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="font-bold text-sm text-foreground">{format.name}</p>
      <p className="text-xs text-muted-foreground">{format.description}</p>
      <p className="text-xs font-mono text-primary mt-1">{format.extension}</p>
    </motion.button>
  );
});

const ExportCenter = memo(function ExportCenter() {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    includeCharts: true,
    includeCitations: true,
    includeAppendix: false,
    watermark: false,
  });

  const handleExport = useCallback(() => {
    if (!selectedFormat) return;
    setIsExporting(true);
    setExportComplete(false);

    // Simulate export
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);
    }, 2000);
  }, [selectedFormat]);

  const handleTemplateSelect = useCallback((templateId: string) => {
    const isSelected = selectedTemplate === templateId;
    setSelectedTemplate(isSelected ? null : templateId);
    if (!isSelected) {
      const template = exportTemplates.find(t => t.id === templateId);
      if (template?.formats[0]) {
        setSelectedFormat(template.formats[0]);
      }
    }
  }, [selectedTemplate]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 6, scale: 1.05 }}
            className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center border-3 border-foreground shadow-brutal"
          >
            <Download className="w-7 h-7 text-accent-foreground" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-foreground font-comic tracking-wide flex items-center gap-2">
              EXPORT CENTER
              <Rocket className="w-5 h-5 text-primary" />
            </h2>
            <p className="text-sm text-muted-foreground">Formats • Templates • One-Click Magic</p>
          </div>
        </div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleExport}
            disabled={!selectedFormat || isExporting}
            className="brutal-button bg-primary text-primary-foreground"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : exportComplete ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Now
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Success celebration */}
      <AnimatePresence>
        {exportComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex justify-center"
          >
            <ActionBurst text="SUCCESS!" color="hsl(var(--comic-green))" size="md" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Templates */}
      <ComicPanelBorder variant="standard" className="rounded-2xl p-6 bg-primary/5">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-comic">QUICK TEMPLATES</span>
          <Star className="w-4 h-4 text-accent animate-pulse" />
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {exportTemplates.map((template) => {
            const Icon = template.icon;
            const isSelected = selectedTemplate === template.id;

            return (
              <motion.button
                key={template.id}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTemplateSelect(template.id)}
                className={`p-4 rounded-xl border-3 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-brutal-primary"
                    : "border-foreground bg-card hover:bg-secondary"
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 transition-transform ${isSelected ? "text-primary-foreground rotate-6" : "text-primary"}`} />
                <p className="font-bold text-sm">{template.name}</p>
                <p className={`text-xs ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {template.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </ComicPanelBorder>

      {/* Export Formats */}
      <ComicPanelBorder variant="standard" className="rounded-2xl p-6">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <span className="font-comic">EXPORT FORMATS</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {exportFormats.map((format) => (
            <FormatCard
              key={format.id}
              format={format}
              isSelected={selectedFormat === format.id}
              onSelect={() => setSelectedFormat(selectedFormat === format.id ? null : format.id)}
            />
          ))}
        </div>
      </ComicPanelBorder>

      {/* Export Options */}
      <div className="brutal-card rounded-xl p-5">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          <span className="font-comic">OPTIONS</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: "includeCharts", label: "Include Charts", icon: FileImage },
            { key: "includeCitations", label: "Include Citations", icon: BookOpen },
            { key: "includeAppendix", label: "Include Appendix", icon: FileText },
            { key: "watermark", label: "Add Watermark", icon: Zap },
          ].map((option) => {
            const Icon = option.icon;
            const isChecked = exportOptions[option.key as keyof typeof exportOptions];

            return (
              <button
                key={option.key}
                onClick={() =>
                  setExportOptions({ ...exportOptions, [option.key]: !isChecked })
                }
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  isChecked
                    ? "border-comic-green bg-comic-green/10"
                    : "border-border bg-secondary hover:border-foreground"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isChecked ? "bg-comic-green border-comic-green" : "border-foreground"
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 text-white" />}
                </div>
                <Icon className={`w-4 h-4 ${isChecked ? "text-comic-green" : "text-muted-foreground"}`} />
                <span className={`text-sm font-medium ${isChecked ? "text-foreground" : "text-muted-foreground"}`}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { icon: Printer, label: "Print Preview", desc: "Check layout" },
          { icon: Globe, label: "Publish Online", desc: "Share publicly" },
          { icon: Code2, label: "API Export", desc: "For developers" },
        ].map((action) => (
          <motion.button
            key={action.label}
            whileHover={{ y: -2 }}
            className="brutal-card rounded-xl p-4 bg-card hover:bg-secondary text-left group"
          >
            <action.icon className="w-6 h-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-bold text-foreground text-sm">{action.label}</p>
            <p className="text-xs text-muted-foreground">{action.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
});

export default ExportCenter;