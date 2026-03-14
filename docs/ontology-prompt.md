# Ontology Prompt: SaveTicker v2.0

> Source: PRD (full redesign specification)
> Generated: 2026-03-14
> DH Coverage: 34/34 decisions answerable (100%)
> Mode: A (automated) — all DH decisions answerable

## Domain
**Financial News Literacy**: Mobile app for Korean retail investors solving 3 barriers — language (English news translation), terminology (Explainer cards), and fragmentation (StoryThread narrative grouping). Schemas v1.2.0 full redesign. **Portfolio prototype** for PM job application at saveticker.com.

## Digital Twin Loop

- **SENSE**: Financial news articles ingested from external sources (future: API automation). User reading behavior (implicit). Stock reference data as context enrichment.
- **DECIDE**: Which articles relate to which story threads? (StoryThread grouping). What difficulty level suits which user? (Explainer targeting). How do causal chains propagate impact? (ImpactChain reasoning — PM Feature 3).
- **ACT**: Article translation pipeline (create + translate + review). Explainer creation. Thread curation. ImpactChain/ImpactNode tree construction. User bookmark/feed customization.
- **LEARN**: Translation quality feedback (translationStatus pipeline: pending -> reviewed -> approved). Explainer effectiveness (difficultyLevel distribution). Thread completeness (active -> completed lifecycle).

---

## Entities (DATA)

### NewsArticle
- **Identity**: System ID (Convex `_id`). Natural key candidate: sourceUrl (ArticleUrl ValueType, unique per article).
- **Properties**: title(string), titleKo(string?), summary(string), summaryKo(string?), body(string), bodyKo(string?), sourceUrl(string, ArticleUrl ValueType), sourceName(string?), publishedAt(timestamp), category(enum: general|breaking|analysis), mentionedTickers(string[]), tags(string[]), imageUrl(string?), isOfficial(boolean?), storyThreadId(FK?), orderInThread(number?), translationStatus(enum?: pending|reviewed|approved), translationNotes(string[]?)
- **SharedPropertyType**: Auditable (updatedAt, updatedBy)
- **Special types**: None (no geo, timeseries, vector, cipher, attachment)
- **Scale hint**: Grows over time — article count could reach thousands
- **DH decisions**:
  - DH-DATA-01: Independent entity — queried/filtered alone via 6+ queries. ENTITY.
  - DH-DATA-02: SharedPropertyType "Auditable" shared across 6 entities. CONFIRMED.
  - DH-DATA-03: ArticleUrl ValueType (HTTPS URL regex). CONFIRMED.
  - DH-DATA-05: imageUrl as string URL reference — no Attachment type needed. URL REFERENCE.
  - DH-DATA-09: System `_id` as PK, sourceUrl as unique natural key candidate. SYSTEM_ID.

### Explainer
- **Identity**: System ID. Unique FK: newsArticleId (1:1 with NewsArticle).
- **Properties**: newsArticleId(FK, unique), simplifiedTitle(string), storyBody(string), keyTakeaways(string[], 3-5 items), personalImpact(string?), analogy(string?), difficultyLevel(enum: beginner|intermediate|advanced)
- **SharedPropertyType**: Auditable
- **DH decisions**:
  - DH-DATA-01: Independent entity with own identity, queried via articleExplainer. ENTITY.
  - DH-DATA-09: System `_id` as PK, newsArticleId as unique FK constraint. SYSTEM_ID.

### StoryThread
- **Identity**: System ID. No natural business key.
- **Properties**: title(string), titleKo(string), description(string?), descriptionKo(string?), status(enum: active|completed)
- **SharedPropertyType**: Auditable
- **DH decisions**:
  - DH-DATA-01: Independent entity with lifecycle. ENTITY.

### Stock
- **Identity**: System ID. Natural key: ticker (Ticker ValueType, 1-5 uppercase letters, unique).
- **Properties**: name(string), nameKo(string), ticker(string, Ticker ValueType), sector(enum: technology|healthcare|finance|consumer|energy|industrials|etf)
- **SharedPropertyType**: None (reference data, rarely modified)
- **DH decisions**:
  - DH-DATA-01: Independent entity — reference data queried by ticker. ENTITY.
  - DH-DATA-03: Ticker ValueType (regex: `^[A-Z]{1,5}$`). CONFIRMED.
  - DH-DATA-09: System `_id` as PK, ticker as unique natural key. SYSTEM_ID.

### User
- **Identity**: System ID. Natural key: email (EmailAddress ValueType, unique).
- **Properties**: displayName(string), email(string, EmailAddress ValueType)
- **SharedPropertyType**: Auditable
- **DH decisions**:
  - DH-DATA-01: Independent entity with identity. ENTITY.
  - DH-DATA-03: EmailAddress ValueType. CONFIRMED.
  - DH-DATA-08: Email is personal data — RLS protection (not cipher, prototype scope).
  - DH-DATA-09: System `_id` as PK, email as unique natural key. SYSTEM_ID.

### ImpactChain (NEW — PM Feature 3)
- **Identity**: System ID.
- **Properties**: title(string?), storyThreadId(FK to StoryThread)
- **SharedPropertyType**: Auditable
- **DH decisions**:
  - DH-DATA-01: Independent entity — groups ImpactNodes into causal chain. ENTITY.

