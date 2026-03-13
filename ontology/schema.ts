/**
 * Ontology Schema Types
 * 온톨로지 스키마 타입 정의
 *
 * All ontology skills share these type definitions.
 * 모든 온톨로지 스킬이 이 타입 정의를 공유합니다.
 *
 * Usage: `as const satisfies OntologyData` pattern for compile-time validation.
 * 사용법: 컴파일 타임 검증을 위해 `as const satisfies OntologyData` 패턴 사용.
 */

// ============================================================================
// Base Types
// 기본 타입
// ============================================================================

/**
 * All base property types supported by the ontology.
 * Faithful to Palantir Foundry's official base-type list.
 *
 * 온톨로지에서 지원하는 모든 기본 프로퍼티 타입.
 * Palantir Foundry 공식 base-type 목록을 충실히 따름.
 */
export type BasePropertyType =
  | "string"
  | "integer"
  | "long"
  | "float"
  | "double"
  | "boolean"
  | "date"
  | "timestamp"
  | "geopoint"
  | "geoshape"
  | "attachment"
  | "mediaReference"
  | "timeseries"
  | "cipher"
  | "struct"
  | "vector"
  | "marking"
  | "FK"
  | "BrandedType";

// ============================================================================
// Bilingual Description
// 영한 병기 설명
// ============================================================================

/**
 * Bilingual description for all user-facing documentation.
 * 모든 사용자 대면 문서에 사용되는 영한 병기 설명.
 */
export interface BilingualDesc {
  /** English description / 영어 설명 */
  en: string;
  /** Korean description / 한국어 설명 */
  ko: string;
}

// ============================================================================
// Value Types & Constraints
// 값 타입 & 제약 조건
// ============================================================================

/**
 * Constraint applied to a Value Type.
 * 값 타입에 적용되는 제약 조건.
 */
export type ValueConstraint =
  | { kind: "regex"; pattern: string; message?: string }
  | { kind: "range"; min?: number; max?: number; message?: string }
  | { kind: "enum"; values: readonly string[]; message?: string }
  | { kind: "uuid"; version?: 4 | 7; message?: string }
  | { kind: "arrayUnique"; message?: string };

/**
 * A semantic wrapper around a base type.
 * 기본 타입의 의미적 래퍼.
 */
export interface ValueType {
  /** API name (PascalCase). e.g., "Email", "Currency" / API 이름 (파스칼케이스) */
  apiName: string;
  /** Base type this wraps / 감싸는 기본 타입 */
  baseType: BasePropertyType;
  /** Bilingual description / 영한 설명 */
  description: BilingualDesc;
  /** Validation constraints / 검증 제약 조건 */
  constraints: ValueConstraint[];
  /**
   * TypeScript validator function name. e.g., "toEmail"
   * 타입스크립트 검증 함수 이름. 예: "toEmail"
   */
  validatorFn: string;
}

// ============================================================================
// Properties
// 프로퍼티
// ============================================================================

/**
 * A typed field on an Object Type.
 * 오브젝트 타입의 타입 지정 필드.
 */
export interface Property {
  /** API name (camelCase). e.g., "fullName", "startDate" / API 이름 (카멜케이스) */
  apiName: string;
  /** TypeScript type string. For branded types, use the ValueType apiName. */
  type: string;
  /** Underlying base type / 기반 기본 타입 */
  baseType: BasePropertyType;
  /** Whether this field is required / 필수 필드 여부 */
  required: boolean;
  /** Whether this field is immutable after creation / 생성 후 불변 여부 */
  readonly: boolean;
  /** Bilingual description / 영한 설명 */
  description: BilingualDesc;
  /** Constraints (from ValueType or inline) / 제약 조건 */
  constraints?: ValueConstraint[];
  /** Reference to a ValueType apiName if this uses a branded type / 브랜디드 타입 참조 */
  valueType?: string;
  /** Target entity for FK references / FK 참조 대상 엔티티 */
  targetEntity?: string;
  /** Whether this property is an array / 배열 여부 */
  isArray?: boolean;
  /** Default value expression (TypeScript) / 기본값 표현식 */
  defaultValue?: string;
  /** Whether this property should be indexed for query performance / 쿼리 성능을 위한 인덱싱 여부 */
  indexCandidate?: boolean;
}

