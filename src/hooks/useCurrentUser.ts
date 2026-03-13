/**
 * Hook for current authenticated user.
 * 현재 인증된 사용자를 위한 훅.
 */
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useAuthStore } from "../stores/authStore";

export function useCurrentUser() {
  const userId = useAuthStore((s) => s.userId);
  const user = useQuery(
    api.queries.getUserById,
    userId ? { userId: userId as Id<"users"> } : "skip",
  );

  return {
    userId: userId as Id<"users"> | null,
    user: user ?? null,
    isAuthenticated: userId !== null,
    isLoading: userId !== null && user === undefined,
  };
}
