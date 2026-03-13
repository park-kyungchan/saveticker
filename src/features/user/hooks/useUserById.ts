/** Fetch a single user by ID. / ID로 개별 사용자를 조회합니다. */
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export function useUserById(userId: string | undefined) {
  return useQuery(api.queries.getUserById, userId ? { userId: userId as Id<"users"> } : "skip");
}
