import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ScribbleProps {
  className?: string;
  color?: string;
  animate?: boolean;
}

// Hand-drawn style scribble paths
const scribblePaths = {
  underline: "M10,20 Q50,10 90,20 Q130,30 170,20 Q210,10 250,20",
  wave: "M0,25 C20,10 40,40 60,25 C80,10 100,40 120,25 C140,10 160,40 180,25",
  circle: "M50,10 C80,0 100,20 100,50 C100,80 80,100 50,100 C20,100 0,80 0,50 C0,20 20,0 50,10",
  arrow: "M10,25 L80,25 M65,10 L80,25 L65,40",
  star: "M25,0 L32,18 L50,18 L36,30 L42,50 L25,38 L8,50 L14,30 L0,18 L18,18 Z",
  zigzag: "M0,20 L20,5 L40,20 L60,5 L80,20 L100,5 L120,20",
  spiral: "M50,50 Q60,30 50,20 Q30,10 20,30 Q10,50 30,60 Q50,70 60,50 Q70,30 50,25",
  squiggle: "M0,30 Q15,10 30,30 Q45,50 60,30 Q75,10 90,30 Q105,50 120,30",
  dots: "M10,25 L12,25 M30,25 L32,25 M50,25 L52,25 M70,25 L72,25 M90,25 L92,25",
  cross: "M0,0 L30,30 M30,0 L0,30",
  heart: "M25,10 C35,0 50,10 25,30 C0,10 15,0 25,10",
  lightning: "M20,0 L10,20 L20,20 L10,40",
  burst: "M25,0 L28,20 L45,5 L32,22 L50,25 L32,28 L45,45 L28,32 L25,50 L22,32 L5,45 L18,28 L0,25 L18,22 L5,5 L22,18 Z",
};

export const Scribble = ({ 
  type, 
  className = "", 
  color = "currentColor",
  size = 100,
  strokeWidth = 2,
  animate = true,
}: { 
  type: keyof typeof scribblePaths;
  className?: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
  animate?: boolean;
}) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (animate && pathRef.current) {
      const path = pathRef.current;
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    }
  }, [animate]);

  return (
    <svg 
      viewBox="0 0 100 50" 
      className={`overflow-visible ${className}`}
      style={{ width: size, height: size / 2 }}
    >
      <motion.path
        ref={pathRef}
        d={scribblePaths[type]}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
        whileInView={animate ? { pathLength: 1, opacity: 1 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </svg>
  );
};

// Doodle elements for decorating sections
export const Doodle = ({ 
  type, 
  className = "", 
  color = "hsl(var(--primary))",
  size = 60,
  animate = true,
}: { 
  type: "star" | "heart" | "lightning" | "burst" | "circle" | "cross";
  className?: string;
  color?: string;
  size?: number;
  animate?: boolean;
}) => {
  const getPath = () => {
    switch (type) {
      case "star":
        return scribblePaths.star;
      case "heart":
        return scribblePaths.heart;
      case "lightning":
        return scribblePaths.lightning;
      case "burst":
        return scribblePaths.burst;
      case "circle":
        return scribblePaths.circle;
      case "cross":
        return scribblePaths.cross;
      default:
        return scribblePaths.star;
    }
  };

  return (
    <motion.svg 
      viewBox="0 0 50 50" 
      className={`overflow-visible ${className}`}
      style={{ width: size, height: size }}
      initial={animate ? { scale: 0, opacity: 0, rotate: -180 } : undefined}
      whileInView={animate ? { scale: 1, opacity: 1, rotate: 0 } : undefined}
      whileHover={{ scale: 1.2, rotate: 15 }}
      viewport={{ once: true }}
      transition={{ type: "spring" as const, stiffness: 200, damping: 15, delay: Math.random() * 0.3 }}
    >
      <motion.path
        d={getPath()}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
};

// Decorative corner scribbles
export const CornerScribble = ({ 
  position = "top-left", 
  color = "hsl(var(--primary) / 0.3)",
  size = 80,
}: { 
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color?: string;
  size?: number;
}) => {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  };

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={`absolute ${positionClasses[position]} pointer-events-none`}
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <path
        d="M0,0 Q50,10 100,0 M0,0 Q10,50 0,100"
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <circle cx="20" cy="20" r="4" fill={color} />
      <circle cx="40" cy="8" r="2" fill={color} />
      <circle cx="8" cy="40" r="2" fill={color} />
    </motion.svg>
  );
};

// Floating doodles that can be scattered around sections
export const FloatingDoodles = ({ 
  className = "",
  colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--foreground) / 0.3)"],
}: { 
  className?: string;
  colors?: string[];
}) => {
  const doodles = [
    { type: "star" as const, x: "10%", y: "20%", size: 30, delay: 0 },
    { type: "heart" as const, x: "85%", y: "15%", size: 25, delay: 0.1 },
    { type: "lightning" as const, x: "15%", y: "70%", size: 35, delay: 0.2 },
    { type: "burst" as const, x: "90%", y: "60%", size: 28, delay: 0.3 },
    { type: "circle" as const, x: "5%", y: "45%", size: 20, delay: 0.15 },
    { type: "cross" as const, x: "95%", y: "35%", size: 22, delay: 0.25 },
  ];

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {doodles.map((doodle, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: doodle.x, top: doodle.y }}
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ 
            delay: doodle.delay + 0.5,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4 + index * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Doodle 
              type={doodle.type} 
              size={doodle.size} 
              color={colors[index % colors.length]}
              animate={false}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

// Hand-drawn underline for text emphasis
export const HandDrawnUnderline = ({ 
  color = "hsl(var(--primary))",
  width = 100,
  className = "",
}: ScribbleProps & { width?: number }) => {
  return (
    <motion.svg
      viewBox="0 0 100 20"
      className={`absolute -bottom-2 left-0 ${className}`}
      style={{ width }}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.path
        d="M5,10 Q25,5 50,12 Q75,18 95,8"
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </motion.svg>
  );
};

export default { Scribble, Doodle, CornerScribble, FloatingDoodles, HandDrawnUnderline };
