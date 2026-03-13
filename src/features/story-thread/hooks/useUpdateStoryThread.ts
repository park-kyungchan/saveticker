/** Update an existing story thread. / 기존 스토리 스레드를 수정합니다. */

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useUpdateStoryThread() {
  return useMutation(api.mutations.updateStoryThread);
}
