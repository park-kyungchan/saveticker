/** Auditable — Entities tracking last update timestamp and user. / 최종 수정 시각 및 수정자 추적. */
export interface Auditable {
  updatedAt: Date;
  updatedBy?: string;
}

export type { Stock } from "./Stock.js";
export type { NewsArticle } from "./NewsArticle.js";
export type { User } from "./User.js";
export type { EconomicIndicator } from "./EconomicIndicator.js";
export type { StoryThread } from "./StoryThread.js";
export type { WatchlistEntry } from "./WatchlistEntry.js";
export type { NewsStockLink } from "./NewsStockLink.js";
export type { ArticleExplainer } from "./ArticleExplainer.js";
export type { FinancialTerm } from "./FinancialTerm.js";
export type { ArticleTermUsage } from "./ArticleTermUsage.js";
export * from "./branded.js";
export type { SourceAttribution } from "./structs.js";
