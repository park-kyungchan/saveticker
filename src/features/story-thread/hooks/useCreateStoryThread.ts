/** Create a new story thread. / 새 스토리 스레드를 생성합니다. */

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useCreateStoryThread() {
  return useMutation(api.mutations.createStoryThread);
}
