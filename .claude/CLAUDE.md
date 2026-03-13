# SaveTicker — Project Instructions

## Overview
Financial news literacy prototype for PM portfolio. Korean UI, dark glassmorphic theme. Demonstrates "PM who can design AND build."

## Stack
- Runtime: Bun + TypeScript (strict)
- Backend: Convex (deployed: dev:amicable-spider-334)
- Frontend: React 19, Vite 7, Tailwind CSS v4, React Router v7, Zustand
- Mobile: Capacitor 8 (Android), appId `io.saveticker.prototype`
- Ontology: `ontology/*.ts` (Palantir-adapted 4-fold model)

## Scripts
- `bun run dev` — Vite dev server
- `bun run build` — production build
- `bun run typecheck` — TypeScript check
- `bun run test` — run tests

## Project Structure
```
ontology/        — schema.ts, data.ts, logic.ts, action.ts, security.ts
convex/          — schema.ts, mutations.ts (3), queries.ts (8), model/
src/app/         — main.tsx, App.tsx, layouts/, pages/
src/components/  — shared UI (ui/, auth/, forms/, security/)
src/features/    — per-entity folders (hooks/, components/, pages/)
src/hooks/       — shared hooks (useCurrentUser, useDebounce)
src/lib/         — utilities (cn.ts, timeAgo.ts, formatDate.ts)
src/stores/      — Zustand stores (authStore)
src/theme/       — recipes.ts, types.ts
src-ontology/    — archived generated ontology types (not in tsconfig)
```

## Conventions
- Bilingual JSDoc: `/** English / 한국어 */`
- Convex tables: camelCase plural (stocks, newsArticles, users, ...)
- Feature folders: kebab-case (news-article, explainer, ...)
- Hooks: `use` prefix, one per file
- All Convex queries prefixed with `get` (getStockById, getRecentArticles, ...)
- Theme: glassmorphic dark via OKLCH tokens, glass-panel utilities
- data-label attributes on all interactive/semantic elements

## Entities (4)
Stock, NewsArticle, User, Explainer

## Tab Navigation (5 tabs)
뉴스 (/) | 리포트 (/reports) | 커뮤니티 (/community) | 캘린더 (/calendar) | 내 정보 (/profile)

## News Detail (3 tabs)
원본 (EN) | 한국어 | StoryTelling

## Language Policy
- NewsArticle: English original (title/summary/body) + Korean (titleKo/summaryKo/bodyKo)
- summaryKo: 의역+요약 (localized investor-perspective summary)
- bodyKo: 직역 (faithful translation)
- Explainers: Korean + English term 병기 (first mention: "Private Credit (사모신용)")
- UI labels: Korean
