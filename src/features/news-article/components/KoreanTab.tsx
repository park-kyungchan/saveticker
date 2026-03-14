/**
 * 한국어 탭 — AI 번역 + PM 검수 파이프라인.
 * Korean tab — AI translation with PM QA pipeline visualization.
 *
 * PM이 AI 번역을 대조 검수하는 과정을 보여줌:
 * 1. 파이프라인 인디케이터 (AI 번역 → PM 대조 → 검수 완료)
 * 2. 원문/번역 대조 보기 토글
 * 3. PM 검수 노트 (용어 선택 근거, 구조적 오역 교정 등)
 */
import { useState } from "react";
import { cn } from "../../../lib/cn";
import { recipes } from "../../../theme/recipes";
import { Badge } from "../../../components/ui/Badge";
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

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "danger" }> = {
  approved: { label: "검수 완료", variant: "success" },
  reviewed: { label: "검수 중", variant: "warning" },
  pending: { label: "검수 대기", variant: "danger" },
};

export function KoreanTab({ article, className }: KoreanTabProps) {
  const badge = categoryBadgeKo[article.category] ?? categoryBadgeKo.general;
  const [showComparison, setShowComparison] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const status = statusConfig[article.translationStatus ?? "pending"] ?? statusConfig.pending;
  const hasNotes = article.translationNotes && article.translationNotes.length > 0;

  if (!article.summaryKo && !article.bodyKo) {
    return (
      <div data-label="korean.tab.empty" className="rounded-xl border glass-panel p-5 text-center text-sm text-ink-muted animate-in">
        번역이 준비 중입니다
      </div>
    );
  }

  return (
    <div data-label="korean.tab" className={cn("space-y-4 animate-in", className)}>
      {/* ─── Translation Pipeline Indicator ─── */}
      <div data-label="korean.tab.pipeline" className="rounded-xl border glass-panel p-4 space-y-3 relative">
        {/* Internal-only badge */}
        <span
          data-label="korean.tab.pipeline.internalBadge"
          className="absolute top-2.5 right-3 inline-flex items-center gap-1 rounded-full bg-accent-3/10 border border-accent-3/20 px-2 py-0.5 text-[9px] font-medium text-accent-3/70 uppercase tracking-wide"
        >
          <svg className="size-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          PM 내부 기능
        </span>
        <div className="flex items-center gap-2 text-[11px] font-medium text-ink-muted/70 uppercase tracking-wide">
          번역 파이프라인
        </div>
        <div className="flex items-center gap-0">
          {/* Step 1: AI */}
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center size-6 rounded-full bg-accent-5/15 text-accent-5">
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </span>
            <span className="text-[11px] font-medium text-ink/80">AI 번역</span>
          </div>

          {/* Arrow */}
          <svg className="size-4 text-ink-muted/30 mx-1.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>

          {/* Step 2: PM 대조 */}
          <div className="flex items-center gap-1.5">
            <span className="flex items-center justify-center size-6 rounded-full bg-brand/15 text-brand">
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
              </svg>
            </span>
            <span className="text-[11px] font-medium text-ink/80">PM 대조</span>
          </div>

          {/* Arrow */}
          <svg className="size-4 text-ink-muted/30 mx-1.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>

          {/* Step 3: Status */}
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </div>

      {/* ─── Controls: 대조 보기 + 검수 노트 토글 ─── */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          data-label="korean.tab.toggleComparison"
          onClick={() => setShowComparison((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all min-h-[44px]",
            showComparison
              ? "bg-brand/15 text-brand border-brand/25"
              : "bg-white/5 text-ink-muted/70 border-transparent hover:bg-white/8",
          )}
        >
          <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          원문 대조
        </button>

        {hasNotes && (
          <button
            type="button"
            data-label="korean.tab.toggleNotes"
            onClick={() => setShowNotes((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all min-h-[44px]",
              showNotes
                ? "bg-accent-3/15 text-accent-3 border-accent-3/25"
                : "bg-white/5 text-ink-muted/70 border-transparent hover:bg-white/8",
            )}
          >
            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
            </svg>
            검수 노트 ({article.translationNotes?.length ?? 0})
            <span className="ml-0.5 text-[8px] text-accent-3/50 uppercase">내부</span>
          </button>
        )}
      </div>

      {/* ─── PM 검수 노트 (토글) ─── */}
      {showNotes && hasNotes && (
        <div data-label="korean.tab.notes" className="rounded-xl border border-accent-3/20 glass-panel p-4 space-y-2.5 animate-in">
          <h4 className="text-xs font-medium uppercase tracking-wide text-accent-3/80">PM 번역 검수 노트</h4>
          <ul className="space-y-2">
            {article.translationNotes!.map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-ink/85 leading-relaxed">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-3/60" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ─── Main Content Card ─── */}
      <article className={cn(recipes.card.base, "glass-panel space-y-5")}>
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

        {/* ─── Title: 대조 모드 or 단독 ─── */}
        {article.titleKo && (
          <div data-label="korean.tab.title">
            {showComparison && (
              <p className="text-sm text-ink-muted/50 leading-snug mb-2 pb-2 border-b border-white/8">
                <span className="text-[10px] font-medium uppercase tracking-wide text-ink-muted/40 mr-1.5">EN</span>
                {article.title}
              </p>
            )}
            <h1 className="text-lg font-medium leading-snug text-ink">
              {showComparison && (
                <span className="text-[10px] font-medium uppercase tracking-wide text-brand/50 mr-1.5">KO</span>
              )}
              {article.titleKo}
            </h1>
          </div>
        )}

        {/* ─── 핵심 요약 (summaryKo = 의역) ─── */}
        {article.summaryKo && (
          <section data-label="korean.tab.summary" className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-medium uppercase tracking-wide text-ink-muted">핵심 요약</h2>
              <span className="text-[9px] rounded-full bg-accent-1/10 text-accent-1/70 px-1.5 py-px font-medium">의역</span>
            </div>
            {showComparison && (
              <div className="rounded-lg bg-white/[0.03] border border-white/8 p-3 mb-1">
                <p className="text-[10px] font-medium uppercase tracking-wide text-ink-muted/40 mb-1">EN Original</p>
                <p className="text-sm leading-relaxed text-ink-muted/60">{article.summary}</p>
              </div>
            )}
            <p className="text-base leading-[1.75] text-ink/90">{article.summaryKo}</p>
          </section>
        )}

        {/* ─── 전문 번역 (bodyKo = 직역) ─── */}
        {article.bodyKo && (
          <section data-label="korean.tab.body" className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-medium uppercase tracking-wide text-ink-muted">전문 번역</h2>
              <span className="text-[9px] rounded-full bg-info/10 text-info/70 px-1.5 py-px font-medium">직역</span>
            </div>
            {showComparison && (
              <ComparisonView original={article.body} translated={article.bodyKo} />
            )}
            {!showComparison && (
              <div className="whitespace-pre-wrap text-base leading-[1.75] text-ink/90">
                {article.bodyKo}
              </div>
            )}
          </section>
        )}
      </article>
    </div>
  );
}

/**
 * Paragraph-by-paragraph comparison view.
 * 문단별 원문/번역 대조 뷰.
 */
function ComparisonView({ original, translated }: { original: string; translated: string }) {
  const enParagraphs = original.split(/\n\n+/).filter(Boolean);
  const koParagraphs = translated.split(/\n\n+/).filter(Boolean);
  const maxLen = Math.max(enParagraphs.length, koParagraphs.length);

  return (
    <div data-label="korean.tab.comparison" className="space-y-3">
      {Array.from({ length: maxLen }, (_, i) => (
        <div key={i} className="rounded-xl border border-white/8 overflow-hidden">
          {/* EN paragraph */}
          {enParagraphs[i] && (
            <div className="p-3 bg-white/[0.02] border-b border-white/8">
              <span className="text-[9px] font-medium uppercase tracking-wide text-ink-muted/40 mb-1 block">EN</span>
              <p className="text-sm leading-relaxed text-ink-muted/60">{enParagraphs[i]}</p>
            </div>
          )}
          {/* KO paragraph */}
          {koParagraphs[i] && (
            <div className="p-3">
              <span className="text-[9px] font-medium uppercase tracking-wide text-brand/50 mb-1 block">KO</span>
              <p className="text-base leading-[1.75] text-ink/90">{koParagraphs[i]}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
