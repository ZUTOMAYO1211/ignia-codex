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
  assert.ok(pending.some((p) => p.section.title.includes("행동 판정")));
  assert.ok(pending.some((p) => p.section.title.includes("창세")));
  assert.ok(pending.some((p) => p.lines.some((line) => line.includes("미정"))));
  assert.ok(pending.some((p) => p.lines.some((line) => line.includes("사망·부활"))));
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
  assert.equal(nations.length, 11);
  assert.equal(nations[0].id, "3-1");
  assert.equal(nations[0].candidates.length, 3);
  assert.ok(nations[0].fields["위치"].includes("서부"));
  assert.equal(nations.at(-1).id, "4-7");
  assert.equal(getTerrains(parts).length, 9);
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
  assert.equal(stats.nations, 11);
  assert.equal(stats.races, 5);
  assert.equal(stats.funLevels, 5);
});
test("revised worlds, races, classes, and Karnix government stay in the source", () => {
  assert.match(raw, /\*\*정령계:\*\*/);
  assert.match(raw, /\*\*외신 \(Outer God\):\*\*/);
  assert.match(raw, /\*\*마족 \(Demon\):\*\*/);
  assert.match(raw, /\*\*보석술:\*\*/);
  assert.match(raw, /\*\*식물술:\*\*/);
  assert.doesNotMatch(raw, /호빗|하프링|순찰자|보석 마법|식물 마법/);
  const karnix = getNations(parts).find((nation) => nation.id === "3-2");
  assert.match(karnix.fields["통치"], /4권 분립/);
  assert.equal(karnix.fields["선호 체계"], undefined);
  assert.match(karnix.fields["이념"], /모든 마력 체계를 차별 없이 수용/);
  assert.ok(getNations(parts).some((nation) => nation.id === "4-7" && /수인/.test(nation.name)));
});
test("fun mode lists five levels with the same staging effects on each", () => {
  const modes = getFunModes(parts);
  assert.deepEqual(modes.map((m) => m.level), [1, 2, 3, 4, 5]);
  assert.deepEqual(modes[0].effects.map((e) => e.label), ["상황 변수", "선택지", "웃긴 상황·긴박한 상황"]);
  assert.ok(modes.every((m) => m.effects.length === 3 && m.effects.every((e) => e.text)));
});
