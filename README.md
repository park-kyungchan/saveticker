# SaveTicker

> **PM Portfolio Prototype** — 금융문맹을 해소하고, 중립적 뉴스를 맥락으로 엮어 올바른 의사결정을 돕는 앱.
> "설계하고 직접 만드는 PM"을 증명합니다.

**SAVE 앱 참조**: [saveticker.com](https://saveticker.com)
| [App Store](https://apps.apple.com/app/id6751139540)
| [Google Play](https://play.google.com/store/apps/details?id=com.savenews.app)

---

## Why — 이 프로토타입을 만든 이유

한국 금융 뉴스에는 **3중 장벽**이 있습니다:

1. **영어 원문 장벽** — 글로벌 속보는 영어로 먼저, 한국어 번역은 늦고 의역이 부족
2. **전문용어 장벽** — VLCC, BDC, PMI... 비전문가는 기사를 읽어도 이해 불가
3. **단편성 장벽** — 관련 기사들이 흩어져 있어, 원인→결과 맥락을 독자가 직접 연결해야 함

**2024 전국민 금융이해력 조사**(한국은행·금감원)에 따르면:
- 금융 태도 점수 **53.7점** — OECD 평균(58.0점) 미달
- 취약 계층: **20대 청년, 70대 이상 노인**, 저소득층

> **핵심 철학**: 종목 추천은 절대 하지 않습니다. 중립적 사실 전달과 맥락 제공만 합니다.
> 사용자가 **스스로 판단할 수 있는 기반**을 만드는 것이 목적입니다.

---

## 3 Core Features — SAVE 가치와의 정합

### 1. Story Threads (스토리 흐름) → SAVE "속도"
단편 속보를 시간순 타임라인으로 묶어, 사건의 전개를 한눈에 파악합니다.
- 예: 이란 공습 → 해협 봉쇄 → 유조선 운임 급등 → 유가 상승 → 한국 에너지 위기
- **구현**: Convex 테이블 + 쿼리 + 2개 스레드 × 4기사 + 타임라인 UI

### 2. Plain Language Cards (쉬운 해설) → SAVE "효율성"
전문용어를 비유와 "나에게 어떤 영향?"으로 풀어, 누구나 이해할 수 있게 합니다.
- 난이도 표시 (입문/중급/심화) + 읽기 시간 + **핵심 한 줄** 요약
- 노인도 쉽게 읽을 수 있도록: 큰 글씨(16-18px), 높은 대비, 48px 터치 타겟
- **구현**: CRUD 완성, 8개 한국어 해설, 어코디언 UI

### 3. Impact Chains (영향 도미노) → SAVE "개인화" — 설계 완료
원인-결과 도미노를 트리 구조로 시각화, 한 사건의 파급 효과를 추적합니다.
- **구현**: 온톨로지 정의 완료 (자기참조 트리), UI 설계 중

---

## Design Philosophy

| 원칙 | 적용 |
|------|------|
| **중립성** | 종목 추천 없음. 사실과 맥락만 제공 |
| **접근성** | 48px 터치 타겟, WCAG AA 대비, 키보드 네비게이션, ARIA |
| **노인 친화** | 큰 글씨, 핵심 한 줄 요약, 난이도 표시, 점진적 공개 |
| **온톨로지 기반** | Palantir 4-fold 모델 (DATA/LOGIC/ACTION/SECURITY) 적용 |
| **이중언어** | 영문 원본 + 한국어 의역(summaryKo) + 직역(bodyKo) |

---

## Live Demo

```bash
bun install && bun run dev     # Frontend
bunx convex dev                # Backend (별도 터미널)
```

뉴스 피드 → 스토리 흐름 카드 → 기사 상세 → StoryTelling 탭 순으로 체험하세요.

---

## Appendix A: Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Bun + TypeScript (strict) |
| Backend | Convex (serverless, real-time) |
| Frontend | React 19, Vite 7, Tailwind CSS v4, React Router v7 |
| State | Zustand 5 |
| Mobile | Capacitor 8 (Android) — `io.saveticker.prototype` |
| Ontology | Palantir-adapted 4-fold model (DATA / LOGIC / ACTION / SECURITY) |
| UI | Konsta UI, Motion (Framer Motion), dark glassmorphic theme |

## Appendix B: Project Structure

```
saveticker/
├── ontology/            ← Schema SSoT (Palantir 4-fold model)
│   ├── schema.ts        ← Type definitions
│   ├── data.ts          ← DATA: 7 entities, 3 value types
│   ├── logic.ts         ← LOGIC: 9 links, 15 queries
│   ├── action.ts        ← ACTION: 9 mutations
│   └── security.ts      ← SECURITY: deferred
├── convex/              ← Backend adapter (Convex)
│   ├── schema.ts        ← 5 tables (stocks, newsArticles, storyThreads, users, explainers)
│   ├── queries.ts       ← 15 query endpoints
│   ├── mutations.ts     ← 5 mutation endpoints
│   ├── model/           ← Domain helpers
│   └── seed.ts          ← Seed data (2 threads, 8 articles, 8 explainers)
├── src/
│   ├── app/             ← App shell, layouts, pages
│   ├── features/        ← Per-entity feature folders
│   │   ├── news-article/  ← News feed, detail, StoryTelling tab
│   │   ├── story-thread/  ← Thread cards, section, timeline page
│   │   └── explainer/     ← Explainer accordion, stat cards
│   ├── components/      ← 22 shared UI components
│   ├── hooks/           ← Shared React hooks
│   ├── stores/          ← Zustand stores
│   └── theme/           ← Glassmorphic OKLCH design tokens
├── android/             ← Capacitor Android project
└── docs/                ← PM 1-pager, work instructions
```

## Appendix C: Ontology Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     ONTOLOGY (schema.ts)                        │
├─────────────┬─────────────┬──────────────┬──────────────────────┤
│   DATA      │   LOGIC     │   ACTION     │   SECURITY           │
│  7 Entities │  9 Links    │  9 Mutations │  Deferred            │
│  3 Values   │  15 Queries │  0 Webhooks  │                      │
│  1 Shared   │  2 Functions│  0 Automations│                     │
└─────────────┴─────────────┴──────────────┴──────────────────────┘
```

---

## License

Private — PM portfolio project.
