/**
 * 뉴스 기사 상세 페이지 — 원본(EN) / 한국어 / StoryTelling 3탭.
 * News article detail page — 3-tab: Original, Korean, StoryTelling.
 */
import { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useArticleById } from "../hooks/useArticleById";
import { useArticleExplainer } from "../../explainer/hooks/useArticleExplainer";
import { NewsDetail } from "../components/NewsDetail";
import { KoreanTab } from "../components/KoreanTab";
import { StoryTellingTab } from "../components/StoryTellingTab";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Tabs } from "../../../components/ui/Tabs";
import { Spinner } from "../../../components/ui/Spinner";

const TAB_ITEMS = [
  { value: "original", label: "원본 (EN)" },
  { value: "korean", label: "한국어" },
  { value: "storytelling", label: "StoryTelling" },
];

export function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const article = useArticleById(id);
  const explainer = useArticleExplainer(id);
  const incrementView = useMutation(api.mutations.incrementViewCount);
  const viewedRef = useRef<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("view") || "original";
  const setActiveTab = (tab: string) => {
    setSearchParams((p) => { p.set("view", tab); return p; }, { replace: true });
  };

  // Increment view count once per article visit
  useEffect(() => {
    if (article && article._id && viewedRef.current !== article._id) {
      viewedRef.current = article._id;
      incrementView({ articleId: article._id });
    }
  }, [article, incrementView]);

  if (article === undefined) {
    return (
      <div data-label="newsDetail.loading" className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (article === null) {
    return (
      <div data-label="newsDetail.notFound" className="space-y-4 animate-in">
        <PageHeader title="기사를 찾을 수 없습니다" showBack />
      </div>
    );
  }

  return (
    <div data-label="newsDetail" className="space-y-4 animate-in">
      <PageHeader title={article.titleKo || article.title} showBack />

      <Tabs items={TAB_ITEMS} value={activeTab} onChange={setActiveTab} ariaLabel="기사 보기 모드" />

      {activeTab === "original" && <NewsDetail article={article} />}
      {activeTab === "korean" && <KoreanTab article={article} />}
      {activeTab === "storytelling" && <StoryTellingTab article={article} explainer={explainer} />}
    </div>
  );
}
