/**
 * Relative time formatter for timestamps.
 * 타임스탬프를 상대 시간 문자열로 변환합니다.
 *
 * Handles: future timestamps, week/month/year units, negative diff guard.
 */
export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;

  // Future timestamp guard — seed data나 시간 동기화 이슈 대응
  if (diff < 0) {
    const absMins = Math.floor(Math.abs(diff) / 60000);
    if (absMins < 60) return `${absMins}분 후`;
    const absHours = Math.floor(absMins / 60);
    if (absHours < 24) return `${absHours}시간 후`;
    return `${Math.floor(absHours / 24)}일 후`;
  }

  const secs = Math.floor(diff / 1000);
  if (secs < 60) return "방금 전";

  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}분 전`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}주 전`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}개월 전`;

  const years = Math.floor(days / 365);
  return `${years}년 전`;
}

/**
 * Absolute date formatter — for items older than a threshold.
 * 절대 날짜 포맷터 — 특정 기간 이상 지난 항목에 사용.
 */
export function formatRelativeOrAbsolute(ts: number, absoluteThresholdDays = 30): string {
  const days = Math.floor((Date.now() - ts) / 86400000);
  if (days < absoluteThresholdDays) return timeAgo(ts);

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(ts));
}
