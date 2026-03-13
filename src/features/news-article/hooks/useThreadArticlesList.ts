/** Fetch articles belonging to a story thread. / 스토리 스레드에 속한 기사 목록을 조회합니다. */
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export function useThreadArticlesList(storyThreadId: string | undefined) {
  return useQuery(api.queries.getThreadArticlesList, storyThreadId ? { storyThreadId: storyThreadId as Id<"storyThreads"> } : "skip");
}
