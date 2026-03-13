/** Fetch all nodes for an impact chain. / 임팩트 체인의 모든 노드 조회. */

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export function useChainNodes(chainId: string | undefined) {
  return useQuery(
    api.queries.getChainNodes,
    chainId ? { chainId: chainId as Id<"impactChains"> } : "skip",
  );
}
