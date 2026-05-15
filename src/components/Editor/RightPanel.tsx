"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { FONT_LIST, BLEND_MODES } from "@/lib/constants";
import { getCanvas } from "@/lib/canvas";
import { HexColorPicker } from "react-colorful";
import { Gradient } from "fabric";
import { useState, useEffect } from "react";
import {
  Eye, EyeOff, Lock, Unlock, Trash2, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, PaintBucket
} from "lucide-react";

const STROKE_STYLES = [
  { label: "Solid", value: "[]" },
  { label: "Dashed", value: "[8,4]" },
  { label: "Dotted", value: "[2,4]" },
  { label: "Dash-Dot", value: "[12,4,2,4]" },
];

export function RightPanel() {
  const {
    selectedProps, layers,
    updateTransform, updateShape, updateText, updateBlendMode,
    toggleLayerVisibility, toggleLayerLock, deleteLayer, selectLayer,
  } = useEditorStore();
  const { transform, shape, text, blendMode } = selectedProps;
  const [showFillPicker, setShowFillPicker] = useState(false);
  const [showStrokePicker, setShowStrokePicker] = useState(false);
  const [gradientOn, setGradientOn] = useState(false);
  const [gradientColor1, setGradientColor1] = useState("#6366f1");
  const [gradientColor2, setGradientColor2] = useState("#8b5cf6");
  const [gradientAngle, setGradientAngle] = useState(0);
  const [showGradPicker1, setShowGradPicker1] = useState(false);
  const [showGradPicker2, setShowGradPicker2] = useState(false);

  const hasSelection = !!transform;

  const applyGradient = () => {
    if (!gradientOn) return;
    const canvas = getCanvas();
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (!obj) return;
    const angleRad = (gradientAngle * Math.PI) / 180;
    const halfW = Math.abs(Math.cos(angleRad)) / 2;
    const halfH = Math.abs(Math.sin(angleRad)) / 2;
    const fill = new Gradient({
      type: "linear",
      gradientUnits: "percentage",
      coords: { x1: 0.5 - halfW, y1: 0.5 - halfH, x2: 0.5 + halfW, y2: 0.5 + halfH },
      colorStops: [
        { offset: 0, color: gradientColor1 },
        { offset: 1, color: gradientColor2 },
      ],
    });
    obj.set("fill", fill);
    obj.setCoords();
    canvas.requestRenderAll();
    useEditorStore.getState().pushHistory();
    useEditorStore.getState().updateSelected();
  };

  useEffect(() => {
    if (gradientOn) applyGradient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradientColor1, gradientColor2, gradientAngle, gradientOn]);

  return (
    <aside className="w-[260px] bg-[var(--color-bg-right)] border-l border-[var(--color-border)] flex flex-col flex-shrink-0 overflow-y-auto text-[#e0e0e0]">
      {/* Transform */}
      <div className="p-3 border-b border-[var(--color-border)]">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2">Transform</h3>
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-xs text-[var(--color-text-secondary)] w-3">X</span>
          <Input value={transform?.x ?? ""} onChange={(e) => updateTransform({ x: Number(e.target.value) })} className="w-0 flex-1" disabled={!hasSelection} />
          <span className="text-xs text-[var(--color-text-secondary)] w-3">Y</span>
          <Input value={transform?.y ?? ""} onChange={(e) => updateTransform({ y: Number(e.target.value) })} className="w-0 flex-1" disabled={!hasSelection} />
        </div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-xs text-[var(--color-text-secondary)] w-3">W</span>
          <Input value={transform?.width ?? ""} onChange={(e) => updateTransform({ width: Number(e.target.value) })} className="w-0 flex-1" disabled={!hasSelection} />
          <span className="text-xs text-[var(--color-text-secondary)] w-3">H</span>
          <Input value={transform?.height ?? ""} onChange={(e) => updateTransform({ height: Number(e.target.value) })} className="w-0 flex-1" disabled={!hasSelection} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[var(--color-text-secondary)] w-8">Rot</span>
          <Input value={transform?.rotation ?? ""} onChange={(e) => updateTransform({ rotation: Number(e.target.value) })} className="w-16" disabled={!hasSelection} />
          <span className="text-[11px] text-[var(--color-text-muted)]">deg</span>
        </div>
      </div>

      {/* Fill / Color */}
      {(shape || text) && (
        <div className="p-3 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)]">Fill</h3>
            <button className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${gradientOn ? "bg-[var(--color-accent-bg)] border-[var(--color-accent)] text-[var(--color-accent)]" : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]"}`}
              onClick={() => setGradientOn(!gradientOn)}>
              <PaintBucket size={11} className="inline mr-1" /> Gradient
            </button>
          </div>

          {!gradientOn && (
            <>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded border border-[var(--color-border)] shrink-0 cursor-pointer" style={{ background: (shape?.fill || text?.fill || "#6366f1") }} onClick={() => setShowFillPicker(!showFillPicker)} />
                <Input value={(shape?.fill || text?.fill || "#6366f1") as string} onChange={(e) => shape ? updateShape({ fill: e.target.value }) : updateText({ fill: e.target.value })} className="flex-1" />
              </div>
              {showFillPicker && (
                <div className="mb-2 relative" style={{ zIndex: 30 }}>
                  <div className="fixed inset-0 z-20" onClick={() => setShowFillPicker(false)} />
                  <div style={{ position: "relative", zIndex: 31 }}>
                    <HexColorPicker color={(shape?.fill || text?.fill || "#6366f1") as string} onChange={(c) => shape ? updateShape({ fill: c }) : updateText({ fill: c })} />
                  </div>
                </div>
              )}
            </>
          )}

          {gradientOn && (
            <div className="flex flex-col gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded border border-[var(--color-border)] shrink-0 cursor-pointer" style={{ background: gradientColor1 }} onClick={() => { setShowGradPicker1(!showGradPicker1); setShowGradPicker2(false); }} />
                <span className="text-[11px] text-[var(--color-text-muted)]">→</span>
                <div className="w-7 h-7 rounded border border-[var(--color-border)] shrink-0 cursor-pointer" style={{ background: gradientColor2 }} onClick={() => { setShowGradPicker2(!showGradPicker2); setShowGradPicker1(false); }} />
                <div className="flex-1 h-7 rounded border border-[var(--color-border)]" style={{ background: `linear-gradient(${gradientAngle}deg, ${gradientColor1}, ${gradientColor2})` }} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[var(--color-text-muted)] w-8">Angle</span>
                <Input type="number" value={gradientAngle} onChange={(e) => setGradientAngle(Number(e.target.value))} className="w-14" />
                <span className="text-[11px] text-[var(--color-text-muted)]">deg</span>
              </div>
              {showGradPicker1 && (
                <div className="relative" style={{ zIndex: 30 }}>
                  <div className="fixed inset-0 z-20" onClick={() => setShowGradPicker1(false)} />
                  <div style={{ position: "relative", zIndex: 31 }}><HexColorPicker color={gradientColor1} onChange={setGradientColor1} /></div>
                </div>
              )}
              {showGradPicker2 && (
                <div className="relative" style={{ zIndex: 30 }}>
                  <div className="fixed inset-0 z-20" onClick={() => setShowGradPicker2(false)} />
                  <div style={{ position: "relative", zIndex: 31 }}><HexColorPicker color={gradientColor2} onChange={setGradientColor2} /></div>
                </div>
              )}
              <Button variant="outline" size="sm" className="w-full" onClick={applyGradient}><PaintBucket size={12} /> Apply Gradient</Button>
            </div>
          )}

          <Slider value={(shape?.opacity ?? text?.opacity ?? 1)} onChange={(v) => shape ? updateShape({ opacity: v }) : updateText({ opacity: v })} label="Opacity" />
        </div>
      )}

      {/* Stroke */}
      {shape && (
        <div className="p-3 border-b border-[var(--color-border)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2">Stroke</h3>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded border border-dashed border-[var(--color-border)] shrink-0 cursor-pointer" style={{ background: shape.stroke || "transparent" }} onClick={() => setShowStrokePicker(!showStrokePicker)} />
            <Input value={shape.stroke || ""} onChange={(e) => updateShape({ stroke: e.target.value })} className="flex-1" placeholder="—" />
          </div>
          {showStrokePicker && (
            <div className="mb-2 relative" style={{ zIndex: 30 }}>
              <div className="fixed inset-0 z-20" onClick={() => setShowStrokePicker(false)} />
              <div style={{ position: "relative", zIndex: 31 }}><HexColorPicker color={shape.stroke || "#000000"} onChange={(c) => updateShape({ stroke: c })} /></div>
            </div>
          )}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-xs text-[var(--color-text-secondary)] w-8">Width</span>
            <Input value={shape.strokeWidth} onChange={(e) => updateShape({ strokeWidth: Number(e.target.value) })} className="w-16" />
            <span className="text-[11px] text-[var(--color-text-muted)]">px</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[var(--color-text-secondary)] w-8">Style</span>
            <Select
              className="w-full h-7 text-xs bg-white/10 text-[var(--color-text-primary)]"
              value={JSON.stringify(shape.strokeDashArray)}
              onChange={(e) => { const v = e.target.value; updateShape({ strokeDashArray: v ? JSON.parse(v) : null }); }}
            >
              {STROKE_STYLES.map((s) => (
                <option key={s.value} value={s.value} className="bg-[#333] text-[#e0e0e0]">{s.label}</option>
              ))}
            </Select>
          </div>
        </div>
      )}

      {/* Corner Radius */}
      {shape && (
        <div className="p-3 border-b border-[var(--color-border)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2">Corner Radius</h3>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[var(--color-text-secondary)] w-10">Radius</span>
            <Input value={shape.cornerRadius} onChange={(e) => updateShape({ cornerRadius: Number(e.target.value) })} className="w-16" />
            <span className="text-[11px] text-[var(--color-text-muted)]">px</span>
          </div>
        </div>
      )}

      {/* Typography */}
      {text && (
        <div className="p-3 border-b border-[var(--color-border)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2">Typography</h3>
          <div className="flex flex-col gap-1.5">
            <Select value={text.fontFamily} onChange={(e) => updateText({ fontFamily: e.target.value })} className="w-full h-7 text-xs bg-white/10 text-[var(--color-text-primary)]">
              {FONT_LIST.map((f) => (<option key={f.family} value={f.family} className="bg-[#333] text-[#e0e0e0]">{f.family}</option>))}
            </Select>
            <div className="flex gap-1">
              <Input value={text.fontWeight} onChange={(e) => updateText({ fontWeight: e.target.value })} className="flex-1" placeholder="700" />
              <Input value={text.fontSize} onChange={(e) => updateText({ fontSize: Number(e.target.value) })} className="flex-1" placeholder="48" />
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant={text.fontWeight === "bold" ? "primary" : "outline"} onClick={() => updateText({ fontWeight: text.fontWeight === "bold" ? "normal" : "bold" })}><Bold size={14} /></Button>
              <Button size="icon" variant={text.fontStyle === "italic" ? "primary" : "outline"} onClick={() => updateText({ fontStyle: text.fontStyle === "italic" ? "normal" : "italic" })}><Italic size={14} /></Button>
              <Button size="icon" variant={text.underline ? "primary" : "outline"} onClick={() => updateText({ underline: !text.underline })}><Underline size={14} /></Button>
              <div className="flex-1" />
              <Button size="icon" variant={text.textAlign === "left" ? "primary" : "outline"} onClick={() => updateText({ textAlign: "left" })}><AlignLeft size={14} /></Button>
              <Button size="icon" variant={text.textAlign === "center" ? "primary" : "outline"} onClick={() => updateText({ textAlign: "center" })}><AlignCenter size={14} /></Button>
              <Button size="icon" variant={text.textAlign === "right" ? "primary" : "outline"} onClick={() => updateText({ textAlign: "right" })}><AlignRight size={14} /></Button>
            </div>
          </div>
        </div>
      )}

      {/* Blend Mode */}
      {hasSelection && (
        <div className="p-3 border-b border-[var(--color-border)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2">Blend</h3>
          <Select value={blendMode} onChange={(e) => updateBlendMode(e.target.value as typeof blendMode)} className="w-full h-7 text-xs bg-white/10 text-[var(--color-text-primary)]">
            {BLEND_MODES.map((m) => (<option key={m.value} value={m.value} className="bg-[#333] text-[#e0e0e0]">{m.label}</option>))}
          </Select>
        </div>
      )}

      {/* Layers */}
      <div className="p-3 flex-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2">Layers <span className="font-normal normal-case text-[var(--color-text-muted)] ml-1">({layers.length})</span></h3>
        <div className="flex flex-col gap-0.5">
          {layers.map((layer) => (
            <div key={layer.id} className={`flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer text-xs transition-all group border border-transparent ${useEditorStore.getState().selectedObject === layer.object ? "bg-[var(--color-accent-bg)] text-[var(--color-text-primary)] border-[var(--color-accent)]" : "text-[var(--color-text-secondary)] hover:bg-white/5"}`} onClick={() => selectLayer(layer.id)}>
              <div className="w-4 h-4 opacity-50 shrink-0 flex items-center justify-center">{layer.type === "text" ? "T" : layer.type === "circle" ? "●" : layer.type === "triangle" ? "▲" : layer.type === "line" ? "/" : layer.type === "star" ? "★" : "■"}</div>
              <span className="flex-1 truncate">{layer.name}</span>
              <div className="hidden group-hover:flex gap-0.5 items-center">
                <button className="w-5 h-5 rounded flex items-center justify-center text-[var(--color-text-muted)] hover:bg-white/10 hover:text-[var(--color-text-primary)] text-[10px]" onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id); }}>{layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}</button>
                <button className="w-5 h-5 rounded flex items-center justify-center text-[var(--color-text-muted)] hover:bg-white/10 hover:text-[var(--color-text-primary)] text-[10px]" onClick={(e) => { e.stopPropagation(); toggleLayerLock(layer.id); }}>{layer.locked ? <Lock size={12} /> : <Unlock size={12} />}</button>
                <button className="w-5 h-5 rounded flex items-center justify-center text-[var(--color-text-muted)] hover:bg-white/10 hover:text-[var(--color-danger)] text-[10px]" onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }}><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {layers.length === 0 && <p className="text-xs text-[var(--color-text-muted)] text-center py-4">No objects yet</p>}
        </div>
      </div>
    </aside>
  );
}
