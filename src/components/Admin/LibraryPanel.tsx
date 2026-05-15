"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getLibrary, addToLibrary, removeFromLibrary, exportLibraryJson, importLibraryJson } from "@/lib/library";
import { sanitizeSvg, isValidSvg } from "@/lib/svg-sanitizer";
import type { LibraryShape } from "@/types";
import { Upload, X, Download, UploadIcon, Plus, Lock } from "lucide-react";

const ADMIN_PASSWORD = "ipsum2025";

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES = ["All", "Geometric", "Arrows", "Nature", "Symbols", "Abstract"];

export function AdminPanel({ open, onClose }: AdminPanelProps) {
  const [shapes, setShapes] = useState<LibraryShape[]>(() => getLibrary());
  const [activeCategory, setActiveCategory] = useState("All");
  const [shapeName, setShapeName] = useState("");
  const [svgPaste, setSvgPaste] = useState("");
  const [category, setCategory] = useState("Geometric");
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const refreshShapes = useCallback(() => {
    setShapes(getLibrary());
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setAuthError("");
      setPassword("");
    } else {
      setAuthError("Incorrect password");
    }
  };

  const handleClose = () => {
    setAuthenticated(false);
    setPassword("");
    setAuthError("");
    onClose();
  };

  const handleAddShape = () => {
    setError("");
    const name = shapeName.trim() || "Unnamed Shape";
    let svgContent = svgPaste.trim();

    if (!svgContent) { setError("Please paste or upload SVG code"); return; }
    if (!isValidSvg(svgContent)) { setError("Invalid or unsafe SVG detected"); return; }

    svgContent = sanitizeSvg(svgContent);
    addToLibrary({ name, category, svgContent });
    setShapeName("");
    setSvgPaste("");
    refreshShapes();
  };

  const handleRemove = (id: string) => {
    removeFromLibrary(id);
    refreshShapes();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024) { setError("File too large (max 50KB)"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (isValidSvg(content)) {
        setSvgPaste(content);
        setError("");
        if (!shapeName) setShapeName(file.name.replace(/\.svg$/i, ""));
      } else {
        setError("Invalid or unsafe SVG file");
      }
    };
    reader.readAsText(file);
  };

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
        if (ok) refreshShapes();
        else setError("Invalid library JSON");
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const filteredShapes = activeCategory === "All" ? shapes : shapes.filter((s) => s.category === activeCategory);

  if (!open) return null;

  if (!authenticated) {
    return (
      <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center" onClick={handleClose}>
        <div className="w-[360px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
            <h2 className="font-semibold text-[15px] flex items-center gap-2">
              <Lock size={16} className="text-[var(--color-accent)]" /> Admin Access
            </h2>
            <button className="w-7 h-7 rounded hover:bg-white/5 flex items-center justify-center text-[var(--color-text-muted)]" onClick={handleClose}>
              <X size={16} />
            </button>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <p className="text-sm text-[var(--color-text-secondary)]">Enter password to manage shape library.</p>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
              className="w-full h-9"
            />
            {authError && <p className="text-xs text-[var(--color-danger)]">{authError}</p>}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
              <Button variant="primary" className="flex-1" onClick={handleLogin}>Login</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center" onClick={handleClose}>
      <div
        className="w-[700px] max-h-[80vh] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
          <h2 className="font-semibold text-[15px]">Manage Shape Library</h2>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[var(--color-text-muted)]">Admin Panel</span>
            <button className="w-7 h-7 rounded hover:bg-white/5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] flex items-center justify-center" onClick={handleClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0">
          {/* Upload */}
          <div className="w-[260px] border-r border-[var(--color-border)] p-4 flex flex-col gap-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)]">Upload Shape</h3>
            <Input placeholder="Shape name" value={shapeName} onChange={(e) => setShapeName(e.target.value)} />
            <select
              className="h-7 bg-white/5 border border-[var(--color-border)] rounded text-[var(--color-text-primary)] text-xs px-2 outline-none cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <label className="flex-1 border-2 border-dashed border-[var(--color-border)] rounded-md flex flex-col items-center justify-center gap-2 p-6 text-[var(--color-text-muted)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)] transition-all cursor-pointer">
              <Upload size={32} className="opacity-50" />
              <span className="text-xs text-center">Drop SVG file here<br />or click to browse</span>
              <span className="text-[10px] opacity-70">SVG only (max 50KB)</span>
              <input type="file" accept=".svg" className="hidden" onChange={handleFileUpload} />
            </label>

            <p className="text-[10px] text-[var(--color-text-muted)] text-center">— or paste SVG code —</p>
            <textarea
              className="w-full h-20 bg-white/3 border border-[var(--color-border)] rounded text-[var(--color-text-secondary)] text-[11px] p-2 outline-none resize-y font-mono focus:border-[var(--color-accent)] placeholder:text-[var(--color-text-muted)]"
              placeholder="Paste SVG code..."
              value={svgPaste}
              onChange={(e) => setSvgPaste(e.target.value)}
            />

            {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}

            <Button variant="outline" className="w-full" onClick={handleAddShape}>
              <Plus size={14} /> Add to Library
            </Button>
          </div>

          {/* Library */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[var(--color-text-muted)]">
                Library <span className="font-normal normal-case">({shapes.length} shapes)</span>
              </h3>
            </div>

            <div className="flex gap-1 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`px-2.5 py-1 rounded-full text-[11px] border transition-all ${
                    activeCategory === cat
                      ? "bg-[var(--color-accent)] border-[var(--color-accent)] text-white"
                      : "border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]"
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {filteredShapes.map((shape) => (
                <div
                  key={shape.id}
                  className="aspect-square rounded border border-[var(--color-border)] bg-white/3 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] transition-all relative overflow-hidden group"
                >
                  <div className="w-9 h-9 text-[var(--color-text-secondary)]" dangerouslySetInnerHTML={{ __html: shape.svgContent }} />
                  <span className="text-[10px] text-[var(--color-text-muted)] text-center leading-tight">{shape.name}</span>
                  <button
                    className="absolute top-1 right-1 w-[18px] h-[18px] rounded-full bg-[var(--color-danger)] text-white hidden group-hover:flex items-center justify-center text-[10px]"
                    onClick={() => handleRemove(shape.id)}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              {filteredShapes.length === 0 && (
                <div className="col-span-3 text-center py-8 text-xs text-[var(--color-text-muted)]">No shapes in this category</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
          <span>Shapes stored in browser (no backend)</span>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download size={12} /> Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleImport}>
              <UploadIcon size={12} /> Import
            </Button>
            <Button variant="primary" size="sm" onClick={handleClose}>Done</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
