import { useMemo, useState } from 'react'
import { CONFIG } from '../config'

function Status({ children }) {
  return (
    <span className="rounded-full bg-[var(--hover)] px-2 py-[2px] text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--dim)]">
      {children}
    </span>
  )
}

export default function Work({ onOpenProject, onView, onOpenApp }) {
  const [tab, setTab] = useState('projects')
  const [query, setQuery] = useState('')

  const projects = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CONFIG.projects
    return CONFIG.projects.filter(p =>
      `${p.title} ${p.kind} ${p.tags.join(' ')} ${p.summary}`.toLowerCase().includes(q)
    )
  }, [query])

  const awards = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CONFIG.certificates
    return CONFIG.certificates.filter(c => `${c.title} ${c.org} ${c.year}`.toLowerCase().includes(q))
  }, [query])

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none items-center gap-2 border-b border-[var(--line)] bg-[var(--win-2)] px-4 py-2.5">
        <div className="flex rounded-[7px] bg-[var(--hover)] p-[2px]">
          {[
            ['projects', 'Projects'],
            ['awards', 'Awards'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-pressed={tab === id}
              className={`rounded-[5px] px-3 py-1 text-[12px] font-medium ${tab === id ? 'bg-[var(--win)] shadow-sm' : 'text-[var(--dim)]'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 rounded-[7px] border border-[var(--line)] bg-[var(--win)] px-2 py-1">
          <svg width="13" height="13" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className="opacity-45">
            <circle cx="6.4" cy="6.4" r="4.4" />
            <path d="M9.8 9.8 13.4 13.4" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search work"
            className="w-[120px] bg-transparent text-[12px] placeholder:text-[var(--dim)] focus:outline-none sm:w-[160px]"
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[176px] flex-none border-r border-[var(--line)] bg-[var(--side)] p-3 md:block">
          <p className="mb-1 px-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[var(--dim)]">Favourites</p>
          <ul className="space-y-[2px] text-[12.5px]">
            {[
              ['projects', 'All Projects'],
              ['awards', 'Awards'],
            ].map(([id, label]) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setTab(id)}
                  aria-pressed={tab === id}
                  className={`flex w-full items-center gap-2 rounded-[5px] px-2 py-[5px] text-left ${tab === id ? 'bg-[var(--hover)] font-medium' : 'hover:bg-[var(--hover)]'}`}
                >
                  <span className={`h-[7px] w-[7px] rounded-full ${id === 'projects' ? 'bg-[#0a84ff]' : 'bg-[#ff9f0a]'}`} />
                  {label}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => onOpenApp('photos')}
                className="flex w-full items-center gap-2 rounded-[5px] px-2 py-[5px] text-left hover:bg-[var(--hover)]"
              >
                <span className="h-[7px] w-[7px] rounded-full bg-[#30d158]" />
                Images
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onOpenApp('about')}
                className="flex w-full items-center gap-2 rounded-[5px] px-2 py-[5px] text-left hover:bg-[var(--hover)]"
              >
                <span className="h-[7px] w-[7px] rounded-full bg-[#bf5af2]" />
                About
              </button>
            </li>
          </ul>

          <p className="mb-1 mt-5 px-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[var(--dim)]">Projects</p>
          <ul className="space-y-[2px] text-[12.5px]">
            {CONFIG.projects.map(p => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onOpenProject(p.id)}
                  className="flex w-full items-center gap-2 rounded-[5px] px-2 py-[5px] text-left hover:bg-[var(--hover)]"
                >
                  <span className={`h-4 w-4 flex-none overflow-hidden rounded-[3px] ${p.cover ? '' : 'bg-[var(--line)]'}`}>
                    {p.cover ? <img src={p.cover} alt="" className="h-full w-full object-cover" loading="lazy" /> : null}
                  </span>
                  <span className="truncate">{p.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0 flex-1 overflow-y-auto p-4">
          {tab === 'projects' && (
            <>
              <div className="mb-3 flex items-end justify-between px-1">
                <h1 className="text-[17px] font-semibold tracking-[-0.01em]">Work</h1>
                <span className="text-[11.5px] text-[var(--dim)]">{projects.length} items</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
                {projects.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onOpenProject(p.id)}
                    className="group rounded-[8px] p-1.5 text-left outline-none hover:bg-[var(--hover)] focus-visible:bg-[var(--hover)]"
                  >
                    <span className="block aspect-[4/3] overflow-hidden rounded-[6px] bg-[var(--hover)] shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                      {p.cover ? (
                        <img src={p.cover} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" loading="lazy" />
                      ) : (
                        <span className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${p.tileTone} font-mono text-[22px] text-white/90`}>
                          {p.tile}
                        </span>
                      )}
                    </span>
                    <span className="mt-1.5 block truncate text-[12.5px] font-medium">{p.title}</span>
                    <span className="mt-0.5 flex items-center gap-1.5">
                      <Status>{p.status}</Status>
                      <span className="truncate text-[10.5px] text-[var(--dim)]">{p.year}</span>
                    </span>
                  </button>
                ))}
              </div>
              {projects.length === 0 && <p className="p-8 text-center text-[13px] text-[var(--dim)]">Nothing matches “{query}”.</p>}
            </>
          )}

          {tab === 'awards' && (
            <>
              <div className="mb-3 flex items-end justify-between px-1">
                <h1 className="text-[17px] font-semibold tracking-[-0.01em]">Awards & certificates</h1>
                <span className="text-[11.5px] text-[var(--dim)]">{awards.length} documents</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {awards.map(c => (
                  <button
                    key={c.title}
                    type="button"
                    onClick={() => onView({ src: c.image, title: c.title, meta: `${c.org} · ${c.year}`, note: c.note })}
                    className="group rounded-[8px] p-1.5 text-left hover:bg-[var(--hover)]"
                  >
                    <span className="block h-[104px] overflow-hidden rounded-[5px] bg-white p-1 shadow-sm ring-1 ring-black/10">
                      <img src={c.image} alt={`${c.title} certificate`} className="h-full w-full object-contain" loading="lazy" />
                    </span>
                    <span className="mt-1.5 block truncate text-[12px] font-medium">{c.title}</span>
                    <span className="block truncate text-[10.5px] text-[var(--dim)]">{c.year} · {c.org}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
