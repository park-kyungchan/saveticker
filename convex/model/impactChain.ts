/**
 * ImpactChain model helpers — read operations for impact chains and nodes.
 * 영향 체인 모델 헬퍼 — 체인과 노드 읽기 연산.
 */
import type { QueryCtx, MutationCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";

/** Maximum nodes to scan per chain / 체인당 최대 노드 스캔 수 */
const MAX_SCAN_LIMIT = 200;

/** Impact chains belonging to a story thread / 스토리 스레드의 영향 체인 목록 */
export async function chainsByThread(
  ctx: QueryCtx,
  storyThreadId: Id<"storyThreads">,
): Promise<Doc<"impactChains">[]> {
  return await ctx.db
    .query("impactChains")
    .withIndex("by_storyThreadId", (q) => q.eq("storyThreadId", storyThreadId))
    .collect();
}

/** All nodes in a chain, ordered by ordinal / 체인 내 전체 노드 (ordinal 순) */
export async function chainNodes(
  ctx: QueryCtx,
  chainId: Id<"impactChains">,
): Promise<Doc<"impactNodes">[]> {
  const nodes = await ctx.db
    .query("impactNodes")
    .withIndex("by_chainId", (q) => q.eq("chainId", chainId))
    .take(MAX_SCAN_LIMIT);

  return nodes.sort((a, b) => a.ordinal - b.ordinal);
}

/** Single chain by ID / ID로 단일 체인 조회 */
export async function chainById(
  ctx: QueryCtx,
  chainId: Id<"impactChains">,
): Promise<Doc<"impactChains"> | null> {
  return await ctx.db.get(chainId);
}

/**
 * Collect all descendant node IDs for cascade delete.
 * 연쇄 삭제를 위한 모든 하위 노드 ID 수집.
 */
export async function collectDescendantIds(
  ctx: MutationCtx,
  nodeId: Id<"impactNodes">,
): Promise<Id<"impactNodes">[]> {
  const children = await ctx.db
    .query("impactNodes")
    .withIndex("by_parentNodeId", (q) => q.eq("parentNodeId", nodeId))
    .collect();

  const descendantIds: Id<"impactNodes">[] = [];
  for (const child of children) {
    descendantIds.push(child._id);
    const grandchildren = await collectDescendantIds(ctx, child._id);
    descendantIds.push(...grandchildren);
  }
  return descendantIds;
}
