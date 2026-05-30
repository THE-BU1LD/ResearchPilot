import { useEffect, useRef, useState, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Hyper-interactive sketched background with hand-drawn effects
interface SketchedBackgroundProps {
  className?: string;
  variant?: "dots" | "grid" | "waves" | "crosshatch";
  primaryColor?: string;
  secondaryColor?: string;
  intensity?: number;
  interactive?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  velocity: { x: number; y: number };
  opacity: number;
  type: "star" | "squiggle" | "dot" | "cross";
}

export const SketchedBackground = memo(function SketchedBackground({
  className = "",
  variant = "dots",
  primaryColor = "hsl(var(--primary) / 0.15)",
  secondaryColor = "hsl(var(--foreground) / 0.08)",
  intensity = 1,
  interactive = true,
}: SketchedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const createParticle = useCallback((x: number, y: number): Particle => {
    const types: Particle["type"][] = ["star", "squiggle", "dot", "cross"];
    return {
      id: Date.now() + Math.random(),
      x,
      y,
      size: 4 + Math.random() * 8,
      rotation: Math.random() * 360,
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: -Math.random() * 3 - 1,
      },
      opacity: 1,
      type: types[Math.floor(Math.random() * types.length)],
    };
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add ripple effect
    const rippleId = Date.now();
    setRipples(prev => [...prev, { id: rippleId, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== rippleId)), 600);
    
    // Add particles
    for (let i = 0; i < 5; i++) {
      particlesRef.current.push(createParticle(x + (Math.random() - 0.5) * 30, y + (Math.random() - 0.5) * 30));
    }
  }, [createParticle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
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

    const drawSketchedDot = (x: number, y: number, size: number, isHovered: boolean) => {
      ctx.save();
      ctx.translate(x, y);
      
      // Wobbly hand-drawn effect
      const wobble = isHovered ? 1.5 : 0.5;
      ctx.beginPath();
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const wobbleSize = size + Math.sin(angle * 3 + Date.now() / 200) * wobble;
        const px = Math.cos(angle) * wobbleSize;
        const py = Math.sin(angle) * wobbleSize;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = isHovered ? primaryColor.replace(/[\d.]+\)$/, "0.4)") : primaryColor;
      ctx.fill();
      
      if (isHovered) {
        // Draw sketchy lines radiating out
        ctx.strokeStyle = primaryColor.replace(/[\d.]+\)$/, "0.3)");
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2 + Date.now() / 500;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          const length = size * 3;
          ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
          ctx.stroke();
        }
      }
      
      ctx.restore();
    };

    const drawCrosshatch = (x: number, y: number, size: number, isHovered: boolean) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(isHovered ? Math.sin(Date.now() / 300) * 0.2 : 0);
      
      ctx.strokeStyle = isHovered ? primaryColor : secondaryColor;
      ctx.lineWidth = isHovered ? 2 : 1;
      
      // Draw cross with sketchy effect
      const halfSize = size / 2;
      ctx.beginPath();
      ctx.moveTo(-halfSize + Math.random(), 0);
      ctx.lineTo(halfSize + Math.random(), 0);
      ctx.moveTo(0, -halfSize + Math.random());
      ctx.lineTo(0, halfSize + Math.random());
      ctx.stroke();
      
      ctx.restore();
    };

    const drawParticle = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = primaryColor.replace(/[\d.]+\)$/, "0.6)");
      ctx.strokeStyle = primaryColor.replace(/[\d.]+\)$/, "0.8)");
      ctx.lineWidth = 2;

      switch (p.type) {
        case "star":
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const outerAngle = (i / 5) * Math.PI * 2 - Math.PI / 2;
            const innerAngle = ((i + 0.5) / 5) * Math.PI * 2 - Math.PI / 2;
            const outerR = p.size;
            const innerR = p.size * 0.4;
            if (i === 0) ctx.moveTo(Math.cos(outerAngle) * outerR, Math.sin(outerAngle) * outerR);
            else ctx.lineTo(Math.cos(outerAngle) * outerR, Math.sin(outerAngle) * outerR);
            ctx.lineTo(Math.cos(innerAngle) * innerR, Math.sin(innerAngle) * innerR);
          }
          ctx.closePath();
          ctx.fill();
          break;
        case "squiggle":
          ctx.beginPath();
          ctx.moveTo(-p.size, 0);
          ctx.bezierCurveTo(-p.size/2, -p.size/2, p.size/2, p.size/2, p.size, 0);
          ctx.stroke();
          break;
        case "cross":
          ctx.beginPath();
          ctx.moveTo(-p.size/2, -p.size/2);
          ctx.lineTo(p.size/2, p.size/2);
          ctx.moveTo(p.size/2, -p.size/2);
          ctx.lineTo(-p.size/2, p.size/2);
          ctx.stroke();
          break;
        default:
          ctx.beginPath();
          ctx.arc(0, 0, p.size/2, 0, Math.PI * 2);
          ctx.fill();
      }
      
      ctx.restore();
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      
      const rect = container.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const spacing = 35 / intensity;
      const hoverRadius = 100;

      // Draw background pattern
      for (let x = 0; x < rect.width; x += spacing) {
        for (let y = 0; y < rect.height; y += spacing) {
          const dx = mousePos.current.x - x;
          const dy = mousePos.current.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const isHovered = interactive && distance < hoverRadius;
          const hoverFactor = isHovered ? 1 - (distance / hoverRadius) : 0;
          
          const size = 2 + hoverFactor * 8 * intensity;
          
          if (variant === "dots" || variant === "waves") {
            const waveOffset = variant === "waves" ? Math.sin(x / 50 + Date.now() / 1000) * 3 : 0;
            drawSketchedDot(x, y + waveOffset, size, isHovered);
          } else if (variant === "crosshatch" || variant === "grid") {
            drawCrosshatch(x, y, size * 1.5, isHovered);
          }
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.velocity.x;
        p.y += p.velocity.y;
        p.velocity.y += 0.1; // gravity
        p.opacity -= 0.02;
        p.rotation += 5;
        
        if (p.opacity > 0) {
          drawParticle(p);
          return true;
        }
        return false;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    if (interactive) container.addEventListener("click", handleClick);
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("click", handleClick);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [variant, primaryColor, secondaryColor, intensity, interactive, handleClick]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute w-20 h-20 border-2 border-primary rounded-full pointer-events-none"
            style={{
              left: ripple.x - 40,
              top: ripple.y - 40,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
});

// Enhanced comic dots with ink splatter and wobble
export const HyperInteractiveDots = memo(function HyperInteractiveDots({
  className = "",
  dotColor = "hsl(var(--primary) / 0.2)",
  dotSpacing = 24,
  maxDotSize = 16,
  minDotSize = 3,
  hoverRadius = 140,
}: {
  className?: string;
  dotColor?: string;
  dotSpacing?: number;
  maxDotSize?: number;
  minDotSize?: number;
  hoverRadius?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const mouseVelocity = useRef({ x: 0, y: 0 });
  const prevMousePos = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>();
  const inkSplattersRef = useRef<{ x: number; y: number; size: number; age: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface Dot {
      x: number;
      y: number;
      baseSize: number;
      currentSize: number;
      targetSize: number;
      wobble: number;
      wobblePhase: number;
    }
    
    let dots: Dot[] = [];

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initDots();
    };

    const initDots = () => {
      dots = [];
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
            wobble: 0,
            wobblePhase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const newPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      
      mouseVelocity.current = {
        x: newPos.x - prevMousePos.current.x,
        y: newPos.y - prevMousePos.current.y,
      };
      
      prevMousePos.current = mousePos.current;
      mousePos.current = newPos;

      // Create ink splatters on fast movement
      const speed = Math.sqrt(mouseVelocity.current.x ** 2 + mouseVelocity.current.y ** 2);
      if (speed > 20 && Math.random() > 0.7) {
        inkSplattersRef.current.push({
          x: newPos.x + (Math.random() - 0.5) * 40,
          y: newPos.y + (Math.random() - 0.5) * 40,
          size: 3 + Math.random() * 8,
          age: 0,
        });
      }
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: -1000, y: -1000 };
    };

    const drawWobblyDot = (x: number, y: number, size: number, wobble: number, phase: number) => {
      ctx.beginPath();
      const segments = 12;
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const wobbleAmount = Math.sin(angle * 3 + phase) * wobble;
        const r = size + wobbleAmount;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    };

    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() / 1000;

      // Draw and update dots
      dots.forEach((dot) => {
        const dx = mousePos.current.x - dot.x;
        const dy = mousePos.current.y - dot.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < hoverRadius) {
          const factor = 1 - distance / hoverRadius;
          dot.targetSize = minDotSize + (maxDotSize - minDotSize) * factor * factor;
          dot.wobble = factor * 3;
        } else {
          dot.targetSize = minDotSize;
          dot.wobble *= 0.9;
        }

        // Smooth interpolation
        dot.currentSize += (dot.targetSize - dot.currentSize) * 0.12;
        dot.wobblePhase += 0.1;

        // Draw wobbly dot
        ctx.fillStyle = dotColor;
        drawWobblyDot(
          dot.x + Math.sin(time + dot.x * 0.1) * dot.wobble,
          dot.y + Math.cos(time + dot.y * 0.1) * dot.wobble,
          dot.currentSize,
          dot.wobble,
          dot.wobblePhase
        );
      });

      // Draw ink splatters
      ctx.fillStyle = dotColor.replace(/[\d.]+\)$/, "0.5)");
      inkSplattersRef.current = inkSplattersRef.current.filter(splatter => {
        splatter.age += 0.02;
        if (splatter.age > 1) return false;
        
        const alpha = 1 - splatter.age;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(splatter.x, splatter.y, splatter.size * (1 + splatter.age * 0.5), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        return true;
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
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [dotSpacing, maxDotSize, minDotSize, hoverRadius, dotColor]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
});

export default SketchedBackground;
