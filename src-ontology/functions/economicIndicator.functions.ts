import type { EconomicIndicator } from "../types/index.js";

/**
 * True when actual value differs from consensus (D-2).
 * 실제값이 컨센서스와 다를 때 true (D-2).
 */
export function computeIsSurprise(
  actual: string | null,
  consensus: string | null,
): boolean {
  return actual !== null && actual !== consensus;
}

/**
 * Direction of actual vs consensus surprise (D-3).
 * 실제값 vs 컨센서스 서프라이즈 방향 (D-3).
 */
export function computeSurpriseDirection(
  actual: string | null,
  consensus: string | null,
): "above" | "below" | "inline" {
  if (actual === null || consensus === null) return "inline";
  const a = parseFloat(actual);
  const c = parseFloat(consensus);
  if (isNaN(a) || isNaN(c)) return "inline";
  if (a > c) return "above";
  if (a < c) return "below";
  return "inline";
}

/**
 * Format indicator for UI display.
 * UI 표시용 경제지표 포맷.
 */
export function formatIndicatorDisplay(indicator: EconomicIndicator): string {
  const stars: Record<string, string> = { high: "★★★", medium: "★★", low: "★" };
  return `${indicator.name} (${stars[indicator.importance] ?? ""}) — Consensus: ${indicator.consensus ?? "N/A"} / Actual: ${indicator.actual ?? "TBD"}`;
}
