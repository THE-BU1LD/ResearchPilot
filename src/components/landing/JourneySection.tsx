import { useEffect, useRef, useState } from "react";
import { Lightbulb, BookOpen, Database, BarChart3, PenTool, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InteractiveComicDots from "@/components/interactive/InteractiveComicDots";
import { FloatingDoodles, HandDrawnUnderline, Doodle } from "@/components/interactive/ArtisticScribbles";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Lightbulb,
    title: "IDEATE",
    subtitle: "Step 1",
    description: "Brainstorm research questions and develop your thesis with AI-guided prompts",
    color: "bg-primary",
    tip: "Start with 'What if...' questions!",
  },
  {
    icon: BookOpen,
    title: "REVIEW",
    subtitle: "Step 2",
    description: "Find, analyze, and organize sources for your literature review",
    color: "bg-accent",
    tip: "Use our smart search filters",
  },
  {
    icon: Database,
    title: "COLLECT",
    subtitle: "Step 3",
    description: "Gather data and organize your research materials systematically",
    color: "bg-primary",
    tip: "Import from any format",
  },
  {
    icon: BarChart3,
    title: "ANALYZE",
    subtitle: "Step 4",
    description: "Run statistics and create beautiful visualizations automatically",
    color: "bg-comic-blue",
    tip: "One-click statistical tests",
  },
  {
    icon: PenTool,
    title: "WRITE",
    subtitle: "Step 5",
    description: "Draft, refine, and polish your final paper with AI assistance",
    color: "bg-primary",
    tip: "AI suggestions, not rewrites",
  },
];

const JourneySection = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate connecting line
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: stepsRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate steps with stagger
      const stepElements = stepsRef.current?.children;
      if (stepElements) {
        gsap.fromTo(
          stepElements,
          { y: 60, opacity: 0, scale: 0.8 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: stepsRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  
  return (
    <section ref={sectionRef} className="py-20 bg-background relative overflow-hidden">
      {/* Interactive dots background */}
      <InteractiveComicDots
        dotColor="hsl(var(--foreground) / 0.05)"
        dotSpacing={20}
        minDotSize={1}
        maxDotSize={6}
        hoverRadius={80}
        className="z-0"
      />

      {/* Floating doodles */}
      <FloatingDoodles className="z-5" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header with personalized messaging */}
        <div ref={headerRef} className="text-center mb-16">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary border-3 border-foreground shadow-brutal-sm mb-6 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-primary-foreground" />
            <span className="font-bold uppercase text-primary-foreground text-sm">
              Your Research Journey
            </span>
          </motion.div>
          <h2 className="font-comic text-4xl md:text-6xl text-foreground mb-4 relative inline-block">
            Five Steps to <span className="text-primary">Success</span>!
            <HandDrawnUnderline width={320} className="left-1/2 -translate-x-1/2" />
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
            Follow the <span className="font-bold text-foreground">proven path</span> from initial idea to published paper. 
            We'll guide you every step of the way.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div 
            ref={lineRef}
            className="hidden md:block absolute top-1/2 left-0 right-0 h-3 bg-primary -translate-y-1/2 z-0 origin-left"
          />
          
          <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              return (
                <motion.div
                  key={step.title}
                  className="flex flex-col items-center relative"
                  onMouseEnter={() => setActiveStep(index)}
                  onMouseLeave={() => setActiveStep(null)}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Connection arrow (hidden on mobile, visible between steps) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:flex absolute right-0 top-10 translate-x-1/2 z-20">
                      <ChevronRight className={`w-6 h-6 transition-colors ${isActive ? "text-primary" : "text-muted-foreground/30"}`} />
                    </div>
                  )}

                  {/* Icon box */}
                  <motion.div
                    whileHover={{ 
                      scale: 1.15, 
                      rotate: index % 2 === 0 ? 8 : -8,
                      y: -4
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`w-16 h-16 md:w-20 md:h-20 ${step.color} border-3 border-foreground flex items-center justify-center mb-3 cursor-pointer shadow-brutal ${
                      isActive ? "shadow-brutal-lg" : ""
                    }`}
                  >
                    <Icon className={`w-8 h-8 md:w-10 md:h-10 transition-all duration-200 ${
                      isActive ? "text-primary-foreground scale-110" : "text-primary-foreground"
                    }`} />
                  </motion.div>
                  
                  {/* Step number badge */}
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`px-3 py-1 border-3 border-foreground font-bold text-xs uppercase mb-2 transition-all duration-200 ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-brutal-sm" 
                      : "bg-card text-muted-foreground shadow-brutal-sm"
                  }`}>
                    {step.subtitle}
                  </motion.div>

                  {/* Content */}
                  <h3 className={`font-comic text-xl md:text-2xl mb-2 transition-all duration-200 ${
                    isActive ? "text-primary scale-105" : "text-foreground"
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-center text-xs md:text-sm font-medium leading-tight">
                    {step.description}
                  </p>

                  {/* Tip bubble on hover */}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ 
                      opacity: isActive ? 1 : 0, 
                      y: isActive ? 0 : 10,
                      scale: isActive ? 1 : 0.9
                    }}
                  className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-foreground text-background text-xs font-bold whitespace-nowrap border-2 border-foreground flex items-center gap-1"
                  >
                    <Lightbulb className="w-3 h-3" /> {step.tip}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom encouragement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card border-3 border-foreground shadow-brutal-sm">
            <Doodle type="star" size={24} color="hsl(var(--primary))" animate={false} />
            <span className="font-bold text-foreground">Most students complete their first project in under 2 weeks!</span>
            <Doodle type="star" size={24} color="hsl(var(--primary))" animate={false} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JourneySection;
