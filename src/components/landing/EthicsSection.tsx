import { useEffect, useRef, useState } from "react";
import { Shield, Brain, Users, Sparkles, Check } from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DraggableShape from "@/components/interactive/DraggableShape";
import InteractiveComicDots from "@/components/interactive/InteractiveComicDots";
import { FloatingDoodles, CornerScribble, HandDrawnUnderline } from "@/components/interactive/ArtisticScribbles";

gsap.registerPlugin(ScrollTrigger);

const principles = [
  {
    icon: Brain,
    title: "AI-Assisted, Not AI-Created",
    description: "We help you think better—never think for you. All content remains authentically yours.",
  },
  {
    icon: Users,
    title: "Your Research, Your Voice",
    description: "Our tools enhance your unique perspective while preserving academic integrity.",
  },
  {
    icon: Shield,
    title: "Transparent & Ethical",
    description: "Clear boundaries between assistance and authorship. No hidden AI generation.",
  },
];

const commitments = [
  "No direct AI-written content generation",
  "Citations always traced to real sources",
  "Your data stays private and secure",
  "Academic integrity built into every feature",
];

const EthicsSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const principlesRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

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

      // Animate principles with stagger
      const principleCards = principlesRef.current?.children;
      if (principleCards) {
        gsap.fromTo(
          principleCards,
          { y: 50, opacity: 0, scale: 0.9, rotateY: -10 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: principlesRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Animate banner
      gsap.fromTo(
        bannerRef.current,
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bannerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-card border-y-3 border-foreground relative overflow-hidden">
      {/* Interactive dots background */}
      <InteractiveComicDots
        dotColor="hsl(var(--foreground) / 0.06)"
        dotSpacing={22}
        minDotSize={1.5}
        maxDotSize={8}
        hoverRadius={100}
        className="z-0"
      />

      {/* Floating doodles */}
      <FloatingDoodles className="z-5" />

      {/* Corner scribbles */}
      <CornerScribble position="top-left" size={80} />
      <CornerScribble position="bottom-right" size={80} />
      
      {/* Interactive decorations */}
      <div className="absolute inset-0 pointer-events-none z-5">
        <div className="pointer-events-auto">
          <DraggableShape
            shape="star"
            initialX={80}
            initialY={40}
            size={48}
            color="hsl(45 93% 58%)"
            rotation={15}
          />
          <DraggableShape
            shape="circle"
            initialX={40}
            initialY={400}
            size={36}
            color="hsl(0 84% 60%)"
            rotation={0}
          />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent border-3 border-foreground shadow-brutal-sm mb-6 rotate-[-1deg] hover:rotate-0 transition-transform cursor-pointer">
            <Shield className="w-5 h-5 text-accent-foreground" />
            <span className="font-bold uppercase text-accent-foreground text-sm">
              Our Promise
            </span>
          </div>
          <h2 className="font-comic text-4xl md:text-6xl text-foreground mb-4 relative inline-block">
            Ethics First!
            <HandDrawnUnderline width={180} className="left-1/2 -translate-x-1/2" />
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
            Research assistance that respects academic integrity
          </p>
        </div>

        {/* Principles Grid with enhanced hover */}
        <div ref={principlesRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <motion.div
                key={principle.title}
                whileHover={{ 
                  y: -10, 
                  x: -4,
                  scale: 1.02,
                  rotate: index % 2 === 0 ? 2 : -2
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`brutal-card p-6 bg-background group cursor-pointer ${
                  hoveredIndex === index ? "shadow-brutal-lg" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Comic burst behind icon */}
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-accent/20 rounded-full scale-150 animate-pulse" />
                  <div className="relative w-16 h-16 bg-primary border-3 border-foreground flex items-center justify-center shadow-brutal-sm group-hover:rotate-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>
                
                <h3 className="font-comic text-xl mb-2 text-foreground group-hover:text-primary transition-colors">
                  {principle.title}
                </h3>
                <p className="text-muted-foreground font-medium">
                  {principle.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Commitments Banner */}
        <div ref={bannerRef} className="brutal-card p-8 bg-primary/10 border-primary">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-primary animate-bounce" />
            <h3 className="font-comic text-2xl text-foreground">Our Commitments</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commitments.map((commitment, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 bg-background border-2 border-foreground/20 rounded-lg hover:border-primary hover:bg-primary/5 transition-all group cursor-default"
              >
                <div className="w-6 h-6 bg-accent border-2 border-foreground flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Check className="w-4 h-4 text-accent-foreground" />
                </div>
                <span className="font-medium text-foreground">{commitment}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EthicsSection;