// ============================================================================
// Struct Types
// 구조체 타입
// ============================================================================

/**
 * A named composite type (nested object within a property).
 * 명명된 복합 타입 (프로퍼티 내 중첩 객체).
 */
export interface StructType {
  /** API name (PascalCase). e.g., "Address", "PhoneNumber" / API 이름 (파스칼케이스) */
  apiName: string;
  /** Bilingual description / 영한 설명 */
  description: BilingualDesc;
  /** Fields within this struct / 구조체 내 필드 */
  fields: Property[];
}

// ============================================================================
// Geospatial Types
// 지리공간 타입
// ============================================================================

export interface GeoPointProperty {
  apiName: string;
  description: BilingualDesc;
  crs: "WGS84";
}

export interface GeoShapeProperty {
  apiName: string;
  description: BilingualDesc;
  geometryTypes: readonly ("Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon")[];
  indexed: boolean;
}

export interface GeoTemporalProperty {
  apiName: string;
  description: BilingualDesc;
  timestampType: "timestamp";
  includesAltitude?: boolean;
}

// ============================================================================
// Time Series
// 시계열
// ============================================================================

export interface TimeSeriesProperty {
  apiName: string;
  description: BilingualDesc;
  valueType: "number" | "string" | "boolean";
  regularity: "regular" | "irregular";
  partitioning?: string;
  retentionDays?: number;
}

// ============================================================================
// Attachments
// 첨부 파일
// ============================================================================

export interface AttachmentProperty {
  apiName: string;
  description: BilingualDesc;
  kind: "attachment" | "mediaReference";
  mimeTypes: string[];
  maxSizeMB?: number;
}

// ============================================================================
// Vector
// 벡터
// ============================================================================

export interface VectorProperty {
  apiName: string;
  description: BilingualDesc;
  dimensions: number;
  similarity: "cosine" | "euclidean" | "dotProduct";
}

// ============================================================================
// Cipher
// 암호화
// ============================================================================

export interface CipherProperty {
  apiName: string;
  description: BilingualDesc;
  encryption: "aes256" | "rsa" | "applicationLevel";
}

// ============================================================================
// Shared Property Types
// 공유 프로퍼티 타입
// ============================================================================

export interface SharedPropertyType {
  apiName: string;
  description: BilingualDesc;
  properties: Property[];
  usedBy: string[];
}

// ============================================================================
// Derived Properties
// 파생 프로퍼티
// ============================================================================

export interface DerivedProperty {
  apiName: string;
  entityApiName: string;
  description: BilingualDesc;
  mode: "onRead" | "cached";
  returnType: string;
  sourceProperties: string[];
  computeFn: string;
}

// ============================================================================
// Object Types
// 오브젝트 타입
// ============================================================================

export interface ObjectType {
  apiName: string;
  displayName: string;
  pluralName: string;
  primaryKey: string;
  titleKey: string;
  description?: BilingualDesc;
  properties: Property[];
  structs?: string[];
  geoProperties?: (GeoPointProperty | GeoShapeProperty | GeoTemporalProperty)[];
  timeSeriesProperties?: TimeSeriesProperty[];
  attachments?: AttachmentProperty[];
  vectors?: VectorProperty[];
  ciphers?: CipherProperty[];
  derivedProperties?: DerivedProperty[];
  implements?: string[];
  indexCandidates?: string[];
}

// ============================================================================
// Link Types
// 링크 타입
// ============================================================================

export interface LinkType {
  apiName: string;
  description: BilingualDesc;
  sourceEntity: string;
  targetEntity: string;
  cardinality: "1:1" | "M:1" | "1:M" | "M:N";
  fkProperty?: string;
  fkSide?: "source" | "target";
  joinEntity?: string;
  reverseApiName?: string;
}

// ============================================================================
// Interfaces
// 인터페이스
// ============================================================================

export interface InterfaceLinkConstraint {
  linkApiName: string;
  targetType: string;
  cardinality: "ONE" | "MANY";
  required: boolean;
}

export interface OntologyInterface {
  apiName: string;
  description: BilingualDesc;
  properties: string[];
  linkConstraints?: InterfaceLinkConstraint[];
  implementedBy: string[];
}

