"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Toolbar } from "@/components/Editor/Toolbar";
import { Sidebar } from "@/components/Editor/Sidebar";
import { LeftPanel } from "@/components/Editor/LeftPanel";
import { RightPanel } from "@/components/Editor/RightPanel";
import { StatusBar } from "@/components/Editor/StatusBar";
import { AdminPanel } from "@/components/Admin/LibraryPanel";
import { ProBanner } from "@/components/Editor/ProBanner";
import { useEditorStore } from "@/store/useEditorStore";
import { getStoredLicense } from "@/lib/license";
import { preloadFonts } from "@/lib/fonts";
import { Library } from "lucide-react";

const Canvas = dynamic(() => import("@/components/Editor/Canvas"), {
  ssr: false,
  loading: () => (
    <main className="flex-1 bg-[#2c2c2c] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#6366f1", borderTopColor: "transparent" }} />
    </main>
  ),
});

export default function EditorShell() {
  const [showAdmin, setShowAdmin] = useState(false);
  const { setPro, setLicenseEmail, setWatermark } = useEditorStore();

  useEffect(() => {
    preloadFonts();
    const license = getStoredLicense();
    if (license) {
      setPro(true);
      setLicenseEmail(license.email);
      setWatermark(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-canvas)]">
      <Toolbar />
      <ProBanner />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <LeftPanel />
        <Canvas />
        <RightPanel />
      </div>
      <StatusBar />
      <button
        className="fixed bottom-10 right-4 z-50 flex items-center gap-1.5 px-3 py-2 rounded-md border border-dashed border-[var(--color-accent)] bg-[var(--color-bg-toolbar)] text-[var(--color-accent)] text-xs hover:bg-[var(--color-accent)] hover:text-white transition-all shadow-lg"
        onClick={() => setShowAdmin(true)}
      >
        <Library size={14} />
        <span className="hidden sm:inline">Library</span>
      </button>
      <AdminPanel open={showAdmin} onClose={() => setShowAdmin(false)} />
    </div>
  );
}
