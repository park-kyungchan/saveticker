/**
 * User model helpers — read helpers.
 *
 * Covers: Q: userById, allUsers.
 */
import type { QueryCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";

/**
 * Single user by ID.
 * ID로 단일 사용자 조회.
 */
export async function userById(
  ctx: QueryCtx,
  userId: Id<"users">,
): Promise<Doc<"users"> | null> {
  return await ctx.db.get(userId);
}

/**
 * All users. Prototype-only (demo user picker).
 * 전체 사용자. 프로토타입 전용 (데모 사용자 선택기).
 */
export async function allUsers(
  ctx: QueryCtx,
): Promise<Doc<"users">[]> {
  return await ctx.db.query("users").collect();
}
