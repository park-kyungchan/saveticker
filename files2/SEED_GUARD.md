/**
 * Seed idempotency guard — add this at the top of seedAll handler.
 * seed 멱등성 가드 — seedAll handler 시작 부분에 추가.
 *
 * Usage: Replace the first line of seedAll handler with:
 *   const existing = await ctx.db.query("stocks").first();
 *   if (existing) {
 *     console.log("Database already seeded — skipping");
 *     return { skipped: true };
 *   }
 */

// In convex/seed.ts, change:
//
// export const seedAll = internalMutation({
//   args: {},
//   handler: async (ctx) => {
//     // ... existing seed logic
//
// To:
//
// export const seedAll = internalMutation({
//   args: { force: v.optional(v.boolean()) },
//   handler: async (ctx, args) => {
//     // Idempotency guard — prevent duplicate seeding
//     if (!args.force) {
//       const existing = await ctx.db.query("stocks").first();
//       if (existing) {
//         console.log("Database already seeded. Pass { force: true } to re-seed.");
//         return { skipped: true, reason: "already_seeded" };
//       }
//     }
//     // ... rest of seed logic
//   },
// });
//
// Also add at the top of the file:
// import { v } from "convex/values";
