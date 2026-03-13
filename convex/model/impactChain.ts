/**
 * ImpactChain + ImpactNode model helpers — read helpers.
 *
 * Covers: Q: chainsByThread, chainNodes.
 */
import type { QueryCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";

/**
 * All impact chains for a story thread.
 * 스토리 스레드의 모든 임팩트 체인.
 */
export async function chainsByThread(
  ctx: QueryCtx,
  storyThreadId: Id<"storyThreads">,
): Promise<Doc<"impactChains">[]> {
  return await ctx.db
    .query("impactChains")
    .withIndex("by_storyThreadId", (q) =>
      q.eq("storyThreadId", storyThreadId),
    )
    .collect();
}

/**
 * All nodes for an impact chain, ordered by ordinal.
 * 임팩트 체인의 모든 노드, ordinal 순.
 */
export async function chainNodes(
  ctx: QueryCtx,
  chainId: Id<"impactChains">,
): Promise<Doc<"impactNodes">[]> {
  const nodes = await ctx.db
    .query("impactNodes")
    .withIndex("by_chainId", (q) => q.eq("chainId", chainId))
    .collect();

  return nodes.sort((a, b) => a.ordinal - b.ordinal);
}
