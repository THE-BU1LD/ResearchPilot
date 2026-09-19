import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Compass,
  DollarSign,
  Languages,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import InteractiveComicDots from "@/components/interactive/InteractiveComicDots";
import { CornerScribble, HandDrawnUnderline } from "@/components/interactive/ArtisticScribbles";

const barriers = [
  {
    icon: Compass,
    title: "Finding a tractable question",
    description:
      "A broad interest is not yet a research problem. Students need help narrowing scope, defining evidence, and choosing a question that can actually be tested.",
  },
  {
    icon: BookOpen,
    title: "Working from sources instead of summaries",
    description:
      "Search results and generated prose are not substitutes for reading evidence. A useful workflow keeps sources, citations, uncertainty, and claim boundaries visible.",
  },
  {
    icon: Users,
    title: "Getting useful feedback",
    description:
      "A project improves when someone can inspect the question, method, data, and reasoning. Access to that kind of review is uneven, so the handoff has to be understandable on its own.",
  },
  {
    icon: ShieldCheck,
    title: "Knowing what the result does not prove",
    description:
      "Clean charts and polished writing can still hide weak controls, leakage, post-hoc choices, or overclaiming. Research tooling should make those failure modes harder to ignore.",
  },
];

const accessConstraints = [
  {
    icon: DollarSign,
    title: "Cost",
    description:
      "Mentoring, software, compute, data access, and competition travel can all create practical barriers. Research Muse should not invent a universal cost statistic to make that point.",
  },
  {
    icon: MapPin,
    title: "Location",
    description:
      "Local schools and communities differ in labs, mentors, clubs, and research infrastructure. The product is designed to make the workflow portable, not to claim geography no longer matters.",
  },
  {
    icon: Languages,
    title: "Language and context",
    description:
      "Research guidance is often written for one academic context. Clear explanations and explicit assumptions help, but the platform should not claim to remove cultural or language barriers by itself.",
  },
];

const TheProblem = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      <InteractiveComicDots
        dotColor="hsl(var(--primary) / 0.06)"
        dotSpacing={40}
        minDotSize={1}
        maxDotSize={5}
        hoverRadius={100}
        className="fixed inset-0 z-0"
      />
      <CornerScribble position="top-left" size={100} />
      <CornerScribble position="bottom-right" size={120} />

      <main className="relative z-10">
        <section className="pt-32 pb-16 px-6">
          <div className="container mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border-2 border-primary rounded-full mb-6">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="font-bold text-primary uppercase text-sm">The problem, without invented statistics</span>
            </div>

            <h1 className="font-comic text-5xl md:text-7xl mb-6 leading-tight">
              Research support should make
              <span className="text-primary relative inline-block ml-3">
                evidence easier to inspect
                <HandDrawnUnderline
                  width={360}
                  color="hsl(var(--primary))"
                  className="absolute -bottom-2 left-0"
                />
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Research Muse is built around a simple product hypothesis: students benefit from a
              workspace that keeps questions, sources, methods, analysis, limitations, and writing
              connected. That hypothesis should be evaluated with real user evidence—not marketing
              numbers the repository cannot substantiate.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="brutal-button bg-primary text-primary-foreground text-lg px-8 py-6">
                <Link to="/signup">
                  Start a Project
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="brutal-button text-lg px-8 py-6 border-3 border-foreground">
                <Link to="/how-it-works">See the Workflow</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-secondary/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="font-comic text-4xl md:text-5xl mb-4">Where research projects actually get stuck</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                These are workflow problems the product can address directly. They are stated
                qualitatively until retained evidence supports stronger claims.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {barriers.map((barrier, index) => {
                const Icon = barrier.icon;
                return (
                  <motion.div
                    key={barrier.title}
                    whileHover={{ y: -4, rotate: index % 2 === 0 ? 0.5 : -0.5 }}
                    className="p-6 border-3 border-foreground bg-card"
                    style={{ boxShadow: "var(--shadow-brutal)" }}
                  >
                    <div className="w-14 h-14 bg-primary/10 border-2 border-foreground rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-comic text-2xl mb-2">{barrier.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{barrier.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="font-comic text-4xl md:text-5xl mb-4">Access still has real constraints</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Software can reduce friction. It should not pretend to erase constraints it cannot
                measure or control.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {accessConstraints.map((constraint) => {
                const Icon = constraint.icon;
                return (
                  <div
                    key={constraint.title}
                    className="p-6 border-3 border-foreground bg-card"
                    style={{ boxShadow: "var(--shadow-brutal-sm)" }}
                  >
                    <Icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-comic text-xl mb-2">{constraint.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{constraint.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-primary">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-comic text-4xl md:text-6xl text-white mb-6">
              The product claim should stay testable.
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Research Muse can organize a workflow, expose assumptions, and make evidence easier
              to hand off. Whether that improves real student outcomes is something the project
              should measure with observed pilots—not assume in advance.
            </p>
            <Button asChild className="brutal-button bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
              <Link to="/how-it-works">
                Inspect the Workflow
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TheProblem;
