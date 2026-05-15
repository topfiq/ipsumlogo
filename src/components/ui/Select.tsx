import { type SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = "", children, ...props }: SelectProps) {
  return (
    <select
      className={`h-7 bg-white/10 border border-[var(--color-border)] rounded text-[var(--color-text-primary)] text-xs pl-2 pr-7 outline-none focus:border-[var(--color-accent)] cursor-pointer appearance-none ${className}`}
      style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23808080' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
        backgroundSize: "12px",
        WebkitAppearance: "none",
        MozAppearance: "none",
      }}
      {...props}
    >
      {children}
    </select>
  );
}
