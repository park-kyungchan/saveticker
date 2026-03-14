/**
 * Ontology Schema Types
 * 온톨로지 스키마 타입 정의
 *
 * All ontology skills share these type definitions.
 * 모든 온톨로지 스킬이 이 타입 정의를 공유합니다.
 *
 * Usage: `as const satisfies OntologyData` pattern for compile-time validation.
 * 사용법: 컴파일 타임 검증을 위해 `as const satisfies OntologyData` 패턴 사용.
 *
 * Immutability: All interface fields are `readonly` — matching upstream
 * schemas/ontology/types.ts contract. The `as const satisfies` pattern
 * enforces this at value level; `readonly` enforces at type level.
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
  readonly en: string;
  /** Korean description / 한국어 설명 */
  readonly ko: string;
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
  | { readonly kind: "regex"; readonly pattern: string; readonly message?: string }
  | { readonly kind: "range"; readonly min?: number; readonly max?: number; readonly message?: string }
  | { readonly kind: "enum"; readonly values: readonly string[]; readonly message?: string }
  | { readonly kind: "uuid"; readonly version?: 4 | 7; readonly message?: string }
  | { readonly kind: "arrayUnique"; readonly message?: string };

/**
 * A semantic wrapper around a base type.
 * 기본 타입의 의미적 래퍼.
 */
export interface ValueType {
  /** API name (PascalCase). e.g., "Email", "Currency" / API 이름 (파스칼케이스) */
  readonly apiName: string;
  /** Base type this wraps / 감싸는 기본 타입 */
  readonly baseType: BasePropertyType;
  /** Bilingual description / 영한 설명 */
  readonly description: BilingualDesc;
  /** Validation constraints / 검증 제약 조건 */
  readonly constraints: readonly ValueConstraint[];
  /**
   * TypeScript validator function name. e.g., "toEmail"
   * 타입스크립트 검증 함수 이름. 예: "toEmail"
   */
  readonly validatorFn: string;
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
  readonly apiName: string;
  /** TypeScript type string. For branded types, use the ValueType apiName. */
  readonly type: string;
  /** Underlying base type / 기반 기본 타입 */
  readonly baseType: BasePropertyType;
  /** Whether this field is required / 필수 필드 여부 */
  readonly required: boolean;
  /** Whether this field is immutable after creation / 생성 후 불변 여부 */
  readonly readonly: boolean;
  /** Bilingual description / 영한 설명 */
  readonly description: BilingualDesc;
  /** Constraints (from ValueType or inline) / 제약 조건 */
  readonly constraints?: readonly ValueConstraint[];
  /** Reference to a ValueType apiName if this uses a branded type / 브랜디드 타입 참조 */
  readonly valueType?: string;
  /** Target entity for FK references / FK 참조 대상 엔티티 */
  readonly targetEntity?: string;
  /** Whether this property is an array / 배열 여부 */
  readonly isArray?: boolean;
  /** Default value expression (TypeScript) / 기본값 표현식 */
  readonly defaultValue?: string;
  /** Whether this property should be indexed for query performance / 쿼리 성능을 위한 인덱싱 여부 */
  readonly indexCandidate?: boolean;
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
  readonly apiName: string;
  /** Bilingual description / 영한 설명 */
  readonly description: BilingualDesc;
  /** Fields within this struct / 구조체 내 필드 */
  readonly fields: readonly Property[];
}

// ============================================================================
// Geospatial Types
// 지리공간 타입
// ============================================================================

export interface GeoPointProperty {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly crs: "WGS84";
}

export interface GeoShapeProperty {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly geometryTypes: readonly ("Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon")[];
  readonly indexed: boolean;
}

export interface GeoTemporalProperty {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly timestampType: "timestamp";
  readonly includesAltitude?: boolean;
}

// ============================================================================
// Time Series
// 시계열
// ============================================================================

export interface TimeSeriesProperty {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly valueType: "number" | "string" | "boolean";
  readonly regularity: "regular" | "irregular";
  readonly partitioning?: string;
  readonly retentionDays?: number;
}

// ============================================================================
// Attachments
// 첨부 파일
// ============================================================================

export interface AttachmentProperty {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly kind: "attachment" | "mediaReference";
  readonly mimeTypes: readonly string[];
  readonly maxSizeMB?: number;
}

