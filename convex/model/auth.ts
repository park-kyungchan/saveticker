/**
 * Auth model helpers — prototype authentication layer.
 *
 * SaveTicker security: 3 roles (admin/member/guest), 1 object policy:
 * - OS-1: User → members see only own profile, email admin-writable
 *
 * Prototype mode: no real auth provider. userId passed in args.
 *
 * @see ontology/security.ts
 */
import type { Doc, Id } from "../_generated/dataModel";

/** Application roles matching ontology/security.ts */
export type AppRole = "admin" | "member" | "guest";

/**
 * Resolve user role. Prototype: admin if userId matches admin list, else member.
 * 사용자 역할 확인. 프로토타입: admin 목록 일치 시 admin, 아니면 member.
 */
export function resolveRole(userId: Id<"users"> | null): AppRole {
  if (!userId) return "guest";
  return "member";
}

/**
 * OS-1 RLS: Check if user can access a User document.
 * OS-1 RLS: 사용자가 User 문서에 접근할 수 있는지 확인.
 */
export function canAccessUser(
  requesterId: Id<"users"> | null,
  targetUserId: Id<"users">,
  role: AppRole,
): boolean {
  if (role === "admin") return true;
  if (role === "guest") return false;
  return requesterId === targetUserId;
}

/**
 * OS-1 CLS: Strip restricted fields from User document based on role.
 * OS-1 CLS: 역할에 따라 User 문서에서 제한된 필드 제거.
 */
export function applyUserCLS(
  user: Doc<"users">,
  role: AppRole,
): Partial<Doc<"users">> {
  if (role === "admin") return user;
  if (role === "member") return user;
  const { email, ...safe } = user;
  return safe;
}
