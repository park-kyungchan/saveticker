# SaveTicker Code Review — 전체 결과

## 요약: 19건 발견 (Critical 3 / High 4 / Medium 6 / Low 6)

---

## Critical (즉시 수정)

### C-1: `src/lib/security.ts` — 권한 매트릭스 레거시 동기화 실패
- **파일**: `src/lib/security.ts`
- **문제**: permissions 객체가 10-entity 레거시 기준. 삭제된 5개 엔티티(`WatchlistEntry`, `EconomicIndicator`, `FinancialTerm`, `ArticleTermUsage`, `NewsStockLink`) 잔존, 새 엔티티 3개(`Explainer`, `ImpactChain`, `ImpactNode`) 누락
- **영향**: `RoleGuard`, `FieldVisibility` 컴포넌트가 새 엔티티에 대해 `canPerform()` 호출 시 항상 `false` 반환 → UI에서 권한 있는 사용자도 차단
- **수정**: `saveticker-fixes/src/lib/security.ts` ← 교체

### C-2: `convex/mutations.ts` — 전 mutation 인증 체크 부재
- **파일**: `convex/mutations.ts` (9개 mutation 전체)
- **문제**: `ctx.auth` 미확인, `updatedBy` 필드에 요청자 ID를 넣지 않음. Public mutation이므로 Convex 클라이언트에서 비인증 호출 가능
- **영향**: 프로토타입 단계에서는 수용 가능하나, Convex 배포 URL이 노출되면 누구나 데이터 변조 가능
- **권장**: 각 mutation handler에 최소 가드 추가 (requesterId arg + null check), 또는 Convex Auth 통합

### C-3: `src/stores/feedStore.ts` — Capacitor WebView에서 localStorage 불안정
- **파일**: `src/stores/feedStore.ts`
- **문제**: `zustand/middleware/persist`가 `localStorage` 기본 사용. Android WebView에서 앱 업데이트, 캐시 클리어, 시스템 메모리 부족 시 데이터 소실
- **수정**: `saveticker-fixes/src/stores/feedStore.ts` ← 교체 (Capacitor Preferences API 우선, localStorage 폴백)

---

## High (빠른 시일 내 수정)

### H-1: `convex/seed.ts` — 멱등성 가드 없음
- **파일**: `convex/seed.ts`
- **문제**: `seedAll`이 실행 여부를 확인하지 않아 중복 실행 시 데이터 중복
- **수정 가이드**: `saveticker-fixes/convex/SEED_GUARD.md`

### H-2: `convex/schema.ts` — stocks 테이블에 `updatedAt` 누락
- **파일**: `convex/schema.ts` (`stocks` 테이블)
- **문제**: `ontology/data.ts`에서 Stock이 Auditable 미구현으로 의도적이나, 다른 6개 테이블과 일관성이 깨짐. Stock 수정 기능 추가 시 스키마 마이그레이션 필요
- **권장**: 지금은 미수정 (의도적), 하지만 `// NOTE: no updatedAt — reference data, not user-edited` 주석 추가 권장

### H-3: `convex/model/article.ts` — full-table scan 3곳 무제한
- **파일**: `convex/model/article.ts` (`articlesByTicker`, `articlesBySource`, `articlesByTag`)
- **문제**: `.collect()`가 전체 테이블 스캔. 기사가 수천 건이 되면 Convex function timeout 위험
- **수정**: `saveticker-fixes/convex/model/article.ts` ← 교체 (`take(MAX_SCAN_LIMIT)` 가드 추가)

### H-4: `convex/queries.ts` — 일부 query의 입력값 범위 검증 없음
- **파일**: `convex/queries.ts`
- **문제**: `getRecentArticles`의 `limit`에 음수나 극단적 큰 값을 넣어도 검증 없음. `getSearchArticles`의 `query`가 빈 문자열이면 Convex search index 에러 가능
- **권장**: handler에서 `Math.max(1, Math.min(limit, 100))` 범위 클램프 추가

---

## Medium (다음 이터레이션)

### M-1: `src/components/ui/AnimatedList.tsx` — 불안정한 `key={i}`
- **파일**: `src/components/ui/AnimatedList.tsx`
- **문제**: 인덱스 기반 key 사용 → 리스트 재정렬 시 React reconciliation 오류, 애니메이션 깨짐
- **수정**: `saveticker-fixes/src/components/ui/AnimatedList.tsx` ← 교체

