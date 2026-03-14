/**
 * SaveTicker v2.0 — Ontology DATA Domain
 *
 * Rebuilt against schemas v1.2.0 (34/34 DH coverage, Mode A).
 * 7 entities, 3 value types, 0 struct types, 1 shared property type.
 * Source of truth: docs/ontology-prompt.md, schemas/ontology/data/schema.ts
 * PM Portfolio 3 Features: Story Threads, Plain Language Cards, Impact Chains.
 *
 * v2.0 changes:
 * - Added translationStatus enum (LEARN loop: pending → reviewed → approved)
 * - Added translationNotes array (translation quality feedback)
 * - DH-DATA-01 through DH-DATA-09 applied to all entity decisions
 * - DH-DATA-05: imageUrl as string URL reference, no Attachment type (prototype scope)
 */

// == SECTION: entities ==

export const objectTypes = [
  // -------------------------------------------------------------------------
  // 1. NewsArticle — Core content hub
  // -------------------------------------------------------------------------
  {
    apiName: "NewsArticle",
    displayName: "News Article",
    pluralName: "NewsArticles",
    primaryKey: "id",
    titleKey: "title",
    description: {
      en: "Financial news article. Core content hub for SAVE multi-source feed.",
      ko: "금융 뉴스 기사. SAVE 멀티소스 피드의 핵심 콘텐츠 허브.",
    },
    properties: [
      {
        apiName: "id",
        type: "string",
        baseType: "string",
        required: true,
        readonly: true,
        description: { en: "Auto-generated unique identifier", ko: "자동 생성 고유 식별자" },
      },
      {
        apiName: "title",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "Article headline", ko: "기사 제목" },
        indexCandidate: true,
      },
      {
        apiName: "summary",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "Short summary for feed cards", ko: "피드 카드용 요약" },
      },
      {
        apiName: "body",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "Full article body text", ko: "기사 본문 전체 텍스트" },
      },
      {
        apiName: "titleKo",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "Korean title", ko: "한국어 제목" },
      },
      {
        apiName: "summaryKo",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "Korean summary (localized, investor perspective)", ko: "한국어 요약 (의역+투자자 관점)" },
      },
      {
        apiName: "bodyKo",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "Korean body (faithful translation)", ko: "한국어 본문 (직역)" },
      },
      {
        apiName: "sourceUrl",
        type: "ArticleUrl",
        baseType: "BrandedType",
        required: true,
        readonly: true,
        description: { en: "Original article URL", ko: "원본 기사 URL" },
        valueType: "ArticleUrl",
      },
      {
        apiName: "sourceName",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "Content source name (e.g., SAVE, Reuters, FinancialJuice)", ko: "콘텐츠 출처 이름 (예: SAVE, Reuters, FinancialJuice)" },
        // Replaces SourceAttribution struct — flat string sufficient for PM demo
      },
      {
        apiName: "category",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "Article category (종합/속보/분석)", ko: "기사 카테고리 (종합/속보/분석)" },
        constraints: [{ kind: "enum", values: ["general", "breaking", "analysis"] }],
        indexCandidate: true,
      },
      {
        apiName: "mentionedTickers",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "Ticker symbols mentioned in article", ko: "기사에 언급된 티커 심볼" },
        isArray: true,
        // Replaces NewsStockLink join entity — PM demo doesn't need full M:N
      },
      {
        apiName: "tags",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "Content tags for filtering (Korean financial categories)", ko: "필터링용 콘텐츠 태그 (한국 금융 카테고리)" },
        isArray: true,
        constraints: [{ kind: "enum", values: ["에너지", "기업분석", "암호화폐", "경제지표", "헤드라인", "정보", "사모신용", "지정학"] }],
        indexCandidate: true,
      },
      {
        apiName: "imageUrl",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "Article thumbnail image URL", ko: "기사 썸네일 이미지 URL" },
      },
      {
        apiName: "isOfficial",
        type: "boolean",
        baseType: "boolean",
        required: false,
        readonly: false,
        description: { en: "Whether article is from official source (false = rumor/카더라)", ko: "공식 출처 여부 (false = 카더라)" },
      },
      {
        apiName: "translationStatus",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "Translation pipeline status (LEARN loop feedback)", ko: "번역 파이프라인 상태 (LEARN 루프 피드백)" },
        constraints: [{ kind: "enum", values: ["pending", "reviewed", "approved"] }],
        indexCandidate: true,
        // DH-DATA-06: Versioning strategy — translation status tracks content lifecycle
      },
      {
        apiName: "translationNotes",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "Translation review notes for quality feedback", ko: "번역 품질 피드백용 리뷰 노트" },
        isArray: true,
        // Captures reviewer comments during translation pipeline
      },
      {
        apiName: "publishedAt",
        type: "timestamp",
        baseType: "timestamp",
        required: true,
        readonly: true,
        description: { en: "Original publication timestamp", ko: "원본 발행 시각" },
        indexCandidate: true,
      },
      {
        apiName: "storyThreadId",
        type: "StoryThread",
        baseType: "FK",
        required: false,
        readonly: false,
        description: { en: "FK to StoryThread (nullable)", ko: "스토리 스레드 FK (nullable)" },
        targetEntity: "StoryThread",
        indexCandidate: true,
      },
      {
        apiName: "orderInThread",
        type: "integer",
        baseType: "integer",
        required: false,
        readonly: false,
        description: { en: "Position within StoryThread timeline", ko: "스토리 스레드 내 순서" },
      },
      {
        apiName: "updatedAt",
        type: "timestamp",
        baseType: "timestamp",
        required: true,
        readonly: false,
        description: { en: "Last update timestamp", ko: "최종 수정 시각" },
      },
      {
        apiName: "updatedBy",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "User who last updated this record", ko: "최종 수정자" },
      },
    ],
    implements: ["Auditable"],
    indexCandidates: ["title", "category", "publishedAt", "storyThreadId", "tags", "translationStatus"],
  },

  // -------------------------------------------------------------------------
  // 2. User — Minimal app user identity
  // -------------------------------------------------------------------------
  {
    apiName: "User",
    displayName: "User",
    pluralName: "Users",
    primaryKey: "id",
    titleKey: "displayName",
    description: {
      en: "App user identity. Korean-only for PM demo.",
      ko: "앱 사용자 정보. PM 데모용 한국어 전용.",
    },
    properties: [
      {
        apiName: "id",
        type: "string",
        baseType: "string",
        required: true,
        readonly: true,
        description: { en: "Auto-generated unique identifier", ko: "자동 생성 고유 식별자" },
      },
      {
        apiName: "displayName",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "User display name", ko: "사용자 표시 이름" },
      },
      {
        apiName: "email",
        type: "EmailAddress",
        baseType: "BrandedType",
        required: true,
        readonly: false,
        description: { en: "Email address, unique", ko: "이메일 주소, 고유" },
        valueType: "EmailAddress",
        indexCandidate: true,
      },
      {
        apiName: "updatedAt",
        type: "timestamp",
        baseType: "timestamp",
        required: true,
        readonly: false,
        description: { en: "Last update timestamp", ko: "최종 수정 시각" },
      },
      {
        apiName: "updatedBy",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "User who last updated this record", ko: "최종 수정자" },
      },
    ],
    implements: ["Auditable"],
    indexCandidates: ["email"],
  },

  // -------------------------------------------------------------------------
  // 3. StoryThread — PM Feature 1: chronological narrative grouping
  // -------------------------------------------------------------------------
  {
    apiName: "StoryThread",
    displayName: "Story Thread",
    pluralName: "StoryThreads",
    primaryKey: "id",
    titleKey: "title",
    description: {
      en: "Chronological narrative grouping. PM Feature 1 — connects disconnected breaking news into timelines.",
      ko: "시간순 내러티브 그룹. PM 기능 1 — 단편 속보를 스토리 타임라인으로 연결.",
    },
    properties: [
      {
        apiName: "id",
        type: "string",
        baseType: "string",
        required: true,
        readonly: true,
        description: { en: "Auto-generated unique identifier", ko: "자동 생성 고유 식별자" },
      },
      {
        apiName: "title",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "English title", ko: "영문 제목" },
      },
      {
        apiName: "titleKo",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "Korean title", ko: "한국어 제목" },
      },
      {
        apiName: "description",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "English description", ko: "영문 설명" },
      },
      {
        apiName: "descriptionKo",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "Korean description", ko: "한국어 설명" },
      },
      {
        apiName: "status",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "Thread status", ko: "스레드 상태" },
        constraints: [{ kind: "enum", values: ["active", "completed"] }],
        indexCandidate: true,
      },
      {
        apiName: "updatedAt",
        type: "timestamp",
        baseType: "timestamp",
        required: true,
        readonly: false,
        description: { en: "Last update timestamp", ko: "최종 수정 시각" },
      },
      {
        apiName: "updatedBy",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "User who last updated this record", ko: "최종 수정자" },
      },
    ],
    implements: ["Auditable"],
    indexCandidates: ["status"],
  },

  // -------------------------------------------------------------------------
  // 4. Explainer — PM Feature 2: plain language card (renamed from ArticleExplainer)
  // -------------------------------------------------------------------------
  {
    apiName: "Explainer",
    displayName: "Explainer",
    pluralName: "Explainers",
    primaryKey: "id",
    titleKey: "simplifiedTitle",
    description: {
      en: "Plain language card for a news article. PM Feature 2 — simplified financial news with personal impact.",
      ko: "뉴스 기사의 쉬운 설명 카드. PM 기능 2 — 개인 영향 포함 금융 뉴스 쉬운 설명.",
    },
    properties: [
      {
        apiName: "id",
        type: "string",
        baseType: "string",
        required: true,
        readonly: true,
        description: { en: "Auto-generated unique identifier", ko: "자동 생성 고유 식별자" },
      },
      {
        apiName: "newsArticleId",
        type: "NewsArticle",
        baseType: "FK",
        required: true,
        readonly: true,
        description: { en: "FK to NewsArticle (unique — 1:1 constraint)", ko: "뉴스 기사 FK (고유 — 1:1 제약)" },
        targetEntity: "NewsArticle",
        indexCandidate: true,
      },
      {
        apiName: "simplifiedTitle",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "Simplified headline for financial literacy", ko: "금융 리터러시를 위한 쉬운 제목" },
      },
      {
        apiName: "storyBody",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "Plain language narrative body", ko: "쉬운 말 본문" },
      },
      {
        apiName: "keyTakeaways",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "Bullet-point key insights (3-5 items)", ko: "핵심 인사이트 (3-5개 항목)" },
        isArray: true,
      },
      {
        apiName: "personalImpact",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "Personal impact section — 'How does this affect me?'", ko: "'나에게 어떤 영향?' 섹션" },
        // NEW: PM Feature 2's key differentiator
      },
      {
        apiName: "analogy",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "Real-world analogy for complex concepts", ko: "복잡한 개념의 실생활 비유" },
      },
      {
        apiName: "difficultyLevel",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "Content difficulty level", ko: "콘텐츠 난이도" },
        constraints: [{ kind: "enum", values: ["beginner", "intermediate", "advanced"] }],
        indexCandidate: true,
      },
      {
        apiName: "updatedAt",
        type: "timestamp",
        baseType: "timestamp",
        required: true,
        readonly: false,
        description: { en: "Last update timestamp", ko: "최종 수정 시각" },
      },
      {
        apiName: "updatedBy",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "User who last updated this record", ko: "최종 수정자" },
      },
    ],
    implements: ["Auditable"],
    indexCandidates: ["newsArticleId", "difficultyLevel"],
  },

  // -------------------------------------------------------------------------
  // 5. Stock — Lean reference data (no price tracking)
  // -------------------------------------------------------------------------
  {
    apiName: "Stock",
    displayName: "Stock",
    pluralName: "Stocks",
    primaryKey: "id",
    titleKey: "name",
    description: {
      en: "Lean stock reference data. Ticker, name, sector only — no price tracking for PM demo.",
      ko: "간소화된 종목 참조 데이터. 티커, 이름, 섹터만 — PM 데모에 가격 추적 불필요.",
    },
    properties: [
      {
        apiName: "id",
        type: "string",
        baseType: "string",
        required: true,
        readonly: true,
        description: { en: "Auto-generated unique identifier", ko: "자동 생성 고유 식별자" },
      },
      {
        apiName: "ticker",
        type: "Ticker",
        baseType: "BrandedType",
        required: true,
        readonly: true,
        description: { en: "Uppercase 1-5 char stock ticker symbol", ko: "대문자 1-5자 주식 티커 심볼" },
        valueType: "Ticker",
        indexCandidate: true,
      },
      {
        apiName: "name",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "English name (e.g., Apple Inc.)", ko: "영문 이름 (예: Apple Inc.)" },
      },
      {
        apiName: "nameKo",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "Korean name (e.g., 애플)", ko: "한국어 이름 (예: 애플)" },
      },
      {
        apiName: "sector",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "Industry sector classification", ko: "산업 섹터 분류" },
        constraints: [{ kind: "enum", values: ["technology", "healthcare", "finance", "consumer", "energy", "industrials", "etf"] }],
        indexCandidate: true,
      },
    ],
    // No implements: ["Auditable"] — Stock is reference data, not user-edited
    indexCandidates: ["ticker", "sector"],
  },

  // -------------------------------------------------------------------------
  // 6. ImpactChain — PM Feature 3: cause-effect container
  // -------------------------------------------------------------------------
  {
    apiName: "ImpactChain",
    displayName: "Impact Chain",
    pluralName: "ImpactChains",
    primaryKey: "id",
    titleKey: "title",
    description: {
      en: "Cause-effect chain container. PM Feature 3 — linked to a StoryThread for domino visualizations.",
      ko: "원인-결과 체인 컨테이너. PM 기능 3 — 도미노 시각화를 위해 StoryThread에 연결.",
    },
    properties: [
      {
        apiName: "id",
        type: "string",
        baseType: "string",
        required: true,
        readonly: true,
        description: { en: "Auto-generated unique identifier", ko: "자동 생성 고유 식별자" },
      },
      {
        apiName: "storyThreadId",
        type: "StoryThread",
        baseType: "FK",
        required: true,
        readonly: false,
        description: { en: "FK to StoryThread — every chain belongs to a story", ko: "StoryThread FK — 모든 체인은 스토리에 속함" },
        targetEntity: "StoryThread",
        indexCandidate: true,
      },
      {
        apiName: "title",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "English title (e.g., Iran Hormuz Strait Blockade Impact Chain)", ko: "영문 제목 (예: 이란 호르무즈 봉쇄 영향 체인)" },
      },
      {
        apiName: "titleKo",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "Korean title", ko: "한국어 제목" },
      },
      {
        apiName: "description",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "English description", ko: "영문 설명" },
      },
      {
        apiName: "descriptionKo",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "Korean description", ko: "한국어 설명" },
      },
      {
        apiName: "updatedAt",
        type: "timestamp",
        baseType: "timestamp",
        required: true,
        readonly: false,
        description: { en: "Last update timestamp", ko: "최종 수정 시각" },
      },
      {
        apiName: "updatedBy",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "User who last updated this record", ko: "최종 수정자" },
      },
    ],
    implements: ["Auditable"],
    indexCandidates: ["storyThreadId"],
  },

  // -------------------------------------------------------------------------
  // 7. ImpactNode — PM Feature 3: individual node in cause-effect chain
  // -------------------------------------------------------------------------
  {
    apiName: "ImpactNode",
    displayName: "Impact Node",
    pluralName: "ImpactNodes",
    primaryKey: "id",
    titleKey: "label",
    description: {
      en: "Individual node in an impact chain. Self-referential tree via parentNodeId.",
      ko: "영향 체인의 개별 노드. parentNodeId를 통한 자기참조 트리 구조.",
    },
    properties: [
      {
        apiName: "id",
        type: "string",
        baseType: "string",
        required: true,
        readonly: true,
        description: { en: "Auto-generated unique identifier", ko: "자동 생성 고유 식별자" },
      },
      {
        apiName: "chainId",
        type: "ImpactChain",
        baseType: "FK",
        required: true,
        readonly: false,
        description: { en: "FK to ImpactChain", ko: "ImpactChain FK" },
        targetEntity: "ImpactChain",
        indexCandidate: true,
      },
      {
        apiName: "parentNodeId",
        type: "ImpactNode",
        baseType: "FK",
        required: false,
        readonly: false,
        description: { en: "Self-referential FK to parent node (null = root)", ko: "부모 노드 자기참조 FK (null = 루트)" },
        targetEntity: "ImpactNode",
        indexCandidate: true,
      },
      {
        apiName: "newsArticleId",
        type: "NewsArticle",
        baseType: "FK",
        required: false,
        readonly: false,
        description: { en: "FK to source NewsArticle (connects node to its evidence)", ko: "출처 뉴스 기사 FK (노드를 근거 기사에 연결)" },
        targetEntity: "NewsArticle",
        indexCandidate: true,
      },
      {
        apiName: "label",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "Node label (e.g., Iran Hormuz Strait Blockade)", ko: "노드 라벨 (예: 이란 호르무즈 봉쇄)" },
      },
      {
        apiName: "labelKo",
        type: "string",
        baseType: "string",
        required: true,
        readonly: false,
        description: { en: "Korean node label", ko: "한국어 노드 라벨" },
      },
      {
        apiName: "description",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "Longer explanation of this node", ko: "노드에 대한 상세 설명" },
      },
      {
        apiName: "descriptionKo",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "Korean longer explanation", ko: "한국어 상세 설명" },
      },
      {
        apiName: "ordinal",
        type: "integer",
        baseType: "integer",
        required: true,
        readonly: false,
        description: { en: "Sibling ordering among children at the same level", ko: "같은 레벨 자식 노드 간 정렬 순서" },
      },
      {
        apiName: "updatedAt",
        type: "timestamp",
        baseType: "timestamp",
        required: true,
        readonly: false,
        description: { en: "Last update timestamp", ko: "최종 수정 시각" },
      },
      {
        apiName: "updatedBy",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "User who last updated this record", ko: "최종 수정자" },
      },
    ],
    implements: ["Auditable"],
    indexCandidates: ["chainId", "parentNodeId", "newsArticleId"],
  },
] as const;

