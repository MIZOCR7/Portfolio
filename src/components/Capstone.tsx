import { CASE_COLUMNS, STATS } from '../data'

export default function Capstone() {
  return (
    <section className="section" id="capstone">
      <div className="wrap">
        <div className="section-head">
          <p className="label mono">02 — Case study</p>
          <div>
            <h2 className="section-title">
              Inside a pipe, nobody can see the <em>cracks</em>.
            </h2>
            <p className="section-sub">
              Grade 12 capstone, built with three teammates across a full school year: one rover, one dataset and
              a lot of ruined test frames.
            </p>
          </div>
        </div>

        <div className="stats reveal">
          {STATS.map(s => (
            <div className="stat" key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="cols reveal">
          {CASE_COLUMNS.map(c => (
            <div key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>

        <figure className="figure reveal">
          <div className="media">
            <img
              src="/img/detections.jpg"
              alt="Contact sheet of pipe inspection frames with predicted bounding boxes drawn around corrosion and cracks"
              width={960}
              height={974}
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption>
            <span>Validation set — predicted masks over inspection frames</span>
            <span>4 sources merged · de-duplicated · labels re-checked by hand</span>
          </figcaption>
        </figure>

        <blockquote className="pull reveal">
          A model is only as good as the labels you are still willing to <em>re-check by hand</em>.
        </blockquote>
      </div>
    </section>
  )
}
