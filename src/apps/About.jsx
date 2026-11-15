import { CONFIG } from '../config'
import Media from '../components/Media'

export default function About({ onOpenApp }) {
  const { site, about } = CONFIG
  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b border-[var(--line)] bg-[var(--win-2)] px-6 py-5 sm:px-8">
        <div className="flex items-start gap-4">
          <span className="h-[86px] w-[86px] flex-none overflow-hidden rounded-full shadow-md ring-1 ring-black/10">
            <Media
              src={about.portrait}
              alt={about.portraitAlt}
              className="h-full w-full object-cover object-top"
              fallback={<span className="block h-full w-full bg-[var(--hover)]" />}
            />
          </span>
          <div className="min-w-0">
            <h1 className="text-[25px] font-semibold leading-tight tracking-[-0.025em]">{site.name}</h1>
            <p className="text-[13px] text-[var(--dim)]">{site.role}</p>
            <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#30d158]/15 px-2 py-[2px] text-[10.5px] font-semibold text-[#1f9d45] dark:text-[#4cd964]">
              <span className="h-[6px] w-[6px] rounded-full bg-current" /> {site.status}
            </p>
            <p className="mt-1.5 text-[11.5px] text-[var(--dim)]">{site.location} · {site.availability}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 px-6 py-5 sm:px-8">
        <p className="max-w-[64ch] text-[14px] font-medium leading-relaxed">{about.lead}</p>

        <div className="space-y-3 text-[13.5px] leading-[1.7] text-[var(--fg)]/90">
          {about.paragraphs.map(p => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <section>
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--dim)]">Facts</h2>
          <dl className="overflow-hidden rounded-[9px] border border-[var(--line)]">
            {about.facts.map(([k, v], i) => (
              <div key={k} className={`grid grid-cols-[110px_1fr] gap-3 px-4 py-2 text-[12.5px] sm:grid-cols-[140px_1fr] ${i % 2 ? 'bg-[var(--win-2)]' : ''}`}>
                <dt className="text-[var(--dim)]">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--dim)]">How I work</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            {about.values.map((v, i) => (
              <div key={v.k} className="rounded-[9px] border border-[var(--line)] p-3">
                <span className="font-mono text-[10.5px] text-[var(--dim)]">0{i + 1}</span>
                <h3 className="mt-1 text-[13px] font-semibold">{v.k}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-[var(--dim)]">{v.v}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--dim)]">Journey</h2>
          <ol className="space-y-3 border-l border-[var(--line)] pl-4">
            {about.timeline.map(item => (
              <li key={item.what} className="relative">
                <span className="absolute -left-[21px] top-[5px] h-[7px] w-[7px] rounded-full bg-[#0a84ff]" />
                <p className="font-mono text-[10.5px] text-[var(--dim)]">{item.year}</p>
                <p className="text-[13px] font-semibold">{item.what}</p>
                <p className="text-[12px] leading-relaxed text-[var(--dim)]">{item.sub}</p>
                <p className="text-[10.5px] uppercase tracking-[0.06em] text-[var(--dim)]/80">{item.note}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="flex flex-wrap gap-2 pb-2">
          <a href={`mailto:${site.email}`} className="rounded-[7px] bg-[#0a84ff] px-3.5 py-1.5 text-[12.5px] font-medium text-white hover:brightness-110">
            Email Ziad
          </a>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="rounded-[7px] border border-[var(--line)] bg-[var(--win-2)] px-3.5 py-1.5 text-[12.5px] font-medium hover:bg-[var(--hover)]">
            GitHub ↗
          </a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-[7px] border border-[var(--line)] bg-[var(--win-2)] px-3.5 py-1.5 text-[12.5px] font-medium hover:bg-[var(--hover)]">
            LinkedIn ↗
          </a>
          <button type="button" onClick={() => onOpenApp('resume')} className="rounded-[7px] border border-[var(--line)] bg-[var(--win-2)] px-3.5 py-1.5 text-[12.5px] font-medium hover:bg-[var(--hover)]">
            Résumé
          </button>
        </div>
      </div>
    </div>
  )
}
