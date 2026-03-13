/**
 * SaveTicker — Ontology LOGIC Domain (Redesign)
 *
 * 8 link types, 1 interface, 12 queries, 1 derived property, 2 functions.
 * Source of truth: research/saveticker-deep-dive.md, research/pm-portfolio-save-app.md
 * Reads from DATA domain (data.ts). Downstream: ACTION domain (action.ts).
 *
 * Changes from legacy (13 links, 20 queries, 3 derived, 8 functions):
 * - Removed all M:N join entity links and decompositions (userStock, newsArticleStock, newsArticleTerm + 6 decompositions)
 * - Removed all indicator/watchlist/glossary queries (14 queries removed)
 * - Removed price/indicator derived properties (priceDirection, isSurprise, surpriseDirection)
 * - Added ImpactChain/ImpactNode links (chainThread, chainNodes, nodeParent, nodeChain, nodeChildren)
 * - Added ImpactChain/ImpactNode queries (chainsByThread, chainNodes)
 * - Added articleCount derived property on StoryThread
 */

import type {
  LinkType,
  OntologyInterface,
  OntologyQuery,
  DerivedProperty,
  OntologyFunction,
} from "./schema.js";

// == SECTION: links ==
/** Link Types (relationships) / 링크 타입 (관계) */
export const linkTypes = [
  // -------------------------------------------------------------------------
  // R-1: StoryThread → NewsArticle (1:M)
  // -------------------------------------------------------------------------
  /** threadArticles: Articles belonging to a narrative timeline. / 내러티브 타임라인에 속한 기사들. */
  {
    apiName: "threadArticles",
    description: {
      en: "Articles belonging to a story thread narrative timeline",
      ko: "스토리 스레드 내러티브 타임라인에 속한 기사들",
    },
    sourceEntity: "StoryThread",
    targetEntity: "NewsArticle",
    cardinality: "1:M",
    fkProperty: "storyThreadId",
    fkSide: "target",
    reverseApiName: "articleThread",
  },

  // -------------------------------------------------------------------------
  // R-2: Explainer → NewsArticle (1:1)
  // -------------------------------------------------------------------------
  /** explainerArticle: One explainer per article (unique FK). / 기사당 하나의 설명 (고유 FK). */
  {
    apiName: "explainerArticle",
    description: {
      en: "One-to-one explainer for a news article — unique FK constraint",
      ko: "뉴스 기사의 1:1 설명 — 고유 FK 제약",
    },
    sourceEntity: "Explainer",
    targetEntity: "NewsArticle",
    cardinality: "1:1",
    fkProperty: "newsArticleId",
    fkSide: "source",
    reverseApiName: "articleExplainer",
  },

  // -------------------------------------------------------------------------
  // R-3: ImpactChain → StoryThread (M:1)
  // -------------------------------------------------------------------------
  /** chainThread: Every impact chain belongs to a story thread. / 모든 영향 체인은 스토리 스레드에 속함. */
  {
    apiName: "chainThread",
    description: {
      en: "Impact chain belongs to a story thread — many chains per thread",
      ko: "영향 체인이 스토리 스레드에 속함 — 스레드당 다수 체인 가능",
    },
    sourceEntity: "ImpactChain",
    targetEntity: "StoryThread",
    cardinality: "M:1",
    fkProperty: "storyThreadId",
    fkSide: "source",
    reverseApiName: "threadChains",
  },

  // -------------------------------------------------------------------------
  // R-4: ImpactChain → ImpactNode (1:M)
  // -------------------------------------------------------------------------
  /** chainNodes: All nodes in an impact chain. / 영향 체인의 모든 노드. */
  {
    apiName: "chainNodes",
    description: {
      en: "All nodes belonging to an impact chain",
      ko: "영향 체인에 속한 모든 노드",
    },
    sourceEntity: "ImpactChain",
    targetEntity: "ImpactNode",
    cardinality: "1:M",
    fkProperty: "chainId",
    fkSide: "target",
    reverseApiName: "nodeChain",
  },

  // -------------------------------------------------------------------------
  // R-5: ImpactNode → ImpactNode (M:1, self-referential)
  // -------------------------------------------------------------------------
  /** nodeParent: Self-referential parent link for tree structure. / 트리 구조를 위한 자기참조 부모 링크. */
  {
    apiName: "nodeParent",
    description: {
      en: "Self-referential link to parent node — null parentNodeId means root node",
      ko: "부모 노드 자기참조 링크 — parentNodeId null이면 루트 노드",
    },
    sourceEntity: "ImpactNode",
    targetEntity: "ImpactNode",
    cardinality: "M:1",
    fkProperty: "parentNodeId",
    fkSide: "source",
    reverseApiName: "nodeChildren",
  },

  // -------------------------------------------------------------------------
  // R-6: ImpactNode → ImpactChain (M:1, FK decomposition of R-4)
  // -------------------------------------------------------------------------
  /** nodeChain: Node belongs to a chain — FK decomposition of R-4. / 노드가 체인에 속함 — R-4의 FK 분해. */
  {
    apiName: "nodeChain",
    description: {
      en: "ImpactNode belongs to an ImpactChain — FK decomposition of R-4",
      ko: "ImpactNode가 ImpactChain에 속함 — R-4의 FK 분해",
    },
    sourceEntity: "ImpactNode",
    targetEntity: "ImpactChain",
    cardinality: "M:1",
    fkProperty: "chainId",
    fkSide: "source",
    reverseApiName: "chainNodes",
  },

  // -------------------------------------------------------------------------
  // R-7: ImpactNode → ImpactNode (1:M, reverse of R-5)
  // -------------------------------------------------------------------------
  /** nodeChildren: Children of a node in the tree. / 트리에서 노드의 자식들. */
  {
    apiName: "nodeChildren",
    description: {
      en: "Children of an impact node — reverse of nodeParent self-referential link",
      ko: "영향 노드의 자식들 — nodeParent 자기참조 링크의 역방향",
    },
    sourceEntity: "ImpactNode",
    targetEntity: "ImpactNode",
    cardinality: "1:M",
    fkProperty: "parentNodeId",
    fkSide: "target",
    reverseApiName: "nodeParent",
  },

  // -------------------------------------------------------------------------
  // R-8: NewsArticle → Explainer (1:1, reverse of R-2)
  // -------------------------------------------------------------------------
  /** articleExplainer: Reverse lookup — article's explainer. / 역방향 조회 — 기사의 설명. */
  {
    apiName: "articleExplainer",
    description: {
      en: "Reverse of explainerArticle — lookup an article's plain language card",
      ko: "explainerArticle의 역방향 — 기사의 쉬운 설명 카드 조회",
    },
    sourceEntity: "NewsArticle",
    targetEntity: "Explainer",
    cardinality: "1:1",
    fkProperty: "newsArticleId",
    fkSide: "target",
    reverseApiName: "explainerArticle",
  },
] as const satisfies readonly LinkType[];
// == END: links ==

