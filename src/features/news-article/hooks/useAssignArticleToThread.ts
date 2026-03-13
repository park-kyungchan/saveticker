/** Assign a news article to a story thread. / 뉴스 기사를 스토리 스레드에 할당합니다. */
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useAssignArticleToThread() {
  return useMutation(api.mutations.assignArticleToThread);
}
