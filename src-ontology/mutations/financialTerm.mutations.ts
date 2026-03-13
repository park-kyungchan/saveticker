/** createFinancialTerm params / 금융 용어 생성 파라미터 */
export interface CreateFinancialTermParams {
  term: string;
  termKo: string;
  definition: string;
  definitionKo: string;
  category: "macro" | "equity" | "fixed-income" | "derivatives" | "crypto" | "general";
  example?: string;
  exampleKo?: string;
}

/**
 * Create a reusable financial term definition.
 * 재사용 가능한 금융 용어 정의 생성.
 */
export function createFinancialTerm(params: CreateFinancialTermParams): void {
  // TODO: persist — db.financialTerms.insert({ ...params, updatedAt: new Date() })
  throw new Error("Not implemented");
}

/** updateFinancialTerm params / 금융 용어 수정 파라미터 */
export interface UpdateFinancialTermParams {
  financialTermId: string;
  term?: string;
  termKo?: string;
  definition?: string;
  definitionKo?: string;
  category?: "macro" | "equity" | "fixed-income" | "derivatives" | "crypto" | "general";
  example?: string;
  exampleKo?: string;
}

/**
 * Update an existing financial term definition.
 * 기존 금융 용어 정의 수정.
 */
export function updateFinancialTerm(params: UpdateFinancialTermParams): void {
  // TODO: persist — db.financialTerms.patch(id, { ...provided fields, updatedAt })
  throw new Error("Not implemented");
}
