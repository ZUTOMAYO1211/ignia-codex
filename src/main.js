import { marked } from "marked";
import DOMPurify from "dompurify";
import raw from "../이그니아_통합문서.md?raw";
import { parseCodex, getPending, getTable, cleanText } from "./content.js";
import { createGradientWaves } from "./gradientWaves.js";
import "./style.css";

const parts = parseCodex(raw);
const pending = getPending(parts);
const descriptions = [
  "세계 구조·마력 체계·속성·권능·종족·직업·장비",
  "이그나르 대륙의 지형·국가·세력 관계·게이트",
  "창세 가설과 대륙력 0년 이후의 연표",
  "턴 구조·캐릭터 생성·판정 방식을 다룬 텍스트 TRPG 규칙",
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
const allSections = parts.flatMap((p) =>
  p.sections.map((s) => ({ ...s, part: p })),
);
const articleLink = (p, s) => `#${p}${s ? "/" + s : ""}`;

document.querySelector("#app").innerHTML = `
  <header class="site-nav">
    <a class="brand" href="#home" aria-label="이그니아 코덱스 홈"><span>ignia<span class="brand-dot">.</span></span><small>이그니아 세계관</small></a>
    <nav id="navigation" aria-label="설정집 탐색">
    ${parts.map((p, i) => `<a href="#${p.id}">${shortTitles[i]}</a>`).join("")}
    <span class="nav-divider" aria-hidden="true"></span><a href="#pending">미정 항목 <small>${pending.length}</small></a><a href="#original">원문 보기</a></nav>
    <button class="menu-toggle" type="button" aria-label="탐색 메뉴 열기" aria-controls="navigation" aria-expanded="false">☰</button>
    <button class="search-trigger" type="button" aria-label="설정 검색"><span aria-hidden="true">⌕</span><span class="search-label">설정 검색</span><kbd>⌘ K</kbd></button>
  </header>
  <main id="main" tabindex="-1"></main><footer><span>Ignia Codex</span><span>아직 쓰고 있는 설정집이라 내용은 수시로 바뀐다</span><a href="#original">원문 보기</a></footer>
  <dialog id="search-dialog" aria-labelledby="search-title"><div class="search-head"><label for="search-input" id="search-title">설정 검색</label><button class="close-search" aria-label="검색 닫기">✕</button></div><input type="search" id="search-input" placeholder="국가·속성·종족 이름으로 검색" autocomplete="off"/><div id="search-results" aria-live="polite"></div><p class="search-hint">Esc 닫기</p></dialog>`;

const main = document.querySelector("#main");
const siteNav = document.querySelector(".site-nav");

function realmDiagram() {
  return `<div class="realm-diagram" aria-label="외곽세계 안에 천계·물질계·마계가 차례로 놓인 계층 구조"><span class="outer-world">외곽세계 <small>허무 에너지</small></span><div class="realm celestial"><span>천계</span><small>Celestial Realm</small></div><div class="realm material"><span>물질계</span><small>Material Realm</small><em>중심 세계</em></div><div class="realm abyss"><span>마계</span><small>Demon Realm</small></div><div class="realm-note">세계 간 진입은 일반적으로 편도이다</div></div>`;
}

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
  return `<div class="element-grid">${rows.map((r, i) => `<div class="element" style="--element:${colors[i]}"><span class="element-glyph" aria-hidden="true">${["火", "水", "風", "土", "雷", "光", "暗", "無"][i]}</span><span>${escape(cleanText(r[0]).replace(" 마법", ""))}</span><span class="evolution-line" aria-hidden="true">↓</span><strong>${escape(cleanText(r[1]).split(" — ")[0])}</strong></div>`).join("")}</div><p class="diagram-caption">숙련도가 일정 수준에 이르면 상위 마법으로 진화하지만 무(無)는 진화하지 않는다</p>`;
}

