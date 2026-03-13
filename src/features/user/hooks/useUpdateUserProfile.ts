/** Update a user's profile. / 사용자 프로필을 수정합니다. */
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useUpdateUserProfile() {
  return useMutation(api.mutations.updateUserProfile);
}
