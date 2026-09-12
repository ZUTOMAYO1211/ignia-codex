import SpotlightCard from "../components/SpotlightCard.jsx";
import "./visuals.css";

function Node({ d, from }) {
  return (
    <SpotlightCard className="magic-node" spotlightColor="rgba(143, 128, 245, 0.3)">
      {from && <span className="magic-from">{from}에서 갈라짐</span>}
      <h3>
        {d.name}
        <small>{d.en}</small>
      </h3>
      {d.motto && <p className="magic-motto">{d.motto}</p>}
      <p className="magic-summary">{d.summary}</p>
    </SpotlightCard>
  );
}

// Parent disciplines sit on the left and the ones that split from them on the right.
export default function MagicLineage({ disciplines, lineage }) {
  const order = disciplines.map((d) => d.name);
  const byName = Object.fromEntries(disciplines.map((d) => [d.name, d]));
  const rows = lineage
    .filter((l) => byName[l.parent] && byName[l.child])
    .sort((a, b) => order.indexOf(a.parent) - order.indexOf(b.parent));
  const linked = new Set(rows.flatMap((r) => [r.parent, r.child]));
  const rest = disciplines.filter((d) => !linked.has(d.name));
  return (
    <div className="magic-lineage">
      {rows.map((r) => (
        <div className="lineage-row" key={r.child}>
          <Node d={byName[r.parent]} />
          <div className="lineage-link" aria-hidden="true">
            <svg viewBox="0 0 120 24" preserveAspectRatio="none">
              <path d="M2 12H110" className="lineage-flow" />
              <path d="M104 5 116 12 104 19" className="lineage-head" />
            </svg>
            <span>분리</span>
          </div>
          <Node d={byName[r.child]} from={r.parent} />
        </div>
      ))}
      {rest.length > 0 && (
        <div className="lineage-rest">
          {rest.map((d) => (
            <Node d={d} key={d.name} />
          ))}
        </div>
      )}
    </div>
  );
}
