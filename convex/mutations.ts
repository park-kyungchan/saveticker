/**
 * SaveTicker — Convex Mutation Endpoints
 *
 * Thin wrappers: validate args → call model helper or ctx.db → return.
 * Business logic in convex/model/. Auditable fields auto-set.
 *
 * @see ontology/action.ts > mutations
 */
import { mutation } from "./_generated/server";
import { v } from "convex/values";

import { validateExplainerCreate } from "./model/explainer";

// ===========================================================================
// M-1: createExplainer — Insert Explainer (1:1 unique)
// ===========================================================================

/**
 * Create plain language explainer for a news article.
 * 뉴스 기사용 쉬운 설명 카드 생성.
 */
export const createExplainer = mutation({
  args: {
    newsArticleId: v.id("newsArticles"),
    simplifiedTitle: v.string(),
    storyBody: v.string(),
    keyTakeaways: v.array(v.string()),
    personalImpact: v.optional(v.string()),
    analogy: v.optional(v.string()),
    difficultyLevel: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
    ),
  },
  handler: async (ctx, args) => {
    const canCreate = await validateExplainerCreate(ctx, args.newsArticleId);
    if (!canCreate) throw new Error("Explainer already exists for this article");

    return await ctx.db.insert("explainers", {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

// ===========================================================================
// M-2: updateExplainer — Patch Explainer
// ===========================================================================

/**
 * Update an existing explainer.
 * 기존 쉬운 설명 수정.
 */
export const updateExplainer = mutation({
  args: {
    explainerId: v.id("explainers"),
    simplifiedTitle: v.optional(v.string()),
    storyBody: v.optional(v.string()),
    keyTakeaways: v.optional(v.array(v.string())),
    personalImpact: v.optional(v.string()),
    analogy: v.optional(v.string()),
    difficultyLevel: v.optional(
      v.union(
        v.literal("beginner"),
        v.literal("intermediate"),
        v.literal("advanced"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const { explainerId, ...updates } = args;
    const explainer = await ctx.db.get(explainerId);
    if (!explainer) throw new Error("Explainer not found");

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) patch[key] = value;
    }
    await ctx.db.patch(explainerId, patch);
  },
});

// ===========================================================================
// M-3: updateUserProfile — Patch User
// ===========================================================================

/**
 * Update user display name.
 * 사용자 표시 이름 변경.
 */
export const updateUserProfile = mutation({
  args: {
    userId: v.id("users"),
    displayName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (updates.displayName !== undefined) patch.displayName = updates.displayName;

    await ctx.db.patch(userId, patch);
  },
});
