/**
 * Breaking Ticker — 속보 자동 마퀴 티커.
 * Auto-scrolling marquee ticker for breaking news headlines.
 * CSS-only animation, pauses on hover/touch, click navigates.
 */
import { cn } from "../../../lib/cn";
import { timeAgo } from "../../../lib/timeAgo";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface BreakingTickerProps {
  articles: Doc<"newsArticles">[];
  onArticleClick?: (id: string) => void;
  className?: string;
}

function TickerItem({
  article,
  onClick,
}: {
  article: Doc<"newsArticles">;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      data-label="news.breakingTicker.item"
      onClick={onClick}
      className="flex items-center gap-2 shrink-0 whitespace-nowrap text-left group"
    >
      <span data-label="news.breakingTicker.item.title" className="text-[12px] font-medium text-ink group-hover:text-danger/90 transition-colors line-clamp-1" lang={article.titleKo ? "ko" : "en"}>
        {article.titleKo || article.title}
      </span>
      {article.sourceName && (
        <span data-label="news.breakingTicker.item.source" className="text-[10px] text-ink-muted/40">{article.sourceName}</span>
      )}
      <time data-label="news.breakingTicker.item.time" className="text-[10px] text-ink-muted/30">{timeAgo(article.publishedAt)}</time>
    </button>
  );
}

function TickerSeparator() {
  return <span className="text-danger/30 text-[10px] shrink-0" aria-hidden="true">●</span>;
}

export function BreakingTicker({ articles, onArticleClick, className }: BreakingTickerProps) {
  if (articles.length === 0) return null;

  const items = articles.flatMap((article, i) => [
    ...(i > 0 ? [<TickerSeparator key={`sep-${i}`} />] : []),
    <TickerItem
      key={article._id}
      article={article}
      onClick={() => onArticleClick?.(article._id)}
    />,
  ]);

  return (
    <div data-label="news.breakingTicker" className={cn("space-y-2", className)}>
      {/* Header */}
      <div data-label="news.breakingTicker.header" className="flex items-center gap-2 px-0.5">
        <span data-label="news.breakingTicker.liveDot" className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-live-dot rounded-full bg-danger" />
          <span className="relative inline-flex size-2 rounded-full bg-danger" />
        </span>
        <span data-label="news.breakingTicker.title" className="text-[11px] font-bold uppercase tracking-[0.1em] text-danger/90">
          속보
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-danger/20 to-transparent" />
      </div>

      {/* Marquee track */}
      <div
        data-label="news.breakingTicker.track"
        role="marquee"
        aria-label="속보 뉴스"
        className="marquee-track marquee-paused rounded-lg border border-danger/10 glass-panel py-2.5 px-1"
      >
        <div className="marquee-content">
          {items}
        </div>
        <div className="marquee-content" aria-hidden="true">
          {items}
        </div>
      </div>
    </div>
  );
}