// == SECTION: value-types ==

export const valueTypes = [
  {
    apiName: "Ticker",
    baseType: "string",
    description: {
      en: "Stock ticker symbol. 1-5 uppercase letters.",
      ko: "주식 티커 심볼. 대문자 1-5자.",
    },
    constraints: [
      { kind: "regex", pattern: "^[A-Z]{1,5}$", message: "Ticker must be 1-5 uppercase letters" },
    ],
    validatorFn: "validateTicker",
  },
  {
    apiName: "EmailAddress",
    baseType: "string",
    description: {
      en: "Valid email address format.",
      ko: "유효한 이메일 주소 형식.",
    },
    constraints: [
      { kind: "regex", pattern: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", message: "Must be a valid email address" },
    ],
    validatorFn: "validateEmail",
  },
  {
    apiName: "ArticleUrl",
    baseType: "string",
    description: {
      en: "Valid HTTPS article URL.",
      ko: "유효한 HTTPS 기사 URL.",
    },
    constraints: [
      { kind: "regex", pattern: "^https://", message: "Must be a valid HTTPS URL" },
    ],
    validatorFn: "validateArticleUrl",
  },
] as const;

// == SECTION: structs ==

export const structTypes = [] as const;

// == SECTION: shared-properties ==

export const sharedPropertyTypes = [
  {
    apiName: "Auditable",
    description: {
      en: "Audit trail properties: last update timestamp and user.",
      ko: "감사 추적 속성: 최종 수정 시각 및 수정자.",
    },
    properties: [
      {
        apiName: "updatedAt",
        type: "timestamp",
        baseType: "timestamp",
        required: true,
        readonly: false,
        description: { en: "Last update timestamp", ko: "최종 수정 시각" },
      },
      {
        apiName: "updatedBy",
        type: "string",
        baseType: "string",
        required: false,
        readonly: false,
        description: { en: "User who last updated this record", ko: "최종 수정자" },
      },
    ],
    usedBy: [
      "NewsArticle",
      "User",
      "StoryThread",
      "Explainer",
      "ImpactChain",
      "ImpactNode",
    ],
  },
] as const;
