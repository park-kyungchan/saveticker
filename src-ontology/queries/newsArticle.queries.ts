import type { NewsArticle } from "../types/index.js";
import type { ArticleExplainer } from "../types/index.js";
import type { ArticleTermUsage } from "../types/index.js";

/**
 * Latest news, newest first. No auth required.
 * 최신 뉴스, 최신순. 인증 불필요.
 * @queryType list
 */
export function recentArticles(params: { limit?: number }): NewsArticle[] {
  // TODO: persist — adapter query implementation
  throw new Error("Not implemented");
}

/**
 * Personalized feed: articles linked to user's watchlist stocks.
 * 개인화 피드: 사용자 관심 종목과 연결된 기사.
 * @queryType aggregation
 */
export function feedByUser(params: { userId: string }): NewsArticle[] {
  // TODO: persist — multi-hop join (User→WatchlistEntry→Stock→NewsStockLink→NewsArticle)
  throw new Error("Not implemented");
}

/**
 * Single article by ID.
 * ID로 단일 기사 조회.
 * @queryType getById
 */
export function articleById(params: { articleId: string }): NewsArticle | null {
  // TODO: persist — adapter query implementation
  throw new Error("Not implemented");
}

/**
 * News timeline for a specific stock (via NewsStockLink join).
 * 특정 종목의 뉴스 타임라인.
 * @queryType aggregation
 */
export function stockNews(params: { stockId: string }): NewsArticle[] {
  // TODO: persist — two-step join query
  throw new Error("Not implemented");
}

/**
 * 1:1 explainer lookup for Easy Explanation tab.
 * 쉬운 설명 탭용 1:1 설명 조회.
 * @queryType filter
 */
export function articleExplainer(params: { newsArticleId: string }): ArticleExplainer | null {
  // TODO: persist — filter by newsArticleId
  throw new Error("Not implemented");
}

/**
 * All term usages in an article for highlight rendering.
 * 기사 내 모든 용어 사용 위치 (하이라이트 렌더링).
 * @queryType filter
 */
export function articleTermsByArticle(params: { newsArticleId: string }): ArticleTermUsage[] {
  // TODO: persist — filter by newsArticleId
  throw new Error("Not implemented");
}
