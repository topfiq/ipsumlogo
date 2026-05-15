import { type InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-7 bg-white/5 border border-[var(--color-border)] rounded text-[var(--color-text-primary)] text-xs px-2 outline-none focus:border-[var(--color-accent)] transition-colors ${className}`}
      {...props}
    />
  );
}
