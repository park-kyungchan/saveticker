/**
 * Impact chain summary card — title, description, node count.
 * 임팩트 체인 요약 카드 — 제목, 설명, 노드 수.
 */
import { cn } from "../../../lib/cn";
import { recipes } from "../../../theme/recipes";
import { Badge } from "../../../components/ui/Badge";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface ImpactChainCardProps {
  /** Impact chain document / 임팩트 체인 문서 */
  chain: Doc<"impactChains">;
  /** Number of nodes in this chain / 이 체인의 노드 수 */
  nodeCount?: number;
  /** Click handler / 클릭 핸들러 */
  onClick?: () => void;
  /** Additional class names / 추가 클래스 */
  className?: string;
}

export function ImpactChainCard({ chain, nodeCount, onClick, className }: ImpactChainCardProps) {
  return (
    <button
      type="button"
      data-label="impactChain.card"
      onClick={onClick}
      className={cn(
        recipes.card.base,
        recipes.card.hover,
        "w-full text-left space-y-2",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Badge variant="default">영향 체인</Badge>
        {nodeCount !== undefined && (
          <span data-label="impactChain.card.nodeCount" className="text-xs text-ink-muted">
            노드 {nodeCount}개
          </span>
        )}
      </div>
      <h3
        data-label="impactChain.card.title"
        className="text-sm font-medium text-ink"
      >
        {chain.titleKo}
      </h3>
      {chain.descriptionKo && (
        <p
          data-label="impactChain.card.description"
          className="text-xs text-ink-muted line-clamp-2"
        >
          {chain.descriptionKo}
        </p>
      )}
    </button>
  );
}
