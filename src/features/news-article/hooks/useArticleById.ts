/** Fetch a single news article by ID. / ID로 개별 뉴스 기사를 조회합니다. */
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export function useArticleById(articleId: string | undefined) {
  return useQuery(api.queries.getArticleById, articleId ? { articleId: articleId as Id<"newsArticles"> } : "skip");
}
