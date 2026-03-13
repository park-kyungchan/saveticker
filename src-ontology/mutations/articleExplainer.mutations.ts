/** createArticleExplainer params / 기사 설명 생성 파라미터 */
export interface CreateArticleExplainerParams {
  newsArticleId: string;
  simplifiedTitle: string;
  storyBody: string;
  keyTakeaways: string[];
  analogy?: string;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  contextBefore?: string;
  contextAfter?: string;
}

/**
 * Create storytelling explainer for a news article.
 * 뉴스 기사용 스토리텔링 설명 생성.
 */
export function createArticleExplainer(params: CreateArticleExplainerParams): void {
  // TODO: persist — db.articleExplainers.insert({ ...params, updatedAt: new Date() })
  throw new Error("Not implemented");
}

/** updateArticleExplainer params / 기사 설명 수정 파라미터 */
export interface UpdateArticleExplainerParams {
  articleExplainerId: string;
  simplifiedTitle?: string;
  storyBody?: string;
  keyTakeaways?: string[];
  analogy?: string;
  difficultyLevel?: "beginner" | "intermediate" | "advanced";
  contextBefore?: string;
  contextAfter?: string;
}

/**
 * Update an existing article explainer.
 * 기존 기사 설명 수정.
 */
export function updateArticleExplainer(params: UpdateArticleExplainerParams): void {
  // TODO: persist — db.articleExplainers.patch(id, { ...provided fields, updatedAt })
  throw new Error("Not implemented");
}
