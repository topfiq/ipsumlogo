import type { LibraryShape } from "@/types";

let libraryCache: LibraryShape[] | null = null;
const isClient = typeof window !== "undefined";

export async function loadLibrary(): Promise<LibraryShape[]> {
  if (libraryCache) return libraryCache;

  try {
    const res = await fetch("/api/shapes");
    if (res.ok) {
      libraryCache = await res.json() as LibraryShape[];
      return libraryCache;
    }
  } catch { /* network error — fall through */ }

  // Fallback to localStorage
  if (isClient) {
    const raw = localStorage.getItem("ipsumlogo_library");
    if (raw) {
      try { libraryCache = JSON.parse(raw) as LibraryShape[]; return libraryCache; } catch { /* */ }
    }
  }

  libraryCache = [];
  return libraryCache;
}

export function getLibrary(): LibraryShape[] {
  return libraryCache || [];
}

export function saveLibrary(shapes: LibraryShape[]) {
  libraryCache = shapes;
  if (isClient) localStorage.setItem("ipsumlogo_library", JSON.stringify(shapes));
}

export async function addToLibrary(shape: Omit<LibraryShape, "id" | "createdAt">): Promise<LibraryShape> {
  const res = await fetch("/api/shapes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(shape),
  });
  if (!res.ok) throw new Error("Failed to add shape");
  const created = await res.json() as LibraryShape;
  libraryCache = null; // invalidate cache
  return created;
}

export async function removeFromLibrary(id: string) {
  await fetch(`/api/shapes/${id}`, { method: "DELETE" });
  libraryCache = null;
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

export async function initLibrary(): Promise<LibraryShape[]> {
  return loadLibrary();
}
