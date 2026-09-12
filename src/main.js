import { marked } from "marked";
import DOMPurify from "dompurify";
import raw from "../이그니아_통합문서.md?raw";
import { parseCodex, getPending, getTable, cleanText } from "./content.js";
import "./style.css";

const parts = parseCodex(raw);
const pending = getPending(parts);
const descriptions = [
  "세계의 구조부터 마력과 존재의 법칙까지.",
  "이그나르 대륙의 지형, 국가, 세력의 관계.",
  "기록 이전의 신화에서 대륙력 800년대까지.",
  "캐릭터를 만들고 함께 이야기를 이어가는 규칙.",
];
const symbols = ["◇", "⌖", "◷", "♜"];
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
  <aside class="sidebar" id="navigation" aria-label="설정집 탐색">
    <a class="brand" href="#home"><span>ignia<span class="brand-dot">.</span><small>이그니아 세계관</small></span></a>
    <button class="search-trigger" type="button"><span aria-hidden="true">⌕</span> 설정 검색 <kbd>⌘ K</kbd></button>
    <nav><a class="nav-home" href="#home"><span aria-hidden="true">▦</span> 세계관 둘러보기</a><p class="nav-label">설정집</p>
    ${parts.map((p, i) => `<a class="nav-part" href="#${p.id}"><span aria-hidden="true">${symbols[i]}</span>${shortTitles[i]}<small>0${i + 1}</small></a>`).join("")}
    <div class="nav-divider"></div><a href="#pending" class="nav-pending"><span aria-hidden="true">◌</span> 미완성 설정 <small>${pending.length}</small></a>
    <a href="#original"><span aria-hidden="true">≡</span> 원문 읽기</a></nav>
    <div class="sidebar-bottom"><p>세계는 계속 확장 중.<br>새로운 설정을 함께 만들어간다.</p><span class="edition">진행 중인 세계관 · 초안</span></div>
  </aside>
  <div class="workspace"><header class="topbar"><button class="mobile-menu" aria-label="탐색 메뉴 열기" aria-controls="navigation" aria-expanded="false">☰</button><div class="breadcrumb">이그니아 코덱스 <span>/</span> <span id="crumb">세계관 둘러보기</span></div><div class="top-actions"><span class="draft-pill">집필 중</span><button class="icon-search" aria-label="설정 검색">⌕</button></div></header>
  <main id="main" tabindex="-1"></main><footer><span>Ignia Codex</span><span>계속해서 확장되는 세계관</span><a href="#original">원문 보기</a></footer></div>
  <dialog id="search-dialog" aria-labelledby="search-title"><div class="search-head"><label for="search-input" id="search-title">설정 검색</label><button class="close-search" aria-label="검색 닫기">✕</button></div><input type="search" id="search-input" placeholder="국가, 마력, 종족… 무엇을 찾고 있나요?" autocomplete="off"/><div id="search-results" aria-live="polite"></div><p class="search-hint">Esc 닫기 · 검색 결과를 선택해 해당 기록으로 이동</p></dialog>`;

const main = document.querySelector("#main");

function realmDiagram() {
  return `<div class="realm-diagram" aria-label="외곽세계 안에 천계, 물질계, 마계가 차례로 놓인 계층 구조"><span class="outer-world">외곽세계 <small>허무 에너지</small></span><div class="realm celestial"><span>천계</span><small>Celestial Realm</small></div><div class="realm material"><span>물질계</span><small>Material Realm</small><em>중심 세계</em></div><div class="realm abyss"><span>마계</span><small>Demon Realm</small></div><div class="realm-note">세계 간 진입은 일반적으로 편도이다.</div></div>`;
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
  return `<div class="element-grid">${rows.map((r, i) => `<div class="element" style="--element:${colors[i]}"><span class="element-glyph" aria-hidden="true">${["火", "水", "風", "土", "雷", "光", "暗", "無"][i]}</span><span>${escape(cleanText(r[0]).replace(" 마법", ""))}</span><span class="evolution-line" aria-hidden="true">↓</span><strong>${escape(cleanText(r[1]).split(" — ")[0])}</strong></div>`).join("")}</div><p class="diagram-caption">속성을 단련하면 상위 마법으로 진화한다. 무(無)는 진화하지 않는다.</p>`;
}

function home() {
  return `<section class="home-intro"><div><span class="section-kicker">이그니아 · 판타지 세계관</span><h1>서로 다른 세계.<br>끝없이 이어지는 이야기.</h1></div><p>세계의 구조와 마력의 법칙부터<br>대륙의 국가, 역사, 모험의 규칙까지.</p></section>
  <div class="explore-layout"><section class="world-feature"><div class="feature-copy"><span class="feature-label">세계 구조</span><h2>이그니아는<br>어떤 세계일까?</h2><p>천계, 물질계, 마계.<br>세 개의 영역에서 시작되는 세계.</p><a class="primary-link" href="#part-1/part-1-s1">세계 구조 알아보기 <span aria-hidden="true">↗</span></a></div><div class="hero-art" role="img" aria-label="천계와 물질계, 심연을 표현한 이그니아 콘셉트 아트"></div><span class="art-caption">세계관 콘셉트 아트 · 지리 확정안 아님</span></section>
  <section class="volumes"><div class="section-heading"><h2>어디부터 살펴볼까?</h2><span>4개의 주제</span></div><div class="volume-grid">${parts.map((p, i) => `<a class="volume" href="#${p.id}"><span class="volume-number">0${i + 1}</span><div><h3>${shortTitles[i]}</h3><p>${descriptions[i]}</p></div><span class="volume-arrow" aria-hidden="true">↗</span></a>`).join("")}</div></section></div>
  <section class="world-overview"><div class="realm-copy"><span class="section-kicker">세계 구조 한눈에 보기</span><h2>세 개의 영역,<br>그 사이의 외곽세계.</h2><p>여러 세계가 계층 형태로 포개진 다집합 구축형 세계. 허무 에너지로 가득한 외곽세계 안에 천계, 물질계, 마계가 놓여 있다.</p><a class="text-link" href="#part-1/part-1-s1">세계 간 이동 방식 읽기 ↗</a></div>${realmDiagram()}</section>
  <section class="attribute-preview"><div class="section-heading"><div><span class="section-kicker">마력과 속성</span><h2>여덟 속성에서 시작되는 힘.</h2></div><a href="#part-1/part-1-s3">속성 전체 보기 ↗</a></div>${elementsDiagram()}</section>
  <section class="unfinished"><div><span class="section-kicker">함께 정할 설정</span><h2>아직 열려 있는 가능성.</h2><p>국가의 이름부터 창세와 모험의 규칙까지, 다음에 채워갈 설정을 모았다.</p></div><a href="#pending">미완성 설정 보기 ↗</a></section>`;
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
  return `<div class="info-panel"><h2>대륙의 세력 관계</h2><p class="diagram-caption">국가·지역 명칭은 모두 가칭이다. 지리적 위치를 표시한 지도는 아니다.</p><div class="relations">${relations.map((r) => `<div><strong>${escape(r[0])}</strong><span>${r[1]}<i aria-hidden="true">⟷</i></span><strong>${escape(r[2])}</strong></div>`).join("")}</div><div class="nation-tags">${nations
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
    return `<div class="turn-diagram info-panel"><h2>한 턴의 흐름</h2><div>${[1, 2, 3].map((n) => `<div><span>행동 ${n}</span><p>선택지 4개 → 선택 → 결과</p></div>`).join('<b aria-hidden="true">→</b>')}</div><p class="diagram-caption">3번의 행동 후 다음 플레이어에게 차례가 넘어간다. 모든 플레이어의 턴이 끝나면 1라운드가 완료된다.</p></div>`;
  return "";
}

