/**
 * Security model helpers — PersonalData mandatory marking check.
 *
 * SaveTicker has 1 marking: PersonalData (mandatory, applied to User entity).
 * Enforcement: adapter logic checks marking before returning User data.
 *
 * @see ontology/security.ts > markings > PersonalData
 */

/**
 * Check if a user has PersonalData marking access.
 * PersonalData 마킹 접근 권한이 있는지 확인.
 */
export function hasPersonalDataAccess(
  userMarkings: readonly string[],
): boolean {
  return userMarkings.includes("PersonalData");
}

/**
 * Filter fields visible based on PersonalData marking.
 * PersonalData 마킹에 따라 표시 가능한 필드 필터링.
 */
export function filterUserFields<T extends Record<string, unknown>>(
  user: T,
  hasMarking: boolean,
): T {
  if (hasMarking) return user;
  const { email, ...safe } = user;
  return safe as T;
}
