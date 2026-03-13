/**
 * Prototype auth store — simulates authentication for portfolio demo.
 * 프로토타입 인증 스토어 — 포트폴리오 데모를 위한 인증 시뮬레이션.
 */
import { create } from "zustand";

interface AuthState {
  /** Current user ID (null = guest) / 현재 사용자 ID (null = 게스트) */
  userId: string | null;
  /** Set authenticated user / 인증 사용자 설정 */
  setUserId: (id: string) => void;
  /** Clear auth (logout) / 인증 해제 (로그아웃) */
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
  clearUser: () => set({ userId: null }),
}));
