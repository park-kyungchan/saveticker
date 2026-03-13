/** Fetch a single story thread by ID. / ID로 단일 스토리 스레드를 조회합니다. */

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export function useThreadById(storyThreadId: string | undefined) {
  return useQuery(api.queries.getThreadById, storyThreadId ? { storyThreadId: storyThreadId as Id<"storyThreads"> } : "skip");
}
