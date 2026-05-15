import type { LibraryShape } from "@/types";

let libraryCache: LibraryShape[] | null = null;
let publicShapesLoaded = false;
const isClient = typeof window !== "undefined";

export function getDefaultShapes(): LibraryShape[] {
  return libraryCache || [];
}

export async function loadLibrary(): Promise<LibraryShape[]> {
  if (libraryCache && publicShapesLoaded) return libraryCache;

  const allShapes: LibraryShape[] = [];

  // 1. Load public published shapes from server
  try {
    const url = "/library/shapes.json";
    const res = await fetch(url);
    if (res.ok) {
      const publicShapes: LibraryShape[] = await res.json();
      allShapes.push(...publicShapes);
    }
  } catch { /* ignore network errors */ }
  publicShapesLoaded = true;

  // 2. Load admin draft shapes from localStorage (not yet published)
  if (isClient) {
    const raw = localStorage.getItem("ipsumlogo_library");
    if (raw) {
      try {
        const localShapes: LibraryShape[] = JSON.parse(raw);
        const publicIds = new Set(allShapes.map((s) => s.id));
        for (const shape of localShapes) {
          if (!publicIds.has(shape.id)) allShapes.push(shape);
        }
      } catch { /* ignore */ }
    }
  }

  // 3. If still empty, use bundled defaults
  if (allShapes.length === 0 && isClient) {
    try {
      const mod = await import("@/data/default-shapes.json");
      allShapes.push(...(mod.default as LibraryShape[]));
    } catch { /* ignore */ }
  }

  libraryCache = allShapes;
  return allShapes;
}

export function getLibrary(): LibraryShape[] {
  return libraryCache || [];
}

export function saveLibrary(shapes: LibraryShape[]) {
  if (!isClient) return;
  libraryCache = shapes;
  localStorage.setItem("ipsumlogo_library", JSON.stringify(shapes));
}

export function addToLibrary(shape: Omit<LibraryShape, "id" | "createdAt">) {
  const library = getLibrary();
  const newShape: LibraryShape = { ...shape, id: crypto.randomUUID(), createdAt: Date.now() };
  library.push(newShape);
  saveLibrary(library);
  return newShape;
}

export function removeFromLibrary(id: string) {
  const library = getLibrary().filter((s) => s.id !== id);
  saveLibrary(library);
}

export function exportLibraryJson(): string {
  return JSON.stringify(getLibrary(), null, 2);
}

export function importLibraryJson(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data)) return false;
    saveLibrary(data);
    return true;
  } catch { return false; }
}

export function initLibrary(): Promise<LibraryShape[]> {
  return loadLibrary();
}
