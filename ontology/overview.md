---
version: 3
project: saveticker
lastSkill: decompose
generatedAt: 2026-03-12T00:00:00Z
note: >
  Blueprint-grade overview for end-to-end ontology pipeline execution.
  Grounded in SAVE app (saveticker.com) reverse-engineering.
  10 entities. All downstream skills execute from this file alone.
---

<!-- SECTION: decompose BEGIN -->

# SaveTicker Prototype — Ontology Overview

## 1. SAVE App — Product Analysis

> Source: saveticker.com, Google Play (com.savenews.app, 100K+ downloads, 4.7★, 546 reviews)
> Developer: Fivelines Inc. (주식회사 파이브라인즈), Gangnam-gu, Seoul
> Creator: Oh Sun ("오선의 미국 증시 라이브" YouTuber)
> Tagline: "투자의 모든 소식, 이제 한 곳에서" — All investment news, now in one place.

### 1.1 What SAVE Has (5 Tabs)

| Tab | Feature | Details |
|-----|---------|---------|
| **뉴스 (News)** | Multi-source real-time feed | 3 sources: SAVE (curated by Oh Sun), FinancialJuice, Reuters. Categories: 종합 (General) / 속보 (Breaking) / 분석 (Analysis). Tags: #헤드라인, #정보, #에너지, #기업분석, #암호화폐, #경제지표. "관심 뉴스" keyword-based personalized feed. |
| **리포트 (Report)** | Gated analysis reports | Login-required. Deep-dive analysis content. Premium-feel gated content. |
| **커뮤니티 (Community)** | User discussion forum | Free-form posts with comment threads. Active user engagement. |
| **캘린더 (Calendar)** | Economic indicator calendar | Monthly grid. Indicators with ★ importance levels. Fed speaker schedule with voting rights (O/X) and stance (hawkish/dovish/neutral). |
| **내 정보 (Profile)** | User profile + alerts | Push notification settings: keywords, companies, indicators, report schedules. |

### 1.2 What SAVE Does NOT Have (= This Prototype's Value Proposition)

| # | Gap in SAVE | Impact on Users | Our Solution | Primary Entity |
|---|------------|----------------|-------------|---------------|
| G-1 | No easy explanation layer | "FOMC 매파적 동결" is meaningless to beginners | Storytelling tab with narrative, takeaways, analogies, difficulty levels | **ArticleExplainer** |
| G-2 | No inline term definitions | Users who don't know "점도표" or "양적긴축" cannot understand articles | Tap-to-explain: highlighted terms in article body with popover definitions | **FinancialTerm + ArticleTermUsage** |
| G-3 | No narrative context linking | Breaking news appears as disconnected fragments | Story threads group related articles chronologically with context bridges | **StoryThread** |
| G-4 | No indicator causal chains | Calendar lists indicators by name only — no "why does PPI matter?" | Self-referential causal links: PPI → CPI → FOMC decision | **EconomicIndicator.relatedIndicatorId** |
| G-5 | No difficulty-graded content | Same content for experts and beginners | beginner / intermediate / advanced difficulty levels | **ArticleExplainer.difficultyLevel** |

### 1.3 Prototype Positioning

```
SAVE:           Speed-first news relay for experienced investors.
This Prototype: Comprehension-first literacy layer for financial beginners.

Not a replacement — an additive feature set that expands SAVE's TAM
from "people who already speak finance" to "everyone who wants to learn."
```

---

## 2. Object Types

10 entities. 5 standalone + 2 join objects + 3 literacy entities (the core differentiators).

| # | Name | Kind | PK | Title | Description |
|---|------|------|----|-------|-------------|
| 1 | Stock | Standalone | auto (string) | name | Master data for a publicly traded stock. Ticker, sector, price snapshot. |
| 2 | NewsArticle | Standalone | auto (string) | title | Financial news article. Mirrors SAVE's multi-source feed. The "hard content" that excludes beginners. |
| 3 | User | Standalone | auto (string) | displayName | App user identity. Language preference drives content personalization. |
| 4 | EconomicIndicator | Standalone | auto (string) | name | Scheduled economic event. Extends SAVE's calendar with causal chain linking. |
| 5 | StoryThread | Standalone | auto (string) | title | Chronological narrative grouping. **Gap G-3 solution.** |
| 6 | WatchlistEntry | Join (User ↔ Stock) | auto (string) | — | Mirrors SAVE's "관심 뉴스 설정" watchlist. |
| 7 | NewsStockLink | Join (NewsArticle ↔ Stock) | auto (string) | — | Bidirectional news-stock association. Replaces array FK for Convex indexing. |
| 8 | ArticleExplainer | Literacy (1:1 with NewsArticle) | auto (string) | simplifiedTitle | Storytelling version of a news article. **Gap G-1 + G-5 solution.** |
| 9 | FinancialTerm | Literacy (glossary) | auto (string) | term | Reusable financial term definition. **Gap G-2 solution.** |
| 10 | ArticleTermUsage | Literacy join (NewsArticle ↔ FinancialTerm) | auto (string) | — | Term occurrence in article with sentence context. **Gap G-2 bridge.** |

### 2.1 Removed from Scope (P2 — SAVE Already Has These)

| Name | Why Removed |
|------|------------|
| CommunityPost | SAVE already has a community tab. Duplicating it adds no PM insight. |
| PushNotification | SAVE already has 맞춤 알림. Standard infrastructure, not a differentiator. |

---

## 3. Property Candidates per Entity

Downstream `/properties` and `/value-types` execute from these specifications. Types are indicative (refined in downstream skills). Properties marked with `[VT]` need Value Type definitions. Properties marked with `[struct]` need Struct Type definitions.

### 3.1 Stock