// ============================================================================
// Queries
// 쿼리
// ============================================================================

export interface QueryFilterField {
  propertyApiName: string;
  operators: string[];
}

export interface OntologyQuery {
  apiName: string;
  description: BilingualDesc;
  entityApiName: string;
  queryType: "list" | "getById" | "filter" | "search" | "paginated" | "aggregation" | "searchAround";
  filterFields?: QueryFilterField[];
  parameters?: { name: string; type: string; description?: BilingualDesc; required?: boolean }[];
  returnType?: string;
  traversalPath?: string[];
}

// ============================================================================
// Functions (LOGIC)
// 함수 (로직)
// ============================================================================

export interface OntologyFunction {
  apiName: string;
  description: BilingualDesc;
  category: "readHelper" | "pureLogic" | "computedField";
  parameters: { name: string; type: string; description?: BilingualDesc; required?: boolean }[];
  returnType: string;
  pureLogic: string;
  operatesOn?: string;
}

// ============================================================================
// Mutations (ACTION)
// 뮤테이션 (액션)
// ============================================================================

export interface MutationEdit {
  type: "create" | "modify" | "delete" | "addLink" | "removeLink";
  target: string;
  properties?: string[];
}

export interface MutationSideEffect {
  kind: "webhook" | "notification" | "log" | "external";
  target: string;
}

export interface OntologyMutation {
  apiName: string;
  description: BilingualDesc;
  mutationType: "create" | "modify" | "delete" | "batch" | "custom";
  entityApiName: string;
  parameters: { name: string; type: string; required: boolean; description?: BilingualDesc }[];
  validationFns?: string[];
  edits: MutationEdit[];
  sideEffects?: MutationSideEffect[];
}

// ============================================================================
// Webhooks (ACTION)
// 웹훅 (액션)
// ============================================================================

export interface Webhook {
  apiName: string;
  description: BilingualDesc;
  kind: "transactional" | "sideEffect";
  transactional: boolean;
  triggeredBy: string[];
  endpoint: string;
  payload?: string[];
}

// ============================================================================
// Automations (ACTION)
// 자동화 (액션)
// ============================================================================

export interface Automation {
  apiName: string;
  description: BilingualDesc;
  kind: "cron" | "eventDriven";
  schedule?: string;
  triggerEvent?: string;
  targetMutation: string;
  idempotent: boolean;
}

// ============================================================================
// Security
// 보안
// ============================================================================

export interface Marking {
  apiName: string;
  description: BilingualDesc;
  markingType: "mandatory" | "cbac";
  levels?: string[];
  appliedTo: string[];
}

export interface RLSPolicy {
  userAttribute: string;
  objectProperty: string;
  operator: "equals" | "contains" | "in";
}

export interface CLSPolicy {
  propertyApiName: string;
  readableBy: string[];
  writableBy: string[];
}

export interface ObjectSecurityPolicy {
  entityApiName: string;
  description: BilingualDesc;
  rls?: RLSPolicy;
  cls?: CLSPolicy[];
}

export interface Role {
  apiName: string;
  displayName: BilingualDesc;
  hierarchy?: number;
}

export interface PermissionEntry {
  entityApiName: string;
  roleApiName: string;
  operations: ("create" | "read" | "update" | "delete")[];
}

// ============================================================================
// Top-Level Containers
// 최상위 컨테이너
// ============================================================================

export interface OntologyData {
  objectTypes: ObjectType[];
  valueTypes: ValueType[];
  structTypes: StructType[];
  sharedPropertyTypes: SharedPropertyType[];
}

export interface OntologyLogic {
  linkTypes: LinkType[];
  interfaces: OntologyInterface[];
  queries: OntologyQuery[];
  derivedProperties: DerivedProperty[];
  functions: OntologyFunction[];
}

export interface OntologyAction {
  mutations: OntologyMutation[];
  webhooks: Webhook[];
  automations: Automation[];
}

export interface OntologySecurity {
  roles: Role[];
  permissionMatrix: PermissionEntry[];
  markings: Marking[];
  objectPolicies: ObjectSecurityPolicy[];
}
