/**
 * Full news article detail view — category, title, source, body.
 * 뉴스 기사 상세 뷰 — 카테고리, 제목, 출처, 본문.
 */
import { cn } from "../../../lib/cn";
import { recipes } from "../../../theme/recipes";
import { timeAgo } from "../../../lib/timeAgo";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface NewsDetailProps {
  /** News article document / 뉴스 기사 문서 */
  article: Doc<"newsArticles">;
  /** Additional class names / 추가 클래스 */
  className?: string;
}

/** Category badge variant map / 카테고리 배지 변형 맵 */
const categoryBadge: Record<string, { label: string; style: string }> = {
  general: { label: "종합", style: "bg-white/10 text-ink" },
  breaking: { label: "속보", style: "bg-danger/15 text-danger" },
  analysis: { label: "분석", style: "bg-info/15 text-info" },
};

/**
 * Format timestamp to localized date string.
 * 타임스탬프를 로컬 날짜 문자열로 변환합니다.
 */
function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function NewsDetail({ article, className }: NewsDetailProps) {
  const badge = categoryBadge[article.category] ?? categoryBadge.general;

  return (
    <article
      data-label="news.detail"
      className={cn(recipes.card.base, "glass-panel animate-in space-y-5", className)}
    >
      {/* Category + title */}
      <div data-label="news.detail.header" className="space-y-2">
        <span
          data-label="news.detail.category"
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase",
            badge.style,
          )}
        >
          {badge.label}
        </span>
        <h1
          data-label="news.detail.title"
          className="text-lg font-medium leading-snug text-ink"
          lang="en"
        >
          {article.title}
        </h1>
      </div>

      {/* Source attribution */}
      <div data-label="news.detail.source" className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
        {article.sourceName && (
          <span data-label="news.detail.sourceName" className="font-medium text-ink">
            {article.sourceName}
          </span>
        )}
        {article.sourceUrl && (
          <a
            data-label="news.detail.sourceUrl"
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-1 underline-offset-2 hover:underline"
          >
            원문 보기
          </a>
        )}
        <span className="text-white/40">·</span>
        <time data-label="news.detail.time" dateTime={new Date(article.publishedAt).toISOString()}>
          {formatDate(article.publishedAt)} ({timeAgo(article.publishedAt)})
        </time>
      </div>

      {/* Mentioned tickers badges */}
      {article.mentionedTickers && article.mentionedTickers.length > 0 && (
        <div data-label="news.detail.tickers" className="flex flex-wrap gap-1.5">
          {article.mentionedTickers.map((ticker) => (
            <span
              key={ticker}
              className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-mono text-ink-muted"
            >
              {ticker}
            </span>
          ))}
        </div>
      )}

      {/* Body — plain text */}
      <div
        data-label="news.detail.body"
        className="whitespace-pre-wrap text-sm leading-relaxed text-ink/90"
        lang="en"
      >
        {article.body}
      </div>
    </article>
  );
}
