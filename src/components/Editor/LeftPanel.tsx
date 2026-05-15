"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { getLibrary } from "@/lib/library";
import type { LibraryShape } from "@/types";
import { useMemo } from "react";

export function LeftPanel() {
  const { doInsertShape, doInsertText, doInsertLibraryShape } = useEditorStore();
  const libraryShapes = useMemo(() => getLibrary().slice(0, 9), []);

  return (
    <aside className="w-[240px] bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border)] flex flex-col flex-shrink-0 overflow-y-auto">
      {/* Elements */}
      <div className="p-3 border-b border-[var(--color-border)]">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2.5">Elements</h3>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            className="aspect-square rounded border border-[var(--color-border)] bg-white/3 flex items-center justify-center text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] transition-all"
            onClick={doInsertText}
            title="Add Text"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><text x="3" y="20" fontSize="18" fontFamily="serif" fill="currentColor" stroke="none">T</text></svg>
          </button>
          <button
            className="aspect-square rounded border border-[var(--color-border)] bg-white/3 flex items-center justify-center text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] transition-all"
            onClick={() => doInsertShape("rect")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
          </button>
          <button
            className="aspect-square rounded border border-[var(--color-border)] bg-white/3 flex items-center justify-center text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] transition-all"
            onClick={() => doInsertShape("circle")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><circle cx="12" cy="12" r="8"/></svg>
          </button>
          <button
            className="aspect-square rounded border border-[var(--color-border)] bg-white/3 flex items-center justify-center text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] transition-all"
            onClick={() => doInsertShape("triangle")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><polygon points="12,4 20,18 4,18"/></svg>
          </button>
          <button
            className="aspect-square rounded border border-[var(--color-border)] bg-white/3 flex items-center justify-center text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] transition-all"
            onClick={() => doInsertShape("line")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><line x1="4" y1="20" x2="20" y2="4"/></svg>
          </button>
          <button
            className="aspect-square rounded border border-[var(--color-border)] bg-white/3 flex items-center justify-center text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] transition-all"
            onClick={() => doInsertShape("star")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><polygon points="12,2 15,9 23,9 17,14 19,22 12,17 5,22 7,14 1,9 9,9"/></svg>
          </button>
        </div>
      </div>

      {/* Library Shapes */}
      <div className="p-3 border-b border-[var(--color-border)]">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2.5">
          Library Shapes
          <span className="font-normal text-[var(--color-text-muted)] normal-case ml-1">({libraryShapes.length})</span>
        </h3>
        <div className="grid grid-cols-3 gap-1">
          {libraryShapes.map((shape: LibraryShape) => (
            <button
              key={shape.id}
              className="aspect-square rounded border border-[var(--color-border)] bg-white/3 flex items-center justify-center text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] transition-all"
              onClick={() => doInsertLibraryShape(shape.svgContent)}
              title={shape.name}
            >
              <div className="w-[22px] h-[22px]" dangerouslySetInnerHTML={{ __html: shape.svgContent }} />
            </button>
          ))}
        </div>
      </div>

      {/* Background */}
      <div className="p-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2.5">Background</h3>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded border border-[var(--color-border)] bg-white shrink-0" />
          <span className="text-xs text-[var(--color-text-secondary)]">#FFFFFF</span>
        </div>
      </div>
    </aside>
  );
}
