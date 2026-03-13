/**
 * User profile card — avatar, display name, email, language, last update.
 * 사용자 프로필 카드 — 아바타, 이름, 이메일, 언어, 최종 수정 시각.
 */
import { cn } from "../../../lib/cn";
import { recipes } from "../../../theme/recipes";
import { timeAgo } from "../../../lib/timeAgo";
import type { Doc } from "../../../../convex/_generated/dataModel";

interface UserProfileProps {
  /** User document / 사용자 문서 */
  user: Doc<"users">;
  /** Additional class names / 추가 클래스 */
  className?: string;
}


export function UserProfile({ user, className }: UserProfileProps) {
  const initial = user.displayName.charAt(0).toUpperCase();
  const colorIndex = user.displayName.charCodeAt(0) % recipes.avatar.colors.length;

  return (
    <div
      data-label="user.profile"
      className={cn(recipes.card.base, "glass-panel animate-in", className)}
    >
      <div data-label="user.profile.content" className="flex items-center gap-4">
        {/* Avatar circle */}
        <div
          data-label="user.profile.avatar"
          className={cn(
            "flex shrink-0 items-center justify-center",
            recipes.avatar.shape,
            recipes.avatar.size,
            recipes.avatar.colors[colorIndex],
          )}
          aria-hidden="true"
        >
          <span className={recipes.avatar.textClass}>{initial}</span>
        </div>

        {/* Info column */}
        <div data-label="user.profile.info" className="min-w-0 flex-1 space-y-1">
          <p
            data-label="user.profile.name"
            className="truncate text-lg font-medium text-ink"
          >
            {user.displayName}
          </p>
          <p
            data-label="user.profile.email"
            className="truncate text-sm text-ink-muted"
          >
            {user.email}
          </p>
          <div data-label="user.profile.meta" className="flex items-center gap-2">
            <span
              data-label="user.profile.updatedAt"
              className="text-xs text-ink-muted"
            >
              {timeAgo(user.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
