import type { CSSProperties } from 'react'
import { TIMELINE } from '../data'

export default function Resume() {
  return (
    <section className="section section--deep" id="resume">
      <div className="wrap">
        <div className="section-head">
          <p className="label mono">04 — Résumé</p>
          <div>
            <h2 className="section-title reveal-mask">
              <span className="line">
                <span>School, teams and</span>
              </span>
              <span className="line">
                <span>
                  the <em>small wins</em>.
                </span>
              </span>
            </h2>
            <p className="section-sub reveal">
              A short version of the CV. Press the PDF button in the corner for a clean one-page printout.
            </p>
          </div>
        </div>

        <div className="rows">
          {TIMELINE.map((row, i) => (
            <div
              className="row reveal"
              key={row.what}
              style={{ '--delay': `${i * 0.06}s` } as CSSProperties}
            >
              <span className="year">{row.year}</span>
              <span className="what">
                <b>{row.what}</b>
                <span>{row.sub}</span>
              </span>
              <span className="note">{row.note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
