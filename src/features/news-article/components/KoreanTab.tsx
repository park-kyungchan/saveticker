/**
 * 한국어 탭 — 의역+요약 / 전문 번역 two-section design.
 * Korean tab — localized summary + faithful body translation.
 */
import { cn } from "../../../lib/cn";
import { recipes } from "../../../theme/recipes";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface KoreanTabProps {
  article: Doc<"newsArticles">;
  className?: string;
}

const categoryBadgeKo: Record<string, { label: string; style: string }> = {
  general: { label: "일반", style: "bg-white/10 text-ink" },
  breaking: { label: "속보", style: "bg-danger/15 text-danger" },
  analysis: { label: "분석", style: "bg-info/15 text-info" },
};

export function KoreanTab({ article, className }: KoreanTabProps) {
  const badge = categoryBadgeKo[article.category] ?? categoryBadgeKo.general;

  if (!article.summaryKo && !article.bodyKo) {
    return (
      <div data-label="korean.tab.empty" className="rounded-xl border glass-panel p-5 text-center text-sm text-ink-muted animate-in">
        번역이 준비 중입니다
      </div>
    );
  }

  return (
    <article
      data-label="korean.tab"
      className={cn(recipes.card.base, "glass-panel animate-in space-y-5", className)}
    >
      {/* Category badge */}
      <span
        data-label="korean.tab.category"
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase",
          badge.style,
        )}
      >
        {badge.label}
      </span>

      {/* Korean title */}
      {article.titleKo && (
        <h1 data-label="korean.tab.title" className="text-lg font-medium leading-snug text-ink">
          {article.titleKo}
        </h1>
      )}

      {/* Section 1: 핵심 요약 (summaryKo) */}
      {article.summaryKo && (
        <section data-label="korean.tab.summary" className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-wide text-ink-muted">핵심 요약</h2>
          <p className="text-sm leading-relaxed text-ink/90">{article.summaryKo}</p>
        </section>
      )}

      {/* Section 2: 전문 번역 (bodyKo) */}
      {article.bodyKo && (
        <section data-label="korean.tab.body" className="space-y-2">
          <h2 className="text-xs font-medium uppercase tracking-wide text-ink-muted">전문 번역</h2>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink/90">
            {article.bodyKo}
          </div>
        </section>
      )}
    </article>
  );
}
