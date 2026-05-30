import { useState, useCallback, memo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, StickyNote, GripVertical, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Note {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  minimized: boolean;
}

const COLORS = [
  "hsl(45 95% 80%)",   // Yellow
  "hsl(0 85% 85%)",    // Red/Pink
  "hsl(210 100% 85%)", // Blue
  "hsl(145 70% 80%)",  // Green
  "hsl(270 70% 85%)",  // Purple
  "hsl(25 95% 82%)",   // Orange
];

const STORAGE_KEY = "rm_sticky_notes_v1";

function genId() {
  return `note-${Math.random().toString(36).slice(2, 9)}`;
}

const StickyNoteCard = memo(function StickyNoteCard({
  note, onUpdate, onDelete,
}: {
  note: Note;
  onUpdate: (id: string, patch: Partial<Note>) => void;
  onDelete: (id: string) => void;
}) {
  const dragRef = useRef<{ startX: number; startY: number; noteX: number; noteY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("textarea, button")) return;
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, noteX: note.x, noteY: note.y };
    const handleMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      onUpdate(note.id, {
        x: Math.max(0, dragRef.current.noteX + dx),
        y: Math.max(0, dragRef.current.noteY + dy),
      });
    };
    const handleUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  if (note.minimized) {
    return (
      <motion.div
        layout
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="absolute cursor-grab active:cursor-grabbing"
        style={{ left: note.x, top: note.y, zIndex: 40 }}
        onMouseDown={handleMouseDown}
      >
        <div
          className="w-10 h-10 rounded-lg border-2 border-foreground flex items-center justify-center hover:scale-110 transition-transform"
          style={{ backgroundColor: note.color, boxShadow: "2px 2px 0px hsl(var(--foreground))" }}
          onClick={() => onUpdate(note.id, { minimized: false })}
        >
          <StickyNote className="w-4 h-4 text-foreground/60" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
      animate={{ scale: 1, opacity: 1, rotate: Math.random() * 4 - 2 }}
      exit={{ scale: 0.5, opacity: 0 }}
      className="absolute cursor-grab active:cursor-grabbing select-none"
      style={{ left: note.x, top: note.y, zIndex: 40, width: 180 }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="rounded-lg border-2 border-foreground/30 p-3 relative group"
        style={{
          backgroundColor: note.color,
          boxShadow: "3px 3px 0px hsl(var(--foreground) / 0.15)",
        }}
      >
        {/* Handle */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-60 transition-opacity">
          <GripVertical className="w-4 h-4 text-foreground/40" />
        </div>

        {/* Actions */}
        <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onUpdate(note.id, { minimized: true })}
            className="w-5 h-5 rounded flex items-center justify-center hover:bg-foreground/10"
          >
            <Minimize2 className="w-3 h-3 text-foreground/50" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="w-5 h-5 rounded flex items-center justify-center hover:bg-destructive/20"
          >
            <X className="w-3 h-3 text-foreground/50" />
          </button>
        </div>

        {/* Text */}
        <textarea
          value={note.text}
          onChange={e => onUpdate(note.id, { text: e.target.value.slice(0, 500) })}
          placeholder="Quick note..."
          className="w-full bg-transparent resize-none outline-none text-foreground/80 text-sm font-medium mt-3"
          rows={4}
          style={{ fontFamily: "'Outfit', sans-serif" }}
        />
      </div>
    </motion.div>
  );
});

const StickyNotes = memo(function StickyNotes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [showButton, setShowButton] = useState(true);

  // Persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); } catch {}
  }, [notes]);

  const addNote = useCallback(() => {
    const newNote: Note = {
      id: genId(),
      text: "",
      x: 60 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      minimized: false,
    };
    setNotes(prev => [...prev, newNote]);
  }, []);

  const updateNote = useCallback((id: string, patch: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...patch } : n));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <>
      {/* Floating add button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={addNote}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-xl bg-card border-3 border-foreground flex items-center justify-center group"
        style={{ boxShadow: "var(--shadow-brutal-sm)" }}
        title="Add sticky note"
      >
        <StickyNote className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
        <Plus className="absolute -top-1 -right-1 w-4 h-4 text-primary bg-card border border-foreground rounded-full" />
      </motion.button>

      {/* Render notes */}
      <AnimatePresence>
        {notes.map(note => (
          <StickyNoteCard
            key={note.id}
            note={note}
            onUpdate={updateNote}
            onDelete={deleteNote}
          />
        ))}
      </AnimatePresence>
    </>
  );
});

export default StickyNotes;
