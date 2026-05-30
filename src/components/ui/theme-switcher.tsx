import { Moon, Sun, Palette, Check } from "lucide-react";
import { useTheme, themeColors, ThemeColor } from "@/hooks/useTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeSwitcher() {
  const { color, mode, setColor, toggleMode } = useTheme();

  return (
    <div className="flex items-center gap-2">
      {/* Dark Mode Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleMode}
        className="relative w-10 h-10 border-2 border-foreground overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {mode === "light" ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Color Picker */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative w-10 h-10 border-2 border-foreground"
          >
            <Palette className="h-5 w-5" />
            <span
              className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-foreground"
              style={{ backgroundColor: themeColors.find(c => c.value === color)?.preview }}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 brutal-card">
          <DropdownMenuLabel className="font-comic text-lg">Choose Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="grid grid-cols-4 gap-2 p-2">
            {themeColors.map((themeColor) => (
              <button
                key={themeColor.value}
                onClick={() => setColor(themeColor.value)}
                className="relative w-10 h-10 rounded-lg border-2 border-foreground transition-transform hover:scale-110 flex items-center justify-center"
                style={{ backgroundColor: themeColor.preview }}
                title={themeColor.label}
              >
                {color === themeColor.value && (
                  <Check className="w-5 h-5 text-white drop-shadow-lg" />
                )}
              </button>
            ))}
          </div>
          <DropdownMenuSeparator />
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            Current: <span className="font-bold capitalize">{themeColors.find(c => c.value === color)?.label}</span>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
