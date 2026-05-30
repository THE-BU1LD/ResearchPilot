import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ComicPanelProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "highlight" | "accent" | "dark";
  hover?: boolean;
  rotate?: number;
}

const variantStyles = {
  default: "bg-card",
  highlight: "bg-primary text-primary-foreground",
  accent: "bg-accent text-accent-foreground",
  dark: "bg-foreground text-background",
};

export const ComicPanel = ({
  children,
  className = "",
  variant = "default",
  hover = true,
  rotate = 0,
}: ComicPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -8, x: -4, rotate: rotate + 1 } : undefined}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        border-3 border-foreground p-6 shadow-brutal
        ${variantStyles[variant]}
        ${hover ? "cursor-pointer" : ""}
        ${className}
      `}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </motion.div>
  );
};

// Comic strip layout
export const ComicStrip = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`
        grid grid-cols-1 md:grid-cols-3 gap-4 p-4
        bg-foreground border-4 border-foreground
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Panel with number indicator
export const NumberedPanel = ({
  children,
  number,
  className = "",
}: {
  children: ReactNode;
  number: number;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6, rotate: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative border-3 border-foreground bg-card p-6 shadow-brutal ${className}`}
    >
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        whileInView={{ scale: 1, rotate: -12 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
        className="absolute -top-4 -left-4 w-10 h-10 bg-primary border-3 border-foreground flex items-center justify-center shadow-brutal-sm"
      >
        <span className="font-comic text-lg text-primary-foreground">{number}</span>
      </motion.div>
      {children}
    </motion.div>
  );
};

// Tilted card with decorative corners
export const TiltedCard = ({
  children,
  tilt = "left",
  className = "",
}: {
  children: ReactNode;
  tilt?: "left" | "right";
  className?: string;
}) => {
  const tiltDeg = tilt === "left" ? -2 : 2;

  return (
    <motion.div
      initial={{ opacity: 0, rotate: tiltDeg * 2 }}
      whileInView={{ opacity: 1, rotate: tiltDeg }}
      whileHover={{ rotate: 0, scale: 1.02 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative border-3 border-foreground bg-card p-6 shadow-brutal ${className}`}
    >
      {/* Decorative corner dots */}
      <div className="absolute top-2 left-2 w-2 h-2 bg-primary rounded-full" />
      <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
      <div className="absolute bottom-2 left-2 w-2 h-2 bg-accent rounded-full" />
      <div className="absolute bottom-2 right-2 w-2 h-2 bg-primary rounded-full" />
      {children}
    </motion.div>
  );
};

export default ComicPanel;
