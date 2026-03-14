/**
 * SaveTicker v2.0 — Ontology SECURITY Domain
 *
 * Rebuilt against schemas v1.2.0 (34/34 DH coverage, Mode A).
 * 3 roles, 24 permission entries, 0 markings, 1 object policy (User RLS).
 * Source of truth: docs/ontology-prompt.md, schemas/ontology/security/schema.ts
 *
 * Security Layer Decision (DH-SEC-01):
 * - Layer 1 (RBAC): Role-based content management (admin vs investor)
 * - Layer 2 (Markings): NOT NEEDED — no classification hierarchy for prototype
 * - Layer 3 (Object Security): RLS for User entity (own profile only)
 *
 * DH-SEC-06: 3 roles — minimal for prototype scope
 * DH-SEC-02: No marking hierarchy (public data vs personal data handled by RLS)
 * DH-SEC-03: RLS on User entity, no property-level CLS needed
 */

import type {
  Role,
  PermissionEntry,
  Marking,
  ObjectSecurityPolicy,
} from "./schema.js";

// == SECTION: permissions ==

/** Roles / 역할 */
export const roles = [
  // -------------------------------------------------------------------------
  // Role 1: investor — Primary end user (Korean retail investor)
  // -------------------------------------------------------------------------
  {
    apiName: "investor",
    displayName: {
      en: "Investor",
      ko: "투자자",
    },
    hierarchy: 1,
    // Primary user: reads articles, explainers, threads, impact chains.
    // Cannot create/edit content. Can only modify own profile.
  },

  // -------------------------------------------------------------------------
  // Role 2: admin — Content management (translation, curation)
  // -------------------------------------------------------------------------
  {
    apiName: "admin",
    displayName: {
      en: "Administrator",
      ko: "관리자",
    },
    hierarchy: 2,
    // Full CRUD on content entities. Translation pipeline management.
    // Can read all user profiles but only modify own.
  },

  // -------------------------------------------------------------------------
  // Role 3: system — API/automation identity (future)
  // -------------------------------------------------------------------------
  {
    apiName: "system",
    displayName: {
      en: "System",
      ko: "시스템",
    },
    hierarchy: 3,
    // DECLARED ONLY — future article ingestion automation identity.
    // Currently unused in prototype. DH-SEC-06: declared for forward compatibility.
  },
] as const satisfies readonly Role[];

/** Permission Matrix / 권한 매트릭스 */
export const permissionMatrix = [
  // =========================================================================
  // NewsArticle permissions
  // =========================================================================
  { entityApiName: "NewsArticle", roleApiName: "investor", operations: ["read"] },
  { entityApiName: "NewsArticle", roleApiName: "admin", operations: ["create", "read", "update", "delete"] },
  { entityApiName: "NewsArticle", roleApiName: "system", operations: ["create"] },

  // =========================================================================
  // Explainer permissions
  // =========================================================================
  { entityApiName: "Explainer", roleApiName: "investor", operations: ["read"] },
  { entityApiName: "Explainer", roleApiName: "admin", operations: ["create", "read", "update", "delete"] },

  // =========================================================================
  // StoryThread permissions
  // =========================================================================
  { entityApiName: "StoryThread", roleApiName: "investor", operations: ["read"] },
  { entityApiName: "StoryThread", roleApiName: "admin", operations: ["create", "read", "update", "delete"] },

  // =========================================================================
  // Stock permissions (reference data — read-only for all)
  // =========================================================================
  { entityApiName: "Stock", roleApiName: "investor", operations: ["read"] },
  { entityApiName: "Stock", roleApiName: "admin", operations: ["read"] },

  // =========================================================================
  // User permissions (self-service + admin read)
  // =========================================================================
  { entityApiName: "User", roleApiName: "investor", operations: ["read", "update"] },
  { entityApiName: "User", roleApiName: "admin", operations: ["read", "update"] },
  // Note: RLS below restricts investor to own record only

  // =========================================================================
  // ImpactChain permissions (PM Feature 3)
  // =========================================================================
  { entityApiName: "ImpactChain", roleApiName: "investor", operations: ["read"] },
  { entityApiName: "ImpactChain", roleApiName: "admin", operations: ["create", "read", "update", "delete"] },

  // =========================================================================
  // ImpactNode permissions (PM Feature 3)
  // =========================================================================
  { entityApiName: "ImpactNode", roleApiName: "investor", operations: ["read"] },
  { entityApiName: "ImpactNode", roleApiName: "admin", operations: ["create", "read", "update", "delete"] },
] as const satisfies readonly PermissionEntry[];
// == END: permissions ==

// == SECTION: markings ==
/** Markings (data classification) / 마킹 (데이터 분류) */
export const markings = [] as const satisfies readonly Marking[];
// DH-SEC-02: No marking hierarchy needed — public vs personal handled by RLS
// == END: markings ==

// == SECTION: object-policies ==
/** Object Security Policies (RLS/CLS) / 오브젝트 보안 정책 (행/열 수준) */
export const objectPolicies = [
  // -------------------------------------------------------------------------
  // OP-1: User — Row-Level Security (own profile only for investor role)
  // -------------------------------------------------------------------------
  {
    entityApiName: "User",
    description: {
      en: "Investor role can only read/update their own User record — RLS on userId equals currentUser.id",
      ko: "투자자 역할은 자신의 User 레코드만 읽기/수정 가능 — userId가 currentUser.id와 같을 때만",
    },
    rls: {
      userAttribute: "userId",
      objectProperty: "id",
      operator: "equals",
      // HC-SEC-03: RLS index required — User.id is system PK, always indexed
    },
    // No CLS needed — all User properties visible to owner
    // Admin can read all users (RBAC permits read), RLS only applies to investor role
    // DH-SEC-03: minimal RLS — single entity, single policy
  },
] as const satisfies readonly ObjectSecurityPolicy[];
// == END: object-policies ==
