/** Fetch story threads filtered by status. / 상태별로 스토리 스레드를 조회합니다. */

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useThreadsByStatus(status?: "active" | "completed") {
  return useQuery(api.queries.getThreadsByStatus, { status });
}
