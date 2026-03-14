/**
 * SaveTicker v2.0 — Ontology LOGIC Domain
 *
 * Rebuilt against schemas v1.2.0 (34/34 DH coverage, Mode A).
 * 9 link types, 2 interfaces, 15 queries, 2 derived properties, 4 functions.
 * Source of truth: docs/ontology-prompt.md, schemas/ontology/logic/schema.ts
 * Reads from DATA domain (data.ts). Downstream: ACTION domain (action.ts).
 *
 * v2.0 changes:
 * - Added IBilingual interface (title/titleKo bilingual contract)
 * - Added nodeCount derived property on ImpactChain
 * - Added collectDescendantIds function (cascade delete support)
 * - Added validateImpactNodeDelete function (cascade delete guard)
 * - Added toolExposure field to functions (Pattern 2: Logic Tool Handoff)
 * - DH-LOGIC-01 through DH-LOGIC-07 applied to all decisions
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
  // -------------------------------------------------------------------------
  // R-9: ImpactNode → NewsArticle (M:1)
  // -------------------------------------------------------------------------
  /** nodeArticle: Impact node linked to its source article. / 영향 노드가 출처 기사에 연결. */
  {
    apiName: "nodeArticle",
    description: {
      en: "Impact node linked to the news article that evidences it",
      ko: "영향 노드가 근거가 되는 뉴스 기사에 연결",
    },
    sourceEntity: "ImpactNode",
    targetEntity: "NewsArticle",
    cardinality: "M:1",
    fkProperty: "newsArticleId",
    fkSide: "source",
    reverseApiName: "articleNodes",
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

  // -------------------------------------------------------------------------
  // I-2: Bilingual — Entities with English/Korean title pairs
  // -------------------------------------------------------------------------
  /** Bilingual: Entities with title/titleKo bilingual pairs. / title/titleKo 이중 언어 쌍을 가진 엔티티. */
  {
    apiName: "Bilingual",
    description: {
      en: "Entities with bilingual title pairs (title + titleKo) — enables unified language toggle UX",
      ko: "이중 언어 제목 쌍(title + titleKo)을 가진 엔티티 — 통합 언어 전환 UX 지원",
    },
    properties: ["title", "titleKo"],
    implementedBy: [
      "StoryThread",
      "ImpactChain",
    ],
    // NewsArticle excluded — has title but titleKo is optional (translation pipeline)
    // ImpactNode uses label/labelKo pattern instead of title/titleKo
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

  // =========================================================================
  // Feed Filtering (News Tab)
  // =========================================================================

  /** Q-13: articlesByCategory — Filter by category enum. / 카테고리 enum 필터. */
  {
    apiName: "articlesByCategory",
    description: {
      en: "Articles filtered by category (general/breaking/analysis)",
      ko: "카테고리별 기사 필터 (일반/속보/분석)",
    },
    entityApiName: "NewsArticle",
    queryType: "filter",
    filterFields: [
      { propertyApiName: "category", operators: ["eq"] },
    ],
    parameters: [
      { name: "category", type: "string", description: { en: "Category to filter by", ko: "필터링할 카테고리" }, required: true },
    ],
  },

  /** Q-14: articlesBySource — Filter by sourceName. / 출처 이름 필터. */
  {
    apiName: "articlesBySource",
    description: {
      en: "Articles filtered by source name",
      ko: "출처 이름별 기사 필터",
    },
    entityApiName: "NewsArticle",
    queryType: "filter",
    filterFields: [
      { propertyApiName: "sourceName", operators: ["eq"] },
    ],
    parameters: [
      { name: "sourceName", type: "string", description: { en: "Source name to filter by", ko: "필터링할 출처 이름" }, required: true },
    ],
  },

  /** Q-15: articlesByTag — Filter by tags array contains. / 태그 배열 포함 필터. */
  {
    apiName: "articlesByTag",
    description: {
      en: "Articles containing a specific tag in their tags array",
      ko: "태그 배열에 특정 태그를 포함하는 기사",
    },
    entityApiName: "NewsArticle",
    queryType: "filter",
    filterFields: [
      { propertyApiName: "tags", operators: ["contains"] },
    ],
    parameters: [
      { name: "tag", type: "string", description: { en: "Tag to search for", ko: "검색할 태그" }, required: true },
    ],
  },
  // =========================================================================
  // Hero Card (View Count)
  // =========================================================================

  /** Q-16: todayMostViewed — Most viewed article in last 24 hours. / 24시간 내 최다 조회 기사. */
  {
    apiName: "todayMostViewed",
    description: {
      en: "Most viewed article in the last 24 hours — used for hero card selection. Falls back to most recent if no views.",
      ko: "최근 24시간 내 최다 조회 기사 — hero 카드 선택에 사용. 조회수 없으면 최신 기사로 폴백.",
    },
    entityApiName: "NewsArticle",
    queryType: "filter",
    filterFields: [
      { propertyApiName: "publishedAt", operators: ["gte"] },
      { propertyApiName: "viewCount", operators: ["desc"] },
    ],
    parameters: [],
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
  // -------------------------------------------------------------------------
  // D-2: nodeCount — Number of nodes in an ImpactChain
  // -------------------------------------------------------------------------
  /** nodeCount: Count of nodes in an impact chain. / 영향 체인 내 노드 수. */
  {
    apiName: "nodeCount",
    entityApiName: "ImpactChain",
    description: {
      en: "Count of nodes in chain — computed from chainNodes link traversal",
      ko: "체인 내 노드 수 — chainNodes 링크 순회로 계산",
    },
    mode: "onRead",
    returnType: "integer",
    sourceProperties: ["id"],
    computeFn: "computeNodeCount",
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

  // =========================================================================
  // Impact Chain Functions (PM Feature 3)
  // =========================================================================

  /** F-3: computeNodeCount — Implements D-2 derived property. / D-2 파생 프로퍼티 구현. */
  {
    apiName: "computeNodeCount",
    description: {
      en: "Implements D-2: counts nodes linked via chainNodes (chainId FK)",
      ko: "D-2 구현: chainNodes 링크(chainId FK)로 연결된 노드 수 계산",
    },
    category: "readHelper",
    parameters: [
      { name: "chainId", type: "string", description: { en: "ImpactChain ID", ko: "영향 체인 ID" }, required: true },
      { name: "nodes", type: "ImpactNode[]", description: { en: "Nodes with matching chainId", ko: "chainId가 일치하는 노드들" }, required: true },
    ],
    returnType: "integer",
    pureLogic: "return nodes.filter(n => n.chainId === chainId).length",
    operatesOn: "ImpactChain",
  },

  /** F-4: collectDescendantIds — Collect all descendant node IDs for cascade delete. / 연쇄 삭제용 하위 노드 ID 수집. */
  {
    apiName: "collectDescendantIds",
    description: {
      en: "Recursively collects all descendant node IDs for cascade delete — DH-ACTION-02 decision",
      ko: "연쇄 삭제를 위한 모든 하위 노드 ID 재귀 수집 — DH-ACTION-02 결정",
    },
    category: "pureLogic",
    parameters: [
      { name: "nodeId", type: "string", description: { en: "Root node ID to collect descendants from", ko: "하위 노드를 수집할 루트 노드 ID" }, required: true },
      { name: "allNodes", type: "ImpactNode[]", description: { en: "All nodes in the chain", ko: "체인의 모든 노드" }, required: true },
    ],
    returnType: "string[]",
    pureLogic: "const children = allNodes.filter(n => n.parentNodeId === nodeId); return children.flatMap(c => [c.id, ...collectDescendantIds(c.id, allNodes)])",
    toolExposure: false,
  },
] as const satisfies readonly OntologyFunction[];
// == END: functions ==
