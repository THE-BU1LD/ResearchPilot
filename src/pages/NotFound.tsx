import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import DraggableShape from "@/components/interactive/DraggableShape";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden comic-dots">
      {/* Draggable shapes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="pointer-events-auto">
          <DraggableShape initialX={100} initialY={100} size={50} color="hsl(var(--primary))" shape="star" rotation={15} />
          <DraggableShape initialX={typeof window !== "undefined" ? window.innerWidth - 150 : 700} initialY={200} size={40} color="hsl(var(--accent))" shape="triangle" rotation={-10} />
          <DraggableShape initialX={200} initialY={typeof window !== "undefined" ? window.innerHeight - 150 : 500} size={45} color="hsl(var(--primary))" shape="square" rotation={20} />
        </div>
      </div>

      <div className="text-center relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
          className="inline-block mb-6"
        >
          <div className="w-32 h-32 bg-primary border-3 border-foreground flex items-center justify-center mx-auto shadow-brutal rotate-3">
            <span className="font-comic text-6xl text-primary-foreground">404</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 border-2 border-destructive/30 mb-4">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-sm font-bold text-destructive uppercase">Page Not Found</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-comic text-4xl md:text-5xl text-foreground mb-4"
        >
          Oops! Wrong Turn!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-muted-foreground mb-8 max-w-md mx-auto"
        >
          The page <code className="px-2 py-1 bg-muted border border-foreground/20 text-sm font-mono">{location.pathname}</code> doesn't exist.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link to="/">
            <Button className="brutal-button bg-primary text-primary-foreground">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="border-2 border-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-sm text-muted-foreground flex items-center justify-center gap-2"
        >
          <Search className="w-3 h-3" />
          Try dragging the shapes while you're here!
        </motion.p>
      </div>
    </div>
  );
};

export default NotFound;
