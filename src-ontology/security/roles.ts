/**
 * Application roles.
 * 애플리케이션 역할.
 */
export type AppRole = "admin" | "member" | "guest";

/** Role hierarchy levels (lower number = higher authority) */
export const ROLE_HIERARCHY: Record<AppRole, number> = {
  admin: 1,
  member: 2,
  guest: 3,
};

/**
 * Check if a role has at least the specified authority level.
 * 역할이 최소 지정된 권한 수준인지 확인합니다.
 */
export function hasRole(userRole: AppRole, requiredRole: AppRole): boolean {
  return ROLE_HIERARCHY[userRole] <= ROLE_HIERARCHY[requiredRole];
}
