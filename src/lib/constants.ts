export const INITIAL_ARTBOARD_WIDTH = 800;
export const INITIAL_ARTBOARD_HEIGHT = 500;
export const ARTBOARD_BG = "#ffffff";
export const CANVAS_BG = "#2C2C2C";
export const DOT_COLOR = "#3E3E3E";
export const DOT_SPACING = 16;
export const DOT_RADIUS = 1;

export const MAX_HISTORY = 50;

export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 5;
export const ZOOM_STEP = 0.1;

export const FREE_MAX_EXPORT_RESOLUTION: number = 1024;
export const PRO_MAX_EXPORT_RESOLUTION: number = 4096;

export const LICENSE_SECRET = "ipsumlogo-pro-secret-key-2025";

export const FONT_LIST = [
  { family: "Inter", category: "sans-serif" },
  { family: "Montserrat", category: "sans-serif" },
  { family: "Poppins", category: "sans-serif" },
  { family: "Raleway", category: "sans-serif" },
  { family: "Playfair Display", category: "serif" },
  { family: "Lora", category: "serif" },
  { family: "Merriweather", category: "serif" },
  { family: "DM Serif Display", category: "serif" },
  { family: "Bebas Neue", category: "display" },
  { family: "Pacifico", category: "display" },
  { family: "Dancing Script", category: "display" },
  { family: "Righteous", category: "display" },
];

export const GRADIENT_PRESETS = [
  ["#667eea", "#764ba2"],
  ["#f093fb", "#f5576c"],
  ["#4facfe", "#00f2fe"],
  ["#43e97b", "#38f9d7"],
  ["#fa709a", "#fee140"],
  ["#a18cd1", "#fbc2eb"],
  ["#fccb90", "#d57eeb"],
  ["#e0c3fc", "#8ec5fc"],
  ["#f5576c", "#ff6f91"],
  ["#30cfd0", "#330867"],
  ["#a8edea", "#fed6e3"],
  ["#5ee7df", "#b490ca"],
];

export const SHAPE_TYPES: Array<{ type: "rect" | "circle" | "triangle" | "line" | "star" | "polygon"; label: string }> = [
  { type: "rect", label: "Rectangle" },
  { type: "circle", label: "Circle" },
  { type: "triangle", label: "Triangle" },
  { type: "line", label: "Line" },
  { type: "star", label: "Star" },
  { type: "polygon", label: "Polygon" },
];

export const COLORS = [
  "#1e1e1e", "#333333", "#555555", "#888888", "#aaaaaa", "#cccccc", "#e0e0e0", "#ffffff",
  "#ef4444", "#f97316", "#f59e0b", "#22c55e", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6",
  "#a855f7", "#ec4899", "#f43f5e", "#10b981", "#14b8a6", "#0ea5e9", "#fbbf24", "#84cc16",
];

export const BLEND_MODES: Array<{ value: string; label: string }> = [
  { value: "normal", label: "Normal" },
  { value: "multiply", label: "Multiply" },
  { value: "screen", label: "Screen" },
  { value: "overlay", label: "Overlay" },
  { value: "darken", label: "Darken" },
  { value: "lighten", label: "Lighten" },
];

export const DEFAULT_SHAPE_STYLES = {
  fill: "#6366f1",
  stroke: "",
  strokeWidth: 0,
  opacity: 1,
  cornerRadius: 0,
};

export const DEFAULT_TEXT_STYLES = {
  fontFamily: "Inter",
  fontSize: 48,
  fontWeight: "bold" as const,
  fontStyle: "normal" as const,
  underline: false,
  textAlign: "center" as const,
  fill: "#1e1e1e",
  opacity: 1,
};
