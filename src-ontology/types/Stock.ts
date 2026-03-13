import type { Ticker, Price, PercentageChange } from "./branded.js";

/** Stock — Master data for a publicly traded stock. / 상장 주식 마스터 데이터. */
export interface Stock {
  readonly id: string;
  name: string;
  nameKo: string;
  readonly ticker: Ticker;
  sector: "technology" | "healthcare" | "finance" | "consumer" | "energy" | "industrials" | "etf";
  currentPrice: Price;
  dailyChangePct: PercentageChange;
  marketCap?: number;
  updatedAt: Date;
  updatedBy?: string;
}
