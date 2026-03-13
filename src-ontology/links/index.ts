/**
 * Link type interfaces derived from ontology LinkTypes.
 * 온톨로지 LinkType에서 생성된 링크 타입 인터페이스.
 */

/** R-1: userStock — User's personalized watchlist (M:N via WatchlistEntry). / 사용자 관심 종목 목록. */
export interface UserStockLink {
  readonly source: "User";
  readonly target: "Stock";
  readonly cardinality: "M:N";
  readonly joinEntity: "WatchlistEntry";
  readonly reverseApiName: "stockUsers";
}

/** R-2: newsArticleStock — Bidirectional news-stock association (M:N via NewsStockLink). / 뉴스-종목 양방향 연결. */
export interface NewsArticleStockLink {
  readonly source: "NewsArticle";
  readonly target: "Stock";
  readonly cardinality: "M:N";
  readonly joinEntity: "NewsStockLink";
  readonly reverseApiName: "stockNewsArticles";
}

/** R-3: newsArticleTerm — Term usage in articles (M:N via ArticleTermUsage). / 기사 내 용어 사용. */
export interface NewsArticleTermLink {
  readonly source: "NewsArticle";
  readonly target: "FinancialTerm";
  readonly cardinality: "M:N";
  readonly joinEntity: "ArticleTermUsage";
  readonly reverseApiName: "termNewsArticles";
}

/** R-4: indicatorArticles — Articles about an economic indicator (1:M). / 경제지표 관련 기사. */
export interface IndicatorArticlesLink {
  readonly source: "EconomicIndicator";
  readonly target: "NewsArticle";
  readonly cardinality: "1:M";
  readonly fkProperty: "indicatorId";
  readonly reverseApiName: "articleIndicator";
}

/** R-5: threadArticles — Articles in a story thread (1:M). / 스토리 스레드 소속 기사. */
export interface ThreadArticlesLink {
  readonly source: "StoryThread";
  readonly target: "NewsArticle";
  readonly cardinality: "1:M";
  readonly fkProperty: "storyThreadId";
  readonly reverseApiName: "articleThread";
}

/** R-6: explainerArticle — Explainer for a news article (1:1). / 뉴스 기사의 해설. */
export interface ExplainerArticleLink {
  readonly source: "ArticleExplainer";
  readonly target: "NewsArticle";
  readonly cardinality: "1:1";
  readonly fkProperty: "newsArticleId";
  readonly reverseApiName: "articleExplainer";
}

/** R-7: indicatorCausalChain — Self-referential causal chain (M:1). / 경제지표 인과 체인. */
export interface IndicatorCausalChainLink {
  readonly source: "EconomicIndicator";
  readonly target: "EconomicIndicator";
  readonly cardinality: "M:1";
  readonly fkProperty: "relatedIndicatorId";
  readonly reverseApiName: "relatedIndicators";
}

/** R-8: watchlistUser — Watchlist entry owner (M:1). / 관심목록 항목 소유자. */
export interface WatchlistUserLink {
  readonly source: "WatchlistEntry";
  readonly target: "User";
  readonly cardinality: "M:1";
  readonly fkProperty: "userId";
  readonly reverseApiName: "userWatchlistEntries";
}

/** R-9: watchlistStock — Watchlist entry stock (M:1). / 관심목록 항목 종목. */
export interface WatchlistStockLink {
  readonly source: "WatchlistEntry";
  readonly target: "Stock";
  readonly cardinality: "M:1";
  readonly fkProperty: "stockId";
  readonly reverseApiName: "stockWatchlistEntries";
}

/** R-10: newsStockLinkArticle — NewsStockLink to article (M:1). / 뉴스-종목 연결의 기사 참조. */
export interface NewsStockLinkArticleLink {
  readonly source: "NewsStockLink";
  readonly target: "NewsArticle";
  readonly cardinality: "M:1";
  readonly fkProperty: "newsArticleId";
  readonly reverseApiName: "articleNewsStockLinks";
}

/** R-11: newsStockLinkStock — NewsStockLink to stock (M:1). / 뉴스-종목 연결의 종목 참조. */
export interface NewsStockLinkStockLink {
  readonly source: "NewsStockLink";
  readonly target: "Stock";
  readonly cardinality: "M:1";
  readonly fkProperty: "stockId";
  readonly reverseApiName: "stockNewsStockLinks";
}

/** R-12: termUsageArticle — Term usage to article (M:1). / 용어 사용의 기사 참조. */
export interface TermUsageArticleLink {
  readonly source: "ArticleTermUsage";
  readonly target: "NewsArticle";
  readonly cardinality: "M:1";
  readonly fkProperty: "newsArticleId";
  readonly reverseApiName: "articleTermUsages";
}

/** R-13: termUsageTerm — Term usage to term (M:1). / 용어 사용의 용어 참조. */
export interface TermUsageTermLink {
  readonly source: "ArticleTermUsage";
  readonly target: "FinancialTerm";
  readonly cardinality: "M:1";
  readonly fkProperty: "termId";
  readonly reverseApiName: "termArticleUsages";
}
