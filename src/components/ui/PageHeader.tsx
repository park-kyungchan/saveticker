/**
 * 페이지 헤더 — 제목 + 뒤로가기 버튼.
 * Page header with title and optional back button.
 */
import { type ReactNode } from "react";
import { BackButton } from "./BackButton";
import { cn } from "../../lib/cn";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, showBack = false, action, className }: PageHeaderProps) {
  return (
    <div data-label="shared.pageHeader" className={cn("flex items-center justify-between gap-3 pb-4", className)}>
      <div className="flex items-center gap-3 min-w-0">
        {showBack && <BackButton />}
        <h1 data-label="shared.pageHeader.title" className="text-lg font-display truncate">{title}</h1>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
