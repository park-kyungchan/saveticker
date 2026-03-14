/**
 * Story Thread Detail Page — 스레드 상세 타임라인.
 * Vertical timeline showing all articles in a thread.
 */
import { useParams, useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Badge } from "../../../components/ui/Badge";
import { Spinner } from "../../../components/ui/Spinner";
import { cn } from "../../../lib/cn";
import { timeAgo } from "../../../lib/timeAgo";
import { motion } from "motion/react";
import type { Id } from "../../../../convex/_generated/dataModel";
import { ImpactChainSection } from "../../impact-chain/components/ImpactChainSection";

const categoryConfig: Record<string, { label: string; color: string }> = {
  breaking: { label: "속보", color: "text-danger" },
  analysis: { label: "분석", color: "text-info" },
  general: { label: "종합", color: "text-ink-muted" },
};

export function StoryThreadPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const thread = useQuery(
    api.queries.getThreadById,
    id ? { threadId: id as Id<"storyThreads"> } : "skip",
  );
  const articles = useQuery(
    api.queries.getThreadArticles,
    id ? { threadId: id as Id<"storyThreads"> } : "skip",
  );

  if (thread === undefined || articles === undefined) {
    return (
      <div className="space-y-4">
        <PageHeader title="스토리" showBack />
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (thread === null) {
    return (
      <div className="space-y-4">
        <PageHeader title="스토리" showBack />
        <div className="rounded-xl border glass-panel p-6 text-center">
          <p className="text-sm text-ink-muted">스레드를 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  const statusLabel = thread.status === "active" ? "진행 중" : "완결";
  const statusVariant = thread.status === "active" ? "info" : "success";

  return (
    <div data-label="storyThread.page" className="space-y-5 animate-in">
      <PageHeader title="스토리" showBack />

      {/* Thread header */}
      <div className="rounded-xl border glass-panel p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant={statusVariant}>{statusLabel}</Badge>
          <span className="text-[10px] text-ink-muted/60">{articles.length}건의 기사</span>
        </div>
        <h2 className="text-lg font-medium text-ink leading-snug">
          {thread.titleKo}
        </h2>
        {thread.descriptionKo && (
          <p className="text-sm text-ink-muted/80 leading-relaxed">
            {thread.descriptionKo}
          </p>
        )}
      </div>

      {/* Vertical timeline */}
      <div data-label="storyThread.timeline" className="relative pl-6">
        {/* Vertical line */}
        <div className="absolute left-[9px] top-2 bottom-2 w-px bg-white/10" />

        <div className="space-y-4">
          {articles.map((article, i) => {
            const config = categoryConfig[article.category] ?? categoryConfig.general;
            return (
              <motion.button
                key={article._id}
                type="button"
                data-label="storyThread.timeline.item"
                onClick={() => navigate(`/news/${article._id}`)}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative w-full text-left rounded-xl border glass-panel p-4",
                  "hover:border-white/20 hover:bg-white/[0.04]",
                  "transition-all duration-300",
                )}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Timeline dot */}
                <span
                  className={cn(
                    "absolute -left-[15px] top-5 size-[10px] rounded-full border-2",
                    i === 0
                      ? "bg-brand border-brand/60"
                      : "bg-surface border-white/20",
                  )}
                />

                {/* Date + category */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={cn("text-[10px] font-semibold uppercase tracking-[0.06em]", config.color)}>
                    {config.label}
                  </span>
                  <span className="text-white/15">·</span>
                  <time className="text-[10px] text-ink-muted/60">
                    {timeAgo(article.publishedAt)}
                  </time>
                  {article.sourceName && (
                    <>
                      <span className="text-white/15">·</span>
                      <span className="text-[10px] text-ink-muted/50">{article.sourceName}</span>
                    </>
                  )}
                </div>

                {/* Title */}
                <p className="text-sm font-medium text-ink leading-snug">
                  {article.titleKo || article.title}
                </p>

                {/* Summary */}
                <p className="mt-1 text-[12px] text-ink-muted/70 line-clamp-2 leading-relaxed">
                  {article.summaryKo || article.summary}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Impact chains (PM Feature 3) */}
      <ImpactChainSection threadId={id as Id<"storyThreads">} />
    </div>
  );
}
