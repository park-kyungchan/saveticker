/** StoryThread — Chronological narrative grouping. / 시간순 내러티브 그룹. */
export interface StoryThread {
  readonly id: string;
  title: string;
  titleKo: string;
  description?: string;
  descriptionKo?: string;
  status: "active" | "completed";
  updatedAt: Date;
  updatedBy?: string;
}
