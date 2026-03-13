import type { AppRole } from "./roles.js";

/**
 * OS-1: User RLS — members see only their own profile.
 * OS-1: User RLS — 회원은 본인 프로필만 조회.
 */
export function canAccessUserRow(currentUserId: string, rowUserId: string, isAdmin: boolean): boolean {
  return isAdmin || currentUserId === rowUserId;
}

/**
 * OS-1: User CLS — email field visibility by role.
 * OS-1: User CLS — 역할별 이메일 필드 가시성.
 */
export const USER_EMAIL_CLS = {
  readableBy: ["admin", "member"] as AppRole[],
  writableBy: ["admin"] as AppRole[],
};

/**
 * OS-2: WatchlistEntry RLS — members see only their own entries.
 * OS-2: WatchlistEntry RLS — 회원은 본인 항목만 조회.
 */
export function canAccessWatchlistRow(currentUserId: string, rowUserId: string, isAdmin: boolean): boolean {
  return isAdmin || currentUserId === rowUserId;
}
