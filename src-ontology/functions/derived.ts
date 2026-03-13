import type { Stock, EconomicIndicator } from "../types/index.js";
import { computePriceDirection } from "./stock.functions.js";
import { computeIsSurprise, computeSurpriseDirection } from "./economicIndicator.functions.js";

/**
 * D-1: Price direction derived from dailyChangePct.
 * D-1: dailyChangePct에서 파생된 가격 방향.
 * @derived @strategy onRead
 */
export function getPriceDirection(stock: Stock): "up" | "down" | "flat" {
  return computePriceDirection(stock.dailyChangePct);
}

/**
 * D-2: True when actual differs from consensus.
 * D-2: 실제값이 컨센서스와 다를 때 true.
 * @derived @strategy onRead
 */
export function getIsSurprise(indicator: EconomicIndicator): boolean {
  return computeIsSurprise(indicator.actual ?? null, indicator.consensus ?? null);
}

/**
 * D-3: Direction of surprise vs consensus.
 * D-3: 컨센서스 대비 서프라이즈 방향.
 * @derived @strategy onRead
 */
export function getSurpriseDirection(indicator: EconomicIndicator): "above" | "below" | "inline" {
  return computeSurpriseDirection(indicator.actual ?? null, indicator.consensus ?? null);
}
