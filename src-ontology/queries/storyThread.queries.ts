import type { StoryThread, NewsArticle } from "../types/index.js";

/**
 * Active or completed threads.
 * 활성 또는 완료된 스레드.
 * @queryType filter
 */
export function threadsByStatus(params: { status?: string }): StoryThread[] {
  // TODO: persist — optional filter by status
  throw new Error("Not implemented");
}

/**
 * Articles in a story thread, ordered by orderInThread.
 * 스토리 스레드 내 기사, orderInThread 순.
 * @queryType filter
 */
export function threadArticlesList(params: { storyThreadId: string }): NewsArticle[] {
  // TODO: persist — filter by storyThreadId, order by orderInThread asc
  throw new Error("Not implemented");
}
