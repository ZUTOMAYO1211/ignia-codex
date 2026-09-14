export function parseCodex(raw) {
  const chunks = raw.split(/^# (제[1-4]부\..+)$/m);
  const parts = [];
  for (let i = 1; i < chunks.length; i += 2) {
    const body = chunks[i + 1].trim();
    const matches = [...body.matchAll(/^## (.+)$/gm)];
    const id = `part-${parts.length + 1}`;
    const sections = matches.map((match, index) => ({
      id: `${id}-s${index + 1}`,
      title: match[1],
      body: body
        .slice(
          match.index + match[0].length,
          matches[index + 1]?.index ?? body.length,
        )
        .trim(),
    }));
    parts.push({
      id,
      title: chunks[i],
      body,
      intro: body.slice(0, matches[0]?.index ?? 0).trim(),
      sections,
    });
  }
  return parts;
}

export function getPending(parts) {
  return parts.flatMap((part) =>
    part.sections.flatMap((section) => {
      const lines = section.body
        .split("\n")
        .filter((line) => /🚧|미정|확정 전|추후 결정|^[-] .*확정/.test(line) ||
          (/작업 예정|추가 설정/.test(section.title) && /^- /.test(line)))
        .map((line) => line.startsWith('|') ? '- ' + line.split('|').slice(1, -1).map(cell => cell.trim()).join(' + ').replace(/ \+ (🚧)/, ' → $1') : line);
      return lines.length ? [{ part, section, lines }] : [];
    }),
  );
}

export function getTable(body, heading) {
  const text = body.split(heading)[1]?.split(/^### /m)[0] ?? "";
  return text
    .split("\n")
    .filter((line) => line.startsWith("|") && !/^\|\s*:?-/.test(line))
    .slice(1)
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim()),
    );
}

const findSection = (part, pattern) =>
  part?.sections.find((s) => pattern.test(s.title));
const bullets = (text) =>
  [...text.matchAll(/^- (.+)$/gm)].map((m) => cleanText(m[1]));
const subsections = (body) => {
  const chunks = body.split(/^### (.+)$/m);
  const out = [];
  for (let i = 1; i < chunks.length; i += 2)
    out.push({ heading: chunks[i].trim(), body: chunks[i + 1] ?? "" });
  return out;
};

// Magic disciplines, their mottos, and which ones split off from which.
export function getMagicSystem(parts) {
  const body = findSection(parts[0], /마력 체계/)?.body ?? "";
  const disciplines = subsections(body).map(({ heading, body: text }) => {
    const m = heading.match(/^[\d-]+\.\s*(.+?)\s*\((.+?)\)(?:\s*—\s*"(.+)")?$/);
    const summary = text
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l && !/^[->|#]/.test(l));
    return {
      name: m ? m[1] : cleanText(heading),
      en: m?.[2] ?? "",
      motto: m?.[3] ?? "",
      summary: summary ? cleanText(summary) : "",
    };
  });
  const lineage = [...body.matchAll(/^>\s*-\s*(\S+)\s*←\s*(\S+?)에서 분리/gm)].map(
    (m) => ({ child: m[1], parent: m[2] }),
  );
  return { disciplines, lineage };
}

// Basic attributes with their evolved forms, fusion recipes, and aptitude-only attributes.
export function getAttributes(parts) {
  const body = findSection(parts[0], /속성/)?.body ?? "";
  const basics = getTable(body, "### 3-2.").map(([base, evolved]) => {
    const b = cleanText(base);
    const e = cleanText(evolved);
    return {
      name: b.replace(/\s*마법$/, "").replace(/\(.\)/, "").trim(),
      glyph: b.match(/\((.)\)/)?.[1] ?? "",
      evolved: e.split(" — ")[0],
      evolves: !/진화 없음/.test(e),
    };
  });
  const fusions = getTable(body, "### 3-3.").map(([a, b, result]) => ({
    a: cleanText(a),
    b: cleanText(b),
    result: /🚧/.test(result) ? "" : cleanText(result),
    pending: /🚧|미정/.test(result),
  }));
  const special = bullets(body.split("### 3-4.")[1]?.split(/^---/m)[0] ?? "");
  return { basics, fusions, special };
}

export function getGrades(parts) {
  const body = findSection(parts[0], /장비/)?.body ?? "";
  return body
    .split("\n")
    .filter((l) => /^\|\s*\*\*/.test(l))
    .map((l) => l.split("|").slice(1, -1).map((c) => cleanText(c)))
    .map(([name, en, desc]) => ({ name, en, desc }));
}

// Nations keyed by their section number so provisional names can change freely.
export function getNations(parts) {
  const out = [];
  for (const section of parts[1]?.sections ?? []) {
    for (const { heading, body } of subsections(section.body)) {
      const m = heading.match(/^(\d-\d)\.\s*(.+)$/);
      if (!m) continue;
      const [name, note = ""] = cleanText(m[2]).split(" — ");
      const fields = Object.fromEntries(
        [...body.matchAll(/^- \*\*(.+?):\*\*\s*(.+)$/gm)].map((f) => [
          f[1],
          cleanText(f[2]),
        ]),
      );
      out.push({
        id: m[1],
        name: name.trim(),
        note: note.trim(),
        motto: cleanText(body.match(/^\*\*"(.+)"\*\*$/m)?.[1] ?? ""),
        candidates:
          body.match(/명칭 후보:\*\*\s*(.+)$/m)?.[1].split(" · ").map(cleanText) ?? [],
        fields,
      });
    }
  }
  return out;
}

export function getTerrains(parts) {
  const body = findSection(parts[1], /주요 지형/)?.body ?? "";
  return body
    .split("\n")
    .filter((l) => /^\|\s*\*\*/.test(l))
    .map((l) => l.split("|").slice(1, -1).map((c) => cleanText(c)))
    .map(([name, desc]) => ({ name, desc }));
}

// Eras with numeric spans; "600~700년대" covers 600 to 799, "기록 이전" has no span.
export function getEras(parts) {
  const body = findSection(parts[2], /연표/)?.body ?? "";
  return subsections(body).map(({ heading, body: text }) => {
    const m = heading.match(/^(.+?)\s*\((.+)\)$/);
    const name = cleanText(m ? m[1] : heading);
    const range = m ? m[2] : "";
    const nums = [...range.matchAll(/\d+/g)].map((n) => Number(n[0]));
    const start = nums.length ? nums[0] : null;
    const end = nums.length ? nums[nums.length - 1] + 99 : null;
    return { name, range, start, end, events: bullets(text) };
  });
}

// The worked example from the roleplay rules, split into scene, actor, and options.
export function getTurnRules(parts) {
  const part = parts[3];
  const turn = findSection(part, /턴 구조/)?.body ?? "";
  const example = findSection(part, /진행 예시/)?.body ?? "";
  const code = example.match(/```\n([\s\S]*?)```/)?.[1] ?? "";
  const lines = code.split("\n").map((l) => l.trim());
  return {
    actions: Number(turn.match(/턴 = (\d+)개의 행동/)?.[1] ?? 3),
    options: Number(turn.match(/정확히 (\d+)개의 선택지/)?.[1] ?? 4),
    steps: [...turn.matchAll(/^\d+\.\s*(.+)$/gm)].map((m) => cleanText(m[1])),
    unit: cleanText(turn.match(/^>\s*(행동 1개 = .+)$/m)?.[1] ?? ""),
    scene: lines.find((l) => l && !/^[▶→\d]/.test(l)) ?? "",
    actor: cleanText(lines.find((l) => l.startsWith("▶")) ?? "").replace(/^▶\s*/, ""),
    choices: lines.filter((l) => /^\d\.\s/.test(l)).map((l) => l.replace(/^\d\.\s*/, "")),
  };
}

// Fun mode levels: each row names a level and how the GM's staging changes at it.
export function getFunModes(parts) {
  const body = findSection(parts[3], /재미 모드/)?.body ?? "";
  const rows = body
    .split("\n")
    .filter((line) => line.startsWith("|") && !/^\|\s*:?-/.test(line))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cleanText(cell)));
  const [head = [], ...levels] = rows;
  return levels.map(([name, ...cells]) => ({
    name,
    level: Number(name.match(/\d+/)?.[0]),
    effects: cells.map((text, i) => ({ label: head[i + 1], text })),
  }));
}

export function getCodexStats(parts) {
  const attrs = getAttributes(parts);
  return {
    attributes: attrs.basics.length,
    special: attrs.special.length,
    races: (findSection(parts[0], /종족/)?.body.match(/^### /gm) ?? []).length,
    nations: getNations(parts).length,
    terrains: getTerrains(parts).length,
    eras: getEras(parts).length,
    funLevels: getFunModes(parts).length,
    ...(({ actions, options }) => ({ actions, options }))(getTurnRules(parts)),
  };
}

export function cleanText(text) {
  return text
    .replace(/[*_`#]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/🚧/g, "검토 중")
    .trim();
}
