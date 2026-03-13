/**
 * Explainer Tab — progressive disclosure layout with accordion sections.
 * 해설 탭 — 아코디언 섹션을 사용한 점진적 공개 레이아웃.
 */
import type { Doc } from "../../../../convex/_generated/dataModel";
import { cn } from "../../../lib/cn";
import { Badge } from "../../../components/ui/Badge";
import { ExplainerAccordion } from "./ExplainerAccordion";
import { ExplainerStatCards } from "./ExplainerStatCards";
import { extractStats } from "../lib/extractStats";

interface ExplainerTabProps {
  explainer: Doc<"explainers">;
  className?: string;
}

const difficultyBadge: Record<string, { label: string; variant: "success" | "warning" | "danger" }> = {
  beginner: { label: "초급", variant: "success" },
  intermediate: { label: "중급", variant: "warning" },
  advanced: { label: "고급", variant: "danger" },
};

/** Estimate Korean reading time (chars / 500 cpm) */
function readingTime(text: string): number {
  return Math.max(1, Math.ceil(text.length / 500));
}

export function ExplainerTab({ explainer, className }: ExplainerTabProps) {
  const difficulty = difficultyBadge[explainer.difficultyLevel] ?? {
    label: explainer.difficultyLevel,
    variant: "success" as const,
  };

  const fullText = [explainer.storyBody, explainer.analogy, explainer.personalImpact].filter(Boolean).join(" ");
  const minutes = readingTime(fullText);
  const stats = extractStats(explainer.storyBody);

  return (
    <article
      data-label="explainer.tab"
      className={cn("rounded-xl border glass-panel p-5 shadow-md animate-in space-y-4", className)}
    >
      {/* Header: difficulty badge + reading time */}
      <div data-label="explainer.tab.header" className="flex items-center gap-2">
        <Badge variant={difficulty.variant}>{difficulty.label}</Badge>
        <span className="text-[10px] text-ink-muted/50">약 {minutes}분</span>
      </div>

      {/* Simplified title */}
      <h3
        data-label="explainer.tab.title"
        className="text-base font-medium text-ink"
      >
        {explainer.simplifiedTitle}
      </h3>

      {/* Stat cards */}
      {stats.length > 0 && <ExplainerStatCards stats={stats} />}

      {/* Accordion sections */}
      <div className="space-y-2">
        {/* 한줄 요약 — default open */}
        <ExplainerAccordion title="한줄 요약" defaultOpen>
          <p>{explainer.storyBody}</p>
        </ExplainerAccordion>

        {/* 핵심 정리 */}
        {explainer.keyTakeaways.length > 0 && (
          <ExplainerAccordion title="핵심 정리">
            <ul className="space-y-2">
              {explainer.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-1" />
                  {takeaway}
                </li>
              ))}
            </ul>
          </ExplainerAccordion>
        )}

        {/* 비유 */}
        {explainer.analogy && (
          <ExplainerAccordion title="비유">
            <p className="italic text-ink/80">{explainer.analogy}</p>
          </ExplainerAccordion>
        )}

        {/* 나에게 어떤 영향? */}
        {explainer.personalImpact && (
          <ExplainerAccordion title="나에게 어떤 영향?">
            <p data-label="explainer.tab.personalImpact">{explainer.personalImpact}</p>
          </ExplainerAccordion>
        )}
      </div>
    </article>
  );
}
