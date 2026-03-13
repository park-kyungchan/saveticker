/** FinancialTerm — Reusable financial term definition. / 재사용 가능한 금융 용어 정의. */
export interface FinancialTerm {
  readonly id: string;
  term: string;
  termKo: string;
  definition: string;
  definitionKo: string;
  category: "macro" | "equity" | "fixed-income" | "derivatives" | "crypto" | "general";
  example?: string;
  exampleKo?: string;
  updatedAt: Date;
  updatedBy?: string;
}
