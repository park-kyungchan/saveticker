/** Fetch the explainer for a news article. / 뉴스 기사의 해설을 조회합니다. */

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export function useArticleExplainer(newsArticleId: string | undefined) {
  return useQuery(api.queries.getArticleExplainer, newsArticleId ? { newsArticleId: newsArticleId as Id<"newsArticles"> } : "skip");
}
