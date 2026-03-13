/** Add a node to an impact chain. / 임팩트 체인에 노드 추가. */

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useAddImpactNode() {
  return useMutation(api.mutations.addImpactNode);
}
