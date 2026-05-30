import { Link } from "react-router-dom";
import { BookOpen, Heart, Star, Zap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Doodle } from "@/components/interactive/ArtisticScribbles";

const Footer = () => {
  return (
    <footer className="bg-card border-t-3 border-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-4 left-4 opacity-30 pointer-events-none">
        <Doodle type="star" size={40} color="hsl(var(--primary))" animate={false} />
      </div>
      <div className="absolute top-8 right-8 opacity-30 pointer-events-none">
        <Doodle type="heart" size={30} color="hsl(var(--accent))" animate={false} />
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Top section with CTA */}
        <div className="flex flex-col items-center text-center mb-12 pb-12 border-b-3 border-foreground/20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary border-3 border-foreground shadow-brutal-sm mb-4"
          >
            <Zap className="w-4 h-4 text-primary-foreground" />
            <span className="font-bold uppercase text-primary-foreground text-sm">Ready to Start?</span>
          </motion.div>
          <h3 className="font-comic text-2xl md:text-3xl text-foreground mb-4">
            Join thousands of student researchers
          </h3>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05, x: 4 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground border-3 border-foreground font-bold uppercase shadow-brutal-sm hover:shadow-[2px_2px_0px] transition-all"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo & tagline */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="w-12 h-12 bg-primary border-3 border-foreground flex items-center justify-center shadow-brutal-sm"
              >
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <span className="text-2xl font-comic text-foreground">ResearchLab</span>
            </Link>
            <p className="text-sm text-muted-foreground font-medium">
              Making research accessible to students everywhere.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-comic text-lg text-foreground mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/the-problem" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  The Problem
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-comic text-lg text-foreground mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-accent" />
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="font-comic text-lg text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-comic-blue" />
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t-3 border-foreground/20">
          <p className="text-sm text-muted-foreground flex items-center gap-2 font-medium">
            © 2024 ResearchLab. Made with 
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-accent fill-accent" />
            </motion.span>
            for students
          </p>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-muted border-2 border-foreground/30 text-xs font-bold uppercase">
              50+ Countries
            </span>
            <span className="px-3 py-1 bg-muted border-2 border-foreground/30 text-xs font-bold uppercase">
              10K+ Students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
