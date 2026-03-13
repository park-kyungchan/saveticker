/**
 * StoryTelling 탭 — 관련 스토리, 영향 체인, 해설.
 * StoryTelling tab — related story, impact chains, explainer.
 */
import { useNavigate } from "react-router";
import { cn } from "../../../lib/cn";
import { recipes } from "../../../theme/recipes";
import { Badge } from "../../../components/ui/Badge";
import { Spinner } from "../../../components/ui/Spinner";
import { useThreadById } from "../../story-thread/hooks/useThreadById";
import { useChainsByThread } from "../../impact-chain/hooks/useChainsByThread";
import { useChainNodes } from "../../impact-chain/hooks/useChainNodes";
import { ImpactNodeTree } from "../../impact-chain/components/ImpactNodeTree";
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
  const navigate = useNavigate();
  const thread = useThreadById(article.storyThreadId);
  const chains = useChainsByThread(article.storyThreadId);

  return (
    <div data-label="storytelling.tab" className={cn("space-y-4 animate-in", className)}>
      {/* Section A: 관련 스토리 */}
      {article.storyThreadId && thread && (
        <button
          type="button"
          data-label="storytelling.tab.thread"
          onClick={() => navigate(`/threads/${article.storyThreadId}`)}
          className={cn(recipes.card.base, recipes.card.hover, "flex w-full items-center justify-between text-left")}
        >
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">관련 스토리</p>
            <p className="mt-1 text-sm font-medium text-ink truncate">{thread.titleKo}</p>
          </div>
          <svg className="ml-2 size-4 shrink-0 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Section B: 영향 체인 */}
      {chains && chains.length > 0 && (
        <section data-label="storytelling.tab.chains" className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-wide text-ink-muted">영향 체인 (Impact Chain)</h2>
          {chains.map((chain) => (
            <ChainSection key={chain._id} chain={chain} />
          ))}
        </section>
      )}

      {/* Section C: StoryTelling (explainer) */}
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

function ChainSection({ chain }: { chain: Doc<"impactChains"> }) {
  const nodes = useChainNodes(chain._id);

  return (
    <div data-label="storytelling.tab.chain" className={cn(recipes.card.base, "glass-panel space-y-3")}>
      <div className="flex items-center gap-2">
        <Badge variant="default">영향 체인</Badge>
        {nodes && <span className="text-xs text-ink-muted">노드 {nodes.length}개</span>}
      </div>
      <h3 className="text-sm font-medium text-ink">{chain.titleKo}</h3>
      {chain.descriptionKo && (
        <p className="text-xs text-ink-muted">{chain.descriptionKo}</p>
      )}
      {nodes && <ImpactNodeTree nodes={nodes} />}
    </div>
  );
}

function ExplainerSection({ explainer }: { explainer: Doc<"explainers"> }) {
  const difficulty = difficultyBadge[explainer.difficultyLevel] ?? {
    label: explainer.difficultyLevel,
    variant: "success" as const,
  };

  return (
    <article data-label="storytelling.tab.explainer" className={cn(recipes.card.base, "glass-panel space-y-4")}>
      <div className="flex items-center gap-2">
        <Badge variant={difficulty.variant}>{difficulty.label}</Badge>
      </div>

      <h3 data-label="storytelling.tab.explainer.title" className="text-base font-medium text-ink">
        {explainer.simplifiedTitle}
      </h3>

      <p data-label="storytelling.tab.explainer.body" className="whitespace-pre-wrap text-sm leading-relaxed text-ink/90">
        {explainer.storyBody}
      </p>

      {explainer.keyTakeaways.length > 0 && (
        <section data-label="storytelling.tab.explainer.takeaways" className="space-y-2">
          <h4 className="text-xs font-medium uppercase tracking-wide text-ink-muted">핵심 정리</h4>
          <ul className="space-y-2">
            {explainer.keyTakeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink/90">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-1" />
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}

      {explainer.analogy && (
        <section data-label="storytelling.tab.explainer.analogy">
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-muted">쉽게 비유하자면</h4>
          <div className="rounded-xl border glass-panel p-3">
            <p className="text-sm italic text-ink/80">{explainer.analogy}</p>
          </div>
        </section>
      )}

      {explainer.personalImpact && (
        <section data-label="storytelling.tab.explainer.impact">
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-muted">나에게 어떤 영향이 있을까?</h4>
          <div className="rounded-xl border glass-panel p-3">
            <p className="text-sm text-ink/85">{explainer.personalImpact}</p>
          </div>
        </section>
      )}
    </article>
  );
}
