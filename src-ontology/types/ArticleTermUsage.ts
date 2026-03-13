/** ArticleTermUsage — Term occurrence in article with sentence context. / 기사 내 용어 등장 위치. */
export interface ArticleTermUsage {
  readonly id: string;
  readonly newsArticleId: string;
  readonly termId: string;
  sentenceContext: string;
  positionInArticle: number;
}
