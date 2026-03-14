# SaveTicker

> **PM Portfolio Prototype** — Financial news literacy app for Korean investors.
> Demonstrates "PM who can design AND build."

**Live**: [saveticker.com](https://saveticker.com)
| [App Store](https://apps.apple.com/app/id6751139540)
| [Google Play](https://play.google.com/store/apps/details?id=com.savenews.app)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Bun + TypeScript (strict) |
| Backend | Convex (serverless, real-time) |
| Frontend | React 19, Vite 7, Tailwind CSS v4, React Router v7 |
| State | Zustand 5 |
| Mobile | Capacitor 8 (Android) — `io.saveticker.prototype` |
| Ontology | Palantir-adapted 4-fold model (DATA / LOGIC / ACTION / SECURITY) |
| UI | Konsta UI, Motion (Framer Motion), dark glassmorphic theme |

---

## PM Portfolio — 3 Core Features

### 1. Story Threads
Group related breaking news into chronological timelines.
Disconnected articles become a coherent narrative.

### 2. Plain Language Cards (Explainers)
Simplified explanations with personal impact — "나에게 어떤 영향?"
Financial literacy bridge for retail investors.

### 3. Impact Chains
Cause-effect domino visualizations.
Self-referential tree structure showing how one event cascades.

---

## Project Structure

```
saveticker/
├── ontology/            ← Schema SSoT (Palantir 4-fold model)
│   ├── schema.ts        ← Type definitions (base types, interfaces)
│   ├── data.ts          ← DATA: 7 entities, 3 value types
│   ├── logic.ts         ← LOGIC: 9 links, 15 queries, 2 functions
│   ├── action.ts        ← ACTION: 9 mutations
│   └── security.ts      ← SECURITY: deferred
├── convex/              ← Backend adapter (Convex)
│   ├── schema.ts        ← Convex table definitions
│   ├── queries.ts       ← Query implementations
│   ├── mutations.ts     ← Mutation implementations
│   ├── model/           ← Domain helpers
│   └── seed.ts          ← Seed data
├── src/
│   ├── app/             ← App shell, layouts, pages
│   ├── components/      ← Shared UI components
│   ├── features/        ← Per-entity feature folders
│   ├── hooks/           ← Shared React hooks
│   ├── lib/             ← Utilities (cn, timeAgo, formatDate)
│   ├── stores/          ← Zustand stores
│   └── theme/           ← Glassmorphic design tokens (OKLCH)
├── android/             ← Capacitor Android project
├── dist/                ← Production build output
└── docs/                ← Work instructions, UI labels
```

---

## Ontology Architecture

### 4-Fold Model Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     ONTOLOGY (schema.ts)                        │
│  Base types, interfaces, bilingual descriptions, constraints    │
├─────────────┬─────────────┬──────────────┬──────────────────────┤
│             │             │              │                      │
│   DATA      │   LOGIC     │   ACTION     │   SECURITY           │
│  (data.ts)  │  (logic.ts) │  (action.ts) │  (security.ts)       │
│             │             │              │                      │
│  Entities   │  Links      │  Mutations   │  Roles               │
│  ValueTypes │  Queries    │  Webhooks    │  Permissions          │
│  Structs    │  Functions  │  Automations │  Markings             │
│  Shared     │  Interfaces │              │  RLS/CLS              │
│  Properties │  Derived    │              │                      │
│             │  Properties │              │                      │
└─────────────┴─────────────┴──────────────┴──────────────────────┘
```

### DATA Domain — Entities & Relationships

```
7 Entities  ·  3 Value Types (Ticker, EmailAddress, ArticleUrl)  ·  1 Shared Property (Auditable)

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ┌──────────────┐         1:M          ┌──────────────────┐                │
│   │ StoryThread   │◄────────────────────│ NewsArticle       │                │
│   │               │  storyThreadId FK   │                    │                │
│   │  title        │                     │  title / titleKo   │                │
│   │  titleKo      │                     │  summary / summaryKo│               │
│   │  status       │                     │  body / bodyKo     │                │
│   │  [Auditable]  │                     │  sourceUrl         │                │
│   └───────┬───────┘                     │  sourceName        │                │
│           │                             │  category          │                │
│           │ M:1                          │  mentionedTickers[]│                │
│           │                             │  tags[]            │                │
│   ┌───────▼───────┐                     │  imageUrl          │                │
│   │ ImpactChain   │                     │  isOfficial        │                │
│   │               │                     │  publishedAt       │                │
│   │  title        │                     │  [Auditable]       │                │
│   │  titleKo      │                     └──────┬─────────────┘                │
│   │  [Auditable]  │                            │                              │
│   └───────┬───────┘                     1:1    │    M:1                       │
│           │ 1:M                                │                              │
│           │                             ┌──────▼──────┐                       │
│   ┌───────▼───────┐                     │ Explainer    │                      │
│   │ ImpactNode    │                     │              │                      │
│   │               │ ◄──┐ self-ref       │ simplifiedTitle                     │
│   │  label        │    │ M:1            │ storyBody    │                      │
│   │  labelKo      │    │ parentNodeId   │ keyTakeaways[]                      │
│   │  ordinal      │────┘                │ personalImpact                      │
│   │  chainId    FK│                     │ analogy      │                      │
│   │  parentNodeId FK                    │ difficultyLevel                     │
│   │  newsArticleId FK──────────────────►│ [Auditable]  │                      │
│   │  [Auditable]  │                     └──────────────┘                      │
│   └───────────────┘                                                          │
│                                                                              │
│   ┌──────────────┐          ┌──────────────┐                                 │
│   │ Stock         │          │ User          │                                │
│   │  (reference)  │          │               │                                │
│   │  ticker       │          │  displayName  │                                │
│   │  name/nameKo  │          │  email        │                                │
│   │  sector       │          │  [Auditable]  │                                │
│   └──────────────┘          └──────────────┘                                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

[Auditable] = updatedAt (timestamp) + updatedBy (string)  — shared property interface
```

### LOGIC Domain — Links, Queries & Functions

```
9 Link Types  ·  15 Queries  ·  1 Derived Property  ·  2 Functions

═══════════════════════════════════════════════════════════════════
 LINK MAP (R-1 ~ R-9)
═══════════════════════════════════════════════════════════════════

  StoryThread ──1:M──► NewsArticle        (R-1: threadArticles)
  Explainer   ──1:1──► NewsArticle        (R-2: explainerArticle)
  ImpactChain ──M:1──► StoryThread        (R-3: chainThread)
  ImpactChain ──1:M──► ImpactNode         (R-4: chainNodes)
  ImpactNode  ──M:1──► ImpactNode [self]  (R-5: nodeParent)
  ImpactNode  ──M:1──► ImpactChain        (R-6: nodeChain)
  ImpactNode  ──1:M──► ImpactNode [self]  (R-7: nodeChildren)
  NewsArticle ──1:1──► Explainer          (R-8: articleExplainer)
  ImpactNode  ──M:1──► NewsArticle        (R-9: nodeArticle)

═══════════════════════════════════════════════════════════════════
 QUERY CATALOG (Q-1 ~ Q-15)
═══════════════════════════════════════════════════════════════════

  Feed & Discovery
  ├── Q-1   recentArticles       list       NewsArticle   (default feed)
  ├── Q-2   articleById           getById    NewsArticle
  └── Q-3   articlesByTicker      filter     NewsArticle   (mentionedTickers contains)

  Story Threads (Feature 1)
  ├── Q-4   threadsByStatus       filter     StoryThread   (status eq)
  ├── Q-5   threadArticlesList    filter     NewsArticle   (storyThreadId eq)
  └── Q-12  allThreads            list       StoryThread

  Plain Language Cards (Feature 2)
  └── Q-6   articleExplainer      filter     Explainer     (newsArticleId eq)

  Impact Chains (Feature 3)
  ├── Q-7   chainsByThread        filter     ImpactChain   (storyThreadId eq)
  └── Q-8   chainNodes            filter     ImpactNode    (chainId eq)

  Search & Utility
  ├── Q-9   searchArticles        search     NewsArticle   (title prefix)
  ├── Q-10  stockByTicker         filter     Stock         (ticker eq)
  └── Q-11  userById              getById    User

  Feed Filtering
  ├── Q-13  articlesByCategory    filter     NewsArticle   (category eq)
  ├── Q-14  articlesBySource      filter     NewsArticle   (sourceName eq)
  └── Q-15  articlesByTag         filter     NewsArticle   (tags contains)

═══════════════════════════════════════════════════════════════════
 FUNCTIONS (F-1 ~ F-2)
═══════════════════════════════════════════════════════════════════

  F-1  computeArticleCount       readHelper   → D-1 derived property
  F-2  validateExplainerCreate   pureLogic    → 1:1 uniqueness guard

═══════════════════════════════════════════════════════════════════
 DERIVED PROPERTY (D-1)
═══════════════════════════════════════════════════════════════════

  D-1  StoryThread.articleCount   onRead   ← F-1 computeArticleCount
```

### ACTION Domain — Mutations

```
9 Mutations  ·  0 Webhooks  ·  0 Automations

═══════════════════════════════════════════════════════════════════
 MUTATION CATALOG (M-1 ~ M-9)
═══════════════════════════════════════════════════════════════════

  Story Threads (Feature 1)
  ├── M-1  createStoryThread        create   StoryThread
  ├── M-2  updateStoryThread        modify   StoryThread
  └── M-3  assignArticleToThread    modify   NewsArticle  (sets storyThreadId FK)

  Plain Language Cards (Feature 2)
  ├── M-4  createExplainer          create   Explainer    (validates 1:1 via F-2)
  └── M-5  updateExplainer          modify   Explainer

  Impact Chains (Feature 3)
  ├── M-6  createImpactChain        create   ImpactChain
  ├── M-7  addImpactNode            create   ImpactNode   (tree node with parentNodeId)
  └── M-8  removeImpactNode         delete   ImpactNode   (cascade: adapter responsibility)

  User
  └── M-9  updateUserProfile        modify   User

═══════════════════════════════════════════════════════════════════
 MUTATION FLOW
═══════════════════════════════════════════════════════════════════

  ┌─────────┐     M-1      ┌──────────────┐     M-3      ┌──────────────┐
  │ Client   │────create───►│ StoryThread   │◄───assign───│ NewsArticle   │
  │          │              └──────┬────────┘              └──────┬───────┘
  │          │     M-6             │                              │
  │          │────create───►┌──────▼────────┐     M-4             │
  │          │              │ ImpactChain   │    create    ┌──────▼───────┐
  │          │     M-7      └──────┬────────┘────────────►│ Explainer     │
  │          │────create───►┌──────▼────────┐              └──────────────┘
  │          │              │ ImpactNode    │
  │          │     M-8      │  ▲            │
  │          │────delete───►│  └── parent   │
  └─────────┘              └───────────────┘
```

### SECURITY Domain

> Deferred. DATA / LOGIC / ACTION domains completed first.
> 0 roles, 0 permissions, 0 markings, 0 object policies.

---

## Tab Navigation

| Tab | Route | Label |
|-----|-------|-------|
| News | `/` | 뉴스 |
| Reports | `/reports` | 리포트 |
| Community | `/community` | 커뮤니티 |
| Calendar | `/calendar` | 캘린더 |
| Profile | `/profile` | 내 정보 |

**News Detail** — 3 sub-tabs: 원본 (EN) | 한국어 | StoryTelling

---

## Language Policy

| Content | English | Korean |
|---------|---------|--------|
| NewsArticle | title, summary, body | titleKo, summaryKo (의역+요약), bodyKo (직역) |
| Explainer | — | Korean + English term 병기 ("Private Credit (사모신용)") |
| UI Labels | — | Korean only |

---

## Development

```bash
bun install           # Install dependencies
bun run dev           # Vite dev server
bun run build         # Production build
bun run typecheck     # TypeScript check
bun run test          # Run tests
```

### Convex

```bash
bunx convex dev       # Start Convex dev server
bunx convex deploy    # Deploy to production
```

### Android (Capacitor)

```bash
bun run build                     # Build frontend
bunx cap sync android             # Sync to Android
bunx cap open android             # Open in Android Studio
```

---

## License

Private — PM portfolio project.
