import { create } from "zustand";
import { getCanvas } from "@/lib/canvas";
import { MAX_HISTORY } from "@/lib/constants";
import type {
  ToolType, TransformProps, ShapeProps, TextProps,
  BlendMode, Layer, CanvasState, BrandKit, LogoTemplate
} from "@/types";
import type { FabricObject, Textbox } from "fabric";
import { generateRandomShape, insertShape, insertText, insertLibraryShape } from "@/lib/shapes";
import { downloadFile } from "@/lib/export";
import { loadFont } from "@/lib/fonts";

interface EditorStore {
  canvasReady: boolean;
  tool: ToolType;
  canvas: CanvasState;
  selectedObject: FabricObject | null;
  selectedProps: {
    transform: TransformProps | null;
    shape: ShapeProps | null;
    text: TextProps | null;
    blendMode: BlendMode;
    isMultiple: boolean;
  };
  layers: Layer[];
  history: string[];
  historyIndex: number;
  isPro: boolean;
  licenseEmail: string;
  watermark: boolean;
  brandKits: BrandKit[];
  templates: LogoTemplate[];

  setCanvasReady: (ready: boolean) => void;
  setTool: (tool: ToolType) => void;

  updateSelected: () => void;
  updateTransform: (props: Partial<TransformProps>) => void;
  updateShape: (props: Partial<ShapeProps>) => void;
  updateText: (props: Partial<TextProps>) => void;
  updateBlendMode: (mode: BlendMode) => void;
  updateArtboardSize: (w: number, h: number) => void;
  toggleGrid: () => void;

  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  handleKeyDown: (e: KeyboardEvent) => void;

  refreshLayers: () => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  deleteLayer: (id: string) => void;
  selectLayer: (id: string) => void;

  doInsertShape: (type: "rect" | "circle" | "triangle" | "line" | "star" | "polygon") => void;
  doInsertText: () => void;
  doInsertLibraryShape: (svgContent: string) => void;
  doRandomShape: () => void;
  doLoadFont: (family: string) => Promise<void>;

  doExport: (format: "svg" | "png" | "jpg") => void;

  setPro: (pro: boolean) => void;
  setLicenseEmail: (email: string) => void;
  setWatermark: (on: boolean) => void;

  addBrandKit: (kit: BrandKit) => void;
  removeBrandKit: (id: string) => void;
  saveTemplate: (tmpl: LogoTemplate) => void;
  removeTemplate: (id: string) => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  canvasReady: false,
  tool: "select",
  canvas: {
    artboardWidth: 800,
    artboardHeight: 500,
    backgroundColor: "#ffffff",
    showGrid: true,
    zoom: 1,
    selectedIds: [],
  },
  selectedObject: null,
  selectedProps: {
    transform: null,
    shape: null,
    text: null,
    blendMode: "normal",
    isMultiple: false,
  },
  layers: [],
  history: [],
  historyIndex: -1,
  isPro: false,
  licenseEmail: "",
  watermark: true,
  brandKits: [],
  templates: [],

  setCanvasReady: (ready) => set({ canvasReady: ready }),
  setTool: (tool) => set({ tool }),

  updateSelected: () => {
    const canvas = getCanvas();
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) {
      set({
        selectedObject: null,
        selectedProps: { transform: null, shape: null, text: null, blendMode: "normal", isMultiple: false },
      });
      return;
    }
    const isGroup = active.type === "activeSelection" || active.type === "group";
    const isText = active.type === "textbox" || active.type === "text";

    const shape = active as unknown as Record<string, unknown>;
    const w = (shape.width as number) || 0;
    const h = (shape.height as number) || 0;
    const sx = (shape.scaleX as number) || 1;
    const sy = (shape.scaleY as number) || 1;

    const transform: TransformProps = {
      x: Math.round((shape.left as number) || 0),
      y: Math.round((shape.top as number) || 0),
      width: Math.round(w * sx),
      height: Math.round(h * sy),
      rotation: Math.round((shape.angle as number) || 0),
      scaleX: sx,
      scaleY: sy,
    };

    const shapeProps: ShapeProps | null = isText ? null : {
      fill: (shape.fill as string) || "#6366f1",
      stroke: (shape.stroke as string) || "",
      strokeWidth: (shape.strokeWidth as number) || 0,
      opacity: (shape.opacity as number) || 1,
      cornerRadius: (shape.rx as number) || 0,
    };

