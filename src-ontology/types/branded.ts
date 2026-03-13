/**
 * Branded types and validator functions from ontology ValueTypes.
 * 온톨로지 ValueType에서 생성된 브랜디드 타입 및 검증 함수.
 */

/**
 * Stock ticker symbol. 1-5 uppercase letters.
 * 주식 티커 심볼. 대문자 1-5자.
 */
export type Ticker = string & { readonly __brand: "Ticker" };

export function validateTicker(value: string): Ticker {
  if (!/^[A-Z]{1,5}$/.test(value)) throw new Error("Ticker must be 1-5 uppercase letters");
  return value as Ticker;
}

/**
 * Valid email address format.
 * 유효한 이메일 주소 형식.
 */
export type EmailAddress = string & { readonly __brand: "EmailAddress" };

export function validateEmail(value: string): EmailAddress {
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) throw new Error("Must be a valid email address");
  return value as EmailAddress;
}

/**
 * Positive monetary value in USD.
 * 양수 화폐 값 (USD).
 */
export type Price = number & { readonly __brand: "Price" };

export function validatePrice(value: number): Price {
  if (value < 0) throw new Error("Price must be positive");
  return value as Price;
}

/**
 * Percentage change with bounds -100 to 10000.
 * 변동률. 범위: -100 ~ 10000.
 */
export type PercentageChange = number & { readonly __brand: "PercentageChange" };

export function validatePercentageChange(value: number): PercentageChange {
  if (value < -100 || value > 10000) throw new Error("Percentage out of bounds");
  return value as PercentageChange;
}

/**
 * Valid HTTPS article URL.
 * 유효한 HTTPS 기사 URL.
 */
export type ArticleUrl = string & { readonly __brand: "ArticleUrl" };

export function validateArticleUrl(value: string): ArticleUrl {
  if (!/^https:\/\//.test(value)) throw new Error("Must be a valid HTTPS URL");
  return value as ArticleUrl;
}
