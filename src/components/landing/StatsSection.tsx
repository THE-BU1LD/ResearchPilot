import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HyperInteractiveDots } from "@/components/interactive/SketchedBackground";
import { Doodle, Scribble } from "@/components/interactive/ArtisticScribbles";
import { Users, FolderOpen, Star, Gift, Trophy, Globe, HelpCircle } from "lucide-react";
import { FeatureExplainer } from "@/components/ui/feature-explainer";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 10000, label: "Students", suffix: "+", icon: Users, description: "Active researchers", explainer: "Students from middle and high schools using our platform daily" },
  { value: 50000, label: "Projects", suffix: "+", icon: FolderOpen, description: "Research completed", explainer: "Research papers, essays, and projects created using our tools" },
  { value: 50, label: "Countries", suffix: "+", icon: Globe, description: "Worldwide reach", explainer: "Students from over 50 countries trust us for their research" },
  { value: 100, label: "Free", suffix: "%", icon: Gift, description: "No hidden costs", explainer: "Completely free for all students - no premium tiers or paywalls" },
];

const StatsSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate cards stagger
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Animate counters
      stats.forEach((stat, index) => {
        const counterEl = counterRefs.current[index];
        if (!counterEl) return;

        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            if (counterEl) {
              const formatted = stat.value >= 1000 
                ? Math.round(obj.val / 1000) + "K"
                : stat.value % 1 !== 0 
                  ? obj.val.toFixed(1)
                  : Math.round(obj.val).toString();
              counterEl.textContent = formatted + stat.suffix;
            }
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  
  return (
    <section ref={sectionRef} className="py-20 border-y-3 border-foreground bg-primary/5 relative overflow-hidden">
      {/* Hyper-interactive dots background */}
      <HyperInteractiveDots
        dotColor="hsl(var(--primary) / 0.12)"
        dotSpacing={18}
        minDotSize={1.5}
        maxDotSize={12}
        hoverRadius={130}
        className="z-0"
      />

      {/* Decorative elements */}
      <div className="absolute top-6 left-10 pointer-events-none">
        <Doodle type="star" size={50} color="hsl(var(--primary) / 0.3)" />
      </div>
      <div className="absolute bottom-6 right-10 pointer-events-none">
        <Doodle type="burst" size={45} color="hsl(var(--accent) / 0.3)" />
      </div>
      <div className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none hidden lg:block">
        <Scribble type="zigzag" size={80} color="hsl(var(--foreground) / 0.1)" strokeWidth={3} />
      </div>
      <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none hidden lg:block">
        <Scribble type="zigzag" size={80} color="hsl(var(--foreground) / 0.1)" strokeWidth={3} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section intro */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-card border-2 border-foreground/30 mb-3">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase text-muted-foreground">By The Numbers</span>
          </div>
          <h3 className="font-comic text-2xl md:text-3xl text-foreground">
            Join the <span className="text-primary">Movement</span>
          </h3>
        </motion.div>

        <div ref={cardsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isHovered = hoveredIndex === index;
            return (
              <motion.div
                key={stat.label}
                whileHover={{ 
                  y: -10, 
                  x: -4,
                  scale: 1.05,
                  rotate: index % 2 === 0 ? 2 : -2
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`brutal-card p-5 md:p-6 text-center bg-card cursor-pointer group transition-colors ${
                  isHovered ? "shadow-brutal-lg bg-primary" : ""
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Icon */}
                <div className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 border-2 border-foreground flex items-center justify-center transition-all ${
                  isHovered ? "bg-background rotate-12" : "bg-primary/10"
                }`}>
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 transition-colors ${
                    isHovered ? "text-primary" : "text-primary"
                  }`} />
                </div>

                {/* Counter */}
                <span
                  ref={(el) => (counterRefs.current[index] = el)}
                  className={`font-comic text-3xl md:text-5xl mb-1 block transition-all duration-200 ${
                    isHovered ? "text-primary-foreground scale-110" : "text-foreground"
                  }`}
                >
                  0
                </span>

                {/* Label with explainer */}
                <div className="flex items-center justify-center gap-1">
                  <p className={`text-sm font-bold uppercase tracking-wide transition-colors ${
                    isHovered ? "text-primary-foreground" : "text-primary"
                  }`}>
                    {stat.label}
                  </p>
                  <FeatureExplainer
                    title={stat.label}
                    description={stat.explainer}
                    type="info"
                    iconSize={12}
                  />
                </div>

                {/* Description */}
                <p className={`text-xs mt-1 transition-colors ${
                  isHovered ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}>
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