### ImpactNode (NEW — PM Feature 3)
- **Identity**: System ID.
- **Properties**: impactChainId(FK to ImpactChain), parentNodeId(FK? to ImpactNode, self-ref), newsArticleId(FK? to NewsArticle), description(string?), order(number?)
- **SharedPropertyType**: Auditable
- **DH decisions**:
  - DH-DATA-01: Independent entity — self-referential tree node. ENTITY.
  - DH-ACTION-02: **CASCADE DELETE** — removing a node deletes all descendant nodes.

---

## Relationships (LOGIC)

### StoryThread -> NewsArticle (threadArticles)
- **Cardinality**: 1:M
- **FK strategy**: FK on child (NewsArticle.storyThreadId)
- **Link properties**: orderInThread on NewsArticle
- **DH**: DH-LOGIC-01 FK on child, DH-LOGIC-02 1:M CONFIRMED.

### Explainer -> NewsArticle (explainerArticle)
- **Cardinality**: 1:1 (unique constraint)
- **FK strategy**: FK on Explainer (newsArticleId, unique)
- **DH**: DH-LOGIC-01 FK, DH-LOGIC-02 1:1 CONFIRMED.

### ImpactChain -> StoryThread (chainThread)
- **Cardinality**: M:1
- **FK strategy**: FK on ImpactChain (storyThreadId)

### ImpactChain -> ImpactNode (chainNodes)
- **Cardinality**: 1:M
- **FK strategy**: FK on child (ImpactNode.impactChainId)

### ImpactNode -> ImpactNode (nodeParent / nodeChildren)
- **Cardinality**: Self-referential M:1 / 1:M reverse
- **FK strategy**: FK on child (ImpactNode.parentNodeId, nullable)

### ImpactNode -> NewsArticle (nodeArticle)
- **Cardinality**: M:1
- **FK strategy**: FK on ImpactNode (newsArticleId)

### NewsArticle -> Explainer (articleExplainer — reverse)
- **Cardinality**: 1:1 reverse traversal

### Derived Properties
- StoryThread.articleCount: count of linked articles (DH-LOGIC-11)
- ImpactChain.nodeCount: count of nodes in chain

### Functions
- articlesByTicker, searchArticles, threadArticlesList, chainsByThread, chainNodes (read-only)

### Interfaces
- **IAuditable**: updatedAt, updatedBy — 6 entities
- **IBilingual**: title/titleKo pair — NewsArticle, StoryThread (candidate)

---

## Actions (ACTION)

| Action | Type | Atomicity | Decision |
|--------|------|-----------|----------|
| createStoryThread | Declarative | Single | DH-ACTION-01: Simple CRUD |
| updateStoryThread | Declarative | Single | Patch |
| assignArticleToThread | Function-backed | Single (patch NewsArticle) | Validates article exists |
| createExplainer | Function-backed | Single | Validates 1:1 unique |
| updateExplainer | Declarative | Single | Patch |
| createImpactChain | Declarative | Single | Simple insert |
| addImpactNode | Function-backed | Single (validates chain+parent) | Tree structure validation |
| removeImpactNode | Function-backed | Multi (CASCADE) | Deletes node + all descendants |
| updateUserProfile | Declarative | Single | Self-service patch |

### Notifications (DH-ACTION-05)
**NOT NEEDED** — Portfolio prototype scope. Users discover content via feed.

### Webhooks (DH-ACTION-06)
**NOT NEEDED** — No external system integration in prototype.

### Automations (DH-ACTION-12)
**DECLARE ONLY** — Article ingestion automation schema declared but not implemented. Future: cron-based or webhook-based article collection from news APIs.

---

## Security

### Roles (DH-SEC-06): 3 roles
1. **investor** — Read all public entities. Own profile CRUD.
2. **admin** — Full CRUD on content entities (articles, explainers, threads, impact chains/nodes).
3. **system** — Future API ingestion role. Declared only.

### Layer Decision (DH-SEC-01)
**RBAC + RLS (Layers 1+3)**. No markings needed.
- RBAC: Role-based content management (admin vs investor)
- RLS: User entity — only own profile visible

### Data Classification
- **Public**: newsArticles, stocks, storyThreads, explainers, impactChains, impactNodes
- **Personal**: User (email, displayName) — RLS protected

### Access Matrix
| Entity | investor | admin | system |
|--------|----------|-------|--------|
| NewsArticle | R | CRUD | C (future) |
| Explainer | R | CRUD | — |
| StoryThread | R | CRUD | — |
| Stock | R | R | — |
| User (own) | RU | RU | — |
| User (others) | — | R | — |
| ImpactChain | R | CRUD | — |
| ImpactNode | R | CRUD | — |

---

## Entity Summary

- **7 entities**, **9 relationships** (7 links + 2 reverse), **9 actions**, **3 roles**
- **3 Value Types**: Ticker, EmailAddress, ArticleUrl
- **1 SharedPropertyType**: Auditable (6 entities)
- **2 Derived Properties**: articleCount, nodeCount
- **Tech stack**: Bun, TypeScript, Convex, React 19, Vite 7, Tailwind v4, Zustand, Capacitor (Android)

## Next Step
`/ontology-begin saveticker` — Mode A (automated), all 34 DH decisions answerable.
