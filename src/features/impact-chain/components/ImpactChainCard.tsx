/**
 * Impact Chain Card — 영향 체인 카드.
 * Glass panel card showing chain title and node count.
 */
import { motion } from "motion/react";
import { cn } from "../../../lib/cn";
import { Badge } from "../../../components/ui/Badge";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface ImpactChainCardProps {
  chain: Doc<"impactChains">;
  nodeCount: number;
  onClick: () => void;
  className?: string;
}

export function ImpactChainCard({
  chain,
  nodeCount,
  onClick,
  className,
}: ImpactChainCardProps) {
  return (
    <motion.button
      type="button"
      data-label="impactChain.card"
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      className={cn(
        "relative w-[260px] shrink-0 overflow-hidden rounded-xl border text-left",
        "glass-panel border-l-[3px] border-l-accent-3/40",
        "hover:border-white/20 hover:bg-white/[0.04]",
        "transition-all duration-300",
        "p-4 min-h-[48px]",
        className,
      )}
    >
      {/* Header: icon + count */}
      <div className="flex items-center gap-2 mb-2.5">
        <Badge variant="warning">도미노</Badge>
        <span className="text-[10px] text-ink-muted/60">{nodeCount}개 노드</span>
      </div>

      {/* Title */}
      <h3
        data-label="impactChain.card.title"
        className="text-sm font-medium text-ink leading-snug mb-2 line-clamp-2"
      >
        {chain.titleKo}
      </h3>

      {/* Description preview */}
      {chain.descriptionKo && (
        <p className="text-[11px] text-ink-muted/70 leading-snug line-clamp-2 mb-3">
          {chain.descriptionKo}
        </p>
      )}

      {/* CTA */}
      <div className="mt-auto pt-2 border-t border-white/8">
        <span className="text-[11px] font-medium text-accent-3/80">
          영향 체인 보기 →
        </span>
      </div>
    </motion.button>
  );
}
