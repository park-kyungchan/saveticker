/**
 * Struct types from ontology StructTypes.
 * 온톨로지 StructType에서 생성된 구조체 타입.
 */

/**
 * Source attribution for news articles and economic indicators.
 * 뉴스 기사 및 경제지표 출처 정보.
 */
export interface SourceAttribution {
  /** Name of the content source / 콘텐츠 출처 이름 */
  sourceName: string;
  /** URL of the content source / 콘텐츠 출처 URL */
  sourceUrl?: string;
  /** Logo URL of the content source / 콘텐츠 출처 로고 URL */
  sourceLogoUrl?: string;
}
