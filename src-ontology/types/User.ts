import type { EmailAddress } from "./branded.js";

/** User — App user identity. / 앱 사용자 정보. */
export interface User {
  readonly id: string;
  displayName: string;
  email: EmailAddress;
  preferredLanguage: "ko" | "en";
  updatedAt: Date;
  updatedBy?: string;
}