function article(part, section) {
  const index = parts.indexOf(part);
  let content;
  if (section) content = `<article class="prose">${md(section.body)}</article>`;
  else
    content = `<div class="prose part-intro">${md(part.intro)}</div>${part.sections.map((s) => `<section class="chapter" id="${s.id}"><h2><a href="${articleLink(part.id, s.id)}">${escape(s.title)} <span aria-hidden="true">↗</span></a></h2>${part.id === "part-3" && s.title === "연표" ? historyDiagram() : `<div class="prose">${md(s.body)}</div>`}</section>`).join("")}`;
  if (part.id === "part-3" && section?.title === "연표") content = "";
  return `<div class="reading-header"><span class="section-kicker">제${index + 1}부 · ${shortTitles[index]}</span><h1>${escape(section ? section.title.replace(/^\d+\. /, "") : shortTitles[index])}</h1><p>${descriptions[index]}</p></div><div class="reader-grid"><div class="reader-body">${visualFor(part, section)}${content}<div class="reading-end"><a href="#${part.id}">제${index + 1}부 전체 읽기</a><a href="#home">세계관 둘러보기으로</a></div></div><aside class="toc" aria-label="이 부의 목차"><span>이 부의 목차</span>${part.sections.map((s) => `<a ${s === section ? 'aria-current="page"' : ""} href="${articleLink(part.id, s.id)}">${escape(s.title.replace(/ \(.+\)/, ""))}</a>`).join("")}<div class="toc-note">미정 항목은 원문의<br>🚧 표기를 유지한다.</div></aside></div>`;
}

