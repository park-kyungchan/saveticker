/** Create a new article explainer. / 새 기사 해설을 생성합니다. */

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useCreateArticleExplainer() {
  return useMutation(api.mutations.createExplainer);
}
