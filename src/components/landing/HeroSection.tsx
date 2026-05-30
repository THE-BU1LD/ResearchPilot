import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Star, Rocket, Lightbulb, BarChart3, PenTool, BookMarked, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import DraggableShape from "@/components/interactive/DraggableShape";
import { HyperInteractiveDots } from "@/components/interactive/SketchedBackground";
import { FloatingDoodles, CornerScribble, HandDrawnUnderline, Doodle } from "@/components/interactive/ArtisticScribbles";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FeatureExplainer } from "@/components/ui/feature-explainer";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const speechBubbleRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate badge
      gsap.fromTo(
        badgeRef.current,
        { y: -30, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)", delay: 0.2 }
      );

      // Animate headline
      gsap.fromTo(
        headlineRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.4 }
      );

      // Animate speech bubble
      gsap.fromTo(
        speechBubbleRef.current,
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power2.out", delay: 0.6 }
      );

      // Animate buttons
      gsap.fromTo(
        buttonsRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.8 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Hyper-interactive sketched dots background */}
      <HyperInteractiveDots
        dotColor="hsl(var(--primary) / 0.18)"
        dotSpacing={26}
        minDotSize={2}
        maxDotSize={18}
        hoverRadius={160}
        className="-z-20"
      />

      {/* Floating doodles */}
      <FloatingDoodles className="-z-15" />

      {/* Corner scribbles */}
      <CornerScribble position="top-left" size={120} />
      <CornerScribble position="top-right" size={100} />

      {/* Interactive draggable shapes */}
      <div className="absolute inset-0 -z-10 overflow-visible pointer-events-none">
        <div className="pointer-events-auto">
          {/* Red squares */}
          <DraggableShape
            initialX={80}
            initialY={120}
            size={60}
            color="hsl(0 85% 55%)"
            rotation={12}
            shape="square"
          />
          <DraggableShape
            initialX={200}
            initialY={350}
            size={40}
            color="hsl(350 80% 45%)"
            rotation={-20}
            shape="square"
          />
          
          {/* Circles */}
          <DraggableShape
            initialX={typeof window !== "undefined" ? window.innerWidth - 150 : 800}
            initialY={100}
            size={50}
            color="hsl(0 90% 65%)"
            rotation={0}
            shape="circle"
          />
          <DraggableShape
            initialX={typeof window !== "undefined" ? window.innerWidth - 250 : 700}
            initialY={320}
            size={35}
            color="hsl(210 100% 55%)"
            rotation={0}
            shape="circle"
          />
          
          {/* Stars */}
          <DraggableShape
            initialX={150}
            initialY={250}
            size={45}
            color="hsl(0 85% 55%)"
            rotation={15}
            shape="star"
          />
          <DraggableShape
            initialX={typeof window !== "undefined" ? window.innerWidth - 200 : 750}
            initialY={200}
            size={55}
            color="hsl(350 80% 45%)"
            rotation={-10}
            shape="star"
          />
          
          {/* Triangles */}
          <DraggableShape
            initialX={100}
            initialY={400}
            size={50}
            color="hsl(0 80% 50%)"
            rotation={8}
            shape="triangle"
          />
          <DraggableShape
            initialX={typeof window !== "undefined" ? window.innerWidth - 180 : 780}
            initialY={420}
            size={40}
            color="hsl(145 70% 45%)"
            rotation={-15}
            shape="triangle"
          />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Decorative doodles around badge */}
          <div className="relative inline-block mb-8">
            <Doodle type="star" size={24} color="hsl(var(--primary))" className="absolute -left-8 -top-2" />
            <motion.div 
              ref={badgeRef}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary border-3 border-foreground shadow-brutal-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-primary-foreground" />
              <span className="text-sm font-bold uppercase text-primary-foreground">
                For Students Ages 14-18
              </span>
            </motion.div>
            <Doodle type="heart" size={20} color="hsl(var(--accent))" className="absolute -right-6 -top-1" />
          </div>

          {/* Headline with enhanced styling */}
          <h1 
            ref={headlineRef}
            className="font-comic text-5xl md:text-7xl lg:text-8xl text-foreground leading-none mb-6"
          >
            <span className="relative inline-block">
              Research Made
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -right-8 -top-4"
              >
                <Star className="w-6 h-6 text-primary fill-primary animate-float" />
              </motion.span>
            </span>
            <br />
            <span className="relative inline-block group cursor-pointer my-2">
              <span className="relative z-10 text-primary-foreground transition-transform duration-200 group-hover:scale-110 inline-block px-4 py-1">SIMPLE</span>
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="absolute inset-0 bg-primary border-3 border-foreground -z-0 -rotate-1 origin-left transition-all duration-200 group-hover:rotate-2 group-hover:scale-105" 
              />
              <HandDrawnUnderline width={160} className="-bottom-3 left-1/2 -translate-x-1/2 z-20" color="hsl(var(--accent))" />
            </span>
            <br />
            <span className="relative inline-block">
              Not Simplified!
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="absolute -right-10 bottom-0"
              >
                <Rocket className="w-8 h-8 text-accent rotate-45" />
              </motion.span>
            </span>
          </h1>

          {/* Subheadline - Speech bubble */}
          <motion.div 
            ref={speechBubbleRef}
            whileHover={{ scale: 1.02 }}
            className="speech-bubble max-w-2xl mx-auto mb-8 cursor-default"
          >
            <p className="text-lg md:text-xl text-foreground font-medium">
              A complete platform that guides middle and high school students through
              every step of the research process—from <span className="font-bold text-primary">initial ideas</span> to <span className="font-bold text-primary">final papers</span>.
            </p>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            {[
              { Icon: Lightbulb, label: "AI Idea Generator" },
              { Icon: BarChart3, label: "One-Click Statistics" },
              { Icon: PenTool, label: "Writing Assistant" },
              { Icon: BookMarked, label: "Citation Manager" },
            ].map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-3 py-2 bg-card border-2 border-foreground/30 flex items-center gap-2 cursor-default"
              >
                <feature.Icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons with enhanced animations */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="default" size="xl" className="group animate-pulse-glow">
                  <Rocket className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  Start Your First Project
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="xl" className="group">
                <Zap className="w-5 h-5 transition-transform group-hover:rotate-12" />
                Watch Demo
              </Button>
            </motion.div>
          </div>
          
          {/* Interactive hint with icon */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-8 text-sm text-muted-foreground inline-flex items-center gap-2"
          >
            <span className="px-2 py-1 bg-muted border-2 border-foreground/20 text-xs font-bold">TIP</span>
            Try hovering over the dots and dragging the shapes!
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
