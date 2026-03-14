/**
 * SaveTicker — Seed Data Script (4-entity ontology)
 *
 * Populates the database with prototype data for PM demo.
 * 8 articles (4 Hormuz, 4 Credit), 8 Korean explainers.
 *
 * Run via Convex dashboard or: bunx convex run seed:seedAll
 */
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ts = (dateStr: string) => new Date(dateStr).getTime();
const now = Date.now();

// ---------------------------------------------------------------------------
// Seed: Main Entry Point
// ---------------------------------------------------------------------------

export const seedAll = internalMutation({
  args: { force: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    // Idempotency guard — prevent duplicate seeding
    const existing = await ctx.db.query("stocks").first();
    if (!args.force && existing) {
      console.log("Database already seeded. Pass { force: true } to re-seed.");
      return { skipped: true, reason: "already_seeded" };
    }

    // Clear all tables before re-seeding to prevent duplicates
    if (args.force) {
      for (const table of ["impactNodes", "impactChains", "explainers", "newsArticles", "storyThreads", "users", "stocks"] as const) {
        const rows = await ctx.db.query(table).collect();
        for (const row of rows) {
          await ctx.db.delete(row._id);
        }
      }
    }

    // =====================================================================
    // 1. STOCKS (12) — lean: ticker, name, sector only
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
    // 3. STORY THREADS (2) — PM Feature 1
    // =====================================================================

    const threadHormuz = await ctx.db.insert("storyThreads", {
      title: "Iran-US Strikes & Hormuz Strait Blockade",
      titleKo: "미-이스라엘 이란 공습과 호르무즈 해협 봉쇄",
      description: "US-Israel strikes on Iran triggered Hormuz closure, oil price surge, and global energy crisis",
      descriptionKo: "미-이스라엘의 이란 공습으로 호르무즈 해협이 봉쇄되고, 유가 급등과 글로벌 에너지 위기가 촉발된 일련의 사건",
      status: "active",
      updatedAt: now,
    });

    const threadCredit = await ctx.db.insert("storyThreads", {
      title: "Private Credit Market Stress",
      titleKo: "사모신용 시장 스트레스",
      description: "Major funds capping redemptions, $2T bubble comparison, systemic risk concerns",
      descriptionKo: "주요 펀드 환매 제한, $2조 버블 비교, 시스템 리스크 우려가 이어지는 사모신용 시장 위기",
      status: "active",
      updatedAt: now,
    });

    // =====================================================================
    // 4. NEWS ARTICLES (8) — with tags, linked to story threads
    // =====================================================================

    // --- Thread A: Hormuz (4 articles) ---

    const art1 = await ctx.db.insert("newsArticles", {
      title: "US-Israel strikes hit Iran; Strait of Hormuz shipping halted",
      titleKo: "미-이스라엘 연합군 이란 타격; 호르무즈 해협 운항 전면 중단",
      summary: "US and Israeli forces launched strikes on Iran. Iran's IRGC declared Strait of Hormuz closed. Tanker traffic dropped from 50/day to zero within days.",
      summaryKo: "미국과 이스라엘이 이란 군사시설을 공습하자 혁명수비대가 호르무즈 해협 봉쇄를 선언했습니다. 유조선 통행이 수일 내 50척에서 0으로 급감하며, 전 세계 원유 공급의 20%가 차단 위기에 놓였습니다.",
      viewCount: 42,
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
      tags: ["에너지", "지정학", "헤드라인"],
      isOfficial: true,
      storyThreadId: threadHormuz,
      orderInThread: 1,
      translationStatus: "approved",
      translationNotes: [
        "IRGC → '혁명수비대': 정식 한국어 명칭 사용 (이란 이슬람 혁명수비대)",
        "Strait of Hormuz → '호르무즈 해협': 외래어 표기법 준수",
        "UKMTO/JMIC → 원문 약어 유지 + 한국어 풀네임 병기",
        "summaryKo는 의역: '전 세계 원유 공급의 20%가 차단 위기' — 독자 관점에서 임팩트를 먼저 전달",
      ],

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

According to Argus Media, roughly one-third of seaborne crude oil trade moves through the Strait of Hormuz, alongside 19% of global LNG flows and 14% of global refined products trade.`,
      bodyKo: `초대형원유운반선(VLCC) — 중동에서 중국으로 200만 배럴의 원유를 운송하는 선박 — 의 기준 운임이 LSEG 데이터 기준 일일 $423,736까지 급등하며 사상 최고치를 기록했습니다. 금요일 종가 대비 94% 이상의 상승입니다. 5개 주요 해상보험사(Gard, Skuld, NorthStandard, American Club, London P&I Club)가 페르시아만 운항 선박에 대한 전쟁위험 보장을 취소했습니다.

Argus Media에 따르면 전 세계 해상 원유 교역량의 약 1/3이 호르무즈 해협을 통과하며, 글로벌 LNG의 19%, 정제유의 14%도 이 경로를 이용합니다. 사우디아라비아는 해협을 통해 일일 약 550만 배럴을 수출합니다. 중동 산유국들은 아직 생산 중단을 발표하지 않았고 UAE·오만·쿠웨이트 항구도 운영 중이나, 보험 없이는 선적이 사실상 불가능한 상태입니다.`,
      sourceUrl: "https://www.cnbc.com/2026/03/03/middle-east-crisis-iran-us-shipping-oil-tankers-strait-of-hormuz.html",
      sourceName: "CNBC",
      publishedAt: ts("2026-03-03T11:30:00Z"),
      category: "breaking",
      mentionedTickers: ["XOM", "010140", "329180"],
      tags: ["에너지", "헤드라인"],
      isOfficial: true,
      storyThreadId: threadHormuz,
      orderInThread: 2,
      translationStatus: "approved",
      translationNotes: [
        "VLCC → 한국어로 '초대형원유운반선' 풀네임 병기 후 이후 VLCC 약어 사용",
        "war risk cover → '전쟁위험 보장': 해상보험 업계 공식 용어 사용",
        "$423,736/day → 달러 표기 유지 (원화 환산 시 환율 변동으로 오해 소지)",
      ],

      updatedAt: now,
    });

    const art3 = await ctx.db.insert("newsArticles", {
      title: "Oil prices surge 20%; Goldman raises Brent forecast, warns of $100",
      titleKo: "유가 20% 급등; 골드만삭스, 브렌트유 전망 상향·$100 경고",
      summary: "Oil prices hit highest since July 2022. Goldman Sachs raised Q2 Brent forecast by $10 to $76/bbl. If Hormuz flows don't resume, Brent could reach $100.",
      summaryKo: "유가가 2022년 7월 이후 최고치로 급등했습니다. 골드만삭스는 2분기 브렌트유 전망을 $10 상향하고, 호르무즈 통행 미재개 시 $100 도달을 경고했습니다. 스태그플레이션 우려가 고조됩니다.",
      viewCount: 87,
      body: `Oil prices surged approximately 20% in early trading on Monday, hitting their highest level since July 2022, as the expanding US-Israeli military campaign against Iran continued to disrupt energy flows through the Strait of Hormuz.

Goldman Sachs raised its second-quarter 2026 Brent crude forecast by $10 to $76 per barrel, citing the disruption. The investment bank warned that if traffic through the Strait of Hormuz does not resume in the near term, Brent could reach $100 per barrel.

Bernstein analysts outlined a worst-case scenario of $150 per barrel if the conflict extends beyond three months. The oil price surge raises concerns about stagflation — a combination of economic stagnation and persistent inflation. Higher energy costs feed directly into consumer prices, transportation costs, and manufacturing inputs.`,
      bodyKo: `유가가 월요일 조기 거래에서 약 20% 급등하며 2022년 7월 이후 최고치를 기록했습니다. 미-이스라엘의 대이란 군사작전 확대가 호르무즈 해협을 통한 에너지 흐름을 계속 교란하고 있습니다.

골드만삭스는 2분기 브렌트유 전망을 배럴당 $10 상향한 $76로 조정하고, 호르무즈 통행이 단기간 내 재개되지 않을 경우 $100에 도달할 수 있다고 경고했습니다. Bernstein 애널리스트는 분쟁이 3개월 이상 지속될 경우 $150까지 치솟는 최악의 시나리오를 제시했습니다.

유가 급등은 스태그플레이션(Stagflation) — 경기침체와 물가상승이 동시에 발생하는 상황 — 우려를 높이고 있습니다. 에너지 비용 상승은 소비자 물가, 운송비, 제조원가에 직접 반영됩니다.`,
      sourceUrl: "https://www.reuters.com/business/energy/",
      sourceName: "Reuters / Goldman Sachs",
      publishedAt: ts("2026-03-09T07:00:00Z"),
      category: "analysis",
      mentionedTickers: ["XOM", "CVX", "036460", "096770"],
      tags: ["에너지", "경제지표"],
      isOfficial: true,
      storyThreadId: threadHormuz,
      orderInThread: 3,
      translationStatus: "approved",
      translationNotes: [
        "Stagflation → '스태그플레이션' + 괄호 설명 추가: '(경기침체와 물가상승이 동시에 발생하는 상황)'",
        "Brent crude → '브렌트유': 국제유가 기준 명칭, 한국 언론 관행 따름",
        "Goldman Sachs → '골드만삭스': 외래어 표기법, 외신 인용 시 원문 기관명 유지",
      ],

      updatedAt: now,
    });

    const art4 = await ctx.db.insert("newsArticles", {
      title: "Korea faces energy crisis as Middle East crude dependency hits 69%",
      titleKo: "한국, 에너지 위기 직면 — 중동 원유 의존도 69%",
      summary: "Korea imports 69.3% of crude from Middle East, mostly through Hormuz. Stagflation concerns mount as high oil feeds into inflation.",
      summaryKo: "한국의 원유 수입 중 69.3%가 중동산이며 대부분 호르무즈를 경유합니다. 유가 상승이 제조원가와 물가에 직접 반영되면서 스태그플레이션 우려가 커지고 있습니다.",
      body: `South Korea faces heightened exposure to the Strait of Hormuz crisis, with 69.3% of the country's crude oil imports sourced from the Middle East — the vast majority transiting through the now-disrupted waterway.

According to PwC Samil, the disruption to crude oil and LNG shipments through the Strait of Hormuz is "likely to translate directly into surging energy prices," which would "raise manufacturing costs and amplify inflationary pressure, eroding corporate profitability."

Iraq, a key supplier to Korea, has already cut daily production by approximately 1.5 million barrels as storage capacity reached its limits with export routes blocked. Korea Gas Corporation (KOGAS), the country's sole LNG importer, faces particular pressure as 19% of global LNG flows pass through the Strait of Hormuz.`,
      bodyKo: `한국은 대부분의 국민이 모르는 에너지 취약성을 안고 있습니다. 원유 수입의 69.3%가 중동에서 조달되며, 그 대부분이 현재 교란된 호르무즈 해협을 통과합니다. PwC 삼일은 호르무즈를 통한 원유·LNG 선적 차질이 "에너지 가격 급등으로 직결되어 제조원가를 높이고 인플레이션 압력을 가중시키며 기업 수익성을 잠식할 가능성이 높다"고 분석했습니다.

이라크는 주요 대한 원유 공급국으로, 수출 경로 차단에 따른 저장 용량 한계로 일일 생산량 약 150만 배럴을 이미 감축했습니다. 한국가스공사(KOGAS)는 글로벌 LNG 물동량의 19%가 호르무즈를 통과하는 만큼 특히 큰 압력에 직면해 있습니다.`,
      sourceUrl: "https://www.mk.co.kr/news/world/11981136",
      sourceName: "Maeil Business Newspaper",
      publishedAt: ts("2026-03-06T02:00:00Z"),
      category: "analysis",
      mentionedTickers: ["036460", "096770", "010140"],
      tags: ["에너지", "경제지표"],
      isOfficial: true,
      storyThreadId: threadHormuz,
      orderInThread: 4,
      translationStatus: "approved",
      translationNotes: [
        "PwC Samil → 'PwC 삼일': 한국 법인명 사용 (삼일회계법인)",
        "KOGAS → '한국가스공사(KOGAS)': 한국어 정식명 + 영문 약어 병기",
        "69.3% 의존도 → 원문 수치 정확 인용, 출처(매일경제) 확인 완료",
      ],

      updatedAt: now,
    });

    // --- Thread B: Private Credit (4 articles) ---

    const art11 = await ctx.db.insert("newsArticles", {
      title: "BlackRock caps withdrawals from $26B private credit fund at 5%",
      titleKo: "블랙록, $260억 사모신용 펀드 환매를 5%로 제한",
      summary: "BlackRock's HPS Corporate Lending Fund limited quarterly redemptions to 5% after investors requested 9.3%. Only $620M of $1.2B requests honored.",
      summaryKo: "블랙록의 HPS Corporate Lending Fund가 분기 환매를 5%로 제한했습니다. 투자자들이 9.3% 환매를 요청했으나 $12억 중 $6.2억만 충족되었습니다.",
      body: `BlackRock's HPS Corporate Lending Fund, a $26 billion business development company (BDC) that makes private credit loans, announced it would cap quarterly share repurchases at 5% of outstanding shares — the contractual minimum.

Investors had requested redemptions totaling 9.3% of the fund's shares in the first quarter of 2026, amounting to approximately $1.2 billion. The fund honored roughly $620 million, leaving the remainder unfulfilled.

The 5% cap is designed to prevent a "structural mismatch between investor capital and the expected duration of the private credit loans" held by the fund.`,
      bodyKo: `블랙록의 HPS Corporate Lending Fund(260억 달러 규모 BDC)가 분기 자사주 매입을 발행 주식의 5%(계약상 최소한도)로 제한한다고 발표했습니다. 투자자들은 1분기에 펀드 지분의 9.3%, 약 $12억의 환매를 요청했으나 약 $6.2억만 충족되었습니다.

5% 상한은 "투자자 자본과 펀드가 보유한 Private Credit (사모신용) 대출의 예상 만기 간 구조적 불일치를 방지"하기 위한 것입니다.`,
      sourceUrl: "https://seekingalpha.com/news/4561908",
      sourceName: "Bloomberg / Seeking Alpha",
      publishedAt: ts("2026-03-06T14:00:00Z"),
      category: "breaking",
      mentionedTickers: ["BLK", "APO", "OWL"],
      tags: ["사모신용", "기업분석"],
      isOfficial: true,
      storyThreadId: threadCredit,
      orderInThread: 1,
      translationStatus: "approved",
      translationNotes: [
        "BDC (Business Development Company) → 괄호 내 영문 원어 유지, 한국어 풀네임 없음 (미국 고유 법적 구조)",
        "Private Credit → '사모신용': 금감원 공식 용어 채택, 첫 출현 시 영문 병기 'Private Credit (사모신용)'",
        "quarterly share repurchases → '분기 자사주 매입': 법률 용어 정확 번역",
      ],

      updatedAt: now,
    });

    const art12 = await ctx.db.insert("newsArticles", {
      title: "Private credit market shows cracks: $2T bubble comparison to 2008",
      titleKo: "사모신용 시장에 균열: 2008년 버블과의 비교, $2조 규모",
      summary: "Private credit approaching $3T. BlackRock marked a private loan from 100 to zero. Mohamed El-Erian calls it 'canary in the coal mine.'",
      summaryKo: "사모신용 시장이 약 $3조에 근접한 가운데, 블랙록이 사모대출 가치를 100에서 0으로 평가절하했습니다. 모하메드 엘-에리안은 '탄광 속 카나리아'라고 경고합니다.",
      viewCount: 63,
      body: `The private credit market — estimated by Morgan Stanley at approaching $3 trillion in total assets, larger than both the public high-yield bond market and the syndicated loan market — is facing its first major stress test.

Bloomberg News reported that BlackRock slashed the value of a private loan to zero at the end of 2025, just three months after valuing it at 100 cents on the dollar. Mohamed El-Erian warned that private credit may be facing a "canary in the coal mine" moment.

Unlike publicly traded corporate bonds, private credit loans are not traded on exchanges, meaning their real value is often determined by the same firms that originated and sold them.`,
      bodyKo: `모건스탠리 추정 약 $3조에 달하는 사모신용 시장이 — 공공 하이일드 채권시장과 신디케이트론 시장 모두를 능가하는 규모 — 첫 번째 주요 스트레스 테스트에 직면하고 있습니다.

블룸버그는 블랙록이 2025년 말 사모대출 가치를 100에서 0으로 평가절하했다고 보도했으며, 모하메드 엘-에리안(전 PIMCO CEO)은 사모신용이 "탄광 속 카나리아" 순간에 직면할 수 있다고 경고했습니다.

공개 거래 채권과 달리 사모대출은 거래소에서 거래되지 않아 실제 가치가 대출을 만들고 판매한 바로 그 회사에 의해 결정됩니다.`,
      sourceUrl: "https://starkmanapproved.com/private-credits-smartest-guys-in-the-room/",
      sourceName: "Starkman Approved / Bloomberg",
      publishedAt: ts("2026-03-08T10:00:00Z"),
      category: "analysis",
      mentionedTickers: ["BLK", "APO", "OWL"],
      tags: ["사모신용", "기업분석"],
      isOfficial: true,
      storyThreadId: threadCredit,
      orderInThread: 2,
      translationStatus: "approved",
      translationNotes: [
        "'canary in the coal mine' → '탄광 속 카나리아': 직역 사용 (한국에서도 통용되는 비유)",
        "모하메드 엘-에리안 → 인물 소개 '(전 PIMCO CEO)' 추가 — 독자 맥락 보강",
        "syndicated loan market → '신디케이트론 시장': 금융권 공식 용어",
      ],

      updatedAt: now,
    });

    const art13 = await ctx.db.insert("newsArticles", {
      title: "Blackstone's private credit fund faces 8% redemption requests",
      titleKo: "블랙스톤 사모신용 펀드, 8% 환매 요청 직면",
      summary: "Blackstone's flagship fund saw $3.8B in redemptions (~7.9% of NAV). Senior leaders contributed $150M personal capital to cover outflows.",
      summaryKo: "블랙스톤 플래그십 펀드에 $38억(순자산의 7.9%) 환매 요청이 들어왔습니다. 25명 이상의 임원이 $1.5억의 개인자금을 투입해 유출에 대응했습니다.",
      body: `Blackstone's flagship private credit fund received approximately $3.8 billion in redemption requests during the quarter, representing roughly 7.9% of net asset value — well above the 5% quarterly repurchase limit.

In an unusual move, more than 25 senior leaders across Blackstone contributed approximately $150 million of their personal capital to the fund. Combined with $250 million of Blackstone's own corporate capital, the money helped cover the redemption requests.

JPMorgan Chase CEO Jamie Dimon separately expressed concern: "All of our main competitors are back. I don't know how long it's going to be great for everybody. I see a couple of people doing some dumb things."`,
      bodyKo: `블랙스톤 플래그십 사모신용 펀드에 분기 약 $38억(순자산가치의 약 7.9%)의 환매 요청이 접수되어 5% 분기 상환 한도를 크게 초과했습니다. 이례적으로 블랙스톤 신용사업부 중심의 25명 이상 임원이 약 $1.5억의 개인자금을 투입했고, 회사 자본 $2.5억이 추가되어 환매 요청에 대응했습니다.

제이미 다이먼 JPMorgan CEO도 별도로 우려를 표명했습니다: "모든 주요 경쟁사가 돌아왔다. 몇몇이 어리석은 일을 하고 있다."`,
      sourceUrl: "https://www.bloomberg.com/news/articles/2026-03-03/",
      sourceName: "Bloomberg",
      publishedAt: ts("2026-03-03T16:00:00Z"),
      category: "breaking",
      mentionedTickers: ["BLK", "APO"],
      tags: ["사모신용", "기업분석"],
      isOfficial: true,
      storyThreadId: threadCredit,
      orderInThread: 3,
      translationStatus: "approved",
      translationNotes: [
        "NAV (Net Asset Value) → '순자산가치': 펀드 용어 정확 번역",
        "Jamie Dimon 인용문 직역 유지: '어리석은 일' — 원문 뉘앙스 보존",
        "Blackstone vs BlackRock 혼동 주의: 본문에서 'Blackstone' 명확 표기",
      ],

      updatedAt: now,
    });

    const art14 = await ctx.db.insert("newsArticles", {
      title: "JPMorgan flags concerns in private credit portfolios",
      titleKo: "JPMorgan, 사모신용 포트폴리오 우려 표명",
      summary: "JPMorgan flagged loan downgrades in private credit. The bank has $133B in opaque exposure. Dimon: 'I see a couple of people doing some dumb things.'",
      summaryKo: "JPMorgan이 사모신용 대출 등급 하향을 경고했습니다. 은행의 불투명한 $1,330억 익스포저가 드러나며, 다이먼 CEO는 '몇몇이 어리석은 일을 하고 있다'고 발언했습니다.",
      viewCount: 31,
      body: `JPMorgan Chase has flagged new concerns in its private credit portfolio analysis, identifying an increasing number of loan downgrades among borrowers in the sector.

JPMorgan committed an additional $50 billion of its balance sheet to private credit last year. When regulators asked major banks to disclose their exposure to non-bank financial institutions, JPMorgan reported roughly $133 billion in a broadly labeled "other" category — declining to provide the detailed breakdown.

The concern extends beyond individual funds. If private credit defaults rise sharply, the interconnections between banks, private equity firms, and end investors could amplify the stress — creating a feedback loop similar to the pre-2008 relationship between banks and mortgage originators.`,
      bodyKo: `JPMorgan Chase가 사모신용 포트폴리오 분석에서 새로운 우려를 제기하며, 해당 섹터 차주들의 대출 등급 하향이 증가하고 있다고 밝혔습니다. JPMorgan은 지난해 자체 대차대조표에서 $500억을 사모신용에 추가 투입했습니다. 규제당국이 비은행 금융기관 익스포저 공개를 요구했을 때, JPMorgan은 $1,330억을 '기타'라는 광범위한 항목으로만 보고하며 세부 내역을 거부했습니다.

우려는 개별 펀드를 넘어섭니다. 사모신용 부도율이 급등하면 은행, 사모펀드, 최종 투자자 간 상호연결이 스트레스를 증폭시킬 수 있습니다 — 2008년 이전 은행과 모기지 원매자 관계와 유사한 피드백 루프입니다.`,
      sourceUrl: "https://www.reuters.com/business/finance/",
      sourceName: "Reuters",
      publishedAt: ts("2026-03-10T09:00:00Z"),
      category: "analysis",
      mentionedTickers: ["BLK"],
      tags: ["사모신용", "기업분석"],
      isOfficial: true,
      storyThreadId: threadCredit,
      orderInThread: 4,
      translationStatus: "approved",
      translationNotes: [
        "'other' category → '기타': JPMorgan이 규제당국에 제출한 분류명 직역",
        "feedback loop → '피드백 루프': IT/금융 공통 용어, 직역 유지",
        "2008 비교 맥락: '은행과 모기지 원매자 관계' — 서브프라임 위기 설명 없이도 이해 가능하도록 의역",
      ],

      updatedAt: now,
    });

    // --- Thread A: Hormuz (2 NEW articles — art5, art6) ---

    const art5 = await ctx.db.insert("newsArticles", {
      title: "IEA agrees to release record 400 million barrels from strategic reserves",
      titleKo: "IEA, 사상 최대 4억 배럴 비축유 방출 합의",
      summary: "32 IEA member states unanimously agreed to release 400M barrels — largest coordinated drawdown since the agency's 1974 founding. But analysts warn it covers only a fraction of the 15M bbl/day supply loss.",
      summaryKo: "32개 IEA 회원국이 만장일치로 4억 배럴 방출에 합의 — 1974년 설립 이래 최대 규모입니다. 그러나 일일 1,500만 배럴 공급 손실의 일부만 충당할 수 있어 유가 하락 효과는 제한적입니다.",
      viewCount: 55,
      body: `The International Energy Agency's 32 member states unanimously agreed on Wednesday to release 400 million barrels of crude from strategic reserves — the largest coordinated drawdown since the agency was created in 1974.

The record amount far surpasses the 182 million barrels that countries released in two tranches in 2022 when Russia launched its full-scale invasion of Ukraine. The IEA said the release was necessary because Gulf Arab states had already cut production by at least 10 million barrels per day, and warned that unless shipping through the Strait of Hormuz rapidly resumes, further cuts are inevitable.

However, traders are doing the math: at roughly 15 million barrels per day of net supply loss from the Hormuz closure, 400 million barrels covers only about 26 days of the deficit. Saudi Arabia further compounded the picture by cutting its own production by 20% after shutting two offshore fields, including the massive Safaniya field.

The U.S. also enacted an unprecedented suspension of its embargo on Russian oil, temporarily clearing 19 million barrels of Russian crude for sale in Asia from 30 sanctioned tankers — a dramatic policy reversal aimed at preventing oil prices from spiraling further.`,
      bodyKo: `국제에너지기구(IEA) 32개 회원국이 수요일 전략 비축유 4억 배럴 방출에 만장일치로 합의했습니다 — 1974년 기구 설립 이래 최대 규모의 조율된 방출입니다.

이 규모는 2022년 러시아의 우크라이나 전면 침공 당시 2차에 걸쳐 방출된 1억 8,200만 배럴을 크게 능가합니다. IEA는 걸프 아랍 산유국들이 이미 일일 최소 1,000만 배럴의 생산을 감축했으며, 호르무즈 해협 통행이 빠르게 재개되지 않으면 추가 감축은 불가피하다고 경고했습니다.

그러나 시장은 냉정합니다: 호르무즈 봉쇄로 인한 일일 순 공급 손실 약 1,500만 배럴 기준으로, 4억 배럴은 약 26일치에 불과합니다. 사우디아라비아는 사파니야 유전 등 해양 유전 2곳을 폐쇄하며 자체 생산도 20% 감축했습니다.

미국은 러시아 원유 수입 금지를 일시 유예해, 제재 대상 유조선 30척에서 1,900만 배럴의 러시아 원유를 아시아 시장에 매각하도록 허용하는 전례 없는 정책 전환을 단행했습니다.`,
      sourceUrl: "https://www.cnbc.com/2026/03/11/iea-oil-reserves-crude-prices-iran-g7-energy.html",
      sourceName: "CNBC / IEA",
      publishedAt: ts("2026-03-11T18:00:00Z"),
      category: "breaking",
      mentionedTickers: ["XOM", "CVX", "036460"],
      tags: ["에너지", "지정학", "경제지표"],
      isOfficial: true,
      storyThreadId: threadHormuz,
      orderInThread: 5,
      translationStatus: "approved",
      translationNotes: [
        "IEA → '국제에너지기구(IEA)': 한국어 정식명 + 영문 약어 병기",
        "strategic reserves → '전략 비축유': 에너지 분야 공식 번역",
        "Safaniya field → '사파니야 유전': 세계 최대 해상 유전, 한국어 음역",
        "26일치 계산 → 원문 implicit, 번역에서 명시화하여 독자 이해 강화",
      ],
      updatedAt: now,
    });

    const art6 = await ctx.db.insert("newsArticles", {
      title: "Iran's new supreme leader Mojtaba Khamenei vows to keep Strait of Hormuz closed",
      titleKo: "이란 신임 최고지도자 모지타바 하메네이, 호르무즈 봉쇄 유지 선언",
      summary: "Mojtaba Khamenei, succeeding his father killed in Feb 28 strikes, declared Hormuz closure must continue as 'tool to pressure the enemy.' Brent hits $100. Iran begins laying naval mines; US destroys 16 minelayers.",
      summaryKo: "2월 28일 공습으로 사망한 부친을 승계한 모지타바 하메네이가 호르무즈 봉쇄를 '적에 대한 압박 도구'로 계속 유지하겠다고 선언했습니다. 브렌트유 $100 돌파. 이란이 기뢰를 부설하자 미군이 기뢰부설함 16척을 격침했습니다.",
      viewCount: 73,
      body: `Iran's new supreme leader, Mojtaba Khamenei, said Thursday that the closure of the Strait of Hormuz maritime passage should be continued as a "tool to pressure the enemy," in his first public statement since being appointed on March 9.

The 56-year-old Mojtaba Khamenei succeeded his father Ali Khamenei, who was killed in the US-Israeli strikes on Tehran on February 28 after ruling Iran for 37 years. He demanded the immediate closure of all US military bases in the Middle East and warned of further attacks.

The statement came as oil prices surpassed $100 per barrel for the first time in four years. At its peak, Brent crude hit $126 per barrel. As of mid-March, prices have been gyrating between $80 and $100, with the IEA's record 400 million barrel release doing little to calm markets.

In a dramatic escalation, US military intelligence reported on March 10 that Iran had begun planting naval mines in the Strait of Hormuz. President Trump demanded Iran immediately remove any mines, and the US military said it destroyed 16 Iranian minelayers. Since the war began on February 28, at least 21 ships have been attacked in and around the strait, with 10 seafarers killed or missing.

The conflict has also spread beyond the strait itself. Iran launched drone attacks on the UAE's Fujairah port and Abu Dhabi's Ruwais industrial complex, key energy bypass infrastructure that was being used to circumvent the Hormuz blockade via the Abu Dhabi Crude Oil Pipeline. As of March 15, fires from drone interceptions continue in Fujairah, though authorities report no casualties.`,
      bodyKo: `이란의 신임 최고지도자 모지타바 하메네이가 목요일, 3월 9일 취임 이후 첫 공개 성명에서 호르무즈 해협 봉쇄를 "적에 대한 압박 도구"로 계속 유지해야 한다고 밝혔습니다.

56세의 모지타바 하메네이는 2월 28일 미-이스라엘의 테헤란 공습으로 사망한 부친 알리 하메네이(37년 집권)를 승계했습니다. 그는 중동 내 모든 미군 기지의 즉각 폐쇄를 요구하고 추가 공격을 경고했습니다.

이 성명이 나온 시점에 유가는 4년 만에 처음으로 배럴당 $100을 돌파했습니다. 브렌트유는 최고 $126까지 치솟았으며, 3월 중순 현재 $80~$100 사이를 등락하고 있습니다. IEA의 사상 최대 4억 배럴 방출도 시장을 진정시키지 못했습니다.

극적인 에스컬레이션으로, 미 군사정보부는 3월 10일 이란이 호르무즈 해협에 기뢰(바다에 떠다니는 폭탄) 부설을 시작했다고 보고했습니다. 트럼프 대통령은 즉각 철거를 요구했고, 미군은 이란 기뢰부설함 16척을 격침했다고 발표했습니다. 2월 28일 전쟁 개시 이래 해협 내외에서 최소 21척이 공격받았으며, 10명의 선원이 사망하거나 실종되었습니다.

분쟁은 해협 밖으로도 확산되었습니다. 이란은 호르무즈 우회 에너지 인프라인 UAE 푸자이라 항구와 아부다비 루와이스 산업단지에 드론 공격을 감행했습니다. 3월 15일 현재 푸자이라에서 드론 요격 후 화재 진압이 계속되고 있으나, 사상자는 없는 것으로 보도됩니다.`,
      sourceUrl: "https://www.cnbc.com/2026/03/12/strait-of-hormuz-closure-iran-oil-prices-mojtaba-khamenei.html",
      sourceName: "CNBC / CBS / NPR",
      publishedAt: ts("2026-03-12T14:00:00Z"),
      category: "breaking",
      mentionedTickers: ["XOM", "CVX", "LMT"],
      tags: ["에너지", "지정학", "헤드라인"],
      isOfficial: true,
      storyThreadId: threadHormuz,
      orderInThread: 6,
      translationStatus: "approved",
      translationNotes: [
        "Mojtaba Khamenei → '모지타바 하메네이': 외래어 표기법 준수",
        "naval mines → '기뢰(바다에 떠다니는 폭탄)': bodyKo에서 초보자용 괄호 설명 추가",
        "minelayers → '기뢰부설함': 군사 용어 정식 번역",
        "$126 peak → 최고가 수치는 Wikipedia 인용, 원문 CNBC와 교차 확인",
      ],
      updatedAt: now,
    });

    // --- Thread B: Private Credit (2 NEW articles — art15, art16) ---

    const art15 = await ctx.db.insert("newsArticles", {
      title: "Morgan Stanley caps redemptions at private credit fund as withdrawals spike to 11%",
      titleKo: "Morgan Stanley, 사모신용 펀드 환매 제한 — 요청 11%, 충족 5%만",
      summary: "Morgan Stanley's North Haven Private Income Fund received 11% redemption requests but honored only 5%. Only $169M of requests fulfilled. Follows BlackRock and Blackstone in capping withdrawals.",
      summaryKo: "Morgan Stanley의 North Haven Private Income Fund에 11% 환매 요청이 접수되었으나 5%만 충족되었습니다. 약 $1.69억만 지급. 블랙록·블랙스톤에 이어 대형 금융사의 연쇄적 환매 제한입니다.",
      viewCount: 41,
      body: `Morgan Stanley disclosed that it imposed redemption restrictions on its North Haven Private Income Fund after investors attempted to withdraw nearly 11% of outstanding shares — more than double the fund's 5% quarterly repurchase limit.

Approximately $169 million was returned to investors, representing just 45.8% of the total redemption requests. "As marketed and consistent with the disclosure in our private placement memorandum, we will be fulfilling tender requests for 5% of units outstanding," the bank's investment management arm said.

Morgan Stanley added that limiting withdrawals will help avoid asset sales during "periods of market dislocation" and maximize risk-adjusted returns for investors over time.

The move follows similar restrictions by BlackRock on its $26 billion HPS Lending Fund and Blackstone's $48 billion BCRED fund, signaling that the redemption pressure is spreading across the $1.9 trillion private credit market. According to analysts, private lenders have entered a "prolonged" cycle of negative net outflows that could last up to two years.`,
      bodyKo: `Morgan Stanley가 North Haven Private Income Fund에서 투자자들의 환매 요청이 발행 주식의 11%에 달하자 — 분기 5% 환매 한도의 2배 이상 — 환매 제한을 시행했다고 밝혔습니다.

약 $1.69억이 투자자에게 반환되어 전체 환매 요청의 45.8%만 충족되었습니다. 은행 투자운용 부문은 "마케팅 시 공시하고 사모투자설명서에 기재된 대로 발행 주식의 5% 한도로 환매 요청을 이행한다"고 밝혔습니다.

Morgan Stanley는 환매 제한이 "시장 혼란 기간" 동안 자산 매각을 방지하고 장기적으로 투자자의 위험조정수익률을 극대화하는 데 도움이 될 것이라고 덧붙였습니다.

이 조치는 블랙록($260억 HPS Lending Fund)과 블랙스톤($480억 BCRED 펀드)의 유사한 환매 제한에 이은 것으로, $1.9조 규모 사모신용 시장 전반에 환매 압력이 확산되고 있음을 보여줍니다. 애널리스트들은 사모대출기관이 최대 2년간 지속될 수 있는 "장기적" 순 자금 유출 사이클에 진입했다고 분석합니다.`,
      sourceUrl: "https://www.bloomberg.com/news/articles/2026-03-11/morgan-stanley-limits-redemptions-on-private-credit-fund",
      sourceName: "Bloomberg / Reuters",
      publishedAt: ts("2026-03-11T15:00:00Z"),
      category: "breaking",
      mentionedTickers: ["BLK", "APO", "OWL"],
      tags: ["사모신용", "기업분석"],
      isOfficial: true,
      storyThreadId: threadCredit,
      orderInThread: 5,
      translationStatus: "approved",
      translationNotes: [
        "private placement memorandum → '사모투자설명서': 금감원 공식 용어",
        "risk-adjusted returns → '위험조정수익률': 재무학 표준 용어",
        "negative net outflows → '순 자금 유출': 펀드 흐름 분석 용어",
        "45.8% 충족률 → 원문 수치 계산: $169M / 전체 요청 ≈ 45.8%",
      ],
      updatedAt: now,
    });

    const art16 = await ctx.db.insert("newsArticles", {
      title: "The $265 billion private credit meltdown: Wall Street's hottest craze turned into panic",
      titleKo: "사모신용 $2,650억 멜트다운: 월스트리트 최대 열풍에서 패닉으로",
      summary: "Private equity stocks lost $265B in market cap. Blue Owl down 66% from peak. Blackstone -46%, KKR -48%, Apollo -41%. Software loan exposure to AI disruption is a key trigger.",
      summaryKo: "사모신용 관련 기업 시총 $2,650억이 증발했습니다. Blue Owl -66%, Blackstone -46%, KKR -48%, Apollo -41%. AI 위협에 노출된 소프트웨어 기업 대출이 핵심 촉발 요인입니다.",
      viewCount: 92,
      body: `The wipeout has erased over $265 billion in market capitalization from the five largest private credit firms — Blackstone, KKR, Apollo, Ares, and Blue Owl Capital — in a dramatic reversal from the sector's historic bull run.

From mid-2023 to January 2025, these firms staged what may rank as the single biggest surge in the annals of financial services: Blackstone gained 58.2%, Ares 68.1%, Apollo 77.9%, Blue Owl 80.6%, and KKR led at 103.4%. But starting last September, an historic selloff sent Apollo down 41%, Blackstone 46%, Ares and KKR 48% each, while Blue Owl dropped by two-thirds.

The trigger wasn't just rising interest rates or economic uncertainty. High-profile blowups rattled investors — most notably, heavy exposure to software companies now vulnerable to AI disruption. Retail clients that firms had spent years courting began yanking money from the industry's largest funds, straining redemption limits designed to prevent fire sales of illiquid loans.

According to Goldberg at Morgan Stanley, private lenders have already entered a "prolonged" cycle of negative net outflows, which could last up to two years as fund managers sort through the fallout of high redemptions, deteriorating loan quality, and the structural challenge of marking illiquid assets to market.`,
      bodyKo: `$2,650억 이상의 시가총액이 5대 사모신용 기업 — 블랙스톤, KKR, 아폴로, Ares, Blue Owl Capital — 에서 증발했습니다. 이 섹터의 역사적 상승장에서 극적으로 반전된 것입니다.

2023년 중반부터 2025년 1월까지, 이들 기업은 금융서비스 역사상 가장 큰 급등을 기록했습니다: 블랙스톤 +58.2%, Ares +68.1%, 아폴로 +77.9%, Blue Owl +80.6%, KKR은 +103.4%로 선두였습니다. 그러나 지난 9월부터 역사적 매도세가 시작되어 아폴로 -41%, 블랙스톤 -46%, Ares와 KKR 각 -48%, Blue Owl은 고점 대비 2/3가 하락했습니다.

촉발 요인은 금리 상승이나 경제 불확실성만이 아닙니다. 대형 부실 사건이 투자자를 공포에 빠뜨렸고 — 특히 AI 디스럽션에 취약한 소프트웨어 기업에 대한 과도한 대출 노출이 문제였습니다. 기업들이 수년간 유치해 온 개인 투자자들이 업계 최대 펀드에서 자금을 빼기 시작하면서, 비유동 대출의 투매를 막기 위해 설계된 환매 한도가 압박을 받고 있습니다.

Morgan Stanley의 골드버그에 따르면, 사모대출기관은 이미 "장기적" 순 유출 사이클에 진입했으며, 높은 환매, 대출 품질 악화, 비유동 자산의 시가평가라는 구조적 과제로 최대 2년간 지속될 수 있습니다.`,
      sourceUrl: "https://fortune.com/2026/03/14/private-credit-meltdown-how-wall-streets-blackstone-kkr-apollo-ares-blue-owl-investment-craze-panic/",
      sourceName: "Fortune",
      publishedAt: ts("2026-03-14T08:00:00Z"),
      category: "analysis",
      mentionedTickers: ["BLK", "APO", "OWL"],
      tags: ["사모신용", "기업분석"],
      isOfficial: true,
      storyThreadId: threadCredit,
      orderInThread: 6,
      translationStatus: "approved",
      translationNotes: [
        "market capitalization → '시가총액': 금융 표준 용어",
        "AI disruption → 'AI 디스럽션': 기술 분야 음역 관행",
        "illiquid → '비유동': 자산 유동성 분류 용어",
        "fire sales → '투매': 강제 매각을 의미, 한국 금융 언론 표준",
      ],
      updatedAt: now,
    });

    // =====================================================================
    // 5. EXPLAINERS (12) — ALL in Korean, deep-dive storytelling for financial beginners
    // =====================================================================

    // Explainer for art1: US-Israel strikes
    await ctx.db.insert("explainers", {
      newsArticleId: art1,
      simplifiedTitle: "전쟁이 나면 기름값이 왜 오를까?",
      storyBody: `수십 년간 으르렁대던 두 나라가 진짜로 싸우기 시작했습니다. 2026년 2월 28일, 미국과 이스라엘이 이란 군사시설을 공습한 것입니다.

이란은 유일하게 쓸 수 있는 카드를 꺼냈습니다 — 호르무즈 해협을 막아버린 것이죠. 호르무즈 해협은 세계에서 가장 큰 석유 고속도로와 같습니다. 매일 약 50척의 유조선이 이곳을 지나갔는데, 공습 후 며칠 만에 그 숫자가 0이 되었습니다.

왜 이란에게 이런 힘이 있을까요? 지리가 이란에게 트럼프 카드를 준 것입니다. 해협의 가장 좁은 곳은 폭 34km에 불과하고, 이란이 한쪽을 차지하고 있습니다. 전 세계 석유의 20%가 지나가는 유일한 다리를 지키는 것과 같은 셈이죠.

이 하나의 사건이 연쇄반응을 일으켰습니다 — 석유 공급이 멈추면 모든 것이 비싸지기 때문입니다. 주유소 기름값부터 플라스틱 제품, 비행기 티켓, 식료품까지 영향을 받습니다.`,
      keyTakeaways: [
        "미국과 이스라엘이 2026년 2월 28일 이란 군사시설을 공습했습니다",
        "이란은 세계 최대 석유 운송로인 호르무즈 해협을 봉쇄해 보복했습니다",
        "유조선 통행이 단 3일 만에 하루 50척에서 0으로 급감했습니다",
        "전 세계 석유의 20%가 이 하나의 좁은 수로를 통과합니다",
        "석유 공급 차단은 연쇄적으로 모든 물가에 영향을 미칩니다",
      ],
      personalImpact: "나에게 어떤 영향이 있을까? 자동차를 운전하거나, 장을 보거나, 플라스틱으로 만든 물건을 쓴다면 — 이 위기는 당신이 내는 가격을 올릴 가능성이 큽니다. 유가 급등은 몇 주 안에 경제 전체로 퍼집니다. 주유비 인상은 시작일 뿐입니다.",
      analogy: "한 동네에 들어오고 나가는 길이 딱 하나뿐인데, 그 길목의 집주인이 바리케이드를 치면 어떻게 될까요? 택배도 안 오고, 갑자기 동네 모든 물건 값이 오르게 됩니다. 호르무즈 해협이 바로 그 '유일한 길'입니다.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // Explainer for art2: Supertanker rates
    await ctx.db.insert("explainers", {
      newsArticleId: art2,
      simplifiedTitle: "보험 없이는 배가 못 간다: 유조선 운임 94% 폭등의 비밀",
      storyBody: `전 세계 석유의 20%가 지나가는 고속도로가 있습니다 — 호르무즈 해협이라는 이란과 오만 사이의 좁은 바닷길입니다. 미국과 이란 사이에 전쟁이 터지자 배들이 운항을 멈췄습니다.

그런데 왜 배들이 그냥 지나가지 못할까요? 핵심은 '보험'입니다.

보험회사 5곳이 "전쟁 중인 해역을 지나는 배는 보장해줄 수 없다"고 선언했습니다. 보험이 없으면 선박회사는 배를 보낼 수 없습니다 — 배 한 척이 수천억 원짜리인데 보험 없이 위험을 감수할 사람은 없으니까요.

결과는? 석유를 실어 나르는 배가 급격히 줄었고, 남은 배의 운임은 하루 만에 94% 폭등해 일일 약 5억 6천만 원($423,736)이 되었습니다. 택시비에 비유하면 모든 도로가 막히고 딱 하나만 남아서 택시비가 두 배로 뛴 것과 같습니다.

일상생활에 왜 중요할까요? 석유는 휘발유만이 아닙니다 — 플라스틱, 운송비, 비행기 연료, 농사에 쓰는 비료에까지 들어갑니다. 석유가 비싸지면 거의 모든 것이 따라 비싸집니다.`,
      keyTakeaways: [
        "전 세계 석유의 20%가 이란과 오만 사이 좁은 수로를 통과합니다",
        "보험사가 전쟁위험 보장을 취소하면 선박은 운항을 멈춥니다 — 보험 없으면 운항 불가",
        "VLCC(초대형유조선) 운임이 94% 급등해 하루 약 5억 6천만 원에 달했습니다",
        "석유 운송량 감소는 휘발유부터 식료품, 플라스틱까지 모든 가격 인상으로 이어집니다",
      ],
      personalImpact: "나에게 어떤 영향이 있을까? 며칠 안에 주유소 기름값이 오를 것입니다. 인터넷 쇼핑 배송비도 비싸질 수 있습니다. 항공사가 항공권에 유류할증료를 추가할 가능성이 높습니다. 이 모든 것은 '보험 취소 → 배 운항 중단'이라는 도미노의 결과입니다.",
      analogy: "호르무즈 해협을 석유 생산국과 세계를 잇는 유일한 고속도로 위의 다리라고 생각해보세요. 다리가 너무 위험해서 건널 수 없게 되면 트럭이 멈추고, 트럭으로 배달되던 모든 물건 값이 오릅니다. 그 '다리 위험'을 판단하는 것이 바로 보험회사입니다.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // Explainer for art3: Oil surge 20%
    await ctx.db.insert("explainers", {
      newsArticleId: art3,
      simplifiedTitle: "유가 20% 폭등, 내 지갑에 미치는 영향은?",
      storyBody: `호르무즈 해협이 봉쇄되자 유가가 하루 만에 20% 급등했습니다 — 2022년 에너지 위기 이후 최대 상승폭입니다. 그런데 유가가 왜 내 지갑과 관련이 있을까요?

핵심은 이것입니다: 석유는 자동차 연료만이 아닙니다. 플라스틱 병, 택배 운송비, 비행기 연료, 농사용 비료, 도로의 아스팔트까지 — 석유가 비싸지면 거의 모든 것이 따라 오릅니다. 경제학에서는 이를 '비용상승 인플레이션(Cost-push inflation)'이라 부릅니다.

월스트리트 최대 은행 중 하나인 골드만삭스는 유가 전망을 올리면서 배럴당 $100에 달할 수 있다고 경고했습니다. 마지막으로 그런 일이 있었던 2022년에는 미국 물가상승률이 9.1% — 40년 만에 최고치 — 까지 치솟았습니다. 그 결과 연준(미국 중앙은행)이 기준금리를 0.25%에서 4.5%로 올렸고, 주택 대출, 자동차 할부, 카드 이자가 모두 비싸졌죠.

경제학자들이 사용하는 무서운 단어가 있습니다 — '스태그플레이션(Stagflation)'. 경기는 나빠지는데 물가는 계속 오르는 최악의 조합입니다.`,
      keyTakeaways: [
        "호르무즈 봉쇄로 공급이 끊겼지만 수요는 그대로여서 유가가 20% 급등했습니다",
        "석유는 연료뿐 아니라 식품, 운송, 플라스틱, 제조업 전체에 영향을 미칩니다",
        "골드만삭스는 배럴당 $100 경고 — 2022년 인플레이션 9.1%를 촉발한 수준입니다",
        "스태그플레이션(경기침체+물가상승 동시 발생)이 이 위기의 가장 큰 경제적 위험입니다",
      ],
      personalImpact: "나에게 어떤 영향이 있을까? 유가발 인플레이션으로 금리가 오르면 주택담보대출, 자동차 할부, 카드 이자가 모두 비싸집니다. 식료품 가격은 보통 유가를 4~6주 지연하고 따라갑니다. 지금 시작된 유가 상승이 한 달 반 뒤 마트 장바구니에 반영된다는 뜻입니다.",
      analogy: "도시의 물 20%를 공급하는 수도관이 갑자기 막혔다고 상상해보세요. 남은 물이 훨씬 비싸지고, 물을 쓰는 모든 곳 — 식당, 세탁소, 세차장 — 이 가격을 올려야 합니다. 석유가 바로 현대 경제의 '물'입니다.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // Explainer for art4: Korea energy crisis
    await ctx.db.insert("explainers", {
      newsArticleId: art4,
      simplifiedTitle: "한국의 에너지 아킬레스건: 중동 원유 의존도 69%",
      storyBody: `한국에는 대부분의 국민이 모르는 비밀 취약점이 있습니다: 한국이 수입하는 원유의 69.3%가 중동에서 오고, 그 거의 전부가 호르무즈 해협을 통과합니다.

이렇게 생각해보세요: 먹을 것 대부분을 한 가게에서 사는데 그 가게가 갑자기 문을 닫으면 큰일 나겠죠? 중동 석유에 대한 한국의 상황이 바로 그렇습니다.

한국은 세계에서 가장 에너지 집약적인 경제 중 하나입니다 — 세계 5위 석유 수입국이죠. 조선, 전자, 자동차 등 한국의 주력 산업은 모두 저렴한 에너지에 의존합니다. 유가가 급등하면 한국 제조업은 이중고를 겪습니다: 생산비용 상승 + 원화 약세(석유는 달러로 거래되니까요).

해운 교란은 컨테이너 운임에도 타격을 줬습니다. 상하이컨테이너운임지수(SCFI)가 1,489까지 올랐습니다 — 원자재를 들여오는 것도, 완성품을 수출하는 것도 모두 비싸진 것입니다. 에너지를 대부분 수입하고 제조품을 수출하는 나라에게 이것은 양쪽에서 조이는 경제적 압박입니다.`,
      keyTakeaways: [
        "한국은 원유의 69.3%를 중동에서 수입하며 대부분 호르무즈를 경유합니다",
        "세계 5위 석유 수입국으로 공급 교란에 극도로 취약합니다",
        "컨테이너 운임도 급등해 수입과 수출 양쪽 모두 비용이 증가합니다",
        "한국가스공사(KOGAS)는 글로벌 LNG의 19%가 호르무즈를 통과하는 만큼 특히 우려됩니다",
      ],
      personalImpact: "나에게 어떤 영향이 있을까? 한국 소비자는 주유비와 가스비가 오르는 것을 체감할 것입니다. 제조원가 상승으로 전자제품, 자동차 등 한국산 제품의 글로벌 가격도 올라갈 수 있습니다. 직접적으로는 전기·가스 요금 인상, 간접적으로는 모든 생활물가 상승으로 이어집니다.",
      analogy: "식재료의 70%를 한 농장에서 받는 레스토랑을 떠올려보세요. 그 농장에 홍수가 나면 레스토랑은 하루아침에 공급처를 바꿀 수 없습니다 — 새 공급처를 찾는 데 몇 달이 걸리고, 그 사이 모든 메뉴 가격이 올라갑니다. 한국 경제가 바로 그 레스토랑입니다.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // Explainer for art11: BlackRock caps withdrawals
    await ctx.db.insert("explainers", {
      newsArticleId: art11,
      simplifiedTitle: "내 돈이 묶인다? 블랙록 환매 제한의 의미",
      storyBody: `은행에 돈을 넣었다가 찾으려는데 은행이 "죄송합니다, 이번 분기에는 5%만 인출할 수 있습니다"라고 말한다면 어떤 기분이 들까요? 블랙록의 사모신용 펀드에서 실제로 일어난 일입니다.

투자자들은 펀드 자산의 9.3% — 약 1조 6천억 원($12억) — 을 인출하려 했습니다. 하지만 블랙록은 약 8천억 원($6.2억), 즉 5%만 돌려줬습니다. 왜 그랬을까요? 펀드가 그 돈을 기업에 장기 대출로 빌려줬는데, 이런 대출은 쉽게 팔 수 없기 때문입니다.

이것을 '유동성 불일치(Liquidity Mismatch)'라고 합니다. 내 돈은 쉽게 들어갔지만, 펀드는 그 돈을 회수하는 데 수년이 걸리는 곳에 투자했습니다. 너무 많은 사람이 한꺼번에 빼려고 하면 현금이 부족해집니다.

블랙록은 세계 최대 자산운용사입니다. 이들이 어려움을 겪고 있다면 더 큰 질문이 떠오릅니다: 투자회사가 은행 대신 기업에 직접 대출하는 2조 달러(약 2,700조 원) 규모의 사모신용(Private Credit) 시장 전체가 위기에 빠지고 있는 걸까요?`,
      keyTakeaways: [
        "사모신용 펀드는 상황이 나빠지면 내 돈을 묶어둘 수 있습니다 — 원하는 때에 항상 인출할 수 없습니다",
        "블랙록은 세계 최대 자산운용사 — 이들의 어려움은 시장 전체의 문제를 시사합니다",
        "2조 달러 사모신용 시장은 저금리 시대에 급성장했고, 고금리에서 첫 시험대에 올랐습니다",
      ],
      personalImpact: "나에게 어떤 영향이 있을까? 본인이나 연금 펀드가 사모신용 또는 '대체투자(Alternative Investment)'에 노출되어 있다면, 생각보다 유동성이 낮을 수 있습니다. 퇴직연금이 무엇에 투자되어 있는지 확인해보세요. '고수익'이라는 말 뒤에 '환매 제한'이라는 단서가 숨어 있을 수 있습니다.",
      analogy: "100명이 앉는 레스토랑인데 출구가 하나뿐이라고 생각해보세요. 평소에는 모두 편하게 나갑니다. 하지만 화재 경보가 울리면? 한꺼번에 출구로 몰리지만 한 번에 소수만 나갈 수 있습니다. 사모신용 펀드의 환매 제한이 바로 그 좁은 출구입니다.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // Explainer for art12: Private credit $2T bubble
    await ctx.db.insert("explainers", {
      newsArticleId: art12,
      simplifiedTitle: "2조 달러 사모신용, 왜 '시한폭탄'이라 불리나",
      storyBody: `2008년 금융위기 이후 새로운 규제가 은행의 위험한 대출을 어렵게 만들었습니다. 그래서 월스트리트는 우회로를 찾았죠 — 사모펀드(Private Equity) 회사들이 은행 대신 기업에 직접 대출하기 시작한 것입니다. 이것이 '사모신용(Private Credit)'이며, 약 3조 달러(약 4,000조 원)까지 폭발적으로 성장했습니다.

문제가 뭘까요? 이 대출 상품은 고액자산가 — 의사, 치과의사, 자영업자 — 에게 "채권의 안전한 대안"으로 팔렸습니다. 그런데 주식시장에서 아무 때나 팔 수 있는 채권과 달리, 사모신용 대출은 수년간 묶여 있습니다. 급하게 팔 수 없어요.

충격적인 사실: 세계 최대 자산운용사 블랙록이 사모대출의 가치를 단 3개월 만에 100에서 0으로 떨어뜨렸습니다. 5억짜리 집을 샀는데 갑자기 가치가 0이 된 것과 같습니다. 블랙록의 전문가도 이걸 못 봤다면 일반 투자자는 어떻까요?

세계적 경제학자 모하메드 엘-에리안은 이를 "탄광 속 카나리아(Canary in the Coal Mine)" — 더 큰 문제의 초기 경고 신호 — 라고 불렀습니다. 3조 달러가 걸려 있는 만큼, 소수의 부실 대출만으로도 위기를 촉발할 수 있습니다.`,
      keyTakeaways: [
        "사모신용은 2008년 이후 은행 규제가 강화되면서 3조 달러까지 성장했습니다",
        "고액자산가에게 '안전'하다고 팔렸지만, 공공 채권처럼 쉽게 팔 수 없습니다",
        "블랙록이 대출 가치를 3개월 만에 100→0으로 평가절하 — 가치 판단의 불안정성 노출",
        "대출을 만든 회사가 스스로 가치를 매긴다는 것은 이해충돌(Conflict of Interest)입니다",
        "은행과 사모대출기관의 상호연결이 연쇄반응을 일으킬 수 있습니다",
      ],
      personalImpact: "나에게 어떤 영향이 있을까? 재무설계사가 '대체투자' 또는 '사모신용' 상품을 권했다면 환매(Exit) 조건을 확인하세요. 높은 수익률을 약속하지만 정작 필요할 때 돈을 빼지 못할 수 있습니다. 핵심 질문: '내 돈을 뺄 때 제한이 있나요?'",
      analogy: "동네 아이들에게 돈을 빌려주면서 이자 주겠다고 약속하는 레모네이드 가게를 상상해보세요. 그런데 그 가게가 자기 성적표를 자기가 채점합니다 — 돈이 얼마나 있는지 스스로 결정하죠. 어느 날 성적표가 틀렸다고 인정하면 갑자기 모두가 돈을 돌려달라고 합니다. 사모신용이 바로 그 레모네이드 가게입니다.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // Explainer for art13: Blackstone redemptions
    await ctx.db.insert("explainers", {
      newsArticleId: art13,
      simplifiedTitle: "임원들이 사비를 넣었다: 블랙스톤의 위기 대응",
      storyBody: `금융계에서 보기 드문 일이 벌어졌습니다: 월스트리트 최강 기업 중 하나인 블랙스톤의 임원 25명 이상이 자기 돈 약 2천억 원($1.5억)을 펀드에 넣어 투자자들의 인출을 충당한 것입니다.

이것이 왜 큰 일일까요? 보통 펀드매니저는 자기 재산을 위험에 걸지 않습니다. 자기 돈을 넣었다는 것은 두 가지 메시지를 보냅니다: 첫째, 펀드에 투자할 가치가 있다고 믿는다는 것. 하지만 둘째 — 사람들이 걱정하는 부분 — 임원들이 사비를 들여야 할 만큼 현금이 절박하게 필요했다는 뜻이기도 합니다.

블랙스톤 사모신용 펀드에는 약 5조 원($38억)의 환매 요청이 들어왔습니다(전체 가치의 7.9%). 펀드의 분기 한도는 5%라서 많은 투자자가 돈을 빼지 못했습니다.

이 펀드는 블랙스톤이 사모신용을 '대중화'하겠다며 — 대형 기관뿐 아니라 일반 고액자산가에게도 접근성을 넓히겠다며 — 야심차게 내놓은 대표 상품이었습니다. JPMorgan CEO 제이미 다이먼은 "몇몇이 어리석은 일을 하고 있다"고 경고하며 불에 기름을 부었습니다. 미국 최대 은행 수장의 이런 발언은 심각한 경보입니다.`,
      keyTakeaways: [
        "블랙스톤 임원 25명 이상이 개인자금 2천억 원을 투입해 펀드 유출에 대응했습니다",
        "펀드에 약 5조 원의 환매 요청이 왔지만 분기 5%만 처리할 수 있었습니다",
        "이 펀드는 고액자산가에게 사모신용을 파는 블랙스톤의 대표 상품이었습니다",
        "JPMorgan CEO가 공개적으로 사모신용의 위험한 행동을 경고 — 대형 금융사 간 이례적 비판",
      ],
      personalImpact: "나에게 어떤 영향이 있을까? 재무설계사로부터 '사모신용' 또는 '대체 대출' 상품을 권유받았다면 이것은 경고 신호입니다. 업계 내부자도 걱정하는 상황에서 개인 투자자는 더욱 신중해야 합니다. 핵심은 '환매 조건'과 '유동성 제한'을 반드시 확인하는 것입니다.",
      analogy: "은행에서 너무 많은 사람이 한꺼번에 예금을 찾으려 해서 은행 지점장이 자기 사비를 들여 ATM을 가동해야 했다고 상상해보세요. 신뢰를 보여주는 것일 수도 있지만, 동시에 상황이 누구도 말하지 않던 것보다 훨씬 심각하다는 뜻이기도 합니다.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // Explainer for art14: JPMorgan flags
    await ctx.db.insert("explainers", {
      newsArticleId: art14,
      simplifiedTitle: "JPMorgan의 1,330억 달러 비밀: 은행도 위험하다",
      storyBody: `2008년 이후 새로운 규제로 은행이 더 안전해졌다고 들었죠? 반전이 있습니다: 미국 최대 은행 JPMorgan Chase가 균열이 보이는 바로 그 사모신용 시장에 1,330억 달러(약 180조 원)의 익스포저(Exposure, 위험 노출)를 갖고 있습니다.

정말 걱정되는 부분: 규제당국이 비은행 금융회사에 얼마나 빌려줬는지 공개하라고 요구했을 때, 대부분의 은행은 상세 내역을 제공했습니다. JPMorgan은? 1,330억 달러를 '기타'라고만 적고 세부 사항을 거부했습니다. 이런 불투명성이 바로 2008년 위기를 그토록 위험하게 만든 것이었습니다 — 위험이 실제로 어디에 있는지 아무도 몰랐으니까요.

더 우려스러운 점: JPMorgan은 부유한 프라이빗뱅킹 고객들에게 포트폴리오의 30%까지를 사모신용 같은 '대체투자'에 배분하라고 권했습니다. 즉, 사모신용 회사에 대출해준 은행이면서 동시에 자기 고객을 사모신용에 투자하게 한 셈입니다 — 양쪽 모두에 걸려 있는 것이죠.

패턴이 불편하게 익숙합니다: 은행이 위험한 대출을 하는 회사에 신용한도(Credit Line)를 제공하고, 그 대출이 부실화되면 손실이 사모신용 회사에만 머물지 않고 은행으로 되돌아옵니다. 2008년 이전 은행과 모기지 업체의 관계와 비슷한 피드백 루프(Feedback Loop)입니다.`,
      keyTakeaways: [
        "JPMorgan이 비은행 대출기관에 대한 1,330억 달러 익스포저를 '기타'로만 표기 — 불투명합니다",
        "지난해 사모신용에 500억 달러를 투입하고, 고객에게도 대체투자 30% 배분을 권했습니다",
        "은행이 사모대출기관에 신용한도를 제공하면 2008년과 유사한 피드백 루프가 생깁니다",
        "사모신용 부도율이 급등하면 손실이 사모신용에 머물지 않고 은행 시스템으로 번집니다",
      ],
      personalImpact: "나에게 어떤 영향이 있을까? 사모신용을 직접 보유하지 않더라도, 당신의 은행이나 연금 펀드가 보유하고 있을 수 있습니다. 상호연결성 때문에 사모신용 위기는 더 넓은 금융 시스템에 영향을 미칠 수 있습니다 — 그리고 당신의 저축에도요. 연금이 '대체투자'에 얼마나 배분했는지 확인해보세요.",
      analogy: "남에게 돈을 빌려준 사람에게 다시 돈을 빌려주는 상황을 생각해보세요. 최종 차주가 갚지 못하면 손실이 체인을 따라 거슬러 올라옵니다 — 결국 당신이 손해를 봅니다. 이제 그 금액을 1,330억 달러로 곱해보세요. 이것이 JPMorgan이 처한 상황입니다.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // Explainer for art5: IEA record reserve release
    await ctx.db.insert("explainers", {
      newsArticleId: art5,
      simplifiedTitle: "세계가 '비상 기름통'을 열었다 — 그런데 왜 유가는 안 내릴까?",
      storyBody: `전 세계 32개 나라가 모여서 "우리가 비상시를 대비해 저장해둔 석유를 풀자"고 결정했습니다. 이것을 '전략 비축유 방출'이라고 하는데, 4억 배럴 — 역사상 가장 큰 규모입니다. 2022년 러시아-우크라이나 전쟁 때 풀었던 1억 8천만 배럴의 두 배가 넘습니다.

그런데 왜 유가가 안 내릴까요? 문제는 산수입니다. 호르무즈 해협이 막혀서 매일 약 1,500만 배럴의 석유가 공급되지 못하고 있습니다. 4억 배럴을 이 속도로 쓰면 겨우 26일 만에 바닥이 납니다. 비가 새는 양동이에 물을 부어봤자 금방 비는 것과 같습니다.

설상가상으로, 사우디아라비아마저 자체 생산을 20% 줄였습니다. 세계 최대 해상 유전인 사파니야 유전을 포함한 두 곳을 폐쇄했기 때문입니다. 석유를 사는 나라들은 점점 살 곳이 줄어들고 있습니다.

미국은 급해서 전례 없는 결정을 내렸습니다: 러시아에 대한 석유 제재를 일시적으로 풀어서 러시아 원유 1,900만 배럴을 아시아 시장에 판매하도록 허용한 것입니다. 적(敵)의 석유까지 풀어야 할 만큼 상황이 심각하다는 뜻입니다.`,
      keyTakeaways: [
        "32개 나라가 비상 비축유 4억 배럴을 방출했지만, 매일 1,500만 배럴 부족분의 26일치에 불과합니다",
        "사우디아라비아가 생산을 20% 감축하면서 전 세계 공급이 더 줄었습니다",
        "미국은 러시아 원유 제재를 임시 해제할 만큼 상황이 급박합니다",
        "비축유는 '시간을 사는 것'이지 '문제를 해결하는 것'이 아닙니다 — 해협이 열려야 근본 해결",
      ],
      personalImpact: "나에게 어떤 영향이 있을까? 비축유 방출은 유가 급등 속도를 늦추지만 내리게 하지는 못합니다. 주유비와 난방비는 여전히 높고, 26일 뒤에는 비축유마저 바닥나기 시작합니다. 장을 볼 때 식품 가격이 이미 오르고 있다면 — 석유값이 원인입니다.",
      analogy: "집에 비상 식량이 한 달치 있다고 상상해보세요. 슈퍼마켓이 문을 닫아서 그 비상식량을 꺼내 먹기 시작합니다. 한 달치로 한 달은 버틸 수 있지만, 슈퍼마켓이 다시 열리지 않으면 결국 바닥이 납니다. 전략 비축유가 바로 그 '비상식량'이고, 호르무즈 해협이 그 '슈퍼마켓'입니다.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // Explainer for art6: Mojtaba Khamenei + mines
    await ctx.db.insert("explainers", {
      newsArticleId: art6,
      simplifiedTitle: "새로운 이란 지도자는 누구이고, 왜 석유길을 계속 막을까?",
      storyBody: `2월 28일 미국과 이스라엘이 이란을 공습했을 때, 37년간 이란을 이끌어온 최고지도자 알리 하메네이가 사망했습니다. 불과 9일 뒤인 3월 9일, 그의 아들 모지타바 하메네이(56세)가 새 최고지도자로 취임했습니다.

모지타바 하메네이는 취임 첫 공개 성명에서 호르무즈 해협 봉쇄를 "적에 대한 압박 도구"로 계속 유지하겠다고 선언했습니다. 쉽게 말하면, 새 지도자도 '석유 고속도로를 계속 막겠다'는 것입니다. 이 말이 나오자 유가가 4년 만에 처음으로 배럴당 $100을 넘었고, 최고 $126까지 치솟았습니다.

더 무서운 소식이 있습니다. 3월 10일, 이란이 호르무즈 해협에 '기뢰'를 설치하기 시작했다는 미군 정보가 나왔습니다. 기뢰는 바다에 떠 있는 폭탄으로, 배가 지나가면 터집니다. 미국은 이란 기뢰부설함 16척을 격침했지만, 이미 깔린 기뢰를 모두 제거하려면 수주에서 수개월이 걸립니다.

2월 28일 전쟁 시작 이후 해협 안팎에서 최소 21척의 선박이 공격받았고, 10명의 선원이 사망하거나 행방불명되었습니다. 유조선 선장들은 이제 단순히 '위험하다'가 아니라 '죽을 수 있다'고 판단하고 있어서, 봉쇄 해제 후에도 정상화에는 시간이 걸릴 것입니다.`,
      keyTakeaways: [
        "이란 신임 최고지도자 모지타바 하메네이(사망한 지도자의 아들)가 호르무즈 봉쇄 유지를 선언했습니다",
        "유가가 배럴당 $126까지 치솟았고 $80~$100 사이를 등락하고 있습니다",
        "이란이 바다에 기뢰(수중 폭탄)를 설치하기 시작해 봉쇄가 더 장기화될 수 있습니다",
        "전쟁 시작 2주 만에 21척 공격, 10명 사망/실종 — 선박 운항 재개가 어려워지고 있습니다",
      ],
      personalImpact: "나에게 어떤 영향이 있을까? 새 지도자가 봉쇄를 유지하겠다고 선언하면서 유가 하락 기대가 무너졌습니다. 기뢰 제거에는 수주~수개월이 걸리므로, 높은 유가가 오래 지속될 가능성이 높습니다. 휘발유, 가스, 항공료, 식품 가격 모두 당분간 내려올 기미가 보이지 않습니다.",
      analogy: "집 앞 유일한 다리를 막은 사람이 죽었는데, 그 아들이 와서 '아버지가 막은 이 다리, 나도 계속 막겠다'고 선언한 것과 같습니다. 게다가 다리 위에 못(기뢰)까지 박아놓아서, 바리케이드를 치워도 바로 건널 수가 없게 되었습니다.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // Explainer for art15: Morgan Stanley caps
    await ctx.db.insert("explainers", {
      newsArticleId: art15,
      simplifiedTitle: "세 번째 대형 금융사도 '돈 못 빼요' — 사모신용 도미노 시작?",
      storyBody: `블랙록에 이어 블랙스톤, 그리고 이제 Morgan Stanley까지 — 월스트리트 3대 대형 금융사가 연달아 "투자자의 돈 인출을 제한합니다"라고 발표했습니다. 무슨 일이 벌어지고 있는 걸까요?

Morgan Stanley의 North Haven Private Income Fund에서 투자자들이 전체 자산의 11%를 빼달라고 요청했습니다. 하지만 펀드 규칙에는 '분기당 최대 5%만 돌려줄 수 있다'고 적혀 있습니다. 결과적으로 약 $1.69억만 지급되었고, 돈을 빼고 싶었던 사람 중 절반 이상이 못 빼게 되었습니다.

Morgan Stanley는 "시장이 혼란할 때 자산을 급하게 팔면(투매) 모든 투자자가 손해를 보기 때문에 환매를 제한한다"고 설명합니다. 논리적으로는 맞지만, 정작 돈이 묶인 투자자 입장에서는 불안할 수밖에 없습니다.

이제 전문가들은 '사모신용 시장의 자금 유출이 최대 2년간 계속될 수 있다'고 경고합니다. 블랙록($260억), 블랙스톤($480억), Morgan Stanley에 이어 더 많은 펀드가 환매를 제한하면, 투자자들의 불안이 더 커져서 '빼려는 사람은 더 많아지고, 돌려주는 돈은 더 적어지는' 악순환이 시작될 수 있습니다.`,
      keyTakeaways: [
        "블랙록, 블랙스톤에 이어 Morgan Stanley도 사모신용 펀드 환매를 5%로 제한했습니다",
        "11% 환매 요청 중 절반 이상이 거절 — 돈을 빼고 싶어도 못 빼는 상황",
        "전문가들은 자금 유출이 최대 2년간 이어질 수 있다고 경고합니다",
        "한 곳이 제한하면 다른 곳에서도 불안이 퍼져 더 많은 환매 요청이 발생합니다 (도미노 효과)",
      ],
      personalImpact: "나에게 어떤 영향이 있을까? '대체투자' 또는 '사모신용' 펀드에 가입했다면, 환매 조건을 지금 바로 확인하세요. 3대 대형사 모두 제한을 시행 중이며, 소형 운용사는 더 심할 수 있습니다. 핵심 질문: '내 돈을 빼는 데 얼마나 걸리고, 분기별 한도는 몇 %인가?'",
      analogy: "극장에서 영화 관람 중 화재 경보가 울렸다고 생각해보세요. 출구가 있긴 하지만 한 번에 5%의 관객만 나갈 수 있습니다. 처음에는 '출구가 있으니 괜찮다'고 생각하지만, 옆 극장에서도, 그 옆 극장에서도 똑같은 일이 벌어지면 — 모든 사람이 더 빨리 나가려고 합니다. 사모신용 시장이 지금 그 상황입니다.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // Explainer for art16: $265B meltdown
    await ctx.db.insert("explainers", {
      newsArticleId: art16,
      simplifiedTitle: "사모신용 기업들의 주가가 357조 원 증발한 이유",
      storyBody: `월스트리트에서 가장 '핫한' 투자 분야였던 사모신용(Private Credit)이 무너지고 있습니다. 이 분야를 이끄는 5개 대형 기업 — 블랙스톤, KKR, 아폴로, Ares, Blue Owl — 의 주식 가치가 합쳐서 $2,650억(약 357조 원)이 날아갔습니다.

불과 1~2년 전까지 이 회사들의 주가는 로켓처럼 올랐습니다: KKR은 +103%, Blue Owl +80%, 아폴로 +77%. 투자자들은 "사모신용은 안전하면서도 높은 수익을 준다"며 열광했죠. 그런데 지난 9월부터 갑자기 폭락이 시작되었습니다. Blue Owl은 최고점 대비 3분의 2가 빠졌고, 블랙스톤과 KKR도 거의 반토막이 났습니다.

왜 갑자기 무너졌을까요? 핵심 원인은 두 가지입니다. 첫째, AI(인공지능)의 등장으로 소프트웨어 기업들의 가치가 흔들렸습니다. 사모신용 펀드들이 이런 소프트웨어 기업에 대출을 많이 해줬는데, AI가 이 기업들의 사업 모델을 위협하자 대출 부실 위험이 높아진 것입니다. 둘째, 개인 투자자들이 한꺼번에 돈을 빼기 시작했습니다. 수년간 '부자들만 하는 안전한 투자'로 마케팅했지만, 정작 위기가 오자 돈을 빼기 어렵다는 사실을 알게 된 거죠.

전문가들은 이 위기가 최소 2년은 더 이어질 수 있다고 봅니다. 이유는 세 가지: ① 환매 요청이 계속 늘고, ② 대출 품질이 악화되고 있으며, ③ 사모대출은 주식시장처럼 가격이 매일 매겨지지 않아서 진짜 손실이 아직 드러나지 않았을 수 있기 때문입니다.`,
      keyTakeaways: [
        "사모신용 5대 기업의 주가가 합쳐서 약 357조 원($2,650억) 하락했습니다",
        "1~2년 전 최고 +103%에서 현재 최대 -66%까지 — 극적인 반전입니다",
        "AI가 소프트웨어 기업을 위협하면서 사모신용 대출의 부실 위험이 높아졌습니다",
        "'안전한 투자'로 팔았지만 정작 위기 시 돈을 빼기 어렵다는 것이 드러났습니다",
        "전문가들은 2년간 지속될 '장기 유출 사이클'에 진입했다고 봅니다",
      ],
      personalImpact: "나에게 어떤 영향이 있을까? 직접 사모신용에 투자하지 않더라도, 국민연금이나 퇴직연금이 '대체투자' 비중을 늘려왔습니다. 한국 국민연금의 대체투자 비중은 약 15%이며, 사모신용도 포함됩니다. 내 노후자금이 어디에 투자되어 있는지 확인하는 것이 중요합니다.",
      analogy: "동네에서 가장 인기 있던 빵집 5곳이 동시에 적자를 냈다고 생각해보세요. '이 빵집들은 절대 안 망해'라며 투자한 사람들이 놀라서 투자금을 빼려 하지만, 빵집은 '지금은 돌려줄 수 없다'고 합니다. 빵집 주인도 자기 돈을 넣어가며 버텨보지만, 손님(환매 요청)이 계속 줄어들면 결국 더 큰 문제가 됩니다.",
      difficultyLevel: "beginner",
      updatedAt: now,
    });

    // =====================================================================
    // 6. IMPACT CHAINS (2) + IMPACT NODES — PM Feature 3
    // =====================================================================

    // Chain 1: Hormuz thread — "Iran Strikes Domino Effect"
    const chain1 = await ctx.db.insert("impactChains", {
      storyThreadId: threadHormuz,
      title: "Iran Hormuz Strait Blockade Domino Effect",
      titleKo: "이란 호르무즈 봉쇄 도미노 효과",
      description: "Cause-effect chain from Iran strikes to Korea energy crisis",
      descriptionKo: "이란 공습부터 한국 에너지 위기까지의 인과 관계 체인",
      updatedAt: now,
    });

    // Chain 1 nodes: tree structure
    const h1 = await ctx.db.insert("impactNodes", {
      chainId: chain1, label: "US-Israel strikes Iran nuclear sites", labelKo: "미국-이스라엘, 이란 핵시설 공습",
      description: "Military strikes trigger geopolitical crisis", descriptionKo: "군사 공습으로 지정학적 위기 촉발",
      newsArticleId: art1, ordinal: 1, updatedAt: now,
    });
    const h2 = await ctx.db.insert("impactNodes", {
      chainId: chain1, parentNodeId: h1, label: "Iran closes Hormuz Strait", labelKo: "이란, 호르무즈 해협 봉쇄",
      description: "20% of global oil flows through this chokepoint", descriptionKo: "세계 석유의 20%가 이 요충지를 통과",
      newsArticleId: art1, ordinal: 1, updatedAt: now,
    });
    await ctx.db.insert("impactNodes", {
      chainId: chain1, parentNodeId: h2, label: "War risk insurers cancel cover", labelKo: "전쟁 보험사, 보장 취소",
      description: "VLCC tanker rates surge 94%", descriptionKo: "VLCC 유조선 운임 94% 급등",
      newsArticleId: art2, ordinal: 1, updatedAt: now,
    });
    const h4 = await ctx.db.insert("impactNodes", {
      chainId: chain1, parentNodeId: h2, label: "Oil supply drops 20%", labelKo: "석유 공급 20% 감소",
      description: "Global energy market disruption", descriptionKo: "글로벌 에너지 시장 혼란",
      newsArticleId: art3, ordinal: 2, updatedAt: now,
    });
    await ctx.db.insert("impactNodes", {
      chainId: chain1, parentNodeId: h4, label: "Korea faces energy crisis", labelKo: "한국, 에너지 위기 직면",
      description: "Korea imports 100% of crude oil, 70% from Middle East", descriptionKo: "한국 원유 100% 수입, 70% 중동 의존",
      newsArticleId: art4, ordinal: 1, updatedAt: now,
    });

    // Chain 2: Credit thread — "Private Credit Stress Cascade"
    const chain2 = await ctx.db.insert("impactChains", {
      storyThreadId: threadCredit,
      title: "Private Credit Stress Cascade",
      titleKo: "사모신용 스트레스 연쇄",
      description: "How redemption pressure cascades through private credit markets",
      descriptionKo: "환매 압력이 사모신용 시장을 통해 연쇄적으로 퍼지는 과정",
      updatedAt: now,
    });

    // Chain 2 nodes: tree structure
    const c1 = await ctx.db.insert("impactNodes", {
      chainId: chain2, label: "BlackRock caps BDEBT redemptions at 5%", labelKo: "블랙록, BDEBT 환매 5%로 제한",
      description: "First major fund gate signals liquidity stress", descriptionKo: "첫 대형 펀드 게이트 — 유동성 스트레스 신호",
      newsArticleId: art11, ordinal: 1, updatedAt: now,
    });
    await ctx.db.insert("impactNodes", {
      chainId: chain2, parentNodeId: c1, label: "Blackstone faces 8% redemption requests", labelKo: "블랙스톤, 8% 환매 요청 직면",
      description: "Executives inject personal capital to show confidence", descriptionKo: "임원진, 신뢰 과시 위해 개인 자금 투입",
      newsArticleId: art13, ordinal: 1, updatedAt: now,
    });
    await ctx.db.insert("impactNodes", {
      chainId: chain2, parentNodeId: c1, label: "$2T bubble comparison to 2008", labelKo: "2조 달러 거품, 2008년과 비교",
      description: "Private credit grew from $500B to $2T in 5 years", descriptionKo: "사모신용 5년간 5,000억→2조 달러 성장",
      newsArticleId: art12, ordinal: 2, updatedAt: now,
    });
    await ctx.db.insert("impactNodes", {
      chainId: chain2, parentNodeId: c1, label: "JPMorgan flags $133B exposure", labelKo: "JPMorgan, 1,330억 달러 노출 경고",
      description: "Bank-shadow bank feedback loop risk", descriptionKo: "은행-그림자금융 피드백 루프 위험",
      newsArticleId: art14, ordinal: 3, updatedAt: now,
    });

    // New impact nodes for art5 and art6
    await ctx.db.insert("impactNodes", {
      chainId: chain1, parentNodeId: h4, label: "IEA releases record 400M barrels", labelKo: "IEA, 사상 최대 4억 배럴 방출",
      description: "Largest coordinated reserve release since IEA's 1974 founding — covers only 26 days of deficit", descriptionKo: "1974년 설립 이래 최대 비축유 방출 — 일일 적자분의 26일치에 불과",
      newsArticleId: art5, ordinal: 2, updatedAt: now,
    });
    await ctx.db.insert("impactNodes", {
      chainId: chain1, parentNodeId: h2, label: "New supreme leader vows continued blockade", labelKo: "신임 최고지도자, 봉쇄 유지 선언",
      description: "Mojtaba Khamenei keeps Hormuz closed; Iran begins laying naval mines", descriptionKo: "모지타바 하메네이 호르무즈 봉쇄 유지; 이란 기뢰 부설 시작",
      newsArticleId: art6, ordinal: 3, updatedAt: now,
    });

    // New impact nodes for art15 and art16
    await ctx.db.insert("impactNodes", {
      chainId: chain2, parentNodeId: c1, label: "Morgan Stanley caps redemptions at 5%", labelKo: "Morgan Stanley, 환매 5% 제한",
      description: "Third major firm restricts withdrawals — 11% requested, 45.8% fulfilled", descriptionKo: "세 번째 대형사 환매 제한 — 요청 11%중 45.8%만 충족",
      newsArticleId: art15, ordinal: 4, updatedAt: now,
    });
    await ctx.db.insert("impactNodes", {
      chainId: chain2, parentNodeId: c1, label: "$265B market cap wiped from private credit firms", labelKo: "사모신용 기업 시총 $2,650억 증발",
      description: "Blue Owl -66%, Blackstone -46%, KKR -48% from peaks", descriptionKo: "Blue Owl -66%, 블랙스톤 -46%, KKR -48% 고점 대비",
      newsArticleId: art16, ordinal: 5, updatedAt: now,
    });

    return {
      stocks: 12,
      users: 3,
      storyThreads: 2,
      newsArticles: 12,
      explainers: 12,
      impactChains: 2,
      impactNodes: 14,
    };
  },
});
