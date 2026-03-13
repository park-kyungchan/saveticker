import type { PercentageChange } from "../types/index.js";

/** updateIndicatorActual params / 지표 실제값 기록 파라미터 */
export interface UpdateIndicatorActualParams {
  economicIndicatorId: string;
  actual: string;
  marketReactionPct?: PercentageChange;
}

/**
 * Record actual released value after indicator publication.
 * 경제지표 발표 후 실제 발표값 기록.
 */
export function updateIndicatorActual(params: UpdateIndicatorActualParams): void {
  // TODO: persist — db.economicIndicators.patch(id, { actual, marketReactionPct, updatedAt })
  throw new Error("Not implemented");
}
