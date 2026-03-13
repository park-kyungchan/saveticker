/**
 * Recursive impact node tree visualization with article highlighting.
 * 재귀적 임팩트 노드 트리 시각화 + 기사 하이라이트.
 */
import { useNavigate } from "react-router";
import { cn } from "../../../lib/cn";
import type { Doc } from "../../../../convex/_generated/dataModel";

type ImpactNode = Doc<"impactNodes">;

interface ImpactNodeTreeProps {
  /** All nodes in the chain (flat list) / 체인의 모든 노드 (플랫 리스트) */
  nodes: ImpactNode[];
  /** Current article ID for highlighting / 하이라이트용 현재 기사 ID */
  currentArticleId?: string;
  /** Additional class names / 추가 클래스 */
  className?: string;
}

/** Max recursion depth guard / 최대 재귀 깊이 가드 */
const MAX_DEPTH = 8;

/** Render a subtree rooted at a given parent / 주어진 부모를 루트로 하는 서브트리 렌더링 */
function NodeBranch({ nodes, parentId, depth, currentArticleId }: {
  nodes: ImpactNode[];
  parentId: string | undefined;
  depth: number;
  currentArticleId?: string;
}) {
  const navigate = useNavigate();
  if (depth > MAX_DEPTH) return null;

  const children = nodes
    .filter((n) => (parentId ? n.parentNodeId === parentId : !n.parentNodeId))
    .sort((a, b) => a.ordinal - b.ordinal);

  if (children.length === 0) return null;

  return (
    <ul className={cn(depth > 0 && "ml-4 border-l border-white/10 pl-3")}>
      {children.map((node) => {
        const isHighlighted = currentArticleId && node.newsArticleId === currentArticleId;
        const isNavigable = !!node.newsArticleId;

        const content = (
          <div className="flex items-start gap-2">
            <span
              className={cn(
                "mt-1.5 size-2 shrink-0 rounded-full",
                isHighlighted
                  ? "bg-warning ring-2 ring-warning/30"
                  : "bg-accent-1",
              )}
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className={cn("text-sm text-ink", isHighlighted ? "font-bold" : "font-medium")}>
                {node.labelKo}
              </p>
              {node.descriptionKo && (
                <p className="text-xs text-ink-muted mt-0.5">{node.descriptionKo}</p>
              )}
            </div>
          </div>
        );

        return (
          <li key={node._id} data-label="impactNode.item" className="py-1.5">
            {isNavigable && !isHighlighted ? (
              <button
                type="button"
                data-label="impactNode.navigate"
                onClick={() => navigate(`/news/${node.newsArticleId}`)}
                className="w-full text-left hover:bg-white/5 rounded-lg p-1 -m-1 transition-colors"
              >
                {content}
              </button>
            ) : (
              content
            )}
            <NodeBranch nodes={nodes} parentId={node._id} depth={depth + 1} currentArticleId={currentArticleId} />
          </li>
        );
      })}
    </ul>
  );
}

export function ImpactNodeTree({ nodes, currentArticleId, className }: ImpactNodeTreeProps) {
  if (nodes.length === 0) {
    return (
      <p data-label="impactNode.empty" className="text-sm text-ink-muted py-2">
        아직 노드가 없습니다.
      </p>
    );
  }

  return (
    <div data-label="impactNode.tree" className={cn("space-y-1", className)}>
      <NodeBranch nodes={nodes} parentId={undefined} depth={0} currentArticleId={currentArticleId} />
    </div>
  );
}
