/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as crons from "../crons.js";
import type * as model_article from "../model/article.js";
import type * as model_auth from "../model/auth.js";
import type * as model_explainer from "../model/explainer.js";
import type * as model_impactChain from "../model/impactChain.js";
import type * as model_security from "../model/security.js";
import type * as model_stock from "../model/stock.js";
import type * as model_thread from "../model/thread.js";
import type * as model_user from "../model/user.js";
import type * as mutations from "../mutations.js";
import type * as queries from "../queries.js";
import type * as seed from "../seed.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  crons: typeof crons;
  "model/article": typeof model_article;
  "model/auth": typeof model_auth;
  "model/explainer": typeof model_explainer;
  "model/impactChain": typeof model_impactChain;
  "model/security": typeof model_security;
  "model/stock": typeof model_stock;
  "model/thread": typeof model_thread;
  "model/user": typeof model_user;
  mutations: typeof mutations;
  queries: typeof queries;
  seed: typeof seed;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