// ============================================================================
// Vector
// 벡터
// ============================================================================

export interface VectorProperty {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly dimensions: number;
  readonly similarity: "cosine" | "euclidean" | "dotProduct";
}

// ============================================================================
// Cipher
// 암호화
// ============================================================================

export interface CipherProperty {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly encryption: "aes256" | "rsa" | "applicationLevel";
}

// ============================================================================
// Shared Property Types
// 공유 프로퍼티 타입
// ============================================================================

export interface SharedPropertyType {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly properties: readonly Property[];
  readonly usedBy: readonly string[];
}

// ============================================================================
// Derived Properties
// 파생 프로퍼티
// ============================================================================

export interface DerivedProperty {
  readonly apiName: string;
  readonly entityApiName: string;
  readonly description: BilingualDesc;
  readonly mode: "onRead" | "cached";
  readonly returnType: string;
  readonly sourceProperties: readonly string[];
  readonly computeFn: string;
}

// ============================================================================
// Object Types
// 오브젝트 타입
// ============================================================================

export interface ObjectType {
  readonly apiName: string;
  readonly displayName: string;
  readonly pluralName: string;
  readonly primaryKey: string;
  readonly titleKey: string;
  readonly description?: BilingualDesc;
  readonly properties: readonly Property[];
  readonly structs?: readonly string[];
  readonly geoProperties?: readonly (GeoPointProperty | GeoShapeProperty | GeoTemporalProperty)[];
  readonly timeSeriesProperties?: readonly TimeSeriesProperty[];
  readonly attachments?: readonly AttachmentProperty[];
  readonly vectors?: readonly VectorProperty[];
  readonly ciphers?: readonly CipherProperty[];
  readonly derivedProperties?: readonly DerivedProperty[];
  readonly implements?: readonly string[];
  readonly indexCandidates?: readonly string[];
}

// ============================================================================
// Link Types
// 링크 타입
// ============================================================================

export interface LinkType {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly sourceEntity: string;
  readonly targetEntity: string;
  readonly cardinality: "1:1" | "M:1" | "1:M" | "M:N";
  readonly fkProperty?: string;
  readonly fkSide?: "source" | "target";
  readonly joinEntity?: string;
  readonly reverseApiName?: string;
}

// ============================================================================
// Interfaces
// 인터페이스
// ============================================================================

export interface InterfaceLinkConstraint {
  readonly linkApiName: string;
  readonly targetType: string;
  readonly cardinality: "ONE" | "MANY";
  readonly required: boolean;
}

export interface OntologyInterface {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly properties: readonly string[];
  readonly linkConstraints?: readonly InterfaceLinkConstraint[];
  readonly implementedBy: readonly string[];
}

// ============================================================================
// Queries
// 쿼리
// ============================================================================

export interface QueryFilterField {
  readonly propertyApiName: string;
  readonly operators: readonly string[];
}

export interface OntologyQuery {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly entityApiName: string;
  readonly queryType: "list" | "getById" | "filter" | "search" | "paginated" | "aggregation" | "searchAround";
  readonly filterFields?: readonly QueryFilterField[];
  readonly parameters?: readonly { readonly name: string; readonly type: string; readonly description?: BilingualDesc; readonly required?: boolean }[];
  readonly returnType?: string;
  readonly traversalPath?: readonly string[];
}

// ============================================================================
// Functions (LOGIC)
// 함수 (로직)
// ============================================================================

export interface OntologyFunction {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly category: "readHelper" | "pureLogic" | "computedField";
  readonly parameters: readonly { readonly name: string; readonly type: string; readonly description?: BilingualDesc; readonly required?: boolean }[];
  readonly returnType: string;
  readonly pureLogic: string;
  readonly operatesOn?: string;
  /** Whether this function is exposed as an LLM-callable tool (Pattern 2: Logic Tool Handoff). */
  readonly toolExposure?: boolean;
}

// ============================================================================
// Progressive Autonomy Levels (v1.2.0)
// 점진적 자율성 단계
// ============================================================================

/**
 * Progressive autonomy level for AI-driven action execution.
 * Source: ontology-ultimate-vision.md §6, PROGRESSIVE_AUTONOMY_LEVELS in semantics.ts
 */
