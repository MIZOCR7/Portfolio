import { FEATURE, MINOR, PROJECTS } from '../data'

export default function Work() {
  return (
    <section className="section" id="work">
      <div className="wrap">
        <div className="section-head">
          <p className="label mono">01 — Selected work</p>
          <div>
            <h2 className="section-title">
              Selected work, warts and <em>all</em>.
            </h2>
            <p className="section-sub">
              School capstones, club projects and the small things in between. Everything here runs — a couple
              of links go straight to the live version.
            </p>
          </div>
        </div>

        <article className="feature reveal">
          <div className="media media--wide">
            <img
              src={FEATURE.image}
              alt={FEATURE.alt}
              width={900}
              height={900}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div>
            <div className="feature-index">
              <span className="mono">{FEATURE.id}</span>
              <span className="mono">{FEATURE.kicker}</span>
            </div>
            <h3 className="feature-title">{FEATURE.title}</h3>
            <p className="mono" style={{ marginTop: 10, letterSpacing: '0.1em' }}>
              {FEATURE.subtitle}
            </p>
            <p className="feature-desc">{FEATURE.description}</p>

            <dl className="specs">
              {FEATURE.specs.map(s => (
                <div key={s.k}>
                  <dt>{s.k}</dt>
                  <dd>{s.v}</dd>
                </div>
              ))}
            </dl>

            <div className="tags">
              {FEATURE.tags.map(t => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>

            <div className="links">
              {FEATURE.links.map(l => (
                <a className="link-arrow" key={l.href} href={l.href}>
                  {l.label} <i>↗</i>
                </a>
              ))}
            </div>
          </div>
        </article>

        <div className="cards">
          {PROJECTS.map(p => (
            <article className="card reveal" key={p.id}>
              <div className={p.image ? 'media media--card' : 'media media--card tile'}>
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.alt}
                    width={1000}
                    height={563}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="tile-type">{p.tile}</span>
                )}
              </div>
              <span className="mono">
                {p.id} — {p.kicker}
              </span>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="tags">
                {p.tags.map(t => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="links">
                {p.links.map(l => (
                  <a className="link-arrow" key={l.href} href={l.href}>
                    {l.label} <i>↗</i>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="minor">
          {MINOR.map((m, i) => (
            <a className="minor-row" key={m.name} href={m.href}>
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <span className="name">{m.name}</span>
              <span className="stack">{m.stack}</span>
              <span className="go">Open ↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
