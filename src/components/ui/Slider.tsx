interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  label?: string;
}

export function Slider({ value, min = 0, max = 1, step = 0.01, onChange, label }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex items-center gap-2 w-full">
      {label && <span className="text-xs text-[var(--color-text-secondary)] w-14 flex-shrink-0">{label}</span>}
      <div
        className="relative flex-1 h-1 bg-[var(--color-border)] rounded-full cursor-pointer"
        onPointerDown={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const updateFromEvent = (ev: PointerEvent) => {
            const p = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
            onChange(Math.round((p * (max - min) + min) / step) * step);
          };
          updateFromEvent(e.nativeEvent);
          const onMove = (ev: PointerEvent) => updateFromEvent(ev);
          const onUp = () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
          window.addEventListener("pointermove", onMove);
          window.addEventListener("pointerup", onUp);
        }}
      >
        <div
          className="h-full bg-[var(--color-accent)] rounded-full"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md"
          style={{ left: `${pct}%`, marginLeft: "-6px" }}
        />
      </div>
      <span className="text-xs text-[var(--color-text-muted)] w-10 text-right">{Math.round(value * 100)}%</span>
    </div>
  );
}
