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
      <a href="https://github.com/park-kyungchan/saveticker">https://github.com/park-kyungchan/saveticker</a>
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
  <div class="section-title">기술 이해 수준 · Technical Communication Capability</div>
  <div style="font-size: 9px; color: #334155; line-height: 1.6; margin-bottom: 6px; padding: 7px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
    <strong>현재 수준:</strong> 개발 커뮤니케이션 역량은 <strong>기초적인 수준에 한정</strong>되어 있습니다. Claude Code 환경에서 TypeScript 코드의 구조와 흐름을 읽고, 데이터 스키마 정의나 API 설계 문서를 작성하여 전달하는 수준입니다. 다양한 프로그래밍 언어(Python, Go, Java 등)에 대한 이해는 아직 부족하지만, <strong>TypeScript를 첫 번째 언어로 체계적 학습을 시작</strong>하여 커뮤니케이션 품질을 점진적으로 높여가겠습니다.
  </div>
  <div class="skills-grid">
    <div>
      <div class="skill-group-title">PM 역량 (실무 수준)</div>
      <div class="skill-tags">
        <span class="skill-tag">요구사항 정의서</span>
        <span class="skill-tag">데이터 스키마 정의</span>
        <span class="skill-tag">화면 흐름 설계</span>
        <span class="skill-tag">QA 체크리스트</span>
        <span class="skill-tag">Blueprint 문서</span>
      </div>
    </div>
    <div>
      <div class="skill-group-title">개발 이해 (기초·학습 중)</div>
      <div class="skill-tags">
        <span class="skill-tag">TypeScript 읽기 (학습 중)</span>
        <span class="skill-tag">React 구조 이해</span>
        <span class="skill-tag">REST API 설계</span>
        <span class="skill-tag">Git PR 리뷰</span>
      </div>
    </div>
    <div>
      <div class="skill-group-title">AI 도구 (완전 숙달)</div>
      <div class="skill-tags">
        <span class="skill-tag">Claude Code Native Runtime</span>
        <span class="skill-tag">프롬프트 엔지니어링</span>
      </div>
    </div>
    <div>
      <div class="skill-group-title">도메인</div>
      <div class="skill-tags">
        <span class="skill-tag">미국 주식 뉴스</span>
        <span class="skill-tag">금융 리터러시</span>
        <span class="skill-tag">EN→KO 번역 QA</span>
      </div>
    </div>
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
      GitHub: <a href="https://github.com/park-kyungchan/saveticker">https://github.com/park-kyungchan/saveticker</a><br/>
      Play Store: <a href="https://play.google.com/apps/internaltest/4700569589550437120" style="color:#3b82f6;text-decoration:none;">내부 테스트 배포 (io.saveticker.prototype)</a>
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
      <li>중학 수학 교육 콘텐츠의 <strong>기획·촬영을 직접 수행</strong>하고, 편집·검수 단계에서는 미디어팀과 <strong>기획 의도를 문서로 전달·조율</strong>하는 커뮤니케이션 역할 수행</li>
      <li>복잡한 교육 과정을 <strong>촬영 가이드·편집 지시서로 구조화</strong>하여, 비전공 편집팀도 기획 의도를 정확히 구현할 수 있도록 협업 프로세스 개선</li>
      <li>학습자 진도 데이터를 분석해 콘텐츠 <strong>우선순위를 조정</strong>하고, 성과가 낮은 단원의 교재를 재설계</li>
      <li>산출물: <a href="https://drive.google.com/file/d/1TGw-NGtOovYrqPEjugCYKOOhXi7cko4B/view?usp=drive_link" style="color:#3b82f6;text-decoration:none;">교육 미디어 제작 샘플 (Google Drive)</a></li>
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

<div class="section page-break">
  <div class="section-title">독학 · 자기주도 개발 · Self-Directed Learning</div>
  <div class="exp-item">
    <div class="exp-header">
      <span class="exp-company">AI 기반 프로덕트 개발 독학</span>
      <span class="exp-period">2025.06 — 현재</span>
    </div>
    <div class="exp-role">Claude Code · TypeScript · React · Convex · Android 배포</div>
    <ul class="exp-desc">
      <li>Claude Code(AI 코딩 에이전트)를 활용한 <strong>프로덕트 프로토타이핑 워크플로우</strong> 구축 — "기획 → 온톨로지 모델링 → 구현 → QA → 배포"의 전 과정을 1인 주도</li>
      <li>데이터 모델 정의, API 스키마, 화면 흐름을 <strong>구조화된 문서(Blueprint)</strong>로 작성한 뒤 코드로 구현 — PM이 기획서를 쓰고 개발팀에 전달하는 과정을 1인 체제로 시뮬레이션</li>
      <li>금융 뉴스 도메인의 엔티티 관계(Stock↔NewsArticle↔StoryThread), 번역 파이프라인(EN→KO 직역/의역), 사용자 맞춤 필터링 등 <strong>SAVE 서비스에 직접 적용 가능한 기획 사고</strong>를 프로토타입으로 증명</li>
      <li>Google Play Store 내부 테스트 트랙 배포까지 완료 — 기획 의도를 <strong>실제 Android 디바이스에서 검증</strong>하고, 피드백을 반영해 12번의 반복 배포 (versionCode 15→26)</li>
      <li>교육 기획의 <strong>"사용자 수준에 맞는 콘텐츠 설계"</strong>를 금융 도메인에 적용: 원본(투자자용) → 한국어(일반 독자용) → StoryTelling(금융 초보자/노인용) 3단계 분리</li>
    </ul>
  </div>
