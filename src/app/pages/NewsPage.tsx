/**
 * 뉴스 피드 페이지 — 4탭 필터 (전체/분석/속보/Feed).
 * News feed page — 4-tab filter (All/Analysis/Breaking/Feed).
 */
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useRecentArticles } from "../../features/news-article/hooks/useRecentArticles";
import { NewsCard } from "../../features/news-article/components/NewsCard";
import { FeedSettings } from "../../features/news-article/components/FeedSettings";
import { AnimatedList } from "../../components/ui/AnimatedList";
import { FeedSkeleton } from "../../components/ui/Skeleton";
import { PageHeader } from "../../components/ui/PageHeader";
import { useFeedStore } from "../../stores/feedStore";

type FilterTab = "all" | "analysis" | "breaking" | "feed";

const TABS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "analysis", label: "분석" },
  { value: "breaking", label: "속보" },
  { value: "feed", label: "Feed" },
];

export function NewsPage() {
  const navigate = useNavigate();
  const recentArticles = useRecentArticles(20);
  const { keywords } = useFeedStore();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [feedSettingsOpen, setFeedSettingsOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!recentArticles) return undefined;
    switch (activeTab) {
      case "analysis":
        return recentArticles.filter((a) => a.category === "analysis");
      case "breaking":
        return recentArticles.filter((a) => a.category === "breaking");
      case "feed": {
        if (keywords.length === 0) return recentArticles;
        const lower = keywords.map((k) => k.toLowerCase());
        return recentArticles.filter((a) => {
          const haystack = [a.title, a.titleKo, a.summary, a.summaryKo, ...(a.tags ?? [])].join(" ").toLowerCase();
          return lower.some((kw) => haystack.includes(kw));
        });
      }
      default:
        return recentArticles;
    }
  }, [recentArticles, activeTab, keywords]);

  if (recentArticles === undefined) {
    return (
      <div data-label="news.loading" className="space-y-4 animate-in">
        <PageHeader title="뉴스" />
        <FeedSkeleton />
      </div>
    );
  }

  return (
    <div data-label="news" className="space-y-4 animate-in">
      <PageHeader title="뉴스" />

      {/* Filter tab strip */}
      <div data-label="news.tabs" className="flex gap-1.5 overflow-x-auto scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            data-label={`news.tab.${tab.value}`}
            onClick={() => setActiveTab(tab.value)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors min-h-[36px] ${
              activeTab === tab.value
                ? "bg-accent-1/20 text-accent-1"
                : "bg-white/5 text-ink-muted hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
        {/* Feed gear icon */}
        {activeTab === "feed" && (
          <button
            type="button"
            data-label="news.tab.feedSettings"
            onClick={() => setFeedSettingsOpen(true)}
            className="shrink-0 flex items-center justify-center rounded-full bg-white/5 text-ink-muted hover:bg-white/10 min-h-[36px] min-w-[36px]"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Article list */}
      {filtered && filtered.length > 0 ? (
        <AnimatedList className="flex flex-col gap-3" staggerDelay={60}>
          {filtered.map((article) => (
            <NewsCard
              key={article._id}
              article={article}
              onClick={() => navigate(`/news/${article._id}`)}
            />
          ))}
        </AnimatedList>
      ) : (
        <div data-label="news.empty" className="rounded-xl border glass-panel p-5 text-center text-sm text-ink-muted">
          {activeTab === "feed" && keywords.length > 0
            ? "일치하는 기사가 없습니다. 키워드를 수정해보세요."
            : "기사가 없습니다."}
        </div>
      )}

      <FeedSettings open={feedSettingsOpen} onClose={() => setFeedSettingsOpen(false)} />
    </div>
  );
}
