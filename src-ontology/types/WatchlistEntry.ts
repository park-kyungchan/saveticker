/** WatchlistEntry — User-stock watchlist join. / 사용자-종목 관심목록 조인. */
export interface WatchlistEntry {
  readonly id: string;
  readonly userId: string;
  readonly stockId: string;
  readonly addedAt: Date;
  sortOrder?: number;
}