// == SECTION: interfaces ==
/** Interfaces (shared contracts) / 인터페이스 (공유 계약) */
export const interfaces = [
  // -------------------------------------------------------------------------
  // I-1: Auditable — Entities that track modification metadata
  // -------------------------------------------------------------------------
  /** Auditable: Entities tracking last update timestamp and user. / 최종 수정 시각 및 수정자를 추적하는 엔티티. */
  {
    apiName: "Auditable",
    description: {
      en: "Entities tracking last update timestamp and user — promotes SharedPropertyType to polymorphic contract",
      ko: "최종 수정 시각 및 수정자를 추적하는 엔티티 — SharedPropertyType을 다형적 계약으로 승격",
    },
    properties: ["updatedAt", "updatedBy"],
    implementedBy: [
      "NewsArticle",
      "User",
      "StoryThread",
      "Explainer",
      "ImpactChain",
      "ImpactNode",
    ],
    // Stock excluded — reference data, no audit trail
  },
] as const satisfies readonly OntologyInterface[];
// == END: interfaces ==

// == SECTION: queries ==
/** Queries (Object Set patterns) / 쿼리 (오브젝트 셋 패턴) */
export const queries = [
  // =========================================================================
  // Feed & Discovery
  // =========================================================================

  /** Q-1: recentArticles — Latest news feed, newest first. / 최신 뉴스 피드, 최신순. */
  {
    apiName: "recentArticles",
    description: {
      en: "Latest news, newest first. SAVE's default feed equivalent.",
      ko: "최신 뉴스, 최신순. SAVE 기본 피드 동등.",
    },
    entityApiName: "NewsArticle",
    queryType: "list",
    parameters: [
      { name: "limit", type: "integer", description: { en: "Max results (default 20)", ko: "최대 결과 수 (기본 20)" }, required: false },
    ],
  },

  /** Q-2: articleById — Single article by ID. / ID로 단일 기사 조회. */
  {
    apiName: "articleById",
    description: {
      en: "Single article by ID",
      ko: "ID로 단일 기사 조회",
    },
    entityApiName: "NewsArticle",
    queryType: "getById",
    parameters: [
      { name: "articleId", type: "string", description: { en: "Article ID", ko: "기사 ID" }, required: true },
    ],
  },

  /** Q-3: articlesByTicker — Articles mentioning a specific ticker. / 특정 티커를 언급하는 기사. */
  {
    apiName: "articlesByTicker",
    description: {
      en: "Articles mentioning a specific ticker symbol in mentionedTickers array",
      ko: "mentionedTickers 배열에서 특정 티커 심볼을 언급하는 기사",
    },
    entityApiName: "NewsArticle",
    queryType: "filter",
    filterFields: [
      { propertyApiName: "mentionedTickers", operators: ["contains"] },
    ],
    parameters: [
      { name: "ticker", type: "string", description: { en: "Ticker symbol to search for", ko: "검색할 티커 심볼" }, required: true },
    ],
  },

  // =========================================================================
  // Story Threads (PM Feature 1)
  // =========================================================================

  /** Q-4: threadsByStatus — Active or completed threads. / 활성 또는 완료된 스레드. */
  {
    apiName: "threadsByStatus",
    description: {
      en: "Active or completed threads. Default: all.",
      ko: "활성 또는 완료된 스레드. 기본: 전체.",
    },
    entityApiName: "StoryThread",
    queryType: "filter",
    filterFields: [
      { propertyApiName: "status", operators: ["eq"] },
    ],
    parameters: [
      { name: "status", type: "string", description: { en: "Thread status filter (optional)", ko: "스레드 상태 필터 (선택)" }, required: false },
    ],
  },

  /** Q-5: threadArticlesList — Articles in a thread, ordered by orderInThread. / 스레드 내 기사, orderInThread 순. */
  {
    apiName: "threadArticlesList",
    description: {
      en: "Articles in a story thread, ordered by orderInThread ascending",
      ko: "스토리 스레드 내 기사, orderInThread 오름차순",
    },
    entityApiName: "NewsArticle",
    queryType: "filter",
    filterFields: [
      { propertyApiName: "storyThreadId", operators: ["eq"] },
    ],
    parameters: [
      { name: "storyThreadId", type: "string", description: { en: "StoryThread ID", ko: "스토리 스레드 ID" }, required: true },
    ],
  },

  /** Q-12: allThreads — All story threads. / 전체 스토리 스레드. */
  {
    apiName: "allThreads",
    description: {
      en: "All story threads",
      ko: "전체 스토리 스레드",
    },
    entityApiName: "StoryThread",
    queryType: "list",
  },

  // =========================================================================
  // Plain Language Cards (PM Feature 2)
  // =========================================================================

  /** Q-6: articleExplainer — 1:1 explainer lookup by newsArticleId. / newsArticleId로 1:1 설명 조회. */
  {
    apiName: "articleExplainer",
    description: {
      en: "1:1 explainer lookup for the 'Easy Explanation' tab",
      ko: "'쉬운 설명' 탭용 1:1 설명 조회",
    },
    entityApiName: "Explainer",
    queryType: "filter",
    filterFields: [
      { propertyApiName: "newsArticleId", operators: ["eq"] },
    ],
    parameters: [
      { name: "newsArticleId", type: "string", description: { en: "NewsArticle FK", ko: "뉴스 기사 FK" }, required: true },
    ],
  },

  // =========================================================================
  // Impact Chains (PM Feature 3)
  // =========================================================================

  /** Q-7: chainsByThread — Impact chains for a story thread. / 스토리 스레드의 영향 체인. */
  {
    apiName: "chainsByThread",
    description: {
      en: "Impact chains belonging to a story thread",
      ko: "스토리 스레드에 속한 영향 체인",
    },
    entityApiName: "ImpactChain",
    queryType: "filter",
    filterFields: [
      { propertyApiName: "storyThreadId", operators: ["eq"] },
    ],
    parameters: [
      { name: "storyThreadId", type: "string", description: { en: "StoryThread ID", ko: "스토리 스레드 ID" }, required: true },
    ],
  },

  /** Q-8: chainNodes — All nodes in an impact chain. / 영향 체인의 모든 노드. */
  {
    apiName: "chainNodes",
    description: {
      en: "All nodes in an impact chain, ordered by ordinal for rendering",
      ko: "영향 체인의 모든 노드, 렌더링용 ordinal 순",
    },
    entityApiName: "ImpactNode",
    queryType: "filter",
    filterFields: [
      { propertyApiName: "chainId", operators: ["eq"] },
    ],
    parameters: [
      { name: "chainId", type: "string", description: { en: "ImpactChain ID", ko: "영향 체인 ID" }, required: true },
    ],
  },

  // =========================================================================
  // Search & Utility
  // =========================================================================

  /** Q-9: searchArticles — Title prefix search. / 제목 접두어 검색. */
  {
    apiName: "searchArticles",
    description: {
      en: "Article title prefix search for search bar",
      ko: "검색바용 기사 제목 접두어 검색",
    },
    entityApiName: "NewsArticle",
    queryType: "search",
    filterFields: [
      { propertyApiName: "title", operators: ["startsWith", "contains"] },
    ],
    parameters: [
      { name: "query", type: "string", description: { en: "Search query string", ko: "검색 쿼리 문자열" }, required: true },
      { name: "limit", type: "integer", description: { en: "Max results (default 10)", ko: "최대 결과 수 (기본 10)" }, required: false },
    ],
  },

  /** Q-10: stockByTicker — Stock lookup by ticker. / 티커로 종목 조회. */
  {
    apiName: "stockByTicker",
    description: {
      en: "Stock lookup by ticker symbol",
      ko: "티커 심볼로 종목 조회",
    },
    entityApiName: "Stock",
    queryType: "filter",
    filterFields: [
      { propertyApiName: "ticker", operators: ["eq"] },
    ],
    parameters: [
      { name: "ticker", type: "string", description: { en: "Ticker symbol", ko: "티커 심볼" }, required: true },
    ],
  },

  /** Q-11: userById — User lookup. / 사용자 조회. */
  {
    apiName: "userById",
    description: {
      en: "Single user by ID",
      ko: "ID로 단일 사용자 조회",
    },
    entityApiName: "User",
    queryType: "getById",
    parameters: [
      { name: "userId", type: "string", description: { en: "User ID", ko: "사용자 ID" }, required: true },
    ],
  },
] as const satisfies readonly OntologyQuery[];
// == END: queries ==

