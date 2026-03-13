/**
 * 프로필 상세 페이지 — 사용자 프로필 상세 표시.
 * Profile detail page — displays user profile details.
 */
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { UserProfile } from "../components/UserProfile";
import { PageHeader } from "../../../components/ui/PageHeader";
import { Spinner } from "../../../components/ui/Spinner";
import { EmptyState } from "../../../components/ui/EmptyState";
import { FieldVisibility } from "../../../components/security/FieldVisibility";

/**
 * 프로필 상세 페이지 컴포넌트.
 * Profile detail page component showing current user information.
 */
export function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useCurrentUser();

  return (
    <div data-label="profile.page" className="space-y-4">
      <PageHeader showBack title="프로필" />

      {/* Content / 콘텐츠 */}
      {isLoading ? (
        <div data-label="profile.page.loading" className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : !isAuthenticated || !user ? (
        <EmptyState
          title="로그인이 필요합니다"
          description="프로필을 보려면 먼저 로그인하세요"
        />
      ) : (
        <section data-label="profile.page.content" className="space-y-4 animate-in">
          <UserProfile user={user} />

          {/* Profile details / 프로필 상세 정보 */}
          <div
            data-label="profile.page.details"
            className="rounded-xl border p-4 glass-panel space-y-3"
          >
            <h2
              data-label="profile.page.details.title"
              className="text-sm font-medium text-ink"
            >
              계정 정보
            </h2>
            <dl data-label="profile.page.details.list" className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt data-label="profile.page.details.nameLabel" className="text-ink-muted">
                  이름
                </dt>
                <dd data-label="profile.page.details.nameValue" className="font-medium text-ink">
                  {user.displayName}
                </dd>
              </div>
              <FieldVisibility entity="User" field="email">
                <div className="flex justify-between">
                  <dt data-label="profile.page.details.emailLabel" className="text-ink-muted">
                    이메일
                  </dt>
                  <dd data-label="profile.page.details.emailValue" className="font-medium text-ink">
                    {user.email}
                  </dd>
                </div>
              </FieldVisibility>
            </dl>
          </div>
        </section>
      )}
    </div>
  );
}
