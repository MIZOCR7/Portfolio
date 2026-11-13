import { useState } from 'react'
import { ARCHIVE } from '../data'
import Lightbox from './Lightbox'

const ITEMS = ARCHIVE.map(s => ({ src: s.src, alt: s.alt, title: s.title, meta: s.meta }))

export default function Archive() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="section archive" id="archive">
      <div className="wrap">
        <div className="section-head">
          <p className="label mono">05 — Visual archive</p>
          <div>
            <h2 className="section-title reveal-mask">
              <span className="line">
                <span>Pictures from</span>
              </span>
              <span className="line">
                <span>
                  the <em>workbench</em>.
                </span>
              </span>
            </h2>
            <p className="section-sub reveal">
              Not a gallery of finished things. Prototypes mid-failure, a contest floor, a field modelled in
              Blender at 2 a.m., and the campus I have only seen in photographs. Open any frame to see it full
              size.
            </p>
          </div>
        </div>

        <div className="grid">
          {ARCHIVE.map((s, i) => (
            <figure className={s.span ? `frame frame--${s.span}` : 'frame'} key={s.src}>
              <button
                className="frame-btn"
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Open ${s.title} full screen`}
              >
                <img
                  src={s.src}
                  alt={s.alt}
                  loading="lazy"
                  decoding="async"
                  style={{ aspectRatio: s.ratio }}
                />
                <span className="frame-zoom mono" aria-hidden="true">
                  View
                </span>
              </button>
              <figcaption>
                <span className="frame-title">{s.title}</span>
                <span className="frame-meta mono">{s.meta}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <Lightbox items={ITEMS} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </section>
  )
}
