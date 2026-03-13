// convex/schema.ts
// Generated from ontology/data.ts + ontology/logic.ts
// 4 entities → 4 tables (stocks, newsArticles, users, explainers)
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ===========================================================================
  // 1. stocks — Lean reference data for publicly traded stocks
  // ===========================================================================

  /**
   * Lean stock reference: ticker, name, sector only. No price tracking.
   * 종목 참조 데이터: 티커, 이름, 섹터만. 가격 추적 없음.
   */
  stocks: defineTable({
    /** English name (e.g., Apple Inc.) / 영문 이름 (예: Apple Inc.) */
    name: v.string(),
    /** Korean name (e.g., 애플) / 한국어 이름 (예: 애플) */
    nameKo: v.string(),
    /** Uppercase 1-5 char stock ticker symbol (ValueType: Ticker) / 대문자 1-5자 주식 티커 심볼 */
    ticker: v.string(),
    /** Industry sector classification / 산업 섹터 분류 */
    sector: v.union(
      v.literal("technology"),
      v.literal("healthcare"),
      v.literal("finance"),
      v.literal("consumer"),
      v.literal("energy"),
      v.literal("industrials"),
      v.literal("etf"),
    ),
  })
    .index("by_ticker", ["ticker"])
    .index("by_sector", ["sector"])
    .searchIndex("search_name", { searchField: "name", filterFields: ["sector"] }),

  // ===========================================================================
  // 2. newsArticles — Financial news articles
  // ===========================================================================

  /**
   * Financial news article. Flat sourceName, mentionedTickers array.
   * 금융 뉴스 기사. 플랫 sourceName, mentionedTickers 배열.
   */
  newsArticles: defineTable({
    /** Article headline / 기사 제목 */
    title: v.string(),
    /** Short summary for feed cards / 피드 카드용 요약 */
    summary: v.string(),
    /** Full article body text / 기사 본문 전체 텍스트 */
    body: v.string(),
    /** Original article URL (ValueType: ArticleUrl) / 원본 기사 URL */
    sourceUrl: v.string(),
    /** Content source name (flat string) / 콘텐츠 출처 이름 (플랫 문자열) */
    sourceName: v.optional(v.string()),
    /** Original publication timestamp / 원본 발행 시각 */
    publishedAt: v.number(),
    /** Article category / 기사 카테고리 */
    category: v.union(
      v.literal("general"),
      v.literal("breaking"),
      v.literal("analysis"),
    ),
    /** Ticker symbols mentioned in this article / 이 기사에 언급된 티커 심볼 */
    mentionedTickers: v.optional(v.array(v.string())),
    /** Content tags for filtering (Korean financial categories) / 필터링용 콘텐츠 태그 */
    tags: v.optional(v.array(v.string())),
    /** Article thumbnail image URL / 기사 썸네일 이미지 URL */
    imageUrl: v.optional(v.string()),
    /** Whether article is from official source (false = rumor) / 공식 출처 여부 */
    isOfficial: v.optional(v.boolean()),
    /** Korean title / 한국어 제목 */
    titleKo: v.optional(v.string()),
    /** Korean summary (의역+요약, investor perspective) / 한국어 요약 (투자자 관점 의역) */
    summaryKo: v.optional(v.string()),
    /** Korean body (직역, faithful translation) / 한국어 본문 (직역) */
    bodyKo: v.optional(v.string()),
    /** Last update timestamp / 최종 수정 시각 */
    updatedAt: v.number(),
    /** User who last updated this record / 최종 수정자 */
    updatedBy: v.optional(v.string()),
  })
    .index("by_publishedAt", ["publishedAt"])
    .index("by_category", ["category"])
    .index("by_sourceName", ["sourceName"])
    .searchIndex("search_title", { searchField: "title", filterFields: ["category"] }),

  // ===========================================================================
  // 3. users — App user identity
  // ===========================================================================

  /**
   * App user identity. No language preference.
   * 앱 사용자 정보. 언어 설정 없음.
   */
  users: defineTable({
    /** User display name / 사용자 표시 이름 */
    displayName: v.string(),
    /** Email address, unique (ValueType: EmailAddress) / 이메일 주소, 고유 */
    email: v.string(),
    /** Last update timestamp / 최종 수정 시각 */
    updatedAt: v.number(),
    /** User who last updated this record / 최종 수정자 */
    updatedBy: v.optional(v.string()),
  })
    .index("by_email", ["email"]),

  // ===========================================================================
  // 5. explainers — Plain language card (PM Feature 2, was articleExplainers)
  // ===========================================================================

  /**
   * Plain language card for a news article. 1:1 with NewsArticle.
   * 뉴스 기사의 쉬운 설명 카드. NewsArticle과 1:1.
   */
  explainers: defineTable({
    /** FK to NewsArticle (unique — 1:1 constraint) / 뉴스 기사 FK (고유 — 1:1 제약) */
    newsArticleId: v.id("newsArticles"),
    /** Simplified headline / 쉬운 제목 */
    simplifiedTitle: v.string(),
    /** Storytelling narrative body / 스토리텔링 본문 */
    storyBody: v.string(),
    /** Bullet-point key insights (3-5 items) / 핵심 인사이트 (3-5개 항목) */
    keyTakeaways: v.array(v.string()),
    /** How this news impacts the reader personally / 이 뉴스가 독자에게 미치는 개인적 영향 */
    personalImpact: v.optional(v.string()),
    /** Real-world analogy for complex concepts / 복잡한 개념의 실생활 비유 */
    analogy: v.optional(v.string()),
    /** Content difficulty level / 콘텐츠 난이도 */
    difficultyLevel: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
    ),
    /** Last update timestamp / 최종 수정 시각 */
    updatedAt: v.number(),
    /** User who last updated this record / 최종 수정자 */
    updatedBy: v.optional(v.string()),
  })
    .index("by_newsArticleId", ["newsArticleId"])
    .index("by_difficultyLevel", ["difficultyLevel"]),

});