// == SECTION: derived-properties ==
/** Derived Properties (computed values) / 파생 프로퍼티 (계산 값) */
export const derivedProperties = [
  // -------------------------------------------------------------------------
  // D-1: articleCount — Number of articles in a StoryThread
  // -------------------------------------------------------------------------
  /** articleCount: Count of articles linked to this thread. / 스레드에 연결된 기사 수. */
  {
    apiName: "articleCount",
    entityApiName: "StoryThread",
    description: {
      en: "Count of articles in thread — computed from threadArticles link traversal",
      ko: "스레드 내 기사 수 — threadArticles 링크 순회로 계산",
    },
    mode: "onRead",
    returnType: "integer",
    sourceProperties: ["id"],
    computeFn: "computeArticleCount",
  },
] as const satisfies readonly DerivedProperty[];
// == END: derived-properties ==

// == SECTION: functions ==
/** Functions (pure computation) / 함수 (순수 계산) */
export const functions = [
  // =========================================================================
  // Read Helper Functions
  // =========================================================================

  /** F-1: computeArticleCount — Implements D-1 derived property. / D-1 파생 프로퍼티 구현. */
  {
    apiName: "computeArticleCount",
    description: {
      en: "Implements D-1: counts articles linked via threadArticles (storyThreadId FK)",
      ko: "D-1 구현: threadArticles 링크(storyThreadId FK)로 연결된 기사 수 계산",
    },
    category: "readHelper",
    parameters: [
      { name: "threadId", type: "string", description: { en: "StoryThread ID", ko: "스토리 스레드 ID" }, required: true },
      { name: "articles", type: "NewsArticle[]", description: { en: "Articles with matching storyThreadId", ko: "storyThreadId가 일치하는 기사들" }, required: true },
    ],
    returnType: "integer",
    pureLogic: "return articles.filter(a => a.storyThreadId === threadId).length",
    operatesOn: "StoryThread",
  },

  // =========================================================================
  // Pure Logic Functions
  // =========================================================================

  /** F-2: validateExplainerCreate — 1:1 guard for Explainer creation. / Explainer 생성 1:1 가드. */
  {
    apiName: "validateExplainerCreate",
    description: {
      en: "Returns false if an explainer already exists for this article — enforces 1:1 unique constraint",
      ko: "이 기사에 이미 설명이 존재하면 false 반환 — 1:1 고유 제약 적용",
    },
    category: "pureLogic",
    parameters: [
      { name: "newsArticleId", type: "string", description: { en: "NewsArticle FK to check", ko: "확인할 뉴스 기사 FK" }, required: true },
      { name: "existingExplainers", type: "Explainer[]", description: { en: "Current explainers for lookup", ko: "조회용 현재 설명들" }, required: true },
    ],
    returnType: "boolean",
    pureLogic: "return !existingExplainers.some(e => e.newsArticleId === newsArticleId)",
  },
] as const satisfies readonly OntologyFunction[];
// == END: functions ==
