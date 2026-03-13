/**
 * @deprecated Route `/` uses NewsPage, not HomePage. Retained for reference only.
 * 홈 페이지 — 최신 뉴스 피드.
 * Home page — latest news feed.
 */
import { useNavigate } from "react-router";
import { useRecentArticles } from "../../features/news-article/hooks/useRecentArticles";
import { NewsCard } from "../../features/news-article/components/NewsCard";
import { AnimatedList } from "../../components/ui/AnimatedList";
import { FeedSkeleton } from "../../components/ui/Skeleton";
import { PageHeader } from "../../components/ui/PageHeader";
import { recipes } from "../../theme/recipes";

/** @deprecated Route `/` uses NewsPage, not HomePage. */
export function HomePage() {
  const navigate = useNavigate();
  const recentArticles = useRecentArticles(10);

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