export type AutonomyLevel =
  | "monitor"
  | "recommend"
  | "approve-then-act"
  | "act-then-inform"
  | "full-autonomy";

// ============================================================================
// Mutations (ACTION)
// 뮤테이션 (액션)
// ============================================================================

export interface MutationEdit {
  readonly type: "create" | "modify" | "delete" | "addLink" | "removeLink";
  readonly target: string;
  readonly properties?: readonly string[];
}

export interface MutationSideEffect {
  readonly kind: "webhook" | "notification" | "log" | "external";
  readonly target: string;
}

export interface OntologyMutation {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly mutationType: "create" | "modify" | "delete" | "batch" | "custom";
  readonly entityApiName: string;
  readonly parameters: readonly { readonly name: string; readonly type: string; readonly required: boolean; readonly description?: BilingualDesc }[];
  readonly validationFns?: readonly string[];
  readonly edits: readonly MutationEdit[];
  readonly sideEffects?: readonly MutationSideEffect[];
  /** AI action review tier — gates AI-proposed actions through human review. Source: ontology-ultimate-vision.md §6 */
  readonly reviewLevel?: AutonomyLevel;
}

// ============================================================================
// Webhooks (ACTION)
// 웹훅 (액션)
// ============================================================================

export interface Webhook {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly kind: "transactional" | "sideEffect";
  readonly transactional: boolean;
  readonly triggeredBy: readonly string[];
  readonly endpoint: string;
  readonly payload?: readonly string[];
}

// ============================================================================
// Automations (ACTION)
// 자동화 (액션)
// ============================================================================

export interface Automation {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly kind: "cron" | "eventDriven";
  readonly schedule?: string;
  readonly triggerEvent?: string;
  readonly targetMutation: string;
  readonly idempotent: boolean;
  /** Progressive autonomy tier for this automation. Source: ontology-ultimate-vision.md §6 */
  readonly autonomyLevel?: AutonomyLevel;
}

// ============================================================================
// Security
// 보안
// ============================================================================

export interface Marking {
  readonly apiName: string;
  readonly description: BilingualDesc;
  readonly markingType: "mandatory" | "cbac";
  readonly levels?: readonly string[];
  readonly appliedTo: readonly string[];
}

export interface RLSPolicy {
  readonly userAttribute: string;
  readonly objectProperty: string;
  readonly operator: "equals" | "contains" | "in";
}

export interface CLSPolicy {
  readonly propertyApiName: string;
  readonly readableBy: readonly string[];
  readonly writableBy: readonly string[];
}

export interface ObjectSecurityPolicy {
  readonly entityApiName: string;
  readonly description: BilingualDesc;
  readonly rls?: RLSPolicy;
  readonly cls?: readonly CLSPolicy[];
}

export interface Role {
  readonly apiName: string;
  readonly displayName: BilingualDesc;
  readonly hierarchy?: number;
}

export interface PermissionEntry {
  readonly entityApiName: string;
  readonly roleApiName: string;
  readonly operations: readonly ("create" | "read" | "update" | "delete")[];
}

// ============================================================================
// Top-Level Containers
// 최상위 컨테이너
// ============================================================================

export interface OntologyData {
  readonly objectTypes: readonly ObjectType[];
  readonly valueTypes: readonly ValueType[];
  readonly structTypes: readonly StructType[];
  readonly sharedPropertyTypes: readonly SharedPropertyType[];
}

export interface OntologyLogic {
  readonly linkTypes: readonly LinkType[];
  readonly interfaces: readonly OntologyInterface[];
  readonly queries: readonly OntologyQuery[];
  readonly derivedProperties: readonly DerivedProperty[];
  readonly functions: readonly OntologyFunction[];
}

export interface OntologyAction {
  readonly mutations: readonly OntologyMutation[];
  readonly webhooks: readonly Webhook[];
  readonly automations: readonly Automation[];
}

export interface OntologySecurity {
  readonly roles: readonly Role[];
  readonly permissionMatrix: readonly PermissionEntry[];
  readonly markings: readonly Marking[];
  readonly objectPolicies: readonly ObjectSecurityPolicy[];
}
