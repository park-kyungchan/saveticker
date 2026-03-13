/**
 * 홈 페이지 — 스토리 스레드와 최신 뉴스 피드.
 * Home page — story threads and latest news feed.
 */
import { useNavigate } from "react-router";
import { useRecentArticles } from "../../features/news-article/hooks/useRecentArticles";
import { useThreadsByStatus } from "../../features/story-thread/hooks/useThreadsByStatus";
import { NewsCard } from "../../features/news-article/components/NewsCard";
import { ThreadCard } from "../../features/story-thread/components/ThreadCard";
import { AnimatedList } from "../../components/ui/AnimatedList";
import { FeedSkeleton } from "../../components/ui/Skeleton";
import { PageHeader } from "../../components/ui/PageHeader";
import { recipes } from "../../theme/recipes";

export function HomePage() {
  const navigate = useNavigate();
  const recentArticles = useRecentArticles(10);
  const activeThreads = useThreadsByStatus("active");

  /** Loading state — query still pending. / 로딩 상태 — 쿼리 대기 중. */
  if (recentArticles === undefined) {
    return (
      <div data-label="home.loading" className="space-y-4 animate-in">
        <PageHeader title="SaveTicker" />
        <FeedSkeleton />
      </div>
    );
  }

  return (
    <div data-label="home" className="space-y-6 animate-in">
      <PageHeader title="SaveTicker" />

      {/* Story threads — quick access to narrative experience */}
      {activeThreads && activeThreads.length > 0 && (
        <section data-label="home.threads">
          <h2 data-label="home.threads.title" className={recipes.sectionTitle}>
            스토리 스레드
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {activeThreads.map((thread, i) => (
              <ThreadCard
                key={thread._id}
                thread={thread}
                onClick={() => navigate(`/threads/${thread._id}`)}
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recent news / 최신 뉴스 */}
      <section data-label="home.recent">
        <h2 data-label="home.recent.title" className={recipes.sectionTitle}>
          최신 뉴스
        </h2>
        <AnimatedList className="mt-3 flex flex-col gap-3" staggerDelay={60}>
          {recentArticles.map((article) => (
            <NewsCard
              key={article._id}
              article={article}
              onClick={() => navigate(`/news/${article._id}`)}
            />
          ))}
        </AnimatedList>
      </section>
    </div>
  );
}
