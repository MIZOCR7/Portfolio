import { TOOLKIT } from '../data'

export default function Toolkit() {
  return (
    <section className="section" id="toolkit">
      <div className="wrap">
        <div className="section-head">
          <p className="label mono">03 — Toolkit</p>
          <div>
            <h2 className="section-title">
              What I reach for <em>first</em>.
            </h2>
            <p className="section-sub">
              Nothing here is a badge. Each line is something I have shipped, broken, or spent a weekend
              debugging.
            </p>
          </div>
        </div>

        <div className="tool-grid">
          {TOOLKIT.map(col => (
            <div className="tool-col reveal" key={col.title}>
              <h3>{col.title}</h3>
              <ul>
                {col.items.map(item => (
                  <li key={item.name}>
                    <span>{item.name}</span>
                    {item.note ? <small>{item.note}</small> : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
