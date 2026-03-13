/** Fetch all users. / 전체 사용자 목록을 조회합니다. */
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useAllUsers() {
  return useQuery(api.queries.getAllUsers, {});
}
