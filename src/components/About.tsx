import type { CSSProperties } from 'react'
import { ABOUT, PROFILE } from '../data'

export default function About() {
  const [l1, l2, l3] = ABOUT.title

  return (
    <section className="section about" id="about">
      <div className="wrap">
        <div className="about-head">
          <p className="label mono">{ABOUT.kicker}</p>
          <p className="about-coord mono">
            {PROFILE.location} · 29.93° N, 30.92° E
          </p>
        </div>

        <div className="about-grid">
          <div className="about-left">
            <h2 className="about-title reveal-mask">
              <span className="line">
                <span>{l1}</span>
              </span>
              <span className="line">
                <span>{l2}</span>
              </span>
              <span className="line">
                <span>
                  <em>{l3}</em>
                </span>
              </span>
            </h2>

            <div className="about-portrait reveal-img">
              <img
                src={ABOUT.portraits[0].src}
                alt={ABOUT.portraits[0].alt}
                width={ABOUT.portraits[0].w}
                height={ABOUT.portraits[0].h}
                loading="lazy"
                decoding="async"
              />
              <span className="about-portrait-cap mono">
                Ziad Emad · 2026
              </span>
            </div>
          </div>

          <div className="about-right">
            <p className="about-lead reveal">{ABOUT.lead}</p>
            {ABOUT.body.map((p, i) => (
              <p
                className="about-p reveal"
                key={i}
                style={{ '--delay': `${0.05 * i}s` } as CSSProperties}
              >
                {p}
              </p>
            ))}

            <dl className="about-values">
              {ABOUT.values.map((v, i) => (
                <div
                  className="reveal"
                  key={v.k}
                  style={{ '--delay': `${0.06 * i}s` } as CSSProperties}
                >
                  <dt>
                    <span className="mono">{String(i + 1).padStart(2, '0')}</span> {v.k}
                  </dt>
                  <dd>{v.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
