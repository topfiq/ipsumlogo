"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { getLibrary } from "@/lib/library";
import { getTemplates } from "@/lib/templates";
import type { LibraryShape, LogoTemplate } from "@/types";
import { useMemo, useState } from "react";
import { getCanvas } from "@/lib/canvas";
import { loadSVGFromString, Group, type FabricObject } from "fabric";
import { HexColorPicker } from "react-colorful";
import { Slider } from "@/components/ui/Slider";

export function LeftPanel() {
  const { doInsertShape, doInsertText, doInsertLibraryShape } = useEditorStore();
  const libraryShapes = useMemo(() => getLibrary(), []);
  const templates = useMemo(() => getTemplates(), []);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgOpacity, setBgOpacity] = useState(1);
  const [showBgPicker, setShowBgPicker] = useState(false);

  const handleBgChange = (color: string) => {
    setBgColor(color);
    const canvas = getCanvas();
    if (!canvas) return;
    const objects = canvas.getObjects();
    const artboard = objects.find((o: FabricObject) => (o as FabricObject & { name?: string }).name === "__artboard__");
    if (artboard) { artboard.set("fill", color); artboard.set("opacity", bgOpacity); canvas.requestRenderAll(); }
  };

  const handleBgOpacity = (v: number) => {
    setBgOpacity(v);
    const canvas = getCanvas();
    if (!canvas) return;
    const objects = canvas.getObjects();
    const artboard = objects.find((o: FabricObject) => (o as FabricObject & { name?: string }).name === "__artboard__");
    if (artboard) { artboard.set("opacity", v); canvas.requestRenderAll(); }
  };

  const handleLoadTemplate = (tmpl: LogoTemplate) => {
    const canvas = getCanvas();
    if (!canvas) return;
    loadSVGFromString(tmpl.state).then(({ objects }) => {
      const filtered = objects.filter(Boolean) as FabricObject[];
      const group = new Group(filtered, { left: 200, top: 150 });
      canvas.add(group);
      canvas.setActiveObject(group);
      canvas.requestRenderAll();
      useEditorStore.getState().pushHistory();
      useEditorStore.getState().refreshLayers();
      useEditorStore.getState().updateSelected();
    });
  };

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
        <div className="grid grid-cols-3 gap-1.5 max-h-[300px] overflow-y-auto">
          {libraryShapes.map((shape: LibraryShape) => (
            <button
              key={shape.id}
              className="aspect-square rounded border border-[var(--color-border)] bg-white/3 flex items-center justify-center text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] transition-all p-1"
              onClick={() => doInsertLibraryShape(shape.svgContent)}
              title={shape.name}
            >
              <div className="w-6 h-6 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: shape.svgContent }} />
            </button>
          ))}
        </div>
      </div>

      {/* Logo Templates */}
      <div className="p-3 border-b border-[var(--color-border)]">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2.5">
          Logo Templates
          <span className="font-normal text-[var(--color-text-muted)] normal-case ml-1">({templates.length})</span>
        </h3>
        <div className="flex flex-col gap-1 max-h-[200px] overflow-y-auto">
          {templates.map((tmpl) => (
            <button
              key={tmpl.id}
              className="px-2.5 py-1.5 rounded text-xs text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)] border border-transparent hover:border-[var(--color-border)] transition-all text-left flex items-center gap-2"
              onClick={() => handleLoadTemplate(tmpl)}
              title={tmpl.name}
            >
              <div className="w-8 h-6 bg-white rounded flex items-center justify-center shrink-0 overflow-hidden" dangerouslySetInnerHTML={{ __html: tmpl.preview }} />
              <span className="truncate">{tmpl.name}</span>
            </button>
          ))}
          {templates.length === 0 && (
            <p className="text-xs text-[var(--color-text-muted)] py-2 text-center">No templates yet</p>
          )}
        </div>
      </div>

      {/* Background */}
      <div className="p-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2.5">Background</h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded border border-[var(--color-border)] shrink-0 cursor-pointer" style={{ background: bgColor, opacity: bgOpacity }} onClick={() => setShowBgPicker(!showBgPicker)} />
          <input
            className="h-7 bg-white/5 border border-[var(--color-border)] rounded text-[var(--color-text-primary)] text-xs px-2 outline-none focus:border-[var(--color-accent)] transition-colors flex-1"
            value={bgColor}
            onChange={(e) => handleBgChange(e.target.value)}
          />
        </div>
        {showBgPicker && (
          <div className="mb-2 relative" style={{ zIndex: 30 }}>
            <div className="fixed inset-0 z-20" onClick={() => setShowBgPicker(false)} />
            <div style={{ position: "relative", zIndex: 31 }}>
              <HexColorPicker color={bgColor} onChange={handleBgChange} />
            </div>
          </div>
        )}
        <Slider value={bgOpacity} onChange={handleBgOpacity} label="Opacity" />
      </div>
    </aside>
  );
}
