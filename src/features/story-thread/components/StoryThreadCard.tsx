/**
 * Story Thread Card — 스토리 스레드 카드.
 * Glass panel card with vertical timeline visual.
 */
import { motion } from "motion/react";
import { cn } from "../../../lib/cn";
import { Badge } from "../../../components/ui/Badge";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface StoryThreadCardProps {
  thread: Doc<"storyThreads">;
  articleCount: number;
  articleTitles: string[];
  onClick: () => void;
  className?: string;
}

export function StoryThreadCard({
  thread,
  articleCount,
  articleTitles,
  onClick,
  className,
}: StoryThreadCardProps) {
  const statusLabel = thread.status === "active" ? "진행 중" : "완결";
  const statusVariant = thread.status === "active" ? "info" : "success";

  return (
    <motion.button
      type="button"
      data-label="storyThread.card"
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      className={cn(
        "relative w-[280px] shrink-0 overflow-hidden rounded-xl border text-left",
        "glass-panel border-l-[3px] border-l-brand/40",
        "hover:border-white/20 hover:bg-white/[0.04]",
        "transition-all duration-300",
        "p-4 min-h-[48px]",
        className,
      )}
    >
      {/* Header: status + count */}
      <div className="flex items-center gap-2 mb-2.5">
        <Badge variant={statusVariant}>{statusLabel}</Badge>
        <span className="text-[10px] text-ink-muted/60">{articleCount}건의 기사</span>
      </div>

      {/* Title */}
      <h3
        data-label="storyThread.card.title"
        className="text-sm font-medium text-ink leading-snug mb-3 line-clamp-2"
      >
        {thread.titleKo}
      </h3>

      {/* Mini timeline */}
      <div className="space-y-0 pl-3 border-l border-white/10">
        {articleTitles.slice(0, 3).map((title, i) => (
          <div key={i} className="relative flex items-start gap-2 pb-2">
            {/* Timeline dot */}
            <span
              className={cn(
                "absolute -left-[15px] top-1 size-2 rounded-full border",
                i === 0
                  ? "bg-brand/60 border-brand/40"
                  : "bg-white/10 border-white/15",
              )}
            />
            <p className="text-[11px] text-ink-muted/70 leading-snug line-clamp-1">
              {title}
            </p>
          </div>
        ))}
        {articleCount > 3 && (
          <p className="text-[10px] text-ink-muted/40 pl-0">
            +{articleCount - 3}건 더보기
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="mt-3 pt-2 border-t border-white/8">
        <span className="text-[11px] font-medium text-brand/80">
          스토리 전체보기 →
        </span>
      </div>
    </motion.button>
  );
}
