/**
 * Date formatting utilities for Korean locale.
 * 한국어 로케일 날짜 포맷 유틸리티.
 */

/** Format timestamp as Korean date (e.g., "3월 12일 (수)") / 타임스탬프를 한국어 날짜로 포맷 */
export function formatDate(ts: number): string {
  return new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "short" }).format(new Date(ts));
}

/** Format timestamp as Korean date+time (e.g., "3월 12일 오후 2:30") / 타임스탬프를 한국어 날짜+시간으로 포맷 */
export function formatDateTime(ts: number): string {
  return new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(ts));
}
