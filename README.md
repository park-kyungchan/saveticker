# SaveTicker

> 금융문맹을 해소하고, 중립적 뉴스를 맥락으로 엮어 올바른 의사결정을 돕는 앱.
> "설계하고 직접 만드는 PM"을 증명하기 위해 만든 프로토타입입니다.

**SAVE 앱 참조**: [saveticker.com](https://saveticker.com)
| [App Store](https://apps.apple.com/app/id6751139540)
| [Google Play](https://play.google.com/store/apps/details?id=com.savenews.app)

---

## 문제를 발견하기까지

미국 주식에 투자하면서 매일 영어 뉴스를 읽었습니다.
Reuters 속보가 뜨고, 한국어 기사가 나오기까지 보통 2-4시간.
그 사이에 시장은 이미 움직이고, 번역된 기사는 의역 없는 직역이라 맥락이 빠져 있었습니다.

주변에 물어보니 저만의 문제가 아니었습니다.

**2024 전국민 금융이해력 조사**(한국은행·금감원)에 따르면:
- 금융 태도 점수 **53.7점** — OECD 평균(58.0점) 미달
- 취약 계층: **20대 청년**, **70대 이상 노인**, 저소득층

한국 금융 뉴스에는 **3중 장벽**이 있다고 정리했습니다:

| 장벽 | 현상 | 영향받는 사용자 |
|------|------|----------------|
| **언어** | 글로벌 속보는 영어 먼저, 한국어는 늦고 의역 부족 | 영어에 약한 개인투자자 |
| **전문용어** | VLCC, BDC, PMI... 기사를 읽어도 이해 불가 | 투자 입문자, 고령층 |
| **단편성** | 관련 기사가 흩어져 원인→결과를 독자가 직접 연결해야 함 | 시간 없는 직장인 |

SAVE 앱이 이미 좋은 해결을 하고 있지만, PM 관점에서 "내가 이 문제를 풀어야 한다면 어떻게 설계할 것인가"를 직접 보여주고 싶었습니다.

---

## 어떻게 풀었는가 — 3가지 기능

### 기능 1. Story Threads — 흩어진 속보를 하나의 이야기로

> *"이란이 호르무즈 해협을 봉쇄하면, 왜 내 주유소 기름값이 오르는가?"*

단편 속보 4-5건이 따로 올라오면, 독자는 연결점을 스스로 찾아야 합니다.
Story Threads는 관련 기사를 **시간순 타임라인**으로 묶어, 사건의 전개를 한눈에 보여줍니다.

**설계 결정:**
- 기사에 `storyThreadId` FK를 두어, 하나의 기사가 하나의 스레드에 속하도록 했습니다 (1:N).
- `orderInThread`로 스레드 내 시간순 배치를 제어합니다.
- 스레드에 `active`/`completed` 상태를 두어, 진행 중인 사건과 마무리된 사건을 구분합니다.

**구현 결과:** 2개 스레드 × 4개 기사, 스레드 카드 UI + 타임라인 페이지.

---

### 기능 2. Plain Language Cards — "나에게 어떤 영향?"

> *"연준이 금리를 동결했다"는 뉴스를 읽고, 20대 사회초년생이 '그래서 내 대출이자는 어떻게 되는데?'라고 물을 수 있어야 합니다.*

전문용어를 비유로 풀고, **개인적 영향**을 한 문장으로 요약하는 카드입니다.
SAVE의 "효율성" 가치와 직접 연결됩니다.

**설계 결정:**
- 기사와 1:1 관계 (unique index). 하나의 기사에 하나의 해설만 존재합니다.
- `personalImpact` 필드: "이 뉴스가 나에게 미치는 영향"을 별도 섹션으로 분리했습니다.
- `difficultyLevel` (입문/중급/심화): 독자가 자기 수준에 맞는 글을 선택할 수 있게 합니다.
- `analogy`: 복잡한 개념을 실생활 비유로 설명합니다 (예: "Private Credit은 친구한테 돈 빌려주는 것의 기업 버전").

**접근성 고려:**
- 48px 터치 타겟 (노인 친화)
- WCAG AA 대비, 16-18px 본문 글씨
- 핵심 한 줄 요약을 카드 상단에 배치 (점진적 공개)

**구현 결과:** 8개 한국어 해설 카드, CRUD 완성, 어코디언 UI.

---

### 기능 3. Impact Chains — 원인-결과 도미노

> *이란 공습 → 호르무즈 봉쇄 → 유조선 운임 급등 → 유가 상승 → 한국 에너지 수입 비용 증가 → 소비자 물가 상승*

한 사건이 어떻게 연쇄적으로 영향을 미치는지, **도미노 트리**로 시각화합니다.
SAVE의 "개인화" 가치 — 글로벌 사건이 나에게 어떻게 닿는지 보여주는 것 — 와 연결됩니다.

**설계 결정:**
- 자기참조 트리 구조 (`parentNodeId` → 같은 테이블). 깊이 제한 없이 원인-결과를 확장 가능.
- 노드에 `newsArticleId` FK를 두어, 각 도미노가 근거 기사와 연결됩니다.
- CASCADE DELETE: 부모 노드 삭제 시 모든 하위 노드도 함께 삭제 (데이터 무결성).

**구현 결과:** 2개 체인 × 5개 노드, DominoFlow 시각화 컴포넌트.

---

## 핵심 철학

**종목 추천은 절대 하지 않습니다.**
중립적 사실 전달과 맥락 제공만 합니다.
사용자가 스스로 판단할 수 있는 기반을 만드는 것이 목적입니다.

이것은 SAVE의 철학과 같습니다.

---

## PM이 직접 만든다는 것

이 프로토타입은 Figma 목업이 아닙니다.
**Play Store 내부 테스트 트랙에 배포된, 실제로 동작하는 앱**입니다.

기획부터 빌드까지 전 과정을 직접 수행했습니다:

| 단계 | 내용 |
|------|------|
| **문제 정의** | 금융 뉴스 3중 장벽 분석, 한국은행·금감원 데이터 활용 |
| **도메인 모델링** | Palantir 4-fold 온톨로지 (DATA/LOGIC/ACTION/SECURITY)로 7개 엔티티 설계 |
| **데이터 설계** | 7 테이블, 11 뮤테이션, 18 쿼리 — 온톨로지에서 자동 파생 |
| **UI/UX** | 다크 글라스모픽 테마, 이중언어(영/한), WCAG AA 접근성 |
| **풀스택 구현** | React 19 + Convex + Capacitor — 43 컴포넌트, 18 훅 |
| **QA** | 25 테스트 (온톨로지 정합성), 타입체크 통과 |
| **배포** | Android APK → Play Store 내부 테스트 (v3.4.0, versionCode 25) |

엔지니어에게 전달하는 PRD가 아니라, **동작하는 코드로 의도를 증명**했습니다.
PM이 기술을 이해하면, 커뮤니케이션 비용이 줄고 실현 가능한 기획이 나옵니다.

---

## 온톨로지 기반 설계

왜 바로 코드를 쓰지 않고, 도메인 모델을 먼저 설계했는가?

SAVE 앱처럼 **기사, 스레드, 해설, 종목, 사용자, 영향 체인**이 복잡하게 연결된 도메인에서는
엔티티 간 관계를 먼저 정의하지 않으면, 나중에 데이터 구조를 뜯어고쳐야 합니다.

Palantir의 4-fold 모델을 차용해서 도메인을 4개 영역으로 분리했습니다:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ONTOLOGY (도메인 모델)                            │
├────────────────┬────────────────┬────────────────┬──────────────────────┤
│     DATA       │     LOGIC      │     ACTION     │     SECURITY         │
│  "무엇이 존재"  │  "어떻게 추론"  │  "무엇을 변경"  │  "누가 접근"          │
│                │                │                │                      │
│  7 Entities    │  9 Links       │  11 Mutations  │  3 Roles             │
│  3 Value Types │  18 Queries    │  1 Automation  │  16 Permissions      │
│  1 Shared Prop │  4 Functions   │  (declared)    │                      │
└────────────────┴────────────────┴────────────────┴──────────────────────┘
```

이 모델이 있으면:
- **기획 변경 시** 영향 범위를 즉시 파악할 수 있습니다.
- **엔지니어와 소통할 때** "이 엔티티의 이 필드를 수정해주세요"라고 정확히 말할 수 있습니다.
- **새 기능 추가 시** 기존 모델의 어디에 붙이면 되는지 명확합니다.

PM이 이런 수준의 도메인 이해를 갖추면, 기획서의 품질이 달라집니다.

---

## 이중언어 전략

| 필드 | 역할 | 예시 |
|------|------|------|
| `title` / `body` | 영문 원본 | "Fed Holds Rates Steady..." |
| `summaryKo` | 의역+투자자 관점 요약 | "연준 금리 동결 — 한국 수출 기업에는 호재" |
| `bodyKo` | 직역 (원문 충실) | "연방준비제도 이사회는 기준금리를..." |

**의역(summaryKo)과 직역(bodyKo)을 분리**한 이유:
- 빠르게 핵심을 파악하고 싶은 사용자 → summaryKo
- 원문에 가까운 정확한 번역을 원하는 사용자 → bodyKo
- 영어 원문을 직접 읽고 싶은 사용자 → title + body

하나의 기사에 3가지 소비 방식을 제공합니다.

---

## Live Demo

```bash
bun install && bun run dev     # Frontend (http://localhost:5173)
bunx convex dev                # Backend (별도 터미널)
```

**체험 경로:** 뉴스 피드 → 스토리 흐름 카드 클릭 → 기사 상세 → 한국어 탭 → StoryTelling 탭

---

## Appendix

<details>
<summary><strong>A. Tech Stack</strong></summary>

| Layer | Technology |
|-------|------------|
| Runtime | Bun + TypeScript (strict) |
| Backend | Convex (serverless, real-time subscriptions) |
| Frontend | React 19, Vite 7, Tailwind CSS v4, React Router v7 |
| State | Zustand 5 |
| Mobile | Capacitor 8 (Android) — `io.saveticker.prototype` |
| Ontology | Palantir-adapted 4-fold model |
| Theme | OKLCH tokens, dark glassmorphic, Noto Sans KR |

</details>

<details>
<summary><strong>B. Project Structure</strong></summary>

```
saveticker/
├── ontology/            ← 도메인 모델 (SSoT)
│   ├── data.ts          ← DATA: 7 엔티티, 3 값 타입
│   ├── logic.ts         ← LOGIC: 9 링크, 18 쿼리, 4 함수
│   ├── action.ts        ← ACTION: 11 뮤테이션
│   └── security.ts      ← SECURITY: 3 역할, 16 권한
├── convex/              ← 백엔드 (Convex)
│   ├── schema.ts        ← 7 테이블
│   ├── queries.ts       ← 18 쿼리 엔드포인트
│   ├── mutations.ts     ← 11 뮤테이션 엔드포인트
│   ├── model/           ← 비즈니스 로직 헬퍼
│   └── seed.ts          ← 시드 데이터 (45 레코드)
├── src/
│   ├── app/             ← 앱 셸, 레이아웃, 페이지
│   ├── features/        ← 엔티티별 기능 폴더
│   │   ├── news-article/  ← 뉴스 피드, 상세, 번역 탭
│   │   ├── story-thread/  ← 스레드 카드, 타임라인
│   │   ├── explainer/     ← 쉬운 해설 카드
│   │   └── impact-chain/  ← 영향 도미노 시각화
│   ├── components/      ← 공유 UI (43개)
│   └── hooks/           ← 공유 React 훅 (18개)
├── android/             ← Capacitor Android 프로젝트
├── tests/               ← 온톨로지 정합성 테스트 (25개)
└── docs/                ← PM 문서
```

</details>

<details>
<summary><strong>C. Seed Data</strong></summary>

| 테이블 | 건수 | 내용 |
|--------|------|------|
| stocks | 12 | AAPL, NVDA, HIMS 등 미국 주요 종목 |
| newsArticles | 8 | 이란 위기, 연준 금리, BDC 분석 등 |
| storyThreads | 2 | 이란 호르무즈 위기, HIMS 실적 발표 |
| explainers | 8 | 모든 기사에 대한 쉬운 해설 |
| impactChains | 2 | 유가 영향 체인, HIMS 영향 체인 |
| impactNodes | 10 | 원인→결과 도미노 노드 |
| users | 3 | 데모 사용자 |

</details>

---

## License

Private — PM portfolio project.
