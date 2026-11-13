import type { CSSProperties } from 'react'
import { TOOLKIT } from '../data'

export default function Toolkit() {
  return (
    <section className="section" id="toolkit">
      <div className="wrap">
        <div className="section-head">
          <p className="label mono">07 — Toolkit</p>
          <div>
            <h2 className="section-title reveal-mask">
              <span className="line">
                <span>
                  What I reach for <em>first</em>.
                </span>
              </span>
            </h2>
            <p className="section-sub reveal">
              Nothing here is a badge. Each line is something I have shipped, broken, or spent a weekend
              debugging.
            </p>
          </div>
        </div>

        <div className="tool-grid">
          {TOOLKIT.map((col, i) => (
            <div
              className="tool-col reveal"
              key={col.title}
              style={{ '--delay': `${i * 0.07}s` } as CSSProperties}
            >
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
