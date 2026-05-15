import { getCanvas, addRectangle, addCircle, addTriangle, addLine, addStar, addPolygon, addText, addSvgShape } from "./canvas";
import { COLORS } from "./constants";
import type { ShapeType } from "@/types";

export function generateRandomShape() {
  const canvas = getCanvas();
  if (!canvas) return;

  const types: ShapeType[] = ["rect", "circle", "triangle", "line", "star", "polygon"];
  const shapeType = types[Math.floor(Math.random() * types.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const x = 100 + Math.random() * 500;
  const y = 80 + Math.random() * 300;
  const size = 30 + Math.random() * 100;
  const rotation = Math.random() * 360;
  const opacity = 0.4 + Math.random() * 0.6;

  // @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let obj: any;

  switch (shapeType) {
    case "rect":
      obj = addRectangle(canvas, {
        left: x,
        top: y,
        width: size,
        height: size * (0.5 + Math.random()),
        fill: color,
        opacity,
        angle: rotation,
      });
      break;
    case "circle":
      obj = addCircle(canvas, {
        left: x,
        top: y,
        radius: size / 2,
        fill: color,
        opacity,
        angle: rotation,
      });
      break;
    case "triangle":
      obj = addTriangle(canvas, {
        left: x,
        top: y,
        width: size,
        height: size,
        fill: color,
        opacity,
        angle: rotation,
      });
      break;
    case "line":
      obj = addLine(canvas, {
        left: x,
        top: y,
        stroke: color,
        strokeWidth: 2 + Math.random() * 6,
        opacity,
        angle: rotation,
        x2: size,
      });
      break;
    case "star":
      obj = addStar(canvas);
      obj.set({ left: x, top: y, fill: color, opacity, angle: rotation });
      break;
    case "polygon":
      obj = addPolygon(canvas, 3 + Math.floor(Math.random() * 6));
      obj.set({ left: x, top: y, fill: color, opacity, angle: rotation });
      break;
    default:
      obj = addRectangle(canvas, { left: x, top: y, width: size, height: size, fill: color });
  }

  canvas.renderAll();
  return obj;
}

export function insertShape(shapeType: ShapeType) {
  const canvas = getCanvas();
  if (!canvas) return;

  const color = "#6366f1";

  switch (shapeType) {
    case "rect":
      addRectangle(canvas, { fill: color });
      break;
    case "circle":
      addCircle(canvas, { fill: color });
      break;
    case "triangle":
      addTriangle(canvas, { fill: color });
      break;
    case "line":
      addLine(canvas, { stroke: color });
      break;
    case "star":
      addStar(canvas);
      break;
    case "polygon":
      addPolygon(canvas);
      break;
  }
}

export function insertText() {
  const canvas = getCanvas();
  if (!canvas) return;
  addText(canvas, "Text", { left: 120, top: 120 });
}

export function insertLibraryShape(svgContent: string) {
  const canvas = getCanvas();
  if (!canvas) return;
  addSvgShape(canvas, svgContent);
}
