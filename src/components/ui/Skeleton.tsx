/**
 * Skeleton loading placeholders for content-shaped loading states.
 * 콘텐츠 형태의 로딩 상태를 위한 스켈레톤 컴포넌트.
 */
import { cn } from "../../lib/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton", className)} />;
}

export function ArticleSkeleton() {
  return (
    <div className="rounded-xl border glass-panel p-5 space-y-3 animate-in">
      <Skeleton className="h-4 w-16 rounded-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-4/5" />
      <div className="space-y-2 pt-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border glass-panel p-4">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
      <Skeleton className="h-5 w-12 shrink-0 rounded-full" />
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <ArticleSkeleton />
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-in" style={{ animationDelay: `${i * 60}ms` }}>
          <ListItemSkeleton />
        </div>
      ))}
    </div>
  );
}
