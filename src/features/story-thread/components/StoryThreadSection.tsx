/**
 * Story Thread Section — 뉴스 피드 상단 가로 스크롤 스트립.
 * Horizontal scrolling thread cards above the news feed.
 */
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { StoryThreadCard } from "./StoryThreadCard";
import type { Doc} from "../../../../convex/_generated/dataModel";

interface StoryThreadSectionProps {
  threads: Doc<"storyThreads">[];
}

export function StoryThreadSection({ threads }: StoryThreadSectionProps) {
  const navigate = useNavigate();

  if (threads.length === 0) return null;

  return (
    <section data-label="storyThread.section" className="space-y-2">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <svg className="size-3.5 text-brand/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.81a4.5 4.5 0 0 0-1.242-7.244l4.5-4.5a4.5 4.5 0 1 1 6.364 6.364l-1.757 1.757" />
        </svg>
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-muted/70">
          스토리 흐름
        </h2>
        <span className="text-[10px] text-ink-muted/40">{threads.length}</span>
      </div>

      {/* Horizontal scroll strip */}
      <div role="region" aria-label="스토리 스레드 목록" className="flex gap-3 overflow-x-auto scrollbar-none -mx-4 px-4 pb-1">
        {threads.map((thread) => (
          <ThreadCardWithArticles
            key={thread._id}
            thread={thread}
            onNavigate={() => navigate(`/threads/${thread._id}`)}
          />
        ))}
      </div>
    </section>
  );
}

/** Wrapper that fetches article titles for each thread card */
function ThreadCardWithArticles({
  thread,
  onNavigate,
}: {
  thread: Doc<"storyThreads">;
  onNavigate: () => void;
}) {
  const articles = useQuery(api.queries.getThreadArticles, { threadId: thread._id });

  return (
    <StoryThreadCard
      thread={thread}
      articleCount={articles?.length ?? 0}
      articleTitles={(articles ?? []).map((a) => a.titleKo || a.title)}
      onClick={onNavigate}
    />
  );
}
