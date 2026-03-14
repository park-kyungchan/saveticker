/**
 * Tag Filter Strip — 시맨틱 태그 필터 가로 스크롤.
 * Horizontal tag-based filter strip with semantic colors.
 */
import { cn } from "../../../lib/cn";

interface TagFilterStripProps {
  tags: string[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
  className?: string;
}

const tagColors: Record<string, { bg: string; text: string; activeBg: string }> = {
  "에너지":     { bg: "bg-accent-4/8",  text: "text-accent-4/70",  activeBg: "bg-accent-4/20 text-accent-4 border-accent-4/30" },
  "지정학":     { bg: "bg-danger/8",     text: "text-danger/70",     activeBg: "bg-danger/20 text-danger border-danger/30" },
  "사모신용":   { bg: "bg-accent-5/8",   text: "text-accent-5/70",   activeBg: "bg-accent-5/20 text-accent-5 border-accent-5/30" },
  "기업분석":   { bg: "bg-info/8",       text: "text-info/70",       activeBg: "bg-info/20 text-info border-info/30" },
  "경제지표":   { bg: "bg-accent-3/8",   text: "text-accent-3/70",   activeBg: "bg-accent-3/20 text-accent-3 border-accent-3/30" },
  "헤드라인":   { bg: "bg-accent-2/8",   text: "text-accent-2/70",   activeBg: "bg-accent-2/20 text-accent-2 border-accent-2/30" },
  "암호화폐":   { bg: "bg-warning/8",    text: "text-warning/70",    activeBg: "bg-warning/20 text-warning border-warning/30" },
  "정보":       { bg: "bg-white/5",      text: "text-ink-muted/70",  activeBg: "bg-white/15 text-ink border-white/20" },
};

const defaultColor = { bg: "bg-white/5", text: "text-ink-muted/70", activeBg: "bg-white/15 text-ink border-white/20" };

export function TagFilterStrip({ tags, activeTag, onTagChange, className }: TagFilterStripProps) {
  if (tags.length === 0) return null;

  return (
    <div
      data-label="news.tagFilter"
      className={cn("flex gap-1.5 overflow-x-auto scrollbar-none -mx-4 px-4 pb-1", className)}
    >
      {/* "All" chip */}
      <button
        type="button"
        onClick={() => onTagChange(null)}
        className={cn(
          "shrink-0 rounded-full border px-3 py-1 text-[11px] font-medium transition-all min-h-[32px]",
          activeTag === null
            ? "bg-brand/20 text-brand border-brand/30"
            : "bg-white/5 text-ink-muted/60 border-transparent hover:bg-white/8",
        )}
      >
        전체
      </button>

      {tags.map((tag) => {
        const color = tagColors[tag] ?? defaultColor;
        const isActive = activeTag === tag;

        return (
          <button
            key={tag}
            type="button"
            onClick={() => onTagChange(isActive ? null : tag)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-[11px] font-medium transition-all min-h-[32px]",
              isActive
                ? color.activeBg
                : cn(color.bg, color.text, "border-transparent hover:border-white/10"),
            )}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
