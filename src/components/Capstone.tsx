import type { CSSProperties } from 'react'
import { CASE_COLUMNS, STATS } from '../data'

export default function Capstone() {
  return (
    <section className="section section--ink" id="capstone">
      <div className="wrap">
        <div className="section-head">
          <p className="label mono">02 — Case study</p>
          <div>
            <h2 className="section-title reveal-mask">
              <span className="line">
                <span>Inside a pipe,</span>
              </span>
              <span className="line">
                <span>
                  nobody can see <em>the cracks</em>.
                </span>
              </span>
            </h2>
            <p className="section-sub reveal">
              Grade 12 capstone, built with three teammates across a full school year: one rover, one dataset
              and a lot of ruined test frames.
            </p>
          </div>
        </div>
      </div>

      <div className="wrap">
        <figure className="hero-shot reveal-img">
          <img
            src="/img/pipe-strip.jpg"
            alt="Four inspection camera frames from inside pipes: hairline cracks, heavy orange corrosion and a long fracture"
            width={2240}
            height={560}
            loading="lazy"
            decoding="async"
          />
          <figcaption>Raw inspection footage · the model has to read all four of these</figcaption>
        </figure>

        <div className="stats reveal">
          {STATS.map((s, i) => (
            <div className="stat" key={s.label} style={{ '--delay': `${i * 0.06}s` } as CSSProperties}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="cols">
          {CASE_COLUMNS.map((c, i) => (
            <div key={c.title} className="reveal" style={{ '--delay': `${0.1 + i * 0.08}s` } as CSSProperties}>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>

        <figure className="figure reveal">
          <div className="media reveal-img">
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
