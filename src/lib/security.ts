/**
 * Frontend security utilities — role resolution, permission checks, field visibility.
 * 프론트엔드 보안 유틸리티 — 역할 결정, 권한 확인, 필드 가시성.
 *
 * Synced with redesigned 7-entity ontology (data.ts).
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
  return "member";
}

/**
 * Entity-level permission matrix — synced with 7-entity ontology.
 * 엔티티 수준 권한 매트릭스 — 7-entity 온톨로지와 동기화.
 *
 * Entities: Stock, NewsArticle, User, StoryThread, Explainer, ImpactChain, ImpactNode
 */
const permissions: Record<string, Record<Action, Role[]>> = {
  // Reference data — admin manages, everyone reads
  Stock:         { create: ["admin"], read: ["guest", "member", "admin"], update: ["admin"], delete: ["admin"] },

  // Content — admin manages, everyone reads
  NewsArticle:   { create: ["admin"], read: ["guest", "member", "admin"], update: ["admin"], delete: ["admin"] },

  // User — members see/edit own, admin manages all
  User:          { create: ["admin"], read: ["member", "admin"], update: ["member", "admin"], delete: ["admin"] },

  // PM Feature 1: Story Threads — admin manages
  StoryThread:   { create: ["admin"], read: ["guest", "member", "admin"], update: ["admin"], delete: ["admin"] },

  // PM Feature 2: Explainers — admin manages
  Explainer:     { create: ["admin"], read: ["guest", "member", "admin"], update: ["admin"], delete: ["admin"] },

  // PM Feature 3: Impact Chains — admin manages
  ImpactChain:   { create: ["admin"], read: ["guest", "member", "admin"], update: ["admin"], delete: ["admin"] },
  ImpactNode:    { create: ["admin"], read: ["guest", "member", "admin"], update: ["admin"], delete: ["admin"] },
};

/**
 * Check if a role can perform an action on an entity.
 * 역할이 엔티티에 대해 작업을 수행할 수 있는지 확인.
 */
export function canPerform(role: Role, entity: string, action: Action): boolean {
  const entityPerms = permissions[entity];
  if (!entityPerms) {
    console.warn(`[security] Unknown entity "${entity}" — denying by default`);
    return false;
  }
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
