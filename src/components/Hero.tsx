import type { CSSProperties } from 'react'
import { FACTS, LEDE, MARQUEE, PROFILE } from '../data'
import { useTilt } from '../hooks/useTilt'
import DotSphere from './DotSphere'

const delay = (s: string) => ({ '--d': s }) as CSSProperties

export default function Hero() {
  const tiltRef = useTilt<HTMLDivElement>(6)

  return (
    <section className="hero" id="top">
      <DotSphere />

      <div className="wrap">
        <div className="hero-top">
          <p className="mono">
            Portfolio <b>/</b> {PROFILE.updated}
          </p>
          <p className="mono">
            {PROFILE.location} <b>·</b> 30.0°N 31.0°E
          </p>
        </div>

        <div className="hero-grid">
          <div>
            <h1 className="display">
              <span className="line">
                <span style={delay('0.12s')}>Ziad</span>
              </span>
              <span className="line">
                <span style={delay('0.22s')}>Emad</span>
              </span>
              <span className="line">
                <span style={delay('0.32s')}>
                  <em>Ahmed</em>
                </span>
              </span>
            </h1>

            <p className="hero-role">
              {PROFILE.role} <span className="dot" aria-hidden="true" />
              Grade 12, STEM High School
            </p>

            <p className="lede">{LEDE}</p>

            <dl className="hero-facts">
              {FACTS.map(f => (
                <div className="fact" key={f.label}>
                  <dt className="mono">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="portrait">
            <div className="portrait-inner" ref={tiltRef}>
              <div className="portrait-frame">
                <img
                  src="/img/portrait.jpg"
                  alt="Ziad Emad Ahmed at the International Science and Engineering Fair"
                  width={800}
                  height={1000}
                  fetchPriority="high"
                  decoding="async"
                />
                <span className="portrait-tag">Science fair, 2026</span>
              </div>
            </div>
            <p className="portrait-caption">
              <span>Ziad Emad Ahmed</span>
              <span>Egypt</span>
            </p>
          </div>
        </div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={`${item}-${i}`}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
