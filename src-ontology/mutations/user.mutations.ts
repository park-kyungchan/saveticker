/** updateUserProfile params / 사용자 프로필 수정 파라미터 */
export interface UpdateUserProfileParams {
  userId: string;
  displayName?: string;
  preferredLanguage?: "ko" | "en";
}

/**
 * Update user display name or language preference.
 * 사용자 표시 이름 또는 언어 설정 변경.
 */
export function updateUserProfile(params: UpdateUserProfileParams): void {
  // TODO: persist — db.users.patch(params.userId, { ...provided fields, updatedAt: new Date() })
  throw new Error("Not implemented");
}
