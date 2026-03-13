/**
 * Story thread card — summary card for a StoryThread entity.
 * 스토리 스레드 카드 — StoryThread 엔티티의 요약 카드.
 */
import type { Doc } from "../../../../convex/_generated/dataModel";
import { cn } from "../../../lib/cn";
import { recipes } from "../../../theme/recipes";
import { Badge } from "../../../components/ui/Badge";

interface ThreadCardProps {
  /** Story thread document / 스토리 스레드 문서 */
  thread: Doc<"storyThreads">;
  /** Number of articles in thread / 스레드 내 기사 수 */
  articleCount?: number;
  /** Card tap handler / 카드 탭 핸들러 */
  onClick?: () => void;
  /** Additional CSS classes / 추가 CSS 클래스 */
  className?: string;
  /** Inline styles (e.g. animationDelay for stagger) / 인라인 스타일 */
  style?: React.CSSProperties;
}

/** Status dot color key for recipes.statusDot / 상태 도트 색상 키 */
const statusDotColor: Record<string, string> = {
  active: "active",
  completed: "inactive",
};

/** Status badge label + variant / 상태 뱃지 라벨 + 변형 */
const statusBadge: Record<string, { label: string; variant: "success" | "default" }> = {
  active: { label: "진행 중", variant: "success" },
  completed: { label: "완료", variant: "default" },
};

export function ThreadCard({ thread, articleCount, onClick, className, style }: ThreadCardProps) {
  const dot = statusDotColor[thread.status] ?? "neutral";
  const badge = statusBadge[thread.status] ?? { label: thread.status, variant: "default" as const };

  return (
    <button
      type="button"
      data-label="storyThread.card"
      onClick={onClick}
      style={style}
      className={cn(
        recipes.card.base,
        "card-lift animate-in w-full text-left",
        "min-h-[44px]",
        onClick && "cursor-pointer active:bg-white/5",
        className,
      )}
    >
      {/* Header row: status dot + title + badge */}
      <div data-label="storyThread.card.header" className="flex items-center gap-2">
        <span
          data-label="storyThread.card.statusDot"
          className={cn(recipes.statusDot.base, recipes.statusDot.colors[dot])}
          aria-label={badge.label}
        />
        <span
          data-label="storyThread.card.title"
          className="flex-1 text-sm font-medium text-ink line-clamp-1"
        >
          {thread.titleKo}
        </span>
        <Badge variant={badge.variant}>{badge.label}</Badge>
        {articleCount != null && (
          <span data-label="storyThread.card.articleCount" className="text-xs text-ink-muted">
            {articleCount}건
          </span>
        )}
      </div>

      {/* Description */}
      {thread.descriptionKo && (
        <p
          data-label="storyThread.card.description"
          className="mt-2 text-xs text-ink-muted line-clamp-2"
        >
          {thread.descriptionKo}
        </p>
      )}
    </button>
  );
}
