// convex/schema.ts
// Generated from ontology/data.ts + ontology/logic.ts
// 7 entities → 7 tables (stocks, newsArticles, users, storyThreads, explainers, impactChains, impactNodes)
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
    /** FK to StoryThread (PM Feature 1) / 스토리 스레드 FK */
    storyThreadId: v.optional(v.id("storyThreads")),
    /** Position within thread timeline / 스레드 내 순서 */
    orderInThread: v.optional(v.number()),
    /** Korean title / 한국어 제목 */
    titleKo: v.optional(v.string()),
    /** Korean summary (의역+요약, investor perspective) / 한국어 요약 (투자자 관점 의역) */
    summaryKo: v.optional(v.string()),
    /** Korean body (직역, faithful translation) / 한국어 본문 (직역) */
    bodyKo: v.optional(v.string()),
    /** Translation review status (PM QA pipeline) / 번역 검수 상태 */
    translationStatus: v.optional(
      v.union(v.literal("pending"), v.literal("reviewed"), v.literal("approved")),
    ),
    /** PM review notes on translation quality / PM 번역 검수 노트 */
    translationNotes: v.optional(v.array(v.string())),
    /** Last update timestamp / 최종 수정 시각 */
    updatedAt: v.number(),
    /** User who last updated this record / 최종 수정자 */
    updatedBy: v.optional(v.string()),
  })
    .index("by_publishedAt", ["publishedAt"])
    .index("by_category", ["category"])
    .index("by_sourceName", ["sourceName"])
    .index("by_storyThreadId", ["storyThreadId"])
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
  // 4. storyThreads — Narrative thread grouping (PM Feature 1)
  // ===========================================================================

  /**
   * Groups related breaking news into chronological timelines.
   * 관련 속보를 시간순 타임라인으로 묶는 스토리 스레드.
   */
  storyThreads: defineTable({
    /** Thread headline / 스레드 제목 */
    title: v.string(),
    /** Korean thread headline / 한국어 스레드 제목 */
    titleKo: v.string(),
    /** Thread description / 스레드 설명 */
    description: v.optional(v.string()),
    /** Korean thread description / 한국어 스레드 설명 */
    descriptionKo: v.optional(v.string()),
    /** Thread lifecycle status / 스레드 상태 */
    status: v.union(v.literal("active"), v.literal("completed")),
    /** Last update timestamp / 최종 수정 시각 */
    updatedAt: v.number(),
    /** User who last updated this record / 최종 수정자 */
    updatedBy: v.optional(v.string()),
  })
    .index("by_status", ["status"]),

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

  // ===========================================================================
  // 6. impactChains — Cause-effect chain container (PM Feature 3)
  // ===========================================================================

  /**
   * Cause-effect chain linked to a StoryThread for domino visualizations.
   * 도미노 시각화를 위해 StoryThread에 연결된 원인-결과 체인.
   */
  impactChains: defineTable({
    /** FK to StoryThread — every chain belongs to a story / StoryThread FK */
    storyThreadId: v.id("storyThreads"),
    /** English title / 영문 제목 */
    title: v.string(),
    /** Korean title / 한국어 제목 */
    titleKo: v.string(),
    /** English description / 영문 설명 */
    description: v.optional(v.string()),
    /** Korean description / 한국어 설명 */
    descriptionKo: v.optional(v.string()),
    /** Last update timestamp / 최종 수정 시각 */
    updatedAt: v.number(),
    /** User who last updated this record / 최종 수정자 */
    updatedBy: v.optional(v.string()),
  })
    .index("by_storyThreadId", ["storyThreadId"]),

  // ===========================================================================
  // 7. impactNodes — Individual node in cause-effect chain (PM Feature 3)
  // ===========================================================================

  /**
   * Individual node in an impact chain. Self-referential tree via parentNodeId.
   * 영향 체인의 개별 노드. parentNodeId를 통한 자기참조 트리 구조.
   */
  impactNodes: defineTable({
    /** FK to ImpactChain / 영향 체인 FK */
    chainId: v.id("impactChains"),
    /** Self-referential FK to parent node (null = root) / 부모 노드 FK (null = 루트) */
    parentNodeId: v.optional(v.id("impactNodes")),
    /** FK to source NewsArticle (evidence link) / 출처 뉴스 기사 FK */
    newsArticleId: v.optional(v.id("newsArticles")),
    /** Node label / 노드 라벨 */
    label: v.string(),
    /** Korean node label / 한국어 노드 라벨 */
    labelKo: v.string(),
    /** Longer explanation / 상세 설명 */
    description: v.optional(v.string()),
    /** Korean longer explanation / 한국어 상세 설명 */
    descriptionKo: v.optional(v.string()),
    /** Sibling ordering among children / 같은 레벨 자식 간 정렬 순서 */
    ordinal: v.number(),
    /** Last update timestamp / 최종 수정 시각 */
    updatedAt: v.number(),
    /** User who last updated this record / 최종 수정자 */
    updatedBy: v.optional(v.string()),
  })
    .index("by_chainId", ["chainId"])
    .index("by_parentNodeId", ["parentNodeId"]),

});
