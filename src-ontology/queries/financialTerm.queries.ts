import type { FinancialTerm } from "../types/index.js";

/**
 * Terms by category or all terms alphabetical.
 * 카테고리별 또는 전체 용어 사전순.
 * @queryType filter
 */
export function glossaryByCategory(params: { category?: string }): FinancialTerm[] {
  // TODO: persist — optional filter by category
  throw new Error("Not implemented");
}

/**
 * Term/termKo prefix search for glossary search bar.
 * 용어집 검색바용 용어 접두어 검색.
 * @queryType search
 */
export function searchTerms(params: { query: string; limit?: number }): FinancialTerm[] {
  // TODO: persist — search by term startsWith/contains
  throw new Error("Not implemented");
}

/**
 * Single term by ID.
 * ID로 단일 용어 조회.
 * @queryType getById
 */
export function termDetail(params: { financialTermId: string }): FinancialTerm | null {
  // TODO: persist — adapter query implementation
  throw new Error("Not implemented");
}
