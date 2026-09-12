import { useState } from "react";
import "./visuals.css";

// Eras overlap in the chronicle, so each bar takes the first lane that is free
// at its start year; stacked bars mean the eras ran side by side.
function lanes(eras) {
  const ends = [];
  return eras.map((era) => {
    let lane = ends.findIndex((end) => end < era.start);
    if (lane === -1) lane = ends.length;
    ends[lane] = era.end;
    return lane;
  });
}

export default function EraTimeline({ eras }) {
  const dated = eras.filter((e) => e.start !== null);
  const mythic = eras.filter((e) => e.start === null);
  const max = Math.ceil((Math.max(...dated.map((e) => e.end)) + 1) / 100) * 100;
  const laneOf = lanes(dated);
  const laneCount = Math.max(...laneOf) + 1;
  const [selected, setSelected] = useState(eras.at(-1)?.name);
  const current = eras.find((e) => e.name === selected);
  const ticks = Array.from({ length: max / 100 + 1 }, (_, i) => i * 100);
  const nowName = dated.at(-1)?.name;

  const bar = (era, style, extra = "") => (
    <button
      type="button"
      key={era.name}
      className={`era-bar${extra}${selected === era.name ? " is-selected" : ""}${era.name === nowName ? " is-now" : ""}`}
      style={style}
      aria-pressed={selected === era.name}
      onClick={() => setSelected(era.name)}
    >
      <span>{era.name}</span>
    </button>
  );

  return (
    <div className="era-timeline">
      <div className="era-chart" style={{ "--lanes": laneCount }}>
        <div className="era-mythic">
          {mythic.map((e) => bar(e, {}, " is-mythic"))}
        </div>
        <div className="era-track">
          {ticks.map((t) => (
            <span key={t} className="era-tick" style={{ left: `${(t / max) * 100}%` }}>
              <i>{t === 0 ? "대륙력 0년" : t}</i>
            </span>
          ))}
          {dated.map((e, i) =>
            bar(e, {
              left: `${(e.start / max) * 100}%`,
              width: `${((e.end - e.start + 1) / max) * 100}%`,
              top: `calc(${laneOf[i]} * var(--lane-h))`,
            }),
          )}
        </div>
      </div>
      {current && (
        <div className="era-detail" aria-live="polite">
          <p className="era-range">{current.range}</p>
          <h3>{current.name}</h3>
          <ul>
            {current.events.map((ev) => (
              <li key={ev}>{ev}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
