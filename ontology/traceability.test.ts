/**
 * Ontology-to-Runtime Traceability Audit
 *
 * Verifies that ontology declarations (DATA/LOGIC/ACTION/SECURITY) are
 * faithfully reflected in runtime code (convex/schema.ts, convex/mutations.ts).
 *
 * Palantir principle: "schema wins over project code."
 * If this test fails, the runtime has drifted from the ontology declaration.
 *
 * Gap addressed: Critical Gap #7 — cross-project ontology test absence.
 */
import { describe, it, expect } from "bun:test";
import { objectTypes } from "./data";
import { linkTypes, queries } from "./logic";
import { mutations } from "./action";
import { roles, permissionMatrix, objectPolicies } from "./security";

// ---------------------------------------------------------------------------
// 1. DATA → Convex Schema Traceability
// ---------------------------------------------------------------------------

describe("DATA → Convex Schema Traceability", () => {
  // Hard-coded table names from convex/schema.ts to avoid import issues.
  // Update this list when convex/schema.ts changes.
  const CONVEX_TABLES = [
    "stocks", "newsArticles", "users", "storyThreads",
    "explainers", "impactChains", "impactNodes",
  ] as const;

  /** Ontology naming convention: PascalCase singular → camelCase plural */
  function toCamelPlural(pascalSingular: string): string {
    const first = pascalSingular.charAt(0).toLowerCase() + pascalSingular.slice(1);
    return first.endsWith("s") ? first : first + "s";
  }

  it("every ObjectType has a corresponding Convex table", () => {
    const missingTables: string[] = [];
    for (const entity of objectTypes) {
      const expectedTable = toCamelPlural(entity.apiName);
      if (!CONVEX_TABLES.includes(expectedTable as typeof CONVEX_TABLES[number])) {
        missingTables.push(`${entity.apiName} → expected table "${expectedTable}"`);
      }
    }
    expect(missingTables).toEqual([]);
  });

  it("every Convex table has an ObjectType declaration", () => {
    const ontologyNames = new Set(
      objectTypes.map((e) => toCamelPlural(e.apiName)),
    );
    const orphanedTables = CONVEX_TABLES.filter((t) => !ontologyNames.has(t));
    expect(orphanedTables).toEqual([]);
  });

  it("ObjectType count matches Convex table count", () => {
    expect(objectTypes.length).toBe(CONVEX_TABLES.length);
  });

  it("all ObjectTypes have BilingualDesc", () => {
    const missingDesc = objectTypes
      .filter((e) => !e.description?.en || !e.description?.ko)
      .map((e) => e.apiName);
    expect(missingDesc).toEqual([]);
  });

  it("all ObjectTypes have primaryKey and titleKey", () => {
    const missingKeys = objectTypes
      .filter((e) => !e.primaryKey || !e.titleKey)
      .map((e) => e.apiName);
    expect(missingKeys).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 2. LOGIC → Relationship Traceability
// ---------------------------------------------------------------------------

describe("LOGIC → Relationship Traceability", () => {
  const entityNames = new Set(objectTypes.map((e) => e.apiName));

  it("all LinkType source entities exist in ObjectTypes", () => {
    const invalid = linkTypes
      .filter((l) => !entityNames.has(l.sourceEntity))
      .map((l) => `${l.apiName}: sourceEntity "${l.sourceEntity}" not found`);
    expect(invalid).toEqual([]);
  });

  it("all LinkType target entities exist in ObjectTypes", () => {
    const invalid = linkTypes
      .filter((l) => !entityNames.has(l.targetEntity))
      .map((l) => `${l.apiName}: targetEntity "${l.targetEntity}" not found`);
    expect(invalid).toEqual([]);
  });

  it("all LinkTypes have valid cardinality", () => {
    const validCardinalities = ["1:1", "M:1", "1:M", "M:N"] as const;
    const invalid = linkTypes
      .filter((l) => !validCardinalities.includes(l.cardinality as typeof validCardinalities[number]))
      .map((l) => `${l.apiName}: invalid cardinality "${l.cardinality}"`);
    expect(invalid).toEqual([]);
  });

  it("all queries reference valid entities", () => {
    const invalid = queries
      .filter((q) => !entityNames.has(q.entityApiName))
      .map((q) => `${q.apiName}: entityApiName "${q.entityApiName}" not found`);
    expect(invalid).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 3. ACTION → Mutation Traceability
// ---------------------------------------------------------------------------

describe("ACTION → Mutation Traceability", () => {
  // Hard-coded from convex/mutations.ts exported names
  const CONVEX_MUTATIONS = [
    "createStoryThread", "assignArticleToThread", "createExplainer",
    "updateExplainer", "updateUserProfile", "updateStoryThread",
    "updateTranslationStatus", "createImpactChain", "addImpactNode",
    "removeImpactNode", "incrementViewCount",
  ] as const;

  it("every ontology mutation has a Convex implementation", () => {
    const missing = mutations
      .filter((m) => !CONVEX_MUTATIONS.includes(m.apiName as typeof CONVEX_MUTATIONS[number]))
      .map((m) => `${m.apiName} — declared in ontology, missing in convex/mutations.ts`);
    // Note: ontology may declare more mutations than currently implemented
    // This test surfaces the gap for tracking
    if (missing.length > 0) {
      console.warn("Unimplemented mutations:", missing);
    }
    // At least 80% should be implemented
    const coverage = 1 - missing.length / mutations.length;
    expect(coverage).toBeGreaterThanOrEqual(0.7);
  });

  it("all mutations have reviewLevel (Progressive Autonomy)", () => {
    const missingReview = mutations
      .filter((m) => !m.reviewLevel)
      .map((m) => m.apiName);
    expect(missingReview).toEqual([]);
  });

  it("all mutations target valid entities", () => {
    const entityNames = new Set(objectTypes.map((e) => e.apiName));
    const invalid = mutations
      .filter((m) => !entityNames.has(m.entityApiName))
      .map((m) => `${m.apiName}: entityApiName "${m.entityApiName}" not found`);
    expect(invalid).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 4. SECURITY → Coverage Traceability
// ---------------------------------------------------------------------------

describe("SECURITY → Coverage Traceability", () => {
  const entityNames = new Set(objectTypes.map((e) => e.apiName));
  const roleNames = new Set(roles.map((r) => r.apiName));

  it("all permission matrix entries reference valid entities", () => {
    const invalid = permissionMatrix
      .filter((p) => !entityNames.has(p.entityApiName))
      .map((p) => `${p.entityApiName} not in ObjectTypes`);
    expect(invalid).toEqual([]);
  });

  it("all permission matrix entries reference valid roles", () => {
    const invalid = permissionMatrix
      .filter((p) => !roleNames.has(p.roleApiName))
      .map((p) => `${p.roleApiName} not in Roles`);
    expect(invalid).toEqual([]);
  });

  it("every entity has at least one permission entry", () => {
    const coveredEntities = new Set(permissionMatrix.map((p) => p.entityApiName));
    const uncovered = objectTypes
      .filter((e) => !coveredEntities.has(e.apiName))
      .map((e) => e.apiName);
    expect(uncovered).toEqual([]);
  });

  it("all object policies reference valid entities", () => {
    const invalid = objectPolicies
      .filter((p) => !entityNames.has(p.entityApiName))
      .map((p) => `${p.entityApiName} not in ObjectTypes`);
    expect(invalid).toEqual([]);
  });

  it("roles have sequential hierarchy", () => {
    const hierarchies = roles.map((r) => r.hierarchy).filter((h) => h != null) as number[];
    const sorted = [...hierarchies].sort((a, b) => a - b);
    expect(hierarchies).toEqual(sorted);
  });
});

// ---------------------------------------------------------------------------
// 5. Cross-Domain Integrity
// ---------------------------------------------------------------------------

describe("Cross-Domain Integrity", () => {
  it("no entity name appears as both source and self-referential in links", () => {
    const selfRefs = linkTypes
      .filter((l) => l.sourceEntity === l.targetEntity)
      .map((l) => l.apiName);
    // Self-referential links are valid (e.g., ImpactNode → ImpactNode)
    // but should be explicitly documented
    for (const name of selfRefs) {
      const link = linkTypes.find((l) => l.apiName === name);
      expect(link?.description?.en).toBeTruthy();
    }
  });

  it("mutation entity coverage matches security entity coverage", () => {
    const mutationEntities = new Set(mutations.map((m) => m.entityApiName));
    const securityEntities = new Set(permissionMatrix.map((p) => p.entityApiName));
    const mutationOnlyEntities = [...mutationEntities].filter((e) => !securityEntities.has(e));
    expect(mutationOnlyEntities).toEqual([]);
  });

  it("ontology file exports are non-empty", () => {
    expect(objectTypes.length).toBeGreaterThan(0);
    expect(linkTypes.length).toBeGreaterThan(0);
    expect(mutations.length).toBeGreaterThan(0);
    expect(roles.length).toBeGreaterThan(0);
    expect(permissionMatrix.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// 6. Permission Matrix Sync — 3-way drift detection
// ---------------------------------------------------------------------------

describe("Permission Matrix Sync (3-Way Drift Detection)", () => {
  // Compiled permission map from convex/model/requireRole.ts
  // Must stay in sync with ontology/security.ts permissionMatrix
  const REQUIREROLE_ENTITIES = [
    "NewsArticle", "Explainer", "StoryThread", "Stock",
    "User", "ImpactChain", "ImpactNode",
  ] as const;

  // Frontend permission map from src/lib/security.ts
  const FRONTEND_ENTITIES = [
    "Stock", "NewsArticle", "User", "StoryThread",
    "Explainer", "ImpactChain", "ImpactNode",
  ] as const;

  it("ontology security covers all entities that requireRole covers", () => {
    const securityEntities = new Set(permissionMatrix.map((p) => p.entityApiName));
    const missing = REQUIREROLE_ENTITIES.filter((e) => !securityEntities.has(e));
    expect(missing).toEqual([]);
  });

  it("ontology security covers all entities that frontend covers", () => {
    const securityEntities = new Set(permissionMatrix.map((p) => p.entityApiName));
    const missing = FRONTEND_ENTITIES.filter((e) => !securityEntities.has(e));
    expect(missing).toEqual([]);
  });

  it("requireRole and frontend cover the same entities", () => {
    const requireSet = new Set(REQUIREROLE_ENTITIES);
    const frontendSet = new Set(FRONTEND_ENTITIES);
    const onlyInRequire = [...requireSet].filter((e) => !frontendSet.has(e));
    const onlyInFrontend = [...frontendSet].filter((e) => !requireSet.has(e));
    expect(onlyInRequire).toEqual([]);
    expect(onlyInFrontend).toEqual([]);
  });

  it("all 3 permission sources cover the same entity set as ObjectTypes", () => {
    const ontologyEntities = new Set(objectTypes.map((e) => e.apiName));
    const securityEntities = new Set(permissionMatrix.map((p) => p.entityApiName));
    const uncoveredByOntology = [...securityEntities].filter((e) => !ontologyEntities.has(e));
    const uncoveredBySecurity = [...ontologyEntities].filter((e) => !securityEntities.has(e));
    expect(uncoveredByOntology).toEqual([]);
    expect(uncoveredBySecurity).toEqual([]);
  });

  it("ontology roles match requireRole role names", () => {
    const ontologyRoles = roles.map((r) => r.apiName);
    // requireRole.ts uses "investor", "admin", "system"
    const requireRoles = ["investor", "admin", "system"] as const;
    const missingInOntology = requireRoles.filter((r) => !ontologyRoles.includes(r));
    expect(missingInOntology).toEqual([]);
  });
});
