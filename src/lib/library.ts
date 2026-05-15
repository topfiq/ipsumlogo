import type { LibraryShape } from "@/types";
import defaultShapes from "@/data/default-shapes.json";

let libraryCache: LibraryShape[] | null = null;

const isClient = typeof window !== "undefined";

export function getDefaultShapes(): LibraryShape[] {
  return defaultShapes as LibraryShape[];
}

export function getLibrary(): LibraryShape[] {
  if (!isClient) return getDefaultShapes();

  if (libraryCache) return libraryCache;

  const stored = localStorage.getItem("ipsumlogo_library");
  if (stored) {
    try {
      libraryCache = JSON.parse(stored);
      return libraryCache!;
    } catch {
      libraryCache = getDefaultShapes();
    }
  } else {
    libraryCache = getDefaultShapes();
  }

  return libraryCache;
}

export function saveLibrary(shapes: LibraryShape[]) {
  if (!isClient) return;
  libraryCache = shapes;
  localStorage.setItem("ipsumlogo_library", JSON.stringify(shapes));
}

export function addToLibrary(shape: Omit<LibraryShape, "id" | "createdAt">) {
  const library = getLibrary();
  const newShape: LibraryShape = {
    ...shape,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  library.push(newShape);
  saveLibrary(library);
  return newShape;
}

export function removeFromLibrary(id: string) {
  const library = getLibrary().filter((s) => s.id !== id);
  saveLibrary(library);
}

export function getLibraryByCategory(): Map<string, LibraryShape[]> {
  const library = getLibrary();
  const map = new Map<string, LibraryShape[]>();
  library.forEach((shape) => {
    const cat = shape.category || "Uncategorized";
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(shape);
  });
  return map;
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
  } catch {
    return false;
  }
}
