"use client";

import { useState } from "react";
import { X, ChevronRight, ChevronLeft, Circle, HelpCircle } from "lucide-react";

const TUTORIAL_KEY = "ipsumlogo_tutorial_done";
const TOTAL_STEPS = 5;

interface Step {
  title: string;
  description: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
}

const steps: Step[] = [
  {
    title: "Welcome to Ipsumlogo!",
    description: "Create beautiful logos with our free drag-and-drop editor. A quick tour in 5 steps.",
    position: { top: "50%", left: "50%" },
  },
  {
    title: "Sidebar Tools",
    description: "Left sidebar: add Text, Shapes, or click the dashed Random button for random shapes.",
    position: { top: "60px", left: "60px" },
  },
  {
    title: "Canvas Controls",
    description: "Scroll to zoom in/out. Hold Alt + drag to pan. Ctrl+Z to undo, Ctrl+Shift+Z to redo. Delete key removes selected object. Click and drag objects to move them.",
    position: { top: "50%", left: "50%" },
  },
  {
    title: "Keyboard Shortcuts",
    description: "Ctrl+Z — Undo\nCtrl+Shift+Z / Ctrl+Y — Redo\nDelete / Backspace — Remove selected\nCtrl+Scroll — Zoom in/out\nAlt+Drag — Pan around\nHold Shift while dragging — Constrain proportions\nCtrl+A — Select all objects",
    position: { top: "50%", left: "50%" },
  },
  {
    title: "Right Panel & Layers",
    description: "Select any object to edit its properties on the right. Manage layers: reorder, hide, lock, or delete. Toggle Gradient for gradient fills. Export as SVG, PNG, or JPG from the top toolbar.",
    position: { top: "80px", right: "20px" },
  },
];

export function TutorialOverlay() {
  const initDone = useState(() => {
    if (typeof window === "undefined") return true;
    return !!localStorage.getItem(TUTORIAL_KEY);
  })[0];
  const [step, setStep] = useState(initDone ? -1 : 0);
  const [done, setDone] = useState(initDone);

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else finish();
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const finish = () => {
    localStorage.setItem(TUTORIAL_KEY, "true");
    setStep(-1);
    setDone(true);
  };

  if (done) {
    return (
      <button
        onClick={() => { setDone(false); setStep(0); }}
        className="fixed bottom-10 left-4 z-40 w-9 h-9 rounded-full bg-[var(--color-bg-toolbar)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] flex items-center justify-center transition-all shadow-lg"
        title="Show tutorial"
      >
        <HelpCircle size={16} />
      </button>
    );
  }

  const s = steps[step];
  if (!s) return null;

  const centered = s.position.top === "50%";

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[90]" onClick={finish} />

      <div
        className="fixed z-[95] w-[340px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-2xl p-4"
        style={{
          top: s.position.top,
          bottom: s.position.bottom,
          left: s.position.left,
          right: s.position.right,
          transform: centered ? "translate(-50%, -50%)" : undefined,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.5px]">
            Step {step + 1} of {TOTAL_STEPS}
          </span>
          <button onClick={finish} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"><X size={14} /></button>
        </div>

        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">{s.title}</h3>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4 whitespace-pre-line">{s.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <Circle key={i} size={8} fill={i === step ? "var(--color-accent)" : "none"}
                className={i === step ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"} />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={prev} className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                <ChevronLeft size={12} /> Back
              </button>
            )}
            <button onClick={next} className="flex items-center gap-1 px-3 py-1 rounded text-xs bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors">
              {step < TOTAL_STEPS - 1 ? <><ChevronRight size={12} /> Next</> : "Got it!"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
