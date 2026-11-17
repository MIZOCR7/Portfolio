import { useState } from 'react'
import Media from '../components/Media'

export default function Project({ project, onView }) {
  const [index, setIndex] = useState(0)
  const [video, setVideo] = useState(false)
  const shots = project.gallery || []
  const shot = shots[index]
  const hasGallery = shots.length > 0 || project.video

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {hasGallery && (
        <div className="flex-none bg-[#101114]">
          <div className="relative flex min-h-[190px] items-center justify-center p-3 sm:min-h-[260px]">
            {video && project.video ? (
              <video
                controls
                autoPlay
                playsInline
                preload="metadata"
                poster={project.video.poster}
                className="max-h-[46vh] w-full rounded-[6px] bg-black object-contain"
                aria-label={`${project.title} demo video`}
                onError={() => setVideo(false)}
              >
                <source src={project.video.src} type="video/mp4" />
              </video>
            ) : shot ? (
              <button
                type="button"
                onClick={() => onView({ src: shot.src, title: project.title, meta: shot.caption })}
                data-cursor="zoom"
                className="group relative block max-h-[46vh] overflow-hidden rounded-[4px]"
                aria-label={`Open ${shot.caption} at full size`}
              >
                <Media
                  src={shot.src}
                  alt={shot.alt}
                  className="max-h-[46vh] w-auto max-w-full object-contain"
                  fallback={<span className="block p-16 text-[13px] text-white/50">This image could not be loaded.</span>}
                />
                <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
              </button>
            ) : (
              <div className={`flex h-[200px] w-full max-w-[360px] items-center justify-center rounded-[8px] bg-gradient-to-br ${project.tileTone || 'from-neutral-700 to-neutral-950'}`}>
                <span className="font-mono text-[34px] text-white/85">{project.tile}</span>
              </div>
            )}

            {shots.length > 1 && !video && (
              <>
                <button
                  type="button"
                  onClick={() => setIndex((index - 1 + shots.length) % shots.length)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/45 text-[18px] text-white backdrop-blur transition hover:bg-black/65"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setIndex((index + 1) % shots.length)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-black/45 text-[18px] text-white backdrop-blur transition hover:bg-black/65"
                >
                  ›
                </button>
              </>
            )}
            {project.video && (
              <button
                type="button"
                onClick={() => setVideo(v => !v)}
                className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium text-white backdrop-blur hover:bg-black/70"
              >
                {video ? 'Back to stills' : 'Play demo'}
              </button>
            )}
          </div>

          {shots.length > 1 && (
            <div className="flex gap-1.5 overflow-x-auto px-3 pb-3">
              {shots.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => {
                    setIndex(i)
                    setVideo(false)
                  }}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === index && !video}
                  className={`h-[38px] w-[58px] flex-none overflow-hidden rounded-[4px] border-2 ${i === index && !video ? 'border-[#0a84ff]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={s.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex-1 px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#0a84ff]/12 px-2.5 py-[3px] text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#0a84ff] dark:bg-[#0a84ff]/20">
            {project.status}
          </span>
          <span className="text-[11.5px] text-[var(--dim)]">{project.kind} · {project.year}</span>
        </div>

        <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.025em]">{project.title}</h2>
        <p className="mt-2 max-w-[62ch] text-[14px] leading-relaxed text-[var(--fg)]/85">{project.summary}</p>

        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 rounded-[8px] bg-[var(--win-2)] px-4 py-3 text-[12.5px]">
          <dt className="text-[var(--dim)]">Role</dt>
          <dd>{project.role}</dd>
          <dt className="text-[var(--dim)]">Year</dt>
          <dd>{project.year}</dd>
          <dt className="text-[var(--dim)]">Stack</dt>
          <dd>{project.tags.join(' · ')}</dd>
        </dl>

        <div className="mt-5 space-y-3 text-[13.5px] leading-[1.65] text-[var(--fg)]/90">
          {project.body.map(p => (
            <p key={p.slice(0, 28)}>{p}</p>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[7px] bg-[#0a84ff] px-3.5 py-1.5 text-[12.5px] font-medium text-white shadow-sm hover:brightness-110"
            >
              {project.linkLabel || 'Open link'} <span aria-hidden="true">↗</span>
            </a>
          )}
          <span className="text-[11px] text-[var(--dim)]">
            {project.cover ? 'Photographs from the build.' : 'This project has no published screenshots yet.'}
          </span>
        </div>
      </div>
    </div>
  )
}