### M-2: `src/lib/timeAgo.ts` — 엣지 케이스 미처리
- **파일**: `src/lib/timeAgo.ts`
- **문제**: (1) 미래 타임스탬프 → "방금 전" 잘못 표시, (2) 주/월/년 단위 없음, (3) seed 데이터가 과거 고정이라 모두 "N일 전"
- **수정**: `saveticker-fixes/src/lib/timeAgo.ts` ← 교체

### M-3: `convex/mutations.ts` — patch 패턴이 `Record<string, unknown>`으로 type-unsafe
- **파일**: `convex/mutations.ts` (updateStoryThread, updateExplainer, updateUserProfile)
- **문제**: `Record<string, unknown>` 사용으로 Convex 타입 체킹 무력화
- **권장**: 각 mutation에서 명시적 필드 매핑 사용
  ```typescript
  await ctx.db.patch(id, {
    ...(args.title !== undefined && { title: args.title }),
    ...(args.status !== undefined && { status: args.status }),
    updatedAt: Date.now(),
  });
  ```

### M-4: `src/features/news-article/components/FeedSettings.tsx` — 접근성 부족
- **파일**: `FeedSettings.tsx`
- **문제**: `<dialog>` 대신 커스텀 오버레이 사용 → 키보드 트랩 없음, ESC 닫기 없음, 스크린리더 미인식
- **권장**: 기존 `Modal.tsx`(`<dialog>` 기반) 패턴으로 전환

### M-5: `src/app/pages/HomePage.tsx` — 미사용 Dead Code
- **파일**: `src/app/pages/HomePage.tsx`
- **문제**: `App.tsx`의 라우터에서 사용되지 않음 (index route = `NewsPage`). 코드가 남아있으면 혼란 유발
- **권장**: 삭제하거나 `/home` 라우트에 연결

### M-6: `convex/model/auth.ts` ↔ `convex/model/security.ts` 역할 중복
- **파일**: `convex/model/auth.ts`, `convex/model/security.ts`
- **문제**: 두 파일이 비슷한 역할(PersonalData 마킹 + RLS 체크)을 분리 구현하지만, 실제로 어떤 mutation/query에서도 호출되지 않음 — Dead Code
- **권장**: mutation handler에서 실제 호출하거나, 프로토타입 단계에서는 하나로 통합

---

## Low / DX (개선 사항)

### L-1: `ontology/data.ts` ↔ `convex/schema.ts` 동기화 수동
- **문제**: 온톨로지 변경 시 schema.ts를 수동 업데이트해야 함. drift 위험
- **권장**: codegen 스크립트 작성 (ontology → schema.ts 자동 생성)

### L-2: `Input.tsx`, `Select.tsx` — `forwardRef` displayName 누락
- **수정**: `saveticker-fixes/src/components/ui/Input.tsx`, `Select.tsx` ← 교체

### L-3: `ErrorBoundary.tsx` — 에러 리포팅 없음, 재시도 제한 없음
- **수정**: `saveticker-fixes/src/components/ui/ErrorBoundary.tsx` ← 교체 (onError 콜백 + 재시도 카운터)

### L-4: `convex/crons.ts` — 빈 파일
- **문제**: 빈 cron 정의가 `_generated/api.d.ts`에 type으로 등록됨
- **권장**: 의도적 placeholder라면 주석 유지, 아니면 삭제

### L-5: `src/theme/types.ts` — ThemeRecipes에 unused 타입
- **문제**: `severityBadge`, `priceChange` 등이 실제 UI에서 사용되지 않음
- **권장**: 프로토타입 확장 시 사용 예정이면 유지, 아니면 trim

### L-6: 환경변수 타입 선언 누락
- **문제**: `import.meta.env.VITE_CONVEX_URL`에 TypeScript 타입 선언 없음
- **권장**: `src/vite-env.d.ts` 추가
  ```typescript
  interface ImportMetaEnv {
    readonly VITE_CONVEX_URL: string;
  }
  ```

---

## 수정 파일 매핑

| 수정 파일 | 원본 위치 | 액션 |
|-----------|----------|------|
| `src/lib/security.ts` | 동일 | 교체 |
| `src/lib/timeAgo.ts` | 동일 | 교체 |
| `src/stores/feedStore.ts` | 동일 | 교체 |
| `src/components/ui/AnimatedList.tsx` | 동일 | 교체 |
| `src/components/ui/ErrorBoundary.tsx` | 동일 | 교체 |
| `src/components/ui/Input.tsx` | 동일 | 교체 |
| `src/components/ui/Select.tsx` | 동일 | 교체 |
| `convex/model/article.ts` | 동일 | 교체 |
| `convex/SEED_GUARD.md` | N/A | 참조 (seed.ts 수동 수정) |
