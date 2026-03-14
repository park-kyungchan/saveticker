/**
 * Hook: articles in a story thread, ordered by position.
 * 스레드 내 기사 목록 (순서대로).
 */
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export function useThreadArticles(threadId: Id<"storyThreads">) {
  return useQuery(api.queries.getThreadArticles, { threadId });
}
