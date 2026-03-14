/** Single impact chain by ID. / ID로 단일 영향 체인 조회. */
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export function useChainById(chainId?: string) {
  return useQuery(
    api.queries.getChainById,
    chainId ? { chainId: chainId as Id<"impactChains"> } : "skip",
  );
}
