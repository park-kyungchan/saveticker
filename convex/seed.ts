/**
 * SaveTicker — Seed Data Script (7-entity ontology)
 *
 * Populates the database with prototype data for PM demo.
 * Two story threads: Hormuz Strait Crisis + Private Credit Reckoning.
 *
 * Run via Convex dashboard or: bunx convex run seed:seedAll
 */
import { internalMutation } from "./_generated/server";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ts = (dateStr: string) => new Date(dateStr).getTime();
const now = Date.now();

// ---------------------------------------------------------------------------
// Seed: Main Entry Point
// ---------------------------------------------------------------------------

export const seedAll = internalMutation({
  args: {},
  handler: async (ctx) => {
    // =====================================================================
    // 1. STOCKS (10) — lean: ticker, name, sector only
    // =====================================================================
    await ctx.db.insert("stocks", {
      name: "Exxon Mobil", nameKo: "엑슨모빌", ticker: "XOM", sector: "energy",
    });
    await ctx.db.insert("stocks", {
      name: "Chevron", nameKo: "셰브론", ticker: "CVX", sector: "energy",
    });
    await ctx.db.insert("stocks", {
      name: "Lockheed Martin", nameKo: "록히드마틴", ticker: "LMT", sector: "industrials",
    });
    await ctx.db.insert("stocks", {
      name: "Korea Shipbuilding & Ocean Eng.", nameKo: "한국조선해양", ticker: "010140", sector: "industrials",
    });
    await ctx.db.insert("stocks", {
      name: "Korea Gas Corporation", nameKo: "한국가스공사", ticker: "036460", sector: "energy",
    });
    await ctx.db.insert("stocks", {
      name: "HD Hyundai Heavy Industries", nameKo: "HD현대중공업", ticker: "329180", sector: "industrials",
    });
    await ctx.db.insert("stocks", {
      name: "BlackRock", nameKo: "블랙록", ticker: "BLK", sector: "finance",
    });
    await ctx.db.insert("stocks", {
      name: "Apollo Global Management", nameKo: "아폴로글로벌", ticker: "APO", sector: "finance",
    });
    await ctx.db.insert("stocks", {
      name: "Blue Owl Capital", nameKo: "블루아울캐피털", ticker: "OWL", sector: "finance",
    });
    await ctx.db.insert("stocks", {
      name: "SK Innovation", nameKo: "SK이노베이션", ticker: "096770", sector: "energy",
    });
    await ctx.db.insert("stocks", {
      name: "Samsung Electronics", nameKo: "삼성전자", ticker: "005930", sector: "technology",
    });
    await ctx.db.insert("stocks", {
      name: "Hyundai Motor", nameKo: "현대자동차", ticker: "005380", sector: "consumer",
    });

    // =====================================================================
    // 2. USERS (3) — no preferredLanguage
    // =====================================================================
    await ctx.db.insert("users", {
      displayName: "Demo User", email: "demo-en@saveticker.app", updatedAt: now,
    });
    await ctx.db.insert("users", {
      displayName: "데모 사용자", email: "demo-ko@saveticker.app", updatedAt: now,
    });
    await ctx.db.insert("users", {
      displayName: "Admin", email: "admin@saveticker.app", updatedAt: now,
    });

    // =====================================================================
    // 3. STORY THREADS (2)
    // =====================================================================
    const threadHormuz = await ctx.db.insert("storyThreads", {
      title: "Hormuz Crisis: From Strait Closure to Stagflation Risk",
      titleKo: "호르무즈 위기: 해협 봉쇄에서 스태그플레이션 위험까지",
      description: "A 14-day arc (Feb 28 — Mar 12) tracking how US-Iran strikes escalated to a full Strait of Hormuz blockade, triggering cross-domain shockwaves: geopolitical (drone strikes, Hezbollah escalation) → energy (oil +20%, VLCC rates 94% spike) → financial (stagflation risk, Korea energy crisis). Key escalation points: Feb 28 initial strikes, Mar 1 strait closure, Mar 3 insurance withdrawal, Mar 9 oil $86, Mar 12 SPR release + leadership transition.",
      descriptionKo: "14일간의 위기 전개(2월 28일 — 3월 12일): 미-이란 공습이 호르무즈 해협 완전 봉쇄로 확대되며 지정학(드론 공격, 헤즈볼라 확전) → 에너지(유가 +20%, VLCC 운임 94% 급등) → 금융(스태그플레이션 위험, 한국 에너지 위기)으로 이어지는 교차 도메인 충격파 추적. 주요 격화 시점: 2/28 첫 공습, 3/1 해협 봉쇄, 3/3 보험 철회, 3/9 유가 $86, 3/12 SPR 방출 + 지도부 전환.",
      status: "active", updatedAt: now,
    });
    const threadCredit = await ctx.db.insert("storyThreads", {
      title: "Private Credit Reckoning: The $2 Trillion Question",
      titleKo: "사모신용의 심판: 2조 달러의 질문",
      description: "Institution cascade: Blackstone (7.9% redemptions, $150M personal capital) → BlackRock (5% gate on $26B fund) → Blue Owl (suspensions) → Morgan Stanley (North Haven PIF gated) → JPMorgan ($133B opaque exposure). The $2T private credit market faces its first real stress test as redemption waves spread across Wall Street's biggest alternative asset managers.",
      descriptionKo: "기관 연쇄: Blackstone(7.9% 환매, 임원 $1.5억 개인자금) → BlackRock(260억$ 펀드 5% 제한) → Blue Owl(환매 중단) → Morgan Stanley(North Haven PIF 제한) → JPMorgan($1,330억 불투명 노출). 2조 달러 사모신용 시장이 월스트리트 최대 대체자산 운용사들에 환매 파동이 번지며 첫 번째 진짜 스트레스 테스트에 직면.",
      status: "active", updatedAt: now,
    });

    // =====================================================================
    // 4. NEWS ARTICLES (15) — with mentionedTickers (replaces newsStockLinks)
    // =====================================================================

    // --- Thread A: Hormuz (10 articles) ---

    const art1 = await ctx.db.insert("newsArticles", {
      title: "US-Israel strikes hit Iran; Strait of Hormuz shipping halted",
      titleKo: "미-이스라엘 연합군 이란 타격; 호르무즈 해협 운항 전면 중단",
      summary: "US and Israeli forces launched strikes on Iran. Iran's IRGC declared Strait of Hormuz closed. Tanker traffic dropped from 50/day to zero within days.",
      summaryKo: "미국과 이스라엘이 이란 군사시설을 공습하자 혁명수비대가 호르무즈 해협 봉쇄를 선언했습니다. 유조선 통행이 수일 내 50척에서 0으로 급감하며, 전 세계 원유 공급의 20%가 차단 위기에 놓였습니다.",
      body: `US and Israeli forces launched coordinated strikes on Iranian military targets on February 28, marking a significant escalation in Middle East tensions. In response, Iran's Islamic Revolutionary Guard Corps (IRGC) declared the Strait of Hormuz effectively closed to shipping traffic, warning that any vessel attempting passage would be targeted.

Data from the UK Maritime Trade Operations (UKMTO), citing Joint Maritime Information Centre (JMIC) analysis, showed tanker traffic through the strait collapsed from approximately 50 vessels per day on February 28 to just 3 on March 1, and zero by March 3.

The Strait of Hormuz is a narrow waterway between Oman and Iran through which approximately 20% of the world's crude oil supply and 19% of global LNG flows are transported. Its closure represents the most significant disruption to global energy supply chains since the 1979 Iranian Revolution.

The US military's Central Command (CENTCOM) has disputed Iran's claim of full closure, though commercial shipping operators have largely halted transits due to the security threat and withdrawal of marine insurance coverage.`,
      bodyKo: `미국과 이스라엘 연합군은 2월 28일 이란 군사시설에 대한 합동 공습을 감행하며 중동 긴장이 크게 고조되었습니다. 이에 이란 혁명수비대(IRGC)는 호르무즈 해협의 사실상 봉쇄를 선언하고, 통과를 시도하는 모든 선박을 공격하겠다고 경고했습니다. 영국 해상무역작전부(UKMTO) 자료에 따르면 해협 통과 유조선 수가 2월 28일 약 50척에서 3월 1일 3척, 3월 3일에는 0척으로 급감했습니다.

호르무즈 해협은 오만과 이란 사이의 최협부 폭 약 34km의 수로로, 전 세계 원유 공급량의 약 20%(일일 약 2,000만 배럴, 연간 교역액 $5,000억 이상)와 글로벌 LNG 물동량의 19%가 이곳을 통과합니다. 통과 물량의 84%가 아시아로 향하며, 한국은 원유 수입의 약 60%를 이 경로에 의존합니다. 미 중부사령부(CENTCOM)는 이란의 완전 봉쇄 주장에 이의를 제기했으나, 보안 위협과 해상보험 철회로 상업 운항은 사실상 중단된 상태입니다.`,
      sourceUrl: "https://www.reuters.com/world/middle-east/",
      sourceName: "Reuters",
      publishedAt: ts("2026-03-01T08:00:00Z"),
      category: "breaking",
      mentionedTickers: ["XOM", "CVX", "LMT", "010140", "329180"],
      storyThreadId: threadHormuz, orderInThread: 1,
      updatedAt: now,
    });

    const art2 = await ctx.db.insert("newsArticles", {
      title: "Oil supertanker rates hit all-time high as insurers drop war risk cover",
      titleKo: "초대형유조선 운임 사상 최고치 — 보험사, 전쟁위험 보장 철회",
      summary: "VLCC rates surged 94% to $423,736/day. Five major marine insurers canceled war risk cover for Persian Gulf vessels.",
      summaryKo: "VLCC 운임이 하루 만에 94% 급등해 일일 $423,736를 기록했습니다. 5개 주요 보험사가 페르시아만 전쟁위험보험을 취소하면서 상업 운항이 사실상 중단되었습니다.",
      body: `The benchmark freight rate for Very Large Crude Carriers (VLCCs) — ships capable of carrying 2 million barrels of oil from the Middle East to China — surged to an all-time high of $423,736 per day on Monday, an increase of more than 94% from Friday's close, according to LSEG data.

The spike followed announcements from five major marine insurers — Gard, Skuld, NorthStandard, the American Club, and the London P&I Club — that they were canceling war risk cover for vessels operating in the Persian Gulf.

"Most shipowners were avoiding transits through the Strait of Hormuz after insurers cancelled the war risk coverage for vessels in certain areas of the region," said Sheel Bhattacharjee, head of freight pricing in Europe at Argus Media.

According to Argus Media, roughly one-third of seaborne crude oil trade moves through the Strait of Hormuz, alongside 19% of global LNG flows and 14% of global refined products trade. Oil producers in the Middle East have not yet announced a halt to production, and ports in the UAE, Oman and Kuwait remain operational, though shipments have effectively stalled.`,
      bodyKo: `초대형원유운반선(VLCC) — 중동에서 중국으로 200만 배럴의 원유를 운송하는 선박 — 의 기준 운임이 LSEG 데이터 기준 일일 $423,736까지 급등하며 사상 최고치를 기록했습니다. 금요일 종가 대비 94% 이상의 상승입니다. 5개 주요 해상보험사(Gard, Skuld, NorthStandard, American Club, London P&I Club)가 페르시아만 운항 선박에 대한 전쟁위험 보장을 취소했습니다.

Argus Media에 따르면 전 세계 해상 원유 교역량의 약 1/3이 호르무즈 해협을 통과하며, 글로벌 LNG의 19%, 정제유의 14%도 이 경로를 이용합니다. 사우디아라비아는 해협을 통해 일일 약 550만 배럴을 수출합니다. 중동 산유국들은 아직 생산 중단을 발표하지 않았고 UAE·오만·쿠웨이트 항구도 운영 중이나, 보험 없이는 선적이 사실상 불가능한 상태입니다.`,
      sourceUrl: "https://www.cnbc.com/2026/03/03/middle-east-crisis-iran-us-shipping-oil-tankers-strait-of-hormuz.html",
      sourceName: "CNBC",
      publishedAt: ts("2026-03-03T11:30:00Z"),
      category: "breaking",
      mentionedTickers: ["XOM", "010140", "329180"],
      storyThreadId: threadHormuz, orderInThread: 2,
      updatedAt: now,
    });

    const art3 = await ctx.db.insert("newsArticles", {
      title: "Oil prices surge 20%; Goldman raises Brent forecast, warns of $100",
      titleKo: "유가 20% 급등; 골드만삭스, 브렌트유 전망 상향·$100 경고",
      summary: "Oil prices hit highest since July 2022. Goldman Sachs raised Q2 Brent forecast by $10 to $76/bbl. If Hormuz flows don't resume, Brent could reach $100.",
      summaryKo: "유가가 2022년 7월 이후 최고치로 급등했습니다. 골드만삭스는 2분기 브렌트유 전망을 $10 상향하고, 호르무즈 통행 미재개 시 $100 도달을 경고했습니다. 스태그플레이션 우려가 고조됩니다.",
      body: `Oil prices surged approximately 20% in early trading on Monday, hitting their highest level since July 2022, as the expanding US-Israeli military campaign against Iran continued to disrupt energy flows through the Strait of Hormuz.

Goldman Sachs raised its second-quarter 2026 Brent crude forecast by $10 to $76 per barrel, citing the disruption. The investment bank warned that if traffic through the Strait of Hormuz does not resume in the near term, Brent could reach $100 per barrel.

Bernstein analysts outlined a worst-case scenario of $150 per barrel if the conflict extends beyond three months. US financial firm Charles Schwab separately warned that a prolonged three-month war could push oil past $100 and trigger recessions in Europe and Asia.

The oil price surge raises concerns about stagflation — a combination of economic stagnation and persistent inflation. Higher energy costs feed directly into consumer prices, transportation costs, and manufacturing inputs. In 2022, a similar supply-driven oil spike contributed to US inflation reaching 9.1%, prompting the Federal Reserve to raise interest rates from 0.25% to 4.5%.`,
      bodyKo: `유가가 월요일 조기 거래에서 약 20% 급등하며 2022년 7월 이후 최고치를 기록했습니다. 미-이스라엘의 대이란 군사작전 확대가 호르무즈 해협을 통한 에너지 흐름을 계속 교란하고 있습니다.

골드만삭스는 2분기 브렌트유 전망을 배럴당 $10 상향한 $76로 조정하고, 호르무즈 통행이 단기간 내 재개되지 않을 경우 $100에 도달할 수 있다고 경고했습니다. Bernstein 애널리스트는 분쟁이 3개월 이상 지속될 경우 $150까지 치솟는 최악의 시나리오를 제시했습니다.

유가 급등은 스태그플레이션(Stagflation) — 경기침체와 물가상승이 동시에 발생하는 상황 — 우려를 높이고 있습니다. 에너지 비용 상승은 소비자 물가, 운송비, 제조원가에 직접 반영됩니다. 2022년 유사한 공급발 유가 급등 때 미국 인플레이션이 9.1%까지 치솟았고, 연준은 기준금리를 0.25%에서 4.5%로 인상해야 했습니다.`,
      sourceUrl: "https://www.reuters.com/business/energy/",
      sourceName: "Reuters / Goldman Sachs",
      publishedAt: ts("2026-03-09T07:00:00Z"),
      category: "analysis",
      mentionedTickers: ["XOM", "CVX", "036460", "096770"],
      storyThreadId: threadHormuz, orderInThread: 3,
      updatedAt: now,
    });

    const art4 = await ctx.db.insert("newsArticles", {
      title: "Korea faces energy crisis as Middle East crude dependency hits 69%",
      titleKo: "한국, 에너지 위기 직면 — 중동 원유 의존도 69%",
      summary: "Korea imports 69.3% of crude from Middle East, mostly through Hormuz. Stagflation concerns mount as high oil feeds into inflation.",
      summaryKo: "한국의 원유 수입 중 69.3%가 중동산이며 대부분 호르무즈를 경유합니다. 유가 상승이 제조원가와 물가에 직접 반영되면서 스태그플레이션 우려가 커지고 있습니다.",
      body: `South Korea faces heightened exposure to the Strait of Hormuz crisis, with 69.3% of the country's crude oil imports sourced from the Middle East — the vast majority transiting through the now-disrupted waterway.

According to PwC Samil, the disruption to crude oil and LNG shipments through the Strait of Hormuz is "likely to translate directly into surging energy prices," which would "raise manufacturing costs and amplify inflationary pressure, eroding corporate profitability."

Iraq, a key supplier to Korea, has already cut daily production by approximately 1.5 million barrels (40% of its 4 million barrel/day output) as storage capacity reached its limits with export routes blocked.

The Shanghai Container Freight Index (SCFI) jumped 156 points to 1,489 — double the prior week's increase — as the shipping disruption spread beyond oil tankers to container and bulk carriers.

Korea Gas Corporation (KOGAS), the country's sole LNG importer, faces particular pressure as 19% of global LNG flows pass through the Strait of Hormuz. Analysts note that even a partial and temporary disruption could have outsized effects on Korea's energy-intensive manufacturing sector.`,
      bodyKo: `한국은 대부분의 국민이 모르는 에너지 취약성을 안고 있습니다. 원유 수입의 69.3%가 중동에서 조달되며, 그 대부분이 현재 교란된 호르무즈 해협을 통과합니다. PwC 삼일은 호르무즈를 통한 원유·LNG 선적 차질이 "에너지 가격 급등으로 직결되어 제조원가를 높이고 인플레이션 압력을 가중시키며 기업 수익성을 잠식할 가능성이 높다"고 분석했습니다.

이라크는 주요 대한 원유 공급국으로, 수출 경로 차단에 따른 저장 용량 한계로 일일 생산량 약 150만 배럴(400만 배럴 생산능력의 40%)을 이미 감축했습니다. 상하이컨테이너운임지수(SCFI)는 156포인트 상승한 1,489를 기록해 전주 상승폭의 2배에 달했으며, 교란이 유조선을 넘어 컨테이너·벌크 선박으로 확산되고 있습니다.

한국가스공사(KOGAS)는 글로벌 LNG 물동량의 19%가 호르무즈를 통과하는 만큼 특히 큰 압력에 직면해 있습니다. 한국은 세계 5위 석유 수입국이자 에너지 집약적 제조업 강국으로, 부분적·일시적 교란만으로도 경제에 과도한 영향을 미칠 수 있습니다.`,
      sourceUrl: "https://www.mk.co.kr/news/world/11981136",
      sourceName: "Maeil Business Newspaper",
      publishedAt: ts("2026-03-06T02:00:00Z"),
      category: "analysis",
      mentionedTickers: ["036460", "096770", "010140"],
      storyThreadId: threadHormuz, orderInThread: 4,
      updatedAt: now,
    });

    const art5 = await ctx.db.insert("newsArticles", {
      title: "Mojtaba Khamenei issues first statement as Supreme Leader; vows 'decisive response'",
      titleKo: "모즈타바 하메네이, 최고지도자 취임 후 첫 성명 — '단호한 대응' 천명",
      summary: "Ali Khamenei's son assumes leadership after father's death. Vows retaliation against US-Israel 'aggression' and pledges to maintain Hormuz blockade.",
      summaryKo: "알리 하메네이의 아들이 아버지 사망 후 최고지도자직을 승계했습니다. 미-이스라엘 '침략'에 대한 보복을 선언하고 호르무즈 봉쇄 유지를 공언했습니다.",
      body: `Mojtaba Khamenei, the 55-year-old son of Ayatollah Ali Khamenei, issued his first public statement as Iran's new Supreme Leader on Wednesday, following his father's death on March 10 — reportedly from complications related to the ongoing military conflict.

The Assembly of Experts, Iran's 88-member clerical body, confirmed his appointment within hours, a move widely interpreted as having been pre-arranged. Western intelligence agencies had long identified Mojtaba as his father's likely successor.

In his statement, broadcast on state television and translated by IRNA, Mojtaba declared: "The Islamic Republic will not forgive the criminal aggression against our nation. The Strait of Hormuz will remain closed until the aggressors withdraw completely and pay reparations for their crimes."

The leadership transition introduces significant uncertainty into an already volatile situation. Analysts at the International Crisis Group noted that Mojtaba lacks his father's decades of political experience and may face internal challenges from IRGC hardliners seeking an even more aggressive response.`,
      bodyKo: `알리 하메네이의 아들 모즈타바 하메네이(55세)가 3월 10일 아버지의 사망 — 진행 중인 군사 분쟁 관련 합병증으로 보도 — 에 따라 이란 신임 최고지도자로서 첫 공식 성명을 발표했습니다. 전문가위원회(88인 성직자 기구)가 수시간 내 그의 임명을 확인했으며, 이는 사전에 조율된 것으로 해석됩니다.

성명에서 모즈타바는 "이슬람 공화국은 우리 민족에 대한 범죄적 침략을 용서하지 않을 것"이라며 "침략자들이 완전히 철수하고 배상할 때까지 호르무즈 해협은 봉쇄된 상태를 유지할 것"이라고 선언했습니다. 국제위기그룹(ICG) 분석가들은 모즈타바가 아버지의 수십 년간의 정치 경험이 부족하며, 더 공격적인 대응을 요구하는 혁명수비대 강경파의 내부 도전에 직면할 수 있다고 지적했습니다.`,
      sourceUrl: "https://www.reuters.com/world/middle-east/",
      sourceName: "Reuters / IRNA",
      publishedAt: ts("2026-03-12T04:00:00Z"),
      category: "breaking",
      mentionedTickers: ["XOM", "LMT"],
      storyThreadId: threadHormuz, orderInThread: 5,
      updatedAt: now,
    });

    const art6 = await ctx.db.insert("newsArticles", {
      title: "Trump declares 'victory' over Iran; signals exit strategy as oil markets stabilize",
      titleKo: "트럼프, 이란에 '승리' 선언; 유가 안정 속 철수 전략 시사",
      summary: "Trump claims mission accomplished, proposes ceasefire framework. Oil dips 3% on de-escalation hopes. Pentagon begins drawing down carrier groups.",
      summaryKo: "트럼프 대통령이 이란 핵시설 파괴와 지도자 사망을 근거로 '완전한 승리'를 선언하고 72시간 휴전 프레임워크를 제안했습니다. 유가는 3% 하락했으나 애널리스트들은 긴장 완화가 불확실하다고 경고합니다.",
      body: `President Trump declared "total victory" over Iran in a Rose Garden address Wednesday morning, citing the destruction of Iran's nuclear enrichment facilities and the death of Supreme Leader Ali Khamenei as evidence that US military objectives had been achieved.

"We have eliminated the nuclear threat. Iran will never build a bomb. Now it's time to bring our great soldiers home," Trump said, announcing a proposed 72-hour ceasefire framework that would include reopening the Strait of Hormuz to commercial shipping.

Oil prices dipped approximately 3% on the announcement, with Brent crude falling from $86 to $83.40 per barrel in early trading. However, analysts cautioned that de-escalation remains uncertain given Mojtaba Khamenei's defiant rhetoric.

The Pentagon confirmed that the USS Gerald R. Ford carrier strike group would begin repositioning from the Persian Gulf within 48 hours, while maintaining the USS Eisenhower group on station as a "stabilization force." Defense officials noted that 68% of pre-identified military targets had been neutralized.`,
      bodyKo: `트럼프 대통령은 수요일 로즈가든 연설에서 이란 핵농축 시설 파괴와 최고지도자 사망을 근거로 "이란에 대한 완전한 승리"를 선언했습니다. "우리는 핵 위협을 제거했습니다. 위대한 군인들을 귀국시킬 때입니다"라며 호르무즈 해협의 상업 운항 재개를 포함한 72시간 휴전 프레임워크를 제안했습니다.

유가는 발표 직후 약 3% 하락해 브렌트유가 $86에서 $83.40으로 떨어졌습니다. 그러나 애널리스트들은 모즈타바 하메네이의 강경 발언을 고려할 때 긴장 완화가 불확실하다고 경고합니다. 국방부는 포드 항모전단이 48시간 내 페르시아만에서 재배치를 시작하되, 아이젠하워 전단은 '안정화 병력'으로 현장에 유지한다고 확인했습니다.`,
      sourceUrl: "https://www.cnbc.com/2026/03/12/",
      sourceName: "CNBC / White House Pool",
      publishedAt: ts("2026-03-12T14:00:00Z"),
      category: "breaking",
      mentionedTickers: ["XOM", "CVX", "LMT"],
      storyThreadId: threadHormuz, orderInThread: 6,
      updatedAt: now,
    });

    const art7 = await ctx.db.insert("newsArticles", {
      title: "US announces historic Strategic Petroleum Reserve release: 400M barrels over 6 months",
      titleKo: "미국, 역대 최대 전략비축유 방출 발표: 6개월간 4억 배럴",
      summary: "Largest SPR release in history aims to stabilize oil at $75. DOE will coordinate with IEA member nations for additional 200M barrels.",
      summaryKo: "미국 역사상 최대 규모의 전략비축유(SPR) 방출로 유가를 $75 수준에서 안정시키려 합니다. IEA 회원국이 추가 2억 배럴을 방출해 총 6억 배럴을 시장에 공급합니다.",
      body: `The US Department of Energy announced the largest Strategic Petroleum Reserve (SPR) release in American history — 400 million barrels to be delivered over six months — in a bid to stabilize global oil markets amid the Hormuz crisis.

Energy Secretary Jennifer Granholm stated that the release, combined with commitments from IEA member nations to release an additional 200 million barrels from their own reserves, would "more than compensate for the temporary disruption to Hormuz flows."

The SPR currently holds approximately 700 million barrels, meaning the release would reduce US strategic reserves to their lowest level since 1984. Republican lawmakers immediately criticized the decision, with Senate Energy Committee ranking member John Barrasso calling it "reckless depletion of our national security buffer."

Goldman Sachs revised its Brent crude forecast downward to $75 per barrel for Q2 2026, noting that the combined SPR + IEA release of 600 million barrels would effectively replace approximately three months of Hormuz disruption.`,
      bodyKo: `미국 에너지부(DOE)는 호르무즈 위기에 대응해 미국 역사상 최대 규모의 전략비축유(SPR) 방출을 발표했습니다 — 6개월에 걸쳐 4억 배럴을 시장에 공급합니다. 제니퍼 그랜홈 에너지장관은 IEA 회원국의 추가 2억 배럴 방출 약속과 합산하면 "호르무즈 통행의 일시적 교란을 충분히 보상할 것"이라고 밝혔습니다.

현재 SPR 보유량은 약 7억 배럴로, 이번 방출로 1984년 이래 최저 수준으로 감소합니다. 공화당 의원들은 즉각 "국가안보 완충장치의 무모한 소진"이라며 비판했습니다. 골드만삭스는 SPR+IEA 합산 6억 배럴이 호르무즈 교란 약 3개월분을 대체한다며 2분기 브렌트유 전망을 $75로 하향 조정했습니다.`,
      sourceUrl: "https://www.reuters.com/business/energy/",
      sourceName: "Reuters / DOE",
      publishedAt: ts("2026-03-12T16:00:00Z"),
      category: "breaking",
      mentionedTickers: ["XOM", "CVX", "096770"],
      storyThreadId: threadHormuz, orderInThread: 7,
      updatedAt: now,
    });

    const art8 = await ctx.db.insert("newsArticles", {
      title: "Korea enacts emergency petroleum price caps: ₩1,724/L ceiling for gasoline",
      titleKo: "한국, 긴급 유류 가격상한제 시행: 휘발유 리터당 ₩1,724 상한",
      summary: "Ministry of Trade caps retail gasoline at ₩1,724/L and diesel at ₩1,612/L. Subsidy program of ₩2.3T allocated. 30-day emergency measure.",
      summaryKo: "산업통상자원부가 휘발유 ₩1,724/L, 경유 ₩1,612/L의 가격상한제를 시행합니다. 정유사 보전을 위한 2.3조 원 보조금이 배정되었습니다. 30일간의 긴급 조치입니다.",
      body: `South Korea's Ministry of Trade, Industry and Energy enacted emergency petroleum price caps Wednesday, setting the maximum retail price for gasoline at ₩1,724 per liter and diesel at ₩1,612 per liter — effectively freezing prices at Monday's levels.

The 30-day emergency measure, authorized under the Petroleum Business Act Article 15, comes with a ₩2.3 trillion ($1.7 billion) subsidy allocation to compensate refiners for the gap between international crude costs and the capped retail prices.

"Korean households and businesses cannot bear the full burden of a geopolitical crisis they did not create," said Trade Minister Ahn Duck-geun. The price caps are expected to prevent an additional 0.3-0.5 percentage point increase in March CPI.

SK Innovation and S-Oil, Korea's two largest refiners, issued joint statements expressing "concern about the sustainability of price controls beyond 30 days" if international crude prices remain elevated. KOGAS separately requested emergency LNG procurement authorization from Qatar and Australia to diversify away from Middle East-dependent supply routes.`,
      bodyKo: `산업통상자원부는 수요일 석유사업법 제15조에 근거한 긴급 유류 가격상한제를 시행하여 휘발유 소매가를 리터당 ₩1,724, 경유를 ₩1,612로 사실상 월요일 수준에서 동결했습니다. 30일간의 이 긴급 조치에는 국제 원유가와 상한 소매가 간 차이를 정유사에 보전하기 위한 2.3조 원($17억) 보조금이 배정되었습니다.

안덕근 산업부 장관은 "한국 가계와 기업이 자신이 만들지 않은 지정학적 위기의 부담을 모두 질 수 없다"고 밝혔습니다. 가격 상한제로 3월 CPI의 0.3~0.5%p 추가 상승을 방지할 것으로 전망됩니다. SK이노베이션과 S-Oil은 국제 원유가가 고공행진을 지속할 경우 "30일 초과 가격통제의 지속가능성에 대한 우려"를 표명했습니다. 한국가스공사(KOGAS)는 중동 의존 공급 경로에서 벗어나기 위해 카타르·호주로부터의 긴급 LNG 조달 승인을 별도 요청했습니다.`,
      sourceUrl: "https://www.mk.co.kr/news/economy/",
      sourceName: "Maeil Business Newspaper",
      publishedAt: ts("2026-03-12T02:00:00Z"),
      category: "breaking",
      mentionedTickers: ["036460", "096770"],
      storyThreadId: threadHormuz, orderInThread: 8,
      updatedAt: now,
    });

    const art9 = await ctx.db.insert("newsArticles", {
      title: "Iraq ports shut down; Iran drones strike UAE, Bahrain, Kuwait oil facilities",
      titleKo: "이라크 항구 폐쇄; 이란 드론, UAE·바레인·쿠웨이트 석유시설 공격",
      summary: "Iraq suspends Basra port operations. Iranian drone swarms hit targets in 3 Gulf states. OPEC+ emergency session called. Global oil supply reduced by 8M bpd.",
      summaryKo: "이라크가 바스라 항 운영을 중단하고, 이란 드론이 3개 걸프국 석유시설을 동시 타격했습니다. OPEC+ 긴급회의가 소집되었습니다. 전 세계 석유 공급이 일일 약 800만 배럴(약 8%) 감소했습니다.",
      body: `The Hormuz crisis expanded dramatically overnight as Iranian drone swarms struck oil infrastructure in three Gulf states simultaneously, while Iraq suspended all operations at Basra port — its primary crude export terminal handling 3.3 million barrels per day.

Iran's IRGC launched approximately 150 Shahed-136 drones targeting oil storage facilities in Abu Dhabi (UAE), Bahrain's Sitra refinery, and Kuwait's Al-Ahmadi port complex. UAE air defenses intercepted approximately 60% of incoming drones, but fires were reported at two Abu Dhabi National Oil Company (ADNOC) storage tanks.

Iraq's decision to close Basra port removed an additional 3.3 million barrels per day from global supply — on top of the estimated 5 million bpd already halted by the Hormuz closure. Combined, approximately 8 million barrels per day (roughly 8% of global supply) is now offline.

OPEC+ called an emergency session for Thursday. Saudi Arabia, whose Red Sea export routes remain operational, offered to increase production by 1 million bpd. However, analysts note this would replace only a fraction of the lost supply.`,
      bodyKo: `이란 혁명수비대가 약 150기의 샤헤드-136 드론으로 3개 걸프국의 석유 인프라를 동시 타격하면서 호르무즈 위기가 급격히 확대되었습니다. UAE 아부다비, 바레인 시트라 정유소, 쿠웨이트 알아흐마디 항만단지가 공격 대상이었습니다. UAE 방공망이 약 60%를 요격했으나 아부다비국영석유(ADNOC) 저장탱크 2기에서 화재가 발생했습니다.

이라크는 주요 원유 수출 터미널인 바스라 항의 운영을 전면 중단했습니다. 이로써 일일 약 330만 배럴이 추가 공급 차단되어, 호르무즈 봉쇄로 이미 중단된 약 500만 배럴과 합산하면 일일 약 800만 배럴(전 세계 공급량의 약 8%)이 오프라인 상태입니다. OPEC+는 목요일 긴급회의를 소집했으며, 홍해 수출 경로가 여전히 가동 중인 사우디가 일일 100만 배럴 증산을 제안했으나 손실 물량의 일부에 불과합니다.`,
      sourceUrl: "https://www.reuters.com/world/middle-east/",
      sourceName: "Reuters / JMIC",
      publishedAt: ts("2026-03-12T06:00:00Z"),
      category: "breaking",
      mentionedTickers: ["XOM", "036460", "329180"],
      storyThreadId: threadHormuz, orderInThread: 9,
      updatedAt: now,
    });

    const art10 = await ctx.db.insert("newsArticles", {
      title: "Hezbollah fires 200+ rockets into northern Israel; IDF activates Iron Dome reserve batteries",
      titleKo: "헤즈볼라, 이스라엘 북부에 200발 이상 로켓 발사; IDF 아이언돔 예비 가동",
      summary: "Hezbollah opens second front with largest barrage since 2006. 4 rockets hit Haifa industrial zone. Israel calls up 50K reservists.",
      summaryKo: "헤즈볼라가 2006년 이후 최대 규모의 로켓 공격으로 제2전선을 열었습니다. 4발이 하이파 산업지구에 명중했으며, 이스라엘은 예비군 5만 명을 소집했습니다.",
      body: `Hezbollah launched over 200 rockets from southern Lebanon into northern Israel on Wednesday, marking the largest single barrage since the 2006 Lebanon War and opening a significant second front in the expanding Middle East conflict.

The Israeli Defense Forces (IDF) confirmed that Iron Dome intercepted approximately 85% of incoming rockets, but four struck Haifa's industrial zone, causing fires at a chemical storage facility. Israel's Home Front Command issued shelter orders for all communities within 40 kilometers of the Lebanese border.

Prime Minister Netanyahu announced the call-up of 50,000 reservists and warned of "severe consequences" for Lebanon. The IDF launched retaliatory strikes on approximately 40 Hezbollah targets in southern Lebanon and Beirut's southern suburbs.

The escalation adds a new dimension to what had been primarily an air-and-sea conflict focused on Iran's nuclear facilities and the Hormuz Strait. Defense analysts warn that a ground operation in Lebanon would further strain US military assets already committed to the Persian Gulf campaign.`,
      bodyKo: `헤즈볼라가 수요일 남부 레바논에서 이스라엘 북부로 200발 이상의 로켓을 발사했습니다. 2006년 레바논 전쟁 이후 단일 공격으로는 최대 규모이며, 확대되는 중동 분쟁에서 중대한 제2전선이 열린 것입니다.

이스라엘방위군(IDF)은 아이언돔이 약 85%를 요격했으나 4발이 하이파 산업지구에 명중해 화학물질 저장시설에서 화재가 발생했다고 확인했습니다. 네타냐후 총리는 예비군 5만 명 소집을 발표하고 레바논에 "심각한 결과"를 경고했습니다. 이 확전은 이란 핵시설과 호르무즈에 집중되었던 해공 분쟁에 새로운 차원을 추가합니다. 국방 분석가들은 레바논 지상작전이 이미 페르시아만에 투입된 미군 자산에 추가 부담이 될 것이라고 경고합니다.`,
      sourceUrl: "https://www.reuters.com/world/middle-east/",
      sourceName: "Reuters / IDF Spokesperson",
      publishedAt: ts("2026-03-12T10:00:00Z"),
      category: "breaking",
      mentionedTickers: ["LMT", "XOM"],
      storyThreadId: threadHormuz, orderInThread: 10,
      updatedAt: now,
    });

    // --- Thread B: Private Credit (5 articles) ---

    const art11 = await ctx.db.insert("newsArticles", {
      title: "BlackRock caps withdrawals from $26B private credit fund at 5%",
      titleKo: "블랙록, $260억 사모신용 펀드 환매를 5%로 제한",
      summary: "BlackRock's HPS Corporate Lending Fund limited quarterly redemptions to 5% after investors requested 9.3%. Only $620M of $1.2B requests honored.",
      summaryKo: "블랙록의 HPS Corporate Lending Fund가 분기 환매를 5%로 제한했습니다. 투자자들이 9.3% 환매를 요청했으나 $12억 중 $6.2억만 충족되었습니다.",
      body: `BlackRock's HPS Corporate Lending Fund, a $26 billion business development company (BDC) that makes private credit loans, announced it would cap quarterly share repurchases at 5% of outstanding shares — the contractual minimum.

Investors had requested redemptions totaling 9.3% of the fund's shares in the first quarter of 2026, amounting to approximately $1.2 billion. The fund honored roughly $620 million, leaving the remainder unfulfilled.

The 5% cap is designed to prevent a "structural mismatch between investor capital and the expected duration of the private credit loans" held by the fund, according to regulatory filings. Unlike publicly traded bonds, private credit loans cannot be easily sold on short notice.

The restriction follows similar moves by other major private credit managers. Blue Owl Capital suspended quarterly redemptions from its private lending fund in February. Blackstone's flagship private credit fund faced approximately $3.8 billion in redemption requests (7.9% of net assets) and required $150 million in personal capital from 25+ senior leaders, plus $250 million from its balance sheet, to cover outflows.`,
      bodyKo: `블랙록의 HPS Corporate Lending Fund(260억 달러 규모 BDC)가 분기 자사주 매입을 발행 주식의 5%(계약상 최소한도)로 제한한다고 발표했습니다. 투자자들은 1분기에 펀드 지분의 9.3%, 약 $12억의 환매를 요청했으나 약 $6.2억만 충족되었습니다.

5% 상한은 "투자자 자본과 펀드가 보유한 Private Credit (사모신용) 대출의 예상 만기 간 구조적 불일치를 방지"하기 위한 것입니다. 공개 거래 채권과 달리 사모신용 대출은 단기간에 쉽게 매각할 수 없습니다. 블루아울캐피털은 2월에 분기 환매를 전면 중단했고, 블랙스톤 플래그십 펀드는 약 $38억(순자산의 7.9%) 환매 요청에 25명 이상 임원이 $1.5억의 개인자금을 투입하고 회사 자본 $2.5억을 추가 투입해야 했습니다.`,
      sourceUrl: "https://seekingalpha.com/news/4561908",
      sourceName: "Bloomberg / Seeking Alpha",
      publishedAt: ts("2026-03-06T14:00:00Z"),
      category: "breaking",
      mentionedTickers: ["BLK", "APO", "OWL"],
      storyThreadId: threadCredit, orderInThread: 1,
      updatedAt: now,
    });

    const art12 = await ctx.db.insert("newsArticles", {
      title: "Private credit market shows cracks: $2T bubble comparison to 2008",
      titleKo: "사모신용 시장에 균열: 2008년 버블과의 비교, $2조 규모",
      summary: "Private credit approaching $3T. BlackRock marked a private loan from 100 to zero. Mohamed El-Erian calls it 'canary in the coal mine.'",
      summaryKo: "사모신용 시장이 약 $3조에 근접한 가운데, 블랙록이 사모대출 가치를 100에서 0으로 평가절하했습니다. 모하메드 엘-에리안은 '탄광 속 카나리아'라고 경고합니다.",
      body: `The private credit market — estimated by Morgan Stanley at approaching $3 trillion in total assets, larger than both the public high-yield bond market and the syndicated loan market — is facing its first major stress test.

Bloomberg News reported that BlackRock slashed the value of a private loan to zero at the end of 2025, just three months after valuing it at 100 cents on the dollar. Separately, BlackRock's private credit fund signaled in January that it was preparing to mark down the value of its assets by 19%.

Mohamed El-Erian, economist and former PIMCO CEO, warned that private credit may be facing a "canary in the coal mine" moment. Dan Rasmussen of Verdad Capital called the situation "a classic case of fool's yield — high yield that doesn't translate into high returns because the borrowers were too risky."

Unlike publicly traded corporate bonds, private credit loans are not traded on exchanges, meaning their real value is often determined by the same firms that originated and sold them. Moody's projects private credit assets under management will exceed $2 trillion in 2026 and approach $4 trillion by 2030.

The sector has significant exposure to software companies, a sector already facing disruption from artificial intelligence. Wealthy individual investors — doctors, dentists, small-business owners — have been increasingly marketed these products as alternatives to traditional fixed income.`,
      bodyKo: `모건스탠리 추정 약 $3조에 달하는 사모신용 시장이 — 공공 하이일드 채권시장과 신디케이트론 시장 모두를 능가하는 규모 — 첫 번째 주요 스트레스 테스트에 직면하고 있습니다. 블룸버그는 블랙록이 2025년 말 사모대출 가치를 100에서 0으로 평가절하했다고 보도했으며, 별도로 블랙록 사모신용 펀드는 자산 가치를 19% 인하할 준비를 시사했습니다.

모하메드 엘-에리안(전 PIMCO CEO)은 사모신용이 "탄광 속 카나리아" 순간에 직면할 수 있다고 경고했습니다. 공개 거래 채권과 달리 사모대출은 거래소에서 거래되지 않아 실제 가치가 대출을 만들고 판매한 바로 그 회사에 의해 결정됩니다. 이 섹터는 AI로 인한 파괴에 직면한 소프트웨어 기업에 상당한 노출이 있으며, 부유한 개인 투자자들(의사, 치과의사, 자영업자)이 전통적 채권 대안으로 이 상품에 점점 더 많이 투자해왔습니다.`,
      sourceUrl: "https://starkmanapproved.com/private-credits-smartest-guys-in-the-room/",
      sourceName: "Starkman Approved / Bloomberg",
      publishedAt: ts("2026-03-08T10:00:00Z"),
      category: "analysis",
      mentionedTickers: ["BLK", "APO", "OWL"],
      storyThreadId: threadCredit, orderInThread: 2,
      updatedAt: now,
    });

    const art13 = await ctx.db.insert("newsArticles", {
      title: "Blackstone's private credit fund faces 8% redemption requests",
      titleKo: "블랙스톤 사모신용 펀드, 8% 환매 요청 직면",
      summary: "Blackstone's flagship fund saw $3.8B in redemptions (~7.9% of NAV). Senior leaders contributed $150M personal capital to cover outflows.",
      summaryKo: "블랙스톤 플래그십 펀드에 $38억(순자산의 7.9%) 환매 요청이 들어왔습니다. 25명 이상의 임원이 $1.5억의 개인자금을 투입해 유출에 대응했습니다.",
      body: `Blackstone's flagship private credit fund received approximately $3.8 billion in redemption requests during the quarter, representing roughly 7.9% of net asset value — well above the 5% quarterly repurchase limit.

In an unusual move, more than 25 senior leaders across Blackstone, many from its credit business, contributed approximately $150 million of their personal capital to the Blackstone Private Credit Fund. Combined with $250 million of Blackstone's own corporate capital, the money helped cover the redemption requests.

The fund, which makes loans to mid-market companies, has been a key vehicle in Blackstone's push to democratize private credit — making it available to high-net-worth individuals beyond traditional institutional investors like pension funds and endowments.

JPMorgan Chase CEO Jamie Dimon separately expressed concern about the sector: "All of our main competitors are back. I don't know how long it's going to be great for everybody. I see a couple of people doing some dumb things."

JPMorgan itself committed an additional $50 billion to private credit last year, and reports roughly $133 billion of exposure in a category labeled "other" that includes lending to non-bank financial institutions.`,
      bodyKo: `블랙스톤 플래그십 사모신용 펀드에 분기 약 $38억(순자산가치의 약 7.9%)의 환매 요청이 접수되어 5% 분기 상환 한도를 크게 초과했습니다. 이례적으로 블랙스톤 신용사업부 중심의 25명 이상 임원이 약 $1.5억의 개인자금을 투입했고, 회사 자본 $2.5억이 추가되어 환매 요청에 대응했습니다.

이 펀드는 중견기업에 대출을 실행하며, 블랙스톤의 사모신용 '대중화' — 연기금·재단 등 기관투자자를 넘어 고액자산가에게 접근성을 확대하는 — 전략의 핵심 수단이었습니다. 제이미 다이먼 JPMorgan CEO도 별도로 우려를 표명했습니다: "모든 주요 경쟁사가 돌아왔다. 몇몇이 어리석은 일을 하고 있다." JPMorgan 자체도 지난해 사모신용에 $500억을 추가 투입했으며, 비은행 금융기관 대출을 포함하는 '기타' 항목에 약 $1,330억의 익스포저를 보고하고 있습니다.`,
      sourceUrl: "https://www.bloomberg.com/news/articles/2026-03-03/",
      sourceName: "Bloomberg",
      publishedAt: ts("2026-03-03T16:00:00Z"),
      category: "breaking",
      mentionedTickers: ["BLK", "APO"],
      storyThreadId: threadCredit, orderInThread: 3,
      updatedAt: now,
    });

    const art14 = await ctx.db.insert("newsArticles", {
      title: "JPMorgan flags concerns in private credit portfolios",
      titleKo: "JPMorgan, 사모신용 포트폴리오 우려 표명",
      summary: "JPMorgan flagged loan downgrades in private credit. The bank has $133B in opaque exposure. Dimon: 'I see a couple of people doing some dumb things.'",
      summaryKo: "JPMorgan이 사모신용 대출 등급 하향을 경고했습니다. 은행의 불투명한 $1,330억 익스포저가 드러나며, 다이먼 CEO는 '몇몇이 어리석은 일을 하고 있다'고 발언했습니다.",
      body: `JPMorgan Chase has flagged new concerns in its private credit portfolio analysis, identifying an increasing number of loan downgrades among borrowers in the sector.

The bank's warning carries particular weight given its own significant exposure. JPMorgan committed an additional $50 billion of its balance sheet to private credit last year, along with $15 billion from co-lending partners. When regulators asked major banks to disclose their exposure to non-bank financial institutions, JPMorgan reported roughly $133 billion in a broadly labeled "other" category — declining to provide the detailed breakdown that most other major banks offered.

The bank has also directed some wealthy private-banking clients to allocate as much as 30% of their portfolios to alternative investments, with private credit often replacing traditional fixed-income holdings.

The concern extends beyond individual funds. If private credit defaults rise sharply — some analysts warn mid-teens default rates in a severe downturn — the interconnections between banks, private equity firms, and end investors could amplify the stress. Banks provide credit lines to the very firms making these loans, creating a feedback loop similar to the pre-2008 relationship between banks and mortgage originators.`,
      bodyKo: `JPMorgan Chase가 사모신용 포트폴리오 분석에서 새로운 우려를 제기하며, 해당 섹터 차주들의 대출 등급 하향이 증가하고 있다고 밝혔습니다. JPMorgan은 지난해 자체 대차대조표에서 $500억, 공동대출 파트너로부터 $150억을 사모신용에 추가 투입했습니다. 규제당국이 비은행 금융기관 익스포저 공개를 요구했을 때, JPMorgan은 $1,330억을 '기타'라는 광범위한 항목으로만 보고하며 다른 대형은행들이 제공한 세부 내역을 거부했습니다.

우려는 개별 펀드를 넘어섭니다. 사모신용 부도율이 급등하면 — 일부 애널리스트는 심각한 경기침체 시 10%대 중반 부도율을 경고 — 은행, 사모펀드, 최종 투자자 간 상호연결이 스트레스를 증폭시킬 수 있습니다. 은행들이 바로 이 대출을 실행하는 기업에 신용한도를 제공하고 있어, 2008년 이전 은행과 모기지 원매자 관계와 유사한 피드백 루프가 형성되어 있습니다.`,
      sourceUrl: "https://www.reuters.com/business/finance/",
      sourceName: "Reuters",
      publishedAt: ts("2026-03-10T09:00:00Z"),
      category: "analysis",
      mentionedTickers: ["BLK"],
      storyThreadId: threadCredit, orderInThread: 4,
      updatedAt: now,
    });

    const art15 = await ctx.db.insert("newsArticles", {
      title: "Morgan Stanley gates North Haven Private Income Fund: 10.9% requested, 5% allowed",
      titleKo: "모건스탠리, North Haven PIF 환매 제한: 10.9% 요청, 5%만 허용",
      summary: "Morgan Stanley's $4.2B North Haven PIF caps redemptions at 5%. Fifth major fund to gate in 2 months. Pattern of institutional contagion accelerates.",
      summaryKo: "모건스탠리의 $42억 규모 펀드가 5번째로 환매 제한을 발동했습니다. 투자자들이 10.9% 환매를 요청했으나 5%만 허용되었습니다. 기관 간 전염 패턴이 가속화되고 있습니다.",
      body: `Morgan Stanley became the fifth major asset manager to impose redemption restrictions on a private credit fund, capping quarterly withdrawals from its $4.2 billion North Haven Private Income Fund at 5% after investors requested 10.9%.

The gating follows a now-familiar pattern: BlackRock (9.3% requested, 5% allowed), Blackstone (7.9% requested, personal capital deployed), Blue Owl (full suspension), and now Morgan Stanley. Combined, over $15 billion in redemption requests across these funds have been partially or fully blocked.

Morgan Stanley's fund, which launched in 2021 targeting high-net-worth individuals with minimum investments of $50,000, holds approximately 340 private credit positions with an average borrower credit rating of B+. The fund's NAV declined 3.2% in February, its third consecutive monthly decline.

"The contagion pattern is now undeniable," said Howard Marks, co-founder of Oaktree Capital Management. "Each gate announcement triggers redemption requests at peer funds as investors rush for the exit before it narrows further. This is textbook institutional panic, and it's far from over."`,
      bodyKo: `모건스탠리가 다섯 번째 대형 자산운용사로서 사모신용 펀드에 환매 제한을 부과했습니다. $42억 규모의 North Haven Private Income Fund에서 투자자들이 10.9% 환매를 요청했으나 5%로 제한했습니다. 블랙록(9.3% 요청, 5% 허용), 블랙스톤(7.9%, 개인자금 투입), 블루아울(전면 중단)에 이은 패턴입니다. 이 펀드들에서 합산 $150억 이상의 환매 요청이 부분적 또는 전면 차단되었습니다.

오크트리캐피털 공동창업자 하워드 막스는 "전염 패턴은 이제 부인할 수 없다. 각 환매 제한 발표가 투자자들이 출구가 더 좁아지기 전에 탈출하려는 심리를 촉발하며 동종 펀드에서의 환매 요청을 유발한다. 이것은 교과서적인 기관 패닉이며 아직 끝나지 않았다"라고 말했습니다.`,
      sourceUrl: "https://www.bloomberg.com/news/articles/2026-03-11/",
      sourceName: "Bloomberg",
      publishedAt: ts("2026-03-11T15:00:00Z"),
      category: "breaking",
      mentionedTickers: ["BLK", "APO", "OWL"],
      storyThreadId: threadCredit, orderInThread: 5,
      updatedAt: now,
    });

    // --- 5 NEW articles (16-20) ---

    const art16 = await ctx.db.insert("newsArticles", {
      title: "KOSPI plunges 4.2%; won hits 16-month low as Hormuz crisis hammers export-dependent markets",
      titleKo: "KOSPI 4.2% 폭락, 원화 16개월 최저 — 호르무즈 위기가 수출 의존 시장 강타",
      summary: "Korean benchmark index drops to 2,312 as foreign investors flee. Samsung, Hyundai Motor, SK Hynix lead declines. Won breaches 1,380/$.",
      summaryKo: "외국인 투자자 이탈로 KOSPI가 2,312까지 하락했습니다. 삼성전자, 현대자동차, SK하이닉스가 하락을 주도했습니다. 원/달러 환율이 1,380원을 돌파했습니다.",
      body: `South Korea's benchmark KOSPI index plunged 4.2% on Thursday to close at 2,312 — its largest single-day decline since the March 2020 pandemic sell-off — as the Hormuz crisis hammered Asia's most export-dependent economies.

Foreign investors sold a net ₩2.8 trillion ($2.1 billion) of Korean equities, the largest single-day outflow in 18 months. Samsung Electronics fell 5.1%, Hyundai Motor dropped 6.3%, and SK Hynix declined 4.8% as investors priced in higher energy costs cutting into profit margins.

The Korean won weakened past 1,380 per dollar for the first time since November 2024, driven by a "double whammy" of surging oil import costs (priced in dollars) and capital flight to safe-haven assets. The Bank of Korea intervened in currency markets but declined to specify the size of its intervention.

Analysts at Korea Investment & Securities warned that if oil prices remain above $85 for more than 30 days, Korean GDP growth could be cut by 0.4 percentage points, with export-oriented manufacturers facing the steepest margin compression since the 2022 energy crisis.`,
      bodyKo: `한국 벤치마크 KOSPI 지수가 목요일 4.2% 급락해 2,312로 마감했습니다. 2020년 3월 팬데믹 이후 최대 단일일 하락폭으로, 호르무즈 위기가 아시아 최대 수출 의존 경제를 강타하고 있습니다.

외국인 투자자가 하루 순매도 ₩2.8조($21억)를 기록하며 18개월 내 최대 유출을 보였습니다. 삼성전자 -5.1%, 현대자동차 -6.3%, SK하이닉스 -4.8%로, 에너지 비용 상승이 기업 수익성을 잠식할 것이라는 전망이 반영되었습니다. 원/달러 환율은 2024년 11월 이후 처음으로 1,380원을 돌파했습니다. 한국은행이 외환시장에 개입했으나 규모는 공개하지 않았습니다.

한국투자증권 애널리스트들은 유가가 $85 이상에서 30일 이상 유지될 경우 한국 GDP 성장률이 0.4%p 하락할 수 있으며, 수출 중심 제조업체들이 2022년 에너지 위기 이후 가장 큰 마진 압박에 직면할 것이라고 경고했습니다.`,
      sourceUrl: "https://www.mk.co.kr/news/stock/",
      sourceName: "Maeil Business / Bloomberg",
      publishedAt: ts("2026-03-08T09:00:00Z"),
      category: "breaking",
      mentionedTickers: ["005930", "005380", "096770"],
      storyThreadId: threadHormuz, orderInThread: 11,
      updatedAt: now,
    });

    const art17 = await ctx.db.insert("newsArticles", {
      title: "OPEC+ emergency session: Saudi pledges +1M bpd, but analysts say it's not enough",
      titleKo: "OPEC+ 긴급회의: 사우디 일일 100만 배럴 증산 약속, 그러나 '부족' 평가",
      summary: "Saudi Arabia offers to boost output via Red Sea routes. OPEC+ spare capacity at historic lows. Market needs 5M+ bpd replacement, not 1M.",
      summaryKo: "사우디가 홍해 경로를 통한 증산을 제안했으나, OPEC+ 여유 생산능력이 역대 최저 수준입니다. 시장에 필요한 일일 500만+ 배럴 대체에 100만 배럴은 턱없이 부족합니다.",
      body: `OPEC+ held an emergency virtual session Thursday as the Hormuz crisis removed approximately 8 million barrels per day from global oil supply. Saudi Arabia, whose Red Sea export terminal at Yanbu remains operational, pledged to increase production by 1 million bpd within 30 days.

However, energy analysts were skeptical. "The math doesn't work," said Amrita Sen, head of research at Energy Aspects. "The market has lost 5-8 million bpd of supply. Saudi's spare capacity is roughly 1.5 million bpd, and the rest of OPEC+ combined can add maybe another 1 million. That still leaves a 3-5 million barrel gap."

The International Energy Agency (IEA) estimated OPEC+ total spare capacity at approximately 3.2 million bpd — a historically low buffer for a disruption of this magnitude. UAE, which has the second-largest spare capacity at roughly 1 million bpd, faces its own logistical challenges with damaged port infrastructure from Iran's drone strikes.

Oil prices whipsawed during the session, briefly touching $89 before settling at $86.50. Goldman Sachs maintained its warning that $100 remained possible if the strait stays closed beyond two weeks.`,
      bodyKo: `OPEC+가 목요일 긴급 화상회의를 개최했습니다. 호르무즈 위기로 전 세계 석유 공급에서 일일 약 800만 배럴이 사라진 상황입니다. 홍해 측 얀부 수출 터미널이 가동 중인 사우디아라비아가 30일 내 일일 100만 배럴 증산을 약속했습니다.

그러나 애널리스트들은 회의적입니다. Energy Aspects의 암리타 센 리서치 대표는 "계산이 맞지 않는다. 시장에서 일일 500~800만 배럴이 사라졌다. 사우디 여유 생산능력(Spare Capacity)은 약 150만 배럴이고 나머지 OPEC+ 합산 약 100만 배럴을 추가할 수 있다. 여전히 300~500만 배럴 갭이 남는다"고 말했습니다. IEA는 OPEC+ 총 여유 생산능력을 약 320만 배럴/일로 추정하며, 이 규모의 교란에 대한 역사적으로 낮은 완충장치라고 평가했습니다.`,
      sourceUrl: "https://www.reuters.com/business/energy/",
      sourceName: "Reuters / OPEC",
      publishedAt: ts("2026-03-13T08:00:00Z"),
      category: "analysis",
      mentionedTickers: ["XOM", "CVX", "096770"],
      storyThreadId: threadHormuz, orderInThread: 12,
      updatedAt: now,
    });

    const art18 = await ctx.db.insert("newsArticles", {
      title: "Fed holds rates amid oil shock; Powell warns of 'difficult tradeoffs' between inflation and growth",
      titleKo: "연준, 유가 충격 속 금리 동결; 파월 '인플레이션과 성장 사이 어려운 선택' 경고",
      summary: "Federal Reserve keeps rates at 4.25-4.50%. Powell acknowledges oil-driven inflation risk but fears rate hikes could tip economy into recession.",
      summaryKo: "연준이 기준금리를 4.25~4.50%로 유지했습니다. 파월 의장은 유가발 인플레이션 위험을 인정하면서도, 금리 인상이 경기침체를 촉발할 수 있다고 우려했습니다.",
      body: `The Federal Reserve held its benchmark interest rate steady at 4.25-4.50% on Wednesday, as Chair Jerome Powell acknowledged the central bank faces "difficult tradeoffs" between fighting oil-driven inflation and supporting economic growth.

"Supply-side energy shocks present a particular challenge for monetary policy," Powell said in his post-meeting press conference. "Raising rates to combat energy inflation risks slowing an economy that may already be decelerating. But failing to act risks allowing inflation expectations to become unanchored."

The Fed's updated economic projections showed a sharp divergence: inflation expectations for 2026 were revised upward from 2.4% to 3.1%, while GDP growth was revised downward from 2.1% to 1.4%. The combination — rising prices with slowing growth — is the textbook definition of stagflation.

Bond markets reacted with a flattening yield curve, as 2-year Treasury yields rose 12 basis points while 10-year yields fell 8 basis points — a classic recession signal. The S&P 500 fell 1.8% during Powell's remarks before recovering slightly into the close.`,
      bodyKo: `연방준비제도(연준)가 수요일 기준금리를 4.25~4.50%로 유지했습니다. 제롬 파월 의장은 중앙은행이 유가발 인플레이션 대응과 경제성장 지원 사이에서 "어려운 선택"에 직면해 있다고 인정했습니다.

파월은 기자회견에서 "공급 측면의 에너지 충격은 통화정책에 특별한 도전을 제시한다. 에너지 인플레이션에 대응해 금리를 올리면 이미 둔화될 수 있는 경제를 더 늦출 위험이 있고, 대응하지 않으면 인플레이션 기대심리가 고착될 위험이 있다"고 말했습니다. 연준의 수정 경제전망은 2026년 인플레이션 예상을 2.4%에서 3.1%로, GDP 성장률을 2.1%에서 1.4%로 각각 조정했습니다. 물가 상승과 성장 둔화의 동시 발생은 스태그플레이션의 교과서적 정의입니다.`,
      sourceUrl: "https://www.reuters.com/markets/us/",
      sourceName: "Reuters / Federal Reserve",
      publishedAt: ts("2026-03-12T20:00:00Z"),
      category: "analysis",
      mentionedTickers: ["BLK"],
      updatedAt: now,
    });

    const art19 = await ctx.db.insert("newsArticles", {
      title: "Grocery and delivery costs surge as Hormuz disruption hits consumer supply chains",
      titleKo: "식료품·배달비 급등 — 호르무즈 교란이 소비자 공급망 타격",
      summary: "Wholesale food prices up 8% in a week. Delivery platforms add fuel surcharges. Fertilizer costs spike threatens next harvest season.",
      summaryKo: "도매 식료품 가격이 1주일 만에 8% 상승했습니다. 배달 플랫폼이 유류 할증료를 추가하고, 비료 비용 급등이 다음 수확철을 위협합니다.",
      body: `The Hormuz crisis is hitting consumers where it hurts most: their grocery bills, delivery fees, and daily transportation costs. Wholesale food prices in major Asian markets rose an average of 8% in the past week, driven by surging shipping costs and fuel prices.

In South Korea, the Korea Rural Economic Institute (KREI) warned that imported food prices could rise 12-15% within 60 days if shipping routes remain disrupted. Fresh produce from Southeast Asia, dairy imports from New Zealand, and grain shipments from Australia all transit routes affected by the broader maritime security concerns.

Delivery platforms including Coupang and Baemin have added temporary fuel surcharges of ₩500-1,000 per order, while logistics companies are renegotiating contracts with retailers. Korean Air and Asiana Airlines announced fuel surcharges on international routes effective immediately.

Perhaps most concerning for the medium term: fertilizer prices have spiked 22% as natural gas — a key fertilizer input — faces its own supply disruption. Agricultural economists warn this could affect planting decisions for the summer growing season, potentially creating food price pressures that outlast the immediate crisis.`,
      bodyKo: `호르무즈 위기가 소비자 체감이 가장 큰 영역 — 식료품, 배달비, 일상 교통비 — 을 직격하고 있습니다. 주요 아시아 시장의 도매 식료품 가격이 해운비·유류비 급등의 영향으로 1주일 만에 평균 8% 상승했습니다.

한국농촌경제연구원(KREI)은 해운 경로 교란이 지속될 경우 수입 식품 가격이 60일 내 12~15% 오를 수 있다고 경고했습니다. 동남아산 신선식품, 뉴질랜드 유제품, 호주산 곡물 선적이 모두 영향을 받고 있습니다. 쿠팡, 배달의민족 등 배달 플랫폼은 건당 ₩500~1,000의 유류 할증료를 부과하기 시작했습니다.

중기적으로 가장 우려되는 점: 천연가스(비료의 핵심 원료) 공급 교란으로 비료 가격이 22% 급등했습니다. 농업경제학자들은 이것이 여름 작물 파종 결정에 영향을 미쳐 위기 자체보다 더 오래 지속되는 식품 가격 압력을 초래할 수 있다고 경고합니다.`,
      sourceUrl: "https://www.mk.co.kr/news/economy/",
      sourceName: "Maeil Business / KREI",
      publishedAt: ts("2026-03-10T06:00:00Z"),
      category: "analysis",
      mentionedTickers: ["036460"],
      updatedAt: now,
    });

    const art20 = await ctx.db.insert("newsArticles", {
      title: "AI disruption meets private credit: software borrowers face revenue collapse and loan defaults",
      titleKo: "AI 파괴가 사모신용과 만나다: 소프트웨어 차주 매출 붕괴와 대출 부도",
      summary: "Private credit has $400B+ exposure to software companies. AI is replacing SaaS revenue faster than expected. Blue Owl warns of 'structural revenue risk.'",
      summaryKo: "사모신용의 소프트웨어 섹터 익스포저가 $4,000억 이상입니다. AI가 SaaS 매출을 예상보다 빠르게 대체하고 있습니다. 블루아울이 '구조적 매출 리스크'를 경고합니다.",
      body: `The private credit market's largest sector exposure — software and technology companies — is facing an existential threat from artificial intelligence that could accelerate the industry's unfolding liquidity crisis.

Blue Owl Capital, one of the largest private credit lenders, warned in a client letter that "structural revenue risk from AI substitution" is affecting a growing number of its software portfolio companies. The firm disclosed that 12% of its software borrowers have experienced revenue declines of 15% or more in the past two quarters, compared to a historical average of 3%.

The mechanism is straightforward: many mid-market software companies that borrowed heavily from private credit funds sell subscription-based products — CRM tools, data analytics, workflow automation — that AI is rapidly replacing at a fraction of the cost. Bill Eigen, head of fixed income at JPMorgan Asset Management, called it "the worst possible combination: levered companies in a sector facing secular decline."

Private credit's total exposure to software and technology borrowers exceeds $400 billion, according to Pitchbook data. If AI-driven revenue displacement pushes default rates in this segment from the current 2.5% to even 8-10%, losses could exceed $30 billion — enough to trigger a new wave of redemption gates across the industry.`,
      bodyKo: `사모신용 시장의 최대 섹터 익스포저인 소프트웨어·기술 기업이 AI로부터 존재적 위협에 직면하고 있으며, 이는 업계의 유동성 위기를 가속화할 수 있습니다.

최대 사모신용 대출기관 중 하나인 블루아울캐피털은 고객 서한에서 "AI 대체로 인한 구조적 매출 리스크"가 소프트웨어 포트폴리오 기업에 점점 더 영향을 미치고 있다고 경고했습니다. 소프트웨어 차주의 12%가 최근 2분기 동안 매출이 15% 이상 감소했으며, 이는 과거 평균 3%와 비교됩니다.

메커니즘은 명확합니다: 사모신용에서 대규모 차입을 한 중견 소프트웨어 기업들은 CRM, 데이터 분석, 워크플로 자동화 등 구독 기반 제품을 판매하는데, AI가 이를 훨씬 저렴한 비용으로 대체하고 있습니다. JPMorgan 자산운용 채권 부문 대표 빌 아이겐은 이를 "최악의 조합: 구조적 쇠퇴에 직면한 섹터의 레버리지 기업들"이라고 표현했습니다. Pitchbook 데이터에 따르면 사모신용의 소프트웨어·기술 차주 익스포저는 $4,000억을 초과하며, 이 세그먼트의 부도율이 현재 2.5%에서 8~10%로 상승하면 손실이 $300억을 초과할 수 있습니다.`,
      sourceUrl: "https://www.bloomberg.com/news/articles/2026-03-11/",
      sourceName: "Bloomberg / Pitchbook",
      publishedAt: ts("2026-03-11T12:00:00Z"),
      category: "analysis",
      mentionedTickers: ["OWL", "BLK", "APO"],
      storyThreadId: threadCredit, orderInThread: 6,
      updatedAt: now,
    });

    // =====================================================================
    // 5. EXPLAINERS (8) — renamed from articleExplainers, personalImpact added
    // =====================================================================

    // Explainer for art1: US-Israel strikes
    await ctx.db.insert("explainers", {
      newsArticleId: art1,
      simplifiedTitle: "War breaks out: Why the US attacked Iran and what happened next",
      storyBody: `Imagine two countries that have been arguing for decades suddenly getting into a real fight. That's what happened when the US and Israel launched military strikes on Iran on February 28, 2026.

Iran fought back the only way it could — by blocking the Strait of Hormuz, a narrow waterway that's like the world's biggest oil highway. About 50 oil tankers used to pass through every day. After the attacks, that number dropped to zero within days.

Why does Iran have this power? Because geography gave it a trump card. The strait is only 21 miles wide at its narrowest point, and Iran sits on one side. It's like controlling the only bridge on a highway that carries 20% of the world's oil.

This single event set off a chain reaction that would affect gas prices, inflation, and financial markets around the world — because when oil stops flowing, everything gets more expensive.`,
      keyTakeaways: [
        "The US and Israel struck Iran's military targets on Feb 28, 2026",
        "Iran retaliated by blocking the Strait of Hormuz — the world's most important oil shipping route",
        "Tanker traffic dropped from 50/day to zero in just 3 days",
        "20% of global oil supply passes through this one narrow waterway",
      ],
      personalImpact: "If you drive a car, buy groceries, or use anything made of plastic, this crisis will likely raise the price you pay. Oil price spikes ripple through the entire economy within weeks.",
      analogy: "Think of it like a neighborhood where one house controls the only road in and out. If that homeowner puts up a barricade, nobody can get their deliveries — and suddenly everything in the neighborhood costs more.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // Explainer for art2: Supertanker rates
    await ctx.db.insert("explainers", {
      newsArticleId: art2,
      simplifiedTitle: "Why your gas prices just jumped: The Hormuz Strait explained",
      storyBody: `Imagine a highway that carries 20% of all the oil in the world. That's the Strait of Hormuz — a narrow stretch of water between Iran and Oman. When fighting broke out between the US and Iran, ships stopped going through.

Insurance companies said "we won't cover your ship if it gets hit," so shipping companies said "then we're not going." The result? Way less oil moving around the world, and the cost of what's left shot up dramatically.

The daily cost to rent a single oil supertanker jumped 94% in one day to over $423,000. That's like your taxi fare suddenly doubling because all the roads except one got closed.

For everyday people, this matters because oil is in almost everything — not just gasoline, but plastics, shipping costs, even the fertilizer used to grow food. When oil gets expensive, almost everything else follows.`,
      keyTakeaways: [
        "20% of the world's oil goes through one narrow waterway between Iran and Oman",
        "When insurers refuse to cover war damage, ships simply stop sailing — no insurance means no shipping",
        "Less oil moving means higher prices for everyone, from gas to groceries to plastics",
      ],
      personalImpact: "Expect gas prices to rise within days. Delivery costs for online shopping may increase. Airlines may add fuel surcharges to ticket prices.",
      analogy: "Think of Hormuz like a bridge on the only highway connecting oil producers to the rest of the world. If the bridge gets too dangerous to cross, trucks stop, and suddenly everything delivered by truck costs more.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // Explainer for art3: Oil surge 20%
    await ctx.db.insert("explainers", {
      newsArticleId: art3,
      simplifiedTitle: "Oil prices jump 20%: Why it matters for your wallet",
      storyBody: `When the Hormuz Strait closed, oil prices shot up 20% in a single day — the biggest jump since the 2022 energy crisis. But why should you care about oil prices?

Here's the thing: oil isn't just about gas for your car. It's in plastic bottles, shipping costs, airplane fuel, fertilizer for farms, and even the asphalt on roads. When oil gets expensive, almost everything else follows — this is called "cost-push inflation."

Goldman Sachs, one of Wall Street's biggest banks, raised their oil price forecast and warned that oil could hit $100 per barrel. The last time that happened (2022), US inflation hit 9.1% — the highest in 40 years. That forced the Federal Reserve to raise interest rates from 0.25% to 4.5%, which made mortgages, car loans, and credit card bills way more expensive.

The scary word economists are using is "stagflation" — when the economy slows down AND prices keep rising at the same time. It's the worst of both worlds.`,
      keyTakeaways: [
        "Oil prices surged 20% because supply through Hormuz was cut off while demand stayed the same",
        "Oil affects everything — not just gas, but food, shipping, plastics, and manufacturing",
        "Goldman Sachs warned oil could reach $100/barrel, which last happened during the 2022 inflation spike",
        "Stagflation (stagnation + inflation) is the biggest economic risk from this crisis",
      ],
      personalImpact: "If interest rates go up because of oil-driven inflation, your mortgage, car loan, and credit card payments all get more expensive. Grocery prices tend to follow oil with a 4-6 week delay.",
      analogy: "Imagine a water pipe that supplies 20% of a city's water suddenly gets blocked. The remaining water becomes much more expensive, and everything that uses water — restaurants, laundries, car washes — has to raise prices too.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // Explainer for art4: Korea energy crisis
    await ctx.db.insert("explainers", {
      newsArticleId: art4,
      simplifiedTitle: "Why Korea is especially vulnerable: 69% of its oil comes through Hormuz",
      storyBody: `South Korea has a secret vulnerability that most people don't know about: 69.3% of all the crude oil Korea imports comes from the Middle East, and almost all of it travels through the Strait of Hormuz.

Think about it this way: if you get most of your food from one store and that store suddenly closes, you're in big trouble. That's Korea's situation with Middle East oil.

Korea is one of the world's most energy-intensive economies — it's the 5th largest oil importer globally. The country's massive shipbuilding, electronics, and automotive industries all depend on affordable energy. When oil prices spike, Korean manufacturers face a double hit: higher production costs AND a weaker Korean won (because oil is priced in US dollars).

The shipping disruption also hit container freight. The Shanghai Container Freight Index jumped to 1,489 — that means it costs more to ship everything from raw materials to finished goods. For a country that imports most of its energy and exports manufactured products, this is an economic squeeze from both sides.`,
      keyTakeaways: [
        "Korea imports 69.3% of its crude oil from the Middle East — mostly through Hormuz",
        "Korea is the world's 5th largest oil importer, making it extremely vulnerable to supply disruptions",
        "Container shipping costs also surged, squeezing both imports and exports",
        "KOGAS (Korea Gas Corp) faces LNG supply concerns — 19% of global LNG flows through Hormuz too",
      ],
      personalImpact: "Korean consumers will see higher gas and utility bills. Manufacturing costs rise, which means electronics, cars, and other Korean exports may become more expensive globally.",
      analogy: "It's like a restaurant that sources 70% of its ingredients from one farm. When that farm floods, the restaurant can't just switch suppliers overnight — it takes months to find new sources, and in the meantime, every dish costs more to make.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // Explainer for art11: BlackRock caps withdrawals
    await ctx.db.insert("explainers", {
      newsArticleId: art11,
      simplifiedTitle: "Your money is locked: What BlackRock's withdrawal limit means",
      storyBody: `Imagine putting money in a savings account, but when you try to withdraw it, the bank says "sorry, you can only take out 5% this quarter." That's essentially what happened at BlackRock's private credit fund.

Investors wanted to pull out 9.3% of the fund — about $1.2 billion. But BlackRock only let them take out $620 million (5%). Why? Because the fund lent that money to companies in long-term loans that can't be easily sold.

This is called a "liquidity mismatch." Your money went in easily, but the fund invested it in things that take years to get money back from. When too many people want out at once, there simply isn't enough cash.

BlackRock is the world's largest money manager. If they're having trouble, it raises a bigger question: is the entire $2 trillion private credit market — where investment firms lend directly to companies instead of banks — heading for trouble?`,
      keyTakeaways: [
        "Private credit funds can lock your money when things go wrong — you can't always withdraw when you want",
        "BlackRock is the world's largest asset manager — their struggles signal broader market problems",
        "The $2 trillion private credit market grew fast when interest rates were low, and now faces its first real test as rates stay high",
      ],
      personalImpact: "If you or your pension fund has exposure to private credit or 'alternative investments,' your money may be less liquid than you thought. Check what your retirement accounts are invested in.",
      analogy: "It's like a restaurant that seats 100 people but only has one exit door. On a normal night, everyone leaves comfortably. But if there's a fire alarm and everyone rushes for the door at once, only a few can get through.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // Explainer for art12: Private credit $2T bubble
    await ctx.db.insert("explainers", {
      newsArticleId: art12,
      simplifiedTitle: "The $2 trillion bubble: How 'safe' investments became risky",
      storyBody: `After the 2008 financial crisis, new rules made it harder for banks to make risky loans. So Wall Street found a workaround: private equity firms started lending directly to companies. This became known as "private credit" — and it grew explosively to nearly $3 trillion.

Here's the problem: these loans were marketed to wealthy individuals — doctors, dentists, small business owners — as "safe alternatives to bonds." But unlike bonds you can sell on the stock market any day, private credit loans are locked up for years. You can't easily sell them.

Now imagine this: BlackRock (the world's largest money manager) marked a private loan from 100 cents on the dollar to ZERO in just three months. That's like a house you bought for $500,000 suddenly being worth nothing. If BlackRock's experts couldn't see this coming, what about ordinary investors?

Mohamed El-Erian, one of the most respected economists alive, called it a "canary in the coal mine" — the early warning that something bigger might be wrong. With $3 trillion at stake, even a small percentage of bad loans could create a crisis.`,
      keyTakeaways: [
        "Private credit grew to $3 trillion after banks were restricted from risky lending post-2008",
        "These loans were sold to wealthy individuals as 'safe,' but they can't be easily sold like public bonds",
        "BlackRock wrote a loan down from 100 to zero in 3 months — showing values can be unreliable",
        "The same firms that make the loans also determine their value — a conflict of interest",
        "If defaults spike, the interconnections between banks and private lenders could create a cascade",
      ],
      personalImpact: "If your financial advisor has put you in 'alternative' or 'private credit' investments, ask about the exit terms. These products may promise high yields but lock your money when you need it most.",
      analogy: "Imagine a lemonade stand that borrows money from kids in the neighborhood, promising to pay them back with interest. But the lemonade stand is the one grading its own homework — deciding how much money it actually has. One day it admits the homework was wrong, and suddenly everyone wants their money back at once.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // Explainer for art13: Blackstone redemptions
    await ctx.db.insert("explainers", {
      newsArticleId: art13,
      simplifiedTitle: "When bosses bet their own money: Blackstone's desperate move",
      storyBody: `Here's something unusual in finance: more than 25 senior leaders at Blackstone — one of Wall Street's most powerful firms — put $150 million of their own personal money into their fund to cover investor withdrawals.

Why is this a big deal? Normally, fund managers don't put their personal wealth at risk. When they do, it sends two messages: first, they believe the fund is worth investing in. But second — and this is what worries people — it suggests the fund needed the cash badly enough that the bosses had to reach into their own pockets.

Blackstone's private credit fund got hit with $3.8 billion in withdrawal requests (7.9% of the fund's total value). The fund's limit is 5% per quarter, so many investors couldn't get their money out.

This fund was Blackstone's flagship for "democratizing" private credit — making it available to regular wealthy people instead of just big institutions. JPMorgan CEO Jamie Dimon added fuel to the fire by warning: "I see a couple of people doing some dumb things." Coming from the head of America's largest bank, that's a serious alarm bell.`,
      keyTakeaways: [
        "25+ Blackstone executives invested $150M of personal money to cover fund outflows",
        "The fund received $3.8B in withdrawal requests but could only honor 5% per quarter",
        "This was Blackstone's showcase fund for selling private credit to wealthy individuals",
        "JPMorgan's CEO publicly warned about risky behavior in private credit — a rare criticism between major firms",
      ],
      personalImpact: "If you've been pitched 'private credit' or 'alternative lending' products by a financial advisor, this is a warning sign. When industry insiders are worried, retail investors should be cautious.",
      analogy: "Imagine a bank where so many people wanted to withdraw their savings at once that the bank manager had to use their own money to keep the ATMs working. It might show confidence, but it also shows the situation is more serious than anyone let on.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // Explainer for art14: JPMorgan flags
    await ctx.db.insert("explainers", {
      newsArticleId: art14,
      simplifiedTitle: "JPMorgan's $133 billion secret: The banks are exposed too",
      storyBody: `Remember how after 2008, we were told that new regulations made banks safer? Here's the twist: JPMorgan Chase — America's largest bank — has $133 billion in exposure to the same private credit market that's showing cracks.

And here's the really worrying part: when regulators asked banks to disclose exactly how much they'd lent to non-bank financial firms, most banks provided detailed breakdowns. JPMorgan just labeled its $133 billion as "other" and refused to give more detail. That kind of opacity is exactly what made the 2008 crisis so dangerous — nobody knew where the risk actually was.

Even more concerning: JPMorgan has been telling its wealthy clients to put up to 30% of their portfolios into "alternative investments" like private credit. So the bank is exposed both as a lender TO private credit firms AND through its clients who invested IN them.

The pattern looks uncomfortably familiar: banks provide credit lines to firms that make risky loans, creating a feedback loop. If those loans go bad, it doesn't just hurt the private credit firms — it bounces back to the banks. Jamie Dimon's warning about "dumb things" might include some of his own bank's decisions.`,
      keyTakeaways: [
        "JPMorgan has $133B in opaque exposure to non-bank lenders — labeled simply as 'other'",
        "JPMorgan committed $50B to private credit last year AND directed clients to invest 30% in alternatives",
        "Banks providing credit lines to private lenders creates a feedback loop similar to pre-2008",
        "If private credit defaults spike, the losses don't stay in private credit — they bounce back to banks",
      ],
      personalImpact: "Even if you don't own private credit directly, your bank or pension fund might. The interconnections mean a private credit crisis could affect the broader financial system — and your savings.",
      analogy: "Think of it like lending money to someone who's lending money to someone else. If the final borrower can't pay, the loss travels back through the chain — and you're left holding the bag. Now multiply that by $133 billion.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // =====================================================================
    // 6. IMPACT CHAINS (2) + IMPACT NODES (~10) — PM Feature 3
    // =====================================================================

    // Chain 1: Hormuz → Energy → Inflation cascade
    const chainHormuz = await ctx.db.insert("impactChains", {
      storyThreadId: threadHormuz,
      title: "Hormuz Crisis Impact Cascade",
      titleKo: "호르무즈 위기 영향 체인",
      description: "How the Strait of Hormuz closure cascades from geopolitics through energy markets to consumer prices and central bank policy.",
      descriptionKo: "호르무즈 해협 봉쇄가 지정학에서 에너지 시장을 거쳐 소비자 물가와 중앙은행 정책으로 이어지는 연쇄 영향.",
      updatedAt: now,
    });

    // Root: Strait closure
    const nodeRoot = await ctx.db.insert("impactNodes", {
      chainId: chainHormuz,
      label: "Strait of Hormuz Blocked",
      labelKo: "호르무즈 해협 봉쇄",
      description: "Iran blocks the strait; tanker traffic drops to zero.",
      descriptionKo: "이란이 해협을 봉쇄; 유조선 통행이 0으로 감소.",
      ordinal: 1,
      updatedAt: now,
    });

    // Level 1 children: Oil + Insurance
    const nodeOil = await ctx.db.insert("impactNodes", {
      chainId: chainHormuz,
      parentNodeId: nodeRoot,
      label: "Oil Supply Cut 20%",
      labelKo: "석유 공급 20% 차단",
      description: "20% of global crude supply passes through Hormuz.",
      descriptionKo: "전 세계 원유 공급의 20%가 호르무즈를 통과.",
      ordinal: 1,
      updatedAt: now,
    });

    await ctx.db.insert("impactNodes", {
      chainId: chainHormuz,
      parentNodeId: nodeRoot,
      label: "War Risk Insurance Cancelled",
      labelKo: "전쟁위험보험 취소",
      description: "5 major insurers cancel coverage; commercial shipping halts.",
      descriptionKo: "5개 주요 보험사가 보장을 취소; 상업 운항 중단.",
      ordinal: 2,
      updatedAt: now,
    });

    // Level 2: Oil price + VLCC
    await ctx.db.insert("impactNodes", {
      chainId: chainHormuz,
      parentNodeId: nodeOil,
      label: "Brent Crude +20% → $86/bbl",
      labelKo: "브렌트유 +20% → $86/배럴",
      description: "Goldman warns $100 if Hormuz flows don't resume.",
      descriptionKo: "골드만삭스, 호르무즈 통행 재개 안 되면 $100 경고.",
      ordinal: 1,
      updatedAt: now,
    });

    await ctx.db.insert("impactNodes", {
      chainId: chainHormuz,
      parentNodeId: nodeOil,
      label: "VLCC Rates +94%",
      labelKo: "VLCC 운임 +94%",
      description: "Supertanker rates hit all-time high of $423,736/day.",
      descriptionKo: "초대형유조선 운임 사상 최고치 일일 $423,736.",
      ordinal: 2,
      updatedAt: now,
    });

    // Chain 2: Private Credit Contagion
    const chainCredit = await ctx.db.insert("impactChains", {
      storyThreadId: threadCredit,
      title: "Private Credit Contagion Chain",
      titleKo: "사모신용 전염 체인",
      description: "How redemption pressure at one fund cascades across the $2T private credit market.",
      descriptionKo: "한 펀드의 환매 압력이 2조 달러 사모신용 시장 전체로 확산되는 연쇄 반응.",
      updatedAt: now,
    });

    // Root: Initial fund stress
    const nodeCreditRoot = await ctx.db.insert("impactNodes", {
      chainId: chainCredit,
      label: "Fund Redemption Pressure",
      labelKo: "펀드 환매 압력",
      description: "Investors request more withdrawals than funds can honor.",
      descriptionKo: "투자자들이 펀드가 충당할 수 있는 것보다 더 많은 환매를 요청.",
      ordinal: 1,
      updatedAt: now,
    });

    // Level 1: Gates + Personal capital
    await ctx.db.insert("impactNodes", {
      chainId: chainCredit,
      parentNodeId: nodeCreditRoot,
      label: "Redemption Gates Activated (5% cap)",
      labelKo: "환매 제한 발동 (5% 상한)",
      description: "BlackRock, Blackstone, Blue Owl, Morgan Stanley all gate.",
      descriptionKo: "블랙록, 블랙스톤, 블루아울, 모건스탠리 모두 제한 발동.",
      ordinal: 1,
      updatedAt: now,
    });

    await ctx.db.insert("impactNodes", {
      chainId: chainCredit,
      parentNodeId: nodeCreditRoot,
      label: "Contagion: Gate → Peer Fund Panic",
      labelKo: "전염: 제한 → 동종 펀드 패닉",
      description: "Each gate triggers preemptive redemptions at other funds.",
      descriptionKo: "각 제한 발동이 다른 펀드에서의 선제적 환매를 유발.",
      ordinal: 2,
      updatedAt: now,
    });

    await ctx.db.insert("impactNodes", {
      chainId: chainCredit,
      parentNodeId: nodeCreditRoot,
      label: "Bank Exposure Revealed ($133B JPM)",
      labelKo: "은행 노출 드러남 (JPM $1,330억)",
      description: "Banks lend to the very firms now facing outflows — feedback loop.",
      descriptionKo: "은행들이 바로 그 유출에 직면한 기업들에 대출 — 피드백 루프.",
      ordinal: 3,
      updatedAt: now,
    });

    return {
      stocks: 12,
      users: 3,
      storyThreads: 2,
      newsArticles: 20,
      explainers: 8,
      impactChains: 2,
      impactNodes: 10,
    };
  },
});
