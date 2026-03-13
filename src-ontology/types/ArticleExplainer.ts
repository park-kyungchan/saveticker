/** ArticleExplainer — Storytelling version of a news article. / 뉴스 기사의 스토리텔링 버전. */
export interface ArticleExplainer {
  readonly id: string;
  readonly newsArticleId: string;
  simplifiedTitle: string;
  storyBody: string;
  keyTakeaways: string[];
  analogy?: string;
  contextBefore?: string;
  contextAfter?: string;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  updatedAt: Date;
  updatedBy?: string;
}
