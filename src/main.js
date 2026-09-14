import { nationEmblem } from "./nationEmblems.js";
import { elementIcon } from "./elementIcons.js";
import { marked } from "marked";
import DOMPurify from "dompurify";
import raw from "../이그니아_통합문서.md?raw";
import {
  parseCodex,
  getPending,
  getTable,
  cleanText,
  getMagicSystem,
  getAttributes,
  getGrades,
  getNations,
  getEras,
  getTurnRules,
  getFunModes,
  getCodexStats,
} from "./content.js";
import { mountIslands } from "./islandManager.js";
import { topic } from "./visuals/palette.js";
import "./style.css";

const parts = parseCodex(raw);
const pending = getPending(parts);
// Everything the visual islands draw is read from the source document.
const codex = {
  magic: getMagicSystem(parts),
  attributes: getAttributes(parts),
  grades: getGrades(parts),
  nations: getNations(parts),
  eras: getEras(parts),
  turn: getTurnRules(parts),
  funModes: getFunModes(parts),
  stats: getCodexStats(parts),
};
const heroLede = "과거·현재·미래 세계의 모든 지식이 담긴 제 4의 도서관";
const descriptions = [
  "세계 구조·마력 체계·속성·권능·종족·직업·장비",
  "이그나르 대륙의 지형·국가·세력 관계·게이트",
  "창세 가설과 대륙력 0년 이후의 연표",
  "턴 구조·재미 모드·캐릭터 생성·판정 방식을 다룬 텍스트 TRPG 규칙",
];
const shortTitles = [
  "세계 설정",
  "지리와 국가",
  "역사와 연표",
  "롤플레잉 규칙",
];
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const md = (value) => DOMPurify.sanitize(marked.parse(value));
// The codex seal: the outer rings are the void around every world, the eight
// small crystals are the basic attributes, and the split crystal stacks the
// celestial realm (open), the material realm (crystal blue), and the demon realm (solid).
const sealOrnaments = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4 - Math.PI / 2;
  const [ux, uy] = [Math.cos(a), Math.sin(a)];
  const [cx, cy] = [32 + 25.8 * ux, 32 + 25.8 * uy];
  const p = (r, t) => `${(cx + r * ux - t * uy).toFixed(2)} ${(cy + r * uy + t * ux).toFixed(2)}`;
  return `M${p(1.6, 0)}L${p(0, 1.1)}L${p(-1.6, 0)}L${p(0, -1.1)}Z`;
}).join("");
const sealMark = (className) => `<svg class="${className}" viewBox="0 0 64 64" aria-hidden="true">
  <circle cx="32" cy="32" r="29.5" fill="none" stroke="currentColor" stroke-width="3"/>
  <circle cx="32" cy="32" r="23" fill="none" stroke="currentColor" stroke-width="1.25"/>
  <path d="${sealOrnaments}" fill="currentColor"/>
  <path d="M32 14.8 38.4 24.6H25.6Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
  <path d="M22.92 28h18.16L43.5 32l-2.42 4H22.92L20.5 32Z" fill="var(--crystal)"/>
  <path d="M24.43 38.5h15.14L32 51Z" fill="currentColor"/>
</svg>`;
const allSections = parts.flatMap((p) =>
  p.sections.map((s) => ({ ...s, part: p })),
);
const articleLink = (p, s) => `#${p}${s ? "/" + s : ""}`;

