/** createStoryThread params / 스토리 스레드 생성 파라미터 */
export interface CreateStoryThreadParams {
  title: string;
  titleKo: string;
  description?: string;
  descriptionKo?: string;
  status?: "active" | "completed";
}

/**
 * Create a new story thread for narrative grouping.
 * 내러티브 그룹용 새 스토리 스레드 생성.
 */
export function createStoryThread(params: CreateStoryThreadParams): void {
  // TODO: persist — db.storyThreads.insert({ ...params, status: params.status ?? "active", updatedAt })
  throw new Error("Not implemented");
}

/** updateStoryThread params / 스토리 스레드 수정 파라미터 */
export interface UpdateStoryThreadParams {
  storyThreadId: string;
  title?: string;
  titleKo?: string;
  description?: string;
  descriptionKo?: string;
  status?: "active" | "completed";
}

/**
 * Update an existing story thread.
 * 기존 스토리 스레드 수정.
 */
export function updateStoryThread(params: UpdateStoryThreadParams): void {
  // TODO: persist — db.storyThreads.patch(id, { ...provided fields, updatedAt })
  throw new Error("Not implemented");
}
