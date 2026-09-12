import { useState } from "react";
import "./visuals.css";

// Equipment grades rise from mass-produced gear to genesis-tier artifacts.
export default function GradeLadder({ grades }) {
  const [selected, setSelected] = useState(grades.at(-1)?.en);
  const current = grades.find((g) => g.en === selected);
  return (
    <div className="grade-ladder">
      <div className="grade-steps">
        {grades.map((g, i) => (
          <button
            type="button"
            key={g.en}
            className={`grade-step is-${g.en.toLowerCase()}${selected === g.en ? " is-selected" : ""}`}
            style={{ "--h": `${34 + (i / Math.max(grades.length - 1, 1)) * 66}%` }}
            aria-pressed={selected === g.en}
            onClick={() => setSelected(g.en)}
          >
            <span className="grade-bar" />
            <strong>{g.name}</strong>
            <small>{g.en}</small>
          </button>
        ))}
      </div>
      {current && (
        <p className="grade-detail" aria-live="polite">
          <b>{current.name}</b>
          {current.desc}
        </p>
      )}
    </div>
  );
}
