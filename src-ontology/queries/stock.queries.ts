import type { Stock } from "../types/index.js";

/**
 * Stocks with N+ news articles in the time window.
 * 시간 범위 내 N개 이상 뉴스 기사가 있는 종목.
 * @queryType aggregation
 */
export function trendingStocks(params: { cutoff: Date; thresholdCount?: number }): Stock[] {
  // TODO: persist — aggregate via NewsStockLink
  throw new Error("Not implemented");
}

/**
 * Stock name/ticker prefix search.
 * 종목 이름/티커 접두어 검색.
 * @queryType search
 */
export function searchStocks(params: { query: string; limit?: number }): Stock[] {
  // TODO: persist — search by name startsWith/contains, ticker startsWith
  throw new Error("Not implemented");
}

/**
 * Single stock by ID.
 * ID로 단일 종목 조회.
 * @queryType getById
 */
export function stockById(params: { stockId: string }): Stock | null {
  // TODO: persist — adapter query implementation
  throw new Error("Not implemented");
}
