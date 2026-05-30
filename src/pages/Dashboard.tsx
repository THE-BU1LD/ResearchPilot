import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { OnboardingOverlay, useOnboarding } from "@/components/ui/onboarding-overlay";
import { EmptyState } from "@/components/ui/empty-state";
import EnhancedProjectCreator from "@/components/project/EnhancedProjectCreator";
import { ResearchField, ResearchType } from "@/components/project/ResearchFieldSelector";
import {
  BookOpen,
  Plus,
  Search,
  LogOut,
  Settings,
  User,
  FolderOpen,
  Clock,
  TrendingUp,
  Star,
  LayoutGrid,
  List,
  FileText,
  Award,
  ChevronRight,
  Rocket,
  ArrowRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import DraggableShape from "@/components/interactive/DraggableShape";
import InteractiveComicDots from "@/components/interactive/InteractiveComicDots";
import { FloatingDoodles, CornerScribble, HandDrawnUnderline } from "@/components/interactive/ArtisticScribbles";

/* ---------------- TYPES ---------------- */

interface Project {
  id: string;
  title: string;
  category: string;
  field: string;
  fieldColor: string;
  researchType: string;
  progress: number;
  lastUpdated: string;
  isFavorite: boolean;
  goal?: string;
  timeline?: string;
  skillLevel?: string;
}

/* ---------------- COMPONENT ---------------- */

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterField, setFilterField] = useState<string | null>(null);
  const [showWelcomeTip, setShowWelcomeTip] = useState(true);

  // Onboarding
  const { hasSeenOnboarding, completeOnboarding, isLoaded } = useOnboarding("dashboard_onboarding_v1");

  /* ---------- CREATE PROJECT ---------- */

  const handleCreateProject = (projectData: {
    name: string;
    field: ResearchField;
    type: ResearchType;
    goal: { id: string; name: string };
    timeline: { id: string; name: string; duration: string };
    skillLevel: { id: string; name: string };
  }) => {
    const finalId = Date.now().toString();

    const newProject: Project = {
      id: finalId,
      title: projectData.name,
      category: projectData.type.name.toUpperCase(),
      field: projectData.field.id,
      fieldColor: projectData.field.color,
      researchType: projectData.type.id,
      progress: 0,
      lastUpdated: "Just now",
      isFavorite: false,
      goal: projectData.goal.name,
      timeline: projectData.timeline.duration,
      skillLevel: projectData.skillLevel.name,
    };

    setProjects([newProject, ...projects]);
    setIsDialogOpen(false);
  };

  const toggleFavorite = (projectId: string) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesField = !filterField || p.field === filterField;
    return matchesSearch && matchesField;
  });

  const favoriteProjects = filteredProjects.filter((p) => p.isFavorite);
  const recentProjects = filteredProjects.filter((p) => !p.isFavorite);

  const stats = [
    { icon: FolderOpen, label: "Projects", value: projects.length, color: "bg-primary" },
    { icon: Star, label: "Favorites", value: favoriteProjects.length, color: "bg-accent" },
    { icon: TrendingUp, label: "In Progress", value: projects.filter((p) => p.progress > 0 && p.progress < 100).length, color: "bg-comic-blue" },
    { icon: Award, label: "Completed", value: projects.filter((p) => p.progress === 100).length, color: "bg-comic-green" },
  ];

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Onboarding overlay */}
      <AnimatePresence>
        {isLoaded && !hasSeenOnboarding && (
          <OnboardingOverlay onComplete={completeOnboarding} />
        )}
      </AnimatePresence>

      {/* Background effects */}
      <InteractiveComicDots
        dotColor="hsl(var(--primary) / 0.06)"
        dotSpacing={36}
        minDotSize={1}
        maxDotSize={6}
        hoverRadius={120}
        className="z-0"
      />
      <FloatingDoodles className="z-5" />
      <CornerScribble position="bottom-right" size={80} />

      {/* Decorative shapes */}
      <div className="absolute inset-0 pointer-events-none z-5">
        <div className="pointer-events-auto">
          <DraggableShape initialX={80} initialY={180} size={50} color="hsl(var(--primary))" shape="star" rotation={15} />
          <DraggableShape initialX={typeof window !== "undefined" ? window.innerWidth - 120 : 700} initialY={300} size={40} color="hsl(var(--accent))" shape="circle" rotation={0} />
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b-3 border-foreground">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary border-2 border-foreground flex items-center justify-center group-hover:rotate-12 transition-transform">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-comic text-xl">ResearchLab</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="border-2 border-foreground">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-2 border-foreground">
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto px-6 py-10 relative z-10">
        {/* Welcome section */}
        <div className="mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-comic text-4xl md:text-5xl mb-2 relative inline-block"
          >
            Your Research Hub
            <HandDrawnUnderline width={280} className="left-0" color="hsl(var(--primary))" />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Create, manage, and publish your research projects
          </motion.p>
        </div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-4 border-3 border-foreground bg-card"
                style={{ boxShadow: "var(--shadow-brutal-sm)" }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stat.color} border-2 border-foreground flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-comic text-2xl">{stat.value}</div>
                    <div className="text-xs text-muted-foreground uppercase font-bold">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Actions bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="brutal-button bg-primary text-primary-foreground"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Button>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="pl-10 pr-4 h-10 w-48 md:w-64 border-2 border-foreground bg-card text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* View toggle */}
            <div className="flex border-2 border-foreground">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 border-l-2 border-foreground ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Welcome tip for new users */}
        {showWelcomeTip && projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-primary/10 border-2 border-primary/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary border-2 border-foreground flex items-center justify-center">
                <Rocket className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-sm">Welcome to ResearchLab!</p>
                <p className="text-sm text-muted-foreground">Create your first project to start your research journey.</p>
              </div>
            </div>
            <button
              onClick={() => setShowWelcomeTip(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Projects */}
        {projects.length === 0 ? (
          <EmptyState
            type="projects"
            onAction={() => setIsDialogOpen(true)}
            showTips={true}
          />
        ) : (
          <div className="space-y-8">
            {/* Favorites */}
            {favoriteProjects.length > 0 && (
              <div>
                <h2 className="font-comic text-xl mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Favorites
                </h2>
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
                  {favoriteProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} viewMode={viewMode} onToggleFavorite={toggleFavorite} />
                  ))}
                </div>
              </div>
            )}

            {/* Recent */}
            <div>
              <h2 className="font-comic text-xl mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Recent Projects
              </h2>
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
                {recentProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} viewMode={viewMode} onToggleFavorite={toggleFavorite} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-3 border-foreground" style={{ boxShadow: "var(--shadow-brutal-lg)" }}>
          <EnhancedProjectCreator
            onComplete={handleCreateProject}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ---------------- PROJECT CARD ---------------- */

const ProjectCard = ({
  project,
  viewMode,
  onToggleFavorite,
}: {
  project: Project;
  viewMode: "grid" | "list";
  onToggleFavorite: (id: string) => void;
}) => {
  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ x: 4 }}
        className="flex items-center justify-between p-4 border-3 border-foreground bg-card"
        style={{ boxShadow: "var(--shadow-brutal-sm)" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 border-2 border-foreground flex items-center justify-center"
            style={{ backgroundColor: project.fieldColor }}
          >
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold">{project.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{project.category}</span>
              <span>•</span>
              <span>{project.lastUpdated}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32">
            <Progress value={project.progress} className="h-2" />
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(project.id);
            }}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star className={`w-5 h-5 ${project.isFavorite ? "fill-primary text-primary" : "text-muted-foreground"}`} />
          </button>
          <Link to={`/project/${project.id}`}>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <Link to={`/project/${project.id}`}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02, rotate: 0.5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="p-5 border-3 border-foreground bg-card group cursor-pointer"
        style={{ boxShadow: "var(--shadow-brutal-sm)" }}
      >
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-12 h-12 border-2 border-foreground flex items-center justify-center group-hover:rotate-6 transition-transform"
            style={{ backgroundColor: project.fieldColor }}
          >
            <FileText className="w-6 h-6 text-white" />
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(project.id);
            }}
            className="p-1 hover:scale-125 transition-transform"
          >
            <Star className={`w-5 h-5 ${project.isFavorite ? "fill-primary text-primary" : "text-muted-foreground"}`} />
          </button>
        </div>
        <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-0.5 text-xs font-bold uppercase border border-foreground/30 bg-muted">
            {project.category}
          </span>
          {project.goal && (
            <span className="px-2 py-0.5 text-xs font-bold uppercase border border-foreground/30 bg-primary/10 text-primary">
              {project.goal}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Clock className="w-4 h-4" />
          <span>{project.lastUpdated}</span>
          {project.timeline && (
            <>
              <span>•</span>
              <span>{project.timeline}</span>
            </>
          )}
        </div>
        <Progress value={project.progress} className="h-2" />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">{project.progress}% complete</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </motion.div>
    </Link>
  );
};

export default Dashboard;