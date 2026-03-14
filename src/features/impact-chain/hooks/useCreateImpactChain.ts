/** Create a new impact chain. / 새 영향 체인을 생성합니다. */
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useCreateImpactChain() {
  return useMutation(api.mutations.createImpactChain);
}
