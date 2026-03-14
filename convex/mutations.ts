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
import { collectDescendantIds } from "./model/impactChain";
import { requireRole } from "./model/requireRole";

// ===========================================================================
// M-1: createStoryThread — Insert StoryThread (PM Feature 1)
// ===========================================================================

/**
 * Create a new story thread for grouping related news.
 * 관련 뉴스를 묶기 위한 새 스토리 스레드 생성.
 */
export const createStoryThread = mutation({
  args: {
    title: v.string(),
    titleKo: v.string(),
    description: v.optional(v.string()),
    descriptionKo: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("completed")),
  },
  handler: async (ctx, args) => {
    const role = await requireRole(ctx, "StoryThread", "create");
    return await ctx.db.insert("storyThreads", {
      ...args,
      updatedAt: Date.now(),
      updatedBy: role,
    });
  },
});

// ===========================================================================
// M-2: assignArticleToThread — Link article to thread
// ===========================================================================

/**
 * Assign a news article to a story thread with a position.
 * 뉴스 기사를 스토리 스레드에 순서와 함께 배정.
 */
export const assignArticleToThread = mutation({
  args: {
    newsArticleId: v.id("newsArticles"),
    storyThreadId: v.id("storyThreads"),
    orderInThread: v.number(),
  },
  handler: async (ctx, args) => {
    const role = await requireRole(ctx, "NewsArticle", "update");
    const article = await ctx.db.get(args.newsArticleId);
    if (!article) throw new Error("Article not found");

    await ctx.db.patch(args.newsArticleId, {
      storyThreadId: args.storyThreadId,
      orderInThread: args.orderInThread,
      updatedAt: Date.now(),
      updatedBy: role,
    });
  },
});

// ===========================================================================
// M-3: createExplainer — Insert Explainer (1:1 unique)
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
    const role = await requireRole(ctx, "Explainer", "create");
    const canCreate = await validateExplainerCreate(ctx, args.newsArticleId);
    if (!canCreate) throw new Error("Explainer already exists for this article");

    return await ctx.db.insert("explainers", {
      ...args,
      updatedAt: Date.now(),
      updatedBy: role,
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
    const role = await requireRole(ctx, "Explainer", "update");
    const { explainerId, ...updates } = args;
    const explainer = await ctx.db.get(explainerId);
    if (!explainer) throw new Error("Explainer not found");

    const patch: Record<string, unknown> = { updatedAt: Date.now(), updatedBy: role };
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
    const role = await requireRole(ctx, "User", "update");
    const { userId, ...updates } = args;
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const patch: Record<string, unknown> = { updatedAt: Date.now(), updatedBy: role };
    if (updates.displayName !== undefined) patch.displayName = updates.displayName;

    await ctx.db.patch(userId, patch);
  },
});

// ===========================================================================
// M-4: updateStoryThread — Patch StoryThread
// ===========================================================================

/**
 * Update an existing story thread.
 * 기존 스토리 스레드 수정.
 */
export const updateStoryThread = mutation({
  args: {
    storyThreadId: v.id("storyThreads"),
    title: v.optional(v.string()),
    titleKo: v.optional(v.string()),
    description: v.optional(v.string()),
    descriptionKo: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("completed"))),
  },
  handler: async (ctx, args) => {
    const role = await requireRole(ctx, "StoryThread", "update");
    const { storyThreadId, ...updates } = args;
    const thread = await ctx.db.get(storyThreadId);
    if (!thread) throw new Error("StoryThread not found");

    const patch: Record<string, unknown> = { updatedAt: Date.now(), updatedBy: role };
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) patch[key] = value;
    }
    await ctx.db.patch(storyThreadId, patch);
  },
});

// ===========================================================================
// M-5: updateTranslationStatus — LEARN loop feedback
// ===========================================================================

/**
 * Update translation pipeline status on a news article.
 * 뉴스 기사의 번역 파이프라인 상태 업데이트.
 */
export const updateTranslationStatus = mutation({
  args: {
    newsArticleId: v.id("newsArticles"),
    translationStatus: v.union(
      v.literal("pending"),
      v.literal("reviewed"),
      v.literal("approved"),
    ),
    translationNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const role = await requireRole(ctx, "NewsArticle", "update");
    const article = await ctx.db.get(args.newsArticleId);
    if (!article) throw new Error("Article not found");

    const patch: Record<string, unknown> = {
      translationStatus: args.translationStatus,
      updatedAt: Date.now(),
      updatedBy: role,
    };

    if (args.translationNote !== undefined) {
      const existing = article.translationNotes ?? [];
      patch.translationNotes = [...existing, args.translationNote];
    }

    await ctx.db.patch(args.newsArticleId, patch);
  },
});

// ===========================================================================
// M-11: incrementViewCount — Hero Card view counter
// ===========================================================================

/**
 * Increment article view count by 1.
 * 기사 조회수 1 증가.
 */
export const incrementViewCount = mutation({
  args: { articleId: v.id("newsArticles") },
  handler: async (ctx, { articleId }) => {
    await requireRole(ctx, "NewsArticle", "update");
    const article = await ctx.db.get(articleId);
    if (!article) throw new Error("Article not found");
    await ctx.db.patch(articleId, { viewCount: (article.viewCount ?? 0) + 1 });
  },
});

// ===========================================================================
// M-6: createImpactChain — PM Feature 3
// ===========================================================================

/**
 * Create a new impact chain for a story thread.
 * 스토리 스레드용 새 영향 체인 생성.
 */
export const createImpactChain = mutation({
  args: {
    storyThreadId: v.id("storyThreads"),
    title: v.string(),
    titleKo: v.string(),
    description: v.optional(v.string()),
    descriptionKo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const role = await requireRole(ctx, "ImpactChain", "create");
    return await ctx.db.insert("impactChains", {
      ...args,
      updatedAt: Date.now(),
      updatedBy: role,
    });
  },
});

// ===========================================================================
// M-7: addImpactNode — PM Feature 3
// ===========================================================================

/**
 * Add a node to an impact chain.
 * 영향 체인에 노드 추가.
 */
export const addImpactNode = mutation({
  args: {
    chainId: v.id("impactChains"),
    parentNodeId: v.optional(v.id("impactNodes")),
    newsArticleId: v.optional(v.id("newsArticles")),
    label: v.string(),
    labelKo: v.string(),
    description: v.optional(v.string()),
    descriptionKo: v.optional(v.string()),
    ordinal: v.number(),
  },
  handler: async (ctx, args) => {
    const role = await requireRole(ctx, "ImpactNode", "create");
    return await ctx.db.insert("impactNodes", {
      ...args,
      updatedAt: Date.now(),
      updatedBy: role,
    });
  },
});

// ===========================================================================
// M-8: removeImpactNode — CASCADE DELETE
// ===========================================================================

/**
 * Remove an impact node and all its descendants (cascade delete).
 * 영향 노드와 모든 하위 노드 연쇄 삭제.
 */
export const removeImpactNode = mutation({
  args: {
    impactNodeId: v.id("impactNodes"),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, "ImpactNode", "delete");
    const node = await ctx.db.get(args.impactNodeId);
    if (!node) throw new Error("ImpactNode not found");

    const descendantIds = await collectDescendantIds(ctx, args.impactNodeId);

    // Delete descendants first (leaves → root)
    for (const id of descendantIds.reverse()) {
      await ctx.db.delete(id);
    }
    // Delete the target node
    await ctx.db.delete(args.impactNodeId);
  },
});
