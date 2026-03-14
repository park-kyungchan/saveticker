/**
 * Impact Chain Detail Page — 영향 체인 상세 도미노 플로우.
 * Full page showing domino tree visualization for a single chain.
 */
import { useParams } from "react-router";
import { useChainById } from "../hooks/useChainById";
import { useChainNodes } from "../hooks/useChainNodes";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Badge } from "../../../components/ui/Badge";
import { Spinner } from "../../../components/ui/Spinner";
import { DominoFlow } from "../components/DominoFlow";
import type { Id } from "../../../../convex/_generated/dataModel";

export function ImpactChainPage() {
  const { id } = useParams<{ id: string }>();
  const chain = useChainById(id);
  const nodes = useChainNodes(id ? (id as Id<"impactChains">) : undefined);

  if (chain === undefined || nodes === undefined) {
    return (
      <div className="space-y-4">
        <PageHeader title="영향 체인" showBack />
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (chain === null) {
    return (
      <div className="space-y-4">
        <PageHeader title="영향 체인" showBack />
        <div className="rounded-xl border glass-panel p-6 text-center">
          <p className="text-sm text-ink-muted">영향 체인을 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div data-label="impactChain.page" className="space-y-5 animate-in">
      <PageHeader title="영향 체인" showBack />

      {/* Chain header */}
      <div className="rounded-xl border glass-panel p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="warning">도미노</Badge>
          <span className="text-[10px] text-ink-muted/60">{nodes.length}개 노드</span>
        </div>
        <h2 className="text-lg font-medium text-ink leading-snug">
          {chain.titleKo}
        </h2>
        {chain.descriptionKo && (
          <p className="text-sm text-ink-muted/80 leading-relaxed">
            {chain.descriptionKo}
          </p>
        )}
      </div>

      {/* Domino tree visualization */}
      <div className="px-1">
        <DominoFlow nodes={nodes} />
      </div>
    </div>
  );
}
