/**
 * News article feed card — category badge, title, summary, source, and ticker badges.
 * 뉴스 기사 피드 카드 — 카테고리 배지, 제목, 요약, 출처, 티커 뱃지.
 */
import { motion } from "motion/react";
import { cn } from "../../../lib/cn";
import { recipes } from "../../../theme/recipes";
import { timeAgo } from "../../../lib/timeAgo";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface NewsCardProps {
  /** News article document / 뉴스 기사 문서 */
  article: Doc<"newsArticles">;
  /** Click handler / 클릭 핸들러 */
  onClick?: () => void;
  /** Additional class names / 추가 클래스 */
  className?: string;
  /** Inline styles (e.g. animationDelay for stagger) / 인라인 스타일 */
  style?: React.CSSProperties;
}

/** Category badge variant map / 카테고리 배지 변형 맵 */
const categoryBadge: Record<string, { label: string; style: string }> = {
  general: { label: "종합", style: "bg-white/10 text-ink" },
  breaking: { label: "속보", style: "bg-danger/15 text-danger" },
  analysis: { label: "분석", style: "bg-info/15 text-info" },
};

export function NewsCard({ article, onClick, className, style }: NewsCardProps) {
  const badge = categoryBadge[article.category] ?? categoryBadge.general;

  return (
    <motion.button
      type="button"
      data-label="news.card"
      onClick={onClick}
      style={style}
      whileTap={{ scale: 0.98 }}
      className={cn(
        recipes.card.base,
        recipes.card.hover,
        "card-lift",
        "flex w-full gap-3 text-left",
        "min-h-[44px]",
        className,
      )}
    >
      {/* Content column */}
      <div data-label="news.card.content" className="flex min-w-0 flex-1 flex-col gap-1.5">
        {/* Category badge */}
        <span
          data-label="news.card.category"
          className={cn(
            "inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase",
            badge.style,
          )}
        >
          {badge.label}
        </span>

        {/* Title */}
        <p
          data-label="news.card.title"
          className="line-clamp-2 text-sm font-medium text-ink"
        >
          {article.titleKo || article.title}
        </p>

        {/* Summary */}
        <p
          data-label="news.card.summary"
          className="line-clamp-2 text-xs text-ink-muted"
        >
          {article.summaryKo || article.summary}
        </p>

        {/* Mentioned tickers */}
        {article.mentionedTickers && article.mentionedTickers.length > 0 && (
          <div data-label="news.card.tickers" className="flex flex-wrap gap-1">
            {article.mentionedTickers.slice(0, 3).map((ticker) => (
              <span
                key={ticker}
                className="inline-flex items-center rounded bg-white/8 px-1.5 py-0.5 text-[10px] font-mono text-ink-muted"
              >
                {ticker}
              </span>
            ))}
            {article.mentionedTickers.length > 3 && (
              <span className="text-[10px] text-ink-muted">
                +{article.mentionedTickers.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer: source + time */}
        <div data-label="news.card.footer" className="mt-1 flex items-center gap-2 text-xs text-ink-muted">
          {article.sourceName && (
            <span data-label="news.card.source">{article.sourceName}</span>
          )}
          {article.sourceName && (
            <span className="text-white/40">·</span>
          )}
          <time data-label="news.card.time" dateTime={new Date(article.publishedAt).toISOString()}>
            {timeAgo(article.publishedAt)}
          </time>
        </div>
      </div>
    </motion.button>
  );
}
