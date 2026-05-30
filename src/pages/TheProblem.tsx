import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import DraggableShape from "@/components/interactive/DraggableShape";
import InteractiveComicDots from "@/components/interactive/InteractiveComicDots";
import { FloatingDoodles, CornerScribble, HandDrawnUnderline } from "@/components/interactive/ArtisticScribbles";
import {
  Globe,
  BookX,
  Users,
  TrendingDown,
  AlertTriangle,
  GraduationCap,
  Lightbulb,
  Trophy,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  ArrowRight,
  Heart,
  Sparkles,
  Target,
  BookOpen,
  Rocket,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const globalStats = [
  { icon: Globe, value: "85%", label: "Students Outside US/EU", description: "Have no access to research mentorship" },
  { icon: BookX, value: "2%", label: "Research Exposure", description: "Of high schoolers globally get research experience" },
  { icon: Users, value: "50M+", label: "Bright Minds", description: "Miss opportunities due to geography" },
  { icon: TrendingDown, value: "-67%", label: "Drop-off Rate", description: "Students abandon research due to lack of guidance" },
];

const barriers = [
  {
    icon: DollarSign,
    title: "Financial Barriers",
    description: "Premium research programs cost $5,000-$15,000, making them inaccessible to most families worldwide.",
    stat: "$8,500",
    statLabel: "Average program cost",
  },
  {
    icon: MapPin,
    title: "Geographic Isolation",
    description: "Top research opportunities cluster around elite universities in wealthy nations, leaving billions behind.",
    stat: "92%",
    statLabel: "Programs in US/EU only",
  },
  {
    icon: Building2,
    title: "Institutional Gatekeeping",
    description: "Without connections to professors or fancy school names, talented students can't break into research.",
    stat: "12x",
    statLabel: "Ivy League advantage",
  },
  {
    icon: Clock,
    title: "Time Zone & Language",
    description: "Global students face scheduling nightmares and English-only resources that exclude non-native speakers.",
    stat: "78%",
    statLabel: "Materials English-only",
  },
];

const realStories = [
  {
    quote: "I wanted to participate in ISEF, but my school didn't even know what a science fair was.",
    name: "Priya, 16",
    location: "Mumbai, India",
    color: "bg-primary",
  },
  {
    quote: "The research programs I found cost more than my family's monthly income.",
    name: "Carlos, 17",
    location: "São Paulo, Brazil",
    color: "bg-accent",
  },
  {
    quote: "My ideas are just as good as students in America. I just don't have the same resources.",
    name: "Amara, 15",
    location: "Lagos, Nigeria",
    color: "bg-comic-blue",
  },
];

const competitionGap = [
  { label: "US Students at ISEF", value: "1,800+", sub: "Annual participants" },
  { label: "India Students at ISEF", value: "~50", sub: "Despite 4x population" },
  { label: "Africa Total at ISEF", value: "<100", sub: "Entire continent" },
  { label: "Latin America at ISEF", value: "~200", sub: "All countries combined" },
];

const TheProblem = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const barriersRef = useRef<HTMLDivElement>(null);
  const storiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      // Stats animation
      gsap.fromTo(
        ".stat-card",
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "back.out(1.2)",
          scrollTrigger: { trigger: statsRef.current, start: "top 80%" },
        }
      );

      // Barriers animation
      gsap.fromTo(
        ".barrier-card",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.2,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: barriersRef.current, start: "top 75%" },
        }
      );

      // Stories animation
      gsap.fromTo(
        ".story-card",
        { opacity: 0, y: 30, rotateY: 10 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: storiesRef.current, start: "top 80%" },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      {/* Background Elements */}
      <InteractiveComicDots
        dotColor="hsl(var(--primary) / 0.06)"
        dotSpacing={40}
        minDotSize={1}
        maxDotSize={5}
        hoverRadius={100}
        className="fixed inset-0 z-0"
      />
      <FloatingDoodles className="fixed inset-0 z-5" />
      <CornerScribble position="top-left" size={100} />
      <CornerScribble position="bottom-right" size={120} />

      {/* Draggable Shapes */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <div className="pointer-events-auto">
          <DraggableShape initialX={100} initialY={200} size={50} color="hsl(var(--primary))" shape="star" rotation={15} />
          <DraggableShape initialX={typeof window !== "undefined" ? window.innerWidth - 150 : 700} initialY={350} size={45} color="hsl(var(--accent))" shape="circle" rotation={0} />
          <DraggableShape initialX={200} initialY={600} size={40} color="hsl(var(--comic-blue))" shape="triangle" rotation={-10} />
        </div>
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section ref={heroRef} className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 border-2 border-destructive rounded-full mb-6"
            >
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <span className="font-bold text-destructive uppercase text-sm">The Uncomfortable Truth</span>
            </motion.div>

            <h1 className="font-comic text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
              <span className="block">Research is</span>
              <span className="text-primary relative inline-block">
                NOT
                <HandDrawnUnderline width={150} color="hsl(var(--primary))" className="absolute -bottom-2 left-0" />
              </span>
              <span className="block">for Everyone</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              While some students win Nobel Prizes by 18, millions of equally talented kids can't even find a mentor. 
              <span className="text-foreground font-bold"> The system is broken.</span>
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="brutal-button bg-primary text-primary-foreground text-lg px-8 py-6">
                <Link to="/signup">
                  <Rocket className="w-5 h-5 mr-2" />
                  Join the Revolution
                </Link>
              </Button>
              <Button asChild variant="outline" className="brutal-button text-lg px-8 py-6 border-3 border-foreground">
                <Link to="/#features">
                  <BookOpen className="w-5 h-5 mr-2" />
                  See Our Solution
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Global Stats */}
        <section ref={statsRef} className="py-20 px-6 bg-secondary/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="font-comic text-4xl md:text-5xl text-center mb-4">
              The Numbers Don't Lie
            </h2>
            <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
              Research inequality isn't just unfair—it's a global crisis holding back human progress.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {globalStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -8, scale: 1.03, rotate: i % 2 === 0 ? 1 : -1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="stat-card p-6 border-3 border-foreground bg-card text-center"
                    style={{ boxShadow: "var(--shadow-brutal)" }}
                  >
                    <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 border-2 border-foreground rounded-xl flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="font-comic text-4xl md:text-5xl text-primary mb-1">{stat.value}</div>
                    <div className="font-bold text-foreground mb-2">{stat.label}</div>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Competition Gap */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 border-2 border-accent rounded-full mb-4">
                <Trophy className="w-5 h-5 text-accent" />
                <span className="font-bold text-accent uppercase text-sm">The ISEF Gap</span>
              </div>
              <h2 className="font-comic text-4xl md:text-5xl mb-4">
                Who Gets to <span className="text-primary">Compete?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                ISEF, the "Olympics of Science Fairs," tells the story of global research inequality.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {competitionGap.map((item, i) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.05 }}
                  className="p-5 border-3 border-foreground bg-card text-center"
                  style={{ boxShadow: "var(--shadow-brutal-sm)" }}
                >
                  <div className={`font-comic text-3xl md:text-4xl ${i === 0 ? "text-comic-green" : "text-destructive"} mb-2`}>
                    {item.value}
                  </div>
                  <div className="font-bold text-foreground text-sm mb-1">{item.label}</div>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-destructive/10 border-3 border-destructive rounded-xl text-center">
              <p className="text-lg font-bold text-destructive flex items-center justify-center gap-2">
                <Lightbulb className="w-5 h-5" /> Talent is equally distributed. Opportunity is not.
              </p>
            </div>
          </div>
        </section>

        {/* Barriers */}
        <section ref={barriersRef} className="py-20 px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="font-comic text-4xl md:text-5xl mb-4">
                The <span className="text-destructive">Barriers</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These obstacles prevent millions of talented students from pursuing research.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {barriers.map((barrier, i) => {
                const Icon = barrier.icon;
                return (
                  <motion.div
                    key={barrier.title}
                    whileHover={{ y: -4, x: 4 }}
                    className="barrier-card flex gap-5 p-6 border-3 border-foreground bg-card"
                    style={{ boxShadow: "var(--shadow-brutal)" }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-destructive/10 border-2 border-destructive rounded-xl flex items-center justify-center">
                        <Icon className="w-7 h-7 text-destructive" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-comic text-xl text-foreground mb-2">{barrier.title}</h3>
                      <p className="text-muted-foreground mb-3">{barrier.description}</p>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-destructive/10 rounded-full">
                        <span className="font-bold text-destructive">{barrier.stat}</span>
                        <span className="text-sm text-muted-foreground">{barrier.statLabel}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Real Stories */}
        <section ref={storiesRef} className="py-20 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border-2 border-primary rounded-full mb-4">
                <Heart className="w-5 h-5 text-primary" />
                <span className="font-bold text-primary uppercase text-sm">Real Voices</span>
              </div>
              <h2 className="font-comic text-4xl md:text-5xl mb-4">
                Their Stories Matter
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {realStories.map((story, i) => (
                <motion.div
                  key={story.name}
                  whileHover={{ y: -6, rotate: i % 2 === 0 ? 1 : -1 }}
                  className={`story-card p-6 border-3 border-foreground ${story.color} text-primary-foreground`}
                  style={{ boxShadow: "var(--shadow-brutal)" }}
                >
                  <div className="text-4xl mb-4">"</div>
                  <p className="text-lg font-medium mb-6 italic">{story.quote}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold">{story.name}</div>
                      <div className="text-sm opacity-80 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {story.location}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-primary">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 border-2 border-white rounded-full mb-6">
                <Sparkles className="w-5 h-5 text-white" />
                <span className="font-bold text-white uppercase text-sm">There's Hope</span>
              </div>

              <h2 className="font-comic text-4xl md:text-6xl text-white mb-6">
                We're Changing This.
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                ResearchLab is democratizing research access. AI-powered tools, global community, zero barriers.
                <span className="font-bold"> Because great ideas don't need a ZIP code.</span>
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="brutal-button bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                  <Link to="/signup">
                    <Target className="w-5 h-5 mr-2" />
                    Start Your Research Journey
                  </Link>
                </Button>
                <Button asChild variant="outline" className="brutal-button text-lg px-8 py-6 border-3 border-white text-white hover:bg-white/10">
                  <Link to="/">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Explore Platform
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TheProblem;