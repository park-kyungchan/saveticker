/**
 * 뉴스 피드 페이지 — 최신 뉴스 목록.
 * News feed page — latest news articles list.
 */
import { useNavigate } from "react-router";
import { useRecentArticles } from "../../features/news-article/hooks/useRecentArticles";
import { NewsCard } from "../../features/news-article/components/NewsCard";
import { AnimatedList } from "../../components/ui/AnimatedList";
import { FeedSkeleton } from "../../components/ui/Skeleton";
import { PageHeader } from "../../components/ui/PageHeader";

export function NewsPage() {
  const navigate = useNavigate();
  const recentArticles = useRecentArticles(20);

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
      <AnimatedList className="flex flex-col gap-3" staggerDelay={60}>
        {recentArticles.map((article) => (
          <NewsCard
            key={article._id}
            article={article}
            onClick={() => navigate(`/news/${article._id}`)}
          />
        ))}
      </AnimatedList>
    </div>
  );
}
