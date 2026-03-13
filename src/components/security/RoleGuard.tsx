/**
 * 역할 기반 가드 — CUD 버튼을 역할에 따라 표시/숨김.
 * Role-based guard — shows/hides CUD buttons per role.
 */
import type { ReactNode } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { resolveRole, canPerform, type Action } from "../../lib/security";

interface RoleGuardProps {
  entity: string;
  action: Action;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({ entity, action, children, fallback }: RoleGuardProps) {
  const { userId } = useCurrentUser();
  const role = resolveRole(userId);

  if (!canPerform(role, entity, action)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
