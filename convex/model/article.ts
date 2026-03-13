/**
 * NewsArticle model helpers — read helpers.
 *
 * Covers: Q: recentArticles, articleById, articleExplainer, articlesByTicker, searchArticles.
 *
 * Fix: Added take() guards to prevent unbounded full-table scans.
 * Fix: articlesByTicker/Source/Tag now accept limit parameter.
 */
import type { QueryCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";

/** Maximum articles to scan in full-table patterns / 전체 테이블 스캔 시 최대 기사 수 */
const MAX_SCAN_LIMIT = 200;

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
    .take(Math.min(limit, MAX_SCAN_LIMIT));
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
 * Articles mentioning a specific ticker symbol.
 * 특정 티커 심볼을 언급하는 기사.
 *
 * Convex cannot index into arrays, so this scans articles.
 * Fix: Added take() guard to prevent unbounded scan.
 */
export async function articlesByTicker(
  ctx: QueryCtx,
  ticker: string,
  limit: number = 50,
): Promise<Doc<"newsArticles">[]> {
  const all = await ctx.db
    .query("newsArticles")
    .withIndex("by_publishedAt")
    .order("desc")
    .take(MAX_SCAN_LIMIT);

  return all
    .filter((a) => a.mentionedTickers?.includes(ticker))
    .slice(0, limit);
}

/**
 * Articles filtered by category (general/breaking/analysis).
 * 카테고리별 기사 필터.
 */
export async function articlesByCategory(
  ctx: QueryCtx,
  category: string,
  limit: number = 50,
): Promise<Doc<"newsArticles">[]> {
  return await ctx.db
    .query("newsArticles")
    .withIndex("by_category", (q) => q.eq("category", category as "general" | "breaking" | "analysis"))
    .order("desc")
    .take(limit);
}

/**
 * Articles filtered by source name.
 * 출처 이름별 기사 필터.
 * Fix: Added take() guard.
 */
export async function articlesBySource(
  ctx: QueryCtx,
  sourceName: string,
  limit: number = 50,
): Promise<Doc<"newsArticles">[]> {
  const all = await ctx.db
    .query("newsArticles")
    .withIndex("by_publishedAt")
    .order("desc")
    .take(MAX_SCAN_LIMIT);

  return all
    .filter((a) => a.sourceName === sourceName)
    .slice(0, limit);
}

/**
 * Articles containing a specific tag.
 * 특정 태그를 포함하는 기사.
 * Fix: Added take() guard.
 */
export async function articlesByTag(
  ctx: QueryCtx,
  tag: string,
  limit: number = 50,
): Promise<Doc<"newsArticles">[]> {
  const all = await ctx.db
    .query("newsArticles")
    .withIndex("by_publishedAt")
    .order("desc")
    .take(MAX_SCAN_LIMIT);

  return all
    .filter((a) => a.tags?.includes(tag))
    .slice(0, limit);
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
    .take(Math.min(limit, 50));
}
