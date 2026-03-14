/**
 * Fetch the most viewed article in the last 24h for hero card.
 * 24시간 내 최다 조회 기사를 hero 카드용으로 조회합니다.
 *
 * `since` is bucketed to the nearest hour so the Convex subscription
 * stays stable — without bucketing, Date.now() would change every ms,
 * creating a new subscription on every render.
 */
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

/** Bucket timestamp to the nearest hour for stable Convex subscriptions. */
function bucketToHour(ts: number): number {
  const ONE_HOUR = 60 * 60 * 1000;
  return Math.floor(ts / ONE_HOUR) * ONE_HOUR;
}

export function useTodayHero() {
  const since = bucketToHour(Date.now()) - 24 * 60 * 60 * 1000;
  return useQuery(api.queries.getTodayHero, { since });
}
