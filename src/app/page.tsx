"use client";

import { useEffect, useState } from "react";

let EditorShell: React.ComponentType | null = null;

export default function Home() {
  const [Component, setComponent] = useState<React.ComponentType | null>(EditorShell);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Component) return;
    import("@/components/Editor/EditorShell")
      .then((mod) => {
        EditorShell = mod.default;
        setComponent(() => mod.default);
      })
      .catch((err) => {
        setError(err.message || "Failed to load editor");
      });
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#2c2c2c]">
        <div className="flex flex-col items-center gap-4 max-w-md text-center p-8">
          <div className="w-12 h-12 rounded-full bg-[#ef4444] flex items-center justify-center text-white text-xl font-bold">!</div>
          <p className="text-sm" style={{ color: "#e0e0e0" }}>Failed to load editor</p>
          <p className="text-xs" style={{ color: "#808080" }}>{error}</p>
          <button
            className="px-4 py-2 rounded bg-[#6366f1] text-white text-sm"
            onClick={() => { setError(null); setComponent(null); }}
          >Retry</button>
        </div>
      </div>
    );
  }

  if (Component) {
    return <Component />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#2c2c2c]">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#6366f1", borderTopColor: "transparent" }}
        />
        <p className="text-sm" style={{ color: "#808080" }}>Loading editor...</p>
      </div>
    </div>
  );
}
