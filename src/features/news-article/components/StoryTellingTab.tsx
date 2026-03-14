/**
 * StoryTelling 탭 — 금융 초보자/노인 대상 블록 단위 쉬운 해설.
 * StoryTelling tab — block-level easy explanation for financial beginners & elderly.
 *
 * 한국어 탭과의 타겟 분리:
 * - 한국어 탭: 투자자/전문가 대상, 직역 기반, 원문 정확성 중시
 * - StoryTelling 탭: 금융문맹/노인 대상, 용어 풀이, 맥락 확장, 이해 용이성 중시
 */
import { useState } from "react";
import { cn } from "../../../lib/cn";
import { recipes } from "../../../theme/recipes";
import { Badge } from "../../../components/ui/Badge";
import { Spinner } from "../../../components/ui/Spinner";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface StoryTellingTabProps {
  article: Doc<"newsArticles">;
  explainer: Doc<"explainers"> | null | undefined;
  className?: string;
}

const difficultyBadge: Record<string, { label: string; variant: "success" | "warning" | "danger" }> = {
  beginner: { label: "입문", variant: "success" },
  intermediate: { label: "중급", variant: "warning" },
  advanced: { label: "심화", variant: "danger" },
};

export function StoryTellingTab({ article, explainer, className }: StoryTellingTabProps) {
  return (
    <div data-label="storytelling.tab" className={cn("space-y-4 animate-in", className)}>
      {explainer === undefined ? (
        <div data-label="storytelling.tab.loading" className="flex items-center justify-center py-12">
          <Spinner size="md" />
        </div>
      ) : explainer === null ? (
        <div data-label="storytelling.tab.empty" className="rounded-xl border glass-panel p-5 text-center text-sm text-ink-muted">
          StoryTelling 콘텐츠가 준비 중입니다
        </div>
      ) : (
        <ExplainerSection article={article} explainer={explainer} />
      )}
    </div>
  );
}

/** Estimate reading time in minutes */
function readingTime(text: string): number {
  return Math.max(1, Math.ceil(text.length / 500));
}

