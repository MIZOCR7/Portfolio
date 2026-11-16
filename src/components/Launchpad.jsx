import { useEffect, useRef, useState } from 'react'

const APPS = [
  { id: 'folder:projects', label: 'Projects', icon: 'images/icons/folder.png' },
  { id: 'folder:about-me', label: 'About Me', icon: 'images/icons/folder.png' },
  { id: 'folder:achievements', label: 'Achievements', icon: 'images/icons/folder.png' },
  { id: 'folder:experience', label: 'Experience', icon: 'images/icons/folder.png' },
  { id: 'folder:contact', label: 'Contact', icon: 'images/icons/folder.png' },
  { id: 'folder:studio', label: 'Studio', icon: 'images/icons/folder.png' },
  { id: 'about', label: 'About Me.txt', icon: 'images/icons/textedit.png' },
  { id: 'notes', label: 'Notes', icon: 'images/icons/notes.png' },
  { id: 'photos', label: 'Photos', icon: 'images/icons/photos.png' },
  { id: 'browser', label: 'Safari', icon: 'images/icons/safari.png' },
  { id: 'music', label: 'Music', icon: 'images/icons/music.png' },
  { id: 'youtube', label: 'YouTube', icon: 'images/icons/youtube.svg' },
  { id: 'love', label: 'Love', icon: 'images/icons/love.svg' },
  { id: 'social', label: 'Social', icon: 'images/icons/contacts.png' },
  { id: 'contact', label: 'Email', icon: 'images/icons/mail.png' },
  { id: 'resume', label: 'Résumé', icon: 'images/icons/preview.png' },
  { id: 'terminal', label: 'AI Terminal', icon: 'images/icons/terminal.png' },
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
            placeholder="Search folders and apps"
            aria-label="Search Launchpad"
            className="w-full bg-transparent text-[13px] text-white placeholder:text-white/55 focus:outline-none"
          />
        </div>

        {apps.length > 0 && (
          <>
            <h2 className="mb-3 px-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">
              Folders & apps
            </h2>
            <div className="grid grid-cols-4 gap-x-2 gap-y-6 sm:grid-cols-6 md:grid-cols-8">
              {apps.map(app => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => launch(app.id)}
                  className="group flex flex-col items-center gap-2 rounded-lg p-2 outline-none hover:bg-white/10 focus-visible:bg-white/15"
                >
                  <img
                    src={app.icon}
                    alt=""
                    className="h-[58px] w-[58px] object-contain drop-shadow-xl transition-transform group-hover:scale-105"
                  />
                  <span className="text-[12px] font-medium drop-shadow">{app.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {apps.length === 0 && (
          <p className="py-16 text-center text-[14px] text-white/65">Nothing matches “{query}”.</p>
        )}
      </div>
    </section>
  )
}
