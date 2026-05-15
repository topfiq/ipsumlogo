"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Toolbar } from "@/components/Editor/Toolbar";
import { Sidebar } from "@/components/Editor/Sidebar";
import { LeftPanel } from "@/components/Editor/LeftPanel";
import { RightPanel } from "@/components/Editor/RightPanel";
import { StatusBar } from "@/components/Editor/StatusBar";
import { ProBanner } from "@/components/Editor/ProBanner";
import { useEditorStore } from "@/store/useEditorStore";
import { getStoredLicense } from "@/lib/license";
import { preloadFonts } from "@/lib/fonts";
import { Library } from "lucide-react";

const Canvas = dynamic(() => import("@/components/Editor/Canvas"), {
  ssr: false,
  loading: () => (
    <main style={{ flex: 1, background: "var(--color-bg-canvas)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#6366f1", borderTopColor: "transparent" }} />
    </main>
  ),
});

export default function EditorShell() {
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
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, background: "var(--color-bg-canvas)" }}>
      <Toolbar />
      <ProBanner />

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar />
        <LeftPanel />
        <Canvas />
        <RightPanel />
      </div>

      <StatusBar />

      <Link
        href="/admin"
        className="fixed bottom-10 right-4 z-50 flex items-center gap-1.5 px-3 py-2 rounded-md border border-dashed border-[var(--color-accent)] bg-[var(--color-bg-toolbar)] text-[var(--color-accent)] text-xs hover:bg-[var(--color-accent)] hover:text-white transition-all shadow-lg"
        style={{ textDecoration: "none" }}
      >
        <Library size={14} />
        <span className="hidden sm:inline">Library</span>
      </Link>
    </div>
  );
}
