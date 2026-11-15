import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'

const APPS = [
  { id: 'work', label: 'Work', icon: 'images/icons/finder.png' },
  { id: 'about', label: 'About', icon: 'images/icons/contacts.png' },
  { id: 'notes', label: 'Notes', icon: 'images/icons/notes.png' },
  { id: 'photos', label: 'Images', icon: 'images/icons/photos.png' },
  { id: 'social', label: 'Social', icon: 'images/icons/safari.png' },
  { id: 'contact', label: 'Email', icon: 'images/icons/mail.png' },
  { id: 'resume', label: 'Résumé', icon: 'images/icons/preview.png' },
  { id: 'terminal', label: 'Terminal', icon: 'images/icons/image-capture.png' },
]

export default function Launchpad({ open, onClose, onOpen }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setQuery('')
    const t = window.setTimeout(() => inputRef.current?.focus(), 40)
    const onKey = e => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  const q = query.trim().toLowerCase()
  const apps = APPS.filter(a => !q || a.label.toLowerCase().includes(q))
  const projects = CONFIG.projects.filter(
    p => !q || `${p.title} ${p.kind} ${p.tags.join(' ')}`.toLowerCase().includes(q)
  )

  const launch = id => {
    onClose()
    onOpen(id)
  }

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label="Launchpad"
      className="fixed inset-0 z-[600] flex flex-col items-center overflow-y-auto bg-black/30 px-4 pb-10 pt-[8vh] text-white backdrop-blur-2xl"
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-[860px]">
        <div className="mx-auto mb-7 flex w-full max-w-[380px] items-center gap-2 rounded-[10px] border border-white/25 bg-black/25 px-3 py-2 backdrop-blur-xl">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            <circle cx="6.4" cy="6.4" r="4.4" />
            <path d="M9.8 9.8 13.4 13.4" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search apps and projects"
            aria-label="Search Launchpad"
            className="w-full bg-transparent text-[13px] text-white placeholder:text-white/55 focus:outline-none"
          />
        </div>

        {apps.length > 0 && (
          <>
            <h2 className="mb-3 px-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">Apps</h2>
            <div className="mb-8 grid grid-cols-4 gap-x-2 gap-y-6 sm:grid-cols-6 md:grid-cols-8">
              {apps.map(app => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => launch(app.id)}
                  className="group flex flex-col items-center gap-2 rounded-lg p-2 outline-none hover:bg-white/10 focus-visible:bg-white/15"
                >
                  <img src={app.icon} alt="" className="h-[58px] w-[58px] object-contain drop-shadow-xl transition-transform group-hover:scale-105" />
                  <span className="text-[12px] font-medium drop-shadow">{app.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {projects.length > 0 && (
          <>
            <h2 className="mb-3 px-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">Projects</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {projects.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => launch(`project:${p.id}`)}
                  className="group overflow-hidden rounded-[10px] border border-white/20 bg-black/20 text-left outline-none backdrop-blur-md transition hover:border-white/40 focus-visible:border-white/70"
                >
                  <span className="block h-[104px] overflow-hidden bg-black/30">
                    {p.cover ? (
                      <img src={p.cover} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <span className={`flex h-full items-center justify-center bg-gradient-to-br ${p.tileTone} font-mono text-2xl text-white/85`}>
                        {p.tile}
                      </span>
                    )}
                  </span>
                  <span className="block px-3 py-2">
                    <span className="block truncate text-[12.5px] font-semibold">{p.title}</span>
                    <span className="block truncate text-[11px] text-white/60">{p.kind}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {apps.length === 0 && projects.length === 0 && (
          <p className="py-16 text-center text-[14px] text-white/65">Nothing matches “{query}”.</p>
        )}
      </div>
    </section>
  )
}
