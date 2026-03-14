/**
 * Hook: all story threads.
 * 전체 스토리 스레드 목록.
 */
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useAllThreads() {
  return useQuery(api.queries.getAllThreads);
}
