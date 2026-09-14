import { useState } from "react";
import "./visuals.css";

// The player's fun mode: picking a level fills the gauge up to it and shows how
// the GM's staging changes. The panel glows brighter as the level rises.
export default function FunModeGauge({ modes }) {
  const [level, setLevel] = useState(modes[Math.floor(modes.length / 2)]?.level ?? 1);
  const current = modes.find((m) => m.level === level);
  const max = modes.length;
  return (
    <div className="fun-gauge" style={{ "--fun": level / max }}>
      <div className="fun-head">
        <p className="fun-level" aria-live="polite">
          {current?.name}
          <small> / {max}단계</small>
        </p>
        <div className="fun-steps" role="group" aria-label="재미 모드 단계">
          {modes.map((m) => (
            <button
              type="button"
              key={m.level}
              className={`fun-step${m.level <= level ? " is-on" : ""}${m.level === level ? " is-selected" : ""}`}
              style={{ "--i": m.level }}
              aria-pressed={m.level === level}
              onClick={() => setLevel(m.level)}
            >
              <span className="fun-cell" />
              <small>{m.name}</small>
            </button>
          ))}
        </div>
      </div>
      {current && (
        <dl className="fun-effects">
          {current.effects.map((e) => (
            <div key={e.label}>
              <dt>{e.label}</dt>
              <dd>{e.text.replace(/\.$/, "").replace(/\. /g, " ")}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
