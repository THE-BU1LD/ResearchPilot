import { motion } from "framer-motion";
import { memo, useMemo } from "react";

// Speed-focused comic effect components with memoization

interface SpeedLinesProps {
  direction?: "left" | "right" | "up" | "down";
  intensity?: number;
  className?: string;
}

export const SpeedLines = memo(function SpeedLines({
  direction = "right",
  intensity = 5,
  className = "",
}: SpeedLinesProps) {
  const lines = useMemo(() => {
    return Array.from({ length: intensity }).map((_, i) => ({
      id: i,
      offset: Math.random() * 100,
      length: 30 + Math.random() * 70,
      thickness: 1 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.2,
    }));
  }, [intensity]);

  const rotation = {
    left: 180,
    right: 0,
    up: -90,
    down: 90,
  }[direction];

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {lines.map((line) => (
        <motion.div
          key={line.id}
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "200%", opacity: [0, line.opacity, 0] }}
          transition={{
            duration: 0.8 + Math.random() * 0.4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear",
          }}
          className="absolute bg-primary"
          style={{
            top: `${line.offset}%`,
            height: `${line.thickness}px`,
            width: `${line.length}%`,
            opacity: line.opacity,
          }}
        />
      ))}
    </div>
  );
});

interface ActionBurstProps {
  text: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const ActionBurst = memo(function ActionBurst({
  text,
  color = "hsl(var(--primary))",
  size = "md",
  className = "",
}: ActionBurstProps) {
  const sizeClasses = {
    sm: "text-lg px-3 py-1",
    md: "text-2xl px-4 py-2",
    lg: "text-4xl px-6 py-3",
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 15 }}
      className={`inline-block font-comic uppercase tracking-wider ${sizeClasses[size]} ${className}`}
      style={{
        background: color,
        color: "white",
        border: "3px solid hsl(var(--foreground))",
        boxShadow: "var(--shadow-brutal-sm)",
        clipPath:
          "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
      }}
    >
      {text}
    </motion.div>
  );
});

interface ImpactStarProps {
  size?: number;
  color?: string;
  className?: string;
  animate?: boolean;
}

export const ImpactStar = memo(function ImpactStar({
  size = 60,
  color = "hsl(var(--primary))",
  className = "",
  animate = true,
}: ImpactStarProps) {
  const points = useMemo(() => {
    const pts = [];
    const spikes = 12;
    const outerRadius = size / 2;
    const innerRadius = size / 4;

    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (Math.PI * i) / spikes - Math.PI / 2;
      pts.push(`${size / 2 + radius * Math.cos(angle)},${size / 2 + radius * Math.sin(angle)}`);
    }
    return pts.join(" ");
  }, [size]);

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      initial={animate ? { scale: 0, rotate: -180 } : undefined}
      animate={animate ? { scale: 1, rotate: 0 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <polygon
        points={points}
        fill={color}
        stroke="hsl(var(--foreground))"
        strokeWidth="2"
      />
    </motion.svg>
  );
});

interface SpeechBubbleProps {
  children: React.ReactNode;
  variant?: "speech" | "thought" | "shout";
  tailPosition?: "bottom" | "left" | "right";
  className?: string;
}

export const ComicSpeechBubble = memo(function ComicSpeechBubble({
  children,
  variant = "speech",
  tailPosition = "bottom",
  className = "",
}: SpeechBubbleProps) {
  const variantStyles = {
    speech: "bg-card",
    thought: "bg-card rounded-[50%]",
    shout: "bg-primary text-primary-foreground",
  };

  const tailStyles = {
    bottom: "after:bottom-[-16px] after:left-1/2 after:-translate-x-1/2 after:border-t-[18px] after:border-l-[14px] after:border-r-[14px] after:border-l-transparent after:border-r-transparent",
    left: "after:left-[-16px] after:top-1/2 after:-translate-y-1/2 after:border-r-[18px] after:border-t-[14px] after:border-b-[14px] after:border-t-transparent after:border-b-transparent",
    right: "after:right-[-16px] after:top-1/2 after:-translate-y-1/2 after:border-l-[18px] after:border-t-[14px] after:border-b-[14px] after:border-t-transparent after:border-b-transparent",
  };

  return (
    <div
      className={`relative p-4 border-3 border-foreground shadow-brutal ${variantStyles[variant]} ${className}`}
      style={{
        borderRadius: variant === "thought" ? "50%" : undefined,
      }}
    >
      {children}
      {variant === "speech" && (
        <div
          className={`absolute ${tailStyles[tailPosition]} after:content-[''] after:absolute after:border-foreground`}
          style={{
            [tailPosition === "bottom" ? "borderTopColor" : tailPosition === "left" ? "borderRightColor" : "borderLeftColor"]: "hsl(var(--foreground))",
          }}
        />
      )}
    </div>
  );
});

