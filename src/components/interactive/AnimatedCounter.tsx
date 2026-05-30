import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  delay?: number;
}

export const AnimatedCounter = ({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  className = "",
  delay = 0,
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      let start = 0;
      const end = value;
      const stepDuration = (duration * 1000) / end;
      
      const counter = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) {
          clearInterval(counter);
        }
      }, Math.max(stepDuration, 10));

      return () => clearInterval(counter);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, value, duration, delay]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}K`;
    }
    return num.toString();
  };

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : undefined}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay }}
      className={`font-comic ${className}`}
    >
      {prefix}
      {formatNumber(count)}
      {suffix}
    </motion.span>
  );
};

// Stat display with animated counter
export const AnimatedStat = ({
  value,
  label,
  suffix = "",
  prefix = "",
  icon,
  delay = 0,
  className = "",
}: {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  icon?: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay }}
      className={`
        border-3 border-foreground bg-card p-6 text-center shadow-brutal
        cursor-pointer group
        ${className}
      `}
    >
      {icon && (
        <div className="w-12 h-12 mx-auto mb-3 bg-primary border-2 border-foreground flex items-center justify-center group-hover:rotate-12 transition-transform">
          {icon}
        </div>
      )}
      <AnimatedCounter
        value={value}
        suffix={suffix}
        prefix={prefix}
        delay={delay}
        className="text-4xl md:text-5xl text-foreground block"
      />
      <span className="text-sm font-bold uppercase text-muted-foreground mt-2 block">
        {label}
      </span>
    </motion.div>
  );
};

export default AnimatedCounter;
