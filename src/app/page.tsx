"use client";

import dynamic from "next/dynamic";

const EditorShell = dynamic(() => import("@/components/Editor/EditorShell"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-[#2c2c2c]">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#6366f1", borderTopColor: "transparent" }}
        />
        <p className="text-sm" style={{ color: "#808080" }}>Loading editor...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <EditorShell />;
}
