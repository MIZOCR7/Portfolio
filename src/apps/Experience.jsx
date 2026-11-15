import { CONFIG } from '../config'

export default function Experience({ onOpenApp }) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b border-[var(--line)] bg-[var(--win-2)] px-6 py-4">
        <div className="flex items-center gap-3">
          <img src="images/icons/notes.png" alt="" className="h-9 w-9 object-contain" />
          <div>
            <h1 className="text-[20px] font-semibold tracking-[-0.02em]">Experience</h1>
            <p className="text-[11.5px] text-[var(--dim)]">
              Roles, teaching and service — the CV part of the desk.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenApp('resume')}
            className="ml-auto rounded-[6px] border border-[var(--line)] bg-[var(--win)] px-3 py-1 text-[11.5px] font-medium hover:bg-[var(--hover)]"
          >
            One-page résumé
          </button>
        </div>
      </div>

      <div className="space-y-6 px-6 py-5">
        <section>
          <h2 className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--dim)]">
            Education
          </h2>
          <div className="space-y-3">
            {CONFIG.education.map(e => (
              <article key={e.school} className="rounded-[9px] border border-[var(--line)] p-3.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[13px] font-semibold">{e.school}</h3>
                  <span className="font-mono text-[10.5px] text-[var(--dim)]">{e.period}</span>
                </div>
                <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--fg)]/75">{e.detail}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {e.tags.map(t => (
                    <span key={t} className="rounded-full bg-[var(--hover)] px-2 py-[1px] text-[10px] text-[var(--dim)]">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--dim)]">
            Roles & service
          </h2>
          <div className="space-y-3">
            {CONFIG.experience.map(x => (
              <article key={`${x.role}-${x.org}`} className="rounded-[9px] border border-[var(--line)] p-3.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[13px] font-semibold">
                    {x.role} <span className="font-normal text-[var(--dim)]">· {x.org}</span>
                  </h3>
                  <span className="font-mono text-[10.5px] text-[var(--dim)]">{x.period}</span>
                </div>
                <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--fg)]/75">{x.detail}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {x.tags.map(t => (
                    <span key={t} className="rounded-full bg-[var(--hover)] px-2 py-[1px] text-[10px] text-[var(--dim)]">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
