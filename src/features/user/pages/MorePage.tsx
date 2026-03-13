/**
 * 더보기 탭 페이지 — 사용자 프로필 + 설정 링크.
 * More tab page — user profile + settings links.
 */
import { useNavigate } from "react-router";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { useAuthStore } from "../../../stores/authStore";
import { UserProfile } from "../components/UserProfile";
import { UserPicker } from "../../../components/auth/UserPicker";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Button } from "../../../components/ui/Button";

/** Navigation link items / 네비게이션 링크 항목 */
const navLinks = [
  { path: "/profile", label: "프로필 설정" },
] as const;

/**
 * 더보기 페이지 컴포넌트.
 * More page component with user profile and quick navigation links.
 */
export function MorePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useCurrentUser();
  const clearUser = useAuthStore((s) => s.clearUser);

  return (
    <div data-label="more.page" className="space-y-6">
      <PageHeader title="내 정보" />

      {/* User section / 사용자 섹션 */}
      <section data-label="more.page.userSection" className="space-y-3">
        {isAuthenticated && user ? (
          <>
            <UserProfile user={user} />
            <Button
              data-label="more.page.logout"
              variant="danger"
              size="sm"
              className="w-full"
              onClick={clearUser}
            >
              로그아웃
            </Button>
          </>
        ) : (
          <UserPicker />
        )}
      </section>

      {/* Navigation links / 네비게이션 링크 */}
      <section data-label="more.page.links" className="space-y-2">
        <h2
          data-label="more.page.links.title"
          className="text-xs font-medium uppercase tracking-wider text-ink-muted"
        >
          바로가기
        </h2>
        {navLinks.map((link) => (
          <button
            key={link.path}
            type="button"
            data-label={`more.page.links.item.${link.path}`}
            onClick={() => navigate(link.path)}
            className="flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium text-ink glass-panel transition-colors hover:bg-white/5 active:bg-white/10 min-h-[44px]"
          >
            <span>{link.label}</span>
            <svg
              className="size-4 text-ink-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
            </svg>
          </button>
        ))}
      </section>
    </div>
  );
}
