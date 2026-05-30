import { useState, useRef, useEffect } from "react";

interface DraggableShapeProps {
  initialX: number;
  initialY: number;
  size: number;
  color: string;
  rotation?: number;
  shape?: "square" | "circle" | "triangle" | "star";
  className?: string;
}

const DraggableShape = ({
  initialX,
  initialY,
  size,
  color,
  rotation = 0,
  shape = "square",
  className = "",
}: DraggableShapeProps) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(rotation);
  const dragRef = useRef<{ startX: number; startY: number; offsetX: number; offsetY: number } | null>(null);
  const shapeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      
      const newX = e.clientX - dragRef.current.offsetX;
      const newY = e.clientY - dragRef.current.offsetY;
      
      setPosition({ x: newX, y: newY });
      setCurrentRotation((prev) => prev + (e.movementX * 0.5));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !dragRef.current) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const newX = touch.clientX - dragRef.current.offsetX;
      const newY = touch.clientY - dragRef.current.offsetY;
      
      setPosition({ x: newX, y: newY });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = shapeRef.current?.getBoundingClientRect();
    if (!rect) return;

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - position.x,
      offsetY: e.clientY - position.y,
    };
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = shapeRef.current?.getBoundingClientRect();
    if (!rect) return;

    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      offsetX: touch.clientX - position.x,
      offsetY: touch.clientY - position.y,
    };
    setIsDragging(true);
  };

  const renderShape = () => {
    const baseStyles = `
      transition-all duration-150
      ${isDragging ? "scale-110 cursor-grabbing" : "cursor-grab"}
      ${isHovered && !isDragging ? "scale-105" : ""}
    `;

    switch (shape) {
      case "circle":
        return (
          <div
            className={`rounded-full border-3 border-foreground ${baseStyles}`}
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              boxShadow: isDragging 
                ? "8px 8px 0px hsl(0 0% 5%)" 
                : "4px 4px 0px hsl(0 0% 5%)",
            }}
          />
        );
      case "triangle":
        return (
          <div
            className={baseStyles}
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size / 2}px solid transparent`,
              borderRight: `${size / 2}px solid transparent`,
              borderBottom: `${size}px solid ${color}`,
              filter: isDragging ? "drop-shadow(6px 6px 0px hsl(0 0% 5%))" : "drop-shadow(3px 3px 0px hsl(0 0% 5%))",
            }}
          />
        );
      case "star":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className={baseStyles}
            style={{
              fill: color,
              stroke: "hsl(0 0% 5%)",
              strokeWidth: 1.5,
              filter: isDragging ? "drop-shadow(6px 6px 0px hsl(0 0% 5%))" : "drop-shadow(3px 3px 0px hsl(0 0% 5%))",
            }}
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        );
      default:
        return (
          <div
            className={`border-3 border-foreground ${baseStyles}`}
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              boxShadow: isDragging 
                ? "8px 8px 0px hsl(0 0% 5%)" 
                : "4px 4px 0px hsl(0 0% 5%)",
            }}
          />
        );
    }
  };

  return (
    <div
      ref={shapeRef}
      className={`absolute select-none touch-none ${className}`}
      style={{
        left: position.x,
        top: position.y,
        transform: `rotate(${currentRotation}deg)`,
        zIndex: isDragging ? 1000 : 10,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
    >
      {renderShape()}
    </div>
  );
};

export default DraggableShape;