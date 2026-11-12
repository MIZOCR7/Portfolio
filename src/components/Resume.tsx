import { TIMELINE } from '../data'

export default function Resume() {
  return (
    <section className="section" id="resume">
      <div className="wrap">
        <div className="section-head">
          <p className="label mono">04 — Résumé</p>
          <div>
            <h2 className="section-title">
              School, teams and the <em>small wins</em>.
            </h2>
            <p className="section-sub">
              A short version of the CV. Press the PDF button in the corner for a clean one-page printout.
            </p>
          </div>
        </div>

        <div className="rows reveal">
          {TIMELINE.map(row => (
            <div className="row" key={row.what}>
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
