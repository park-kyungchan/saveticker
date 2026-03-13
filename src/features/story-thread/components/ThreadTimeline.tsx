/**
 * Vertical timeline of articles within a story thread.
 * 스토리 스레드 내 기사의 수직 타임라인.
 */
import type { Doc } from "../../../../convex/_generated/dataModel";
import { cn } from "../../../lib/cn";
import { recipes } from "../../../theme/recipes";
import { timeAgo } from "../../../lib/timeAgo";
import { EmptyState } from "../../../components/ui/EmptyState";

/** Category badge variant map / 카테고리 배지 변형 맵 */
const categoryBadge: Record<string, { label: string; style: string }> = {
  general: { label: "종합", style: "bg-white/10 text-ink" },
  breaking: { label: "속보", style: "bg-danger/15 text-danger" },
  analysis: { label: "분석", style: "bg-info/15 text-info" },
};

/** Get date key for day-boundary grouping / 날짜 경계 그룹화용 날짜 키 */
function dateKey(ts: number): string {
  return new Date(ts).toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
}

interface ThreadTimelineProps {
  /** Ordered list of articles in the thread / 스레드 내 정렬된 기사 목록 */
  articles: Array<Doc<"newsArticles">>;
  /** Article tap handler / 기사 탭 핸들러 */
  onArticleClick?: (id: string) => void;
  /** Additional CSS classes / 추가 CSS 클래스 */
  className?: string;
}

export function ThreadTimeline({ articles, onArticleClick, className }: ThreadTimelineProps) {
  if (articles.length === 0) {
    return <EmptyState title="스레드에 기사가 없습니다" className={className} />;
  }

  let lastDateKey = "";

  return (
    <div
      data-label="storyThread.timeline"
      className={cn("relative border-l-2 border-brand/20 pl-5 space-y-3", className)}
    >
      {articles.map((article, index) => {
        const isLatest = index === 0;
        const badge = categoryBadge[article.category] ?? categoryBadge.general;
        const currentDateKey = dateKey(article.publishedAt);
        const showDateHeader = currentDateKey !== lastDateKey;
        lastDateKey = currentDateKey;

        return (
          <div key={article._id}>
            {/* Date sub-header when articles cross day boundaries */}
            {showDateHeader && (
              <p
                data-label="storyThread.timeline.dateHeader"
                className={cn(recipes.sectionTitle, "mb-2 -ml-1 text-xs")}
              >
                {currentDateKey}
              </p>
            )}

            <button
              type="button"
              data-label="storyThread.timeline.item"
              onClick={() => onArticleClick?.(article._id)}
              className={cn(
                "relative block w-full text-left rounded-xl border glass-panel p-3 space-y-1.5",
                "animate-in min-h-[44px]",
                onArticleClick && "cursor-pointer active:bg-white/5",
              )}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Timeline dot / 타임라인 도트 */}
              <span
                data-label="storyThread.timeline.dot"
                className={cn(
                  "absolute -left-[calc(1.25rem+5px)] top-4 size-3 rounded-full",
                  isLatest ? "bg-brand animate-pulse" : "bg-ink-muted/30",
                )}
              />

              {/* Category badge + time row */}
              <div className="flex items-center gap-2">
                <span
                  data-label="storyThread.timeline.category"
                  className={cn(
                    "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase",
                    badge.style,
                  )}
                >
                  {badge.label}
                </span>
                <time
                  data-label="storyThread.timeline.time"
                  className="text-xs text-ink-muted"
                  dateTime={new Date(article.publishedAt).toISOString()}
                >
                  {timeAgo(article.publishedAt)}
                </time>
              </div>

              {/* Article title / 기사 제목 */}
              <p
                data-label="storyThread.timeline.title"
                className="text-sm font-medium text-ink line-clamp-2"
              >
                {article.title}
              </p>

              {/* Summary / 요약 */}
              <p
                data-label="storyThread.timeline.summary"
                className="text-xs text-ink-muted line-clamp-2"
              >
                {article.summary}
              </p>

              {/* Source / 출처 */}
              {article.sourceName && (
                <p data-label="storyThread.timeline.source" className="text-[11px] text-ink-muted/60">
                  {article.sourceName}
                </p>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
