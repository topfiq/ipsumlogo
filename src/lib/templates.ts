import type { LogoTemplate } from "@/types";

let templatesCache: LogoTemplate[] | null = null;
let publicLoaded = false;
const isClient = typeof window !== "undefined";

export async function loadTemplates(): Promise<LogoTemplate[]> {
  if (templatesCache && publicLoaded) return templatesCache;

  const allTemplates: LogoTemplate[] = [];

  try {
    const res = await fetch("/library/templates.json");
    if (res.ok) {
      const publicData: LogoTemplate[] = await res.json();
      allTemplates.push(...publicData);
    }
  } catch { /* ignore */ }
  publicLoaded = true;

  if (isClient) {
    const raw = localStorage.getItem("ipsumlogo_templates");
    if (raw) {
      try {
        const localData: LogoTemplate[] = JSON.parse(raw);
        const publicIds = new Set(allTemplates.map((t) => t.id));
        for (const t of localData) {
          if (!publicIds.has(t.id)) allTemplates.push(t);
        }
      } catch { /* ignore */ }
    }
  }

  templatesCache = allTemplates;
  return allTemplates;
}

export function getTemplates(): LogoTemplate[] {
  return templatesCache || [];
}

export function saveTemplates(templates: LogoTemplate[]) {
  if (!isClient) return;
  templatesCache = templates;
  localStorage.setItem("ipsumlogo_templates", JSON.stringify(templates));
}

export function addTemplate(name: string, stateJson: string, previewSvg: string): LogoTemplate {
  const templates = getTemplates();
  const tmpl: LogoTemplate = { id: crypto.randomUUID(), name, state: stateJson, preview: previewSvg, createdAt: Date.now() };
  templates.push(tmpl);
  saveTemplates(templates);
  return tmpl;
}

export function removeTemplate(id: string) {
  saveTemplates(getTemplates().filter((t) => t.id !== id));
}

export function initTemplates(): Promise<LogoTemplate[]> {
  return loadTemplates();
}
