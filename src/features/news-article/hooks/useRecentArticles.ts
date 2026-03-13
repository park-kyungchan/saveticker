/** Fetch the most recent news articles. / 최신 뉴스 기사를 조회합니다. */
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useRecentArticles(limit?: number) {
  return useQuery(api.queries.getRecentArticles, { limit });
}
