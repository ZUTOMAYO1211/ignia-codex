import { useState } from "react";
import "./visuals.css";

// Racial modifiers read best side by side, so every race in a group is a row of
// the same seven cells and the numbers line up into columns you can scan down.
// Picking a row opens what the race is good for and where it is usually found.
export default function RaceBoard({ races, stats, regions }) {
  const groups = [...new Set(races.map((r) => r.group))];
  const [group, setGroup] = useState(groups[0]);
  const [name, setName] = useState(races[0]?.name);
  const shown = races.filter((r) => r.group === group);
  const current = races.find((r) => r.name === name);
  const region = regions.find((r) => current && r.common.includes(current.name));

  const pick = (g) => {
    setGroup(g);
    setName(races.find((r) => r.group === g)?.name);
  };

  return (
    <div className="race-board">
      <div className="race-groups" role="tablist" aria-label="종족군">
        {groups.map((g) => (
          <button
            type="button"
            key={g}
            role="tab"
            aria-selected={g === group}
            className={`race-group${g === group ? " is-on" : ""}`}
            onClick={() => pick(g)}
          >
            {g}
            <small>{races.filter((r) => r.group === g).length}</small>
          </button>
        ))}
      </div>

      <div className="race-grid">
        <div className="race-head" aria-hidden="true">
          <span />
          {stats.map((s) => (
            <abbr key={s.code} title={`${s.name} — ${s.effect}`}>
              {s.code}
            </abbr>
          ))}
        </div>
        <ul>
          {shown.map((race) => {
            const by = Object.fromEntries(race.mods);
            return (
              <li key={race.name}>
                <button
                  type="button"
                  className={`race-row${race.name === name ? " is-on" : ""}`}
                  aria-pressed={race.name === name}
                  onClick={() => setName(race.name)}
                >
                  <span className="race-name">
                    {race.name}
                    {race.note && race.mods.length > 0 && <i title={race.note}>＋</i>}
                  </span>
                  {race.mods.length === 0 ? (
                    <span className="race-free">{race.note}</span>
                  ) : (
                    stats.map((s) => {
                      const v = by[s.code] ?? 0;
                      return (
                        <span
                          key={s.code}
                          className={`race-cell${v > 0 ? " is-up" : v < 0 ? " is-down" : ""}`}
                          style={{ "--w": Math.abs(v) }}
                        >
                          <b>{v > 0 ? `+${v}` : v < 0 ? v : ""}</b>
                        </span>
                      );
                    })
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {current && (
        <div className="race-detail" aria-live="polite">
          <h3>
            {current.name}
            {current.note && <em>{current.note}</em>}
          </h3>
          <dl>
            <div>
              <dt>이야기에서의 이점</dt>
              <dd>{current.perk}</dd>
            </div>
            <div>
              <dt>주요 분포</dt>
              <dd>{current.where}</dd>
            </div>
            {region && (
              <div>
                <dt>{region.region}에서</dt>
                <dd>흔하게 보이는 종족이다{region.rare && ` · 드물게는 ${region.rare}`}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
