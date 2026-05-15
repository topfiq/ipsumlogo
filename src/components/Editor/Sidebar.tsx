"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { MousePointer2, Type, Square, Circle, Triangle, Minus, Star, Hexagon } from "lucide-react";
import type { ToolType } from "@/types";

const tools: Array<{ type: ToolType; icon: React.ReactNode; label: string; shortcut?: string }> = [
  { type: "select", icon: <MousePointer2 size={18} />, label: "Select", shortcut: "V" },
  { type: "text", icon: <Type size={18} />, label: "Text", shortcut: "T" },
  { type: "rect", icon: <Square size={18} />, label: "Rectangle", shortcut: "R" },
  { type: "circle", icon: <Circle size={18} />, label: "Circle", shortcut: "O" },
  { type: "triangle", icon: <Triangle size={18} />, label: "Triangle" },
  { type: "line", icon: <Minus size={18} />, label: "Line", shortcut: "L" },
  { type: "star", icon: <Star size={18} />, label: "Star" },
  { type: "polygon", icon: <Hexagon size={18} />, label: "Polygon" },
];

export function Sidebar() {
  const { tool, setTool, doInsertShape, doInsertText } = useEditorStore();

  const handleClick = (type: ToolType) => {
    setTool(type);
    if (type === "text") {
      doInsertText();
      setTool("select");
    } else if (type !== "select") {
      doInsertShape(type as "rect" | "circle" | "triangle" | "line" | "star" | "polygon");
      setTool("select");
    }
  };

  return (
    <aside className="w-12 bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border)] flex flex-col items-center py-2 gap-0.5 flex-shrink-0">
      {tools.map(({ type, icon, label, shortcut }) => (
        <button
          key={type}
          className={`relative w-9 h-9 rounded flex items-center justify-center transition-all duration-100 ${
            tool === type
              ? "bg-[var(--color-accent-bg)] text-[var(--color-accent)] sidebar-active"
              : "text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)]"
          }`}
          onClick={() => handleClick(type)}
          title={`${label}${shortcut ? ` (${shortcut})` : ""}`}
        >
          {icon}
          <span className="hidden group-hover:block absolute left-11 bg-[#1a1a1a] text-[var(--color-text-primary)] px-2 py-1 rounded text-[11px] whitespace-nowrap z-50 border border-[var(--color-border)]">
            {label} {shortcut && `(${shortcut})`}
          </span>
        </button>
      ))}

      <div className="w-6 h-px bg-[var(--color-border)] my-1.5" />
    </aside>
  );
}
