/**
 * Breaking Ticker — 속보 가로 스크롤 스트립.
 * Horizontal scrolling strip for breaking news highlights.
 */
import { motion } from "motion/react";
import { cn } from "../../../lib/cn";
import { timeAgo } from "../../../lib/timeAgo";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface BreakingTickerProps {
  articles: Doc<"newsArticles">[];
  onArticleClick?: (id: string) => void;
  className?: string;
}

/** Hash source name to accent color for visual differentiation */
const sourceAccents = [
  "bg-accent-1", "bg-accent-2", "bg-accent-3", "bg-accent-4", "bg-accent-5",
  "bg-brand", "bg-info", "bg-warning",
];

function sourceAccent(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return sourceAccents[Math.abs(hash) % sourceAccents.length];
}

export function BreakingTicker({ articles, onArticleClick, className }: BreakingTickerProps) {
  if (articles.length === 0) return null;

  return (
    <div data-label="news.breakingTicker" className={cn("space-y-2", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-0.5">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-live-dot rounded-full bg-danger" />
          <span className="relative inline-flex size-2 rounded-full bg-danger" />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-danger/90">
          속보
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-danger/20 to-transparent" />
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 snap-x snap-mandatory">
        {articles.map((article, i) => (
          <motion.button
            key={article._id}
            type="button"
            data-label={`news.breakingTicker.item[${i}]`}
            onClick={() => onArticleClick?.(article._id)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "shrink-0 snap-start",
              "w-[260px] rounded-xl border glass-panel p-3.5 text-left",
              "border-danger/10 hover:border-danger/25",
              "transition-colors duration-300",
            )}
          >
            <div className="space-y-2">
              {/* Source + time */}
              <div className="flex items-center gap-1.5">
                {article.sourceName && (
                  <>
                    <span className={cn("size-1.5 rounded-full shrink-0", sourceAccent(article.sourceName))} />
                    <span className="text-[10px] font-semibold text-danger/70">{article.sourceName}</span>
                  </>
                )}
                <span className="text-white/15">&middot;</span>
                <time className="text-[10px] text-ink-muted/50">{timeAgo(article.publishedAt)}</time>
              </div>

              {/* Title */}
              <p className="text-[13px] font-medium leading-snug text-ink line-clamp-2">
                {article.titleKo || article.title}
              </p>

              {/* Tickers row */}
              {article.mentionedTickers && article.mentionedTickers.length > 0 && (
                <div className="flex gap-1 pt-0.5">
                  {article.mentionedTickers.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="rounded bg-danger/8 px-1.5 py-px text-[9px] font-mono font-medium text-danger/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
