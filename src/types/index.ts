import type { FabricObject } from "fabric";

export interface Layer {
  id: string;
  name: string;
  type: "text" | "rect" | "circle" | "triangle" | "line" | "star" | "polygon" | "path" | "group";
  visible: boolean;
  locked: boolean;
  object: FabricObject;
}

export interface CanvasState {
  artboardWidth: number;
  artboardHeight: number;
  backgroundColor: string;
  showGrid: boolean;
  zoom: number;
  selectedIds: string[];
}

export interface TransformProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

export interface ShapeProps {
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeDashArray: number[] | null;
  opacity: number;
  cornerRadius: number;
}

export interface TextProps {
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  fontStyle: "normal" | "italic";
  underline: boolean;
  lineHeight: number;
  charSpacing: number;
  textAlign: "left" | "center" | "right" | "justify";
  fill: string;
  opacity: number;
}

export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion";

export type ShapeType = "rect" | "circle" | "triangle" | "line" | "star" | "polygon";

export interface LibraryShape {
  id: string;
  name: string;
  category: string;
  svgContent: string;
  createdAt: number;
}

export interface EditorObject {
  id: string;
  name: string;
  type: Layer["type"];
  visible: boolean;
  locked: boolean;
  transform: TransformProps;
  shape?: ShapeProps;
  text?: TextProps;
  blendMode?: BlendMode;
  svgPath?: string;
}

export interface LicenseKey {
  email: string;
  plan: "pro";
  issuedAt: number;
  expiryAt: number;
  signature: string;
}

export interface BrandKit {
  id: string;
  name: string;
  colors: string[];
  fontPairing: { heading: string; body: string };
  logos: string[];
  createdAt: number;
}

export interface LogoTemplate {
  id: string;
  name: string;
  state: string;
  preview: string;
  createdAt: number;
}

export type ExportFormat = "svg" | "png" | "jpg";
export type ExportResolution = 1024 | 2048 | 4096;

export type ToolType =
  | "select"
  | "text"
  | "rect"
  | "circle"
  | "triangle"
  | "line"
  | "star"
  | "polygon";
