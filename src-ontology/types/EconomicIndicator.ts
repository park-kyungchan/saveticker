import type { PercentageChange } from "./branded.js";
import type { SourceAttribution } from "./structs.js";

/** EconomicIndicator — Scheduled economic event. / 경제 이벤트. */
export interface EconomicIndicator {
  readonly id: string;
  name: string;
  nameKo: string;
  scheduledAt: Date;
  consensus?: string;
  actual?: string;
  previous: string;
  marketReactionPct?: PercentageChange;
  importance: "high" | "medium" | "low";
  source?: SourceAttribution;
  relatedIndicatorId?: string;
  causalContext?: string;
  updatedAt: Date;
  updatedBy?: string;
}
