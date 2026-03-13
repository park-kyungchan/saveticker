/**
 * 뒤로가기 버튼 — 이전 페이지로 이동.
 * Back button — navigates to previous page.
 */
import { useNavigate } from "react-router";
import { cn } from "../../lib/cn";

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      data-label="shared.backButton"
      type="button"
      onClick={() => navigate(-1)}
      className={cn("inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink active:opacity-70 transition-colors min-h-[44px] min-w-[44px] px-1", className)}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      뒤로
    </button>
  );
}
