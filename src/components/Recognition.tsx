import type { CSSProperties } from 'react'
import { CERTIFICATES } from '../data'

export default function Recognition() {
  return (
    <section className="section" id="recognition">
      <div className="wrap">
        <div className="section-head">
          <p className="label mono">03 — The wall</p>
          <div>
            <h2 className="section-title reveal-mask">
              <span className="line">
                <span>Proof,</span>
              </span>
              <span className="line">
                <span>
                  in <em>frames</em>.
                </span>
              </span>
            </h2>
            <p className="section-sub reveal">
              Certificates from the national science fair, ICPC Teens, NASA Space Apps, the Earth Prize, and the
              two teams I helped lead. Click any print to open it full size.
            </p>
          </div>
        </div>

        <div className="wall">
          {CERTIFICATES.map((c, i) => (
            <figure
              className={c.span ? 'print print--wide reveal' : 'print reveal'}
              key={c.title}
              style={{ '--r': `${i % 2 === 0 ? -1.1 : 1.3}deg`, '--delay': `${(i % 4) * 0.07}s` } as CSSProperties}
            >
              <a className="print-mat" href={c.image} target="_blank" rel="noopener noreferrer">
                <img
                  src={c.image}
                  alt={`${c.title} certificate awarded to Ziad Emad Ahmed`}
                  width={1000}
                  height={700}
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <figcaption>
                <span className="print-title">{c.title}</span>
                <span className="print-meta">
                  {c.org} · {c.year}
                </span>
                <span className="print-note">{c.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="wall-note mono">
          Plus: Earth Prize · Physics Brawl · Computer Network Fundamentals · AWS Scholars · Be My Eyes volunteer
        </p>
      </div>
    </section>
  )
}
