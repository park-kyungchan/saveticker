/**
 * 스토리 스레드 상세 페이지 — 기사 타임라인 + 임팩트 체인.
 * Story thread detail page — article timeline and impact chains.
 */
import { useParams, useNavigate } from "react-router";
import { useThreadArticlesList } from "../../news-article/hooks/useThreadArticlesList";
import { useThreadById } from "../hooks/useThreadById";
import { useChainsByThread } from "../../impact-chain/hooks/useChainsByThread";
import { useChainNodes } from "../../impact-chain/hooks/useChainNodes";
import { ThreadTimeline } from "../components/ThreadTimeline";
import { ImpactChainCard } from "../../impact-chain/components/ImpactChainCard";
import { ImpactNodeTree } from "../../impact-chain/components/ImpactNodeTree";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Badge } from "../../../components/ui/Badge";
import { Spinner } from "../../../components/ui/Spinner";
import { cn } from "../../../lib/cn";
import { recipes } from "../../../theme/recipes";

/** Status badge label + variant / 상태 뱃지 라벨 + 변형 */
const statusBadge: Record<string, { label: string; variant: "success" | "default" }> = {
  active: { label: "진행 중", variant: "success" },
  completed: { label: "완료", variant: "default" },
};

/**
 * Inline impact chain detail — shows nodes for a single chain.
 * 인라인 임팩트 체인 상세 — 단일 체인의 노드 표시.
 */
function ImpactChainSection({ chainId }: { chainId: string }) {
  const nodes = useChainNodes(chainId);

  if (nodes === undefined) {
    return (
      <div className="flex justify-center py-4">
        <Spinner size="sm" />
      </div>
    );
  }

  return <ImpactNodeTree nodes={nodes} />;
}

export function ThreadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const thread = useThreadById(id);
  const articles = useThreadArticlesList(id);
  const chains = useChainsByThread(id);

  const badge = thread ? statusBadge[thread.status] ?? { label: thread.status, variant: "default" as const } : null;

  return (
    <div data-label="threadDetail.page" className="space-y-4">
      <PageHeader showBack title={thread?.titleKo ?? "스토리 스레드"} />

      {/* Thread header card / 스레드 헤더 카드 */}
      {thread && (
        <div data-label="threadDetail.header" className={cn(recipes.card.base, "glass-panel animate-in space-y-3")}>
          <div className="flex items-center gap-2">
            <Badge variant={badge!.variant}>{badge!.label}</Badge>
            {articles && (
              <span data-label="threadDetail.header.count" className="text-xs text-ink-muted">
                기사 {articles.length}건
              </span>
            )}
          </div>
          {thread.descriptionKo && (
            <p data-label="threadDetail.header.description" className="text-sm text-ink-muted leading-relaxed">
              {thread.descriptionKo}
            </p>
          )}
          {articles && articles.length > 0 && (
            <p data-label="threadDetail.header.dateRange" className="text-xs text-ink-muted">
              {new Date(articles[0].publishedAt).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
              {" — "}
              {new Date(articles[articles.length - 1].publishedAt).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
            </p>
          )}
        </div>
      )}

      {/* Article timeline / 기사 타임라인 */}
      {articles === undefined ? (
        <div data-label="threadDetail.page.loading" className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <ThreadTimeline
          articles={articles}
          onArticleClick={(articleId) => navigate(`/news/${articleId}`)}
        />
      )}

      {/* Impact chains / 영향 체인 */}
      {chains && chains.length > 0 && (
        <section data-label="threadDetail.impactChains" className="space-y-3">
          <h2 data-label="threadDetail.impactChains.title" className={recipes.sectionTitle}>
            영향 체인
          </h2>
          {chains.map((chain) => (
            <div key={chain._id} className="space-y-2">
              <ImpactChainCard chain={chain} />
              <ImpactChainSection chainId={chain._id} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
