/** Impact chains for a story thread. / 스토리 스레드의 영향 체인 목록. */
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export function useChainsByThread(storyThreadId?: Id<"storyThreads">) {
  return useQuery(
    api.queries.getChainsByThread,
    storyThreadId ? { storyThreadId } : "skip",
  );
}
