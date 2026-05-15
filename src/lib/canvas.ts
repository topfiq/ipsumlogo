import {
  Canvas,
  Rect,
  Circle,
  Triangle,
  Line,
  Polygon,
  Group,
  Textbox,
  Point,
  loadSVGFromString,
  type Canvas as ICanvas,
  type FabricObject,
} from "fabric";

let canvasInstance: ICanvas | null = null;
let isPanning = false;
let lastPosX = 0;
let lastPosY = 0;

export function initCanvas(
  el: HTMLCanvasElement,
  options: { width: number; height: number }
): ICanvas {
  if (canvasInstance) {
    canvasInstance.dispose();
  }

  canvasInstance = new Canvas(el, {
    width: options.width,
    height: options.height,
    selection: true,
    preserveObjectStacking: true,
  });

  setupCanvasEvents(canvasInstance);

  return canvasInstance;
}

function setupCanvasEvents(canvas: ICanvas) {
  canvas.on("mouse:down", (opt) => {
    const evt = opt.e as MouseEvent;
    if (evt.button === 1 || (evt.button === 0 && evt.altKey)) {
      isPanning = true;
      canvas.selection = false;
      lastPosX = evt.clientX;
      lastPosY = evt.clientY;
      canvas.setCursor("grabbing");
    }
  });

  canvas.on("mouse:move", (opt) => {
    if (isPanning) {
      const evt = opt.e as MouseEvent;
      const vpt = canvas.viewportTransform;
      if (vpt) {
        const newVpt: [number, number, number, number, number, number] = [
          vpt[0], vpt[1], vpt[2], vpt[3],
          vpt[4] + evt.clientX - lastPosX,
          vpt[5] + evt.clientY - lastPosY,
        ];
        canvas.setViewportTransform(newVpt);
        canvas.requestRenderAll();
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
      }
    }
  });

  canvas.on("mouse:up", () => {
    if (isPanning) {
      isPanning = false;
      canvas.selection = true;
      canvas.setCursor("default");
    }
  });

  canvas.on("mouse:wheel", (opt) => {
    const evt = opt.e as WheelEvent;
    evt.preventDefault();
    evt.stopPropagation();

    const delta = evt.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    zoom = Math.min(5, Math.max(0.1, zoom));

    const pt = new Point(evt.offsetX, evt.offsetY);
    canvas.zoomToPoint(pt, zoom);
  });
}

export function getCanvas(): ICanvas | null {
  return canvasInstance;
}

export function disposeCanvas() {
  if (canvasInstance) {
    canvasInstance.dispose();
    canvasInstance = null;
  }
}

export function zoomToFit(canvas: ICanvas, artboardWidth: number, artboardHeight: number) {
  const canvasWidth = canvas.getWidth() || 1200;
  const canvasHeight = canvas.getHeight() || 800;
  const pad = 80;
  const scaleX = (canvasWidth - pad * 2) / artboardWidth;
  const scaleY = (canvasHeight - pad * 2) / artboardHeight;
  const scale = Math.min(scaleX, scaleY, 1);

  const offsetX = (canvasWidth - artboardWidth * scale) / 2;
  const offsetY = (canvasHeight - artboardHeight * scale) / 2;

  canvas.setViewportTransform([scale, 0, 0, scale, offsetX, offsetY]);
  canvas.requestRenderAll();
}

export function resetViewport(canvas: ICanvas, artboardWidth: number, artboardHeight: number) {
  zoomToFit(canvas, artboardWidth, artboardHeight);
}

export function createArtboard(canvas: ICanvas, width: number, height: number): Rect {
  const artboard = new Rect({
    width,
    height,
    fill: "#ffffff",
    selectable: false,
    evented: false,
    name: "__artboard__",
    left: 0,
    top: 0,
  });

  canvas.add(artboard);
  canvas.requestRenderAll();
  return artboard;
}

export function addRectangle(canvas: ICanvas, opts?: Record<string, unknown>) {
  const rect = new Rect({ left: 100, top: 100, width: 120, height: 80, fill: "#6366f1", ...opts });
  canvas.add(rect);
  canvas.setActiveObject(rect);
  canvas.requestRenderAll();
  return rect;
}

export function addCircle(canvas: ICanvas, opts?: Record<string, unknown>) {
  const circle = new Circle({ left: 100, top: 100, radius: 50, fill: "#6366f1", ...opts });
  canvas.add(circle);
  canvas.setActiveObject(circle);
  canvas.requestRenderAll();
  return circle;
}

export function addTriangle(canvas: ICanvas, opts?: Record<string, unknown>) {
  const triangle = new Triangle({ left: 100, top: 100, width: 100, height: 100, fill: "#6366f1", ...opts });
  canvas.add(triangle);
  canvas.setActiveObject(triangle);
  canvas.requestRenderAll();
  return triangle;
}

export function addLine(canvas: ICanvas, opts?: Record<string, unknown>) {
  const line = new Line([50, 50, 200, 50], { left: 100, top: 100, stroke: "#6366f1", strokeWidth: 4, ...opts });
  canvas.add(line);
  canvas.setActiveObject(line);
  canvas.requestRenderAll();
  return line;
}

export function addStar(canvas: ICanvas) {
  const pts = createStarPoints(5, 25, 50);
  const star = new Polygon(pts, { left: 100, top: 100, fill: "#f59e0b", originX: "center", originY: "center" });
  canvas.add(star);
  canvas.setActiveObject(star);
  canvas.requestRenderAll();
  return star;
}

export function addPolygon(canvas: ICanvas, sides = 6) {
  const pts = createPolygonPoints(sides, 50);
  const polygon = new Polygon(pts, { left: 100, top: 100, fill: "#6366f1", originX: "center", originY: "center" });
  canvas.add(polygon);
  canvas.setActiveObject(polygon);
  canvas.requestRenderAll();
  return polygon;
}

export function addText(canvas: ICanvas, textStr = "Text", opts?: Record<string, unknown>) {
  const text = new Textbox(textStr, { left: 100, top: 100, fontSize: 48, fontFamily: "Inter", fontWeight: "bold", fill: "#1e1e1e", width: 300, textAlign: "center", ...opts });
  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.requestRenderAll();
  return text;
}

export function addSvgShape(canvas: ICanvas, svgString: string) {
  loadSVGFromString(svgString).then(({ objects }) => {
    const filtered = objects.filter(Boolean) as FabricObject[];
    const group = new Group(filtered, { left: 100, top: 100, fill: "#6366f1", stroke: "", strokeWidth: 0 });
    if (group.width && group.height) {
      const sc = Math.min(80 / group.width, 80 / group.height, 1);
      group.scaleX = sc;
      group.scaleY = sc;
    }
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
  });
}

export function clearCanvas(canvas: ICanvas) {
  const objects = canvas.getObjects();
  objects.forEach((obj: FabricObject) => {
    if ((obj as FabricObject & { name?: string }).name !== "__artboard__") {
      canvas.remove(obj);
    }
  });
  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

function createStarPoints(points: number, innerRadius: number, outerRadius: number) {
  const step = Math.PI / points;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < 2 * points; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;
    pts.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) });
  }
  return pts;
}

function createPolygonPoints(sides: number, radius: number) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
    pts.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) });
  }
  return pts;
}
