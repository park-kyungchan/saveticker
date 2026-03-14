/**
 * SaveTicker — Convex Query Endpoints
 *
 * Thin wrappers calling convex/model/ helpers.
 * No business logic here — all logic lives in model files.
 *
 * @see ontology/logic.ts > queries
 */
import { query } from "./_generated/server";
import { v } from "convex/values";

import { recentArticles, articleById, articleExplainer, articlesByTicker, searchArticles, articlesByCategory, articlesBySource, articlesByTag, todayMostViewed } from "./model/article";
import { allThreads, threadById, threadArticles, threadsByStatus } from "./model/storyThread";
import { chainsByThread, chainNodes, chainById } from "./model/impactChain";
import { stockById, stockByTicker } from "./model/stock";
import { userById, allUsers } from "./model/user";

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

/**
 * Most viewed article in last 24h for hero card.
 * Client passes `since` (bucketed timestamp) to avoid Date.now() in query.
 * 24시간 내 최다 조회 기사 (hero 카드용). 클라이언트가 since를 전달.
 */
export const getTodayHero = query({
  args: { since: v.number() },
  handler: async (ctx, { since }) => {
    return await todayMostViewed(ctx, since);
  },
});

// ===========================================================================
// 2. Story Threads (PM Feature 1)
// ===========================================================================

/**
 * All story threads.
 * 전체 스토리 스레드 목록.
 */
export const getAllThreads = query({
  args: {},
  handler: async (ctx) => {
    return await allThreads(ctx);
  },
});

/**
 * Single thread by ID.
 * ID로 단일 스레드 조회.
 */
export const getThreadById = query({
  args: { threadId: v.id("storyThreads") },
  handler: async (ctx, args) => {
    return await threadById(ctx, args.threadId);
  },
});

/**
 * Articles in a story thread, ordered by position.
 * 스레드 내 기사 목록 (순서대로).
 */
export const getThreadArticles = query({
  args: { threadId: v.id("storyThreads") },
  handler: async (ctx, args) => {
    return await threadArticles(ctx, args.threadId);
  },
});

/**
 * Story threads filtered by status.
 * 상태별 스토리 스레드 필터.
 */
export const getThreadsByStatus = query({
  args: { status: v.union(v.literal("active"), v.literal("completed")) },
  handler: async (ctx, args) => {
    return await threadsByStatus(ctx, args.status);
  },
});

// ===========================================================================
// 3. Impact Chains (PM Feature 3)
// ===========================================================================

/**
 * Impact chains for a story thread.
 * 스토리 스레드의 영향 체인 목록.
 */
export const getChainsByThread = query({
  args: { storyThreadId: v.id("storyThreads") },
  handler: async (ctx, args) => {
    return await chainsByThread(ctx, args.storyThreadId);
  },
});

/**
 * Nodes in an impact chain, ordered by ordinal.
 * 영향 체인의 노드 목록 (ordinal 순).
 */
export const getChainNodes = query({
  args: { chainId: v.id("impactChains") },
  handler: async (ctx, args) => {
    return await chainNodes(ctx, args.chainId);
  },
});

/**
 * Single impact chain by ID.
 * ID로 단일 영향 체인 조회.
 */
export const getChainById = query({
  args: { chainId: v.id("impactChains") },
  handler: async (ctx, args) => {
    return await chainById(ctx, args.chainId);
  },
});

// ===========================================================================
// 4. Article Detail
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
// 3. Utility Lookups
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
