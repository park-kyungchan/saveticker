/**
 * Stock model helpers — read helpers.
 *
 * Covers: Q: stockById, stockByTicker.
 */
import type { QueryCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";

/**
 * Single stock by ID.
 * ID로 단일 종목 조회.
 */
export async function stockById(
  ctx: QueryCtx,
  stockId: Id<"stocks">,
): Promise<Doc<"stocks"> | null> {
  return await ctx.db.get(stockId);
}

/**
 * Stock by ticker symbol.
 * 티커 심볼로 종목 조회.
 */
export async function stockByTicker(
  ctx: QueryCtx,
  ticker: string,
): Promise<Doc<"stocks"> | null> {
  return await ctx.db
    .query("stocks")
    .withIndex("by_ticker", (q) => q.eq("ticker", ticker))
    .first();
}
