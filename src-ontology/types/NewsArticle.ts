import type { ArticleUrl } from "./branded.js";
import type { SourceAttribution } from "./structs.js";

/** NewsArticle — Financial news article. / 금융 뉴스 기사. */
export interface NewsArticle {
  readonly id: string;
  title: string;
  summary: string;
  body: string;
  readonly sourceUrl: ArticleUrl;
  imageUrl?: string;
  readonly publishedAt: Date;
  category: "general" | "breaking" | "analysis";
  source?: SourceAttribution;
  indicatorId?: string;
  storyThreadId?: string;
  orderInThread?: number;
  updatedAt: Date;
  updatedBy?: string;
}
