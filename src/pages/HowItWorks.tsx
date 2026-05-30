import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DraggableShape from "@/components/interactive/DraggableShape";
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Lightbulb, 
  Search, 
  FileText, 
  BarChart3, 
  Send,
  Zap
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover",
    subtitle: "Find Your Research Question",
    description: "Our AI helps you explore topics, identify gaps in existing research, and formulate compelling research questions that matter.",
    icon: Lightbulb,
    features: [
      "Topic exploration tools",
      "Gap analysis in literature",
      "Question refinement assistant"
    ],
    color: "bg-red-500"
  },
  {
    number: "02",
    title: "Research",
    subtitle: "Gather & Organize Sources",
    description: "Search academic databases, organize your sources, and let AI summarize key findings from hundreds of papers in seconds.",
    icon: Search,
    features: [
      "Multi-database search",
      "Smart citation manager",
      "AI-powered summaries"
    ],
    color: "bg-yellow-400"
  },
  {
    number: "03",
    title: "Write",
    subtitle: "Draft With AI Assistance",
    description: "Our writing tools help you structure arguments, maintain academic tone, and cite sources correctly as you write.",
    icon: FileText,
    features: [
      "Outline generator",
      "Writing suggestions",
      "Auto-formatting & citations"
    ],
    color: "bg-blue-500"
  },
  {
    number: "04",
    title: "Analyze",
    subtitle: "Process Your Data",
    description: "Upload datasets, run statistical analyses, and generate publication-ready visualizations with our integrated tools.",
    icon: BarChart3,
    features: [
      "Data visualization",
      "Statistical analysis",
      "Chart generator"
    ],
    color: "bg-green-500"
  },
  {
    number: "05",
    title: "Publish",
    subtitle: "Share Your Work",
    description: "Export your research in any format, check for plagiarism, and get feedback before submitting to journals or conferences.",
    icon: Send,
    features: [
      "Multi-format export",
      "Plagiarism checker",
      "Peer review system"
    ],
    color: "bg-purple-500"
  }
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      {/* Floating shapes */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="pointer-events-auto">
          <DraggableShape initialX={100} initialY={200} size={60} color="hsl(var(--primary) / 0.15)" rotation={15} shape="star" />
          <DraggableShape initialX={1100} initialY={300} size={50} color="hsl(var(--accent) / 0.2)" rotation={-20} shape="circle" />
          <DraggableShape initialX={150} initialY={600} size={45} color="hsl(var(--primary) / 0.1)" rotation={30} shape="square" />
          <DraggableShape initialX={1000} initialY={700} size={55} color="hsl(var(--accent) / 0.15)" rotation={-10} shape="triangle" />
        </div>
      </div>

      <main className="pt-28 pb-24 relative z-10">
        {/* Hero */}
        <section className="container mx-auto px-6 mb-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 
              brutal-card bg-accent text-accent-foreground text-sm font-black uppercase 
              rotate-[-2deg] hover:rotate-0 transition-transform cursor-default animate-wiggle">
              <Sparkles className="w-5 h-5 animate-pulse" />
              The Research Journey
              <Zap className="w-5 h-5" />
            </div>

            <h1 className="font-comic text-5xl md:text-7xl uppercase tracking-tight mb-6 leading-tight">
              Five Steps to
              <span className="block text-primary rotate-[-1deg] animate-float">
                Research Excellence!
              </span>
            </h1>

            <p className="text-xl md:text-2xl font-bold max-w-xl mx-auto speech-bubble inline-block px-8 py-4">
              POW! From idea to impact — we guide you through every stage!
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="container mx-auto px-6 space-y-28">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const flip = index % 2 !== 0;

            return (
              <div
                key={step.number}
                className={`md:flex items-center gap-16 ${
                  flip ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Panel */}
                <div className="flex-1 mb-8 md:mb-0">
                  <div
                    className={`brutal-card bg-card p-8 md:p-10 relative 
                    ${flip ? "rotate-[1deg]" : "rotate-[-1deg]"} 
                    hover:rotate-0 transition-all duration-300 group halftone-overlay`}
                  >
                    {/* Step Badge */}
                    <div className={`absolute -top-6 -left-6 
                      ${step.color} text-white brutal-card px-5 py-3 
                      text-2xl font-black rotate-[-8deg] group-hover:rotate-[-3deg] 
                      group-hover:scale-110 transition-all duration-300 z-10`}>
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className={`w-20 h-20 ${step.color} brutal-card 
                      flex items-center justify-center mb-6 rotate-[3deg] 
                      group-hover:rotate-[-3deg] group-hover:scale-110 transition-all duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mt-8">
                      {step.features.map((feature, i) => (
                        <div 
                          key={i} 
                          className="flex gap-3 items-center font-bold text-lg
                            hover:translate-x-2 transition-transform duration-200 cursor-default"
                        >
                          <div className="w-8 h-8 bg-primary brutal-card flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                          </div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <div className={`brutal-card bg-accent/20 p-8 md:p-10 
                    ${flip ? "rotate-[-1deg]" : "rotate-[1deg]"} 
                    hover:rotate-0 transition-all duration-300`}>
                    <h2 className="font-comic text-4xl md:text-5xl uppercase mb-3 text-primary">
                      {step.title}
                    </h2>
                    <p className="text-xl font-black mb-4 uppercase tracking-wide">
                      {step.subtitle}
                    </p>
                    <p className="text-lg font-medium leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 mt-32">
          <div className="brutal-card bg-primary text-primary-foreground 
            p-12 md:p-16 text-center rotate-[-1deg] hover:rotate-0 
            transition-all duration-300 relative overflow-hidden halftone-overlay">
            
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-16 h-16 bg-accent brutal-card rotate-12 opacity-50" />
            <div className="absolute bottom-4 right-4 w-12 h-12 bg-yellow-400 brutal-card -rotate-12 opacity-50" />
            
            <h2 className="font-comic text-4xl md:text-5xl uppercase mb-6 relative z-10">
              Ready to Start Your Journey?
            </h2>
            <p className="mb-10 font-bold text-lg max-w-md mx-auto relative z-10">
              Join thousands of students turning research into a superpower!
            </p>

            <Link to="/signup" className="relative z-10">
              <Button className="brutal-card bg-accent text-accent-foreground 
                px-12 py-7 text-xl font-black uppercase border-3 border-foreground
                hover:translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg transition-all">
                Get Started Free
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
