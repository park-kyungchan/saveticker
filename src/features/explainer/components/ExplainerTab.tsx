/**
 * Full explainer view for an article — difficulty, story body, takeaways, analogy, personal impact.
 * 기사의 전체 해설 보기 — 난이도, 스토리 본문, 핵심 인사이트, 비유, 개인 영향.
 */
import type { Doc } from "../../../../convex/_generated/dataModel";
import { cn } from "../../../lib/cn";
import { Badge } from "../../../components/ui/Badge";

interface ExplainerTabProps {
  /** Explainer document / 해설 문서 */
  explainer: Doc<"explainers">;
  /** Additional CSS classes / 추가 CSS 클래스 */
  className?: string;
}

/** Difficulty badge mapping / 난이도 뱃지 매핑 */
const difficultyBadge: Record<string, { label: string; variant: "success" | "warning" | "danger" }> = {
  beginner: { label: "초급", variant: "success" },
  intermediate: { label: "중급", variant: "warning" },
  advanced: { label: "고급", variant: "danger" },
};

export function ExplainerTab({ explainer, className }: ExplainerTabProps) {
  const difficulty = difficultyBadge[explainer.difficultyLevel] ?? {
    label: explainer.difficultyLevel,
    variant: "success" as const,
  };

  return (
    <article
      data-label="explainer.tab"
      className={cn("rounded-xl border glass-panel p-5 shadow-md animate-in space-y-4", className)}
    >
      {/* Header: difficulty badge / 헤더: 난이도 뱃지 */}
      <div data-label="explainer.tab.header" className="flex items-center gap-2">
        <Badge variant={difficulty.variant}>{difficulty.label}</Badge>
      </div>

      {/* Simplified title / 쉬운 제목 */}
      <h3
        data-label="explainer.tab.title"
        className="text-base font-medium text-ink"
      >
        {explainer.simplifiedTitle}
      </h3>

      {/* Story body / 스토리 본문 */}
      <p
        data-label="explainer.tab.body"
        className="text-sm leading-relaxed text-ink/90"
      >
        {explainer.storyBody}
      </p>

      {/* Key takeaways / 핵심 인사이트 */}
      {explainer.keyTakeaways.length > 0 && (
        <ul data-label="explainer.tab.takeaways" className="space-y-2">
          {explainer.keyTakeaways.map((takeaway, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink/90">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-1" />
              {takeaway}
            </li>
          ))}
        </ul>
      )}

      {/* Analogy section / 비유 섹션 */}
      {explainer.analogy && (
        <div
          data-label="explainer.tab.analogy"
          className="rounded-xl border glass-panel p-3"
        >
          <p className="text-sm italic text-ink/80">{explainer.analogy}</p>
        </div>
      )}

      {/* Personal impact / 나에게 어떤 영향? */}
      {explainer.personalImpact && (
        <section data-label="explainer.tab.personalImpact">
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-muted">
            나에게 어떤 영향?
          </h4>
          <div className="rounded-xl border glass-panel p-3">
            <p className="text-sm text-ink/85">{explainer.personalImpact}</p>
          </div>
        </section>
      )}
    </article>
  );
}