</div>

<div class="section">
  <div class="section-title">온톨로지 연구 · Ontology Research (진행 중)</div>
  <div style="font-size: 9px; color: #334155; line-height: 1.6; padding: 8px 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 6px;">
    <strong>Palantir Ontology 아키텍처를 독자적으로 연구</strong>하고, 이를 프로토타입에 적용 중입니다. 온톨로지는 '데이터베이스 스키마'가 아니라 <strong>'의사결정 중심의 운영 체제'</strong>입니다 — 현실 세계의 상태(DATA), 그 상태를 해석하는 방법(LOGIC), 현실을 변화시키는 레버(ACTION)를 3개 도메인으로 분리하고, SENSE→DECIDE→ACT→LEARN 피드백 루프로 지속 개선합니다.
  </div>
  <ul class="exp-desc">
    <li><strong>4-Fold 도메인 모델:</strong> DATA(현실의 상태) / LOGIC(해석·추론) / ACTION(실행·변경) / SECURITY(접근 제어 오버레이)의 의미론적 분류를 연구하고, 742개 테스트(5,208 assertion)로 검증하는 스키마 시스템을 구축</li>
    <li><strong>Tribal Knowledge 인코딩:</strong> 전문가의 암묵적 의사결정 패턴(예: "이 데이터가 DATA인가 LOGIC인가?")을 DecisionHeuristic/HardConstraint 상수로 형식화 — 세션 간 일관성을 보장하는 K-LLM 합의 메커니즘</li>
    <li><strong>Digital Twin 피드백 루프:</strong> "기획 → 모델링 → 구현 → 검증 → 개선"의 반복 과정 자체가 SENSE→DECIDE→ACT→LEARN 루프의 구현임을 증명</li>
    <li><strong>TypeScript + Bun 단일 스택:</strong> 모든 코드(스키마 정의, 테스트, 빌드 도구, 배포 스크립트, PDF 생성까지)를 TypeScript/Bun으로 통일. 불가피하게 다른 언어가 필요한 경우(예: Playwright의 Python CLI) Bun에서 호출하는 래퍼 함수로 처리</li>
  </ul>
  </div>
</div>

<!-- ════════════════ PAGE 2 START: 학력 + 지원동기 ════════════════ -->

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
  <p>SaveTicker 프로토타입에 관한 저의 생각들은, 이번에 포트폴리오를 준비하면서 방향을 고민해 본 <strong>매우 초기 단계의 PM 관점</strong>입니다. 확정된 방향이 아니라, SAVE 서비스를 사용하고 프로토타입을 만들면서 느낀 가능성을 정리한 것입니다.</p>
  <p>수학을 가르치면서 깨달은 것이 있습니다: <strong>복잡한 것을 사용자 수준에 맞게 재구성하는 능력</strong>이 가장 어렵고, 가장 가치 있다는 것입니다. 한국에서 금융 교육은 사실상 전무하고, 대부분의 한국인은 해외 금융 뉴스를 접해도 맥락을 이해하지 못합니다. SAVE가 이 간극을 메우고 있다고 생각하며, 저는 SaveTicker 프로토타입에서 3단계 콘텐츠 파이프라인(원본 → 한국어 → StoryTelling)을 설계하며 가능성을 탐색했습니다.</p>
  <p><strong>PM으로서의 관점:</strong> 금융 문맹을 위한 상세하고 쉬운 맥락 제공이 강화되면, 현재 20~40대 중심의 사용자층이 50~70대 시니어까지 확장될 수 있다고 봅니다. 한국의 50대 이상 인구는 2,000만 명을 넘고 퇴직 후 자산 운용 수요는 급증하지만, 접근 가능한 금융 정보 서비스는 제한적입니다. 이것이 제가 StoryTelling 탭을 '금융 초보자/노인용'으로 설계한 이유입니다.</p>
  <p>다만 이런 방향성은 SAVE 팀의 비전, 기술적 우선순위, 시장 상황에 따라 달라질 수 있습니다. <strong>SAVE 관계자분들과 지속적으로 소통하면서</strong>, 서비스의 현재 방향을 깊이 이해하고, 제 관점을 조율해가며, 팀이 가장 필요로 하는 곳에서 기여하겠습니다.</p>