| Property | Type | Required | Readonly | Notes |
|----------|------|----------|----------|-------|
| name | string | yes | no | English name (e.g., "Apple Inc.") |
| nameKo | string | yes | no | Korean name (e.g., "애플") |
| ticker | string [VT: Ticker] | yes | yes | Uppercase 1-5 chars, regex `^[A-Z]{1,5}$`, unique |
| sector | enum | yes | no | technology, healthcare, finance, consumer, energy, industrials, etf |
| currentPrice | float [VT: Price] | yes | no | Current price in USD |
| dailyChangePct | float [VT: PercentageChange] | yes | no | Daily percentage change |
| marketCap | float | no | no | Market capitalization in USD |
| updatedAt | timestamp | yes | no | [Auditable] |
| updatedBy | string | no | no | [Auditable] |

### 3.2 NewsArticle

| Property | Type | Required | Readonly | Notes |
|----------|------|----------|----------|-------|
| title | string | yes | no | Article headline |
| summary | string | yes | no | Short summary for feed cards |
| body | string | yes | no | Full article body text |
| sourceUrl | string [VT: ArticleUrl] | yes | yes | Original article URL |
| imageUrl | string | no | no | Thumbnail image URL |
| publishedAt | timestamp | yes | yes | Original publication timestamp |
| category | enum | yes | no | general, breaking, analysis (aligned with SAVE: 종합/속보/분석) |
| source | object [struct: SourceAttribution] | no | no | { sourceName, sourceUrl, sourceLogoUrl } — SAVE, FinancialJuice, or Reuters |
| indicatorId | ref (EconomicIndicator) | no | no | FK to EconomicIndicator (nullable — not all news is indicator-triggered) |
| storyThreadId | ref (StoryThread) | no | no | FK to StoryThread (nullable — not all news belongs to a thread) |
| orderInThread | integer | no | no | Position within StoryThread timeline (nullable, set via assignArticleToThread) |
| updatedAt | timestamp | yes | no | [Auditable] |
| updatedBy | string | no | no | [Auditable] |

### 3.3 User

| Property | Type | Required | Readonly | Notes |
|----------|------|----------|----------|-------|
| displayName | string | yes | no | User display name |
| email | string [VT: EmailAddress] | yes | no | Email address, unique |
| preferredLanguage | enum | yes | no | ko, en |
| updatedAt | timestamp | yes | no | [Auditable] |
| updatedBy | string | no | no | [Auditable] |

### 3.4 EconomicIndicator

