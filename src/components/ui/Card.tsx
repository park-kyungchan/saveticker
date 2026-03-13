import { type ReactNode } from "react";
import { cn } from "../../lib/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div data-label="shared.card" className={cn("rounded-xl border glass-panel p-5 shadow-md", className)}>
      {children}
    </div>
  );
}
