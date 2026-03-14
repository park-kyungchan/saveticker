# SaveTicker News Feed v2 — 통합 가이드

## 변경 사항 요약

### 새 컴포넌트 (4개)
| 파일 | 역할 |
|------|------|
| `HeroNewsCard.tsx` | 톱 뉴스 히어로 카드 — 카테고리별 gradient + glow 처리 |
| `BreakingTicker.tsx` | 속보 가로 스크롤 스트립 — snap scrolling |
| `TagFilterStrip.tsx` | 시맨틱 태그 필터 — 태그별 고유 색상 매핑 |
| `StoryThreadBanner.tsx` | 스토리 스레드 진입점 배너 — brand gradient |

### 개선 컴포넌트 (2개)
| 파일 | 변경 내용 |
|------|-----------|
| `NewsCard.tsx` | 카테고리 아이콘 + 좌측 accent border + compact 모드 + 스레드 인디케이터 |
| `NewsPage.tsx` | 전체 레이아웃 재구성: Header → Tabs → Tags → Threads → Ticker → Hero → Feed |

## 파일 복사 위치

```
src/
├── app/pages/
│   └── NewsPage.tsx          ← 교체
└── features/news-article/components/
    ├── HeroNewsCard.tsx       ← 새 파일
    ├── BreakingTicker.tsx     ← 새 파일
    ├── TagFilterStrip.tsx     ← 새 파일
    ├── StoryThreadBanner.tsx  ← 새 파일
    └── NewsCard.tsx           ← 교체
```

## 디자인 컨셉: "Luminous Terminal"

### 시각적 계층 구조 (위→아래)
1. **Header** — 브랜드 로고 마크 + Live 인디케이터
2. **Tab Strip** — 전체/분석/속보/Feed 필터
3. **Tag Filter** — 시맨틱 색상 매핑된 태그 칩 (에너지=amber, 지정학=danger, 사모신용=purple 등)
4. **Story Thread Banners** — brand gradient 배경의 스레드 진입점
5. **Breaking Ticker** — 펄싱 도트 + 가로 스크롤 속보 카드
6. **Hero Card** — 톱 뉴스의 대형 카드 (카테고리별 gradient/glow)
7. **Feed Cards** — 아이콘 캡슐 + accent border + 컴팩트 레이아웃

### 카테고리별 시각적 차별화
- **속보**: 빨간 accent border, danger 아이콘, 펄싱 라이브 도트
- **분석**: 파란 accent border, 차트 아이콘
- **종합**: 뉴트럴 border, 말풍선 아이콘

## 기존 의존성만 사용
- `motion/react` (이미 설치됨)
- `convex/react` hooks (기존 그대로)
- Tailwind CSS tokens (기존 glassmorphic 테마 호환)

## CSS 추가 불필요
모든 스타일이 기존 `index.css`의 CSS 변수와 유틸리티(`glass-panel`, `scrollbar-none`, `animate-in` 등)를 활용합니다.