document.querySelector("#app").innerHTML = `
  <div class="backdrop" aria-hidden="true"><i class="orb-blue"></i><i class="orb-violet"></i><i class="orb-cobalt"></i><i class="orb-light"></i><i class="seal-rings"></i><div class="backdrop-scene"></div></div>
  <header class="site-nav">
    <a class="brand" href="#home" aria-label="이그니아 코덱스 홈">${sealMark("brand-mark")}<span>ignia<span class="brand-dot">.</span></span></a>
    <nav id="navigation" aria-label="설정집 탐색">
    ${parts.map((p, i) => `<a href="#${p.id}">${shortTitles[i]}</a>`).join("")}
    <span class="nav-divider" aria-hidden="true"></span><a href="#pending">미정 항목 <small>${pending.length}</small></a><a href="#original">원문 보기</a></nav>
    <button class="theme-toggle" type="button" aria-label="다크 모드" aria-pressed="false"><svg class="nav-icon icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/></svg><svg class="nav-icon icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg></button>
    <button class="menu-toggle" type="button" aria-label="탐색 메뉴 열기" aria-controls="navigation" aria-expanded="false"><svg class="nav-icon icon-menu" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><svg class="nav-icon icon-close" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
    <button class="search-trigger" type="button" aria-label="설정 검색"><svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg><span class="search-label">설정 검색</span><kbd>⌘ K</kbd></button>
  </header>
  <main id="main" tabindex="-1"></main><footer>${sealMark("footer-mark")}<span>Ignia Codex</span><span>아직 쓰고 있는 설정집이라 내용은 수시로 바뀐다</span><a href="#original">원문 보기</a></footer>
  <dialog id="search-dialog" aria-labelledby="search-title"><div class="search-head"><label for="search-input" id="search-title">설정 검색</label><button class="close-search" aria-label="검색 닫기">✕</button></div><input type="search" id="search-input" placeholder="국가·속성·종족 이름으로 검색" autocomplete="off"/><div id="search-results" aria-live="polite"></div><p class="search-hint">Esc 닫기</p></dialog>`;

const main = document.querySelector("#main");

function elementsDiagram() {
  const rows = getTable(parts[0].sections[2].body, "### 3-2.");
  const colors = [
    "#a53d20",
    "#245f9f",
    "#326347",
    "#79532f",
    "#6942a8",
    "#806314",
    "#494d83",
    "#505865",
  ];
  return `<div class="element-grid">${rows.map((r, i) => `<div class="element" style="--element:${colors[i]}"><img class="element-image" src="${elementIcon(["火", "水", "風", "土", "雷", "光", "暗", "無"][i])}" alt="" width="64" height="64" /><span>${escape(cleanText(r[0]).replace(" 마법", ""))}</span><span class="evolution-line" aria-hidden="true">↓</span><strong>${escape(cleanText(r[1]).split(" — ")[0])}</strong></div>`).join("")}</div><p class="diagram-caption">숙련도가 일정 수준에 이르면 상위 마법으로 진화하지만 무(無)는 진화하지 않는다</p>`;
}

const sectionHref = (partIndex, pattern) => {
  const part = parts[partIndex];
  const section = part?.sections.find((s) => pattern.test(s.title));
  return articleLink(part?.id, section?.id);
};
const backgroundIslands = new Set(["waves", "galaxy", "topography", "threads", "particles", "acid"]);
const island = (name, className = "") =>
  `<div class="${className}" data-island="${name}"${backgroundIslands.has(name) ? ' aria-hidden="true"' : ""}></div>`;
const sectionHead = (title, lede, href, action) =>
  `<div class="home-heading"><div><h2>${title}</h2><p>${lede}</p></div><a class="btn btn-ghost" href="${href}">${action}</a></div>`;

function codexIndex() {
  return `<ol class="codex-index-list">${parts.map((p, i) => `<li><a href="#${p.id}"><span class="index-part">제${i + 1}부</span><span class="index-title">${shortTitles[i]}</span><span class="index-desc">${descriptions[i]}</span></a></li>`).join("")}</ol>`;
}

function nationsPanel(withLink) {
  return `<section class="nations-panel">${island("topography", "panel-bg")}<div class="nations-head"><div><h2>대륙의 세력 관계</h2><p>세력을 누르면 위치와 통치와 이념이 보인다<br>이름은 모두 가칭이고 위치가 적히지 않은 곳은 관계에 맞춰 놓았다</p></div>${withLink ? `<a class="btn btn-glass" href="#part-2">지리와 국가 읽기</a>` : ""}</div>${island("nations")}</section>`;
}

