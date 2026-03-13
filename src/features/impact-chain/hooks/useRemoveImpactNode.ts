/** Remove a node from an impact chain. / 임팩트 체인에서 노드 제거. */

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useRemoveImpactNode() {
  return useMutation(api.mutations.removeImpactNode);
}
