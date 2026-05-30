import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { BookOpen, Menu, X, Zap, Sparkles } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "The Problem", href: "/the-problem", icon: Zap },
    { name: "Features", href: "/#features", icon: Sparkles },
    { name: "How It Works", href: "/how-it-works", icon: BookOpen },
  ];

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return location.pathname === href;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 brutal-header bg-card">
      <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-primary border-3 border-foreground flex items-center justify-center shadow-brutal-sm"
          >
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-2xl font-comic text-foreground tracking-wider leading-none">ResearchLab</span>
            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">For Students</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={link.href}
                className={`group px-4 py-2 text-sm font-bold uppercase tracking-wide transition-all border-3 flex items-center gap-2 ${
                  isActive(link.href)
                    ? "bg-primary text-primary-foreground border-foreground shadow-brutal-sm"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-foreground"
                }`}
              >
                <link.icon className="w-4 h-4 group-hover:animate-wiggle" />
                {link.name}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeSwitcher />
          <Link to="/login">
            <Button variant="ghost" size="sm" className="font-bold">
              Log In
            </Button>
          </Link>
          <Link to="/signup">
            <motion.div whileHover={{ scale: 1.05, rotate: 1 }} whileTap={{ scale: 0.95 }}>
              <Button variant="accent" size="sm" className="group">
                <Zap className="w-4 h-4 mr-1 transition-transform group-hover:rotate-12" />
                Get Started
                <Sparkles className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="md:hidden p-2 border-3 border-foreground bg-card shadow-brutal-sm hover:bg-secondary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-foreground" />
          ) : (
            <Menu className="w-5 h-5 text-foreground" />
          )}
        </motion.button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-card border-t-3 border-foreground"
        >
          <div className="container mx-auto px-6 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="px-4 py-3 text-sm font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground hover:bg-secondary border-3 border-transparent hover:border-foreground transition-all flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t-3 border-foreground mt-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full font-bold">
                  Log In
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="accent" className="w-full font-bold">
                  <Zap className="w-4 h-4" />
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
