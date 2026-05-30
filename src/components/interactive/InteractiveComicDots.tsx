import { useEffect, useRef, useState } from "react";

interface Dot {
  x: number;
  y: number;
  baseSize: number;
  currentSize: number;
  targetSize: number;
}

interface InteractiveComicDotsProps {
  className?: string;
  dotColor?: string;
  dotSpacing?: number;
  maxDotSize?: number;
  minDotSize?: number;
  hoverRadius?: number;
}

const InteractiveComicDots = ({
  className = "",
  dotColor = "hsl(var(--primary) / 0.2)",
  dotSpacing = 24,
  maxDotSize = 12,
  minDotSize = 3,
  hoverRadius = 120,
}: InteractiveComicDotsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>();
  const dotsRef = useRef<Dot[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initDots();
    };

    const initDots = () => {
      const dots: Dot[] = [];
      const cols = Math.ceil(canvas.width / dotSpacing);
      const rows = Math.ceil(canvas.height / dotSpacing);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          dots.push({
            x: col * dotSpacing + dotSpacing / 2,
            y: row * dotSpacing + dotSpacing / 2,
            baseSize: minDotSize,
            currentSize: minDotSize,
            targetSize: minDotSize,
          });
        }
      }
      dotsRef.current = dots;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: -1000, y: -1000 };
    };

    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dotsRef.current.forEach((dot) => {
        const dx = mousePos.current.x - dot.x;
        const dy = mousePos.current.y - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < hoverRadius) {
          const factor = 1 - distance / hoverRadius;
          dot.targetSize = minDotSize + (maxDotSize - minDotSize) * factor * factor;
        } else {
          dot.targetSize = minDotSize;
        }

        // Smooth interpolation
        dot.currentSize += (dot.targetSize - dot.currentSize) * 0.15;

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.currentSize, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dotSpacing, maxDotSize, minDotSize, hoverRadius, dotColor]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default InteractiveComicDots;
