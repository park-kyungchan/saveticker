/**
 * 필드 가시성 가드 — 역할에 따라 필드 표시/숨김.
 * Field visibility guard — omits fields based on role.
 */
import type { ReactNode } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { resolveRole, shouldOmitField } from "../../lib/security";

interface FieldVisibilityProps {
  entity: string;
  field: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FieldVisibility({ entity, field, children, fallback }: FieldVisibilityProps) {
  const { userId } = useCurrentUser();
  const role = resolveRole(userId);

  if (shouldOmitField(entity, field, role)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
