/**
 * Explainer model helpers — read helper + validation guard.
 *
 * Covers: Q: articleExplainer (delegated to article.ts).
 * F-2: validateExplainerCreate (1:1 unique constraint guard).
 */
import type { QueryCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

/**
 * F-2: Returns false if an explainer already exists for this article.
 * 이 기사에 대한 설명이 이미 존재하면 false 반환.
 */
export async function validateExplainerCreate(
  ctx: QueryCtx,
  newsArticleId: Id<"newsArticles">,
): Promise<boolean> {
  const existing = await ctx.db
    .query("explainers")
    .withIndex("by_newsArticleId", (q) =>
      q.eq("newsArticleId", newsArticleId),
    )
    .first();
  return existing === null;
}
