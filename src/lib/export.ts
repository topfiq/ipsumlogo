import { getCanvas } from "./canvas";
import type { ExportFormat, ExportResolution } from "@/types";
import { FREE_MAX_EXPORT_RESOLUTION } from "./constants";

function getMultiplier(format: ExportFormat, resolution: ExportResolution, isPro: boolean): number {
  const artboardWidth = 800;
  const maxRes = isPro ? resolution : FREE_MAX_EXPORT_RESOLUTION;
  return Math.min(maxRes / artboardWidth, 4);
}

export function exportImage(
  format: ExportFormat,
  resolution: ExportResolution,
  quality: number = 0.95,
  isPro: boolean = false
): string {
  const canvas = getCanvas();
  if (!canvas) return "";

  const multiplier = getMultiplier(format, resolution, isPro);
  const originalTransform = canvas.viewportTransform ? ([canvas.viewportTransform[0], canvas.viewportTransform[1], canvas.viewportTransform[2], canvas.viewportTransform[3], canvas.viewportTransform[4], canvas.viewportTransform[5]] as [number, number, number, number, number, number]) : null;
  const originalZoom = canvas.getZoom();

  const dataUrl = canvas.toDataURL({
    format: format === "jpg" ? "jpeg" : "png",
    quality: format === "jpg" ? quality : 1,
    multiplier,
  });

  if (originalTransform) {
    canvas.setViewportTransform(originalTransform);
    canvas.setZoom(originalZoom);
    canvas.renderAll();
  }

  return dataUrl;
}

export function exportSvg(watermark: boolean = true): string {
  const canvas = getCanvas();
  if (!canvas) return "";

  const svg = canvas.toSVG();

  if (watermark) {
    return svg + getWatermarkSvg();
  }
  return svg;
}

function getWatermarkSvg(): string {
  return `\n<!-- Made with Ipsumlogo -->`;
}

export async function downloadFile(
  format: ExportFormat,
  resolution: ExportResolution,
  isPro: boolean = false,
  watermark: boolean = true
) {
  const { saveAs } = await import("file-saver");

  if (format === "svg") {
    const svgContent = exportSvg(watermark);
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    saveAs(blob, `logo.svg`);
  } else {
    const dataUrl = exportImage(format, resolution, 0.95, isPro);
    const blob = dataURLtoBlob(dataUrl);
    const ext = format === "jpg" ? "jpg" : "png";
    saveAs(blob, `logo.${ext}`);
  }
}

function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new Blob([u8arr], { type: mime });
}
