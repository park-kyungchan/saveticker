/**
 * SaveTicker — Convex Query Endpoints (14 queries)
 *
 * Thin wrappers calling convex/model/ helpers.
 * No business logic here — all logic lives in model files.
 *
 * @see ontology/logic.ts > queries
 */
import { query } from "./_generated/server";
import { v } from "convex/values";

import { recentArticles, articleById, articleExplainer, articlesByTicker, searchArticles, articlesByCategory, articlesBySource, articlesByTag } from "./model/article";
import { stockById, stockByTicker } from "./model/stock";
import { threadsByStatus, threadArticlesList, threadById, allThreads } from "./model/thread";
import { userById, allUsers } from "./model/user";
import { chainsByThread, chainNodes } from "./model/impactChain";

// ===========================================================================
// 1. Feed & Discovery
// ===========================================================================

/**
 * Latest news feed, newest first.
 * 최신 뉴스 피드, 최신순.
 */
export const getRecentArticles = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await recentArticles(ctx, args.limit ?? 20);
  },
});

/**
 * Articles mentioning a specific ticker symbol.
 * 특정 티커 심볼을 언급하는 기사.
 */
export const getArticlesByTicker = query({
  args: { ticker: v.string() },
  handler: async (ctx, args) => {
    return await articlesByTicker(ctx, args.ticker);
  },
});

/**
 * Article title prefix search.
 * 기사 제목 접두어 검색.
 */
export const getSearchArticles = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await searchArticles(ctx, args.query, args.limit ?? 10);
  },
});

/**
 * Articles filtered by category.
 * 카테고리별 기사 필터.
 */
export const getArticlesByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await articlesByCategory(ctx, args.category);
  },
});

/**
 * Articles filtered by source name.
 * 출처 이름별 기사 필터.
 */
export const getArticlesBySource = query({
  args: { sourceName: v.string() },
  handler: async (ctx, args) => {
    return await articlesBySource(ctx, args.sourceName);
  },
});

/**
 * Articles containing a specific tag.
 * 특정 태그를 포함하는 기사 필터.
 */
export const getArticlesByTag = query({
  args: { tag: v.string() },
  handler: async (ctx, args) => {
    return await articlesByTag(ctx, args.tag);
  },
});

// ===========================================================================
// 2. Article Detail
// ===========================================================================

/**
 * Single article by ID.
 * ID로 단일 기사 조회.
 */
export const getArticleById = query({
  args: { articleId: v.id("newsArticles") },
  handler: async (ctx, args) => {
    return await articleById(ctx, args.articleId);
  },
});

/**
 * 1:1 explainer lookup for Easy Explanation tab.
 * 쉬운 설명 탭용 1:1 설명 조회.
 */
export const getArticleExplainer = query({
  args: { newsArticleId: v.id("newsArticles") },
  handler: async (ctx, args) => {
    return await articleExplainer(ctx, args.newsArticleId);
  },
});

// ===========================================================================
// 3. Story Threads
// ===========================================================================

/**
 * Active or completed threads.
 * 활성 또는 완료된 스레드.
 */
export const getThreadsByStatus = query({
  args: {
    status: v.optional(v.union(v.literal("active"), v.literal("completed"))),
  },
  handler: async (ctx, args) => {
    return await threadsByStatus(ctx, args.status);
  },
});

/**
 * Articles in a story thread, ordered by orderInThread.
 * 스토리 스레드 내 기사, orderInThread 순.
 */
export const getThreadArticlesList = query({
  args: { storyThreadId: v.id("storyThreads") },
  handler: async (ctx, args) => {
    return await threadArticlesList(ctx, args.storyThreadId);
  },
});

/**
 * Single thread by ID.
 * ID로 단일 스레드 조회.
 */
export const getThreadById = query({
  args: { storyThreadId: v.id("storyThreads") },
  handler: async (ctx, args) => {
    return await threadById(ctx, args.storyThreadId);
  },
});

/**
 * All threads (prototype demo).
 * 전체 스레드 (프로토타입 데모).
 */
export const getAllThreads = query({
  args: {},
  handler: async (ctx) => {
    return await allThreads(ctx);
  },
});

// ===========================================================================
// 4. Impact Chains (PM Feature 3)
// ===========================================================================

/**
 * Impact chains for a story thread.
 * 스토리 스레드의 임팩트 체인.
 */
export const getChainsByThread = query({
  args: { storyThreadId: v.id("storyThreads") },
  handler: async (ctx, args) => {
    return await chainsByThread(ctx, args.storyThreadId);
  },
});

/**
 * All nodes for an impact chain.
 * 임팩트 체인의 모든 노드.
 */
export const getChainNodes = query({
  args: { chainId: v.id("impactChains") },
  handler: async (ctx, args) => {
    return await chainNodes(ctx, args.chainId);
  },
});

// ===========================================================================
// 5. Utility Lookups
// ===========================================================================

/**
 * Single stock by ID.
 * ID로 단일 종목 조회.
 */
export const getStockById = query({
  args: { stockId: v.id("stocks") },
  handler: async (ctx, args) => {
    return await stockById(ctx, args.stockId);
  },
});

/**
 * Stock by ticker symbol.
 * 티커 심볼로 종목 조회.
 */
export const getStockByTicker = query({
  args: { ticker: v.string() },
  handler: async (ctx, args) => {
    return await stockByTicker(ctx, args.ticker);
  },
});

/**
 * Single user by ID.
 * ID로 단일 사용자 조회.
 */
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await userById(ctx, args.userId);
  },
});

/**
 * All users (prototype demo user picker).
 * 전체 사용자 (프로토타입 데모 사용자 선택기).
 */
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await allUsers(ctx);
  },
});
