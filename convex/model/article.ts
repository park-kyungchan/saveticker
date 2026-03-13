/**
 * NewsArticle model helpers — read helpers.
 *
 * Covers: Q: recentArticles, articleById, articleExplainer, articlesByTicker, searchArticles.
 */
import type { QueryCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";

/**
 * Latest news feed, newest first.
 * 최신 뉴스 피드, 최신순.
 */
export async function recentArticles(
  ctx: QueryCtx,
  limit: number = 20,
): Promise<Doc<"newsArticles">[]> {
  return await ctx.db
    .query("newsArticles")
    .withIndex("by_publishedAt")
    .order("desc")
    .take(limit);
}

/**
 * Single article by ID.
 * ID로 단일 기사 조회.
 */
export async function articleById(
  ctx: QueryCtx,
  articleId: Id<"newsArticles">,
): Promise<Doc<"newsArticles"> | null> {
  return await ctx.db.get(articleId);
}

/**
 * 1:1 explainer lookup for the "Easy Explanation" tab.
 * '쉬운 설명' 탭용 1:1 설명 조회.
 */
export async function articleExplainer(
  ctx: QueryCtx,
  newsArticleId: Id<"newsArticles">,
): Promise<Doc<"explainers"> | null> {
  return await ctx.db
    .query("explainers")
    .withIndex("by_newsArticleId", (q) =>
      q.eq("newsArticleId", newsArticleId),
    )
    .first();
}

/**
 * Articles mentioning a specific ticker symbol (collect+filter).
 * 특정 티커 심볼을 언급하는 기사 (collect+filter).
 *
 * Convex cannot index into arrays, so this scans all articles.
 * PM demo scale (15 articles) — no performance concern.
 */
export async function articlesByTicker(
  ctx: QueryCtx,
  ticker: string,
): Promise<Doc<"newsArticles">[]> {
  const all = await ctx.db
    .query("newsArticles")
    .withIndex("by_publishedAt")
    .order("desc")
    .collect();

  return all.filter((a) => a.mentionedTickers?.includes(ticker));
}

/**
 * Title prefix search for article search bar.
 * 기사 검색바용 제목 접두어 검색.
 */
export async function searchArticles(
  ctx: QueryCtx,
  query: string,
  limit: number = 10,
): Promise<Doc<"newsArticles">[]> {
  return await ctx.db
    .query("newsArticles")
    .withSearchIndex("search_title", (q) => q.search("title", query))
    .take(limit);
}
