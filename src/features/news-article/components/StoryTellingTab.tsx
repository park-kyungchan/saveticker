/**
 * StoryTelling 탭 — 쉬운 해설 카드.
 * StoryTelling tab — explainer card.
 */
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

export function StoryTellingTab({ article: _article, explainer, className }: StoryTellingTabProps) {
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
        <ExplainerSection explainer={explainer} />
      )}
    </div>
  );
}

/** Extract one-line summary from storyBody (first sentence) */
function extractOneLine(body: string): string {
  const match = body.match(/^[^.!?]+[.!?]/);
  return match ? match[0].trim() : body.split("\n")[0].slice(0, 80);
}

/** Estimate reading time in minutes */
function readingTime(text: string): number {
  return Math.max(1, Math.ceil(text.length / 500));
}

function ExplainerSection({ explainer }: { explainer: Doc<"explainers"> }) {
  const difficulty = difficultyBadge[explainer.difficultyLevel] ?? {
    label: explainer.difficultyLevel,
    variant: "success" as const,
  };
  const oneLine = extractOneLine(explainer.storyBody);
  const minutes = readingTime(explainer.storyBody);

  return (
    <article data-label="storytelling.tab.explainer" className={cn(recipes.card.base, "glass-panel space-y-4")}>
      {/* Header: difficulty + reading time */}
      <div className="flex items-center gap-2">
        <Badge variant={difficulty.variant}>{difficulty.label}</Badge>
        <span className="text-xs text-ink-muted/60">약 {minutes}분 읽기</span>
      </div>

      {/* One-line summary — prominent for elderly readability */}
      <div data-label="storytelling.tab.explainer.oneLine" className="rounded-xl glass-panel-heavy border border-brand/15 p-3.5">
        <p className="text-lg font-medium text-ink leading-snug">
          {oneLine}
        </p>
      </div>

      <h3 data-label="storytelling.tab.explainer.title" className="text-lg font-medium text-ink">
        {explainer.simplifiedTitle}
      </h3>

      <p data-label="storytelling.tab.explainer.body" className="whitespace-pre-wrap text-base leading-[1.75] text-ink/90">
        {explainer.storyBody}
      </p>

      {explainer.keyTakeaways.length > 0 && (
        <section data-label="storytelling.tab.explainer.takeaways" className="space-y-2.5">
          <h4 className="text-sm font-medium uppercase tracking-wide text-ink-muted">핵심 정리</h4>
          <ul className="space-y-2.5">
            {explainer.keyTakeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2.5 text-base text-ink/90 leading-relaxed">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-1" />
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}

      {explainer.analogy && (
        <section data-label="storytelling.tab.explainer.analogy">
          <h4 className="mb-1.5 text-sm font-medium uppercase tracking-wide text-ink-muted">쉽게 비유하자면</h4>
          <div className="rounded-xl border glass-panel p-4">
            <p className="text-[15px] italic text-ink/80 leading-relaxed">{explainer.analogy}</p>
          </div>
        </section>
      )}

      {explainer.personalImpact && (
        <section data-label="storytelling.tab.explainer.impact">
          <h4 className="mb-1.5 text-sm font-medium uppercase tracking-wide text-ink-muted">나에게 어떤 영향이 있을까?</h4>
          <div className="rounded-xl border glass-panel p-4">
            <p className="text-[15px] text-ink/85 leading-relaxed">{explainer.personalImpact}</p>
          </div>
        </section>
      )}
    </article>
  );
}
