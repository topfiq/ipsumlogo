import type { LogoTemplate } from "@/types";

let templatesCache: LogoTemplate[] | null = null;
const isClient = typeof window !== "undefined";

export async function loadTemplates(): Promise<LogoTemplate[]> {
  if (templatesCache) return templatesCache;

  try {
    const res = await fetch("/api/templates");
    if (res.ok) {
      templatesCache = await res.json() as LogoTemplate[];
      return templatesCache;
    }
  } catch { /* */ }

  if (isClient) {
    const raw = localStorage.getItem("ipsumlogo_templates");
    if (raw) {
      try { templatesCache = JSON.parse(raw) as LogoTemplate[]; return templatesCache; } catch { /* */ }
    }
  }

  templatesCache = [];
  return templatesCache;
}

export function getTemplates(): LogoTemplate[] {
  return templatesCache || [];
}

export function saveTemplates(templates: LogoTemplate[]) {
  templatesCache = templates;
  if (isClient) localStorage.setItem("ipsumlogo_templates", JSON.stringify(templates));
}

export async function addTemplate(name: string, stateJson: string, previewSvg: string): Promise<LogoTemplate> {
  const res = await fetch("/api/templates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, state: stateJson, preview: previewSvg }),
  });
  if (!res.ok) throw new Error("Failed to add template");
  const created = await res.json();
  templatesCache = null;
  return created;
}

export async function removeTemplate(id: string) {
  await fetch(`/api/templates/${id}`, { method: "DELETE" });
  templatesCache = null;
}

export async function initTemplates(): Promise<LogoTemplate[]> {
  return loadTemplates();
}
