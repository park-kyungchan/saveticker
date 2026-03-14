# SaveTicker v2.0 — Feedback Handoff

> Session: 2026-03-14 | Merged: PR #26 | Deploy: Play Store versionCode 20

## How to Give Feedback

1. `cd ~/saveticker && bun run dev`
2. Open `http://localhost:5173`
3. Click **"LABELS"** button (top-right corner, DEV mode only)
4. All `data-label` tags become visible as green overlays
5. **Click any label** → copied to clipboard
6. Paste the label here with your feedback

### Feedback Format
```
[data-label] — issue description
```
Example:
```
news.heroCard — 제목이 너무 길면 잘림
impactChain.domino.node — 노드 간 간격이 좁음
storyThread.card — 카드 높이 불균일
```

## What Was Done This Session

### Ontology v2.0 (schemas v1.2.0, 34/34 DH)
- `ontology/schema.ts` — AutonomyLevel, reviewLevel, toolExposure
- `ontology/data.ts` — translationStatus, translationNotes (LEARN loop)
- `ontology/logic.ts` — IBilingual, nodeCount, collectDescendantIds
- `ontology/action.ts` — cascade delete, updateTranslationStatus, ingestArticles
- `ontology/security.ts` — 3 roles, permission matrix, User RLS

### Pipeline 61% → 100%
- `convex/schema.ts` — impactChains + impactNodes tables
- `convex/model/impactChain.ts` — chainsByThread, chainNodes, collectDescendantIds
- `convex/queries.ts` — +4 (chainsByThread, chainNodes, chainById, threadsByStatus)
- `convex/mutations.ts` — +5 (updateStoryThread, updateTranslationStatus, createImpactChain, addImpactNode, removeImpactNode)
- `convex/seed.ts` — 2 chains + 10 nodes

### Frontend PM Feature 3
- `src/features/impact-chain/` — hooks (4), components (3), page (1)
- DominoFlow tree visualization (pure Tailwind + motion)
- Route: `/chains/:id`
- Integrated into StoryThreadPage

### QA Fixes (11 issues, 3 rounds)
| Fix | File | Label |
|-----|------|-------|
| word-break: keep-all | index.css | global |
| URL state (tab/tag) | NewsPage.tsx | news.tabs |
| URL state (view tab) | NewsDetailPage.tsx | newsDetail |
| sourceName truncate | HeroNewsCard.tsx | news.heroCard |
| ErrorBoundary text | ErrorBoundary.tsx | — |
| lang attributes | HeroNewsCard, NewsCard, NewsDetail, BreakingTicker | multiple |
| FeedSettings dialog | FeedSettings.tsx | feedSettings.modal |
| keyword delete 44px | FeedSettings.tsx | feedSettings.keywords |
| scroll region a11y | StoryThreadSection, ImpactChainSection | storyThread.section, impactChain.section |

### Skills
- All 9 skills: `context: fork` → `context: standard`
- Rebuild skill: restored from archive, Python→Bun

## Key Labels to Check

### News Feed (`/`)
- `news.header` — 헤더 + 실시간 인디케이터
- `news.tabs` — 전체/분석/속보/맞춤 탭
- `news.tagFilter` — 태그 필터 스트립
- `news.heroCard` — 히어로 카드
- `news.card` — 일반 뉴스 카드
- `news.breakingTicker` — 속보 가로 스크롤
- `storyThread.section` — 스토리 스레드 섹션
- `feedSettings.modal` — 맞춤 키워드 설정

### News Detail (`/news/:id`)
- `newsDetail` — 상세 페이지 루트
- `news.detail` — 원본(EN) 탭
- `korean.tab` — 한국어 탭
- `korean.tab.pipeline` — 번역 파이프라인 인디케이터
- `storytelling.tab` — StoryTelling 탭
- `storytelling.tab.explainer` — 설명 카드

### Story Thread (`/threads/:id`)
- `storyThread.page` — 스레드 상세 루트
- `storyThread.timeline` — 세로 타임라인
- `impactChain.section` — 영향 체인 섹션 (NEW)

### Impact Chain (`/chains/:id`)
- `impactChain.page` — 체인 상세 루트
- `impactChain.domino` — 도미노 플로우 루트
- `impactChain.domino.node` — 개별 노드

### More (`/profile`)
- `more.page` — 더보기 루트
- `more.page.userSection` — 사용자 프로필

## Remaining Future Items
- EC-12: List virtualization (react-window) — prototype 20 items, not urgent
- PF-04: Bundle code splitting (React.lazy) — 543KB, prototype scope
