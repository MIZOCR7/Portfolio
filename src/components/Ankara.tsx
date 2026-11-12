import { ANKARA } from '../data'
import TurkishFlag from './TurkishFlag'

export default function Ankara() {
  return (
    <section className="ankara" id="ankara">
      <div className="wrap">
        <div className="ankara-top">
          <p className="mono">04 — Where this is going</p>
          <p className="mono">{ANKARA.coordinates}</p>
        </div>

        <div className="ankara-grid">
          <div className="ankara-text">
            <h2 className="ankara-title reveal-mask">
              <span className="line">
                <span>Ankara,</span>
              </span>
              <span className="line">
                <span className="ankara-year">2027.</span>
              </span>
            </h2>

            <p className="ankara-lead reveal">{ANKARA.lead}</p>

            {ANKARA.body.map((p, i) => (
              <p className="ankara-p reveal" key={i} style={{ transitionDelay: `${0.06 * i}s` }}>
                {p}
              </p>
            ))}

            <div className="ankara-stamp reveal">
              <TurkishFlag className="stamp-flag" />
              <div>
                <span className="stamp-title">Türkiye Bursları</span>
                <span className="stamp-sub">METU · Computer Engineering · Ankara</span>
              </div>
            </div>
          </div>

          <div className="ankara-photos">
            <figure className="shot shot--main reveal-img">
              <div className="shot-mat">
                <img
                  src="/img/metu-rectorate.jpg"
                  alt="The METU rectorate building seen through a concrete canopy, photographed in black and white"
                  width={1500}
                  height={1505}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>
                <span>Rectorate, METU</span>
                <span>Ankara · 39.89° N</span>
              </figcaption>
            </figure>

            <figure className="shot shot--sub reveal-img">
              <div className="shot-mat">
                <img
                  src="/img/metu-library.jpg"
                  alt="The METU library building on the Ankara campus"
                  width={1500}
                  height={1152}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>
                <span>Library, METU campus</span>
                <span>Not my photograph — not yet</span>
              </figcaption>
            </figure>

            <figure className="shot shot--third reveal-img">
              <div className="shot-mat">
                <img
                  src="/img/metu-campus.jpg"
                  alt="The pedestrian way through the METU campus, lined with trees"
                  width={1500}
                  height={1534}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption>
                <span>Pedestrian way</span>
                <span>Ankara</span>
              </figcaption>
            </figure>
          </div>
        </div>

        <p className="ankara-credit mono">
          Campus photographs via Wikimedia Commons, used under their free licences. Taken from the outside, for
          now.
        </p>
      </div>
    </section>
  )
}
