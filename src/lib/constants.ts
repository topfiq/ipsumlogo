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
  { family: "Open Sans", category: "sans-serif" },
  { family: "Roboto", category: "sans-serif" },
  { family: "Lato", category: "sans-serif" },
  { family: "Nunito", category: "sans-serif" },
  { family: "Quicksand", category: "sans-serif" },
  { family: "Ubuntu", category: "sans-serif" },
  { family: "Work Sans", category: "sans-serif" },
  { family: "DM Sans", category: "sans-serif" },
  { family: "Manrope", category: "sans-serif" },
  { family: "Rubik", category: "sans-serif" },
  { family: "Epilogue", category: "sans-serif" },
  { family: "Figtree", category: "sans-serif" },
  { family: "Exo 2", category: "sans-serif" },
  { family: "Josefin Sans", category: "sans-serif" },
  { family: "Kanit", category: "sans-serif" },
  { family: "Mulish", category: "sans-serif" },
  { family: "M PLUS Rounded 1c", category: "sans-serif" },
  { family: "Noto Sans", category: "sans-serif" },
  { family: "PT Sans", category: "sans-serif" },
  { family: "Prompt", category: "sans-serif" },
  { family: "Saira", category: "sans-serif" },
  { family: "Titillium Web", category: "sans-serif" },
  { family: "Varela Round", category: "sans-serif" },
  { family: "Lexend", category: "sans-serif" },
  { family: "Outfit", category: "sans-serif" },
  { family: "Plus Jakarta Sans", category: "sans-serif" },
  { family: "Readex Pro", category: "sans-serif" },
  { family: "Urbanist", category: "sans-serif" },
  { family: "Playfair Display", category: "serif" },
  { family: "Lora", category: "serif" },
  { family: "Merriweather", category: "serif" },
  { family: "DM Serif Display", category: "serif" },
  { family: "DM Serif Text", category: "serif" },
  { family: "Crimson Text", category: "serif" },
  { family: "EB Garamond", category: "serif" },
  { family: "Libre Baskerville", category: "serif" },
  { family: "Noto Serif", category: "serif" },
  { family: "Playfair", category: "serif" },
  { family: "Prata", category: "serif" },
  { family: "PT Serif", category: "serif" },
  { family: "Source Serif 4", category: "serif" },
  { family: "Zilla Slab", category: "serif" },
  { family: "Bitter", category: "serif" },
  { family: "Bree Serif", category: "serif" },
  { family: "Bebas Neue", category: "display" },
  { family: "Pacifico", category: "display" },
  { family: "Dancing Script", category: "display" },
  { family: "Righteous", category: "display" },
  { family: "Anton", category: "display" },
  { family: "Abril Fatface", category: "display" },
  { family: "Caveat", category: "display" },
  { family: "Comfortaa", category: "display" },
  { family: "Concert One", category: "display" },
  { family: "Courgette", category: "display" },
  { family: "Fredoka One", category: "display" },
  { family: "Great Vibes", category: "display" },
  { family: "Lilita One", category: "display" },
  { family: "Lobster", category: "display" },
  { family: "Lobster Two", category: "display" },
  { family: "Monoton", category: "display" },
  { family: "Oleo Script", category: "display" },
  { family: "Patua One", category: "display" },
  { family: "Permanent Marker", category: "display" },
  { family: "Press Start 2P", category: "display" },
  { family: "Russo One", category: "display" },
  { family: "Sacramento", category: "display" },
  { family: "Shadows Into Light", category: "display" },
  { family: "Sigmar One", category: "display" },
  { family: "Satisfy", category: "display" },
  { family: "Tangerine", category: "display" },
  { family: "Yellowtail", category: "display" },
  { family: "Alegreya", category: "serif" },
  { family: "Amatic SC", category: "display" },
  { family: "Archivo Black", category: "sans-serif" },
  { family: "Archivo", category: "sans-serif" },
  { family: "Baloo 2", category: "display" },
  { family: "Carter One", category: "display" },
  { family: "Chelsea Market", category: "display" },
  { family: "Chonburi", category: "display" },
  { family: "Cinzel", category: "serif" },
  { family: "Cormorant Garamond", category: "serif" },
  { family: "Fira Sans", category: "sans-serif" },
  { family: "Francois One", category: "sans-serif" },
  { family: "Gravitas One", category: "display" },
  { family: "Hammersmith One", category: "sans-serif" },
  { family: "Kaushan Script", category: "display" },
  { family: "Knewave", category: "display" },
  { family: "Krona One", category: "sans-serif" },
  { family: "Luckiest Guy", category: "display" },
  { family: "Monda", category: "sans-serif" },
  { family: "Orbitron", category: "display" },
  { family: "Oswald", category: "sans-serif" },
  { family: "Paytone One", category: "sans-serif" },
  { family: "Philosopher", category: "sans-serif" },
  { family: "Quantico", category: "sans-serif" },
  { family: "Questrial", category: "sans-serif" },
  { family: "Rajdhani", category: "sans-serif" },
  { family: "Rowdies", category: "display" },
  { family: "Secular One", category: "sans-serif" },
  { family: "Special Elite", category: "display" },
  { family: "Squada One", category: "display" },
  { family: "Staatliches", category: "display" },
  { family: "Teko", category: "sans-serif" },
  { family: "Unica One", category: "display" },
  { family: "Vollkorn", category: "serif" },
  { family: "Yeseva One", category: "display" },
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