function home() {
  const { magic, stats, eras, turn } = codex;
  const lineage = [...magic.lineage]
    .sort((a, b) => magic.disciplines.findIndex((d) => d.name === a.parent) - magic.disciplines.findIndex((d) => d.name === b.parent))
    .map((l) => `${topic(l.child)} ${l.parent}에서`)
    .join(" ");
  return `<section class="hero">${island("waves", "hero-waves")}<div class="hero-content"><p class="hero-badge"><span>집필 중</span>현재 시점 대륙력 800년대</p><div class="hero-title" data-island="heroTitle"><h1>이그니아 코덱스</h1><p class="hero-lede">${heroLede}</p></div><div class="hero-actions"><a class="btn btn-light" href="${sectionHref(0, /세계 구조/)}">처음부터 읽기</a><a class="btn btn-glass" href="#pending">미정 항목 보기</a></div></div></section>
  <div class="home-body">
    <div class="home-lead">
      <section class="stage-card"><div class="stage-art" role="img" aria-label="천계·물질계·심연을 표현한 이그니아 콘셉트 아트"></div><small class="stage-note">콘셉트 아트라 실제 지형과 다를 수 있음</small><div class="stage-copy"><p class="glass-badge"><span>현재 무대</span>대륙력 800년대</p><h2>이그나르 대륙</h2><p class="stage-lede">왕국과 제국은 국경에서 대치 중이고 마계 접경의 게이트는 점점 불안정해진다</p><a class="btn btn-light" href="#part-2">지리와 국가 보기</a></div></section>
      <section class="part-tiles-wrap" aria-label="목차"><div data-island="partTiles">${codexIndex()}</div></section>
    </div>
    <section class="void-panel">${island("galaxy", "panel-bg")}<div class="void-copy"><h2>위에서부터 <br>천계·물질계·마계</h2><p>이그니아는 여러 세계가 층층이 포개진 다집합 구축형 세계다<br>허무 에너지만 있는 외곽세계를 사이에 두고 세 세계가 차례로 놓여 있고 그 중심은 물질계다</p><a class="btn btn-glass" href="${sectionHref(0, /세계 구조/)}">세계 간 이동 읽기</a></div>${strataDiagram()}</section>
    <section class="home-section">${sectionHead(`마력을 다루는 ${magic.disciplines.length}가지 방법`, `${lineage} 갈라져 나왔다`, sectionHref(0, /마력 체계/), "마력 체계 읽기")}${island("magic")}</section>
    <section class="home-section">${sectionHead(`기본 속성 ${stats.attributes}종과 상위 마법`, "속성을 누르면 진화한 마법과 융합 조합이 보인다", sectionHref(0, /속성/), "속성 전체 읽기")}<div data-island="attributes">${elementsDiagram()}</div></section>
    ${nationsPanel(true)}
    <section class="home-section">${sectionHead(`${eras.length}개의 시대`, "막대를 누르면 그 시대의 사건이 보인다<br>겹친 막대는 같은 시기를 함께 지난 시대다", sectionHref(2, /연표/), "연표 읽기")}${island("eras")}</section>
    <section class="home-section">${sectionHead(`한 턴은 행동 ${turn.actions}번`, "원문의 진행 예시로 한 턴을 차례대로 넘겨 본다", sectionHref(3, /턴 구조/), "턴 구조 읽기")}${island("turn")}</section>
    <section class="pending-strip"><div><h2>아직 정하지 않은 것들</h2><p>국가 정식 명칭·창세 가설·주사위 판정 여부처럼 원문에 🚧로 남겨 둔 항목</p></div><a class="btn btn-solid" href="#pending">미정 항목 ${pending.length}개 보기</a></section>
  </div>`;
}

// Mirrors the source document's diagram, where a band of the void separates each world.
function strataDiagram() {
  const gap = '<span class="strata-gap">외곽세계</span>';
  return `<div class="strata-wrap"><div class="strata" role="img" aria-label="외곽세계를 사이에 두고 천계·물질계·마계가 차례로 놓인 계층 구조">${gap}<div class="stratum celestial"><strong>천계</strong><small>Celestial Realm</small></div>${gap}<div class="stratum material"><strong>물질계</strong><em>중심 세계</em><small>Material Realm</small></div>${gap}<div class="stratum abyss"><strong>마계</strong><small>Demon Realm</small></div>${gap}</div><p class="strata-note">세계 간 진입은 일반적으로 편도이다</p></div>`;
}

// Each chapter that has a picture in the codex gets its island above the prose.
function chapterVisual(part, section) {
  const t = section.title;
  const at = (i, re) => part === parts[i] && re.test(t);
  if (at(0, /세계 구조/))
    return `<div class="void-panel is-compact">${island("galaxy", "panel-bg")}${strataDiagram()}</div>`;
  if (at(0, /마력 체계/)) return island("magic", "chapter-visual");
  if (at(0, /속성/)) return `<div class="chapter-visual" data-island="attributes">${elementsDiagram()}</div>`;
  if (at(0, /장비/)) return island("grades", "chapter-visual");
  if (at(1, /세력 관계/)) return nationsPanel(false);
  if (at(2, /연표/)) return island("eras", "chapter-visual");
  if (at(3, /턴 구조/)) return island("turn", "chapter-visual");
  if (at(3, /재미 모드/)) return island("fun", "chapter-visual");
  return "";
}

