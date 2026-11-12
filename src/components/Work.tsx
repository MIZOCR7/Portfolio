import type { CSSProperties } from 'react'
import { FEATURE, MINOR, PROJECTS } from '../data'
import { useTilt } from '../hooks/useTilt'

function Feature() {
  const tiltRef = useTilt<HTMLDivElement>(5)

  return (
    <article className="feature">
      <div className="reveal-img">
        <div className="media media--wide tilt" ref={tiltRef}>
          <img
            src={FEATURE.image}
            alt={FEATURE.alt}
            width={899}
            height={675}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div className="reveal" style={{ '--delay': '0.1s' } as CSSProperties}>
        <div className="feature-index">
          <span className="mono">{FEATURE.id}</span>
          <span className="mono">{FEATURE.kicker}</span>
        </div>
        <h3 className="feature-title">{FEATURE.title}</h3>
        <p className="mono" style={{ marginTop: 12, letterSpacing: '0.1em' }}>
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
  )
}

function Card({ project, index }: { project: (typeof PROJECTS)[number]; index: number }) {
  const tiltRef = useTilt<HTMLDivElement>(6)

  return (
    <article className="card reveal" style={{ '--delay': `${index * 0.08}s` } as CSSProperties}>
      <div className="reveal-img">
        <div
          className={project.image ? 'media media--card tilt' : 'media media--card tilt tile'}
          ref={tiltRef}
        >
          {project.image ? (
            <img
              src={project.image}
              alt={project.alt}
              width={1000}
              height={750}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="tile-type">{project.tile}</span>
          )}
        </div>
      </div>
      <span className="mono">
        {project.id} — {project.kicker}
      </span>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="tags">
        {project.tags.map(t => (
          <span className="tag" key={t}>
            {t}
          </span>
        ))}
      </div>
      <div className="links">
        {project.links.map(l => (
          <a className="link-arrow" key={l.href} href={l.href}>
            {l.label} <i>↗</i>
          </a>
        ))}
      </div>
    </article>
  )
}

export default function Work() {
  return (
    <section className="section" id="work">
      <div className="wrap">
        <div className="section-head">
          <p className="label mono">01 — Selected work</p>
          <div>
            <h2 className="section-title reveal-mask">
              <span className="line">
                <span>Selected work,</span>
              </span>
              <span className="line">
                <span>
                  warts and <em>all</em>.
                </span>
              </span>
            </h2>
            <p className="section-sub reveal">
              School capstones, club projects and the small things in between. Everything here runs — a couple
              of links go straight to the live version.
            </p>
          </div>
        </div>

        <Feature />

        <div className="cards">
          {PROJECTS.map((p, i) => (
            <Card key={p.id} project={p} index={i} />
          ))}
        </div>

        <div className="minor">
          {MINOR.map((m, i) => (
            <a
              className="minor-row reveal"
              key={m.name}
              href={m.href}
              style={{ '--delay': `${i * 0.05}s` } as CSSProperties}
            >
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
