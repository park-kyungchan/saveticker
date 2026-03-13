/**
 * 뉴스 피드 페이지 v2 — Hero + Breaking Ticker + Tag Filter + Thread Banners.
 * Dramatically redesigned news feed with layered visual hierarchy.
 */
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useRecentArticles } from "../../features/news-article/hooks/useRecentArticles";
import { useThreadsByStatus } from "../../features/story-thread/hooks/useThreadsByStatus";
import { useThreadArticlesList } from "../../features/news-article/hooks/useThreadArticlesList";
import { HeroNewsCard } from "../../features/news-article/components/HeroNewsCard";
import { NewsCard } from "../../features/news-article/components/NewsCard";
import { BreakingTicker } from "../../features/news-article/components/BreakingTicker";
import { TagFilterStrip } from "../../features/news-article/components/TagFilterStrip";
import { StoryThreadBanner } from "../../features/news-article/components/StoryThreadBanner";
import { FeedSettings } from "../../features/news-article/components/FeedSettings";
import { AnimatedList } from "../../components/ui/AnimatedList";
import { FeedSkeleton } from "../../components/ui/Skeleton";
import { useFeedStore } from "../../stores/feedStore";

type FilterTab = "all" | "analysis" | "breaking" | "feed";

const TABS: { value: FilterTab; label: string; icon?: string }[] = [
  { value: "all", label: "전체" },
  { value: "analysis", label: "분석" },
  { value: "breaking", label: "속보" },
  { value: "feed", label: "맞춤" },
];