// Every part opens on a void banner with its own moving background.
const partBackgrounds = ["galaxy", "topography", "threads", "particles"];

function article(part, section) {
  const index = parts.indexOf(part);
  const content = section
    ? `${chapterVisual(part, section)}<article class="prose">${md(section.body)}</article>`
    : `<div class="prose part-intro">${md(part.intro)}</div>${part.sections.map((s) => `<section class="chapter" id="${s.id}"><h2><a href="${articleLink(part.id, s.id)}">${escape(s.title)}</a></h2>${chapterVisual(part, s)}<div class="prose">${md(s.body)}</div></section>`).join("")}`;
  return `<header class="part-banner">${island(partBackgrounds[index] ?? "galaxy", "panel-bg")}<div class="part-banner-copy"><p class="glass-badge"><span>제${index + 1}부</span>${shortTitles[index]}</p><h1>${escape(section ? section.title.replace(/^\d+\. /, "") : shortTitles[index])}</h1><p>${descriptions[index]}</p></div></header><div class="reader-grid"><div class="reader-body">${content}<div class="reading-end"><a href="#${part.id}">제${index + 1}부 전체 읽기</a><a href="#home">홈으로</a></div></div><aside class="toc" aria-label="이 부의 목차"><span>제${index + 1}부 목차</span>${part.sections.map((s) => `<a ${s === section ? 'aria-current="page"' : ""} href="${articleLink(part.id, s.id)}">${escape(s.title.replace(/ \(.+\)/, ""))}</a>`).join("")}<div class="toc-note">🚧 표시는<br>아직 정하지 않은 항목</div></aside></div>`;
}

function pendingPage() {
  return `<div class="reading-header"><span class="section-kicker">작업 중</span><h1>미정 항목</h1><p>원문에 🚧나 ‘미정’으로 남겨 둔 줄을 모았다<br>원문에서 정리하면 이 목록에서도 빠진다</p></div><div class="pending-list">${pending.map(({ part, section, lines }) => `<article><div class="pending-meta"><span>${escape(part.title)}</span><span class="draft-pill">검토 중</span></div><h2><a href="${articleLink(part.id, section.id)}">${escape(section.title)} ↗</a></h2><div class="prose">${md(lines.join("\n\n"))}</div></article>`).join("")}</div><div class="info-panel"><h2>국가명은 모두 가칭</h2><p>나라마다 이름 후보를 여럿 두었고 정하기 전까지는 첫 번째 후보로 적는다</p><a class="text-link" href="#part-2">명칭 후보 보기 ↗</a></div>`;
}

// Galaxy stars glow violet or cobalt around a pale lilac core, never pure white.
// The canvas draws on black and screens onto the panel so halos only add light.
const galaxyStars = ["#8F80F5", "#5B7CFF"];