function home() {
  return `<section class="hero"><div class="hero-waves" aria-hidden="true"></div><div class="hero-content"><p class="hero-badge"><span>집필 중</span>현재 시점 대륙력 800년대</p><h1>이그니아 코덱스</h1><p class="hero-lede">세계 설정·지리·역사·진행 규칙을 한 권으로 정리하고 있다</p><div class="hero-actions"><a class="hero-primary" href="#part-1/part-1-s1">처음부터 읽기</a><a class="hero-secondary" href="#pending">미정 항목 보기</a></div></div></section>
  <div class="home-body"><div class="explore-layout"><section class="world-feature"><div class="feature-copy"><span class="feature-label">현재 무대</span><h2>이그나르 대륙<br>대륙력 800년대</h2><p>왕국과 제국은 국경에서 대치 중이고 마계 접경의 게이트는 점점 불안정해진다</p><a class="primary-link" href="#part-2">지리와 국가 보기 <span aria-hidden="true">↗</span></a></div><div class="hero-art" role="img" aria-label="천계·물질계·심연을 표현한 이그니아 콘셉트 아트"></div><span class="art-caption">콘셉트 아트 · 실제 지형과 다를 수 있음</span></section>
  <section class="volumes"><div class="section-heading"><h2>목차</h2><span>제1~${parts.length}부</span></div><div class="volume-grid">${parts.map((p, i) => `<a class="volume" href="#${p.id}"><span class="volume-number">0${i + 1}</span><div><h3>${shortTitles[i]}</h3><p>${descriptions[i]}</p></div><span class="volume-arrow" aria-hidden="true">↗</span></a>`).join("")}</div></section></div>
  <section class="world-overview"><div class="realm-copy"><span class="section-kicker">세계 구조</span><h2>위에서부터 <br>천계·물질계·마계</h2><p>이그니아는 여러 세계가 층층이 포개진 다집합 구축형 세계다<br>허무 에너지만 있는 외곽세계를 사이에 두고 세 세계가 차례로 놓여 있고 그 중심은 물질계다</p><a class="text-link" href="#part-1/part-1-s1">세계 간 이동 ↗</a></div>${realmDiagram()}</section>
  <section class="attribute-preview"><div class="section-heading"><div><span class="section-kicker">속성</span><h2>기본 속성 8종과 상위 마법</h2></div><a href="#part-1/part-1-s3">융합·특수 속성 ↗</a></div>${elementsDiagram()}</section>
  <section class="unfinished"><div><span class="section-kicker">미정</span><h2>아직 정하지 않은 것들</h2><p>국가 정식 명칭·창세 가설·주사위 판정 여부처럼 원문에 🚧로 남겨 둔 항목</p></div><a href="#pending">미정 항목 보기 ↗</a></section></div>`;
}

