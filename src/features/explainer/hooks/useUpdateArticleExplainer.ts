/** Update an existing article explainer. / 기존 기사 해설을 수정합니다. */

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useUpdateArticleExplainer() {
  return useMutation(api.mutations.updateExplainer);
}