// Props for each island. React and the effects load as separate chunks so the
// page text shows first; reduced motion keeps the pictures but stills them.
function islandProps(name) {
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { magic, attributes, grades, nations, eras, turn, stats } = codex;
  switch (name) {
    case "waves":
      return {
        horizonColor: "#2A2170",
        waveColor: "#4F7BFF",
        crestColor: "#B9AEFF",
        speed: still ? 0 : 0.35,
        fogDepth: 20,
        grain: !still,
        mouseInteraction: !still,
      };
    case "acid":
      return {
        color1: "#2A2170",
        color2: "#3454D1",
        color3: "#8F80F5",
        detail: "low",
        speed: still ? 0 : 0.25,
        waveDepth: 0.8,
        brightness: 1.5,
        opacity: 1,
        mouseInteraction: false,
        grain: false,
        maxDpr: 1,
      };
    case "galaxy":
      return {
        starColors: galaxyStars,
        coreColor: "#D9DDFF",
        density: 1.1,
        glowIntensity: 0.45,
        twinkleIntensity: 0.4,
        speed: 0.6,
        starSpeed: 0.3,
        rotationSpeed: 0.04,
        mouseRepulsion: !still,
        mouseInteraction: !still,
        disableAnimation: still,
        transparent: false,
      };
    case "topography":
      return {
        lowColor: "#2A2170",
        midColor: "#8F80F5",
        highColor: "#E5E0FF",
        speed: still ? 0 : 0.25,
        morphSpeed: still ? 0 : 0.04,
        opacity: 0.55,
        glow: 0.35,
        grain: false,
        mouseInteraction: !still,
      };
    case "threads":
      return { color: [0.9, 0.87, 1], amplitude: 1.3, distance: 0.15, enableMouseInteraction: !still };
    case "particles":
      return {
        particleColors: ["#E5E0FF", "#B9AEFF", "#9FB2FF"],
        particleCount: 220,
        particleSpread: 11,
        speed: still ? 0 : 0.08,
        particleBaseSize: 110,
        alphaParticles: true,
        moveParticlesOnHover: !still,
        disableRotation: still,
      };
    case "heroTitle":
      return { title: "이그니아 코덱스", lede: heroLede, still };
    case "partTiles":
      return {
        still,
        data: { basics: attributes.basics, nations, eras, turn },
        tiles: [
          { kind: "attributes", stats: [["기본 속성", stats.attributes], ["특수 속성", stats.special], ["종족군", stats.races]] },
          { kind: "nations", stats: [["세력", stats.nations], ["주요 지형", stats.terrains]] },
          { kind: "eras", stats: [["시대", stats.eras], ["현재 대륙력", 800, "년대"]] },
          { kind: "turn", stats: [["턴당 행동", stats.actions], ["행동당 선택지", stats.options], ["재미 모드", stats.funLevels, "단계"]] },
        ].map((tile, i) => ({ ...tile, href: `#${parts[i].id}`, label: `제${i + 1}부`, title: shortTitles[i] })),
      };
    case "magic":
      return magic;
    case "attributes":
      return attributes;
    case "grades":
      return { grades };
    case "nations":
      return { nations };
    case "eras":
      return { eras };
    case "turn":
      return { turn };
    case "fun":
      return { modes: codex.funModes };
    default:
      return {};
  }
}

let unmountIslands = null;

// The world setting part sits in a dark crystal corridor behind every pane. The
// scene stays mounted while the reader moves between its chapters.
const backdropScene = document.querySelector(".backdrop-scene");
let sceneName = null;
let unmountScene = null;
function setScene(name) {
  if (name === sceneName) return;
  unmountScene?.();
  sceneName = name;
  if (name) document.body.dataset.scene = name;
  else delete document.body.dataset.scene;
  backdropScene.innerHTML = name ? island(name, "backdrop-effect") : "";
  unmountScene = name ? mountIslands(backdropScene, islandProps) : null;
}

