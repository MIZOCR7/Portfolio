import { useState } from 'react'
import { ALSO_ON_FILE, CERTIFICATES } from '../data'
import Lightbox from './Lightbox'

const ITEMS = CERTIFICATES.map(c => ({
  src: c.image,
  alt: `${c.title} certificate awarded to Ziad Emad Ahmed`,
  title: c.title,
  meta: `${c.org} · ${c.year}`,
  note: c.note,
}))

export default function Recognition() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="section" id="recognition">
      <div className="wrap">
        <div className="section-head">
          <p className="label mono">04 — The wall</p>
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
              Eleven documents, in date order of what they cost me: a national science fair, a programming
              contest, a course taught to children, and two small pieces of paper with METU’s name on them. Open
              any print to read it properly.
            </p>
          </div>
        </div>

        <div className="wall">
          {CERTIFICATES.map((c, i) => (
            <figure className={c.span ? 'print print--wide' : 'print'} key={c.title}>
              <button
                className="print-mat"
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Open the ${c.title} certificate`}
              >
                <img
                  src={c.image}
                  alt={`${c.title} certificate awarded to Ziad Emad Ahmed`}
                  width={1000}
                  height={700}
                  loading="lazy"
                  decoding="async"
                />
              </button>
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

        <p className="wall-note mono">{ALSO_ON_FILE}</p>
      </div>

      <Lightbox items={ITEMS} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </section>
  )
}
