/**
 * Explainer Stat Cards — 핵심 수치 카드 그리드.
 * Grid of stat cards extracted from explainer text.
 */
import { cn } from "../../../lib/cn";
import type { StatItem } from "../lib/extractStats";

interface ExplainerStatCardsProps {
  stats: StatItem[];
  className?: string;
}

export function ExplainerStatCards({ stats, className }: ExplainerStatCardsProps) {
  if (stats.length === 0) return null;

  return (
    <div
      data-label="explainer.statCards"
      className={cn(
        "grid gap-2",
        stats.length === 1 ? "grid-cols-1" : stats.length === 2 ? "grid-cols-2" : "grid-cols-3",
        className,
      )}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          data-label={`explainer.statCards.item[${i}]`}
          className="rounded-xl border glass-panel p-3 text-center space-y-1"
        >
          <p className={cn("text-base font-bold tabular-nums", stat.color)}>
            {stat.value}
          </p>
          <p className="text-[10px] text-ink-muted/70 leading-tight line-clamp-2">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
