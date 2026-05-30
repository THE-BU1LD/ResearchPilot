import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ComicBadgeProps {
  children: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "accent" | "success" | "warning" | "info";
  rotate?: number;
  animate?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary: "bg-primary text-primary-foreground",
  accent: "bg-accent text-accent-foreground",
  success: "bg-comic-green text-comic-green-foreground",
  warning: "bg-destructive text-destructive-foreground",
  info: "bg-comic-blue text-comic-blue-foreground",
};

const sizeStyles = {
  sm: "px-2 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const ComicBadge = ({
  children,
  icon,
  variant = "primary",
  rotate = 0,
  animate = true,
  className = "",
  size = "md",
}: ComicBadgeProps) => {
  return (
    <motion.div
      initial={animate ? { scale: 0.8, opacity: 0, rotate: rotate - 10 } : undefined}
      whileInView={animate ? { scale: 1, opacity: 1, rotate } : undefined}
      whileHover={{ scale: 1.05, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        inline-flex items-center gap-2 
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        border-3 border-foreground shadow-brutal-sm
        font-bold uppercase tracking-wide cursor-pointer
        ${className}
      `}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.div>
  );
};

// Starburst badge for special announcements
export const StarburstBadge = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      whileInView={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.1, rotate: 10 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-24 h-24 text-primary absolute"
        fill="currentColor"
      >
        <polygon points="50,0 61,35 97,35 68,57 79,91 50,70 21,91 32,57 3,35 39,35" />
      </svg>
      <span className="relative z-10 font-comic text-primary-foreground text-sm text-center leading-tight px-2">
        {children}
      </span>
    </motion.div>
  );
};

// Speech bubble component
export const SpeechBubble = ({
  children,
  variant = "default",
  tail = "bottom",
  className = "",
}: {
  children: ReactNode;
  variant?: "default" | "shout" | "thought";
  tail?: "bottom" | "left" | "right";
  className?: string;
}) => {
  const tailPositions = {
    bottom: "after:left-1/2 after:-translate-x-1/2 after:-bottom-4 after:border-l-[12px] after:border-r-[12px] after:border-t-[16px] after:border-l-transparent after:border-r-transparent after:border-t-foreground before:left-1/2 before:-translate-x-1/2 before:-bottom-2 before:border-l-[10px] before:border-r-[10px] before:border-t-[14px] before:border-l-transparent before:border-r-transparent before:border-t-card",
    left: "after:-left-4 after:top-1/2 after:-translate-y-1/2 after:border-t-[12px] after:border-b-[12px] after:border-r-[16px] after:border-t-transparent after:border-b-transparent after:border-r-foreground",
    right: "after:-right-4 after:top-1/2 after:-translate-y-1/2 after:border-t-[12px] after:border-b-[12px] after:border-l-[16px] after:border-t-transparent after:border-b-transparent after:border-l-foreground",
  };

  const variantStyles = {
    default: "bg-card",
    shout: "bg-primary text-primary-foreground",
    thought: "bg-secondary rounded-full",
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        relative border-3 border-foreground p-6 shadow-brutal
        ${variantStyles[variant]}
        ${variant !== "thought" ? `after:absolute after:content-[''] before:absolute before:content-[''] before:z-10 ${tailPositions[tail]}` : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

// Action word explosion (POW, ZAP, BOOM)
export const ActionWord = ({
  word,
  color = "primary",
  size = "md",
  className = "",
}: {
  word: string;
  color?: "primary" | "accent" | "warning";
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const colorStyles = {
    primary: "text-primary",
    accent: "text-accent",
    warning: "text-destructive",
  };

  const sizeStyles = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  };

  return (
    <motion.span
      initial={{ scale: 0, rotate: -20 }}
      whileInView={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.2, rotate: 5 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={`
        font-comic ${sizeStyles[size]} ${colorStyles[color]}
        drop-shadow-[3px_3px_0px_hsl(var(--foreground))]
        cursor-pointer select-none
        ${className}
      `}
    >
      {word}
    </motion.span>
  );
};

export default ComicBadge;
