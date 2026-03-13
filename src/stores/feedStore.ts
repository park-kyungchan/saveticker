/**
 * Feed keyword store — Zustand with localStorage persistence.
 * 피드 키워드 저장소 — Zustand + localStorage 영속화.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FeedState {
  keywords: string[];
  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;
}

export const useFeedStore = create<FeedState>()(
  persist(
    (set) => ({
      keywords: [],
      addKeyword: (keyword) =>
        set((state) => ({
          keywords: state.keywords.includes(keyword)
            ? state.keywords
            : [...state.keywords, keyword],
        })),
      removeKeyword: (keyword) =>
        set((state) => ({
          keywords: state.keywords.filter((k) => k !== keyword),
        })),
    }),
    { name: "saveticker-feed-keywords" },
  ),
);
