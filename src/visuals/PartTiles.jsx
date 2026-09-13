import SpotlightCard from "../components/SpotlightCard.jsx";
import CountUp from "../components/CountUp.jsx";
import { elementIcon } from "../elementIcons.js";
import "./visuals.css";

const Num = ({ value, still }) =>
  still ? <span>{value}</span> : <CountUp to={value} duration={1.2} />;

function Mini({ kind, data }) {
  if (kind === "attributes")
    return (
      <div className="mini-glyphs" aria-hidden="true">
        {data.basics.map((b) => (
          <img key={b.glyph} src={elementIcon(b.glyph)} alt="" width="36" height="36" className="element-image" />
        ))}
      </div>
    );
  if (kind === "nations")
    return (
      <div className="mini-dots" aria-hidden="true">
        {data.nations.map((n) => (
          <span key={n.id} className={n.id.startsWith("3-") ? "is-motif" : ""} />
        ))}
      </div>
    );
  if (kind === "eras") {
    const dated = data.eras.filter((e) => e.start !== null);
    const max = Math.max(...dated.map((e) => e.end)) + 1;
    return (
      <div className="mini-gantt" aria-hidden="true">
        {dated.map((e, i) => (
          <span
            key={e.name}
            className={i === dated.length - 1 ? "is-now" : ""}
            style={{
              left: `${(e.start / max) * 100}%`,
              width: `${((e.end - e.start + 1) / max) * 100}%`,
              top: `${(i % 3) * 10}px`,
            }}
          />
        ))}
      </div>
    );
  }
  return (
    <div
      className="mini-turn"
      aria-hidden="true"
      style={{ gridTemplateColumns: `repeat(${data.turn.options}, 1fr)` }}
    >
      {Array.from({ length: data.turn.actions * data.turn.options }, (_, i) => (
        <span key={i} className={i % data.turn.options === data.turn.options - 1 ? "is-free" : ""} />
      ))}
    </div>
  );
}

export default function PartTiles({ tiles, data, still }) {
  return (
    <div className="part-tiles">
      {tiles.map((tile) => (
        <SpotlightCard
          key={tile.href}
          className="part-tile"
          spotlightColor="rgba(143, 128, 245, 0.32)"
        >
          <a href={tile.href} className="part-tile-link">
            <span className="part-tile-label">{tile.label}</span>
            <strong className="part-tile-title">{tile.title}</strong>
            <Mini kind={tile.kind} data={data} />
            <dl className="part-tile-stats">
              {tile.stats.map(([label, value, suffix]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>
                    <Num value={value} still={still} />
                    {suffix}
                  </dd>
                </div>
              ))}
            </dl>
          </a>
        </SpotlightCard>
      ))}
    </div>
  );
}
