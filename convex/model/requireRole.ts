/**
 * Role-Based Mutation Guard — Ontology Security Enforcement
 *
 * Bridges ontology/security.ts permission declarations to Convex runtime.
 * Reads the permission matrix and enforces role checks before mutations execute.
 *
 * Gap addressed: Critical Gap #1 — 24 permission entries declared, 0 enforced.
 *
 * Usage in mutations:
 *   await requireRole(ctx, "NewsArticle", "create");
 *
 * @see ontology/security.ts > permissionMatrix
 * @see convex/model/auth.ts > resolveRole
 */
import type { MutationCtx, QueryCtx } from "../_generated/server";

/**
 * Operation types matching ontology/security.ts PermissionEntry.operations.
 * 온톨로지 보안 정의와 일치하는 작업 유형.
 */
type Operation = "create" | "read" | "update" | "delete";

/**
 * Role names matching ontology/security.ts roles.
 * 온톨로지 보안 정의와 일치하는 역할 이름.
 */
type RoleName = "investor" | "admin" | "system";

/**
 * Compiled permission matrix — derived from ontology/security.ts.
 * Maps "Entity:operation" → allowed roles.
 *
 * Source of truth: ontology/security.ts > permissionMatrix
 * If the ontology declaration changes, update this map.
 * traceability.test.ts will catch drift.
 *
 * 온톨로지 보안 선언에서 파생된 컴파일된 권한 매트릭스.
 */
const PERMISSION_MAP: Record<string, readonly RoleName[]> = {
  // NewsArticle
  "NewsArticle:read": ["investor", "admin"],
  "NewsArticle:create": ["admin", "system"],
  "NewsArticle:update": ["admin"],
  "NewsArticle:delete": ["admin"],
  // Explainer
  "Explainer:read": ["investor", "admin"],
  "Explainer:create": ["admin"],
  "Explainer:update": ["admin"],
  "Explainer:delete": ["admin"],
  // StoryThread
  "StoryThread:read": ["investor", "admin"],
  "StoryThread:create": ["admin"],
  "StoryThread:update": ["admin"],
  "StoryThread:delete": ["admin"],
  // Stock (read-only for all)
  "Stock:read": ["investor", "admin"],
  // User (self-service + admin)
  "User:read": ["investor", "admin"],
  "User:update": ["investor", "admin"],
  // ImpactChain
  "ImpactChain:read": ["investor", "admin"],
  "ImpactChain:create": ["admin"],
  "ImpactChain:update": ["admin"],
  "ImpactChain:delete": ["admin"],
  // ImpactNode
  "ImpactNode:read": ["investor", "admin"],
  "ImpactNode:create": ["admin"],
  "ImpactNode:update": ["admin"],
  "ImpactNode:delete": ["admin"],
};

/**
 * Resolve the current user's role from Convex auth context.
 * Prototype: no auth provider → defaults to "admin" for development.
 * Production: read from ctx.auth.getUserIdentity() → user record → role field.
 *
 * 현재 사용자의 역할을 Convex 인증 컨텍스트에서 확인.
 * 프로토타입: 인증 없음 → 개발용 기본값 "admin".
 */
async function resolveCurrentRole(
  ctx: MutationCtx | QueryCtx,
): Promise<RoleName> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    // Prototype: unauthenticated requests get admin access for development.
    // Production TODO: return "investor" (default role) or throw.
    return "admin";
  }
  // Production TODO: look up user record, read role field.
  // For now, authenticated = admin.
  return "admin";
}

/**
 * Enforce ontology permission before mutation execution.
 * Throws if the current user's role is not authorized.
 *
 * 뮤테이션 실행 전 온톨로지 권한 강제.
 * 현재 사용자의 역할이 허가되지 않으면 예외 발생.
 *
 * @param ctx - Convex mutation context
 * @param entity - ObjectType apiName (e.g., "NewsArticle")
 * @param operation - CRUD operation
 */
export async function requireRole(
  ctx: MutationCtx,
  entity: string,
  operation: Operation,
): Promise<RoleName> {
  const role = await resolveCurrentRole(ctx);
  const key = `${entity}:${operation}`;
  const allowed = PERMISSION_MAP[key];

  if (!allowed) {
    throw new Error(
      `Security: no permission entry for ${key}. Add to ontology/security.ts.`,
    );
  }

  if (!allowed.includes(role)) {
    throw new Error(
      `Security: role "${role}" not authorized for ${key}. ` +
      `Allowed: [${allowed.join(", ")}].`,
    );
  }

  return role;
}

/**
 * Read-only permission check (for queries).
 * 쿼리용 읽기 권한 확인.
 */
export async function requireRead(
  ctx: QueryCtx,
  entity: string,
): Promise<RoleName> {
  const role = await resolveCurrentRole(ctx);
  const key = `${entity}:read`;
  const allowed = PERMISSION_MAP[key];

  if (!allowed || !allowed.includes(role)) {
    throw new Error(`Security: role "${role}" cannot read ${entity}.`);
  }

  return role;
}