    const text = active as unknown as Textbox;
    const textProps: TextProps | null = isText ? {
      content: (text.text || "").replace(/\n/g, " "),
      fontFamily: text.fontFamily || "Inter",
      fontSize: text.fontSize || 48,
      fontWeight: text.fontWeight || "bold",
      fontStyle: (text.fontStyle as "normal" | "italic") || "normal",
      underline: !!(text).underline,
      textAlign: (text.textAlign as "left" | "center" | "right") || "center",
      fill: (text.fill as string) || "#1e1e1e",
      opacity: text.opacity || 1,
    } : null;

    set({
      selectedObject: active,
      selectedProps: { transform, shape: shapeProps, text: textProps, blendMode: "normal", isMultiple: isGroup },
    });
  },

  updateTransform: (props) => {
    const canvas = getCanvas();
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (!obj) return;

    if (props.x !== undefined) obj.set("left", props.x);
    if (props.y !== undefined) obj.set("top", props.y);
    if (props.width !== undefined) {
      const ow = (obj as unknown as Record<string, unknown>).width as number || 1;
      obj.set("scaleX", props.width / ow);
    }
    if (props.height !== undefined) {
      const oh = (obj as unknown as Record<string, unknown>).height as number || 1;
      obj.set("scaleY", props.height / oh);
    }
    if (props.rotation !== undefined) obj.set("angle", props.rotation);

    obj.setCoords();
    canvas.renderAll();
    get().updateSelected();
    get().pushHistory();
  },

  updateShape: (props) => {
    const canvas = getCanvas();
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (!obj || obj.type === "textbox" || obj.type === "text") return;

    if (props.fill !== undefined) obj.set("fill", props.fill);
    if (props.stroke !== undefined) obj.set("stroke", props.stroke);
    if (props.strokeWidth !== undefined) obj.set("strokeWidth", props.strokeWidth);
    if (props.opacity !== undefined) obj.set("opacity", props.opacity);
    if (props.cornerRadius !== undefined) {
      try { obj.set("rx", props.cornerRadius); obj.set("ry", props.cornerRadius); } catch {}
    }

    canvas.renderAll();
    get().updateSelected();
    get().pushHistory();
  },

  updateText: (props) => {
    const canvas = getCanvas();
    if (!canvas) return;
    const obj = canvas.getActiveObject() as unknown as Record<string, unknown> & Textbox;
    if (!obj || (obj.type !== "textbox" && obj.type !== "text")) return;

    if (props.content !== undefined) obj.set("text", props.content);
    if (props.fontFamily !== undefined) obj.set("fontFamily", props.fontFamily);
    if (props.fontSize !== undefined) obj.set("fontSize", props.fontSize);
    if (props.fontWeight !== undefined) obj.set("fontWeight", String(props.fontWeight));
    if (props.fontStyle !== undefined) obj.set("fontStyle", props.fontStyle);
    if (props.underline !== undefined) obj.set("underline", props.underline);
    if (props.textAlign !== undefined) obj.set("textAlign", props.textAlign);
    if (props.fill !== undefined) obj.set("fill", props.fill);
    if (props.opacity !== undefined) obj.set("opacity", props.opacity);

    canvas.renderAll();
    get().updateSelected();
    get().pushHistory();
  },

  updateBlendMode: (mode) => {
    set((s) => ({ selectedProps: { ...s.selectedProps, blendMode: mode } }));
  },

  updateArtboardSize: (w, h) => {
    set((s) => ({ canvas: { ...s.canvas, artboardWidth: w, artboardHeight: h } }));
  },

  toggleGrid: () => {
    set((s) => ({ canvas: { ...s.canvas, showGrid: !s.canvas.showGrid } }));
  },

  pushHistory: () => {
    const canvas = getCanvas();
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON());
    set((s) => {
      const newHistory = s.history.slice(0, s.historyIndex + 1);
      newHistory.push(json);
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      return { history: newHistory, historyIndex: newHistory.length - 1 };
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const canvas = getCanvas();
    if (!canvas) return;
    const newIndex = historyIndex - 1;
    void canvas.loadFromJSON(JSON.parse(history[newIndex] as string)).then(() => {
      canvas.renderAll();
      set({ historyIndex: newIndex });
      get().updateSelected();
      get().refreshLayers();
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const canvas = getCanvas();
    if (!canvas) return;
    const newIndex = historyIndex + 1;
    void canvas.loadFromJSON(JSON.parse(history[newIndex] as string)).then(() => {
      canvas.renderAll();
      set({ historyIndex: newIndex });
      get().updateSelected();
      get().refreshLayers();
    });
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  handleKeyDown: (e: KeyboardEvent) => {
    const ctrl = e.ctrlKey || e.metaKey;
    if (ctrl && e.key === "z" && !e.shiftKey) { e.preventDefault(); get().undo(); }
    if (ctrl && e.key === "z" && e.shiftKey) { e.preventDefault(); get().redo(); }
    if (ctrl && e.key === "y") { e.preventDefault(); get().redo(); }
    if (e.key === "Delete" || e.key === "Backspace") {
      const canvas = getCanvas();
      if (!canvas) return;
      const obj = canvas.getActiveObject();
      if (obj) {
        canvas.remove(obj);
        canvas.discardActiveObject();
        canvas.renderAll();
        get().pushHistory();
        get().refreshLayers();
        get().updateSelected();
      }
    }
  },

  refreshLayers: () => {
    const canvas = getCanvas();
    if (!canvas) return;
    const objects = canvas.getObjects().filter(
      (obj: FabricObject) => (obj as FabricObject & { name?: string }).name !== "__artboard__"
    );
    const layers: Layer[] = objects.map((obj: FabricObject) => ({
      id: ((obj as unknown as { id?: string }).id) || crypto.randomUUID(),
      name: obj.type === "textbox" || obj.type === "text"
        ? ((obj as unknown as { text?: string }).text || "").slice(0, 20) || "Text"
        : obj.type || "Shape",
      type: mapFabricType(obj.type || ""),
      visible: obj.visible ?? true,
      locked: !obj.selectable,
      object: obj,
    }));
    set({ layers: layers.reverse() });
  },

  toggleLayerVisibility: (id) => {
    const canvas = getCanvas();
    if (!canvas) return;
    const obj = canvas.getObjects().find(
      (o: FabricObject) => (o as unknown as { id?: string }).id === id
    );
    if (obj) {
      obj.visible = !obj.visible;
      canvas.renderAll();
      get().refreshLayers();
    }
  },

  toggleLayerLock: (id) => {
    const canvas = getCanvas();
    if (!canvas) return;
    const obj = canvas.getObjects().find(
      (o: FabricObject) => (o as unknown as { id?: string }).id === id
    );
    if (obj) {
      obj.selectable = !obj.selectable;
      obj.evented = !obj.evented;
      canvas.renderAll();
      get().refreshLayers();
    }
  },

  deleteLayer: (id) => {
    const canvas = getCanvas();
    if (!canvas) return;
    const obj = canvas.getObjects().find(
      (o: FabricObject) => (o as unknown as { id?: string }).id === id
    );
    if (obj) {
      canvas.remove(obj);
      canvas.renderAll();
      get().pushHistory();
      get().refreshLayers();
      get().updateSelected();
    }
  },

  selectLayer: (id) => {
    const canvas = getCanvas();
    if (!canvas) return;
    const obj = canvas.getObjects().find(
      (o: FabricObject) => (o as unknown as { id?: string }).id === id
    );
    if (obj) {
      canvas.setActiveObject(obj);
      canvas.renderAll();
      get().updateSelected();
    }
  },

  doInsertShape: (type) => {
    insertShape(type);
    get().pushHistory();
    get().refreshLayers();
    get().updateSelected();
  },

  doInsertText: () => {
    insertText();
    get().pushHistory();
    get().refreshLayers();
    get().updateSelected();
  },

  doInsertLibraryShape: (svgContent) => {
    insertLibraryShape(svgContent);
    setTimeout(() => {
      get().pushHistory();
      get().refreshLayers();
      get().updateSelected();
    }, 500);
  },

  doRandomShape: () => {
    generateRandomShape();
    get().pushHistory();
    get().refreshLayers();
    get().updateSelected();
  },

  doLoadFont: async (family) => {
    await loadFont(family);
  },

  doExport: async (format) => {
    const { isPro, watermark } = get();
    await downloadFile(format, 1024, isPro, watermark);
  },

  setPro: (pro) => set({ isPro: pro }),
  setLicenseEmail: (email) => set({ licenseEmail: email }),
  setWatermark: (on) => set({ watermark: on }),

  addBrandKit: (kit) => set((s) => ({ brandKits: [...s.brandKits, kit] })),
  removeBrandKit: (id) => set((s) => ({ brandKits: s.brandKits.filter((k) => k.id !== id) })),
  saveTemplate: (tmpl) => set((s) => ({ templates: [...s.templates, tmpl] })),
  removeTemplate: (id) => set((s) => ({ templates: s.templates.filter((t) => t.id !== id) })),
}));

function mapFabricType(type: string): Layer["type"] {
  const map: Record<string, Layer["type"]> = {
    rect: "rect", circle: "circle", triangle: "triangle",
    line: "line", polygon: "star", textbox: "text", text: "text",
  };
  return map[type] || "rect";
}
