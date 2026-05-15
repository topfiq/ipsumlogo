"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getLibrary, addToLibrary, removeFromLibrary, exportLibraryJson, importLibraryJson } from "@/lib/library";
import { sanitizeSvg, isValidSvg } from "@/lib/svg-sanitizer";
import type { LibraryShape } from "@/types";
import { Upload, X, Download, UploadIcon, Plus, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

const ADMIN_PASSWORD = "ipsum2025";
const CATEGORIES = ["All", "Geometric", "Arrows", "Nature", "Symbols", "Abstract"];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-canvas)]">
        <div className="w-[360px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden shadow-2xl">
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <h2 className="font-semibold text-[15px] flex items-center gap-2 text-[var(--color-text-primary)]">
              <Lock size={16} className="text-[var(--color-accent)]" /> Admin Access
            </h2>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <p className="text-sm text-[var(--color-text-secondary)]">Enter password to manage shape library.</p>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (password === ADMIN_PASSWORD) { setAuthenticated(true); setAuthError(""); }
                  else setAuthError("Incorrect password");
                }
              }}
              className="w-full h-9"
            />
            {authError && <p className="text-xs text-[var(--color-danger)]">{authError}</p>}
            <Button variant="primary" className="w-full" onClick={() => {
              if (password === ADMIN_PASSWORD) { setAuthenticated(true); setAuthError(""); }
              else setAuthError("Incorrect password");
            }}>
              <Lock size={14} /> Login
            </Button>
            <Link href="/" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] text-center transition-colors">
              ← Back to editor
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <LibraryManager />;
}

function LibraryManager() {
  const [shapes, setShapes] = useState<LibraryShape[]>(() => getLibrary());
  const [activeCategory, setActiveCategory] = useState("All");
  const [shapeName, setShapeName] = useState("");
  const [svgPaste, setSvgPaste] = useState("");
  const [category, setCategory] = useState("Geometric");
  const [error, setError] = useState("");

  const refresh = () => setShapes(getLibrary());

  const handleAdd = () => {
    setError("");
    const name = shapeName.trim() || "Unnamed Shape";
    let svgContent = svgPaste.trim();
    if (!svgContent) { setError("Please paste or upload SVG code"); return; }
    if (!isValidSvg(svgContent)) { setError("Invalid or unsafe SVG detected"); return; }
    svgContent = sanitizeSvg(svgContent);
    addToLibrary({ name, category, svgContent });
    setShapeName(""); setSvgPaste("");
    refresh();
  };

  const handleRemove = (id: string) => { removeFromLibrary(id); refresh(); };

  const handleExport = () => {
    const json = exportLibraryJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "ipsumlogo-library.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const ok = importLibraryJson(ev.target?.result as string);
        if (ok) refresh(); else setError("Invalid library JSON");
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024) { setError("File too large (max 50KB)"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (isValidSvg(content)) { setSvgPaste(content); setError(""); if (!shapeName) setShapeName(file.name.replace(/\.svg$/i, "")); }
      else setError("Invalid or unsafe SVG file");
    };
    reader.readAsText(file);
  };

  const filtered = activeCategory === "All" ? shapes : shapes.filter((s) => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-[var(--color-bg-canvas)]">
      <header className="flex items-center justify-between h-12 bg-[var(--color-bg-toolbar)] border-b border-[var(--color-border)] px-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <h1 className="font-bold text-[15px] tracking-[-0.3px] text-[var(--color-text-primary)]">Shape Library Admin</h1>
        </div>
        <span className="text-[11px] text-[var(--color-text-muted)]">{shapes.length} shapes</span>
      </header>

      <div className="flex" style={{ height: "calc(100vh - 48px)" }}>
        {/* Upload Panel */}
        <div className="w-[280px] border-r border-[var(--color-border)] bg-[var(--color-bg-sidebar)] p-4 flex flex-col gap-3 overflow-y-auto">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)]">Add Shape</h3>
          <Input placeholder="Shape name" value={shapeName} onChange={(e) => setShapeName(e.target.value)} />
          <select
            className="h-7 bg-white/5 border border-[var(--color-border)] rounded text-[var(--color-text-primary)] text-xs px-2 outline-none cursor-pointer"
            value={category} onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.filter((c) => c !== "All").map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>

          <label className="flex-1 border-2 border-dashed border-[var(--color-border)] rounded-md flex flex-col items-center justify-center gap-2 p-4 text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] transition-all cursor-pointer min-h-[140px]">
            <Upload size={28} className="opacity-50" />
            <span className="text-xs text-center">Drop SVG file here<br />or click to browse</span>
            <span className="text-[10px] opacity-70">SVG only (max 50KB)</span>
            <input type="file" accept=".svg" className="hidden" onChange={handleFile} />
          </label>

          <p className="text-[10px] text-[var(--color-text-muted)] text-center">— or paste SVG —</p>
          <textarea
            className="w-full h-20 bg-white/3 border border-[var(--color-border)] rounded text-[var(--color-text-secondary)] text-[11px] p-2 outline-none resize-y font-mono focus:border-[var(--color-accent)] placeholder:text-[var(--color-text-muted)]"
            placeholder="Paste SVG code..."
            value={svgPaste} onChange={(e) => setSvgPaste(e.target.value)}
          />
          {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
          <Button variant="outline" className="w-full" onClick={handleAdd}><Plus size={14} /> Add to Library</Button>

          <div className="border-t border-[var(--color-border)] pt-3 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={handleExport}><Download size={12} /> Export</Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={handleImport}><UploadIcon size={12} /> Import</Button>
          </div>
        </div>

        {/* Library Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`px-2.5 py-1 rounded-full text-[11px] border transition-all ${
                  activeCategory === cat
                    ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white"
                    : "border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]"
                }`}
                onClick={() => setActiveCategory(cat)}
              >{cat}</button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-3">
            {filtered.map((shape) => (
              <div
                key={shape.id}
                className="aspect-square rounded-lg border border-[var(--color-border)] bg-white/3 flex flex-col items-center justify-center gap-2 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] transition-all relative overflow-hidden group p-3"
              >
                <div className="w-12 h-12 text-[var(--color-text-secondary)] flex items-center justify-center" dangerouslySetInnerHTML={{ __html: shape.svgContent }} />
                <span className="text-[11px] text-[var(--color-text-muted)] text-center leading-tight truncate w-full">{shape.name}</span>
                <button
                  className="absolute top-2 right-2 w-[20px] h-[20px] rounded-full bg-[var(--color-danger)] text-white hidden group-hover:flex items-center justify-center text-[11px]"
                  onClick={() => handleRemove(shape.id)}
                ><X size={11} /></button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-4 text-center py-16 text-xs text-[var(--color-text-muted)]">No shapes yet. Upload one on the left.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
