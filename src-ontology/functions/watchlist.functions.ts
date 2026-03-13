import type { WatchlistEntry } from "../types/index.js";

/**
 * Returns false if watchlist entry already exists (duplicate check).
 * 관심목록 항목이 이미 존재하면 false 반환 (중복 확인).
 */
export function validateWatchlistAdd(
  userId: string,
  stockId: string,
  existingEntries: WatchlistEntry[],
): boolean {
  return !existingEntries.some(e => e.userId === userId && e.stockId === stockId);
}

/**
 * Returns false if title or body is empty/whitespace-only.
 * 제목 또는 본문이 비어있거나 공백만 있으면 false 반환.
 */
export function validatePostContent(title: string, body: string): boolean {
  return title.trim().length > 0 && body.trim().length > 0;
}

/**
 * Watchlist overlap relevance score.
 * 관심목록 교집합 관련성 점수.
 */
export function computeFeedRelevance(
  articleStockIds: string[],
  watchlistStockIds: string[],
): number {
  const overlap = articleStockIds.filter(id => watchlistStockIds.includes(id)).length;
  return overlap / Math.max(1, watchlistStockIds.length);
}
