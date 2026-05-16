"use client";

import { useEffect, useRef } from "react";
import { initCanvas, createArtboard, zoomToFit } from "@/lib/canvas";
import { useEditorStore } from "@/store/useEditorStore";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialized = useRef(false);
  const {
    setCanvasReady, pushHistory, refreshLayers, updateSelected, handleKeyDown,
    canvas: canvasState,
  } = useEditorStore();

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const el = canvasRef.current;
    if (!el) return;

    const parent = el.parentElement!;
    const width = parent.clientWidth;
    const height = parent.clientHeight;

    const canvas = initCanvas(el, { width, height });
    createArtboard(canvas, canvasState.artboardWidth, canvasState.artboardHeight);

    canvas.on("selection:created", () => { updateSelected(); refreshLayers(); });
    canvas.on("selection:updated", () => { updateSelected(); refreshLayers(); });
    canvas.on("selection:cleared", () => { updateSelected(); refreshLayers(); });
    canvas.on("object:modified", () => { pushHistory(); updateSelected(); refreshLayers(); });
    canvas.on("object:added", () => { refreshLayers(); });
    canvas.on("object:removed", () => { refreshLayers(); });
    canvas.on("text:editing:entered", () => { /* editing started */ });
    canvas.on("text:editing:exited", () => {
      setTimeout(() => { pushHistory(); updateSelected(); refreshLayers(); }, 50);
    });

    setTimeout(() => {
      zoomToFit(canvas, canvasState.artboardWidth, canvasState.artboardHeight);
      pushHistory();
      refreshLayers();
      updateSelected();
      setCanvasReady(true);
    }, 250);

    const onResize = () => {
      const p = el.parentElement!;
      canvas.setWidth(p.clientWidth);
      canvas.setHeight(p.clientHeight);
      canvas.requestRenderAll();
    };

    const onKey = (e: KeyboardEvent) => handleKeyDown(e);

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex-1 relative overflow-hidden" style={{ background: canvasState.showGrid ? undefined : "var(--color-bg-canvas)" }}>
      {canvasState.showGrid && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
            backgroundPosition: "0 0",
          }}
        />
      )}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </main>
  );
}
