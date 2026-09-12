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

export function cleanText(text) {
  return text
    .replace(/[*_`#]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/🚧/g, "검토 중")
    .trim();
}
