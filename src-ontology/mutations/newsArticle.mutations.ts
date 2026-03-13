/** assignArticleToThread params / 기사-스레드 배정 파라미터 */
export interface AssignArticleToThreadParams {
  newsArticleId: string;
  storyThreadId: string;
  orderInThread: number;
}

/**
 * Assign a news article to a story thread with timeline position.
 * 뉴스 기사를 스토리 스레드에 타임라인 위치와 함께 배정.
 */
export function assignArticleToThread(params: AssignArticleToThreadParams): void {
  // TODO: persist — db.newsArticles.patch(id, { storyThreadId, orderInThread, updatedAt })
  throw new Error("Not implemented");
}
