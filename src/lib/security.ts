/**
 * Frontend security utilities — role resolution, permission checks, field visibility.
 * 프론트엔드 보안 유틸리티 — 역할 결정, 권한 확인, 필드 가시성.
 *
 * Mirrors ontology/security.ts role gates at the UI layer.
 * Server-side enforcement is in convex/model/security.ts.
 */

export type Role = "guest" | "member" | "admin";
export type Action = "create" | "read" | "update" | "delete";

/**
 * Resolve role from authentication state.
 * 인증 상태에서 역할 결정.
 */
export function resolveRole(userId: string | null): Role {
  if (!userId) return "guest";
  // Prototype: first seeded user (index 0) is admin, rest are members
  // In production this would check a role field on the user document
  return "member";
}

/**
 * Entity-level permission matrix.
 * 엔티티 수준 권한 매트릭스.
 */
const permissions: Record<string, Record<Action, Role[]>> = {
  Stock:              { create: ["admin"], read: ["guest", "member", "admin"], update: ["admin"], delete: ["admin"] },
  NewsArticle:        { create: ["admin"], read: ["guest", "member", "admin"], update: ["admin"], delete: ["admin"] },
  User:               { create: ["admin"], read: ["member", "admin"],         update: ["member", "admin"], delete: ["admin"] },
  WatchlistEntry:     { create: ["member", "admin"], read: ["member", "admin"], update: ["member", "admin"], delete: ["member", "admin"] },
  EconomicIndicator:  { create: ["admin"], read: ["guest", "member", "admin"], update: ["admin"], delete: ["admin"] },
  StoryThread:        { create: ["admin"], read: ["guest", "member", "admin"], update: ["admin"], delete: ["admin"] },
  ArticleExplainer:   { create: ["admin"], read: ["guest", "member", "admin"], update: ["admin"], delete: ["admin"] },
  FinancialTerm:      { create: ["admin"], read: ["guest", "member", "admin"], update: ["admin"], delete: ["admin"] },
  ArticleTermUsage:   { create: ["admin"], read: ["guest", "member", "admin"], update: ["admin"], delete: ["admin"] },
  NewsStockLink:      { create: ["admin"], read: ["guest", "member", "admin"], update: ["admin"], delete: ["admin"] },
};

/**
 * Check if a role can perform an action on an entity.
 * 역할이 엔티티에 대해 작업을 수행할 수 있는지 확인.
 */
export function canPerform(role: Role, entity: string, action: Action): boolean {
  const entityPerms = permissions[entity];
  if (!entityPerms) return false;
  return entityPerms[action]?.includes(role) ?? false;
}

/**
 * Fields that should be omitted based on role.
 * 역할에 따라 생략해야 하는 필드.
 */
const omittedFields: Record<string, Record<string, Role[]>> = {
  User: {
    email: ["guest"],
  },
};

/**
 * Check if a field should be hidden for a given role.
 * 주어진 역할에 대해 필드를 숨겨야 하는지 확인.
 */
export function shouldOmitField(entity: string, field: string, role: Role): boolean {
  return omittedFields[entity]?.[field]?.includes(role) ?? false;
}
