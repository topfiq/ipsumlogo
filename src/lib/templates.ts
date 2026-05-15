import type { LogoTemplate } from "@/types";

const TEMPLATES_KEY = "ipsumlogo_templates";

export function getTemplates(): LogoTemplate[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(TEMPLATES_KEY);
  if (raw) { try { return JSON.parse(raw); } catch { return []; } }
  return [];
}

export function saveTemplates(templates: LogoTemplate[]) {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
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
