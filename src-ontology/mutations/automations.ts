/**
 * Hourly pre-computation of trending stocks.
 * 매시간 인기 종목 사전 계산.
 *
 * @automation cron
 * @schedule "0 * * * *"
 * @idempotent true
 */
export async function computeTrendingStocks(): Promise<void> {
  // TODO: implement — run trendingStocks aggregation query, cache results
  // Counts news articles per stock in past 24h, marks 5+ as trending
  throw new Error("Not implemented");
}
