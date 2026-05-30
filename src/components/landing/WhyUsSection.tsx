import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Globe,
  AlertTriangle,
  Users,
  BookX,
  Sparkles,
  Heart,
  Target,
  TrendingUp,
  School,
  Award,
} from "lucide-react";
import InteractiveComicDots from "@/components/interactive/InteractiveComicDots";
import { FloatingDoodles, HandDrawnUnderline, CornerScribble } from "@/components/interactive/ArtisticScribbles";
import DraggableShape from "@/components/interactive/DraggableShape";

gsap.registerPlugin(ScrollTrigger);

const problems = [
  {
    icon: Globe,
    stat: "85%",
    label: "of countries",
    description: "lack structured research programs for high school students",
    color: "bg-primary",
  },
  {
    icon: BookX,
    stat: "3%",
    label: "of students",
    description: "outside the US have access to research mentorship",
    color: "bg-accent",
  },
  {
    icon: School,
    stat: "92%",
    label: "of schools",
    description: "don't teach research methodology before college",
    color: "bg-comic-blue",
  },
  {
    icon: AlertTriangle,
    stat: "$5,000+",
    label: "average cost",
    description: "of research programs that do exist internationally",
    color: "bg-primary",
  },
];

const solutions = [
  {
    icon: Target,
    title: "Guided Process",
    description: "Step-by-step methodology that works for any field",
  },
  {
    icon: Users,
    title: "Peer Community",
    description: "Connect with student researchers worldwide",
  },
  {
    icon: Award,
    title: "Competition Ready",
    description: "Produce ISEF-quality work from anywhere",
  },
  {
    icon: TrendingUp,
    title: "Real Impact",
    description: "Publish in actual journals, not just classroom walls",
  },
];

const WhyUsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const problemsRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header
      gsap.fromTo(
        headerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate problem cards
      const problemCards = problemsRef.current?.children;
      if (problemCards) {
        gsap.fromTo(
          problemCards,
          { y: 60, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: problemsRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Animate solutions
      const solutionCards = solutionsRef.current?.children;
      if (solutionCards) {
        gsap.fromTo(
          solutionCards,
          { x: -40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: solutionsRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Animate quote
      gsap.fromTo(
        quoteRef.current,
        { y: 30, opacity: 0, rotateZ: -2 },
        {
          y: 0,
          opacity: 1,
          rotateZ: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-us"
      className="py-24 bg-background relative overflow-hidden"
    >
      {/* Background */}
      <InteractiveComicDots
        dotColor="hsl(var(--primary) / 0.08)"
        dotSpacing={32}
        minDotSize={1}
        maxDotSize={8}
        hoverRadius={140}
        className="z-0"
      />

      <FloatingDoodles className="z-5" />
      <CornerScribble position="top-left" size={100} />
      <CornerScribble position="bottom-right" size={120} />

      {/* Decorative shapes */}
      <div className="absolute inset-0 pointer-events-none z-5">
        <div className="pointer-events-auto">
          <DraggableShape
            shape="star"
            initialX={60}
            initialY={150}
            size={45}
            color="hsl(var(--primary))"
            rotation={15}
          />
          <DraggableShape
            shape="circle"
            initialX={typeof window !== "undefined" ? window.innerWidth - 100 : 800}
            initialY={200}
            size={35}
            color="hsl(var(--accent))"
            rotation={0}
          />
          <DraggableShape
            shape="triangle"
            initialX={100}
            initialY={600}
            size={40}
            color="hsl(var(--comic-blue))"
            rotation={-10}
          />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive border-3 border-foreground shadow-brutal-sm mb-6 rotate-[-1deg] hover:rotate-0 transition-transform cursor-pointer">
            <AlertTriangle className="w-4 h-4 text-destructive-foreground" />
            <span className="font-bold uppercase text-destructive-foreground text-sm">
              The Problem We're Solving
            </span>
          </div>
          <h2 className="font-comic text-4xl md:text-6xl text-foreground mb-4 relative inline-block">
            Why ResearchLab?
            <HandDrawnUnderline width={280} className="left-1/2 -translate-x-1/2" />
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
            Research shouldn't be a privilege reserved for students at elite schools.
            We're democratizing the research experience.
          </p>
        </div>

        {/* The Problem Grid */}
        <div ref={problemsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={problem.label}
                whileHover={{ y: -8, scale: 1.02, rotate: index % 2 === 0 ? 1 : -1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="brutal-card p-6 bg-card text-center group cursor-pointer"
              >
                <div
                  className={`w-16 h-16 ${problem.color} border-3 border-foreground mx-auto mb-4 flex items-center justify-center shadow-brutal-sm group-hover:rotate-6 transition-transform`}
                >
                  <Icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="font-comic text-4xl text-foreground mb-1">
                  {problem.stat}
                </div>
                <div className="text-sm font-bold uppercase text-muted-foreground mb-2">
                  {problem.label}
                </div>
                <p className="text-sm text-foreground font-medium">
                  {problem.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Quote */}
        <div
          ref={quoteRef}
          className="max-w-3xl mx-auto mb-20"
        >
          <div className="brutal-card p-8 md:p-12 bg-primary relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-accent border-3 border-foreground flex items-center justify-center shadow-brutal-sm rotate-12">
              <span className="font-comic text-2xl text-accent-foreground">"</span>
            </div>
            <blockquote className="font-comic text-2xl md:text-3xl text-primary-foreground text-center leading-relaxed">
              It's unfair that some kids get to participate in ISEF while others
              struggle to find competitions besides a classroom activity.
            </blockquote>
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-background border-3 border-foreground">
                <Heart className="w-4 h-4 text-primary" />
                <span className="font-bold text-foreground">Our Core Belief</span>
              </div>
            </div>
          </div>
        </div>

        {/* Our Solution */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-comic-green border-3 border-foreground shadow-brutal-sm mb-4 rotate-[1deg] hover:rotate-0 transition-transform cursor-pointer">
            <Sparkles className="w-4 h-4 text-comic-green-foreground" />
            <span className="font-bold uppercase text-comic-green-foreground text-sm">
              Our Solution
            </span>
          </div>
          <h3 className="font-comic text-3xl md:text-4xl text-foreground">
            Making Research Accessible to Everyone
          </h3>
        </div>

        <div ref={solutionsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <motion.div
                key={solution.title}
                whileHover={{ y: -6, x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="p-6 bg-card border-3 border-foreground group cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                style={{ boxShadow: "var(--shadow-brutal-sm)" }}
              >
                <div className="w-12 h-12 bg-background border-2 border-foreground flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                  <Icon className="w-6 h-6 text-primary group-hover:text-primary" />
                </div>
                <h4 className="font-comic text-xl mb-2 group-hover:text-primary-foreground">
                  {solution.title}
                </h4>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-primary-foreground/80">
                  {solution.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground mb-4 font-medium">
            Join the movement to democratize research for students everywhere.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted border-2 border-foreground">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-bold">50+ Countries</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted border-2 border-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm font-bold">10K+ Students</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted border-2 border-foreground">
              <Award className="w-4 h-4" />
              <span className="text-sm font-bold">500+ Publications</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;