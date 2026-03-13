/**
 * News Card (v2) — 개선된 뉴스 피드 카드.
 * Enhanced news feed card with category-specific styling, thread indicators, and richer layout.
 */
import { motion } from "motion/react";
import { cn } from "../../../lib/cn";
import { timeAgo } from "../../../lib/timeAgo";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface NewsCardProps {
  article: Doc<"newsArticles">;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  /** Compact variant for dense lists / 밀집 리스트용 컴팩트 변형 */
  compact?: boolean;
}

const categoryConfig: Record<string, {
  label: string;
  labelColor: string;
  accentBorder: string;
  iconBg: string;
}> = {
  breaking: {
    label: "속보",
    labelColor: "text-danger",
    accentBorder: "border-l-danger/40",
    iconBg: "bg-danger/10",
  },
  analysis: {
    label: "분석",
    labelColor: "text-info",
    accentBorder: "border-l-info/30",
    iconBg: "bg-info/10",
  },
  general: {
    label: "종합",
    labelColor: "text-ink-muted",
    accentBorder: "border-l-white/10",
    iconBg: "bg-white/5",
  },
};

/** Category icon SVGs / 카테고리 아이콘 */
const CategoryIcon = ({ category }: { category: string }) => {
  if (category === "breaking") {
    return (
      <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
      </svg>
    );
  }
  if (category === "analysis") {
    return (
      <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor">
        <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor">
      <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2z" />
    </svg>
  );
};

export function NewsCard({ article, onClick, className, style, compact = false }: NewsCardProps) {
  const config = categoryConfig[article.category] ?? categoryConfig.general;
  const isBreaking = article.category === "breaking";
  const hasThread = !!article.storyThreadId;
  const recencyMs = Date.now() - article.publishedAt;

  return (
    <motion.button
      type="button"
      data-label="news.card"
      onClick={onClick}
      style={style}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative w-full overflow-hidden rounded-xl border text-left",
        "glass-panel",
        "border-l-[3px]",
        config.accentBorder,
        "hover:border-white/20 hover:bg-white/[0.04]",
        "transition-all duration-300",
        "group",
        compact ? "p-3.5" : "p-4",
        className,
      )}
    >
      {/* Recency gradient accent */}
      {recencyMs < 21600000 && (
        <div
          className={cn(
            "absolute top-0 inset-x-0 h-[2px]",
            recencyMs < 3600000
              ? "bg-gradient-to-r from-danger/60 via-warning/40 to-transparent"
              : "bg-gradient-to-r from-brand/40 via-accent-1/30 to-transparent",
          )}
        />
      )}

      <div className="flex gap-3">
        {/* Left: category icon capsule */}
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg",
            config.iconBg,
            config.labelColor,
            compact ? "size-8" : "size-9",
          )}
        >
          <CategoryIcon category={article.category} />
        </div>

        {/* Right: content */}
        <div className="min-w-0 flex-1 space-y-1.5">
          {/* Category label + time */}
          <div className="flex items-center gap-2">
            {isBreaking && (
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-live-dot rounded-full bg-danger" />
                <span className="relative inline-flex size-1.5 rounded-full bg-danger" />
              </span>
            )}
            <span className={cn("text-[10px] font-semibold uppercase tracking-[0.06em]", config.labelColor)}>
              {config.label}
            </span>
            <span className="text-white/15">·</span>
            <time
              className="text-[10px] text-ink-muted/60"
              dateTime={new Date(article.publishedAt).toISOString()}
            >
              {timeAgo(article.publishedAt)}
            </time>
            {article.sourceName && (
              <>
                <span className="text-white/15">·</span>
                <span className="text-[10px] text-ink-muted/50 truncate">
                  {article.sourceName}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <p className={cn(
            "font-medium text-ink leading-snug group-hover:text-white transition-colors duration-200",
            compact ? "text-[13px] line-clamp-2" : "text-sm line-clamp-2",
          )}>
            {article.titleKo || article.title}
          </p>

          {/* Summary — hidden in compact */}
          {!compact && (
            <p className="text-[12px] leading-relaxed text-ink-muted/70 line-clamp-2">
              {article.summaryKo || article.summary}
            </p>
          )}

          {/* Bottom: tickers + thread indicator */}
          <div className="flex items-center gap-2 pt-0.5">
            {/* Tickers */}
            {article.mentionedTickers && article.mentionedTickers.length > 0 && (
              <div className="flex items-center gap-1">
                {article.mentionedTickers.slice(0, 3).map((ticker) => (
                  <span
                    key={ticker}
                    className="inline-flex rounded bg-white/[0.05] px-1.5 py-px text-[9px] font-mono font-medium text-accent-1/70 tracking-wider"
                  >
                    {ticker}
                  </span>
                ))}
                {article.mentionedTickers.length > 3 && (
                  <span className="text-[9px] text-ink-muted/40">
                    +{article.mentionedTickers.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Thread link */}
            {hasThread && (
              <div className="ml-auto flex items-center gap-1">
                <div className="size-1 rounded-full bg-brand/50" />
                <span className="text-[9px] font-medium text-brand/50">스레드</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
