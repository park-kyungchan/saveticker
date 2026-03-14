/**
 * Story Thread Section — 세로 아코디언 스토리 목록.
 * Vertical accordion list with inline article timeline preview.
 */
import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "../../../lib/cn";
import { timeAgo } from "../../../lib/timeAgo";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";

interface StoryThreadSectionProps {
  threads: Doc<"storyThreads">[];
}

export function StoryThreadSection({ threads }: StoryThreadSectionProps) {
  const [expandedId, setExpandedId] = useState<Id<"storyThreads"> | null>(null);

  if (threads.length === 0) return null;

  const toggle = (id: Id<"storyThreads">) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section data-label="storyThread.section" className="space-y-2">
      {/* Section header */}
      <div data-label="storyThread.section.header" className="flex items-center gap-2">
        <svg className="size-3.5 text-brand/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.81a4.5 4.5 0 0 0-1.242-7.244l4.5-4.5a4.5 4.5 0 1 1 6.364 6.364l-1.757 1.757" />
        </svg>
        <h2 data-label="storyThread.section.title" className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-muted/70">
          스토리 흐름
        </h2>
        <span data-label="storyThread.section.count" className="text-[10px] text-ink-muted/40">{threads.length}</span>
      </div>

      {/* Accordion list */}
      <div data-label="storyThread.section.list" className="rounded-xl border glass-panel divide-y divide-white/6 overflow-hidden">
        {threads.map((thread) => (
          <ThreadAccordionItem
            key={thread._id}
            thread={thread}
            isExpanded={expandedId === thread._id}
            onToggle={() => toggle(thread._id)}
          />
        ))}
      </div>
    </section>
  );
}

function ThreadAccordionItem({
  thread,
  isExpanded,
  onToggle,
}: {
  thread: Doc<"storyThreads">;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const navigate = useNavigate();
  const articles = useQuery(api.queries.getThreadArticles, { threadId: thread._id });
  const articleCount = articles?.length ?? 0;
  const dl = `storyThread.accordion.${thread.titleKo}`;
  return (
    <div data-label={dl}>
      {/* Header row — always visible */}
      <button
        type="button"
        data-label={`${dl}.header`}
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="flex items-center gap-3 w-full text-left px-4 py-3 min-h-[48px] hover:bg-white/[0.03] transition-colors"
      >
        {/* Status dot */}
        <span data-label={`${dl}.dot`} className={cn(
          "size-2 rounded-full shrink-0",
          thread.status === "active" ? "bg-brand/60" : "bg-ink-muted/30",
        )} />

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <p data-label={`${dl}.title`} className="text-[13px] font-medium text-ink truncate">{thread.titleKo}</p>
        </div>

        {/* Count */}
        <span data-label={`${dl}.count`} className="text-[11px] text-ink-muted/50 shrink-0 tabular-nums">{articleCount}건</span>

        {/* Chevron */}
        <motion.svg
          className="size-3.5 text-ink-muted/40 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
        </motion.svg>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            data-label={`${dl}.content`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pl-9 space-y-0">
              {/* Article timeline */}
              {articles && articles.length > 0 ? (
                <div data-label={`${dl}.timeline`} className="border-l border-white/10 pl-3 space-y-0">
                  {articles.slice(0, 4).map((article, i) => (
                    <div key={article._id} data-label={`${dl}.article`} className="relative flex items-start gap-2 py-1.5">
                      <span className={cn(
                        "absolute -left-[15px] top-2.5 size-1.5 rounded-full",
                        i === 0 ? "bg-brand/60" : "bg-white/20",
                      )} />
                      <p className="text-[11px] text-ink-muted/70 leading-snug truncate flex-1" lang={article.titleKo ? "ko" : "en"}>
                        {article.titleKo || article.title}
                      </p>
                      <time className="text-[10px] text-ink-muted/30 shrink-0 tabular-nums">
                        {timeAgo(article.publishedAt)}
                      </time>
                    </div>
                  ))}
                  {articleCount > 4 && (
                    <p className="text-[10px] text-ink-muted/40 py-1">+{articleCount - 4}건</p>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-ink-muted/40 py-1">기사 로딩 중...</p>
              )}

              {/* CTA */}
              <button
                type="button"
                data-label={`${dl}.cta`}
                onClick={() => navigate(`/threads/${thread._id}`)}
                className="mt-2 text-[11px] font-medium text-brand/80 hover:text-brand transition-colors min-h-[36px] flex items-center"
              >
                스토리 전체보기 →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
