"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { storeLicense, validateLicenseKey } from "@/lib/license";
import { useEditorStore } from "@/store/useEditorStore";
import { Crown, X, ShieldCheck } from "lucide-react";

export function ProBanner() {
  const { isPro, setPro, setLicenseEmail, setWatermark } = useEditorStore();
  const [showModal, setShowModal] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleActivate = () => {
    setError("");
    const key = licenseKey.trim();
    if (!key) { setError("Enter a license key"); return; }
    const ok = storeLicense(key);
    if (ok) {
      const decoded = validateLicenseKey(key);
      setPro(true);
      if (decoded) setLicenseEmail(decoded.email);
      setWatermark(false);
      setSuccess(true);
      setTimeout(() => setShowModal(false), 1500);
    } else {
      setError("Invalid or expired license key");
    }
  };

  if (success || isPro) {
    return (
      <button
        className="fixed top-14 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-accent)] text-white text-xs shadow-lg"
        title="Pro active"
      >
        <Crown size={12} /> Pro
      </button>
    );
  }

  return (
    <>
      <button
        className="fixed top-14 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--color-accent)] text-[var(--color-accent)] text-xs hover:bg-[var(--color-accent)] hover:text-white transition-all shadow-lg"
        onClick={() => setShowModal(true)}
      >
        <Crown size={12} /> Upgrade
      </button>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-[400px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
              <h2 className="font-semibold text-[15px] flex items-center gap-2">
                <Crown size={16} className="text-[var(--color-accent)]" />
                Activate Pro License
              </h2>
              <button
                className="w-7 h-7 rounded hover:bg-white/5 flex items-center justify-center text-[var(--color-text-muted)]"
                onClick={() => setShowModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-4">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Enter your license key to unlock all Pro features.
              </p>

              <Input
                placeholder="Paste license key here..."
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                className="w-full h-9 font-mono text-xs"
              />

              {error && (
                <p className="text-xs text-[var(--color-danger)]">{error}</p>
              )}

              {success && (
                <p className="text-xs text-[var(--color-success)] flex items-center gap-1">
                  <ShieldCheck size={14} /> License activated!
                </p>
              )}

              <div className="text-[10px] text-[var(--color-text-muted)] leading-relaxed">
                <p>Pro features include:</p>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li>Brand Kit</li>
                  <li>Multi-Artboard (up to 5)</li>
                  <li>Export HD 4K</li>
                  <li>Text on Path</li>
                  <li>Gradient Editor Pro</li>
                  <li>No watermark on export</li>
                  <li>SVG Node Editor</li>
                  <li>Batch Export</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleActivate}>
                  <ShieldCheck size={14} /> Activate
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
