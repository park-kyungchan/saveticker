/**
 * SaveTicker — Ontology SECURITY Domain (Deferred)
 *
 * 0 roles, 0 permission entries, 0 markings, 0 object policies.
 * Per user instruction: security domain implementation deferred ("나중에").
 * DATA/LOGIC/ACTION domains completed first.
 */

import type {
  Role,
  PermissionEntry,
  Marking,
  ObjectSecurityPolicy,
} from "./schema.js";

// == SECTION: permissions ==
/** Roles / 역할 */
export const roles = [] as const satisfies readonly Role[];

/** Permission Matrix / 권한 매트릭스 */
export const permissionMatrix = [] as const satisfies readonly PermissionEntry[];
// == END: permissions ==

// == SECTION: markings ==
/** Markings (data classification) / 마킹 (데이터 분류) */
export const markings = [] as const satisfies readonly Marking[];
// == END: markings ==

// == SECTION: object-policies ==
/** Object Security Policies (RLS/CLS) / 오브젝트 보안 정책 (행/열 수준) */
export const objectPolicies = [] as const satisfies readonly ObjectSecurityPolicy[];
// == END: object-policies ==
