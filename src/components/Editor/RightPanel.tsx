"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { FONT_LIST, BLEND_MODES } from "@/lib/constants";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import {
  Eye, EyeOff, Lock, Unlock, Trash2, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline
} from "lucide-react";

export function RightPanel() {
  const {
    selectedProps, layers,
    updateTransform, updateShape, updateText, updateBlendMode,
    toggleLayerVisibility, toggleLayerLock, deleteLayer, selectLayer,
  } = useEditorStore();
  const { transform, shape, text, blendMode } = selectedProps;
  const [showFillPicker, setShowFillPicker] = useState(false);
  const [showStrokePicker, setShowStrokePicker] = useState(false);

  const hasSelection = !!transform;

  return (
    <aside className="w-[260px] bg-[var(--color-bg-right)] border-l border-[var(--color-border)] flex flex-col flex-shrink-0 overflow-y-auto">
      {/* Transform */}
      <div className="p-3 border-b border-[var(--color-border)]">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2">Transform</h3>
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-xs text-[var(--color-text-secondary)] w-3">X</span>
          <Input
            value={transform?.x ?? ""}
            onChange={(e) => updateTransform({ x: Number(e.target.value) })}
            className="w-0 flex-1"
            disabled={!hasSelection}
          />
          <span className="text-xs text-[var(--color-text-secondary)] w-3">Y</span>
          <Input
            value={transform?.y ?? ""}
            onChange={(e) => updateTransform({ y: Number(e.target.value) })}
            className="w-0 flex-1"
            disabled={!hasSelection}
          />
        </div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-xs text-[var(--color-text-secondary)] w-3">W</span>
          <Input
            value={transform?.width ?? ""}
            onChange={(e) => updateTransform({ width: Number(e.target.value) })}
            className="w-0 flex-1"
            disabled={!hasSelection}
          />
          <span className="text-xs text-[var(--color-text-secondary)] w-3">H</span>
          <Input
            value={transform?.height ?? ""}
            onChange={(e) => updateTransform({ height: Number(e.target.value) })}
            className="w-0 flex-1"
            disabled={!hasSelection}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[var(--color-text-secondary)] w-8">Rot</span>
          <Input
            value={transform?.rotation ?? ""}
            onChange={(e) => updateTransform({ rotation: Number(e.target.value) })}
            className="w-16"
            disabled={!hasSelection}
          />
          <span className="text-[11px] text-[var(--color-text-muted)]">deg</span>
        </div>
      </div>

      {/* Fill */}
      {shape && (
        <div className="p-3 border-b border-[var(--color-border)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2">Fill</h3>
          <div className="flex items-center gap-2 mb-1.5">
            <button
              className="w-7 h-7 rounded border border-[var(--color-border)] shrink-0 cursor-pointer"
              style={{ background: shape.fill || "#6366f1" }}
              onClick={() => setShowFillPicker(!showFillPicker)}
            />
            <Input value={shape.fill || ""} onChange={(e) => updateShape({ fill: e.target.value })} className="flex-1" />
          </div>
          {showFillPicker && (
            <div className="mb-2 relative z-20">
              <div className="fixed inset-0" onClick={() => setShowFillPicker(false)} />
              <div className="relative">
                <HexColorPicker color={shape.fill || "#6366f1"} onChange={(c) => updateShape({ fill: c })} />
              </div>
            </div>
          )}
          <Slider
            value={shape.opacity}
            onChange={(v) => updateShape({ opacity: v })}
            label="Opacity"
          />
        </div>
      )}

      {/* Text Fill */}
      {text && (
        <div className="p-3 border-b border-[var(--color-border)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2">Color</h3>
          <div className="flex items-center gap-2 mb-1.5">
            <button
              className="w-7 h-7 rounded border border-[var(--color-border)] shrink-0 cursor-pointer"
              style={{ background: text.fill || "#1e1e1e" }}
              onClick={() => setShowFillPicker(!showFillPicker)}
            />
            <Input value={text.fill || ""} onChange={(e) => updateText({ fill: e.target.value })} className="flex-1" />
          </div>
          {showFillPicker && (
            <div className="mb-2 relative z-20">
              <div className="fixed inset-0" onClick={() => setShowFillPicker(false)} />
              <div className="relative">
                <HexColorPicker color={text.fill || "#1e1e1e"} onChange={(c) => updateText({ fill: c })} />
              </div>
            </div>
          )}
          <Slider
            value={text.opacity}
            onChange={(v) => updateText({ opacity: v })}
            label="Opacity"
          />
        </div>
      )}

      {/* Stroke */}
      {shape && (
        <div className="p-3 border-b border-[var(--color-border)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2">Stroke</h3>
          <div className="flex items-center gap-2 mb-1.5">
            <button
              className="w-7 h-7 rounded border border-dashed border-[var(--color-border)] shrink-0 cursor-pointer"
              style={{ background: shape.stroke || "transparent" }}
              onClick={() => setShowStrokePicker(!showStrokePicker)}
            />
            <Input value={shape.stroke || ""} onChange={(e) => updateShape({ stroke: e.target.value })} className="flex-1" placeholder="—" />
          </div>
          {showStrokePicker && (
            <div className="mb-2 relative z-20">
              <div className="fixed inset-0" onClick={() => setShowStrokePicker(false)} />
              <div className="relative">
                <HexColorPicker color={shape.stroke || "#000000"} onChange={(c) => updateShape({ stroke: c })} />
              </div>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[var(--color-text-secondary)] w-8">Width</span>
            <Input
              value={shape.strokeWidth}
              onChange={(e) => updateShape({ strokeWidth: Number(e.target.value) })}
              className="w-16"
            />
            <span className="text-[11px] text-[var(--color-text-muted)]">px</span>
          </div>
        </div>
      )}

      {/* Corner Radius */}
      {shape && (
        <div className="p-3 border-b border-[var(--color-border)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2">Corner Radius</h3>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[var(--color-text-secondary)] w-10">Radius</span>
            <Input
              value={shape.cornerRadius}
              onChange={(e) => updateShape({ cornerRadius: Number(e.target.value) })}
              className="w-16"
            />
            <span className="text-[11px] text-[var(--color-text-muted)]">px</span>
          </div>
        </div>
      )}

      {/* Typography */}
      {text && (
        <div className="p-3 border-b border-[var(--color-border)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2">Typography</h3>
          <div className="flex flex-col gap-1.5">
            <Select value={text.fontFamily} onChange={(e) => updateText({ fontFamily: e.target.value })} className="w-full">
              {FONT_LIST.map((f) => (
                <option key={f.family} value={f.family}>{f.family}</option>
              ))}
            </Select>
            <div className="flex gap-1">
              <Input value={text.fontWeight} onChange={(e) => updateText({ fontWeight: e.target.value })} className="flex-1" placeholder="700" />
              <Input value={text.fontSize} onChange={(e) => updateText({ fontSize: Number(e.target.value) })} className="flex-1" placeholder="48" />
            </div>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant={text.fontWeight === "bold" ? "primary" : "outline"}
                onClick={() => updateText({ fontWeight: text.fontWeight === "bold" ? "normal" : "bold" })}
              >
                <Bold size={14} />
              </Button>
              <Button
                size="icon"
                variant={text.fontStyle === "italic" ? "primary" : "outline"}
                onClick={() => updateText({ fontStyle: text.fontStyle === "italic" ? "normal" : "italic" })}
              >
                <Italic size={14} />
              </Button>
              <Button
                size="icon"
                variant={text.underline ? "primary" : "outline"}
                onClick={() => updateText({ underline: !text.underline })}
              >
                <Underline size={14} />
              </Button>
              <div className="flex-1" />
              <Button
                size="icon"
                variant={text.textAlign === "left" ? "primary" : "outline"}
                onClick={() => updateText({ textAlign: "left" })}
              >
                <AlignLeft size={14} />
              </Button>
              <Button
                size="icon"
                variant={text.textAlign === "center" ? "primary" : "outline"}
                onClick={() => updateText({ textAlign: "center" })}
              >
                <AlignCenter size={14} />
              </Button>
              <Button
                size="icon"
                variant={text.textAlign === "right" ? "primary" : "outline"}
                onClick={() => updateText({ textAlign: "right" })}
              >
                <AlignRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Blend Mode */}
      {hasSelection && (
        <div className="p-3 border-b border-[var(--color-border)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2">Blend</h3>
          <Select
            value={blendMode}
            onChange={(e) => updateBlendMode(e.target.value as typeof blendMode)}
            className="w-full"
          >
            {BLEND_MODES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </Select>
        </div>
      )}

      {/* Layers */}
      <div className="p-3 flex-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)] mb-2">
          Layers
          <span className="font-normal normal-case text-[var(--color-text-muted)] ml-1">({layers.length})</span>
        </h3>
        <div className="flex flex-col gap-0.5">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer text-xs transition-all group border border-transparent ${
                useEditorStore.getState().selectedObject === layer.object
                  ? "bg-[var(--color-accent-bg)] text-[var(--color-text-primary)] border-[var(--color-accent)]"
                  : "text-[var(--color-text-secondary)] hover:bg-white/5"
              }`}
              onClick={() => selectLayer(layer.id)}
            >
              <div className="w-4 h-4 opacity-50 shrink-0 flex items-center justify-center">
                {layer.type === "text" ? "T" :
                 layer.type === "circle" ? "●" :
                 layer.type === "triangle" ? "▲" :
                 layer.type === "line" ? "/" :
                 layer.type === "star" ? "★" : "■"}
              </div>
              <span className="flex-1 truncate">{layer.name}</span>
              <div className="hidden group-hover:flex gap-0.5 items-center">
                <button
                  className="w-5 h-5 rounded flex items-center justify-center text-[var(--color-text-muted)] hover:bg-white/10 hover:text-[var(--color-text-primary)] text-[10px]"
                  onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id); }}
                >
                  {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
                <button
                  className="w-5 h-5 rounded flex items-center justify-center text-[var(--color-text-muted)] hover:bg-white/10 hover:text-[var(--color-text-primary)] text-[10px]"
                  onClick={(e) => { e.stopPropagation(); toggleLayerLock(layer.id); }}
                >
                  {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
                </button>
                <button
                  className="w-5 h-5 rounded flex items-center justify-center text-[var(--color-text-muted)] hover:bg-white/10 hover:text-[var(--color-danger)] text-[10px]"
                  onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
          {layers.length === 0 && (
            <p className="text-xs text-[var(--color-text-muted)] text-center py-4">No objects yet</p>
          )}
        </div>
      </div>
    </aside>
  );
}
