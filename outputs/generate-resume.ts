/**
 * SAVE PM 이력서 PDF 생성 — HTML→PDF via Playwright.
 * 한국어 2p + English 1p = 총 3p.
 */
import { readFileSync } from "fs";

const photoPath = "/home/palantirkc/saveticker/pkc.jpg";
const photoBase64 = readFileSync(photoPath).toString("base64");
const photoDataUrl = `data:image/jpeg;base64,${photoBase64}`;

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<style>
  @page { size: A4; margin: 20mm 18mm 16mm 18mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Noto Sans CJK KR', 'Noto Sans KR', sans-serif;
    color: #1a1a1a;
    line-height: 1.55;
    font-size: 9.5px;
  }

  /* ─── Header ─── */
  .header {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 2px solid #0f172a;
  }
  .photo {
    width: 80px; height: 100px;
    border-radius: 5px; object-fit: cover;
    border: 1px solid #e2e8f0; flex-shrink: 0;
  }
  .header-info { flex: 1; }
  .header-name { font-size: 20px; font-weight: 700; color: #0f172a; }
  .header-target { font-size: 11px; color: #3b82f6; font-weight: 600; margin-top: 1px; }
  .header-contact {
    display: flex; gap: 14px; margin-top: 6px;
    font-size: 9px; color: #475569;
  }
  .header-contact a { color: #3b82f6; text-decoration: none; }
  .header-summary {
    margin-top: 6px; font-size: 9.5px; color: #334155;
    line-height: 1.6; max-width: 430px;
  }

  /* ─── Sections ─── */
  .section { margin-bottom: 12px; }
  .section-title {
    font-size: 10px; font-weight: 700; color: #0f172a;
    text-transform: uppercase; letter-spacing: 0.07em;
    padding-bottom: 4px; border-bottom: 1.5px solid #e2e8f0;
    margin-bottom: 8px;
  }

  /* ─── Experience ─── */
  .exp-item { margin-bottom: 8px; }
  .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
  .exp-company { font-size: 10.5px; font-weight: 700; color: #1e293b; }
  .exp-period { font-size: 8.5px; color: #64748b; white-space: nowrap; }
  .exp-role { font-size: 9px; color: #3b82f6; font-weight: 600; margin-top: 1px; }
  .exp-desc { margin-top: 3px; padding-left: 11px; }
  .exp-desc li {
    font-size: 9px; color: #334155; line-height: 1.55;
    margin-bottom: 1px; list-style: none; position: relative;
  }
  .exp-desc li::before {
    content: '\\2022'; position: absolute; left: -9px; color: #94a3b8;
  }

  /* ─── Project card ─── */
  .project-card {
    background: #f8fafc; border: 1px solid #e2e8f0;
    border-radius: 7px; padding: 10px 12px; margin-bottom: 8px;
  }
  .project-title { font-size: 11px; font-weight: 700; color: #0f172a; }
  .project-subtitle { font-size: 8.5px; color: #64748b; margin-top: 1px; }
  .project-tech { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 5px; }
  .tech-tag {
    font-size: 7.5px; padding: 1.5px 5px; border-radius: 3px;
    background: #e0f2fe; color: #0369a1; font-weight: 600;
  }
  .project-features { margin-top: 6px; padding-left: 11px; }
  .project-features li {
    font-size: 9px; color: #334155; line-height: 1.55;
    margin-bottom: 1px; list-style: none; position: relative;
  }
  .project-features li::before {
    content: '\\25B8'; position: absolute; left: -9px; color: #3b82f6; font-size: 7.5px;
  }
  .project-links { margin-top: 5px; font-size: 8.5px; color: #64748b; }
  .project-links a { color: #3b82f6; text-decoration: none; }

  /* ─── Strengths ─── */
  .strengths { display: flex; gap: 5px; margin-top: 3px; flex-wrap: wrap; }
  .strength-badge {
    font-size: 8px; padding: 2.5px 7px; border-radius: 4px;
    background: #eff6ff; color: #1d4ed8; font-weight: 600; border: 1px solid #bfdbfe;
  }

  /* ─── Skills grid ─── */
  .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .skill-group-title { font-size: 8.5px; font-weight: 700; color: #475569; margin-bottom: 2px; }
  .skill-tags { display: flex; flex-wrap: wrap; gap: 3px; }
  .skill-tag {
    font-size: 8px; padding: 1.5px 5px; border-radius: 3px;
    background: #f1f5f9; color: #475569;
  }

  /* ─── Education ─── */
  .edu-line { display: flex; justify-content: space-between; font-size: 9.5px; }
  .edu-school { font-weight: 600; color: #1e293b; }
  .edu-detail { font-size: 8.5px; color: #64748b; }

  /* ─── Page breaks ─── */
  .page-break { page-break-before: always; }

  /* ─── English page ─── */
  .en-section { font-family: 'Segoe UI', 'Noto Sans CJK KR', Arial, sans-serif; }
  .en-section .header-name { font-size: 22px; }

  /* ─── Why SAVE ─── */
  .why-save p { font-size: 9.5px; color: #334155; line-height: 1.65; }
  .why-save p + p { margin-top: 5px; }
</style>
</head>
<body>

<!-- ════════════════ PAGE 1: 한국어 상반부 ════════════════ -->
<div class="header">
  <img src="${photoDataUrl}" class="photo" alt="박경찬" />
  <div class="header-info">
    <div class="header-name">박경찬</div>
    <div class="header-target">Product Manager 지원 — SAVE</div>
    <div class="header-contact">
      <span>010-2313-4835</span>
      <span>packr0723@gmail.com</span>
      <a href="https://github.com/park-kyungchan/saveticker">github.com/park-kyungchan/saveticker</a>
    </div>
    <div class="header-summary">
      수학교육 콘텐츠 기획자에서 AI 기반 프로덕트 빌더로 전환 중입니다. 복잡한 금융 뉴스를 구조화하고, 사용자 관점에서 정보 흐름을 설계하며, 실제 동작하는 프로토타입으로 기획 의도를 검증하는 PM을 지향합니다.
    </div>
  </div>
</div>

<div class="section">
  <div class="section-title">핵심 역량 · Core Strengths</div>
  <div class="strengths">
    <span class="strength-badge">서비스 기획 · 콘텐츠 구조화</span>
    <span class="strength-badge">금융 뉴스 도메인 이해</span>
    <span class="strength-badge">QA · 품질 관리</span>
    <span class="strength-badge">개발 커뮤니케이션</span>
    <span class="strength-badge">AI 도구 활용 프로토타이핑</span>
  </div>
</div>

<div class="section">
  <div class="section-title">포트폴리오 프로젝트 · Portfolio Project</div>
  <div class="project-card">
    <div class="project-title">SaveTicker — 금융 뉴스 리터러시 프로토타입</div>
    <div class="project-subtitle">개인 프로젝트 · 2025.06 ~ 현재 · SAVE 서비스에 대한 PM 관점의 기능 제안</div>
    <div class="project-tech">
      <span class="tech-tag">React 19</span>
      <span class="tech-tag">TypeScript</span>
      <span class="tech-tag">Convex (서버리스)</span>
      <span class="tech-tag">Capacitor 8 (Android)</span>
      <span class="tech-tag">Tailwind CSS v4</span>
      <span class="tech-tag">Zustand</span>
      <span class="tech-tag">Claude Code (AI 협업)</span>
    </div>
    <ul class="project-features">
      <li><strong>스토리 스레드:</strong> 호르무즈 해협/사모신용 등 연속 이슈를 타임라인으로 묶어 맥락 추적. 사용자별 관심 태그 기반 자동 필터링</li>
      <li><strong>3탭 뉴스 상세:</strong> 원본(EN) → 한국어(직역+의역) → StoryTelling(금융 초보자용 쉬운 해설). 타겟별 콘텐츠 분리 설계</li>
      <li><strong>번역 QA 파이프라인:</strong> AI 번역 → PM 대조 검수 → 검수 완료의 3단계 품질 관리 프로세스 시각화</li>
      <li><strong>인과관계 체인:</strong> 뉴스 이벤트 간 도미노 영향 시각화 (원인 → 결과 트리 구조)</li>
      <li><strong>데이터 모델:</strong> 4개 엔티티 + 7 테이블, 온톨로지 기반 DATA/LOGIC/ACTION 분리</li>
      <li><strong>배포:</strong> Google Play Store 내부 테스트 트랙 배포 완료 (v3.5.0)</li>
    </ul>
    <div class="project-links">
      GitHub: <a href="https://github.com/park-kyungchan/saveticker">park-kyungchan/saveticker</a> ·
      Play Store: 내부 테스트 배포 (io.saveticker.prototype)
    </div>
  </div>
</div>

<div class="section">
  <div class="section-title">경력 · Experience</div>

  <div class="exp-item">
    <div class="exp-header">
      <span class="exp-company">퍼스트해빗</span>
      <span class="exp-period">2024.12 — 2025.05 (6개월)</span>
    </div>
    <div class="exp-role">콘텐츠 기획 / QA · 사원</div>
    <ul class="exp-desc">
      <li>중학 수학 교육 콘텐츠의 <strong>기획-촬영-편집-검수</strong> 전 과정을 주도, 기획 의도와 실제 콘텐츠 간 차이를 점검하는 QA 역할 수행</li>
      <li><strong>복잡한 교육 과정을 구조화하고 문서로 정리</strong>하여 촬영팀·편집팀과의 협업 효율을 개선</li>
      <li>학습자 진도 데이터를 분석해 콘텐츠 <strong>우선순위를 조정</strong>하고, 성과가 낮은 단원의 교재를 재설계</li>
    </ul>
  </div>

  <div class="exp-item">
    <div class="exp-header">
      <span class="exp-company">일곡 MFA 수학학원</span>
      <span class="exp-period">2024.03 — 2024.12 (10개월)</span>
    </div>
    <div class="exp-role">교육 서비스 기획 · 수학 강사</div>
    <ul class="exp-desc">
      <li>학생 개인별 진단 → 맞춤 커리큘럼 설계 → 주간 피드백 루프: <strong>사용자(학생) 중심 서비스 운영</strong> 경험</li>
      <li>교재 및 시험지 <strong>콘텐츠 개발·QA</strong> — 오류 발견 시 즉각 수정 및 버전 관리</li>
      <li>학부모 상담을 통한 <strong>이해관계자 커뮤니케이션</strong> 및 학습 성과 리포팅</li>
    </ul>
  </div>

  <div class="exp-item">
    <div class="exp-header">
      <span class="exp-company">올마이티캠퍼스 / 수학싸부 미사학원</span>
      <span class="exp-period">2023.06 — 2024.03 (11개월)</span>
    </div>
    <div class="exp-role">수학 강사 · 입시 컨설팅</div>
    <ul class="exp-desc">
      <li>입시 전략 수립 및 학생별 <strong>로드맵 설계</strong> — 목표 역산 방식의 일정 관리</li>
      <li>수능/내신 교재 <strong>자체 제작 및 검수</strong> 프로세스 운영</li>
    </ul>
  </div>
</div>

<div class="section">
  <div class="section-title">독학 · 자기주도 개발 · Self-Directed Learning</div>
  <div class="exp-item">
    <div class="exp-header">
      <span class="exp-company">AI 기반 프로덕트 개발 독학</span>
      <span class="exp-period">2025.06 — 현재</span>
    </div>
    <div class="exp-role">Claude Code · TypeScript · React · Convex · Android 배포</div>
    <ul class="exp-desc">
      <li>Claude Code(AI 코딩 에이전트)를 활용한 <strong>프로덕트 프로토타이핑 워크플로우</strong> 구축 — "기획 → 모델링 → 구현 → 배포"를 1인 주도</li>
      <li>데이터 모델, API 스키마, 화면 흐름을 <strong>구조화된 문서(Blueprint)</strong>로 작성한 뒤 코드로 구현하는 과정 반복</li>
      <li>금융 뉴스 도메인의 엔티티 관계, 번역 파이프라인, 사용자 맞춤 필터링 등 <strong>SAVE 서비스에 직접 적용 가능한 기획 사고</strong>를 프로토타입으로 증명</li>
      <li>Google Play Store 내부 테스트 트랙 배포까지 완료 — 기획 의도를 <strong>실제 디바이스에서 검증</strong></li>
    </ul>
  </div>
</div>

<!-- ════════════════ PAGE 2 START: 기술 + 학력 + 지원동기 ════════════════ -->

<div class="section">
  <div class="section-title">기술 스택 · Technical Skills</div>
  <div class="skills-grid">
    <div>
      <div class="skill-group-title">PM 도구</div>
      <div class="skill-tags">
        <span class="skill-tag">요구사항 정의서</span>
        <span class="skill-tag">데이터 정의</span>
        <span class="skill-tag">화면 흐름 설계</span>
        <span class="skill-tag">QA 체크리스트</span>
        <span class="skill-tag">Blueprint 문서</span>
      </div>
    </div>
    <div>
      <div class="skill-group-title">개발 이해</div>
      <div class="skill-tags">
        <span class="skill-tag">TypeScript</span>
        <span class="skill-tag">React</span>
        <span class="skill-tag">REST API / 서버리스</span>
        <span class="skill-tag">Git/GitHub</span>
        <span class="skill-tag">Android 빌드</span>
      </div>
    </div>
    <div>
      <div class="skill-group-title">AI 도구</div>
      <div class="skill-tags">
        <span class="skill-tag">Claude Code</span>
        <span class="skill-tag">AI 코딩 에이전트</span>
        <span class="skill-tag">프롬프트 엔지니어링</span>
      </div>
    </div>
    <div>
      <div class="skill-group-title">도메인</div>
      <div class="skill-tags">
        <span class="skill-tag">미국 주식 뉴스</span>
        <span class="skill-tag">금융 리터러시</span>
        <span class="skill-tag">EN→KO 번역 QA</span>
        <span class="skill-tag">교육 콘텐츠</span>
      </div>
    </div>
  </div>
</div>

<div class="section">
  <div class="section-title">학력 · Education</div>
  <div class="edu-line">
    <span class="edu-school">전남대학교 (광주) — 수학교육과</span>
    <span class="exp-period">2012.02 — 2019.02</span>
  </div>
  <div class="edu-detail">학사 졸업 · 학점 3.5 / 4.5</div>
</div>

<div class="section why-save">
  <div class="section-title">지원 동기 · Why SAVE</div>
  <p>수학을 가르치면서 깨달은 것이 있습니다: <strong>복잡한 것을 쉽게 설명하는 능력이 가장 어렵고, 가장 가치 있다</strong>는 것입니다. SAVE가 해외 금융 뉴스를 한국 투자자에게 전달하는 과정은, 제가 수학 개념을 학생 수준에 맞게 재구성하던 과정과 본질적으로 같습니다.</p>
  <p>SaveTicker 프로토타입은 이 확신을 코드로 증명한 결과물입니다. 원본(EN) → 한국어(직역+의역) → StoryTelling(초보자용 해설)의 3단계 콘텐츠 파이프라인, 번역 QA 프로세스, 스토리 스레드를 통한 맥락 추적 기능은 <strong>SAVE 서비스에 대한 구체적인 기능 제안</strong>입니다.</p>
  <p>교육 기획자로서 쌓은 <strong>콘텐츠 구조화 역량</strong>과, 독학으로 검증한 <strong>개발자와의 커뮤니케이션 능력</strong>, 그리고 금융 뉴스 도메인에 대한 <strong>실사용 경험</strong>을 바탕으로, SAVE의 제품 품질을 한 단계 높이는 데 기여하고 싶습니다.</p>
</div>


<!-- ════════════════ PAGE 3: English ════════════════ -->
<div class="page-break en-section">
  <div class="header">
    <img src="${photoDataUrl}" class="photo" alt="Kyungchan Park" />
    <div class="header-info">
      <div class="header-name">Kyungchan Park</div>
      <div class="header-target">Product Manager — SAVE</div>
      <div class="header-contact">
        <span>+82 10-2313-4835</span>
        <span>packr0723@gmail.com</span>
        <a href="https://github.com/park-kyungchan/saveticker">github.com/park-kyungchan/saveticker</a>
      </div>
      <div class="header-summary">
        Transitioning from education content planner to AI-powered product builder. Structuring complex financial news, designing user-centric information flows, and validating product decisions through working prototypes.
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Portfolio Project</div>
    <div class="project-card">
      <div class="project-title">SaveTicker — Financial News Literacy Prototype</div>
      <div class="project-subtitle">Personal Project · Jun 2025 — Present · PM-perspective feature proposals for SAVE service</div>
      <div class="project-tech">
        <span class="tech-tag">React 19</span>
        <span class="tech-tag">TypeScript</span>
        <span class="tech-tag">Convex</span>
        <span class="tech-tag">Capacitor (Android)</span>
        <span class="tech-tag">Claude Code</span>
      </div>
      <ul class="project-features">
        <li><strong>Story Threads:</strong> Groups breaking news into chronological timelines with user-personalized tag filtering</li>
        <li><strong>3-Tab News Detail:</strong> Original (EN) → Korean (faithful + adapted) → StoryTelling (beginner-friendly)</li>
        <li><strong>Translation QA Pipeline:</strong> AI → PM Review → Approved — 3-stage quality assurance with block-level comparison</li>
        <li><strong>Impact Chain:</strong> Domino-effect cause-to-result tree for connected news events</li>
        <li><strong>Deployed:</strong> Google Play Store internal testing (v3.5.0, versionCode 26)</li>
      </ul>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Experience</div>
    <div class="exp-item">
      <div class="exp-header">
        <span class="exp-company">FirstHabit — Content Planning / QA</span>
        <span class="exp-period">Dec 2024 — May 2025</span>
      </div>
      <ul class="exp-desc">
        <li>Led end-to-end content pipeline: planning, filming, editing, and QA for math education media</li>
        <li>Structured complex curricula into documentation for cross-team collaboration</li>
        <li>Analyzed learner data to reprioritize content and redesign underperforming modules</li>
      </ul>
    </div>
    <div class="exp-item">
      <div class="exp-header">
        <span class="exp-company">MFA Math Academy — Education Service Planning</span>
        <span class="exp-period">Mar 2024 — Dec 2024</span>
      </div>
      <ul class="exp-desc">
        <li>Designed personalized learning paths: diagnosis → custom curriculum → weekly feedback loop</li>
        <li>Developed and QA'd educational materials with version-controlled revision process</li>
        <li>Managed stakeholder communication through structured parent progress reports</li>
      </ul>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Self-Directed Learning</div>
    <div class="exp-item">
      <div class="exp-header">
        <span class="exp-company">AI-Powered Product Development</span>
        <span class="exp-period">Jun 2025 — Present</span>
      </div>
      <ul class="exp-desc">
        <li>Built production-grade fintech prototype solo using Claude Code — from ontology modeling to Play Store deployment</li>
        <li>Wrote structured Blueprints (data models, API schemas, screen flows) before implementation — PM-first approach</li>
        <li>Demonstrated domain expertise in US stock news, EN→KO translation pipelines, and filtering directly applicable to SAVE</li>
      </ul>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Education</div>
    <div class="edu-line">
      <span class="edu-school">Chonnam National University — Mathematics Education</span>
      <span class="exp-period">2012 — 2019</span>
    </div>
    <div class="edu-detail">Bachelor's Degree · GPA 3.5 / 4.5</div>
  </div>

  <div class="section">
    <div class="section-title">Technical Skills</div>
    <div class="skills-grid">
      <div>
        <div class="skill-group-title">PM Tools</div>
        <div class="skill-tags">
          <span class="skill-tag">Requirements Docs</span>
          <span class="skill-tag">Data Definitions</span>
          <span class="skill-tag">Screen Flow Design</span>
          <span class="skill-tag">QA Checklists</span>
        </div>
      </div>
      <div>
        <div class="skill-group-title">Technical</div>
        <div class="skill-tags">
          <span class="skill-tag">TypeScript</span>
          <span class="skill-tag">React</span>
          <span class="skill-tag">Git/GitHub</span>
          <span class="skill-tag">REST API</span>
        </div>
      </div>
      <div>
        <div class="skill-group-title">AI Tools</div>
        <div class="skill-tags">
          <span class="skill-tag">Claude Code</span>
          <span class="skill-tag">Prompt Engineering</span>
        </div>
      </div>
      <div>
        <div class="skill-group-title">Domain</div>
        <div class="skill-tags">
          <span class="skill-tag">US Stock News</span>
          <span class="skill-tag">Financial Literacy</span>
          <span class="skill-tag">EN→KO Translation QA</span>
        </div>
      </div>
    </div>
  </div>
</div>

</body>
</html>`;

const htmlPath = "/home/palantirkc/saveticker/outputs/resume.html";
await Bun.write(htmlPath, html);
console.log("HTML written: " + htmlPath);

const proc = Bun.spawn([
  "python3", "-c", `
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("file:///home/palantirkc/saveticker/outputs/resume.html")
    page.wait_for_load_state("networkidle")
    page.pdf(
        path="/home/palantirkc/saveticker/outputs/이력서_박경찬_SAVE_PM.pdf",
        format="A4",
        print_background=True,
    )
    browser.close()
    print("PDF generated successfully")
`
]);
const output = await new Response(proc.stdout).text();
console.log(output);
