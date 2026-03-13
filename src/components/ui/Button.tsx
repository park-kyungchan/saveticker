import { type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary: "bg-brand/80 text-white hover:bg-brand-hover hover:shadow-glow-brand",
  secondary: "glass-panel text-ink hover:border-white/25",
  danger: "bg-danger/80 text-white hover:bg-danger/90",
  ghost: "bg-transparent text-ink-muted hover:bg-white/5",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-2 text-sm min-h-[44px]",
  md: "px-4 py-2.5 text-sm min-h-[44px]",
  lg: "px-6 py-3 text-base min-h-[48px]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      data-label="shared.button"
      className={cn(
        "inline-flex items-center justify-center rounded-lg border font-medium transition-all duration-300 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    />
  );
}
