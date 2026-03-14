/**
 * Impact Chain Section — 스토리 스레드 페이지 내 영향 체인 섹션.
 * Shows impact chains for a story thread as horizontal scroll strip.
 */
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { ImpactChainCard } from "./ImpactChainCard";
import { useChainsByThread } from "../hooks/useChainsByThread";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";

interface ImpactChainSectionProps {
  threadId: Id<"storyThreads">;
}

export function ImpactChainSection({ threadId }: ImpactChainSectionProps) {
  const chains = useChainsByThread(threadId);
  const navigate = useNavigate();

  if (!chains || chains.length === 0) return null;

  return (
    <section data-label="impactChain.section" className="space-y-2">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <svg className="size-3.5 text-accent-3/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5" />
        </svg>
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-muted/70">
          영향 체인
        </h2>
        <span className="text-[10px] text-ink-muted/40">{chains.length}</span>
      </div>

      {/* Horizontal scroll strip */}
      <div role="region" aria-label="영향 체인 목록" className="flex gap-3 overflow-x-auto scrollbar-none -mx-4 px-4 pb-1">
        {chains.map((chain) => (
          <ChainCardWithNodes
            key={chain._id}
            chain={chain}
            onNavigate={() => navigate(`/chains/${chain._id}`)}
          />
        ))}
      </div>
    </section>
  );
}

/** Wrapper that fetches node count per chain card */
function ChainCardWithNodes({
  chain,
  onNavigate,
}: {
  chain: Doc<"impactChains">;
  onNavigate: () => void;
}) {
  const nodes = useQuery(api.queries.getChainNodes, { chainId: chain._id });

  return (
    <ImpactChainCard
      chain={chain}
      nodeCount={nodes?.length ?? 0}
      onClick={onNavigate}
    />
  );
}
