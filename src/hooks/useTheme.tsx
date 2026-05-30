import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeColor = "red" | "blue" | "green" | "purple" | "orange" | "pink" | "cyan" | "yellow";
export type ThemeMode = "light" | "dark";

interface ThemeContextType {
  color: ThemeColor;
  mode: ThemeMode;
  setColor: (color: ThemeColor) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const colorClasses: Record<ThemeColor, string> = {
  red: "theme-red",
  blue: "theme-blue",
  green: "theme-green",
  purple: "theme-purple",
  orange: "theme-orange",
  pink: "theme-pink",
  cyan: "theme-cyan",
  yellow: "theme-yellow",
};

export const themeColors: { value: ThemeColor; label: string; preview: string }[] = [
  { value: "red", label: "Crimson", preview: "hsl(0 85% 55%)" },
  { value: "blue", label: "Ocean", preview: "hsl(210 100% 55%)" },
  { value: "green", label: "Forest", preview: "hsl(145 70% 45%)" },
  { value: "purple", label: "Royal", preview: "hsl(270 70% 55%)" },
  { value: "orange", label: "Sunset", preview: "hsl(25 95% 55%)" },
  { value: "pink", label: "Rose", preview: "hsl(330 80% 60%)" },
  { value: "cyan", label: "Arctic", preview: "hsl(185 80% 45%)" },
  { value: "yellow", label: "Golden", preview: "hsl(45 95% 50%)" },
];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [color, setColorState] = useState<ThemeColor>(() => {
    const saved = localStorage.getItem("theme-color");
    return (saved as ThemeColor) || "red";
  });
  
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("theme-mode");
    if (saved) return saved as ThemeMode;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const setColor = (newColor: ThemeColor) => {
    setColorState(newColor);
    localStorage.setItem("theme-color", newColor);
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem("theme-mode", newMode);
  };

  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all color classes
    Object.values(colorClasses).forEach((cls) => {
      root.classList.remove(cls);
    });
    
    // Add current color class
    root.classList.add(colorClasses[color]);
    
    // Handle dark mode
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [color, mode]);

  return (
    <ThemeContext.Provider value={{ color, mode, setColor, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
