/**
 * StoryThread model helpers — read helpers.
 *
 * Covers: Q: threadsByStatus, threadArticlesList, threadById, allThreads.
 * F-1: computeArticleCount.
 */
import type { QueryCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";

/**
 * Active or completed threads. Default: all.
 * 활성 또는 완료된 스레드. 기본: 전체.
 */
export async function threadsByStatus(
  ctx: QueryCtx,
  status?: "active" | "completed",
): Promise<Doc<"storyThreads">[]> {
  if (status) {
    return await ctx.db
      .query("storyThreads")
      .withIndex("by_status", (q) => q.eq("status", status))
      .collect();
  }
  return await ctx.db.query("storyThreads").collect();
}

/**
 * Articles in a story thread, ordered by orderInThread ascending.
 * 스토리 스레드 내 기사, orderInThread 오름차순.
 */
export async function threadArticlesList(
  ctx: QueryCtx,
  storyThreadId: Id<"storyThreads">,
): Promise<Doc<"newsArticles">[]> {
  const articles = await ctx.db
    .query("newsArticles")
    .withIndex("by_storyThreadId", (q) =>
      q.eq("storyThreadId", storyThreadId),
    )
    .collect();

  return articles.sort((a, b) => (a.orderInThread ?? Infinity) - (b.orderInThread ?? Infinity));
}

/**
 * Single thread by ID.
 * ID로 단일 스레드 조회.
 */
export async function threadById(
  ctx: QueryCtx,
  threadId: Id<"storyThreads">,
): Promise<Doc<"storyThreads"> | null> {
  return await ctx.db.get(threadId);
}

/**
 * All threads (prototype demo).
 * 전체 스레드 (프로토타입 데모).
 */
export async function allThreads(
  ctx: QueryCtx,
): Promise<Doc<"storyThreads">[]> {
  return await ctx.db.query("storyThreads").collect();
}

/**
 * Count articles in a thread (F-1 derived property helper).
 * 스레드 내 기사 수 (F-1 파생 속성 헬퍼).
 */
export async function computeArticleCount(
  ctx: QueryCtx,
  storyThreadId: Id<"storyThreads">,
): Promise<number> {
  const articles = await ctx.db
    .query("newsArticles")
    .withIndex("by_storyThreadId", (q) =>
      q.eq("storyThreadId", storyThreadId),
    )
    .collect();
  return articles.length;
}
