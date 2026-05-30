import { useEffect, useRef, useState } from "react";
import { 
  PenTool, 
  BarChart3, 
  Lightbulb, 
  BookMarked, 
  Quote, 
  Search,
  ArrowRight,
  Wand2,
  TrendingUp,
  MessageSquare,
  Library,
  Bookmark,
  Globe,
  Zap,
  HelpCircle
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DraggableShape from "@/components/interactive/DraggableShape";
import { HyperInteractiveDots } from "@/components/interactive/SketchedBackground";
import { FloatingDoodles, CornerScribble, HandDrawnUnderline } from "@/components/interactive/ArtisticScribbles";
import { motion } from "framer-motion";
import { FeatureExplainer } from "@/components/ui/feature-explainer";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: PenTool,
    secondaryIcon: Wand2,
    title: "Writing Studio",
    tagline: "Write Better",
    description: "AI suggestions for clarity, flow & academic tone. Not AI-written—AI-refined.",
    color: "bg-primary",
    benefits: ["Grammar polish", "Tone check", "Flow analysis"],
    explainer: "Our AI reviews your writing for academic quality without writing for you. It highlights awkward sentences, suggests stronger vocabulary, and ensures your tone matches scholarly standards.",
  },
  {
    icon: BarChart3,
    secondaryIcon: TrendingUp,
    title: "Data Analysis",
    tagline: "Visualize Insights",
    description: "Upload data, run statistics, and create publication-ready charts instantly.",
    color: "bg-accent",
    benefits: ["Auto stats", "Smart charts", "Export ready"],
    explainer: "Upload CSV or Excel files and instantly get mean, median, standard deviation, and more. Generate bar charts, line graphs, and pie charts that are ready for your research paper.",
  },
  {
    icon: Lightbulb,
    secondaryIcon: MessageSquare,
    title: "Idea Generation",
    tagline: "Spark Ideas",
    description: "Guided prompts to develop research questions and refine your thesis.",
    color: "bg-primary",
    benefits: ["Brainstorm", "Refine thesis", "Get feedback"],
    explainer: "Stuck on what to research? Our guided prompts help you explore angles, narrow your focus, and develop a clear thesis statement step by step.",
  },
  {
    icon: BookMarked,
    secondaryIcon: Library,
    title: "Literature Review",
    tagline: "Organize Sources",
    description: "Summarize, compare, and organize sources automatically in one place.",
    color: "bg-comic-blue",
    benefits: ["Auto-summarize", "Compare papers", "Smart organize"],
    explainer: "Paste article links or upload PDFs. We extract key points, identify common themes, and help you see how sources relate to each other and your thesis.",
  },
  {
    icon: Quote,
    secondaryIcon: Bookmark,
    title: "Citations Manager",
    tagline: "Cite Correctly",
    description: "One-click citations in MLA, APA, or Chicago. Never misformat again.",
    color: "bg-primary",
    benefits: ["MLA/APA/Chicago", "Auto-format", "Bibliography"],
    explainer: "Enter a URL, DOI, or book ISBN and instantly get a properly formatted citation. Switch between styles with one click and generate your full bibliography automatically.",
  },
  {
    icon: Search,
    secondaryIcon: Globe,
    title: "Paper Search",
    tagline: "Find Research",
    description: "Search millions of papers and import relevant ones to your project.",
    color: "bg-accent",
    benefits: ["Smart search", "Quick import", "Related papers"],
    explainer: "Search academic databases for peer-reviewed articles. Filter by date, journal, and relevance. Import sources directly into your project with a single click.",
  },
];

const FeaturesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate feature cards with stagger
      const cards = gridRef.current?.children;
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, rotateX: -15 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  
  return (
    <section ref={sectionRef} id="features" className="py-20 bg-secondary border-y-3 border-foreground relative overflow-hidden">
      {/* Hyper-interactive sketched dots background */}
      <HyperInteractiveDots
        dotColor="hsl(var(--primary) / 0.14)"
        dotSpacing={22}
        minDotSize={2}
        maxDotSize={12}
        hoverRadius={130}
        className="z-0"
      />

      {/* Floating doodles */}
      <FloatingDoodles className="z-5" />

      {/* Corner scribbles */}
      <CornerScribble position="top-right" size={90} />
      <CornerScribble position="bottom-left" size={90} />
      
      {/* Decorative shapes */}
      <div className="absolute inset-0 pointer-events-none z-5">
        <div className="pointer-events-auto">
          <DraggableShape
            shape="triangle"
            initialX={40}
            initialY={80}
            size={42}
            color="hsl(0 84% 60%)"
            rotation={-15}
          />
          <DraggableShape
            shape="square"
            initialX={90}
            initialY={500}
            size={36}
            color="hsl(45 93% 58%)"
            rotation={10}
          />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header with personal touch */}
        <div ref={headerRef} className="text-center mb-16">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="inline-block px-4 py-2 bg-primary border-3 border-foreground shadow-brutal-sm mb-6 cursor-pointer rotate-[-2deg]"
          >
            <span className="font-bold uppercase text-primary-foreground text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 animate-pulse" /> Power Tools
            </span>
          </motion.div>
          <h2 className="font-comic text-4xl md:text-6xl text-foreground mb-4 relative inline-block">
            Your Research <span className="text-primary">Arsenal</span>!
            <HandDrawnUnderline width={300} className="left-1/2 -translate-x-1/2" />
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
            Six powerful modules designed by researchers, for students. Everything you need in <span className="font-bold text-foreground">one place</span>.
          </p>
        </div>

        {/* Features Grid with enhanced hover */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const SecondaryIcon = feature.secondaryIcon;
            const isHovered = hoveredIndex === index;
            return (
              <motion.div
                key={feature.title}
                whileHover={{ 
                  y: -8, 
                  x: -4,
                  scale: 1.02,
                  rotate: index % 2 === 0 ? 1 : -1
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`brutal-card p-6 bg-card cursor-pointer group ${
                  isHovered ? "shadow-brutal-lg" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Icon cluster */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`w-14 h-14 ${feature.color} border-3 border-foreground flex items-center justify-center shadow-brutal-sm transition-all duration-200 ${
                      isHovered ? "rotate-6 scale-110" : ""
                    }`}
                  >
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div className={`w-8 h-8 bg-background border-2 border-foreground flex items-center justify-center -ml-5 mt-6 transition-all ${
                    isHovered ? "rotate-[-10deg] scale-110" : ""
                  }`}>
                    <SecondaryIcon className="w-4 h-4 text-primary" />
                  </div>
                </div>

                {/* Tagline badge */}
                <div className={`inline-block px-2 py-1 text-xs font-bold uppercase border-2 border-foreground mb-2 transition-colors ${
                  isHovered ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {feature.tagline}
                </div>

                {/* Content */}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`font-comic text-2xl transition-colors ${
                    isHovered ? "text-primary" : "text-foreground"
                  }`}>
                    {feature.title}
                  </h3>
                  <FeatureExplainer 
                    title={feature.title}
                    description={feature.explainer}
                    type="info"
                    iconSize={14}
                  />
                </div>
                <p className="text-muted-foreground font-medium mb-4 text-sm">
                  {feature.description}
                </p>

                {/* Benefits pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {feature.benefits.map((benefit) => (
                    <span 
                      key={benefit}
                      className="px-2 py-1 text-xs bg-background border border-foreground/30 rounded font-medium"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>

                {/* Link */}
                <div className={`flex items-center gap-2 text-sm font-bold uppercase transition-colors ${
                  isHovered ? "text-primary" : "text-foreground"
                }`}>
                  Explore
                  <ArrowRight className={`w-4 h-4 transition-transform ${
                    isHovered ? "translate-x-2" : ""
                  }`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
