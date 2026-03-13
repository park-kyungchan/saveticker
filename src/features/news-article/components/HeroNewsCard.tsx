/**
 * Hero News Card — 톱 뉴스를 드라마틱하게 표현하는 히어로 카드.
 * Dramatic hero treatment for the top news story.
 */
import { motion } from "motion/react";
import { cn } from "../../../lib/cn";
import { timeAgo } from "../../../lib/timeAgo";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface HeroNewsCardProps {
  article: Doc<"newsArticles">;
  onClick?: () => void;
  className?: string;
}

const categoryMeta: Record<string, { label: string; gradient: string; glow: string }> = {
  breaking: {
    label: "속보",
    gradient: "from-danger/25 via-danger/8 to-transparent",
    glow: "shadow-[0_0_40px_oklch(0.68_0.22_25/0.15)]",
  },
  analysis: {
    label: "분석",
    gradient: "from-info/20 via-info/6 to-transparent",
    glow: "shadow-[0_0_40px_oklch(0.75_0.15_240/0.12)]",
  },
  general: {
    label: "종합",
    gradient: "from-accent-1/15 via-accent-1/5 to-transparent",
    glow: "shadow-[0_0_40px_oklch(0.78_0.18_180/0.1)]",
  },
};

export function HeroNewsCard({ article, onClick, className }: HeroNewsCardProps) {
  const meta = categoryMeta[article.category] ?? categoryMeta.general;
  const isBreaking = article.category === "breaking";

  return (
    <motion.button
      type="button"
      data-label="news.heroCard"
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border text-left",
        "glass-panel-heavy",
        meta.glow,
        "group",
        className,
      )}
    >
      {/* Gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br pointer-events-none",
          meta.gradient,
        )}
      />

      {/* Mesh accent — subtle radial glow */}
      <div className="absolute -top-20 -right-20 size-60 rounded-full bg-brand/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-accent-1/6 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 p-5 space-y-3">
        {/* Top row: category + live dot for breaking */}
        <div className="flex items-center gap-2.5">
          {isBreaking && (
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-live-dot rounded-full bg-danger" />
              <span className="relative inline-flex size-2 rounded-full bg-danger" />
            </span>
          )}
          <span
            className={cn(
              "text-[11px] font-semibold uppercase tracking-[0.08em]",
              isBreaking ? "text-danger" : article.category === "analysis" ? "text-info" : "text-accent-1",
            )}
          >
            {meta.label}
          </span>
          <span className="text-[10px] text-ink-muted/50">·</span>
          <time className="text-[11px] text-ink-muted/70" dateTime={new Date(article.publishedAt).toISOString()}>
            {timeAgo(article.publishedAt)}
          </time>
        </div>

        {/* Title — large, prominent */}
        <h2 className="text-[17px] font-medium leading-[1.35] text-ink tracking-tight group-hover:text-white transition-colors duration-300">
          {article.titleKo || article.title}
        </h2>

        {/* Summary */}
        <p className="text-[13px] leading-relaxed text-ink-muted line-clamp-3">
          {article.summaryKo || article.summary}
        </p>

        {/* Bottom row: tickers + source */}
        <div className="flex items-center justify-between pt-1">
          {/* Tickers */}
          {article.mentionedTickers && article.mentionedTickers.length > 0 && (
            <div className="flex items-center gap-1.5">
              {article.mentionedTickers.slice(0, 4).map((ticker) => (
                <span
                  key={ticker}
                  className="inline-flex items-center rounded-md bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 text-[10px] font-mono font-medium text-accent-1/80 tracking-wide"
                >
                  {ticker}
                </span>
              ))}
              {article.mentionedTickers.length > 4 && (
                <span className="text-[10px] text-ink-muted/50">
                  +{article.mentionedTickers.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Source */}
          {article.sourceName && (
            <span className="text-[11px] font-medium text-ink-muted/60">
              {article.sourceName}
            </span>
          )}
        </div>

        {/* Story thread indicator */}
        {article.storyThreadId && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <svg viewBox="0 0 16 16" className="size-3 text-brand/70" fill="currentColor">
              <path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
              <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
            </svg>
            <span className="text-[10px] font-medium text-brand/60 tracking-wide">
              스토리 스레드
            </span>
            <svg viewBox="0 0 16 16" className="size-3 text-ink-muted/30" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
    </motion.button>
  );
}
