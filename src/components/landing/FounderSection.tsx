import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Rocket, 
  Brain, 
  Trophy, 
  Globe, 
  BookOpen, 
  Sparkles,
  GraduationCap,
  Code,
  Target,
  Heart
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InteractiveComicDots from "@/components/interactive/InteractiveComicDots";
import { FloatingDoodles, CornerScribble, HandDrawnUnderline } from "@/components/interactive/ArtisticScribbles";

gsap.registerPlugin(ScrollTrigger);

const achievements = [
  { icon: Brain, label: "AI Speech Model Creator", color: "bg-primary" },
  { icon: Trophy, label: "World Scholars Champion", color: "bg-accent" },
  { icon: Target, label: "AIME Qualifier", color: "bg-primary" },
  { icon: Globe, label: "International Footballer", color: "bg-comic-blue" },
  { icon: BookOpen, label: "Published Researcher", color: "bg-primary" },
  { icon: GraduationCap, label: "T-20 University Backed", color: "bg-accent" },
];

const FounderSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const achievementsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate content
      gsap.fromTo(
        contentRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate image
      gsap.fromTo(
        imageRef.current,
        { x: 60, opacity: 0, scale: 0.9 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate achievements with stagger
      const achievementCards = achievementsRef.current?.children;
      if (achievementCards) {
        gsap.fromTo(
          achievementCards,
          { y: 30, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: achievementsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-background border-y-3 border-foreground relative overflow-hidden">
      {/* Interactive dots background */}
      <InteractiveComicDots
        dotColor="hsl(var(--primary) / 0.08)"
        dotSpacing={24}
        minDotSize={2}
        maxDotSize={10}
        hoverRadius={120}
        className="z-0"
      />

      {/* Floating doodles */}
      <FloatingDoodles className="z-5" />

      {/* Corner scribbles */}
      <CornerScribble position="top-left" size={100} />
      <CornerScribble position="bottom-right" size={100} />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary border-3 border-foreground shadow-brutal-sm mb-6 rotate-[-2deg] hover:rotate-0 transition-transform cursor-pointer">
            <Rocket className="w-5 h-5 text-primary-foreground" />
            <span className="font-bold uppercase text-primary-foreground text-sm">
              Meet The Visionary
            </span>
          </div>
          <h2 className="font-comic text-4xl md:text-6xl text-foreground mb-4 relative inline-block">
            About the Founder
            <HandDrawnUnderline width={280} className="left-1/2 -translate-x-1/2" />
          </h2>
        </motion.div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div ref={contentRef} className="order-2 lg:order-1">
            <div className="brutal-card p-8 bg-card relative">
              {/* Decorative corner */}
              <div className="absolute -top-3 -left-3 w-12 h-12 bg-primary border-3 border-foreground flex items-center justify-center rotate-12">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>

              <h3 className="font-comic text-3xl md:text-4xl text-primary mb-4 mt-4">
                Ryan Gomez
              </h3>
              <p className="text-muted-foreground text-lg font-medium mb-4">
                16 year old Sophomore at Oakridge International
              </p>

              <div className="space-y-4 text-foreground">
                <p className="font-medium leading-relaxed">
                  From developing an <span className="text-primary font-bold">A.I speech model from pure scratch</span> to working in numerous startups in A.I and Technology, Ryan is a builder at heart.
                </p>
                <p className="font-medium leading-relaxed">
                  A World Scholars Champion, AIME Qualifier, International Footballer, and for relevance to this project—a <span className="text-primary font-bold">published author and researcher</span> in numerous research journals operating at an international undergrad level, backed by experts and professors at T-20 Universities.
                </p>
                
                {/* Quote box */}
                <div className="brutal-card p-4 bg-primary/10 border-primary mt-6">
                  <p className="text-lg font-bold italic text-foreground">
                    "People outside the United States do not know jack about research."
                  </p>
                </div>

                <p className="font-medium leading-relaxed">
                  It's unfair that many kids get to participate in ISEF while others struggle to find competitions besides a classroom activity. Making the process of research accessible and helping students develop high-quality products whilst making an impact—that's the dream.
                </p>

                <p className="font-medium leading-relaxed">
                  By merging his experience in A.I with his passion for research, Ryan formed <span className="text-primary font-bold">ResearchLab</span>—aimed at making research accessible in local communities and for everyone.
                </p>
              </div>

              {/* Mission statement */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-8 p-4 bg-primary border-3 border-foreground shadow-brutal-sm"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-primary-foreground flex-shrink-0" />
                  <p className="text-primary-foreground font-bold">
                    Making research accessible for everyone, everywhere.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Visual/Illustration side */}
          <div ref={imageRef} className="order-1 lg:order-2">
            <div className="relative">
              {/* Main card with comic illustration style */}
              <motion.div
                whileHover={{ scale: 1.02, rotate: -1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="brutal-card p-8 bg-primary relative overflow-hidden"
              >
                {/* Comic dots overlay */}
                <div className="absolute inset-0 comic-dots opacity-20" />
                
                <div className="relative z-10 text-center">
                  {/* Avatar placeholder with comic style */}
                  <div className="w-40 h-40 mx-auto mb-6 bg-card border-4 border-foreground shadow-brutal-lg rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <Code className="w-20 h-20 text-primary" />
                    </div>
                    {/* Comic effect lines */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent border-2 border-foreground flex items-center justify-center rotate-12">
                      <span className="text-xs font-bold">16</span>
                    </div>
                  </div>

                  <h4 className="font-comic text-2xl text-primary-foreground mb-2">
                    Young Innovator
                  </h4>
                  <p className="text-primary-foreground/80 font-medium">
                    Building the future of research
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-8 h-8 border-3 border-foreground rotate-45" />
                <div className="absolute bottom-4 right-4 w-6 h-6 bg-accent border-2 border-foreground rounded-full" />
              </motion.div>

              {/* Floating achievement badges */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="absolute -top-4 -right-4 brutal-card p-3 bg-accent border-foreground shadow-brutal-sm"
              >
                <Trophy className="w-6 h-6 text-accent-foreground" />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-4 -left-4 brutal-card p-3 bg-primary border-foreground shadow-brutal-sm"
              >
                <Brain className="w-6 h-6 text-primary-foreground" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Achievements grid */}
        <div ref={achievementsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-16">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={achievement.label}
                whileHover={{ 
                  y: -8, 
                  scale: 1.05,
                  rotate: index % 2 === 0 ? 3 : -3
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`brutal-card p-4 ${achievement.color} cursor-pointer group`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-background border-2 border-foreground flex items-center justify-center mb-3 group-hover:rotate-12 transition-transform shadow-brutal-sm">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs font-bold uppercase text-primary-foreground leading-tight">
                    {achievement.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
