import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseCodex, getPending, getTable } from "../src/content.js";
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
