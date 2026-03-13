/**
 * 프로토타입 사용자 선택기 — 데모용 사용자 전환.
 * Prototype user picker — switch users for demo purposes.
 */
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuthStore } from "../../stores/authStore";
import { cn } from "../../lib/cn";
import { Spinner } from "../ui/Spinner";

export function UserPicker() {
  const users = useQuery(api.queries.getAllUsers);
  const setUserId = useAuthStore((s) => s.setUserId);

  if (users === undefined) {
    return (
      <div className="flex justify-center py-4">
        <Spinner size="sm" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <p className="text-sm text-ink-muted text-center py-4">
        사용자가 없습니다. 시드 데이터를 먼저 추가하세요.
      </p>
    );
  }

  return (
    <div data-label="shared.userPicker" className="space-y-2">
      <p data-label="shared.userPicker.instruction" className="text-xs text-ink-muted text-center">
        데모 사용자를 선택하세요
      </p>
      <div className="space-y-1.5">
        {users.map((user, index) => (
          <button
            key={user._id}
            data-label={`shared.userPicker.user[${index}]`}
            type="button"
            onClick={() => setUserId(user._id)}
            className={cn(
              "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors min-h-[44px]",
              "glass-panel hover:bg-white/10 active:bg-white/15",
            )}
          >
            <span data-label={`shared.userPicker.user[${index}].name`} className="font-medium text-ink">{user.displayName}</span>
            <span data-label={`shared.userPicker.user[${index}].email`} className="ml-2 text-xs text-ink-muted">{user.email}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
