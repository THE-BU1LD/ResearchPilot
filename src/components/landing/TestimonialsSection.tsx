import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  Quote, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  Trophy,
  Sparkles,
  FlaskConical,
  Monitor,
  Microscope,
  TestTube,
  BarChart3
} from "lucide-react";
import InteractiveComicDots from "@/components/interactive/InteractiveComicDots";
import { CornerScribble, HandDrawnUnderline } from "@/components/interactive/ArtisticScribbles";
import DraggableShape from "@/components/interactive/DraggableShape";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    quote: "ResearchLab helped me go from zero research experience to presenting at my regional science fair in just 3 months!",
    name: "Maya Chen",
    location: "Toronto, Canada",
    age: 16,
    achievement: "Regional Science Fair Winner",
    avatarIcon: "scientist",
    color: "bg-primary",
  },
  {
    id: 2,
    quote: "The literature review tool saved me 50+ hours. I found papers I never would have discovered on my own.",
    name: "Aditya Sharma",
    location: "Mumbai, India",
    age: 17,
    achievement: "Published in Youth Journal",
    avatarIcon: "developer",
    color: "bg-accent",
  },
  {
    id: 3,
    quote: "Finally, a platform that treats high school researchers seriously. The data analysis tools are better than what my college friends use!",
    name: "Sofia Rodriguez",
    location: "Mexico City, Mexico",
    age: 15,
    achievement: "ISEF Qualifier",
    avatarIcon: "researcher",
    color: "bg-comic-blue",
  },
  {
    id: 4,
    quote: "As someone from a small town with no research mentors, this platform became my virtual lab partner.",
    name: "Ethan Williams",
    location: "Rural Ohio, USA",
    age: 16,
    achievement: "State Competition Finalist",
    avatarIcon: "lab",
    color: "bg-primary",
  },
  {
    id: 5,
    quote: "The step-by-step guidance made complex methodologies actually understandable. I went from confused to confident!",
    name: "Zara Ahmed",
    location: "Karachi, Pakistan",
    age: 17,
    achievement: "Research Club Founder",
    avatarIcon: "chart",
    color: "bg-comic-green",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-header",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const navigate = (dir: number) => {
    setDirection(dir);
    setCurrentIndex((prev) => {
      if (dir === 1) return (prev + 1) % testimonials.length;
      return prev === 0 ? testimonials.length - 1 : prev - 1;
    });
  };

  const current = testimonials[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 15 : -15,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      rotateY: direction < 0 ? 15 : -15,
    }),
  };

  return (
    <section ref={sectionRef} className="py-20 bg-muted/30 border-y-3 border-foreground relative overflow-hidden">
      {/* Background */}
      <InteractiveComicDots
        dotColor="hsl(var(--primary) / 0.08)"
        dotSpacing={30}
        minDotSize={1}
        maxDotSize={6}
        hoverRadius={100}
        className="z-0"
      />
      <CornerScribble position="top-left" size={80} />
      <CornerScribble position="bottom-right" size={100} />

      {/* Shapes */}
      <div className="absolute inset-0 pointer-events-none z-5">
        <div className="pointer-events-auto">
          <DraggableShape initialX={60} initialY={100} size={35} color="hsl(var(--primary))" shape="star" rotation={20} />
          <DraggableShape initialX={typeof window !== "undefined" ? window.innerWidth - 100 : 700} initialY={200} size={30} color="hsl(var(--accent))" shape="triangle" rotation={-15} />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="testimonial-header text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary border-3 border-foreground shadow-brutal-sm mb-6 rotate-[-2deg] hover:rotate-0 transition-transform cursor-pointer">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
            <span className="font-bold uppercase text-primary-foreground text-sm">Success Stories</span>
          </div>
          <h2 className="font-comic text-4xl md:text-5xl text-foreground mb-4 relative inline-block">
            Researchers Love Us!
            <HandDrawnUnderline width={280} className="left-1/2 -translate-x-1/2" />
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Join thousands of students transforming their research journey
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[320px] flex items-center">
            {/* Navigation */}
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 z-20 w-12 h-12 bg-card border-3 border-foreground flex items-center justify-center hover:bg-muted transition-colors shadow-brutal-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Card */}
            <div className="flex-1 px-16">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`${current.color} border-3 border-foreground p-8 md:p-10 relative`}
                  style={{ boxShadow: "var(--shadow-brutal-lg)" }}
                >
                  {/* Quote icon */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-background border-3 border-foreground flex items-center justify-center rotate-12">
                    <Quote className="w-6 h-6 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="text-primary-foreground">
                    <p className="text-xl md:text-2xl font-medium mb-6 italic leading-relaxed">
                      "{current.quote}"
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-background border-2 border-foreground flex items-center justify-center">
                        {current.avatarIcon === "scientist" && <FlaskConical className="w-8 h-8 text-primary" />}
                        {current.avatarIcon === "developer" && <Monitor className="w-8 h-8 text-primary" />}
                        {current.avatarIcon === "researcher" && <Microscope className="w-8 h-8 text-primary" />}
                        {current.avatarIcon === "lab" && <TestTube className="w-8 h-8 text-primary" />}
                        {current.avatarIcon === "chart" && <BarChart3 className="w-8 h-8 text-primary" />}
                      </div>
                      <div>
                        <div className="font-comic text-xl">{current.name}</div>
                        <div className="flex items-center gap-2 text-sm opacity-90">
                          <MapPin className="w-4 h-4" />
                          {current.location} • Age {current.age}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Trophy className="w-4 h-4" />
                          <span className="text-sm font-bold">{current.achievement}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="absolute -bottom-3 -right-3 flex gap-1 p-2 bg-background border-2 border-foreground">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={() => navigate(1)}
              className="absolute right-0 z-20 w-12 h-12 bg-card border-3 border-foreground flex items-center justify-center hover:bg-muted transition-colors shadow-brutal-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className={`w-3 h-3 border-2 border-foreground transition-all ${
                  i === currentIndex ? "bg-primary scale-125" : "bg-muted hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
        >
          {[
            { value: "10K+", label: "Active Researchers", icon: "🔬" },
            { value: "150+", label: "Countries", icon: "🌍" },
            { value: "4.9★", label: "Average Rating", icon: "⭐" },
            { value: "85%", label: "Complete Projects", icon: "🎯" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4, scale: 1.03, rotate: i % 2 === 0 ? 1 : -1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="p-4 bg-card border-3 border-foreground text-center cursor-pointer group"
              style={{ boxShadow: "var(--shadow-brutal-sm)" }}
            >
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform inline-block">{stat.icon}</div>
              <div className="font-comic text-3xl text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-bold uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;