function nationDiagram() {
  const nations = [...parts[1].body.matchAll(/^### (\d-\d)\. (.+)$/gm)].map(
    (m) => cleanText(m[2]).split(" — ")[0],
  );
  const relations = [
    [nations[0], "숙적 · 국경 충돌", nations[1]],
    [nations[2], "상층과 하층 · 착취와 의존", nations[3]],
    [nations[6], "탈주 마술사 · 긴장", nations[0]],
  ];
  return `<div class="info-panel"><h2>대륙의 세력 관계</h2><p class="diagram-caption">국가·지역 이름은 모두 가칭이며 실제 위치를 나타낸 지도가 아니다</p><div class="relations">${relations.map((r) => `<div><strong>${escape(r[0])}</strong><span>${r[1]}<i aria-hidden="true">⟷</i></span><strong>${escape(r[2])}</strong></div>`).join("")}</div><div class="nation-tags">${nations
    .slice(4)
    .map((n) => `<span>${escape(n)}</span>`)
    .join("")}</div></div>`;
}

function historyDiagram() {
  const section = parts[2].sections.find((s) => s.title === "연표");
  const entries = section.body.split(/^### (.+)$/m);
  return `<div class="timeline">${entries.slice(1).reduce((acc, item, i, a) => (i % 2 ? acc : acc + `<div class="timeline-entry"><span class="timeline-dot"></span><h3>${escape(item)}</h3><div>${md(a[i + 1] ?? "")}</div></div>`), "")}</div>`;
}

function visualFor(part, section) {
  if (part.id === "part-1" && section?.id.endsWith("-s1"))
    return `<div class="info-panel">${realmDiagram()}</div>`;
  if (part.id === "part-1" && section?.id.endsWith("-s3"))
    return `<div class="info-panel">${elementsDiagram()}</div>`;
  if (part.id === "part-2" && !section) return nationDiagram();
  if (part.id === "part-3" && section?.title === "연표")
    return historyDiagram();
  if (part.id === "part-4" && (!section || section.id.endsWith("-s2")))
    return `<div class="turn-diagram info-panel"><h2>한 턴의 흐름</h2><div>${[1, 2, 3].map((n) => `<div><span>행동 ${n}</span><p>선택지 4개 → 선택 → 결과</p></div>`).join('<b aria-hidden="true">→</b>')}</div><p class="diagram-caption">행동 3번이 끝나면 다음 플레이어로 차례가 넘어가고 모두 한 번씩 마치면 1라운드가 끝난다</p></div>`;
  return "";
}

function article(part, section) {
  const index = parts.indexOf(part);
  let content;
  if (section) content = `<article class="prose">${md(section.body)}</article>`;
  else
    content = `<div class="prose part-intro">${md(part.intro)}</div>${part.sections.map((s) => `<section class="chapter" id="${s.id}"><h2><a href="${articleLink(part.id, s.id)}">${escape(s.title)} <span aria-hidden="true">↗</span></a></h2>${part.id === "part-3" && s.title === "연표" ? historyDiagram() : `<div class="prose">${md(s.body)}</div>`}</section>`).join("")}`;
  if (part.id === "part-3" && section?.title === "연표") content = "";
  return `<div class="reading-header"><span class="section-kicker">제${index + 1}부 · ${shortTitles[index]}</span><h1>${escape(section ? section.title.replace(/^\d+\. /, "") : shortTitles[index])}</h1><p>${descriptions[index]}</p></div><div class="reader-grid"><div class="reader-body">${visualFor(part, section)}${content}<div class="reading-end"><a href="#${part.id}">제${index + 1}부 전체 읽기</a><a href="#home">홈으로</a></div></div><aside class="toc" aria-label="이 부의 목차"><span>제${index + 1}부 목차</span>${part.sections.map((s) => `<a ${s === section ? 'aria-current="page"' : ""} href="${articleLink(part.id, s.id)}">${escape(s.title.replace(/ \(.+\)/, ""))}</a>`).join("")}<div class="toc-note">🚧 표시는<br>아직 정하지 않은 항목</div></aside></div>`;
}

function pendingPage() {
  return `<div class="reading-header"><span class="section-kicker">작업 중</span><h1>미정 항목</h1><p>원문에 🚧나 ‘미정’으로 남겨 둔 줄을 모았다<br>원문에서 정리하면 이 목록에서도 빠진다</p></div><div class="pending-list">${pending.map(({ part, section, lines }) => `<article><div class="pending-meta"><span>${escape(part.title)}</span><span class="draft-pill">검토 중</span></div><h2><a href="${articleLink(part.id, section.id)}">${escape(section.title)} ↗</a></h2><div class="prose">${md(lines.join("\n\n"))}</div></article>`).join("")}</div><div class="info-panel"><h2>국가명은 모두 가칭</h2><p>나라마다 이름 후보를 여럿 두었고 정하기 전까지는 첫 번째 후보로 적는다</p><a class="text-link" href="#part-2">명칭 후보 보기 ↗</a></div>`;
}

let unmountHome = null;
function mountHome() {
  const hero = main.querySelector(".hero");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stopWaves = createGradientWaves(hero.querySelector(".hero-waves"), {
    horizonColor: "#3B2F9E",
    waveColor: "#6D5CE8",
    crestColor: "#E5E0FF",
    speed: 0.35,
    fogDepth: 20,
    maxDpr: 1.5,
    pointerTarget: hero,
    stillTime: reduceMotion ? 12 : null,
  });
  // The nav switches to dark glass while it floats over the hero.
  const navObserver = new IntersectionObserver(
    ([entry]) => siteNav.classList.toggle("on-void", entry.isIntersecting),
    { rootMargin: `-${siteNav.getBoundingClientRect().bottom}px 0px 0px 0px` },
  );
  navObserver.observe(hero);
  return () => {
    stopWaves?.();
    navObserver.disconnect();
    siteNav.classList.remove("on-void");
  };
}

function render() {
  unmountHome?.();
  unmountHome = null;
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
  const isHome = !part && route !== "pending" && route !== "original";
  main.dataset.route = isHome ? "home" : "page";
  if (isHome) {
    main.innerHTML = home();
    unmountHome = mountHome();
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
window.addEventListener("hashchange", () => {
  render();
  main.focus({ preventScroll: true });
});
render();