</div>


<!-- ════════════════ PAGE 3: English (synced with KO) ════════════════ -->
<div class="page-break en-section">
  <div class="header">
    <img src="${photoDataUrl}" class="photo" alt="Kyungchan Park" />
    <div class="header-info">
      <div class="header-name">Kyungchan Park</div>
      <div class="header-target">Product Manager — SAVE</div>
      <div class="header-contact">
        <span>+82 10-2313-4835</span>
        <span>packr0723@gmail.com</span>
        <a href="https://github.com/park-kyungchan/saveticker">https://github.com/park-kyungchan/saveticker</a>
      </div>
      <div class="header-summary">
        Transitioning from education content planner to AI-powered product builder. Structuring complex financial news, designing user-centric information flows, and validating product decisions through working prototypes.
      </div>
    </div>
  </div>

  <!-- Technical Communication — synced with KO p1 -->
  <div class="section">
    <div class="section-title">Technical Communication Level</div>
    <div style="font-size: 8.5px; color: #334155; line-height: 1.55; margin-bottom: 6px; padding: 6px 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 5px;">
      <strong>Currently at a foundational level.</strong> Can read TypeScript code structure in the Claude Code environment, and write data schema definitions and API design docs for dev handoff. Understanding of other languages (Python, Go, Java) is still limited. <strong>Plan:</strong> Starting systematic TypeScript learning as a first language to progressively improve dev communication quality.
    </div>
    <div class="skills-grid">
      <div>
        <div class="skill-group-title">PM (Working Level)</div>
        <div class="skill-tags">
          <span class="skill-tag">Requirements Docs</span>
          <span class="skill-tag">Data Schema Design</span>
          <span class="skill-tag">Screen Flows</span>
          <span class="skill-tag">QA Checklists</span>
          <span class="skill-tag">Blueprint Docs</span>
        </div>
      </div>
      <div>
        <div class="skill-group-title">Dev Understanding (Foundational)</div>
        <div class="skill-tags">
          <span class="skill-tag">TypeScript (learning)</span>
          <span class="skill-tag">React structure</span>
          <span class="skill-tag">REST API design</span>
          <span class="skill-tag">Git PR review</span>
        </div>
      </div>
      <div>
        <div class="skill-group-title">AI Tools (Fully Proficient)</div>
        <div class="skill-tags">
          <span class="skill-tag">Claude Code Native Runtime</span>
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

  <!-- Portfolio — synced with KO -->
  <div class="section">
    <div class="section-title">Portfolio Project</div>
    <div class="project-card">
      <div class="project-title">SaveTicker — Financial News Literacy Prototype</div>
      <div class="project-subtitle">Personal Project · Jun 2025 — Present · PM-perspective feature proposals for SAVE service</div>
      <div class="project-tech">
        <span class="tech-tag">React 19</span>
        <span class="tech-tag">TypeScript</span>
        <span class="tech-tag">Convex (serverless)</span>
        <span class="tech-tag">Capacitor 8 (Android)</span>
        <span class="tech-tag">Tailwind CSS v4</span>
        <span class="tech-tag">Zustand</span>
        <span class="tech-tag">Claude Code</span>
      </div>
      <ul class="project-features">
        <li><strong>Story Threads:</strong> Groups breaking news (Hormuz/Private Credit) into chronological timelines with tag-based auto-filtering</li>
        <li><strong>3-Tab News Detail:</strong> Original (EN) → Korean (faithful + adapted) → StoryTelling (beginner-friendly). Target-separated content</li>
        <li><strong>Translation QA Pipeline:</strong> AI → PM Review → Approved — 3-stage quality assurance with block-level comparison</li>
        <li><strong>Impact Chain:</strong> Domino-effect cause-to-result tree for connected news events</li>
        <li><strong>Data Model:</strong> 4 entities + 7 tables, ontology-based DATA/LOGIC/ACTION separation</li>
        <li><strong>Deployed:</strong> Google Play Store internal testing (v3.5.0)</li>
      </ul>
    </div>
  </div>

  <!-- Experience — synced with KO (3 companies) -->
  <div class="section">
    <div class="section-title">Experience</div>
    <div class="exp-item">
      <div class="exp-header">
        <span class="exp-company">FirstHabit — Content Planning / QA</span>
        <span class="exp-period">Dec 2024 — May 2025</span>
      </div>
      <ul class="exp-desc">
        <li><strong>Planned and filmed</strong> content directly; <strong>coordinated editing/QA with media team</strong> through structured briefs</li>
        <li>Translated curricula into <strong>filming guides and editing directives</strong> for non-specialist editors</li>
        <li>Analyzed learner data to reprioritize content and redesign underperforming modules</li>
        <li>Output: <a href="https://drive.google.com/file/d/1TGw-NGtOovYrqPEjugCYKOOhXi7cko4B/view?usp=drive_link" style="color:#3b82f6;text-decoration:none;">Education media sample (Google Drive)</a></li>
      </ul>
    </div>
    <div class="exp-item">
      <div class="exp-header">
        <span class="exp-company">MFA Math Academy — Education Service Planning</span>
        <span class="exp-period">Mar 2024 — Dec 2024</span>
      </div>
      <ul class="exp-desc">
        <li>Personalized learning paths: diagnosis → custom curriculum → weekly feedback loop</li>
        <li>Content development and QA with version-controlled revision process</li>
        <li>Stakeholder communication through structured parent progress reports</li>
      </ul>
    </div>
    <div class="exp-item">
      <div class="exp-header">
        <span class="exp-company">AllMighty Campus / Mathssabu Academy</span>
        <span class="exp-period">Jun 2023 — Mar 2024</span>
      </div>
      <ul class="exp-desc">
        <li>Exam strategy and student-specific <strong>roadmap design</strong> — goal-backward scheduling</li>
        <li>Self-produced teaching materials with internal QA process</li>
      </ul>
    </div>
  </div>

  <!-- Self-Directed Learning — synced with KO -->
  <div class="section">
    <div class="section-title">Self-Directed Learning</div>
    <div class="exp-item">
      <div class="exp-header">
        <span class="exp-company">AI-Powered Product Development</span>
        <span class="exp-period">Jun 2025 — Present</span>
      </div>
      <ul class="exp-desc">
        <li>Built fintech prototype solo using Claude Code — "planning → ontology modeling → implementation → QA → deployment" end-to-end</li>
        <li>Wrote structured Blueprints before code — simulating PM→Dev handoff as a solo operator</li>
        <li>SAVE-applicable domain work: entity relationships, EN→KO translation pipeline, user-personalized filtering</li>
        <li>12 iterative Play Store releases (versionCode 15→26) — validating planning intent on real Android devices</li>
        <li>Applied education pedagogy to finance: Original (investors) → Korean (general) → StoryTelling (beginners/elderly) 3-tier pipeline</li>
      </ul>
    </div>
  </div>

  <!-- Ontology Research — synced with KO (separate section) -->
  <div class="section">
    <div class="section-title">Ontology Research (Ongoing)</div>
    <div style="font-size: 8.5px; color: #334155; line-height: 1.55; margin-bottom: 5px; padding: 6px 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 5px;">
      <strong>Independently researching Palantir Ontology architecture.</strong> The ontology is not a database schema — it is a <strong>decision-centric operating system</strong>: DATA (state of reality), LOGIC (how to reason), ACTION (levers to change reality), governed by a SENSE→DECIDE→ACT→LEARN feedback loop.
    </div>
    <ul class="exp-desc">
      <li><strong>4-Fold Domain Model:</strong> semantic classification of DATA/LOGIC/ACTION/SECURITY, validated by 742 tests (5,208 assertions)</li>
      <li><strong>Tribal Knowledge Encoding:</strong> expert decision patterns formalized as DecisionHeuristic/HardConstraint constants — K-LLM consensus mechanism</li>
      <li><strong>Digital Twin Loop:</strong> the iterative "plan → model → build → verify → improve" process itself implements SENSE→DECIDE→ACT→LEARN</li>
      <li><strong>TypeScript + Bun single-stack:</strong> all code (schemas, tests, build tools, deploy scripts, PDF generation) unified under TS/Bun</li>
    </ul>
  </div>

  <!-- Education — synced with KO -->
  <div class="section">
    <div class="section-title">Education</div>
    <div class="edu-line">
      <span class="edu-school">Chonnam National University — Mathematics Education</span>
      <span class="exp-period">2012 — 2019</span>
    </div>
    <div class="edu-detail">Bachelor's Degree · GPA 3.5 / 4.5</div>
  </div>

  <!-- Why SAVE — synced with KO -->
  <div class="section why-save">
    <div class="section-title">Why SAVE</div>
    <p>My thoughts on the SaveTicker prototype are at a <strong>very early PM stage</strong>, shaped while preparing this portfolio. They are not fixed directions but possibilities explored through building and using the SAVE service.</p>
    <p><strong>As a PM:</strong> If detailed, easy-to-understand context is strengthened for financial beginners, the current 20–40 user base could expand to 50–70 senior investors. Korea's 50+ population exceeds 20 million, and post-retirement investment demand is surging — yet accessible financial information services remain scarce.</p>
    <p>These directions may evolve with the SAVE team's vision, technical priorities, and market context. I aim to <strong>continuously communicate with the SAVE team</strong>, deeply understand the current direction, calibrate my perspective, and contribute where the team needs me most.</p>
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
