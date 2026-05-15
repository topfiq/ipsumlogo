import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "svg", "path", "circle", "rect", "ellipse", "line", "polyline", "polygon",
  "g", "defs", "lineargradient", "radialgradient", "stop", "clippath",
  "mask", "pattern", "filter", "feoffset", "fegaussianblur", "fecolormatrix",
  "femerge", "femergenode", "fecomposite", "title", "desc",
];

const ALLOWED_ATTRS = [
  "d", "cx", "cy", "r", "rx", "ry", "x", "x1", "x2", "y", "y1", "y2",
  "width", "height", "fill", "fill-opacity", "stroke", "stroke-width",
  "stroke-opacity", "stroke-linecap", "stroke-linejoin", "stroke-dasharray",
  "opacity", "transform", "viewbox", "points", "id", "offset", "stop-color",
  "stop-opacity", "gradientunits", "gradienttransform", "clip-path",
  "clip-rule", "fill-rule", "style", "class", "preserveaspectratio", "xmlns",
];

export function sanitizeSvg(svgString: string): string {
  if (!svgString || typeof svgString !== "string") return "";

  const purified = DOMPurify.sanitize(svgString, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ALLOWED_ATTRS,
  });

  return purified;
}

export function isValidSvg(svgString: string): boolean {
  if (!svgString || typeof svgString !== "string") return false;

  const lower = svgString.trim().toLowerCase();

  const hasMalicious = [
    "<script", "onload=", "onerror=", "onclick=", "<iframe",
    "<foreignobject", "<use", "<link", "<object", "<embed",
    "javascript:", "vbscript:", "data:text/html",
  ].some((pattern) => lower.includes(pattern));

  if (hasMalicious) return false;

  const hasSvgTag = /<svg\b/i.test(svgString) && /<\/svg>/i.test(svgString);
  if (!hasSvgTag) return false;

  const fileSize = new Blob([svgString]).size;
  if (fileSize > 50 * 1024) return false;

  return true;
}
