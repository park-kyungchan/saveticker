import type { WatchlistEntry } from "../types/index.js";

/** addToWatchlist params / 관심목록 추가 파라미터 */
export interface AddToWatchlistParams {
  userId: string;
  stockId: string;
  sortOrder?: number;
}

/**
 * Add a stock to user's watchlist.
 * 사용자 관심목록에 종목 추가.
 */
export function addToWatchlist(params: AddToWatchlistParams): void {
  // Validation: validateWatchlistAdd(userId, stockId, existingEntries)
  // TODO: persist — db.watchlistEntries.insert({ ...params, addedAt: new Date() })
  throw new Error("Not implemented");
}

/** removeFromWatchlist params / 관심목록 제거 파라미터 */
export interface RemoveFromWatchlistParams {
  watchlistEntryId: string;
}

/**
 * Remove a stock from user's watchlist.
 * 사용자 관심목록에서 종목 제거.
 */
export function removeFromWatchlist(params: RemoveFromWatchlistParams): void {
  // TODO: persist — db.watchlistEntries.delete(params.watchlistEntryId)
  throw new Error("Not implemented");
}
