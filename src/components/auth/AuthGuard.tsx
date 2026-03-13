/**
 * 인라인 인증 가드 — 인증 여부에 따라 콘텐츠 표시.
 * Inline authentication guard — shows content based on auth state.
 */
import type { ReactNode } from "react";
import { Spinner } from "../ui/Spinner";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
