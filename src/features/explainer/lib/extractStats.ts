/**
 * Extract financial statistics from Korean explainer text.
 * 한국어 해설 텍스트에서 금융 통계 추출.
 */
export interface StatItem {
  value: string;
  label: string;
  color: string;
}

const statColors = [
  "text-danger",
  "text-accent-1",
  "text-info",
  "text-warning",
  "text-accent-3",
];

/** Regex patterns for Korean financial text */
const patterns = [
  /(\d+(?:\.\d+)?%)\s*(.{2,12})/g,
  /(\$[\d,.]+(?:억|조)?)\s*(.{2,12})/g,
  /([\d,.]+(?:조|억|만)\s*(?:원|달러))\s*(.{2,12})/g,
  /([\d,.]+배)\s*(.{2,12})/g,
];

/**
 * Extract up to `max` stat items from text content.
 * 텍스트에서 최대 max개의 통계 항목 추출.
 */
export function extractStats(text: string, max: number = 3): StatItem[] {
  const results: StatItem[] = [];
  const seen = new Set<string>();

  for (const pattern of patterns) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const value = match[1].trim();
      if (seen.has(value)) continue;
      seen.add(value);
      results.push({
        value,
        label: match[2].trim().replace(/[,.;:—\-]$/, ""),
        color: statColors[results.length % statColors.length],
      });
      if (results.length >= max) return results;
    }
  }

  return results;
}
