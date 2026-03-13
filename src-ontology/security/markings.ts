/**
 * PersonalData marking — restricts PII access.
 * PersonalData 마킹 — 개인정보 접근 제한.
 */
export const PERSONAL_DATA_ENTITIES = ["User"] as const;

/**
 * Check if user has PersonalData marking access.
 * 사용자가 PersonalData 마킹 접근 권한이 있는지 확인.
 * User can access their own data, admin can access all.
 */
export function hasPersonalDataAccess(
  userId: string,
  targetUserId: string,
  isAdmin: boolean,
): boolean {
  return isAdmin || userId === targetUserId;
}
