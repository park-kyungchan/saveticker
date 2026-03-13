/**
 * Story Thread Banner — 피드에서 스토리 스레드 진입점.
 * Inline story thread entry point on the news feed.
 */
import { motion } from "motion/react";
import { cn } from "../../../lib/cn";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface StoryThreadBannerProps {
  thread: Doc<"storyThreads">;
  articleCount?: number;
  onClick?: () => void;
  className?: string;
}

export function StoryThreadBanner({ thread, articleCount, onClick, className }: StoryThreadBannerProps) {
  return (
    <motion.button
      type="button"
      data-label="news.threadBanner"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative w-full overflow-hidden rounded-xl text-left",
        "border border-brand/15",
        "bg-gradient-to-r from-brand/8 via-brand/4 to-transparent",
        "backdrop-blur-md",
        "group",
        className,
      )}
    >
      {/* Subtle glow */}
      <div className="absolute -top-8 -right-8 size-32 rounded-full bg-brand/6 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex items-center gap-3 p-3.5">
        {/* Thread icon */}
        <div className="flex shrink-0 items-center justify-center size-9 rounded-lg bg-brand/12 text-brand/80">
          <svg viewBox="0 0 16 16" className="size-4" fill="currentColor">
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
          </svg>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-brand/70">
              스토리 스레드
            </span>
            {articleCount != null && (
              <span className="text-[10px] text-ink-muted/50">기사 {articleCount}건</span>
            )}
          </div>
          <p className="text-[13px] font-medium text-ink/90 line-clamp-1 mt-0.5 group-hover:text-white transition-colors">
            {thread.titleKo}
          </p>
        </div>

        {/* Arrow */}
        <svg viewBox="0 0 20 20" className="size-4 shrink-0 text-brand/40 group-hover:text-brand/70 transition-colors" fill="currentColor">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02z" clipRule="evenodd" />
        </svg>
      </div>
    </motion.button>
  );
}
