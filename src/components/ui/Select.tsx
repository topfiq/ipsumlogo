import { type SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = "", children, ...props }: SelectProps) {
  return (
    <select
      className={`h-7 bg-white/5 border border-[var(--color-border)] rounded text-[var(--color-text-primary)] text-xs px-2 outline-none focus:border-[var(--color-accent)] cursor-pointer appearance-none bg-no-repeat ${className}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23808080' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
        backgroundPosition: "right 0.5rem center",
        backgroundSize: "1.5em 1.5em",
        paddingRight: "2rem",
      }}
      {...props}
    >
      {children}
    </select>
  );
}
