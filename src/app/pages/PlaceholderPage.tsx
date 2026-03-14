/**
 * 플레이스홀더 페이지 — 미구현 탭용 (피처 프리뷰 포함).
 * Placeholder page with static feature previews.
 */
import { PageHeader } from "../../components/ui/PageHeader";
import { cn } from "../../lib/cn";

interface PlaceholderPageProps {
  title: string;
  description: string;
  previewType?: "report" | "community" | "calendar";
}

export function PlaceholderPage({ title, description, previewType }: PlaceholderPageProps) {
  return (
    <div data-label="placeholder.page" className="space-y-5">
      <PageHeader title={title} />

      {/* Feature preview */}
      {previewType === "calendar" && <CalendarPreview />}
      {previewType === "report" && <ReportPreview />}
      {previewType === "community" && <CommunityPreview />}

      <div
        data-label="placeholder.page.content"
        className="flex flex-col items-center justify-center rounded-xl border glass-panel p-6 text-center shadow-md"
      >
        <div className="mb-3 flex size-12 items-center justify-center rounded-2xl border glass-panel shadow-sm" aria-hidden="true">
          <svg className="size-5 text-ink-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
          </svg>
        </div>
        <p data-label="placeholder.page.description" className="text-sm text-ink-muted max-w-[260px]">
          {description}
        </p>
        <p className="mt-2 text-xs text-ink-muted/60">
          프로토타입에서는 뉴스 + StoryTelling에 집중합니다.
        </p>
      </div>
    </div>
  );
}

/** Mini calendar with highlighted economic indicator dates */
function CalendarPreview() {
  const highlights: Record<number, string> = {
    3: "ISM 제조업 PMI",
    6: "비농업 취업자수",
    11: "CPI 상승률",
    13: "PCE 가격지수",
    19: "FOMC 금리결정",
    27: "미시간 소비자심리",
  };
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div data-label="placeholder.calendarPreview" className="rounded-xl border glass-panel p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-ink">2026년 3월</h3>
        <span className="text-[10px] text-ink-muted/60">미국 경제지표</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
        {["일","월","화","수","목","금","토"].map((d) => (
          <span key={d} className="text-ink-muted/50 font-medium py-1">{d}</span>
        ))}
        {/* Offset: March 2026 starts on Sunday */}
        {days.map((day) => {
          const event = highlights[day];
          return (
            <button
              key={day}
              type="button"
              className={cn(
                "rounded-lg py-1.5 transition-colors min-h-[32px]",
                event
                  ? "bg-brand/15 text-brand border border-brand/20 font-medium"
                  : "text-ink-muted/60 hover:bg-white/5",
              )}
              title={event}
            >
              {day}
            </button>
          );
        })}
      </div>
      {/* Legend */}
      <div className="space-y-1 pt-1 border-t border-white/8">
        {Object.entries(highlights).slice(0, 3).map(([day, label]) => (
          <div key={day} className="flex items-center gap-2 text-[10px]">
            <span className="text-brand/80 font-medium w-6">{day}일</span>
            <span className="text-ink-muted/70">{label}</span>
          </div>
        ))}
        <p className="text-[9px] text-ink-muted/40">+{Object.keys(highlights).length - 3}개 더보기</p>
      </div>
    </div>
  );
}

/** Mock report cards */
function ReportPreview() {
  const reports = [
    { company: "삼성전자", insight: "반도체 업황 반등 시그널 — HBM 수주 확대" },
    { company: "HD현대중공업", insight: "LNG선 수주잔고 역대 최대 — 호르무즈 특수" },
    { company: "한국가스공사", insight: "에너지 수급 불안정 속 LNG 조달 전략 전환" },
  ];

  return (
    <div data-label="placeholder.reportPreview" className="space-y-2">
      {reports.map((r) => (
        <div key={r.company} className="rounded-xl border glass-panel p-3.5 flex items-start gap-3">
          <div className="flex shrink-0 items-center justify-center rounded-lg bg-info/10 text-info size-9 text-xs font-bold">
            {r.company[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink">{r.company}</p>
            <p className="text-[11px] text-ink-muted/70 line-clamp-1">{r.insight}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Mock community thread */
function CommunityPreview() {
  return (
    <div data-label="placeholder.communityPreview" className="rounded-xl border glass-panel p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center rounded-full bg-accent-2/10 text-accent-2 size-7 text-[10px] font-bold">P</div>
        <div>
          <p className="text-xs font-medium text-ink">투자자A</p>
          <p className="text-[10px] text-ink-muted/50">2시간 전</p>
        </div>
      </div>
      <p className="text-sm text-ink/90">호르무즈 사태 이후 에너지 섹터 어떻게 보시나요? 중립적 관점에서 의견 나눠봐요.</p>
      <div className="flex items-center gap-3 text-[10px] text-ink-muted/50">
        <span>댓글 12</span>
        <span>조회 342</span>
      </div>
    </div>
  );
}
