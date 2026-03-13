/**
 * Price direction from dailyChangePct (D-1).
 * dailyChangePct에서 가격 방향 계산 (D-1).
 */
export function computePriceDirection(dailyChangePct: number): "up" | "down" | "flat" {
  if (dailyChangePct > 0) return "up";
  if (dailyChangePct < 0) return "down";
  return "flat";
}

/**
 * Format ticker for UI display.
 * UI 표시용 티커 포맷.
 */
export function formatTickerDisplay(ticker: string, name: string): string {
  return `${ticker} — ${name}`;
}
