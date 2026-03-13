/**
 * Feed keyword store — Zustand with Capacitor-safe persistence.
 * 피드 키워드 저장소 — Capacitor Preferences API 우선, localStorage 폴백.
 *
 * Fix: localStorage는 Capacitor WebView에서 앱 업데이트/캐시 클리어 시
 * 데이터 소실 가능. Capacitor Preferences API를 우선 사용합니다.
 */
import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import { Capacitor } from "@capacitor/core";

/** Cached Preferences module to avoid repeated dynamic imports */
var _prefsModule: typeof import("@capacitor/preferences") | null = null;

async function getPreferences() {
  if (!_prefsModule) {
    _prefsModule = await import("@capacitor/preferences");
  }
  return _prefsModule.Preferences;
}

/**
 * Capacitor-safe storage adapter.
 * Native: @capacitor/preferences (안전, module cached)
 * Web: localStorage (기존 동작 유지)
 */
const createCapacitorStorage = (): StateStorage => {
  if (!Capacitor.isNativePlatform()) {
    return {
      getItem: (name) => localStorage.getItem(name),
      setItem: (name, value) => localStorage.setItem(name, value),
      removeItem: (name) => localStorage.removeItem(name),
    };
  }

  return {
    getItem: async (name) => {
      const Preferences = await getPreferences();
      const { value } = await Preferences.get({ key: name });
      return value;
    },
    setItem: async (name, value) => {
      const Preferences = await getPreferences();
      await Preferences.set({ key: name, value });
    },
    removeItem: async (name) => {
      const Preferences = await getPreferences();
      await Preferences.remove({ key: name });
    },
  };
};

interface FeedState {
  keywords: string[];
  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;
  clearKeywords: () => void;
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
      clearKeywords: () => set({ keywords: [] }),
    }),
    {
      name: "saveticker-feed-keywords",
      storage: createJSONStorage(createCapacitorStorage),
    },
  ),
);
