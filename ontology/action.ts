/**
 * SaveTicker v2.0 — Ontology ACTION Domain
 *
 * Rebuilt against schemas v1.2.0 (34/34 DH coverage, Mode A).
 * 10 mutations, 0 webhooks, 1 automation (declared-only).
 * Source of truth: docs/ontology-prompt.md, schemas/ontology/action/schema.ts
 * Reads from DATA domain (data.ts) and LOGIC domain (logic.ts).
 *
 * v2.0 changes:
 * - removeImpactNode: explicit CASCADE DELETE (DH-ACTION-02 decision)
 * - Added updateTranslationStatus mutation (LEARN loop)
 * - Added reviewLevel to all mutations (PA-01 monitor for prototype)
 * - Added ingestArticles automation (declared-only, future implementation)
 * - DH-ACTION-01 through DH-ACTION-12 applied to all decisions
 */

import type {
  OntologyMutation,
  Webhook,
  Automation,
  AutonomyLevel,
} from "./schema.js";

// == SECTION: mutations ==
/** Mutations (state changes) / 뮤테이션 (상태 변경) */
export const mutations = [
  // =========================================================================
  // Story Threads (PM Feature 1)
  // =========================================================================

  /** M-1: createStoryThread — Create a new narrative timeline. / 새 내러티브 타임라인 생성. */
  {
    apiName: "createStoryThread",
    description: {
      en: "Create a new story thread for narrative grouping",
      ko: "내러티브 그룹용 새 스토리 스레드 생성",
    },
    mutationType: "create",
    entityApiName: "StoryThread",
    parameters: [
      { name: "title", type: "string", required: true, description: { en: "English title", ko: "영문 제목" } },
      { name: "titleKo", type: "string", required: true, description: { en: "Korean title", ko: "한국어 제목" } },
      { name: "description", type: "string", required: false, description: { en: "English description", ko: "영문 설명" } },
      { name: "descriptionKo", type: "string", required: false, description: { en: "Korean description", ko: "한국어 설명" } },
      { name: "status", type: "\"active\" | \"completed\"", required: false, description: { en: "Thread status (default: active)", ko: "스레드 상태 (기본: active)" } },
    ],
    edits: [{ type: "create", target: "StoryThread", properties: ["title", "titleKo", "description", "descriptionKo", "status", "updatedAt", "updatedBy"] }],
    reviewLevel: "monitor" as AutonomyLevel,
    // status defaults to "active" if not provided; DH-ACTION-01: simple CRUD
  },

  /** M-2: updateStoryThread — Edit title, description, or status. / 제목, 설명, 상태 수정. */
  {
    apiName: "updateStoryThread",
    description: {
      en: "Update an existing story thread",
      ko: "기존 스토리 스레드 수정",
    },
    mutationType: "modify",
    entityApiName: "StoryThread",
    parameters: [
      { name: "storyThreadId", type: "string", required: true, description: { en: "StoryThread ID reference", ko: "스토리 스레드 ID 참조" } },
      { name: "title", type: "string", required: false, description: { en: "English title", ko: "영문 제목" } },
      { name: "titleKo", type: "string", required: false, description: { en: "Korean title", ko: "한국어 제목" } },
      { name: "description", type: "string", required: false, description: { en: "English description", ko: "영문 설명" } },
      { name: "descriptionKo", type: "string", required: false, description: { en: "Korean description", ko: "한국어 설명" } },
      { name: "status", type: "\"active\" | \"completed\"", required: false, description: { en: "Thread status", ko: "스레드 상태" } },
    ],
    edits: [{ type: "modify", target: "StoryThread", properties: ["title", "titleKo", "description", "descriptionKo", "status", "updatedAt", "updatedBy"] }],
    reviewLevel: "monitor" as AutonomyLevel,
    // Partial update — only provided fields change
  },

  /** M-3: assignArticleToThread — Assign article to thread with timeline position. / 기사를 타임라인 위치와 함께 스레드에 배정. */
  {
    apiName: "assignArticleToThread",
    description: {
      en: "Assign a news article to a story thread with timeline position",
      ko: "뉴스 기사를 스토리 스레드에 타임라인 위치와 함께 배정",
    },
    mutationType: "modify",
    entityApiName: "NewsArticle",
    parameters: [
      { name: "newsArticleId", type: "string", required: true, description: { en: "NewsArticle ID reference", ko: "뉴스 기사 ID 참조" } },
      { name: "storyThreadId", type: "string", required: true, description: { en: "StoryThread ID to assign", ko: "배정할 스토리 스레드 ID" } },
      { name: "orderInThread", type: "integer", required: true, description: { en: "Position within StoryThread timeline", ko: "스토리 스레드 내 타임라인 위치" } },
    ],
    edits: [{ type: "modify", target: "NewsArticle", properties: ["storyThreadId", "orderInThread", "updatedAt", "updatedBy"] }],
    reviewLevel: "monitor" as AutonomyLevel,
    // FK-based link assignment — sets storyThreadId FK on NewsArticle
  },

  // =========================================================================
  // Plain Language Cards (PM Feature 2)
  // =========================================================================

  /** M-4: createExplainer — Create plain language card for an article. / 기사용 쉬운 설명 카드 생성. */
  {
    apiName: "createExplainer",
    description: {
      en: "Create a plain language card for a news article (1:1 constraint)",
      ko: "뉴스 기사용 쉬운 설명 카드 생성 (1:1 제약)",
    },
    mutationType: "create",
    entityApiName: "Explainer",
    parameters: [
      { name: "newsArticleId", type: "string", required: true, description: { en: "NewsArticle FK (unique — 1:1 constraint)", ko: "뉴스 기사 FK (고유 — 1:1 제약)" } },
      { name: "simplifiedTitle", type: "string", required: true, description: { en: "Simplified headline", ko: "쉬운 제목" } },
      { name: "storyBody", type: "string", required: true, description: { en: "Plain language narrative body", ko: "쉬운 말 본문" } },
      { name: "keyTakeaways", type: "string[]", required: true, description: { en: "Key insights (3-5 items)", ko: "핵심 인사이트 (3-5개)" } },
      { name: "personalImpact", type: "string", required: true, description: { en: "Personal impact section", ko: "'나에게 어떤 영향?' 섹션" } },
      { name: "analogy", type: "string", required: false, description: { en: "Real-world analogy", ko: "실생활 비유" } },
      { name: "difficultyLevel", type: "\"beginner\" | \"intermediate\" | \"advanced\"", required: true, description: { en: "Content difficulty level", ko: "콘텐츠 난이도" } },
    ],
    validationFns: ["validateExplainerCreate"],
    edits: [{ type: "create", target: "Explainer", properties: ["newsArticleId", "simplifiedTitle", "storyBody", "keyTakeaways", "personalImpact", "analogy", "difficultyLevel", "updatedAt", "updatedBy"] }],
    reviewLevel: "monitor" as AutonomyLevel,
    // NewsArticle must exist; no existing explainer for this article — 1:1 unique index
  },

  /** M-5: updateExplainer — Edit explainer content. / 설명 내용 수정. */
  {
    apiName: "updateExplainer",
    description: {
      en: "Update an existing explainer",
      ko: "기존 설명 수정",
    },
    mutationType: "modify",
    entityApiName: "Explainer",
    parameters: [
      { name: "explainerId", type: "string", required: true, description: { en: "Explainer ID reference", ko: "설명 ID 참조" } },
      { name: "simplifiedTitle", type: "string", required: false, description: { en: "Simplified headline", ko: "쉬운 제목" } },
      { name: "storyBody", type: "string", required: false, description: { en: "Plain language narrative body", ko: "쉬운 말 본문" } },
      { name: "keyTakeaways", type: "string[]", required: false, description: { en: "Key insights", ko: "핵심 인사이트" } },
      { name: "personalImpact", type: "string", required: false, description: { en: "Personal impact section", ko: "'나에게 어떤 영향?' 섹션" } },
      { name: "analogy", type: "string", required: false, description: { en: "Real-world analogy", ko: "실생활 비유" } },
      { name: "difficultyLevel", type: "\"beginner\" | \"intermediate\" | \"advanced\"", required: false, description: { en: "Difficulty level", ko: "난이도" } },
    ],
    edits: [{ type: "modify", target: "Explainer", properties: ["simplifiedTitle", "storyBody", "keyTakeaways", "personalImpact", "analogy", "difficultyLevel", "updatedAt", "updatedBy"] }],
    reviewLevel: "monitor" as AutonomyLevel,
    // Partial update — newsArticleId is FK (readonly), never modified
  },

  // =========================================================================
  // Impact Chains (PM Feature 3)
  // =========================================================================

  /** M-6: createImpactChain — Create cause-effect chain for a thread. / 스레드용 원인-결과 체인 생성. */
  {
    apiName: "createImpactChain",
    description: {
      en: "Create a new impact chain linked to a story thread",
      ko: "스토리 스레드에 연결된 새 영향 체인 생성",
    },
    mutationType: "create",
    entityApiName: "ImpactChain",
    parameters: [
      { name: "storyThreadId", type: "string", required: true, description: { en: "StoryThread FK", ko: "스토리 스레드 FK" } },
      { name: "title", type: "string", required: true, description: { en: "English title", ko: "영문 제목" } },
      { name: "titleKo", type: "string", required: true, description: { en: "Korean title", ko: "한국어 제목" } },
      { name: "description", type: "string", required: false, description: { en: "English description", ko: "영문 설명" } },
      { name: "descriptionKo", type: "string", required: false, description: { en: "Korean description", ko: "한국어 설명" } },
    ],
    edits: [{ type: "create", target: "ImpactChain", properties: ["storyThreadId", "title", "titleKo", "description", "descriptionKo", "updatedAt", "updatedBy"] }],
    reviewLevel: "monitor" as AutonomyLevel,
    // StoryThread must exist — adapter validates FK at runtime
  },

  /** M-7: addImpactNode — Add a node to an impact chain. / 영향 체인에 노드 추가. */
  {
    apiName: "addImpactNode",
    description: {
      en: "Add a node to an impact chain with optional parent for tree structure",
      ko: "트리 구조를 위한 선택적 부모와 함께 영향 체인에 노드 추가",
    },
    mutationType: "create",
    entityApiName: "ImpactNode",
    parameters: [
      { name: "chainId", type: "string", required: true, description: { en: "ImpactChain FK", ko: "영향 체인 FK" } },
      { name: "parentNodeId", type: "string", required: false, description: { en: "Parent node FK (null = root)", ko: "부모 노드 FK (null = 루트)" } },
      { name: "newsArticleId", type: "string", required: false, description: { en: "NewsArticle FK (links node to source article)", ko: "뉴스 기사 FK (노드를 출처 기사에 연결)" } },
      { name: "label", type: "string", required: true, description: { en: "English node label", ko: "영문 노드 라벨" } },
      { name: "labelKo", type: "string", required: true, description: { en: "Korean node label", ko: "한국어 노드 라벨" } },
      { name: "description", type: "string", required: false, description: { en: "English description", ko: "영문 설명" } },
      { name: "descriptionKo", type: "string", required: false, description: { en: "Korean description", ko: "한국어 설명" } },
      { name: "ordinal", type: "integer", required: true, description: { en: "Sibling ordering", ko: "형제 노드 간 정렬 순서" } },
    ],
    edits: [{ type: "create", target: "ImpactNode", properties: ["chainId", "parentNodeId", "newsArticleId", "label", "labelKo", "description", "descriptionKo", "ordinal", "updatedAt", "updatedBy"] }],
    reviewLevel: "monitor" as AutonomyLevel,
    // ImpactChain must exist; parentNodeId must reference existing node if provided
  },

  /** M-8: removeImpactNode — CASCADE DELETE: remove node + all descendants. / 연쇄 삭제: 노드 + 모든 하위 노드 제거. */
  {
    apiName: "removeImpactNode",
    description: {
      en: "CASCADE DELETE — removes the target node and ALL descendant nodes in the tree. Uses collectDescendantIds (F-4) to find all children recursively.",
      ko: "연쇄 삭제 — 대상 노드와 트리의 모든 하위 노드를 삭제. collectDescendantIds(F-4)로 모든 자식을 재귀적으로 탐색.",
    },
    mutationType: "batch",
    entityApiName: "ImpactNode",
    parameters: [
      { name: "impactNodeId", type: "string", required: true, description: { en: "Root ImpactNode ID to remove (cascades to descendants)", ko: "제거할 루트 ImpactNode ID (하위 노드로 연쇄)" } },
    ],
    validationFns: ["collectDescendantIds"],
    edits: [
      { type: "delete", target: "ImpactNode" },
      { type: "delete", target: "ImpactNode", properties: ["descendantIds"] },
    ],
    reviewLevel: "monitor" as AutonomyLevel,
    // DH-ACTION-02: batch atomicity — deletes root + all descendants in one transaction
  },

  // =========================================================================
  // User
  // =========================================================================

  /** M-9: updateUserProfile — Edit display name. / 표시 이름 수정. */
  {
    apiName: "updateUserProfile",
    description: {
      en: "Update user display name",
      ko: "사용자 표시 이름 변경",
    },
    mutationType: "modify",
    entityApiName: "User",
    parameters: [
      { name: "userId", type: "string", required: true, description: { en: "User ID reference", ko: "사용자 ID 참조" } },
      { name: "displayName", type: "string", required: false, description: { en: "New display name", ko: "새 표시 이름" } },
    ],
    edits: [{ type: "modify", target: "User", properties: ["displayName", "updatedAt", "updatedBy"] }],
    reviewLevel: "monitor" as AutonomyLevel,
    // Partial update — updatedAt/updatedBy auto-set via Auditable
  },

  // =========================================================================
  // Translation Pipeline (LEARN loop)
  // =========================================================================

  /** M-10: updateTranslationStatus — Update article translation status. / 기사 번역 상태 업데이트. */
  {
    apiName: "updateTranslationStatus",
    description: {
      en: "Update translation pipeline status — LEARN loop feedback (pending → reviewed → approved)",
      ko: "번역 파이프라인 상태 업데이트 — LEARN 루프 피드백 (pending → reviewed → approved)",
    },
    mutationType: "modify",
    entityApiName: "NewsArticle",
    parameters: [
      { name: "newsArticleId", type: "string", required: true, description: { en: "NewsArticle ID", ko: "뉴스 기사 ID" } },
      { name: "translationStatus", type: "\"pending\" | \"reviewed\" | \"approved\"", required: true, description: { en: "New translation status", ko: "새 번역 상태" } },
      { name: "translationNote", type: "string", required: false, description: { en: "Review note to append", ko: "추가할 리뷰 노트" } },
    ],
    edits: [{ type: "modify", target: "NewsArticle", properties: ["translationStatus", "translationNotes", "updatedAt", "updatedBy"] }],
    reviewLevel: "monitor" as AutonomyLevel,
    // DH-ACTION-01: simple status update, no complex validation needed
  },
] as const satisfies readonly OntologyMutation[];
// == END: mutations ==

// == SECTION: webhooks ==
/** Webhooks (external callbacks) / 웹훅 (외부 콜백) */
export const webhooks = [] as const satisfies readonly Webhook[];
// == END: webhooks ==

// == SECTION: automations ==
/** Automations (scheduled and event-driven triggers) / 자동화 (스케줄 및 이벤트 기반 트리거) */
export const automations = [
  // -------------------------------------------------------------------------
  // A-1: ingestArticles — DECLARED ONLY, future implementation
  // -------------------------------------------------------------------------
  /** ingestArticles: Periodic article ingestion from news APIs. / 뉴스 API에서 주기적 기사 수집. */
  {
    apiName: "ingestArticles",
    description: {
      en: "DECLARED ONLY — periodic article ingestion from external news APIs. Not implemented in prototype.",
      ko: "선언만 — 외부 뉴스 API에서 주기적 기사 수집. 프로토타입에서 미구현.",
    },
    kind: "cron",
    schedule: "*/30 * * * *",
    targetMutation: "createNewsArticle",
    idempotent: true,
    autonomyLevel: "monitor" as AutonomyLevel,
    // DH-ACTION-12: declared for future; currently using manual seed data
  },
] as const satisfies readonly Automation[];
// == END: automations ==
