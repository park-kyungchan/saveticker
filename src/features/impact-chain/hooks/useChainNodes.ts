/** Nodes in an impact chain, ordered by ordinal. / 영향 체인의 노드 목록 (ordinal 순). */
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export function useChainNodes(chainId?: Id<"impactChains">) {
  return useQuery(
    api.queries.getChainNodes,
    chainId ? { chainId } : "skip",
  );
}
