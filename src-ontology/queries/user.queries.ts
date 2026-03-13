import type { User } from "../types/index.js";

/**
 * Single user by ID.
 * ID로 단일 사용자 조회.
 * @queryType getById
 */
export function userById(params: { userId: string }): User | null {
  // TODO: persist — adapter query implementation
  throw new Error("Not implemented");
}

/**
 * All users. Prototype-only (demo user picker).
 * 전체 사용자. 프로토타입 전용.
 * @queryType list
 */
export function allUsers(): User[] {
  // TODO: persist — adapter query implementation
  throw new Error("Not implemented");
}
