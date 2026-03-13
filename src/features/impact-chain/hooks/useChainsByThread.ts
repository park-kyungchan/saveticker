/** Fetch impact chains for a story thread. / 스토리 스레드의 임팩트 체인 조회. */

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export function useChainsByThread(storyThreadId: string | undefined) {
  return useQuery(
    api.queries.getChainsByThread,
    storyThreadId ? { storyThreadId: storyThreadId as Id<"storyThreads"> } : "skip",
  );
}
