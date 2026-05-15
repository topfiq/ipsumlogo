"use client";

import { useEditorStore } from "@/store/useEditorStore";

export function StatusBar() {
  const { canvas: canvasState, layers } = useEditorStore();

  return (
    <footer className="flex items-center justify-between h-7 bg-[var(--color-bg-toolbar)] border-t border-[var(--color-border)] px-3 flex-shrink-0 text-[11px] text-[var(--color-text-muted)]">
      <div className="flex items-center gap-4">
        <span>Artboard {canvasState.artboardWidth}×{canvasState.artboardHeight}</span>
        <span>Objects: {layers.length}</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Grid: {canvasState.showGrid ? "On" : "Off"}</span>
      </div>
    </footer>
  );
}
