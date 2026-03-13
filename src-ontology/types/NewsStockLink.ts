/** NewsStockLink — Bidirectional news-stock association. / 뉴스-종목 양방향 연결. */
export interface NewsStockLink {
  readonly id: string;
  readonly newsArticleId: string;
  readonly stockId: string;
  /** Whether this is the primary stock for the article / 기사의 주요 종목 여부 */
  isPrimary: boolean;
}