function ExplainerSection({ article, explainer }: { article: Doc<"newsArticles">; explainer: Doc<"explainers"> }) {
  const [showComparison, setShowComparison] = useState(false);

  const difficulty = difficultyBadge[explainer.difficultyLevel] ?? {
    label: explainer.difficultyLevel,
    variant: "success" as const,
  };
  const minutes = readingTime(explainer.storyBody);
  const hasBodyKo = !!article.bodyKo;

  return (
    <div data-label="storytelling.tab.explainer" className="space-y-4">
      {/* ─── Target Audience Banner ─── */}
      <div data-label="storytelling.tab.audience" className="rounded-xl border border-accent-1/15 glass-panel p-4 space-y-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center size-7 rounded-full bg-accent-1/12">
            <svg className="size-4 text-accent-1/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          </span>
          <div>
            <p className="text-[12px] font-medium text-ink">쉬운 금융 해설</p>
            <p className="text-[10px] text-ink-muted/50">금융 초보자 · 비전문가를 위한 설명</p>
          </div>
        </div>
      </div>

      {/* ─── Header Card ─── */}
      <article className={cn(recipes.card.base, "glass-panel space-y-4")}>
        {/* Difficulty + reading time */}
        <div className="flex items-center gap-2">
          <Badge variant={difficulty.variant}>{difficulty.label}</Badge>
          <span className="text-xs text-ink-muted/60">약 {minutes}분 읽기</span>
        </div>

        {/* Simplified title */}
        <h3 data-label="storytelling.tab.explainer.title" className="text-[18px] font-medium text-ink leading-snug">
          {explainer.simplifiedTitle}
        </h3>
      </article>

      {/* ─── Comparison Toggle ─── */}
      {hasBodyKo && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-label="storytelling.tab.toggleComparison"
            onClick={() => setShowComparison((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all min-h-[44px]",
              showComparison
                ? "bg-accent-1/15 text-accent-1 border-accent-1/25"
                : "bg-white/5 text-ink-muted/70 border-transparent hover:bg-white/8",
            )}
          >
            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            원문 번역 대조
          </button>
          <span className="text-[10px] text-ink-muted/40">블록별 비교</span>
        </div>
      )}

      {/* ─── Block-Level Content ─── */}
      {showComparison && hasBodyKo ? (
        <BlockComparisonView bodyKo={article.bodyKo!} storyBody={explainer.storyBody} />
      ) : (
        <StoryBodyView storyBody={explainer.storyBody} />
      )}

      {/* ─── Key Takeaways ─── */}
      {explainer.keyTakeaways.length > 0 && (
        <section data-label="storytelling.tab.explainer.takeaways" className={cn(recipes.card.base, "glass-panel space-y-3")}>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center size-5 rounded-full bg-success/12">
              <svg className="size-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </span>
            <h4 className="text-sm font-medium text-ink">한 줄로 정리하면</h4>
          </div>
          <ul className="space-y-3">
            {explainer.keyTakeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[15px] text-ink/90 leading-[1.75]">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent-1" />
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ─── Analogy ─── */}
      {explainer.analogy && (
        <section data-label="storytelling.tab.explainer.analogy" className={cn(recipes.card.base, "glass-panel space-y-2.5")}>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center size-5 rounded-full bg-warning/12">
              <svg className="size-3 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </span>
            <h4 className="text-sm font-medium text-ink">쉽게 비유하자면</h4>
          </div>
          <div className="rounded-xl bg-warning/[0.04] border border-warning/10 p-4">
            <p className="text-[15px] italic text-ink/80 leading-[1.75]">{explainer.analogy}</p>
          </div>
        </section>
      )}

      {/* ─── Personal Impact ─── */}
      {explainer.personalImpact && (
        <section data-label="storytelling.tab.explainer.impact" className={cn(recipes.card.base, "glass-panel space-y-2.5")}>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center size-5 rounded-full bg-danger/12">
              <svg className="size-3 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
              </svg>
            </span>
            <h4 className="text-sm font-medium text-ink">나에게 어떤 영향이 있을까?</h4>
          </div>
          <div className="rounded-xl bg-danger/[0.04] border border-danger/10 p-4">
            <p className="text-[15px] text-ink/85 leading-[1.75]">{explainer.personalImpact}</p>
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Block-by-block comparison: Korean translation vs simplified story explanation.
 * 블록별 대조: 한국어 번역(직역) vs 쉬운 StoryTelling 해설.
 */
function BlockComparisonView({ bodyKo, storyBody }: { bodyKo: string; storyBody: string }) {
  const koParagraphs = bodyKo.split(/\n\n+/).filter(Boolean);
  const storyParagraphs = storyBody.split(/\n\n+/).filter(Boolean);
  const maxLen = Math.max(koParagraphs.length, storyParagraphs.length);

  return (
    <div data-label="storytelling.tab.comparison" className="space-y-3">
      {/* Legend */}
      <div className="flex items-center gap-3 px-1">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-info/60" />
          <span className="text-[10px] text-ink-muted/50">한국어 번역 (직역)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-accent-1/60" />
          <span className="text-[10px] text-ink-muted/50">쉬운 설명 (StoryTelling)</span>
        </div>
      </div>

      {Array.from({ length: maxLen }, (_, i) => (
        <div key={i} className="rounded-xl border border-white/8 overflow-hidden">
          {/* KO translation paragraph */}
          {koParagraphs[i] && (
            <div className="p-4 bg-white/[0.02] border-b border-white/8">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="size-2 rounded-full bg-info/60" />
                <span className="text-[9px] font-medium uppercase tracking-wide text-info/50">한국어 번역</span>
              </div>
              <p className="text-sm leading-relaxed text-ink-muted/60">{koParagraphs[i]}</p>
            </div>
          )}
          {/* Story explanation paragraph */}
          {storyParagraphs[i] && (
            <div className="p-4 bg-accent-1/[0.02]">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="size-2 rounded-full bg-accent-1/60" />
                <span className="text-[9px] font-medium uppercase tracking-wide text-accent-1/50">쉬운 설명</span>
              </div>
              <p className="text-[15px] leading-[1.85] text-ink/90">{storyParagraphs[i]}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Default story body view — paragraph-by-paragraph with visual breathing room.
 * 기본 스토리 본문 뷰 — 문단별 시각적 여백.
 */
function StoryBodyView({ storyBody }: { storyBody: string }) {
  const paragraphs = storyBody.split(/\n\n+/).filter(Boolean);

  return (
    <div data-label="storytelling.tab.storyBody" className={cn(recipes.card.base, "glass-panel space-y-5")}>
      {paragraphs.map((para, i) => (
        <p key={i} className="text-[15px] leading-[1.85] text-ink/90">
          {para}
        </p>
      ))}
    </div>
  );
}
