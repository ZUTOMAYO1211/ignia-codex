import { useState } from "react";
import { FUN_STEPS, FUN_DEFAULT } from "../content.js";
import "./visuals.css";

// Fun mode is not one level any more: every dial is set on its own from 0 to 4.
// The presets fill the whole board at once, and the summary line is the string
// the player pastes into the game start prompt.
export default function FunModeGauge({ dials, presets }) {
  const base = Object.fromEntries(dials.map((d) => [d.name, FUN_DEFAULT]));
  const [values, setValues] = useState(base);
  const [copied, setCopied] = useState(false);
  const set = (name, value) => {
    setValues({ ...values, [name]: value });
    setCopied(false);
  };
  const apply = (preset) => {
    setValues({ ...base, ...preset.values });
    setCopied(false);
  };
  const summary = dials
    .filter((d) => values[d.name] !== FUN_DEFAULT)
    .map((d) => `${d.name} ${values[d.name]}`)
    .join(" · ");

  async function copy() {
    try {
      await navigator.clipboard.writeText(summary || "전 항목 2");
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="fun-board">
      <div className="fun-presets">
        <span>설정 예시</span>
        {presets.map((p) => (
          <button type="button" key={p.name} onClick={() => apply(p)}>
            {p.name}
          </button>
        ))}
      </div>
      <ul className="fun-dials">
        {dials.map((d) => {
          const value = values[d.name];
          return (
            <li key={d.name} className="fun-dial" style={{ "--v": value }}>
              <p className="fun-dial-name">
                {d.name}
                <small>{d.about}</small>
              </p>
              <div className="fun-track" role="group" aria-label={d.name}>
                {FUN_STEPS.map((step, i) => (
                  <button
                    type="button"
                    key={step}
                    className={`fun-notch${i <= value ? " is-on" : ""}${i === value ? " is-selected" : ""}`}
                    aria-pressed={i === value}
                    aria-label={`${d.name} ${i} ${step}`}
                    onClick={() => set(d.name, i)}
                  >
                    <b>{i}</b>
                  </button>
                ))}
              </div>
              <p className="fun-dial-read">
                <b>{FUN_STEPS[value]}</b>
                <span>{value === 0 ? d.low : value === 4 ? d.high : ""}</span>
              </p>
            </li>
          );
        })}
      </ul>
      <div className="fun-summary">
        <p>
          <span>설정값</span>
          <b>{summary || "전 항목 2 (기본값)"}</b>
        </p>
        <button type="button" className={`fun-copy${copied ? " is-done" : ""}`} onClick={copy}>
          {copied ? "복사됨" : "복사"}
        </button>
      </div>
    </div>
  );
}