export function NewsPage() {
  const navigate = useNavigate();
  const recentArticles = useRecentArticles(20);
  const activeThreads = useThreadsByStatus("active");
  const { keywords } = useFeedStore();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [feedSettingsOpen, setFeedSettingsOpen] = useState(false);

  // Extract unique tags from articles
  const allTags = useMemo(() => {
    if (!recentArticles) return [];
    const tagSet = new Set<string>();
    recentArticles.forEach((a) => a.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [recentArticles]);

  // Filter articles
  const { heroArticle, breakingArticles, feedArticles } = useMemo(() => {
    if (!recentArticles) return { heroArticle: null, breakingArticles: [], feedArticles: [] };

    let filtered = recentArticles;

    // Tab filter
    switch (activeTab) {
      case "analysis":
        filtered = filtered.filter((a) => a.category === "analysis");
        break;
      case "breaking":
        filtered = filtered.filter((a) => a.category === "breaking");
        break;
      case "feed": {
        if (keywords.length > 0) {
          const lower = keywords.map((k) => k.toLowerCase());
          filtered = filtered.filter((a) => {
            const haystack = [a.title, a.titleKo, a.summary, a.summaryKo, ...(a.tags ?? [])].join(" ").toLowerCase();
            return lower.some((kw) => haystack.includes(kw));
          });
        }
        break;
      }
    }

    // Tag filter
    if (activeTag) {
      filtered = filtered.filter((a) => a.tags?.includes(activeTag));
    }

    // Separate hero (first item), breaking, and rest
    const breaking = filtered.filter((a) => a.category === "breaking");
    const hero = filtered[0] ?? null;
    const rest = filtered.slice(1);

    return {
      heroArticle: hero,
      breakingArticles: activeTab === "all" ? breaking.slice(0, 5) : [],
      feedArticles: rest,
    };
  }, [recentArticles, activeTab, activeTag, keywords]);

  // Loading state
  if (recentArticles === undefined) {
    return (
      <div data-label="news.loading" className="space-y-4 animate-in">
        <NewsHeader />
        <FeedSkeleton />
      </div>
    );
  }

  return (
    <div data-label="news" className="space-y-5 animate-in">
      {/* Header */}
      <NewsHeader />

      {/* Tab strip */}
      <div data-label="news.tabs" className="flex items-center gap-1.5">
        <div className="flex gap-1 flex-1 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              data-label={`news.tab.${tab.value}`}
              onClick={() => {
                setActiveTab(tab.value);
                setActiveTag(null);
              }}
              className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-semibold transition-all min-h-[34px] ${
                activeTab === tab.value
                  ? "bg-white/12 text-ink border border-white/15 shadow-sm"
                  : "text-ink-muted/60 hover:text-ink-muted hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feed settings gear */}
        {activeTab === "feed" && (
          <button
            type="button"
            data-label="news.tab.feedSettings"
            onClick={() => setFeedSettingsOpen(true)}
            className="shrink-0 flex items-center justify-center rounded-full bg-white/5 text-ink-muted hover:bg-white/10 size-[34px]"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Tag filter strip */}
      {allTags.length > 0 && activeTab !== "feed" && (
        <TagFilterStrip
          tags={allTags}
          activeTag={activeTag}
          onTagChange={setActiveTag}
        />
      )}

      {/* Story thread banners — only on "all" tab */}
      {activeTab === "all" && activeThreads && activeThreads.length > 0 && !activeTag && (
        <div className="space-y-2">
          {activeThreads.map((thread) => (
            <ThreadBannerWithCount
              key={thread._id}
              thread={thread}
              onClick={() => navigate(`/threads/${thread._id}`)}
            />
          ))}
        </div>
      )}

      {/* Breaking ticker — only on "all" tab */}
      {activeTab === "all" && breakingArticles.length > 0 && !activeTag && (
        <BreakingTicker
          articles={breakingArticles}
          onArticleClick={(id) => navigate(`/news/${id}`)}
        />
      )}

      {/* Hero card */}
      {heroArticle && (
        <HeroNewsCard
          article={heroArticle}
          onClick={() => navigate(`/news/${heroArticle._id}`)}
        />
      )}

      {/* Feed list */}
      {feedArticles.length > 0 ? (
        <div className="space-y-1.5">
          {/* Section header for non-"all" tabs */}
          {activeTab !== "all" && (
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-ink-muted/50 px-0.5 pb-1">
              {activeTab === "analysis" ? "분석 리포트" : activeTab === "breaking" ? "최신 속보" : "맞춤 피드"} · {feedArticles.length}건
            </p>
          )}

          <AnimatedList className="flex flex-col gap-2" staggerDelay={50}>
            {feedArticles.map((article) => (
              <NewsCard
                key={article._id}
                article={article}
                onClick={() => navigate(`/news/${article._id}`)}
              />
            ))}
          </AnimatedList>
        </div>
      ) : heroArticle === null ? (
        <div data-label="news.empty" className="rounded-xl border glass-panel p-8 text-center">
          <div className="space-y-2">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border glass-panel" aria-hidden="true">
              <svg className="size-5 text-ink-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6V7.5z" />
              </svg>
            </div>
            <p className="text-sm text-ink-muted/60">
              {activeTab === "feed" && keywords.length > 0
                ? "일치하는 기사가 없습니다"
                : "표시할 기사가 없습니다"}
            </p>
          </div>
        </div>
      ) : (
        <div data-label="news.emptyFeed" className="rounded-xl border glass-panel p-5 text-center">
          <p className="text-xs text-ink-muted/50">더 이상 기사가 없습니다</p>
        </div>
      )}

      <FeedSettings open={feedSettingsOpen} onClose={() => setFeedSettingsOpen(false)} />
    </div>
  );
}

/** News page header with branded logo treatment */
function NewsHeader() {
  return (
    <div data-label="news.header" className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        {/* Logo mark */}
        <div className="flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-brand/80 to-accent-1/60 shadow-sm">
          <svg viewBox="0 0 20 20" className="size-4 text-white" fill="currentColor">
            <path fillRule="evenodd" d="M5.5 2A3.5 3.5 0 0 0 2 5.5v2.879a2.5 2.5 0 0 0 .732 1.767l6.5 6.5a2.5 2.5 0 0 0 3.536 0l2.878-2.878a2.5 2.5 0 0 0 0-3.536l-6.5-6.5A2.5 2.5 0 0 0 7.379 2H5.5zM6 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h1 className="text-[17px] font-display font-medium tracking-tight text-ink">
            뉴스
          </h1>
        </div>
      </div>

      {/* Right: live indicator */}
      <div className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/8 px-2.5 py-1">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-live-dot rounded-full bg-success" />
          <span className="relative inline-flex size-1.5 rounded-full bg-success" />
        </span>
        <span className="text-[10px] font-medium text-ink-muted/60">실시간</span>
      </div>
    </div>
  );
}

/** Thread banner with article count from hook */
import type { Doc } from "../../../convex/_generated/dataModel";

function ThreadBannerWithCount({ thread, onClick }: { thread: Doc<"storyThreads">; onClick: () => void }) {
  const articles = useThreadArticlesList(thread._id);
  return (
    <StoryThreadBanner
      thread={thread}
      articleCount={articles?.length}
      onClick={onClick}
    />
  );
}
