/** Create a new impact chain. / 새 임팩트 체인 생성. */

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useCreateImpactChain() {
  return useMutation(api.mutations.createImpactChain);
}
