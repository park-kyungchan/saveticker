/**
 * SaveTicker — Convex Mutation Endpoints (9 mutations)
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
// M-1: createStoryThread — Insert StoryThread (PM Feature 1)
// ===========================================================================

/**
 * Create a new story thread for narrative grouping.
 * 내러티브 그룹용 새 스토리 스레드 생성.
 */
export const createStoryThread = mutation({
  args: {
    title: v.string(),
    titleKo: v.string(),
    description: v.optional(v.string()),
    descriptionKo: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("completed"))),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("storyThreads", {
      ...args,
      status: args.status ?? "active",
      updatedAt: Date.now(),
    });
  },
});

// ===========================================================================
// M-2: updateStoryThread — Patch StoryThread
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
    const { storyThreadId, ...updates } = args;
    const thread = await ctx.db.get(storyThreadId);
    if (!thread) throw new Error("Thread not found");

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) patch[key] = value;
    }
    await ctx.db.patch(storyThreadId, patch);
  },
});

// ===========================================================================
// M-3: assignArticleToThread — Patch NewsArticle FK
// ===========================================================================

/**
 * Assign a news article to a story thread with timeline position.
 * 뉴스 기사를 스토리 스레드에 타임라인 위치와 함께 배정.
 */
export const assignArticleToThread = mutation({
  args: {
    newsArticleId: v.id("newsArticles"),
    storyThreadId: v.id("storyThreads"),
    orderInThread: v.number(),
  },
  handler: async (ctx, args) => {
    const article = await ctx.db.get(args.newsArticleId);
    if (!article) throw new Error("Article not found");
    const thread = await ctx.db.get(args.storyThreadId);
    if (!thread) throw new Error("Thread not found");

    await ctx.db.patch(args.newsArticleId, {
      storyThreadId: args.storyThreadId,
      orderInThread: args.orderInThread,
      updatedAt: Date.now(),
    });
  },
});

// ===========================================================================
// M-4: createExplainer — Insert Explainer (PM Feature 2, 1:1 unique)
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
// M-5: updateExplainer — Patch Explainer
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
// M-6: createImpactChain — Insert ImpactChain (PM Feature 3)
// ===========================================================================

/**
 * Create an impact chain linked to a story thread.
 * 스토리 스레드에 연결된 임팩트 체인 생성.
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
    const thread = await ctx.db.get(args.storyThreadId);
    if (!thread) throw new Error("Thread not found");

    return await ctx.db.insert("impactChains", {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

// ===========================================================================
// M-7: addImpactNode — Insert ImpactNode
// ===========================================================================

/**
 * Add a node to an impact chain.
 * 임팩트 체인에 노드 추가.
 */
export const addImpactNode = mutation({
  args: {
    chainId: v.id("impactChains"),
    parentNodeId: v.optional(v.id("impactNodes")),
    label: v.string(),
    labelKo: v.string(),
    description: v.optional(v.string()),
    descriptionKo: v.optional(v.string()),
    ordinal: v.number(),
  },
  handler: async (ctx, args) => {
    const chain = await ctx.db.get(args.chainId);
    if (!chain) throw new Error("Chain not found");

    if (args.parentNodeId) {
      const parent = await ctx.db.get(args.parentNodeId);
      if (!parent) throw new Error("Parent node not found");
      if (parent.chainId !== args.chainId) {
        throw new Error("Parent node belongs to a different chain");
      }
    }

    return await ctx.db.insert("impactNodes", {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

// ===========================================================================
// M-8: removeImpactNode — Delete ImpactNode
// ===========================================================================

/**
 * Remove a node from an impact chain.
 * 임팩트 체인에서 노드 제거.
 */
export const removeImpactNode = mutation({
  args: { nodeId: v.id("impactNodes") },
  handler: async (ctx, args) => {
    const node = await ctx.db.get(args.nodeId);
    if (!node) throw new Error("Node not found");

    // Check for children — prevent orphaning
    const children = await ctx.db
      .query("impactNodes")
      .withIndex("by_parentNodeId", (q) =>
        q.eq("parentNodeId", args.nodeId),
      )
      .collect();
    if (children.length > 0) {
      throw new Error("Cannot remove node with children. Remove children first.");
    }

    await ctx.db.delete(args.nodeId);
  },
});

// ===========================================================================
// M-9: updateUserProfile — Patch User
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
