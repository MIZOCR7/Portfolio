import { useState } from 'react'
import { METU } from '../data'
import Lightbox from './Lightbox'
import TurkishFlag from './TurkishFlag'

const ITEMS = METU.evidence.map(e => ({
  src: e.image,
  alt: e.alt,
  title: e.title,
  meta: `${e.org} · ${e.date}`,
  note: e.note,
}))

export default function Metu() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="metu" id="metu">
      <figure className="metu-open">
        <img
          src="/img/metu-sign.jpg"
          alt="The METU campus entrance sign in Ankara, with the university's red and white emblem"
          width={800}
          height={512}
          loading="lazy"
          decoding="async"
        />
        <div className="metu-open-in">
          <p className="mono">06 — Where this is going</p>
          <h2 className="metu-title">
            <span>{METU.title},</span>
            <span className="metu-year">{METU.year}</span>
          </h2>
          <p className="mono">{METU.coordinates}</p>
        </div>
      </figure>

      <div className="wrap">
        <div className="metu-grid">
          <div className="metu-text">
            <p className="metu-lead reveal">{METU.lead}</p>

            {METU.body.map((p, i) => (
              <p className="metu-p reveal" key={i} style={{ transitionDelay: `${0.05 * i}s` }}>
                {p}
              </p>
            ))}

            <div className="metu-stamp reveal">
              <TurkishFlag className="stamp-flag" />
              <div>
                <span className="stamp-title">Türkiye Bursları</span>
                <span className="stamp-sub">METU · Computer Engineering · Ankara</span>
              </div>
            </div>
          </div>

          <div className="metu-side">
            <p className="metu-side-label mono">What METU has already given me</p>

            {METU.evidence.map((e, i) => (
              <figure className="evidence" key={e.title}>
                <button
                  className="evidence-btn"
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`Open the ${e.title} certificate`}
                >
                  <img
                    src={e.image}
                    alt={e.alt}
                    width={1000}
                    height={706}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
                <figcaption>
                  <span className="evidence-title">{e.title}</span>
                  <span className="evidence-meta mono">
                    {e.org} · {e.date}
                  </span>
                  <span className="evidence-note">{e.note}</span>
                </figcaption>
              </figure>
            ))}

            <div className="crest">
              <img src="/img/metu-logo.png" alt="The official METU emblem" width={604} height={238} loading="lazy" />
              <p className="crest-note">
                The university’s emblem, reproduced unmodified. No affiliation beyond the two documents above —
                not yet.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap">
        <p className="metu-credit mono">
          Campus photograph from the application folder. Ankara, 39.93° N — 32.85° E.
        </p>
      </div>

      <Lightbox items={ITEMS} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </section>
  )
}
