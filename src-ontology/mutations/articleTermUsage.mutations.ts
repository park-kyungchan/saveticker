/** createArticleTermUsage params / 기사 용어 사용 생성 파라미터 */
export interface CreateArticleTermUsageParams {
  newsArticleId: string;
  termId: string;
  sentenceContext: string;
  positionInArticle: number;
}

/**
 * Link a financial term occurrence to an article.
 * 기사에 금융 용어 사용 위치 연결.
 */
export function createArticleTermUsage(params: CreateArticleTermUsageParams): void {
  // TODO: persist — db.articleTermUsages.insert(params)
  throw new Error("Not implemented");
}
