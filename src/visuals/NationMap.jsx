import { nationEmblem } from "../nationEmblems.js";
import { nationArtwork } from "../nationArt.js";
import { useState } from "react";
import "./visuals.css";

// Rough placement by the direction each section gives (west kingdom, central
// empire, canyon city pair, northern tribes, southern isles). Places with no
// stated location are set beside the relations they take part in.
const LAYOUT = {
  "3-1": [150, 250],
  "3-2": [470, 235],
  "3-3": [330, 360],
  "3-4": [330, 425],
  "4-1": [640, 140],
  "4-2": [215, 120],
  "4-3": [310, 230],
  "4-4": [560, 415],
  "4-5": [470, 70],
  "4-6": [665, 320],
  "4-7": [670, 440],
};
const TONE = { "3-1": "order", "3-2": "force", "4-6": "hazard" };
// Names sit below their dot unless that would collide with a neighbour.
const LABEL_ABOVE = new Set(["3-3", "4-4", "4-5", "4-2", "4-1", "4-7"]);

// Relation meanings come from the geography chapter's relations section.
const EDGES = [
  ["3-1", "3-2", "rival", "숙적"],
  ["3-3", "3-4", "bond", "착취와 의존"],
  ["4-3", "3-1", "tension", "탈주 마술사 갈등"],
  ["3-2", "4-3", "courting", "회유와 포섭"],
  ["3-2", "4-1", "threat", "팽창 위협"],
  ["3-2", "4-2", "threat", "팽창 위협"],
  ["3-2", "4-4", "threat", "팽창 위협"],
  ["3-2", "4-5", "threat", "팽창 위협"],
  ["3-2", "4-7", "threat", "국경 긴장"],
  ["4-7", "4-4", "bond", "교역"],
  ["4-7", "4-5", "bond", "정보 공유"],
  ["4-2", "3-1", "supply", "무구 공급"],
  ["4-2", "3-3", "supply", "무구 공급"],
];
const LEGEND = [
  ["rival", "숙적"],
  ["bond", "착취와 의존"],
  ["tension", "갈등"],
  ["courting", "회유와 포섭"],
  ["threat", "팽창 위협"],
  ["supply", "무구 공급"],
];
const DETAIL_FIELDS = ["위치", "통치", "이념", "종족·체계", "성격", "상황", "대외 관계"];

export default function NationMap({ nations }) {
  const known = nations.filter((n) => LAYOUT[n.id]);
  const [selected, setSelected] = useState(known[0]?.id ?? null);
  const byId = new Map(known.map((n) => [n.id, n]));
  const current = byId.get(selected);
  const edges = EDGES.filter(([a, b]) => byId.has(a) && byId.has(b));
  const touches = (a, b) => selected === a || selected === b;

  return (
    <div className="nation-map">
      <svg viewBox="0 0 760 480" className="nation-svg" role="group" aria-label="세력 관계도">
        <defs>
          <marker id="nation-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10Z" className="nation-arrowhead" />
          </marker>
        </defs>
        {edges.map(([a, b, type, label]) => {
          const [x1, y1] = LAYOUT[a];
          const [x2, y2] = LAYOUT[b];
          return (
            <g key={`${a}-${b}`} className={`nation-edge is-${type}${touches(a, b) ? " is-lit" : ""}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} markerEnd={type === "threat" ? "url(#nation-arrow)" : undefined} />
              {touches(a, b) && (
                <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8}>
                  {label}
                </text>
              )}
            </g>
          );
        })}
        {known.map((n) => {
          const [x, y] = LAYOUT[n.id];
          const tone = TONE[n.id] ?? (n.id.startsWith("3-") ? "motif" : "free");
          return (
            <g
              key={n.id}
              className={`nation-node is-${tone}${selected === n.id ? " is-selected" : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={selected === n.id}
              aria-label={n.name}
              onClick={() => setSelected(n.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(n.id);
                }
              }}
            >
              {tone === "hazard" && <circle cx={x} cy={y} r="22" className="nation-pulse" />}
              <circle cx={x} cy={y} r={tone === "order" || tone === "force" ? 15 : 11} className="nation-dot" />
              {nationEmblem(n.id) && <image href={nationEmblem(n.id)} x={x - 21} y={y - 21} width="42" height="42" className="nation-emblem-node" aria-hidden="true" />}
              <text x={x} y={LABEL_ABOVE.has(n.id) ? y - 24 : y + 38}>{n.name}</text>
            </g>
          );
        })}
      </svg>
      <ul className="nation-legend">
        {LEGEND.map(([type, label]) => (
          <li key={type}>
            <svg viewBox="0 0 32 10" aria-hidden="true" className={`nation-edge is-${type} is-lit`}>
              <line x1="1" y1="5" x2="31" y2="5" />
            </svg>
            {label}
          </li>
        ))}
      </ul>
      {current && (
        <div className="nation-detail" aria-live="polite">
          {nationArtwork(current.id) && <img className="nation-detail-art" src={nationArtwork(current.id)} alt={`${current.name} 환경 콘셉트 아트`} width="1440" height="810" />}
          <p className="nation-detail-kind">{current.id.startsWith("3-") ? "모티브 국가" : current.id === "4-6" ? "비국가 지역" : "신규 세력"}</p>
          {nationEmblem(current.id) && <figure className="nation-emblem-detail"><img src={nationEmblem(current.id)} alt={`${current.name} 문장 초안`} width="96" height="96" /><figcaption>문장 초안</figcaption></figure>}
          <h3>{current.name}</h3>
          {current.motto && <p className="nation-motto">{current.motto}</p>}
          {current.note && <p className="nation-note">{current.note}</p>}
          <dl>
            {DETAIL_FIELDS.filter((f) => current.fields[f]).slice(0, 4).map((f) => (
              <div key={f}>
                <dt>{f}</dt>
                <dd>{current.fields[f]}</dd>
              </div>
            ))}
          </dl>
          {current.candidates.length > 0 && (
            <p className="nation-candidates">
              <span>이름 후보</span>
              {current.candidates.map((c) => (
                <b key={c}>{c}</b>
              ))}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
