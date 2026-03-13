import type { WatchlistEntry } from "../types/index.js";

/**
 * User's watchlist entries with stock details.
 * 사용자 관심목록 항목 (종목 상세 포함).
 * @queryType filter
 */
export function watchlistByUser(params: { userId: string }): WatchlistEntry[] {
  // TODO: persist — filter by userId
  throw new Error("Not implemented");
}
