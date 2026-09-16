import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  parseCodex,
  getPending,
  getTable,
  getMagicSystem,
  getAttributes,
  getGrades,
  getNations,
  getTerrains,
  getEras,
  getTurnRules,
  getFunModes,
  getFunPresets,
  getRaces,
  getRaceRegions,
  getStatCodes,
  getCodexStats,
} from "../src/content.js";
const raw = readFileSync(
  new URL("../이그니아_통합문서.md", import.meta.url),
  "utf8",
);
const parts = parseCodex(raw);
test("all four volumes and every second-level source heading are available", () => {
  assert.equal(parts.length, 4);
  const sourceHeadings = raw.slice(raw.indexOf('# 제1부.')).match(/^## .+$/gm);
  assert.equal(parts.flatMap((p) => p.sections).length, sourceHeadings.length);
  for (const part of parts)
    for (const section of part.sections) assert.ok(section.body.length > 0);
});
test("the source stays authoritative for attribute diagrams", () => {
  const table = getTable(parts[0].sections[2].body, "### 3-2.");
  assert.equal(table.length, 8);
  assert.match(table[7][1], /진화 없음/);
  assert.equal(table[0][1], "연옥마법");
});
test("unfinished rules remain visible, including provisional judgments", () => {
  const pending = getPending(parts);
  assert.ok(pending.some((p) => p.section.title.includes("몬스터와 보스")));
  assert.ok(pending.some((p) => p.section.title.includes("재미 모드")));
  assert.ok(pending.some((p) => p.lines.some((line) => line.includes("초안"))));
  assert.ok(pending.some((p) => p.lines.some((line) => line.includes("전투 세부 규칙"))));
  // Genesis is deliberately open-ended now, so it is no longer an open task.
  assert.doesNotMatch(parts[2].sections[0].title, /미정/);
});
test("magic disciplines keep their mottos and lineage", () => {
  const { disciplines, lineage } = getMagicSystem(parts);
  assert.deepEqual(
    disciplines.map((d) => d.name),
    ["마법", "마술", "주술", "연금술", "마도구"],
  );
  assert.equal(disciplines[0].motto, "정의된 법칙의 구현");
  assert.ok(disciplines.every((d) => d.summary.length > 10));
  assert.deepEqual(lineage, [
    { child: "주술", parent: "마술" },
    { child: "연금술", parent: "마법" },
  ]);
});
test("attributes expose evolution, fusions with their results, and aptitude attributes", () => {
  const { basics, fusions, special } = getAttributes(parts);
  assert.equal(basics.length, 8);
  assert.deepEqual(basics[0], { name: "불", glyph: "火", evolved: "연옥마법", evolves: true });
  assert.equal(basics[7].evolves, false);
  assert.equal(fusions[0].result, "뇌명마법");
  assert.equal(fusions.length, 5);
  assert.equal(fusions.filter((f) => f.pending).length, 0);
  assert.deepEqual(
    fusions.slice(1).map((f) => f.result),
    ["혼돈마법", "모래마법", "용암마법", "폭발마법"],
  );
  assert.ok(fusions.every((f) => f.aGlyph && f.bGlyph));
  assert.equal(special.length, 11);
});
test("nations, terrains, and equipment grades parse from their tables and sections", () => {
  const nations = getNations(parts);
  assert.equal(nations.length, 12);
  assert.equal(nations[0].id, "3-1");
  assert.ok(nations[0].fields["위치"].includes("서부"));
  // Nation names are settled, so the source no longer carries name candidates.
  assert.doesNotMatch(raw, /명칭 후보:\*\*/);
  assert.equal(nations.at(-1).id, "4-7");
  assert.equal(getTerrains(parts).length, 10);
  assert.deepEqual(getGrades(parts).map((g) => g.en), ["Common", "Rare", "Unique", "Legend", "Genesis"]);
});
test("eras carry numeric spans for the timeline", () => {
  const eras = getEras(parts);
  assert.equal(eras[0].start, null);
  assert.deepEqual([eras[1].start, eras[1].end], [0, 99]);
  const split = eras.find((e) => e.name === "분열기");
  assert.deepEqual([split.start, split.end], [100, 399]);
  assert.deepEqual([eras.at(-1).start, eras.at(-1).end], [800, 899]);
  assert.ok(eras.every((e) => e.events.length > 0));
});
test("turn rules come from the roleplay chapter and its worked example", () => {
  const turn = getTurnRules(parts);
  assert.equal(turn.actions, 3);
  assert.equal(turn.options, 4);
  assert.equal(turn.choices.length, 4);
  assert.match(turn.scene, /균열 협곡/);
  assert.match(turn.actor, /리안/);
  const stats = getCodexStats(parts);
  assert.equal(stats.nations, 12);
  assert.equal(stats.races, 5);
  assert.equal(stats.funDials, 10);
});
test("revised worlds, races, classes, and Karnix government stay in the source", () => {
  assert.match(raw, /\*\*정령계:\*\*/);
  assert.match(raw, /\*\*외신 \(Outer God\):\*\*/);
  assert.match(raw, /\*\*마족 \(Demon\):\*\*/);
  assert.match(raw, /\*\*보석 마술:\*\*/);
  assert.match(raw, /\*\*식물술:\*\*/);
  assert.doesNotMatch(raw, /호빗|하프링|순찰자|보석술|보석 마법|식물 마법/);
  const karnix = getNations(parts).find((nation) => nation.id === "3-2");
  assert.match(karnix.fields["통치"], /4권 분립/);
  assert.equal(karnix.fields["선호 체계"], undefined);
  assert.match(karnix.fields["이념"], /모든 마력 체계를 차별 없이 수용/);
  assert.ok(getNations(parts).some((nation) => nation.id === "4-7" && /수인/.test(nation.name)));
});
test("the spirit realm sits outside the stack and the void carries its energy", () => {
  const world = parts[0].sections[0].body;
  assert.match(world, /적층 구조에 속하는 세계는 \*\*천계·물질계·마계\*\* 셋/);
  assert.match(world, /### 정령계 — 층이 아닌 주머니/);
  assert.match(world, /### 허무 에너지/);
  // The stack diagram no longer lists the spirit realm as a band of its own.
  const diagram = world.match(/```\n([\s\S]*?)```/)[1];
  assert.doesNotMatch(diagram.replace(/\[정령계\]/, ""), /정령계/);
  assert.equal(diagram.match(/외곽세계/g).length, 4);
});

test("wrath's domain is a colosseum nobody walks out of", () => {
  const sins = parts[1].sections.find((s) => /죄악의 영역/.test(s.title)).body;
  const wrath = sins.split("\n").find((l) => l.startsWith("| **분노**"));
  assert.match(wrath, /투계장 그란베르/);
  assert.match(wrath, /우승하거나 죽어야/);
  assert.doesNotMatch(sins, /불타는 협곡/);
});

test("the unwalked continent lies across the sea rather than around it", () => {
  const beyond = parts[1].sections.find((s) => /대륙 외 지역/.test(s.title)).body;
  assert.match(beyond, /### 미답 대륙/);
  assert.match(beyond, /둘러싸고 있지는 않다/);
});

test("races carry modifiers, a play advantage, and where they are found", () => {
  const races = getRaces(parts);
  const codes = new Set(getStatCodes(parts).map((s) => s.code));
  assert.equal(codes.size, 7);
  assert.equal(races.length, 26);
  assert.equal(new Set(races.map((r) => r.group)).size, 4);
  assert.ok(races.every((r) => r.perk && r.where));
  // Every modifier names a score the character sheet actually has.
  for (const race of races)
    for (const [code] of race.mods) assert.ok(codes.has(code), `${race.name} ${code}`);
  // Humans take free points instead of fixed ones, so their note carries it.
  const human = races.find((r) => r.name === "인간");
  assert.equal(human.mods.length, 0);
  assert.match(human.note, /자유 배분/);
  // The regions table is read separately and never parsed as a race.
  assert.ok(!races.some((r) => r.name.includes("왕국")));
  assert.equal(getRaceRegions(parts).length, 15);
});

test("fun mode is a board of dials, each with both ends of its range", () => {
  const dials = getFunModes(parts);
  assert.equal(dials.length, 10);
  assert.equal(dials[0].name, "상황 변수");
  assert.ok(dials.every((d) => d.about && d.low && d.high));
  assert.equal(getCodexStats(parts).funDials, dials.length);
});

test("fun mode presets name dials that exist on the board", () => {
  const names = new Set(getFunModes(parts).map((d) => d.name));
  const presets = getFunPresets(parts);
  assert.ok(presets.length >= 3);
  assert.ok(presets.some((p) => Object.keys(p.values).length > 0));
  for (const preset of presets)
    for (const dial of Object.keys(preset.values)) assert.ok(names.has(dial), dial);
});
