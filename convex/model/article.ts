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
 * NOTE: Convex cannot index into arrays — full-table scan + filter is expected
 * at prototype scale. For production, consider a separate junction table.
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
 * Articles filtered by source name using by_sourceName index.
 * 출처 이름별 기사 필터 (인덱스 사용).
 */
export async function articlesBySource(
  ctx: QueryCtx,
  sourceName: string,
  limit: number = 50,
): Promise<Doc<"newsArticles">[]> {
  return await ctx.db
    .query("newsArticles")
    .withIndex("by_sourceName", (q) => q.eq("sourceName", sourceName))
    .order("desc")
    .take(limit);
}

/**
 * Articles containing a specific tag.
 * 특정 태그를 포함하는 기사.
 *
 * NOTE: Convex cannot index into arrays — full-table scan + filter is expected
 * at prototype scale. For production, consider a separate junction table.
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
 * Most viewed article in last 24 hours — hero card candidate.
 * Falls back to most recent article if no views exist.
 * 24시간 내 최다 조회 기사 — hero 카드 후보. 조회수 없으면 최신 기사로 폴백.
 *
 * NOTE: `since` is passed from the client (bucketed to the nearest hour)
 * to avoid Date.now() in queries — Convex best practice for determinism
 * and cache efficiency.
 */
export async function todayMostViewed(
  ctx: QueryCtx,
  since?: number,
): Promise<Doc<"newsArticles"> | null> {
  // Scan recent articles and find the one with highest viewCount
  const recent = await ctx.db
    .query("newsArticles")
    .withIndex("by_publishedAt")
    .order("desc")
    .take(MAX_SCAN_LIMIT);

  // If since is not provided (stale client), use all recent articles
  const todayArticles = since !== undefined
    ? recent.filter((a) => a.publishedAt >= since)
    : recent;

  // Find article with highest viewCount among today's articles
  const hero = todayArticles.reduce<Doc<"newsArticles"> | null>((best, a) => {
    const count = a.viewCount ?? 0;
    if (count > 0 && (best === null || count > (best.viewCount ?? 0))) {
      return a;
    }
    return best;
  }, null);

  // Fallback: most recent article if no views
  return hero ?? recent[0] ?? null;
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
