/**
 * StoryThread model helpers — read operations for story threads.
 * 스토리 스레드 모델 헬퍼 — 스레드 읽기 연산.
 */
import type { QueryCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

/** List all story threads / 전체 스레드 목록 */
export async function allThreads(ctx: QueryCtx) {
  return await ctx.db.query("storyThreads").collect();
}

/** Filter threads by status / 상태별 스레드 필터 */
export async function threadsByStatus(
  ctx: QueryCtx,
  status: "active" | "completed",
) {
  return await ctx.db
    .query("storyThreads")
    .withIndex("by_status", (q) => q.eq("status", status))
    .collect();
}

/** Single thread by ID / ID로 단일 스레드 조회 */
export async function threadById(
  ctx: QueryCtx,
  threadId: Id<"storyThreads">,
) {
  return await ctx.db.get(threadId);
}

/** Articles belonging to a thread, ordered by position / 스레드 내 기사 목록 (순서대로) */
export async function threadArticles(
  ctx: QueryCtx,
  threadId: Id<"storyThreads">,
) {
  const articles = await ctx.db
    .query("newsArticles")
    .withIndex("by_storyThreadId", (q) => q.eq("storyThreadId", threadId))
    .collect();

  return articles.sort((a, b) => (a.orderInThread ?? 0) - (b.orderInThread ?? 0));
}
