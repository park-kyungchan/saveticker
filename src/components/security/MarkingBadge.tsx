/**
 * 개인정보 마킹 배지 — PersonalData 마킹 필드 표시.
 * Personal data marking badge — indicates fields with PersonalData marking.
 */
import { cn } from "../../lib/cn";

interface MarkingBadgeProps {
  marking: "PersonalData";
  className?: string;
}

export function MarkingBadge({ marking, className }: MarkingBadgeProps) {
  return (
    <span
      data-label="shared.markingBadge"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
        marking === "PersonalData" && "bg-warning/10 border-warning/25 text-warning",
        className,
      )}
    >
      <svg viewBox="0 0 16 16" fill="currentColor" className="size-3">
        <path d="M8 1a3 3 0 0 0-3 3v1H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V4a3 3 0 0 0-3-3zm1 4V4a1 1 0 1 0-2 0v1h2z" />
      </svg>
      {marking === "PersonalData" ? "개인정보" : marking}
    </span>
  );
}
