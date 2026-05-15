"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { Button } from "@/components/ui/Button";
import { Undo2, Redo2, Maximize2 } from "lucide-react";
import { getCanvas, resetViewport } from "@/lib/canvas";
import { useState } from "react";

export function Toolbar() {
  const { undo, redo, canUndo, canRedo, doExport, isPro } = useEditorStore();
  const [showExport, setShowExport] = useState(false);

  return (
    <header className="flex items-center justify-between h-12 bg-[var(--color-bg-toolbar)] border-b border-[var(--color-border)] px-3 flex-shrink-0 z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-bold text-[15px] tracking-[-0.3px]">
          <div className="w-7 h-7 bg-gradient-to-br from-[var(--color-accent)] to-purple-500 rounded-md flex items-center justify-center text-xs text-white">
            ?
          </div>
          <span className="hidden sm:inline">Ipsumlogo</span>
        </div>
        <div className="w-px h-6 bg-[var(--color-border)]" />
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { undo(); }}
            disabled={!canUndo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { redo(); }}
            disabled={!canRedo()}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 size={16} />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const canvas = getCanvas();
            if (!canvas) return;
            const { artboardWidth, artboardHeight } = useEditorStore.getState().canvas;
            resetViewport(canvas, artboardWidth, artboardHeight);
          }}
          title="Zoom to Fit"
        >
          <Maximize2 size={16} />
        </Button>

        <div className="relative">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowExport(!showExport)}
          >
            Export
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4l3 3 3-3"/></svg>
          </Button>
          {showExport && (
            <div className="absolute right-0 top-full mt-1 bg-[#2a2a2a] border border-[var(--color-border)] rounded-md min-w-[160px] p-1 z-50 shadow-xl">
              {[
                { format: "svg" as const, label: "Download SVG", desc: "Vector (scalable)" },
                { format: "png" as const, label: "Download PNG", desc: "Transparent BG" },
                { format: "jpg" as const, label: "Download JPG", desc: isPro ? "HD 4K" : "1024px" },
              ].map(({ format, label, desc }) => (
                <button
                  key={format}
                  className="w-full text-left px-3 py-2 rounded text-sm text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)] transition-colors flex justify-between items-center"
                  onClick={() => { doExport(format); setShowExport(false); }}
                >
                  <span>{label}</span>
                  <span className="text-[11px] text-[var(--color-text-muted)]">{desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