interface HalftoneOverlayProps {
  density?: "sparse" | "medium" | "dense";
  color?: string;
  className?: string;
}

export const HalftoneOverlay = memo(function HalftoneOverlay({
  density = "medium",
  color = "hsl(var(--primary) / 0.1)",
  className = "",
}: HalftoneOverlayProps) {
  const sizes = {
    sparse: "30px 30px",
    medium: "20px 20px",
    dense: "12px 12px",
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle, ${color} 2px, transparent 2px)`,
        backgroundSize: sizes[density],
      }}
    />
  );
});

interface ZigzagDividerProps {
  color?: string;
  height?: number;
  className?: string;
}

export const ZigzagDivider = memo(function ZigzagDivider({
  color = "hsl(var(--foreground))",
  height = 20,
  className = "",
}: ZigzagDividerProps) {
  return (
    <div
      className={`w-full ${className}`}
      style={{
        height: `${height}px`,
        backgroundImage: `linear-gradient(135deg, ${color} 25%, transparent 25%), 
                          linear-gradient(225deg, ${color} 25%, transparent 25%), 
                          linear-gradient(45deg, ${color} 25%, transparent 25%), 
                          linear-gradient(315deg, ${color} 25%, transparent 25%)`,
        backgroundPosition: `${height / 2}px 0, ${height / 2}px 0, 0 0, 0 0`,
        backgroundSize: `${height}px ${height}px`,
        backgroundRepeat: "repeat-x",
      }}
    />
  );
});

interface ComicPanelBorderProps {
  children: React.ReactNode;
  variant?: "standard" | "action" | "dramatic";
  className?: string;
}

export const ComicPanelBorder = memo(function ComicPanelBorder({
  children,
  variant = "standard",
  className = "",
}: ComicPanelBorderProps) {
  const variantStyles = {
    standard: "border-3 border-foreground shadow-brutal",
    action: "border-[4px] border-foreground shadow-brutal-lg",
    dramatic: "border-[5px] border-primary shadow-brutal-primary",
  };

  return (
    <div className={`relative ${variantStyles[variant]} ${className}`}>
      {children}
      {variant === "action" && (
        <>
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-foreground" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-foreground" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-foreground" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-foreground" />
        </>
      )}
    </div>
  );
});

// Animated number counter with comic style
interface ComicCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const ComicCounter = memo(function ComicCounter({
  value,
  duration = 1,
  suffix = "",
  prefix = "",
  className = "",
}: ComicCounterProps) {
  return (
    <motion.span
      className={`font-comic ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span>{prefix}</span>
      <span>{value.toLocaleString()}</span>
      <span>{suffix}</span>
    </motion.span>
  );
});

// Loading spinner with comic style
export const ComicSpinner = memo(function ComicSpinner({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    >
      <div
        className="absolute inset-0 border-3 border-foreground rounded-full"
        style={{
          borderRightColor: "transparent",
          borderBottomColor: "transparent",
        }}
      />
      <motion.div
        className="absolute inset-2 bg-primary rounded-full"
        animate={{ scale: [1, 0.8, 1] }}
        transition={{ duration: 0.4, repeat: Infinity }}
      />
    </motion.div>
  );
});
