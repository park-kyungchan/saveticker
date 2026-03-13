import type { EconomicIndicator } from "../types/index.js";

/**
 * Indicators in a date range.
 * 날짜 범위 내 경제지표.
 * @queryType filter
 */
export function calendarByDate(params: { startTime: Date; endTime: Date }): EconomicIndicator[] {
  // TODO: persist — filter scheduledAt between startTime and endTime
  throw new Error("Not implemented");
}

/**
 * Traverse self-ref causal chain. Max depth 5, cycle-guarded.
 * 자기참조 인과관계 체인 순회. 최대 깊이 5, 순환 방지.
 * @queryType aggregation
 */
export function indicatorCausalChain(params: { indicatorId: string }): EconomicIndicator[] {
  // TODO: persist — recursive traversal of relatedIndicatorId
  throw new Error("Not implemented");
}

/**
 * Indicators relevant to stock context (last 30 days).
 * 종목 맥락에 관련된 경제지표.
 * @queryType filter
 */
export function stockIndicators(params: { startTime: Date; endTime: Date }): EconomicIndicator[] {
  // TODO: persist — filter scheduledAt range
  throw new Error("Not implemented");
}