| Property | Type | Required | Readonly | Notes |
|----------|------|----------|----------|-------|
| name | string | yes | no | English name (e.g., "February CPI") |
| nameKo | string | yes | no | Korean name (e.g., "2월 소비자물가지수") |
| scheduledAt | timestamp | yes | no | Scheduled release date/time |
| consensus | string | no | no | Market consensus estimate (string to handle "3.1%" or "250K") |
| actual | string | no | no | Actual released value (null until released) |
| previous | string | yes | no | Previous period value |
| marketReactionPct | float [VT: PercentageChange] | no | no | S&P 500 reaction percentage |
| importance | enum | yes | no | high, medium, low (maps to SAVE's ★★★/★★/★) |
| source | object [struct: SourceAttribution] | no | no | Data source attribution |
| relatedIndicatorId | ref (EconomicIndicator) | no | no | Self-referential FK for causal chain (e.g., PPI → CPI) |
| causalContext | string | no | no | Explains the causal relationship (e.g., "Higher PPI often leads to higher CPI") |
| updatedAt | timestamp | yes | no | [Auditable] |
| updatedBy | string | no | no | [Auditable] |

### 3.5 StoryThread

| Property | Type | Required | Readonly | Notes |
|----------|------|----------|----------|-------|
| title | string | yes | no | English title (e.g., "Trump Tariff Escalation Timeline") |
| titleKo | string | yes | no | Korean title (e.g., "트럼프 관세 확대 타임라인") |
| description | string | no | no | English description |
| descriptionKo | string | no | no | Korean description |
| status | enum | yes | no | active, completed |
| updatedAt | timestamp | yes | no | [Auditable] |
| updatedBy | string | no | no | [Auditable] |

### 3.6 WatchlistEntry (Join: User ↔ Stock)

| Property | Type | Required | Readonly | Notes |
|----------|------|----------|----------|-------|
| userId | ref (User) | yes | yes | FK to User |
| stockId | ref (Stock) | yes | yes | FK to Stock |
| addedAt | timestamp | yes | yes | When stock was added |
| sortOrder | integer | no | no | User-defined display order |

### 3.7 NewsStockLink (Join: NewsArticle ↔ Stock)

| Property | Type | Required | Readonly | Notes |
|----------|------|----------|----------|-------|
| newsArticleId | ref (NewsArticle) | yes | yes | FK to NewsArticle |
| stockId | ref (Stock) | yes | yes | FK to Stock |
| isPrimary | boolean | yes | no | Whether this is the primary stock for the article (default: false) |

### 3.8 ArticleExplainer (1:1 with NewsArticle)

| Property | Type | Required | Readonly | Notes |
|----------|------|----------|----------|-------|
| newsArticleId | ref (NewsArticle) | yes | yes | FK to NewsArticle (unique — 1:1 constraint) |
| simplifiedTitle | string | yes | no | Simplified headline for financial literacy |
| storyBody | string | yes | no | Storytelling narrative body (plain language explanation) |
| keyTakeaways | array\<string\> | yes | no | Bullet-point key insights (3-5 items) |
| analogy | string | no | no | Real-world analogy (e.g., "It's like a store raising prices because their supplier did") |
| contextBefore | string | no | no | What happened before this article (links to previous in thread) |
| contextAfter | string | no | no | What to expect next (forward-looking context) |
| difficultyLevel | enum | yes | no | beginner, intermediate, advanced |
| updatedAt | timestamp | yes | no | [Auditable] |
| updatedBy | string | no | no | [Auditable] |

### 3.9 FinancialTerm

| Property | Type | Required | Readonly | Notes |
|----------|------|----------|----------|-------|
| term | string | yes | no | English term (e.g., "Hawkish") |
| termKo | string | yes | no | Korean term (e.g., "매파적") |
| definition | string | yes | no | English definition |
| definitionKo | string | yes | no | Korean definition (beginner-friendly) |
| category | enum | yes | no | macro, equity, fixed-income, derivatives, crypto, general |
| example | string | no | no | English usage example sentence |
| exampleKo | string | no | no | Korean usage example sentence |
| updatedAt | timestamp | yes | no | [Auditable] |
| updatedBy | string | no | no | [Auditable] |

### 3.10 ArticleTermUsage (Join: NewsArticle ↔ FinancialTerm)

| Property | Type | Required | Readonly | Notes |
|----------|------|----------|----------|-------|
| newsArticleId | ref (NewsArticle) | yes | yes | FK to NewsArticle |
| termId | ref (FinancialTerm) | yes | yes | FK to FinancialTerm |
| sentenceContext | string | yes | no | The exact sentence where the term appears |
| positionInArticle | integer | yes | no | Character offset position in article body for highlight rendering |

---

## 4. Struct Types

| # | Name | Fields | Used By |
|---|------|--------|---------|
| S-1 | SourceAttribution | sourceName (string, required), sourceUrl (string, optional), sourceLogoUrl (string, optional) | NewsArticle.source, EconomicIndicator.source |

---

## 5. Value Types

| # | Name | Base Type | Constraints | Used By |
|---|------|-----------|-------------|---------|
| V-1 | Ticker | string | regex: `^[A-Z]{1,5}$`, message: "Ticker must be 1-5 uppercase letters" | Stock.ticker |
| V-2 | EmailAddress | string | regex: standard email pattern, message: "Must be a valid email address" | User.email |
| V-3 | Price | float | range: min 0 (exclusive), message: "Price must be positive" | Stock.currentPrice |
| V-4 | PercentageChange | float | range: min -100, max 10000, message: "Percentage out of bounds" | Stock.dailyChangePct, EconomicIndicator.marketReactionPct |
| V-5 | ArticleUrl | string | regex: URL pattern (https://...), message: "Must be a valid URL" | NewsArticle.sourceUrl |

---

## 6. Shared Property Types

| # | Name | Properties | Used By (7 entities) |
|---|------|-----------|---------------------|
| SP-1 | Auditable | updatedAt (timestamp, required), updatedBy (string, optional) | Stock, NewsArticle, User, EconomicIndicator, StoryThread, ArticleExplainer, FinancialTerm |

---

## 7. Relationships

### 7.1 Full Relationship Table

| # | Source | Target | Cardinality | FK Location | FK Field | Description |
|---|--------|--------|-------------|-------------|----------|-------------|
| R-1 | User | Stock | M:N | WatchlistEntry | userId, stockId | User's personalized watchlist |
| R-2 | NewsArticle | Stock | M:N | NewsStockLink | newsArticleId, stockId | Which stocks a news article mentions |
| R-3 | NewsArticle | FinancialTerm | M:N | ArticleTermUsage | newsArticleId, termId | Financial terms used in article body |
| R-4 | EconomicIndicator | NewsArticle | 1:M | NewsArticle | indicatorId | News articles triggered by an indicator release |
| R-5 | StoryThread | NewsArticle | 1:M | NewsArticle | storyThreadId | Articles belonging to a narrative timeline |
| R-6 | ArticleExplainer | NewsArticle | 1:1 | ArticleExplainer | newsArticleId | One explainer per article (unique FK) |
| R-7 | EconomicIndicator | EconomicIndicator | M:1 | EconomicIndicator | relatedIndicatorId | Self-referential causal chain |
| R-8 | WatchlistEntry | User | M:1 | WatchlistEntry | userId | Join entity decomposition |
| R-9 | WatchlistEntry | Stock | M:1 | WatchlistEntry | stockId | Join entity decomposition |
| R-10 | NewsStockLink | NewsArticle | M:1 | NewsStockLink | newsArticleId | Join entity decomposition |
| R-11 | NewsStockLink | Stock | M:1 | NewsStockLink | stockId | Join entity decomposition |
| R-12 | ArticleTermUsage | NewsArticle | M:1 | ArticleTermUsage | newsArticleId | Join entity decomposition |
| R-13 | ArticleTermUsage | FinancialTerm | M:1 | ArticleTermUsage | termId | Join entity decomposition |

### 7.2 Index Requirements from Relationships

| Entity | Index | Fields | Purpose |
|--------|-------|--------|---------|
| NewsArticle | by_publishedAt | publishedAt | Feed ordering |
| NewsArticle | by_category | category | Category filter |
| NewsArticle | by_indicator | indicatorId | Indicator-triggered news lookup |
| NewsArticle | by_storyThread | storyThreadId | Thread article listing |
| NewsArticle | search_title | title | Full-text search on title |
| Stock | by_ticker | ticker (unique) | Ticker lookup |
| Stock | by_sector | sector | Sector filter |
| Stock | search_name | name | Stock name search |
| User | by_email | email (unique) | Auth lookup |
| EconomicIndicator | by_scheduledAt | scheduledAt | Calendar date range |
| EconomicIndicator | by_importance | importance | Importance filter |
| EconomicIndicator | by_relatedIndicator | relatedIndicatorId | Causal chain traversal |
| WatchlistEntry | by_user | userId | User's watchlist |
| WatchlistEntry | by_stock | stockId | Stock popularity |
| WatchlistEntry | by_user_and_stock | userId, stockId (unique) | Duplicate prevention |
| NewsStockLink | by_newsArticle | newsArticleId | Stocks in article |
| NewsStockLink | by_stock | stockId | News for stock |
| NewsStockLink | by_article_and_stock | newsArticleId, stockId (unique) | Duplicate prevention |
| ArticleExplainer | by_newsArticle | newsArticleId (unique) | 1:1 lookup |
| ArticleExplainer | by_difficultyLevel | difficultyLevel | Difficulty filter |
| FinancialTerm | by_term | term | Term lookup |
| FinancialTerm | by_category | category | Category filter |
| FinancialTerm | search_term | term | Glossary search |
| ArticleTermUsage | by_newsArticle | newsArticleId | Terms in article |
| ArticleTermUsage | by_term | termId | Articles using term |
| ArticleTermUsage | by_article_and_term | newsArticleId, termId (unique) | Duplicate prevention |
| StoryThread | by_status | status | Active/completed filter |

---

## 8. Interfaces

| # | Name | Properties (by apiName) | Implemented By |
|---|------|------------------------|----------------|
| I-1 | Auditable | updatedAt, updatedBy | Stock, NewsArticle, User, EconomicIndicator, StoryThread, ArticleExplainer, FinancialTerm |

Note: SoftDeletable interface removed — no entities use soft-delete in this focused scope.

---

## 9. Queries

### 9.1 Feed & Discovery

| # | apiName | Entity | Query Type | Parameters | Description |
|---|---------|--------|-----------|------------|-------------|
| Q-1 | recentArticles | NewsArticle | list | limit (integer, default 20) | Latest news, newest first. No auth required. SAVE's default feed equivalent. |
| Q-2 | feedByUser | NewsArticle | filter | userId (ref) | Personalized feed: articles linked to user's watchlist stocks via NewsStockLink. Scored by relevance (watchlist overlap count). |
| Q-3 | trendingStocks | Stock | aggregation | cutoff (timestamp), thresholdCount (integer, default 5) | Stocks with N+ news articles in the time window. |
| Q-4 | searchStocks | Stock | search | query (string), limit (integer, default 10) | Stock name/ticker prefix search. Debounced 300ms on client. |

### 9.2 Article Detail & Literacy Features

| # | apiName | Entity | Query Type | Parameters | Description |
|---|---------|--------|-----------|------------|-------------|
| Q-5 | articleById | NewsArticle | getById | articleId (ref) | Single article by ID. |
| Q-6 | articleExplainer | ArticleExplainer | filter | newsArticleId (ref) | 1:1 explainer lookup for the "Easy Explanation" tab. |
| Q-7 | articleTermsByArticle | ArticleTermUsage | filter | newsArticleId (ref) | All term usages in an article — drives highlight rendering in the article body. |
| Q-8 | stockNews | NewsArticle | filter | stockId (ref) | News timeline for a specific stock (via NewsStockLink join). |

### 9.3 Story Threads

| # | apiName | Entity | Query Type | Parameters | Description |
|---|---------|--------|-----------|------------|-------------|
| Q-9 | threadsByStatus | StoryThread | filter | status (enum, optional) | Active or completed threads. Default: all. |
| Q-10 | threadArticles | NewsArticle | filter | storyThreadId (ref) | Articles in a story thread, ordered by orderInThread ascending. Include ArticleExplainer for each via nested lookup. |

### 9.4 Economic Calendar

| # | apiName | Entity | Query Type | Parameters | Description |
|---|---------|--------|-----------|------------|-------------|
| Q-11 | calendarByDate | EconomicIndicator | filter | startTime (timestamp), endTime (timestamp) | Indicators in a date range. Mirrors SAVE's calendar view. |
| Q-12 | indicatorCausalChain | EconomicIndicator | aggregation | indicatorId (ref) | Traverse relatedIndicatorId self-ref chain. Max depth 5, cycle-guarded. Returns ordered array of linked indicators. |
| Q-13 | stockIndicators | EconomicIndicator | filter | startTime (timestamp), endTime (timestamp) | Indicators relevant to stock context (last 30 days). |

### 9.5 Watchlist

| # | apiName | Entity | Query Type | Parameters | Description |
|---|---------|--------|-----------|------------|-------------|
| Q-14 | watchlistByUser | WatchlistEntry | filter | userId (ref) | User's watchlist entries with stock details populated. |

### 9.6 Glossary

| # | apiName | Entity | Query Type | Parameters | Description |
|---|---------|--------|-----------|------------|-------------|
| Q-15 | glossaryByCategory | FinancialTerm | filter | category (enum, optional) | Terms by category, or all terms alphabetical if no category. |
| Q-16 | searchTerms | FinancialTerm | search | query (string), limit (integer, default 10) | Term/termKo prefix search for glossary search bar. |
| Q-17 | termDetail | FinancialTerm | getById | financialTermId (ref) | Single term by ID. |

### 9.7 Utility Lookups

| # | apiName | Entity | Query Type | Parameters | Description |
|---|---------|--------|-----------|------------|-------------|
| Q-18 | stockById | Stock | getById | stockId (ref) | Single stock by ID. |
| Q-19 | userById | User | getById | userId (ref) | Single user by ID. |
| Q-20 | allUsers | User | list | — | All users. Prototype-only (demo user picker). |

---

## 10. Derived Properties

| # | Property | Entity | Mode | Source Properties | Compute Logic | Return Type |
|---|----------|--------|------|-------------------|--------------|-------------|
| D-1 | priceDirection | Stock | onRead | dailyChangePct | if > 0 → "up"; if < 0 → "down"; else → "flat" | enum: "up" / "down" / "flat" |
| D-2 | isSurprise | EconomicIndicator | onRead | actual, consensus | actual !== null && actual !== consensus | boolean |
| D-3 | surpriseDirection | EconomicIndicator | onRead | actual, consensus | Compares numeric parse of actual vs consensus. above / below / inline | enum: "above" / "below" / "inline" |

---

## 11. Functions (Pure Logic)

| # | apiName | Category | Parameters | Returns | Description |
|---|---------|----------|-----------|---------|-------------|
| F-1 | validateWatchlistAdd | pureLogic | userId (ref), stockId (ref), existingEntries (WatchlistEntry[]) | boolean | Returns false if entry already exists (duplicate check). |
| F-2 | validatePostContent | pureLogic | title (string), body (string) | boolean | Returns false if title or body is empty/whitespace-only. (Retained for future CommunityPost reintroduction.) |
| F-3 | computeFeedRelevance | pureLogic | articleStockIds (string[]), watchlistStockIds (string[]) | number (0-1) | Intersection count / max(1, watchlistStockIds.length). Higher = more relevant. |
| F-4 | computePriceDirection | readHelper | dailyChangePct (float) | "up" / "down" / "flat" | Implements D-1 derived property logic. |
| F-5 | computeIsSurprise | readHelper | actual (string or null), consensus (string or null) | boolean | Implements D-2 derived property logic. |
| F-6 | computeSurpriseDirection | readHelper | actual (string or null), consensus (string or null) | "above" / "below" / "inline" | Implements D-3 derived property logic. Parses numeric values, handles null. |
| F-7 | formatTickerDisplay | readHelper | ticker (string), name (string) | string | Returns "TICKER — Name" format for UI display. |
| F-8 | formatIndicatorDisplay | readHelper | indicator (EconomicIndicator) | string | Returns formatted display: "Name (★★★) — Consensus: X / Actual: Y". |

---

## 12. Mutations

### 12.1 Watchlist Operations

| # | apiName | Parameters | Validation | Edits | Side Effects |
|---|---------|-----------|-----------|-------|-------------|
| M-1 | addToWatchlist | userId (ref), stockId (ref), sortOrder? (integer) | F-1 validateWatchlistAdd | Create WatchlistEntry with addedAt = now() | None |
| M-2 | removeFromWatchlist | watchlistEntryId (ref) | Entry must exist | Delete WatchlistEntry | None |

### 12.2 User Operations

| # | apiName | Parameters | Validation | Edits | Side Effects |
|---|---------|-----------|-----------|-------|-------------|
| M-3 | updateUserProfile | userId (ref), displayName? (string), preferredLanguage? (enum) | User must exist | Update provided fields on User | None |

### 12.3 Admin: Stock Data

| # | apiName | Parameters | Validation | Edits | Side Effects |
|---|---------|-----------|-----------|-------|-------------|
| M-4 | updateStockPrice | stockId (ref), currentPrice (float), dailyChangePct (float), marketCap? (float) | Stock must exist | Update price fields + updatedAt on Stock | None |

### 12.4 Admin: Economic Indicators

| # | apiName | Parameters | Validation | Edits | Side Effects |
|---|---------|-----------|-----------|-------|-------------|
| M-5 | updateIndicatorActual | economicIndicatorId (ref), actual (string), marketReactionPct? (float) | Indicator must exist | Update actual, marketReactionPct, updatedAt | None |

### 12.5 Admin: Article Explainers (Gap G-1 Solution)

| # | apiName | Parameters | Validation | Edits | Side Effects |
|---|---------|-----------|-----------|-------|-------------|
| M-6 | createArticleExplainer | newsArticleId (ref), simplifiedTitle (string), storyBody (string), keyTakeaways (string[]), analogy? (string), difficultyLevel (enum), contextBefore? (string), contextAfter? (string) | NewsArticle must exist; no existing explainer for this article | Create ArticleExplainer | None |
| M-7 | updateArticleExplainer | articleExplainerId (ref), simplifiedTitle? (string), storyBody? (string), keyTakeaways? (string[]), analogy? (string), difficultyLevel? (enum), contextBefore? (string), contextAfter? (string) | Explainer must exist | Update provided fields | None |

### 12.6 Admin: Financial Terms (Gap G-2 Solution)

| # | apiName | Parameters | Validation | Edits | Side Effects |
|---|---------|-----------|-----------|-------|-------------|
| M-8 | createFinancialTerm | term (string), termKo (string), definition (string), definitionKo (string), category (enum), example? (string), exampleKo? (string) | Term name should be unique (soft check) | Create FinancialTerm | None |
| M-9 | updateFinancialTerm | financialTermId (ref), term? (string), termKo? (string), definition? (string), definitionKo? (string), category? (enum), example? (string), exampleKo? (string) | Term must exist | Update provided fields | None |

### 12.7 Admin: Article-Term Linking (Gap G-2 Bridge)

| # | apiName | Parameters | Validation | Edits | Side Effects |
|---|---------|-----------|-----------|-------|-------------|
| M-10 | createArticleTermUsage | newsArticleId (ref), termId (ref), sentenceContext (string), positionInArticle (integer) | Both article and term must exist | Create ArticleTermUsage | None |

### 12.8 Admin: Story Threads (Gap G-3 Solution)

| # | apiName | Parameters | Validation | Edits | Side Effects |
|---|---------|-----------|-----------|-------|-------------|
| M-11 | createStoryThread | title (string), titleKo (string), description? (string), descriptionKo? (string), status? (enum, default "active") | None | Create StoryThread | None |
| M-12 | updateStoryThread | storyThreadId (ref), title? (string), titleKo? (string), description? (string), descriptionKo? (string), status? (enum) | Thread must exist | Update provided fields | None |
| M-13 | assignArticleToThread | newsArticleId (ref), storyThreadId (ref), orderInThread (integer) | Both must exist | Update storyThreadId and orderInThread on NewsArticle | None |

---

## 13. Webhooks

None. The notifyNewPost webhook was removed with CommunityPost.

---

## 14. Automations

| # | apiName | Trigger | Schedule | Action | Description |
|---|---------|---------|----------|--------|-------------|
| A-1 | computeTrendingStocks | schedule | Every hour (`0 * * * *`) | Counts news articles per stock in past 24h. Stocks with 5+ articles are "trending." | Mirrors SAVE's implicit trending logic. Hourly refresh keeps trending list current. |

---

## 15. Security

### 15.1 Roles

| # | Role | Level | Description |
|---|------|-------|-------------|
| R-1 | admin | 1 | Full CRUD on all entities. Manages news, indicators, glossary, threads, explainers. |
| R-2 | member | 2 | Authenticated user. Can manage own watchlist and profile. Read access to all public content. |
| R-3 | guest | 3 | Unauthenticated. Read-only access to all public content. No write operations. |

### 15.2 Permission Matrix

| Entity | admin | member | guest |
|--------|-------|--------|-------|
| Stock | CRUD | R | R |
| NewsArticle | CRUD | R | R |
| User | CRUD | R (own), U (own) | — |
| EconomicIndicator | CRUD | R | R |
| StoryThread | CRUD | R | R |
| WatchlistEntry | CRUD | CRD (own) | — |
| NewsStockLink | CRUD | R | R |
| ArticleExplainer | CRUD | R | R |
| FinancialTerm | CRUD | R | R |
| ArticleTermUsage | CRUD | R | R |

### 15.3 Markings

| # | Name | Type | Applied To | Description |
|---|------|------|-----------|-------------|
| MK-1 | PersonalData | mandatory | User | Restricts PII access (email, profile data). Only the user themselves and admin can access. |

### 15.4 Object Security Policies (RLS/CLS)

| # | Entity | RLS Rule | CLS Rule |
|---|--------|----------|----------|
| OS-1 | User | Members see only their own profile | email field: writable by admin only |
| OS-2 | WatchlistEntry | Members see only their own entries | — |

---

## 16. Design Decisions

| # | Decision | SAVE Gap Reference | Rationale |
|---|----------|--------------------|-----------|
| DD-1 | 10 entities focused on financial literacy. CommunityPost and PushNotification removed. | SAVE already has community + alerts | Prototype demonstrates what SAVE lacks, not what it already has. PM value is in the gap identification. |
| DD-2 | NewsArticle.category uses general/breaking/analysis (3 values) | SAVE uses 종합/속보/분석 | Direct alignment with SAVE's actual category structure shows PM studied the product. |
| DD-3 | NewsArticle.source uses SourceAttribution struct | SAVE aggregates from SAVE/FinancialJuice/Reuters | Multi-source model mirrors SAVE's feed architecture. |
| DD-4 | ArticleExplainer is 1:1 with NewsArticle, not embedded | — | Separation allows lazy creation (not every article needs an explainer) and independent update cycles. |
| DD-5 | FinancialTerm is a centralized glossary, not per-article | — | "Fed funds rate" appears in 50+ articles. Define once, reuse everywhere via ArticleTermUsage join. |
| DD-6 | ArticleTermUsage includes sentenceContext + positionInArticle | Gap G-2 | Enables precise in-article highlighting: tap "매파적" in the exact sentence where it appears. |
| DD-7 | EconomicIndicator has self-referential relatedIndicatorId + causalContext | Gap G-4 | SAVE's calendar lists indicators by name. We add WHY they matter: PPI → CPI → FOMC. |
| DD-8 | StoryThread + orderInThread + contextBefore/contextAfter | Gap G-3 | SAVE shows disconnected breaking news. We connect them into a narrative arc. |
| DD-9 | No sentiment field on NewsArticle | Matches SAVE's editorial stance | Neutral relay philosophy — facts only, no opinion scoring. |
| DD-10 | All text fields bilingual (name/nameKo, term/termKo, definition/definitionKo) | SAVE's Korean-first audience | Korean-first UX with English data for accuracy. |
| DD-11 | NewsStockLink join entity replaces relatedStockIds array | Convex has no array-contains index | Bidirectional M:N querying: "stocks in this article" AND "articles for this stock." |
| DD-12 | All PKs are auto-generated strings | Convex generates _id automatically | Simplifies entity creation. No natural key management. |

---

## 17. Entity Design Briefs

Comprehensive per-entity context for all downstream skills. Each brief covers 16 dimensions.

### 17.1 Stock

- **Lifecycle:** Seed-created with 10 US large-cap stocks. Admin updates price/change data. Never deleted.
- **Expected links:** M:N to User (via WatchlistEntry, R-1), M:N to NewsArticle (via NewsStockLink, R-2)
- **Query patterns:** Q-4 searchStocks (name/ticker prefix), Q-3 trendingStocks (aggregation), Q-18 stockById, Q-8 stockNews (via NewsStockLink join)
- **Mutation scope:** M-4 updateStockPrice (admin only). Users interact indirectly via WatchlistEntry.
- **Index candidates:** ticker (unique), sector, name (search)
- **Geospatial profile:** None
- **Time series profile:** None — currentPrice is a point-in-time snapshot, not historical data
- **Attachment profile:** None — logo is a URL string, not a managed file
- **Vector profile:** None
- **Cipher profile:** None
- **Value types:** Ticker (V-1), Price (V-3), PercentageChange (V-4)
- **Shared properties:** Auditable (SP-1)
- **Derived properties:** D-1 priceDirection ("up"/"down"/"flat" from dailyChangePct)
- **Marking requirements:** None — public market data
- **Automation triggers:** A-1 computeTrendingStocks (hourly, counts news per stock)
- **SAVE alignment:** SAVE has stock data implicitly (via news tags). Our Stock entity is explicit, enabling structured stock-detail views with related news, indicators, and watchlist actions.

### 17.2 NewsArticle

- **Lifecycle:** Seed/admin-created with source attribution. Read-only for users. Never deleted.
- **Expected links:** M:N to Stock (via NewsStockLink, R-2), M:N to FinancialTerm (via ArticleTermUsage, R-3), M:1 from EconomicIndicator (R-4, indicatorId nullable), M:1 from StoryThread (R-5, storyThreadId nullable), 1:1 to ArticleExplainer (R-6)
- **Query patterns:** Q-1 recentArticles, Q-2 feedByUser, Q-5 articleById, Q-8 stockNews, Q-10 threadArticles
- **Mutation scope:** Admin-only create via seed. M-13 assignArticleToThread updates storyThreadId/orderInThread.
- **Index candidates:** publishedAt, category, source, indicatorId, storyThreadId, title (search)
- **Geospatial profile:** None
- **Time series profile:** None
- **Attachment profile:** None — source article is external URL
- **Vector profile:** None
- **Cipher profile:** None
- **Value types:** ArticleUrl (V-5)
- **Shared properties:** Auditable (SP-1)
- **Derived properties:** None
- **Marking requirements:** None
- **Automation triggers:** None
- **SAVE alignment:** Mirrors SAVE's news feed structure exactly — 3 sources (SAVE/FinancialJuice/Reuters), 3 categories (general/breaking/analysis). This entity is the "hard content" hub that all three literacy solutions (ArticleExplainer, FinancialTerm, StoryThread) connect to.

### 17.3 User

- **Lifecycle:** Created on signup. Updated via profile settings. Never deleted.
- **Expected links:** 1:M to WatchlistEntry (R-8)
- **Query patterns:** Q-19 userById, Q-20 allUsers (prototype user picker)
- **Mutation scope:** M-3 updateUserProfile (displayName, preferredLanguage)
- **Index candidates:** email (unique)
- **Geospatial profile:** None
- **Time series profile:** None
- **Attachment profile:** None
- **Vector profile:** None
- **Cipher profile:** None
- **Value types:** EmailAddress (V-2)
- **Shared properties:** Auditable (SP-1)
- **Derived properties:** None
- **Marking requirements:** MK-1 PersonalData (PII — email, profile)
- **Automation triggers:** None
- **SAVE alignment:** SAVE has login with email/카카오톡. Our User entity is simpler (prototype scope) with a demo user picker for portfolio presentation.

### 17.4 EconomicIndicator

- **Lifecycle:** Seed-created with scheduled date. Updated when actual value released post-event. Never deleted.
- **Expected links:** 1:M to NewsArticle (R-4, indicatorId FK on NewsArticle), M:1 self-ref (R-7, relatedIndicatorId — causal chain)
- **Query patterns:** Q-11 calendarByDate, Q-12 indicatorCausalChain (max depth 5, cycle-guarded), Q-13 stockIndicators
- **Mutation scope:** M-5 updateIndicatorActual (admin — record actual value + market reaction)
- **Index candidates:** scheduledAt, importance, relatedIndicatorId
- **Geospatial profile:** None
- **Time series profile:** None
- **Attachment profile:** None
- **Vector profile:** None
- **Cipher profile:** None
- **Value types:** PercentageChange (V-4) for marketReactionPct
- **Shared properties:** Auditable (SP-1)
- **Derived properties:** D-2 isSurprise, D-3 surpriseDirection
- **Marking requirements:** None — public economic data
- **Automation triggers:** None
- **SAVE alignment:** SAVE's calendar shows indicator name + ★ importance + Fed speaker stance/voting. Our prototype adds: (1) causal chain traversal (PPI → CPI → FOMC), (2) consensus vs actual comparison with surprise detection, (3) S&P 500 market reaction. This transforms SAVE's static calendar into an educational tool that explains WHY indicators matter.

### 17.5 StoryThread

- **Lifecycle:** Admin-created to group related articles. Updated to add description/change status. Never deleted.
- **Expected links:** 1:M to NewsArticle (R-5, storyThreadId FK on NewsArticle + orderInThread)
- **Query patterns:** Q-9 threadsByStatus, Q-10 threadArticles (ordered by orderInThread)
- **Mutation scope:** M-11 createStoryThread, M-12 updateStoryThread, M-13 assignArticleToThread
- **Index candidates:** status
- **Geospatial profile:** None
- **Time series profile:** None
- **Attachment profile:** None
- **Vector profile:** None
- **Cipher profile:** None
- **Value types:** None
- **Shared properties:** Auditable (SP-1)
- **Derived properties:** None
- **Marking requirements:** None
- **Automation triggers:** None
- **SAVE alignment:** SAVE has NO equivalent. This is Gap G-3. SAVE's news feed shows disconnected breaking news: "USTR 301조사 착수" then "트럼프 16개국 리스트" then "한국 포함." Our StoryThread groups these into a timeline: Article 1 (announcement) → Article 2 (list release) → Article 3 (Korea impact analysis). Each article's ArticleExplainer adds contextBefore/contextAfter to bridge the narrative.

### 17.6 WatchlistEntry

- **Lifecycle:** Created when user adds stock. Deleted when removed. Never updated — binary on/off.
- **Expected links:** M:1 to User (R-8, userId FK), M:1 to Stock (R-9, stockId FK)
- **Query patterns:** Q-14 watchlistByUser
- **Mutation scope:** M-1 addToWatchlist (with F-1 duplicate check), M-2 removeFromWatchlist
- **Index candidates:** userId, stockId, compound [userId, stockId] (uniqueness)
- **Geospatial profile:** None
- **Time series profile:** None
- **Attachment profile:** None
- **Vector profile:** None
- **Cipher profile:** None
- **Value types:** None
- **Shared properties:** None — join entities don't need Auditable
- **Derived properties:** None
- **Marking requirements:** None
- **Automation triggers:** None
- **SAVE alignment:** Mirrors SAVE's "관심 뉴스 설정" — keyword/company-based personalized feed. Our implementation uses explicit User ↔ Stock M:N join.

### 17.7 NewsStockLink

- **Lifecycle:** Seed/admin-created to associate news with stocks. Deleted to unlink. Never updated.
- **Expected links:** M:1 to NewsArticle (R-10, newsArticleId FK), M:1 to Stock (R-11, stockId FK)
- **Query patterns:** used internally by Q-2 feedByUser, Q-3 trendingStocks, Q-8 stockNews
- **Mutation scope:** Admin-only create/delete (seed data).
- **Index candidates:** newsArticleId, stockId, compound [newsArticleId, stockId] (uniqueness)
- **Geospatial profile:** None
- **Time series profile:** None
- **Attachment profile:** None
- **Vector profile:** None
- **Cipher profile:** None
- **Value types:** None
- **Shared properties:** None
- **Derived properties:** None
- **Marking requirements:** None
- **Automation triggers:** None
- **SAVE alignment:** SAVE tags news with stock/topic hashtags. Our NewsStockLink is the structured equivalent, enabling bidirectional queries that Convex arrays cannot support.

### 17.8 ArticleExplainer

- **Lifecycle:** Admin-created after NewsArticle exists. Updated to refine storytelling content. Never deleted.
- **Expected links:** 1:1 to NewsArticle (R-6, newsArticleId FK, unique constraint)
- **Query patterns:** Q-6 articleExplainer (1:1 lookup by newsArticleId)
- **Mutation scope:** M-6 createArticleExplainer, M-7 updateArticleExplainer
- **Index candidates:** newsArticleId (unique — 1:1 constraint), difficultyLevel
- **Geospatial profile:** None
- **Time series profile:** None
- **Attachment profile:** None
- **Vector profile:** None
- **Cipher profile:** None
- **Value types:** None
- **Shared properties:** Auditable (SP-1)
- **Derived properties:** None
- **Marking requirements:** None
- **Automation triggers:** None
- **SAVE alignment:** SAVE has NO equivalent — this is Gap G-1, the prototype's most important feature. Example transformation: SAVE article "FOMC 매파적 기조 유지, 점도표 상향 조정" becomes our explainer: "미국 중앙은행이 금리를 안 내렸어요. 왜 중요하냐면, 금리가 안 내려가면 기업들이 돈을 빌리기 비싸져요. 특히 테슬라, 엔비디아 같은 성장주는 미래 수익을 현재 가치로 환산할 때 금리의 영향을 크게 받아요." Fields: storyBody (narrative), keyTakeaways (bullet points), analogy (real-world comparison), difficultyLevel (beginner/intermediate/advanced), contextBefore/contextAfter (thread narrative bridges).

### 17.9 FinancialTerm

- **Lifecycle:** Admin-created. Updated to improve definitions. Never deleted (glossary is permanent).
- **Expected links:** M:N to NewsArticle (via ArticleTermUsage, R-3)
- **Query patterns:** Q-15 glossaryByCategory, Q-16 searchTerms, Q-17 termDetail
- **Mutation scope:** M-8 createFinancialTerm, M-9 updateFinancialTerm
- **Index candidates:** term, termKo (search), category
- **Geospatial profile:** None
- **Time series profile:** None
- **Attachment profile:** None
- **Vector profile:** None
- **Cipher profile:** None
- **Value types:** None
- **Shared properties:** Auditable (SP-1)
- **Derived properties:** None
- **Marking requirements:** None
- **Automation triggers:** None
- **SAVE alignment:** SAVE has NO equivalent — this is Gap G-2. SAVE articles use terms like "매파적", "점도표", "양적긴축" without explanation. Our FinancialTerm entity provides bilingual definitions (EN + KO), beginner-friendly explanations, categorized by domain (macro/equity/fixed-income/derivatives/crypto/general), with example sentences. One term definition serves 50+ articles via ArticleTermUsage.

### 17.10 ArticleTermUsage

- **Lifecycle:** Admin/seed-created with sentence context. Deleted to unlink. Never updated.
- **Expected links:** M:1 to NewsArticle (R-12, newsArticleId FK), M:1 to FinancialTerm (R-13, termId FK)
- **Query patterns:** Q-7 articleTermsByArticle (drives highlight rendering)
- **Mutation scope:** M-10 createArticleTermUsage
- **Index candidates:** newsArticleId, termId, compound [newsArticleId, termId] (uniqueness)
- **Geospatial profile:** None
- **Time series profile:** None
- **Attachment profile:** None
- **Vector profile:** None
- **Cipher profile:** None
- **Value types:** None
- **Shared properties:** None — join entities don't need Auditable
- **Derived properties:** None
- **Marking requirements:** None
- **Automation triggers:** None
- **SAVE alignment:** The bridge entity for Gap G-2. Records WHERE in the article body each term appears: sentenceContext captures the exact sentence, positionInArticle provides character offset for precise highlight rendering. User reads a SAVE-style article, sees "매파적" highlighted, taps it, gets a popover: "매파적 (Hawkish): 금리를 높이거나 유지하려는 입장. 반대말: 비둘기파(Dovish)."

---

## 18. Seed Data Specification

For prototype demonstration, seed data should include:

| Entity | Count | Content |
|--------|-------|---------|
| User | 6 | Diverse personas: trader, long-term investor, beginner, student, retiree, energy specialist |
| Stock | 10 | US large-caps: AAPL, TSLA, NVDA, GOOGL, MSFT, AMZN, XOM, JPM, META, UNH |
| StoryThread | 5 | Active narrative timelines (e.g., "Trump Tariff Escalation", "Fed Rate Path", "AI Chip War") |
| EconomicIndicator | 12 | Real 2026 calendar data with causal chains (PPI → CPI → FOMC) |
| FinancialTerm | 18 | Core terms: Hawkish, Dovish, Dot Plot, CPI, PPI, NFP, Fed Funds Rate, QT, QE, Yield Curve, etc. |
| NewsArticle | 20 | Real 2026 headlines from SAVE/FinancialJuice/Reuters feeds |
| ArticleExplainer | 20 | One per article — storytelling versions with context bridges |
| WatchlistEntry | 18 | Persona-driven stock selections |
| NewsStockLink | 50 | Multi-stock tagging per article |
| ArticleTermUsage | 40 | Term highlights with sentence context |

---

## 19. Pipeline Execution Order

This overview provides complete input for every skill in the pipeline:

```
SKILL                    READS FROM THIS OVERVIEW          WRITES TO
──────────────────────── ──────────────────────────────── ─────────────────────
/entities                §2 Object Types, §17 Briefs      data.ts (entities)
/value-types             §5 Value Types                    data.ts (value-types)
/properties              §3 Property Candidates            data.ts (properties)
/structs                 §4 Struct Types                   data.ts (structs)
/shared-properties       §6 Shared Property Types          data.ts (shared-props)
/links                   §7 Relationships                  logic.ts (links)
/interfaces              §8 Interfaces                     logic.ts (interfaces)
/queries                 §9 Queries                        logic.ts (queries)
/derived-properties      §10 Derived Properties            logic.ts (derived)
/functions               §11 Functions                     logic.ts (functions)
/mutations               §12 Mutations                     action.ts (mutations)
/webhooks                §13 Webhooks (none)               action.ts (webhooks)
/automation              §14 Automations                   action.ts (automations)
/permissions             §15.1-15.2 Roles + Matrix         security.ts (perms)
/markings                §15.3 Markings                    security.ts (markings)
/object-security         §15.4 RLS/CLS Policies            security.ts (policies)
/testing                 all of above                      test results
/codegen                 all of above                      src/ontology/
```

<!-- SECTION: decompose END -->
