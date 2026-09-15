import { elementIcon } from "../elementIcons.js";
import { attributeIcon } from "../attributeIcons.js";
import { useState } from "react";
import { elementColor } from "./palette.js";
import "./visuals.css";

const SIZE = 660;
const C = SIZE / 2;
const NODE_R = 172;
const LABEL_R = 240;

const polar = (i, n, r) => {
  const a = (i / n) * Math.PI * 2 - Math.PI / 2;
  return [C + r * Math.cos(a), C + r * Math.sin(a), Math.cos(a)];
};

// Seven evolving attributes ring the wheel; the one that never evolves (無)
// sits at the centre. Chords join evolved magics that fuse, dashed while undecided.
export default function AttributeWheel({ basics, fusions, special }) {
  const [active, setActive] = useState(null);
  const ring = basics.filter((b) => b.evolves);
  const core = basics.filter((b) => !b.evolves);
  const pos = new Map(ring.map((b, i) => [b.glyph, polar(i, ring.length, NODE_R)]));
  const byGlyph = new Map(basics.map((b) => [b.glyph, b]));
  const current = active ? byGlyph.get(active) : null;
  const related = (f) => current && (f.aGlyph === current.glyph || f.bGlyph === current.glyph);
  const chords = fusions.filter((f) => pos.has(f.aGlyph) && pos.has(f.bGlyph));
  const decided = fusions.filter((f) => !f.pending).length;

  const nodeProps = (b) => ({
    role: "button",
    tabIndex: 0,
    "aria-pressed": active === b.glyph,
    "aria-label": `${b.name}(${b.glyph}) ${b.evolves ? `상위 마법 ${b.evolved}` : "진화 없음"}`,
    onClick: () => setActive(active === b.glyph ? null : b.glyph),
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActive(active === b.glyph ? null : b.glyph);
      }
    },
    onMouseEnter: () => setActive(b.glyph),
    className: `wheel-node${active === b.glyph ? " is-active" : ""}`,
    style: { "--el": elementColor(b.glyph) },
  });

  return (
    <div className={`attr-wheel${active ? " has-active" : ""}`}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="wheel-svg">
        <circle cx={C} cy={C} r={NODE_R} className="wheel-orbit" />
        <circle cx={C} cy={C} r="62" className="wheel-orbit is-inner" />
        {chords.map((f) => {
          const [x1, y1] = pos.get(f.aGlyph);
          const [x2, y2] = pos.get(f.bGlyph);
          // Bend each chord a little toward the centre and label it near its
          // first attribute so labels never sit under the core node.
          const qx = (x1 + x2) / 2 + (C - (x1 + x2) / 2) * 0.3;
          const qy = (y1 + y2) / 2 + (C - (y1 + y2) / 2) * 0.3;
          const t = 0.3;
          const lx = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * qx + t ** 2 * x2;
          const ly = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * qy + t ** 2 * y2;
          return (
            <g
              key={`${f.a}-${f.b}`}
              className={`wheel-chord${f.pending ? " is-pending" : ""}${related(f) ? " is-related" : ""}`}
            >
              <path d={`M${x1} ${y1} Q${qx} ${qy} ${x2} ${y2}`} />
              <text x={lx} y={ly + 5}>
                {f.pending ? "미정" : f.result}
              </text>
            </g>
          );
        })}
        {ring.map((b, i) => {
          const [x, y] = polar(i, ring.length, NODE_R);
          const [lx, ly, cos] = polar(i, ring.length, LABEL_R);
          const anchor = Math.abs(cos) < 0.2 ? "middle" : cos > 0 ? "start" : "end";
          return (
            <g key={b.glyph} {...nodeProps(b)}>
              <circle cx={x} cy={y} r="38" className="wheel-dot" />
              <image href={elementIcon(b.glyph)} x={x - 32} y={y - 32} width="64" height="64" className="wheel-icon" aria-hidden="true" />
              <text x={lx} y={ly - 6} textAnchor={anchor} className="wheel-name">
                {b.name}
              </text>
              <text x={lx} y={ly + 18} textAnchor={anchor} className="wheel-evolved">
                {b.evolved}
              </text>
            </g>
          );
        })}
        {core.map((b) => (
          <g key={b.glyph} {...nodeProps(b)}>
            <circle cx={C} cy={C} r="42" className="wheel-dot is-core" />
            <image href={elementIcon(b.glyph)} x={C - 35} y={C - 35} width="70" height="70" className="wheel-icon" aria-hidden="true" />
          </g>
        ))}
      </svg>
      <div className="wheel-detail" aria-live="polite">
        {current ? (
          <>
            <div className="attribute-progression" aria-label={current.evolves ? `${current.name} 마법에서 ${current.evolved}으로 진화` : `${current.name} 마법은 진화하지 않음`}>
              <img className="element-image" src={elementIcon(current.glyph)} alt="" width="64" height="64" />
              {current.evolves && <span aria-hidden="true">→</span>}
              {current.evolves && <img className="element-image" src={attributeIcon(current.evolved)} alt="" width="64" height="64" />}
            </div>
            <h3>{current.name} 마법</h3>
            <p>
              {current.evolves
                ? `숙련도가 오르면 ${current.evolved}으로 진화한다`
                : "진화하지 않고 어떤 속성 저항에도 깎이지 않는 순수 마력이다"}
            </p>
            <ul className="wheel-fusions">
              {fusions
                .filter((f) => f.aGlyph === current.glyph || f.bGlyph === current.glyph)
                .map((f) => (
                  <li key={`${f.a}-${f.b}`} className={f.pending ? "is-pending" : ""}>
                    <span>{f.a} + {f.b}</span>
                    <b>
                      {attributeIcon(f.result) && <img src={attributeIcon(f.result)} alt="" width="28" height="28" />}
                      {f.pending ? "미정" : f.result}
                    </b>
                  </li>
                ))}
            </ul>
          </>
        ) : (
          <>
            <h3>융합 조합 {fusions.length}개</h3>
            <p>
              확정 {decided}개 미정 {fusions.length - decided}개
              <br />
              속성을 누르면 진화한 마법과 조합이 보인다
            </p>
          </>
        )}
        <div className="wheel-special">
          <h4>적성이 있어야 쓰는 특수 속성 {special.length}종</h4>
          <ul>
            {special.map((s) => (
              <li key={s}>
                {attributeIcon(s) && <img src={attributeIcon(s)} alt="" width="28" height="28" />}
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