function pendingPage() {
  return `<div class="reading-header"><span class="section-kicker">함께 채울 여백</span><h1>미완성 설정</h1><p>아직 정해지지 않은 설정과 검토가 필요한 항목을 원문에서 모았다.</p></div><div class="pending-list">${pending.map(({ part, section, lines }) => `<article><div class="pending-meta"><span>${escape(part.title)}</span><span class="draft-pill">검토 중</span></div><h2><a href="${articleLink(part.id, section.id)}">${escape(section.title)} ↗</a></h2><div class="prose">${md(lines.join("\n\n"))}</div></article>`).join("")}</div><div class="info-panel"><h2>이름은 아직 가칭이다.</h2><p>제2부의 국가명 후보는 원문에 보존되어 있다. 이름을 확정하기 전까지 첫 번째 후보를 임시 표기명으로 사용한다.</p><a class="text-link" href="#part-2">국가별 명칭 후보 읽기 ↗</a></div>`;
}

function render() {
  const [route = "home", sectionId] = location.hash.slice(1).split("/");
  const part = parts.find((p) => p.id === route);
  const section = part?.sections.find((s) => s.id === sectionId);
  let label = "세계관 둘러보기";
  if (part) {
    main.innerHTML = article(part, section);
    label = shortTitles[parts.indexOf(part)];
  } else if (route === "pending") {
    main.innerHTML = pendingPage();
    label = "미완성 설정";
  } else if (route === "original") {
    main.innerHTML = `<div class="reading-header"><span class="section-kicker">원본 문서</span><h1>이그니아 통합 코덱스</h1><p>협업 브리핑을 포함한 설정집 전체 원문이다.</p><button id="download-md" class="primary-link">MD 내려받기 ↓</button></div><article class="prose original">${md(raw)}</article>`;
    label = "원문 읽기";
  } else main.innerHTML = home();
  document.querySelector("#crumb").textContent = label;
  document.title = `${section ? cleanText(section.title) : label} — 이그니아 코덱스`;
  document.querySelectorAll(".sidebar nav a").forEach((a) => {
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
    `<p class="result-count">${query ? `${items.length}개의 항목` : "설정 둘러보기"}</p>` +
    (items.length
      ? items
          .map((s) => {
            const text = cleanText(s.body).replace(/\n+/g, " ");
            const pos = text.toLocaleLowerCase().indexOf(query);
            const start = Math.max(0, pos - 35);
            return `<a class="search-result" href="${articleLink(s.part.id, s.id)}"><small>${escape(s.part.title)}</small><strong>${escape(s.title)}</strong><p>${start ? "…" : ""}${escape(text.slice(start, start + 130))}…</p></a>`;
          })
          .join("")
      : '<div class="no-results">일치하는 설정이 없다.<br>더 짧은 단어나 다른 이름으로 검색해 보자.</div>');
}
function openSearch() {
  dialog.showModal();
  results();
  input.focus();
}
document.querySelector(".search-trigger").onclick = openSearch;
document.querySelector(".icon-search").onclick = openSearch;
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
const menu = document.querySelector(".mobile-menu");
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
    !e.target.closest(".sidebar,.mobile-menu")
  )
    closeMenu();
});
window.addEventListener("hashchange", () => {
  render();
  main.focus({ preventScroll: true });
});
render();
