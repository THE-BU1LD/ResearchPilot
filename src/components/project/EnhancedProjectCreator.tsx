import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ResearchFieldSelector,
  researchFields,
  ResearchField,
  ResearchType,
} from "@/components/project/ResearchFieldSelector";
import {
  ArrowRight,
  ArrowLeft,
  Zap,
  Sparkles,
  Target,
  Users,
  Clock,
  Calendar,
  FileText,
  Trophy,
  GraduationCap,
  Building2,
  Microscope,
  Globe,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { HandDrawnUnderline } from "@/components/interactive/ArtisticScribbles";

interface ProjectGoal {
  id: string;
  name: string;
  icon: typeof Trophy;
  description: string;
}

interface ProjectTimeline {
  id: string;
  name: string;
  duration: string;
  description: string;
}

interface SkillLevel {
  id: string;
  name: string;
  icon: typeof GraduationCap;
  description: string;
}

const projectGoals: ProjectGoal[] = [
  {
    id: "competition",
    name: "Science Competition",
    icon: Trophy,
    description: "ISEF, Regeneron, Google Science Fair, etc.",
  },
  {
    id: "publication",
    name: "Publication",
    icon: FileText,
    description: "Submit to a peer-reviewed journal",
  },
  {
    id: "class",
    name: "Class Project",
    icon: GraduationCap,
    description: "School assignment or capstone",
  },
  {
    id: "personal",
    name: "Personal Interest",
    icon: Sparkles,
    description: "Self-directed learning & exploration",
  },
];

const projectTimelines: ProjectTimeline[] = [
  {
    id: "sprint",
    name: "Sprint",
    duration: "2-4 weeks",
    description: "Quick exploration or class project",
  },
  {
    id: "semester",
    name: "Semester",
    duration: "3-4 months",
    description: "In-depth study with room to iterate",
  },
  {
    id: "year",
    name: "Academic Year",
    duration: "8-10 months",
    description: "Competition-ready comprehensive research",
  },
  {
    id: "ongoing",
    name: "Ongoing",
    duration: "No deadline",
    description: "Long-term passion project",
  },
];

const skillLevels: SkillLevel[] = [
  {
    id: "beginner",
    name: "First Timer",
    icon: Sparkles,
    description: "New to formal research",
  },
  {
    id: "intermediate",
    name: "Some Experience",
    icon: BookOpen,
    description: "Done 1-2 projects before",
  },
  {
    id: "advanced",
    name: "Experienced",
    icon: Microscope,
    description: "Comfortable with methodology",
  },
];

interface EnhancedProjectCreatorProps {
  onComplete: (projectData: {
    name: string;
    field: ResearchField;
    type: ResearchType;
    goal: ProjectGoal;
    timeline: ProjectTimeline;
    skillLevel: SkillLevel;
  }) => void;
  onCancel: () => void;
}

const EnhancedProjectCreator = ({
  onComplete,
  onCancel,
}: EnhancedProjectCreatorProps) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [projectName, setProjectName] = useState("");
  const [selectedField, setSelectedField] = useState<ResearchField | null>(null);
  const [selectedType, setSelectedType] = useState<ResearchType | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<ProjectGoal | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<ProjectTimeline | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillLevel | null>(null);

  const handleFieldSelect = (field: ResearchField, type: ResearchType) => {
    setSelectedField(field);
    setSelectedType(type);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return projectName.trim().length > 0;
      case 2:
        return selectedField !== null && selectedType !== null;
      case 3:
        return selectedGoal !== null;
      case 4:
        return selectedTimeline !== null;
      case 5:
        return selectedSkill !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep((step + 1) as 1 | 2 | 3 | 4 | 5);
    } else if (selectedField && selectedType && selectedGoal && selectedTimeline && selectedSkill) {
      onComplete({
        name: projectName,
        field: selectedField,
        type: selectedType,
        goal: selectedGoal,
        timeline: selectedTimeline,
        skillLevel: selectedSkill,
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3 | 4 | 5);
    } else {
      onCancel();
    }
  };

  const stepTitles = [
    "Name Your Project",
    "Choose Your Field",
    "What's Your Goal?",
    "Set Your Timeline",
    "Your Experience Level",
  ];

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center">
            <motion.div
              animate={{
                scale: s === step ? 1.1 : 1,
                backgroundColor: s <= step ? "hsl(var(--primary))" : "hsl(var(--muted))",
              }}
              className={`w-10 h-10 rounded-none border-3 border-foreground flex items-center justify-center font-comic text-lg transition-colors ${
                s <= step ? "text-primary-foreground" : "text-muted-foreground"
              }`}
              style={{ boxShadow: s === step ? "var(--shadow-brutal-sm)" : "none" }}
            >
              {s}
            </motion.div>
            {s < 5 && (
              <div
                className={`w-8 md:w-16 h-1 mx-1 transition-colors ${
                  s < step ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step title */}
      <div className="text-center mb-6">
        <h3 className="font-comic text-2xl md:text-3xl text-foreground relative inline-block">
          {stepTitles[step - 1]}
          <HandDrawnUnderline width={200} className="left-1/2 -translate-x-1/2" color="hsl(var(--primary))" />
        </h3>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Project Name */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="relative">
              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., Impact of Social Media on Teen Sleep"
                className="w-full h-14 px-5 text-lg border-3 border-foreground bg-card font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                style={{ boxShadow: "var(--shadow-brutal-sm)" }}
              />
              <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Lightbulb className="w-4 h-4" /> Tip: A good title hints at your research question
            </p>
          </motion.div>
        )}

        {/* Step 2: Field Selection */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ResearchFieldSelector
              onSelect={handleFieldSelect}
              selectedField={selectedField?.id}
              selectedType={selectedType?.id}
            />
          </motion.div>
        )}

        {/* Step 3: Goal Selection */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {projectGoals.map((goal) => {
              const Icon = goal.icon;
              const isSelected = selectedGoal?.id === goal.id;
              return (
                <motion.button
                  key={goal.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedGoal(goal)}
                  className={`p-5 border-3 border-foreground text-left transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-muted"
                  }`}
                  style={{
                    boxShadow: isSelected ? "var(--shadow-brutal)" : "var(--shadow-brutal-sm)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 border-2 border-foreground flex items-center justify-center ${
                        isSelected ? "bg-background" : "bg-primary"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          isSelected ? "text-primary" : "text-primary-foreground"
                        }`}
                      />
                    </div>
                    <div>
                      <h4 className="font-comic text-lg">{goal.name}</h4>
                      <p
                        className={`text-sm ${
                          isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                        }`}
                      >
                        {goal.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* Step 4: Timeline Selection */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {projectTimelines.map((timeline) => {
              const isSelected = selectedTimeline?.id === timeline.id;
              return (
                <motion.button
                  key={timeline.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTimeline(timeline)}
                  className={`p-5 border-3 border-foreground text-left transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-muted"
                  }`}
                  style={{
                    boxShadow: isSelected ? "var(--shadow-brutal)" : "var(--shadow-brutal-sm)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 border-2 border-foreground flex items-center justify-center ${
                        isSelected ? "bg-background" : "bg-accent"
                      }`}
                    >
                      <Clock
                        className={`w-6 h-6 ${
                          isSelected ? "text-primary" : "text-accent-foreground"
                        }`}
                      />
                    </div>
                    <div>
                      <h4 className="font-comic text-lg">{timeline.name}</h4>
                      <div
                        className={`inline-block px-2 py-0.5 text-xs font-bold border mb-1 ${
                          isSelected
                            ? "bg-background text-primary border-foreground"
                            : "bg-muted text-muted-foreground border-foreground/30"
                        }`}
                      >
                        {timeline.duration}
                      </div>
                      <p
                        className={`text-sm ${
                          isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                        }`}
                      >
                        {timeline.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* Step 5: Skill Level */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {skillLevels.map((skill) => {
              const Icon = skill.icon;
              const isSelected = selectedSkill?.id === skill.id;
              return (
                <motion.button
                  key={skill.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSkill(skill)}
                  className={`p-6 border-3 border-foreground text-center transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-card hover:bg-muted"
                  }`}
                  style={{
                    boxShadow: isSelected ? "var(--shadow-brutal)" : "var(--shadow-brutal-sm)",
                  }}
                >
                  <div
                    className={`w-14 h-14 border-2 border-foreground flex items-center justify-center mx-auto mb-3 ${
                      isSelected ? "bg-background" : "bg-comic-blue"
                    }`}
                  >
                    <Icon
                      className={`w-7 h-7 ${
                        isSelected ? "text-primary" : "text-comic-blue-foreground"
                      }`}
                    />
                  </div>
                  <h4 className="font-comic text-lg mb-1">{skill.name}</h4>
                  <p
                    className={`text-sm ${
                      isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {skill.description}
                  </p>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-6 border-t-2 border-foreground/20">
        <Button
          variant="outline"
          onClick={handleBack}
          className="border-2 border-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {step === 1 ? "Cancel" : "Back"}
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="bg-primary text-primary-foreground border-2 border-foreground"
        >
          {step === 5 ? (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Create Project
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EnhancedProjectCreator;