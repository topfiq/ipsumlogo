"use client";

import { useState } from "react";
import { X, ChevronRight, ChevronLeft, Circle, HelpCircle } from "lucide-react";

const TUTORIAL_KEY = "ipsumlogo_tutorial_done";
const TOTAL_STEPS = 5;

interface Step {
  title: string;
  description: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  highlight?: string;
}

const steps: Step[] = [
  {
    title: "Welcome to Ipsumlogo!",
    description: "Create beautiful logos with our free drag-and-drop editor. Let's take a quick tour.",
    position: { top: "50%", left: "50%", right: "auto", bottom: "auto" },
  },
  {
    title: "Toolbar & Tools",
    description: "Use the left sidebar to add shapes, text, or generate random shapes. The top toolbar has Undo, Redo, and Export.",
    position: { top: "60px", left: "60px" },
    highlight: ".sidebar-highlight",
  },
  {
    title: "Canvas & Artboard",
    description: "Drag to pan (Alt+Click), scroll to zoom. The white artboard is your logo canvas.",
    position: { top: "40%", left: "50%" },
    highlight: ".canvas-highlight",
  },
  {
    title: "Property & Layers",
    description: "Select any element to edit its properties on the right panel. Manage layers — reorder, hide, lock, or delete.",
    position: { top: "80px", right: "20px" },
    highlight: ".right-panel-highlight",
  },
  {
    title: "Admin Library",
    description: "Visit /pintubelakang to manage custom shapes, change settings, and configure your admin profile.",
    position: { top: "50%", left: "50%", right: "auto", bottom: "auto" },
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

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-[90]" onClick={finish} />

      {/* Tooltip */}
      <div
        className="fixed z-[95] w-[320px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-2xl p-4"
        style={{
          top: s.position.top,
          bottom: s.position.bottom,
          left: s.position.left,
          right: s.position.right,
          transform: s.position.top === "50%" ? "translate(-50%, -50%)" : undefined,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.5px]">
            Step {step + 1} of {TOTAL_STEPS}
          </span>
          <button onClick={finish} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
            <X size={14} />
          </button>
        </div>

        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1.5">{s.title}</h3>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">{s.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <Circle
                key={i}
                size={8}
                fill={i === step ? "var(--color-accent)" : "none"}
                className={i === step ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={prev}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <ChevronLeft size={12} /> Back
              </button>
            )}
            <button
              onClick={next}
              className="flex items-center gap-1 px-3 py-1 rounded text-xs bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              {step < TOTAL_STEPS - 1 ? (
                <>Next <ChevronRight size={12} /></>
              ) : (
                "Finish"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
