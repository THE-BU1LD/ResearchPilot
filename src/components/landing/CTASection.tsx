import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Rocket, Star, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DraggableShape from "@/components/interactive/DraggableShape";
import InteractiveComicDots from "@/components/interactive/InteractiveComicDots";
import { CornerScribble, HandDrawnUnderline, Doodle } from "@/components/interactive/ArtisticScribbles";

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  "100% Free Forever",
  "No Credit Card Required",
  "Start in Under 2 Minutes",
];

const CTASection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate content
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-primary border-y-3 border-foreground relative overflow-hidden">
      {/* Interactive dots background */}
      <InteractiveComicDots
        dotColor="hsl(0 0% 5% / 0.12)"
        dotSpacing={28}
        minDotSize={2}
        maxDotSize={14}
        hoverRadius={150}
        className="z-0"
      />

      {/* Corner scribbles */}
      <CornerScribble position="top-left" size={120} color="hsl(0 0% 100% / 0.15)" />
      <CornerScribble position="bottom-right" size={120} color="hsl(0 0% 100% / 0.15)" />

      {/* Decorative doodles */}
      <div className="absolute top-10 left-10 pointer-events-none">
        <Doodle type="star" size={50} color="hsl(0 0% 100% / 0.2)" animate={false} />
      </div>
      <div className="absolute bottom-10 right-10 pointer-events-none">
        <Doodle type="burst" size={45} color="hsl(0 0% 100% / 0.2)" animate={false} />
      </div>
      
      {/* Interactive decorations */}
      <div className="absolute inset-0 pointer-events-none z-5">
        <div className="pointer-events-auto">
          <DraggableShape
            initialX={50}
            initialY={30}
            size={50}
            color="hsl(0 0% 100% / 0.15)"
            rotation={12}
            shape="star"
          />
          <DraggableShape
            initialX={typeof window !== "undefined" ? window.innerWidth - 100 : 800}
            initialY={150}
            size={40}
            color="hsl(0 0% 100% / 0.15)"
            rotation={-6}
            shape="star"
          />
          <DraggableShape
            initialX={100}
            initialY={180}
            size={45}
            color="hsl(0 0% 100% / 0.1)"
            rotation={20}
            shape="square"
          />
          <DraggableShape
            initialX={typeof window !== "undefined" ? window.innerWidth - 150 : 750}
            initialY={50}
            size={35}
            color="hsl(0 0% 100% / 0.1)"
            rotation={-15}
            shape="circle"
          />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div ref={contentRef} className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-card border-3 border-foreground shadow-brutal-sm mb-6"
          >
            <Rocket className="w-4 h-4 text-primary" />
            <span className="font-bold uppercase text-foreground text-sm">Ready to Launch?</span>
          </motion.div>

          <h2 className="font-comic text-4xl md:text-6xl text-primary-foreground mb-6 relative inline-block">
            Level Up Your <span className="relative inline-block">
              Research
              <Star className="absolute -top-2 -right-6 w-6 h-6 text-card fill-card animate-float" />
            </span>!
            <HandDrawnUnderline width={350} className="left-1/2 -translate-x-1/2" color="hsl(0 0% 100% / 0.4)" />
          </h2>
          
          <p className="text-xl text-primary-foreground/90 mb-8 font-medium">
            Join <span className="font-bold">10,000+ students</span> who are already creating 
            better research papers with less stress.
          </p>

          {/* Benefits list */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-card/10 border-2 border-card/30 text-primary-foreground"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-bold">{benefit}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="xl"
                  className="bg-card hover:bg-card/90 group animate-pulse-glow"
                >
                  <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Start Free Today
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            <Link to="/how-it-works">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="xl"
                  className="border-2 border-card/30 text-primary-foreground hover:bg-card/10 group"
                >
                  See How It Works
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
          </div>

          {/* Trust indicator */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-sm text-primary-foreground/70 font-medium flex items-center justify-center gap-2"
          >
            <Star className="w-4 h-4 fill-current" /> Trusted by students in 50+ countries
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