function render() {
  unmountIslands?.();
  unmountIslands = null;
  const [route = "home", sectionId] = location.hash.slice(1).split("/");
  const part = parts.find((p) => p.id === route);
  const section = part?.sections.find((s) => s.id === sectionId);
  let label = "홈";
  if (part) {
    main.innerHTML = article(part, section);
    label = shortTitles[parts.indexOf(part)];
  } else if (route === "pending") {
    main.innerHTML = pendingPage();
    label = "미정 항목";
  } else if (route === "original") {
    main.innerHTML = `<div class="reading-header"><span class="section-kicker">원문</span><h1>이그니아 통합 코덱스</h1><p>이 사이트의 내용은 전부 이 MD 파일 하나에서 나온다</p><button id="download-md" class="primary-link">MD 파일 받기 ↓</button></div><article class="prose original">${md(raw)}</article>`;
    label = "원문 보기";
  }
  setScene(part === parts[0] ? "acid" : null);
  const isHome = !part && route !== "pending" && route !== "original";
  main.dataset.route = isHome ? "home" : "page";
  if (isHome) main.innerHTML = home();
  unmountIslands = mountIslands(main, islandProps);
  if (part === parts[1]) {
    main.querySelectorAll('.prose h3').forEach(heading => {
      const id = heading.textContent.match(/^([34]-[1-5])\./)?.[1];
      const url = nationEmblem(id);
      if (!url) return;
      const figure = document.createElement('figure');
      figure.className = 'nation-prose-emblem';
      const img = document.createElement('img');
      img.src = url; img.alt = heading.textContent + ' 문장 초안';
      img.width = 112; img.height = 112; img.loading = 'lazy';
      const caption = document.createElement('figcaption'); caption.textContent = '문장 초안 · 국가명 가칭';
      figure.append(img, caption); heading.after(figure);
    });
  }
  document.title = isHome
    ? "이그니아 코덱스"
    : `${section ? cleanText(section.title) : label} — 이그니아 코덱스`;
  document.querySelectorAll(".site-nav a").forEach((a) => {
    const active = a.hash === `#${part?.id ?? (route || "home")}`;
    a.classList.toggle("active", active);
    if (active) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  document.querySelectorAll(".prose table").forEach((table) => {
    const wrap = document.createElement("div");
    wrap.className = "table-scroll";
    wrap.tabIndex = 0;
    wrap.setAttribute("role", "region");
    wrap.setAttribute("aria-label", "설정 표");
    table.replaceWith(wrap);
    wrap.append(table);
  });
  // Preserve the original markdown's internal table of contents in the SPA.
  main.querySelectorAll('a[href^="#제"]').forEach((a) => {
    const num = decodeURIComponent(a.getAttribute("href")).match(/제([1-4])부/);
    if (num) a.href = `#part-${num[1]}`;
  });
  document.querySelector("#download-md")?.addEventListener("click", () => {
    const url = URL.createObjectURL(
      new Blob([raw], { type: "text/markdown;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "이그니아_통합문서.md";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  closeMenu();
  window.scrollTo(0, 0);
}

const dialog = document.querySelector("#search-dialog");
const input = document.querySelector("#search-input");
function results() {
  const query = input.value.trim().toLocaleLowerCase();
  const items = query
    ? allSections.filter((s) =>
        `${s.title} ${s.body}`.toLocaleLowerCase().includes(query),
      )
    : allSections.slice(0, 5);
  document.querySelector("#search-results").innerHTML =
    `<p class="result-count">${query ? `검색 결과 ${items.length}건` : "목차"}</p>` +
    (items.length
      ? items
          .map((s) => {
            const text = cleanText(s.body).replace(/\n+/g, " ");
            const pos = text.toLocaleLowerCase().indexOf(query);
            const start = Math.max(0, pos - 35);
            return `<a class="search-result" href="${articleLink(s.part.id, s.id)}"><small>${escape(s.part.title)}</small><strong>${escape(s.title)}</strong><p>${start ? "…" : ""}${escape(text.slice(start, start + 130))}…</p></a>`;
          })
          .join("")
      : '<div class="no-results">검색 결과가 없다<br>국가명은 후보 이름으로도 찾을 수 있다</div>');
}
function openSearch() {
  dialog.showModal();
  results();
  input.focus();
}
document.querySelector(".search-trigger").onclick = openSearch;
document.querySelector(".close-search").onclick = () => dialog.close();
input.addEventListener("input", results);
dialog.addEventListener("click", (e) => {
  if (e.target === dialog || e.target.closest(".search-result")) dialog.close();
});
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if (dialog.open) dialog.close();
    else openSearch();
  }
  if (e.key === "Escape") closeMenu();
});
const menu = document.querySelector(".menu-toggle");
function closeMenu() {
  document.body.classList.remove("menu-open");
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "탐색 메뉴 열기");
}
menu.onclick = () => {
  const open = document.body.classList.toggle("menu-open");
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "탐색 메뉴 닫기" : "탐색 메뉴 열기");
};
document.addEventListener("click", (e) => {
  if (
    document.body.classList.contains("menu-open") &&
    !e.target.closest(".site-nav")
  )
    closeMenu();
});
// index.html sets data-theme before first paint; this keeps the toggle in sync.
const themeToggle = document.querySelector(".theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const systemDark = matchMedia("(prefers-color-scheme: dark)");
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeMeta.content = theme === "dark" ? "#05040c" : "#e9ecfb";
}
function savedTheme() {
  try {
    return localStorage.getItem("ignia-theme");
  } catch {
    return null;
  }
}
applyTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
themeToggle.onclick = () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("ignia-theme", next);
  } catch {}
  applyTheme(next);
};
systemDark.addEventListener("change", (e) => {
  if (!savedTheme()) applyTheme(e.matches ? "dark" : "light");
});
// Nothing on the page can be dragged; the search field keeps normal text dragging.
document.addEventListener("dragstart", (e) => {
  if (!e.target.closest?.("input, textarea")) e.preventDefault();
});
window.addEventListener("hashchange", () => {
  render();
  main.focus({ preventScroll: true });
});
render();
