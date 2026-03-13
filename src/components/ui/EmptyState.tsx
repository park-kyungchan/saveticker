import { type ReactNode } from "react";
import { cn } from "../../lib/cn";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div data-label="shared.emptyState" className={cn("flex flex-col items-center justify-center py-16 text-center animate-in", className)}>
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border glass-panel shadow-sm" aria-hidden="true">
        <svg className="size-6 text-ink-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h2.21a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
        </svg>
      </div>
      <h3 data-label="shared.emptyState.title" className="text-sm font-medium text-ink">{title}</h3>
      {description && <p data-label="shared.emptyState.description" className="mt-1.5 text-sm text-ink-muted max-w-[260px]">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
