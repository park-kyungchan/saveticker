import type { AppRole } from "./roles.js";

export type Operation = "create" | "read" | "update" | "delete";

type EntityName = "Stock" | "NewsArticle" | "User" | "EconomicIndicator" | "StoryThread" | "WatchlistEntry" | "NewsStockLink" | "ArticleExplainer" | "FinancialTerm" | "ArticleTermUsage";

interface PermissionRule {
  role: AppRole;
  entity: EntityName;
  operations: Operation[];
}

const PERMISSIONS: PermissionRule[] = [
  // admin: full CRUD on all
  { role: "admin", entity: "Stock", operations: ["create", "read", "update", "delete"] },
  { role: "admin", entity: "NewsArticle", operations: ["create", "read", "update", "delete"] },
  { role: "admin", entity: "User", operations: ["create", "read", "update", "delete"] },
  { role: "admin", entity: "EconomicIndicator", operations: ["create", "read", "update", "delete"] },
  { role: "admin", entity: "StoryThread", operations: ["create", "read", "update", "delete"] },
  { role: "admin", entity: "WatchlistEntry", operations: ["create", "read", "update", "delete"] },
  { role: "admin", entity: "NewsStockLink", operations: ["create", "read", "update", "delete"] },
  { role: "admin", entity: "ArticleExplainer", operations: ["create", "read", "update", "delete"] },
  { role: "admin", entity: "FinancialTerm", operations: ["create", "read", "update", "delete"] },
  { role: "admin", entity: "ArticleTermUsage", operations: ["create", "read", "update", "delete"] },
  // member: read public + manage own watchlist/profile
  { role: "member", entity: "Stock", operations: ["read"] },
  { role: "member", entity: "NewsArticle", operations: ["read"] },
  { role: "member", entity: "User", operations: ["read", "update"] },
  { role: "member", entity: "EconomicIndicator", operations: ["read"] },
  { role: "member", entity: "StoryThread", operations: ["read"] },
  { role: "member", entity: "WatchlistEntry", operations: ["create", "read", "delete"] },
  { role: "member", entity: "NewsStockLink", operations: ["read"] },
  { role: "member", entity: "ArticleExplainer", operations: ["read"] },
  { role: "member", entity: "FinancialTerm", operations: ["read"] },
  { role: "member", entity: "ArticleTermUsage", operations: ["read"] },
  // guest: read-only public (no User, no WatchlistEntry)
  { role: "guest", entity: "Stock", operations: ["read"] },
  { role: "guest", entity: "NewsArticle", operations: ["read"] },
  { role: "guest", entity: "EconomicIndicator", operations: ["read"] },
  { role: "guest", entity: "StoryThread", operations: ["read"] },
  { role: "guest", entity: "NewsStockLink", operations: ["read"] },
  { role: "guest", entity: "ArticleExplainer", operations: ["read"] },
  { role: "guest", entity: "FinancialTerm", operations: ["read"] },
  { role: "guest", entity: "ArticleTermUsage", operations: ["read"] },
];

/**
 * Check if a role can perform an operation on an entity.
 * 역할이 엔티티에 대해 작업을 수행할 수 있는지 확인합니다.
 */
export function canPerform(role: AppRole, entity: string, operation: Operation): boolean {
  const rule = PERMISSIONS.find(p => p.role === role && p.entity === entity);
  return rule ? rule.operations.includes(operation) : false;
}
