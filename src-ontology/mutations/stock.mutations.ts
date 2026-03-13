import type { Price, PercentageChange } from "../types/index.js";

/** updateStockPrice params / 종목 가격 업데이트 파라미터 */
export interface UpdateStockPriceParams {
  stockId: string;
  currentPrice: Price;
  dailyChangePct: PercentageChange;
  marketCap?: number;
}

/**
 * Update stock price snapshot fields (admin/system).
 * 종목 가격 스냅샷 필드 업데이트.
 */
export function updateStockPrice(params: UpdateStockPriceParams): void {
  // TODO: persist — db.stocks.patch(params.stockId, { ...params, updatedAt: new Date() })
  throw new Error("Not implemented");
}
