import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ComicSkeletonProps {
  className?: string;
  variant?: "card" | "text" | "circle" | "stat" | "chart";
  count?: number;
}

function SkeletonPulse({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      className={cn(
        "bg-muted border-2 border-foreground/10 relative overflow-hidden",
        className
      )}
      style={style}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

export function ComicSkeleton({ className, variant = "card", count = 1 }: ComicSkeletonProps) {
  const items = Array.from({ length: count });

  if (variant === "text") {
    return (
      <div className={cn("space-y-3", className)}>
        {items.map((_, i) => (
          <SkeletonPulse
            key={i}
            className="h-4 rounded"
            style={{ width: `${70 + Math.random() * 30}%` } as any}
          />
        ))}
      </div>
    );
  }

  if (variant === "circle") {
    return (
      <div className={cn("flex gap-3", className)}>
        {items.map((_, i) => (
          <SkeletonPulse key={i} className="w-12 h-12 rounded-full" />
        ))}
      </div>
    );
  }

  if (variant === "stat") {
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
        {items.map((_, i) => (
          <div key={i} className="p-4 border-3 border-foreground/10 bg-card">
            <SkeletonPulse className="w-10 h-10 rounded-lg mb-3" />
            <SkeletonPulse className="h-8 w-16 rounded mb-1" />
            <SkeletonPulse className="h-3 w-24 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div className={cn("p-6 border-3 border-foreground/10 bg-card", className)}>
        <SkeletonPulse className="h-5 w-32 rounded mb-4" />
        <div className="flex items-end gap-2 h-32">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonPulse
              key={i}
              className="flex-1 rounded-t"
              style={{ height: `${30 + Math.random() * 70}%` } as any}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((_, i) => (
        <div key={i} className="p-5 border-3 border-foreground/10 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <SkeletonPulse className="w-12 h-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <SkeletonPulse className="h-5 w-3/4 rounded" />
              <SkeletonPulse className="h-3 w-1/2 rounded" />
            </div>
          </div>
          <SkeletonPulse className="h-4 w-full rounded mb-2" />
          <SkeletonPulse className="h-4 w-5/6 rounded" />
        </div>
      ))}
    </div>
  );
}
