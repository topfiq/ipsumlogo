import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "icon";
}

export function Button({
  variant = "default",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed text-sm whitespace-nowrap cursor-pointer";

  const variants: Record<string, string> = {
    default: "bg-transparent text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)] active:bg-white/10",
    primary: "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]",
    danger: "bg-transparent border border-[var(--color-danger)] text-[var(--color-danger)] hover:bg-red-500/10",
    outline: "border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)]",
    ghost: "bg-transparent text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text-primary)]",
  };

  const sizes: Record<string, string> = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5",
    icon: "p-1.5 aspect-square",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
