import { useEffect, useMemo, useRef, useState } from 'react'
import { CONFIG } from '../config'

const APP_ITEMS = [
  { id: 'folder:projects', label: 'Projects', kind: 'Folder', keywords: 'work builds finder portfolio pipe pest sprout', icon: 'images/icons/folder.png' },
  { id: 'folder:about-me', label: 'About Me', kind: 'Folder', keywords: 'biography cv certifications honors experience photos', icon: 'images/icons/folder.png' },
  { id: 'about', label: 'About Me.txt', kind: 'Document', keywords: 'biography story profile me', icon: 'images/icons/textedit.png' },
  { id: 'certifications', label: 'Certifications', kind: 'Documents', keywords: 'certificates isef icpc nasa ibm earth hack club network schoolhouse be my eyes', icon: 'images/icons/preview.png' },
  { id: 'honors', label: 'Honors', kind: 'Documents', keywords: 'awards recognition wins place leadership service', icon: 'images/icons/apps.png' },
  { id: 'experience', label: 'Experience', kind: 'Document', keywords: 'cv roles teaching service schoolhouse culture palace', icon: 'images/icons/notes.png' },
  { id: 'skills', label: 'Skills', kind: 'Document', keywords: 'stack tools python pytorch yolo react languages', icon: 'images/icons/terminal.png' },
  { id: 'notes', label: 'Notes', kind: 'Application', keywords: 'writing now toolkit story process', icon: 'images/icons/notes.png' },
  { id: 'photos', label: 'Photos', kind: 'Application', keywords: 'photos gallery pictures portrait', icon: 'images/icons/photos.png' },
  { id: 'music', label: 'Music', kind: 'Application', keywords: 'music player songs listen audio desk sessions night shift clean build after the fair', icon: 'images/icons/music.png' },
  { id: 'social', label: 'Social', kind: 'Application', keywords: 'links github linkedin instagram contact', icon: 'images/icons/safari.png' },
  { id: 'contact', label: 'Mail', kind: 'Application', keywords: 'email contact hire', icon: 'images/icons/mail.png' },
  { id: 'resume', label: 'Résumé', kind: 'Application', keywords: 'cv curriculum vitae resume print', icon: 'images/icons/preview.png' },
  { id: 'terminal', label: 'AI Terminal', kind: 'Application', keywords: 'shell command cli zsh ai gemini ask live help', icon: 'images/icons/terminal.png' },
]

export default function Spotlight({ open, onClose, onOpen, onLink, onReset, onNextWallpaper }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const items = useMemo(() => {
    const appItems = APP_ITEMS.map(a => ({
      id: `app:${a.id}`,
      label: a.label,
      kind: a.kind,
      keywords: a.keywords,
      icon: a.icon,
      run: () => onOpen(a.id),
    }))
    const projectItems = CONFIG.projects.map(p => ({
      id: `project:${p.id}`,
      label: p.title,
      kind: p.kind,
      keywords: `${p.id} ${p.tags.join(' ')} ${p.summary}`,
      image: p.cover,
      tile: p.tile,
      tone: p.tileTone,
      run: () => onOpen(`project:${p.id}`),
    }))
    const linkItems = CONFIG.socials.map(s => ({
      id: `link:${s.label}`,
      label: s.label,
      kind: s.handle,
      icon: s.icon,
      run: () => onLink(s.href),
    }))
    const actions = [
      { id: 'action:reset', label: 'Reset Desktop Layout', kind: 'Action', glyph: '↺', run: onReset },
      { id: 'action:wallpaper', label: 'Next Wallpaper', kind: 'Action', glyph: '▤', run: onNextWallpaper },
    ]
    return [...appItems, ...projectItems, ...linkItems, ...actions]
  }, [onOpen, onLink, onReset, onNextWallpaper])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items.filter(i => i.id.startsWith('app:')).slice(0, 9)
    return items
      .filter(i => `${i.label} ${i.kind} ${i.keywords || ''}`.toLowerCase().includes(q))
      .slice(0, 10)
  }, [items, query])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActive(0)
    const t = window.setTimeout(() => inputRef.current?.focus(), 30)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const el = listRef.current?.querySelector('[data-active="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  useEffect(() => {
    if (!open) return
    const onKey = e => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const choose = item => {
    if (!item) return
    onClose()
    item.run()
  }

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label="Spotlight search"
      className="fixed inset-0 z-[640] flex items-start justify-center bg-black/10 px-4 pt-[12vh]"
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-[600px] overflow-hidden rounded-[14px] border border-white/35 bg-[var(--menu)] text-[var(--fg)] shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-3xl dark:border-white/15">
        <div className="flex items-center gap-2.5 border-b border-[var(--line)] px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="opacity-55">
            <circle cx="6.4" cy="6.4" r="4.4" />
            <path d="M9.8 9.8 13.4 13.4" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActive(a => Math.min(results.length - 1, a + 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActive(a => Math.max(0, a - 1))
              } else if (e.key === 'Enter') {
                e.preventDefault()
                choose(results[active])
              }
            }}
            placeholder="Spotlight Search"
            aria-label="Search projects, apps and links"
            className="w-full bg-transparent text-[19px] font-light tracking-[-0.01em] placeholder:text-[var(--dim)] focus:outline-none"
          />
          <kbd className="hidden rounded border border-[var(--line)] px-1.5 py-0.5 text-[10px] text-[var(--dim)] sm:block">esc</kbd>
        </div>

        <ul ref={listRef} role="listbox" aria-label="Results" className="max-h-[52vh] overflow-y-auto p-1.5">
          {results.length === 0 && (
            <li className="px-4 py-8 text-center text-[13px] text-[var(--dim)]">No results for “{query}”.</li>
          )}
          {results.map((item, i) => (
            <li key={item.id} role="option" aria-selected={i === active} data-active={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(item)}
                className={`flex w-full items-center gap-3 rounded-[7px] px-2.5 py-2 text-left ${i === active ? 'bg-[#0a84ff] text-white' : ''}`}
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center overflow-hidden rounded-[6px]">
                  {item.image ? (
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  ) : item.icon ? (
                    <img src={item.icon} alt="" className="h-full w-full object-contain" />
                  ) : item.tile ? (
                    <span className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${item.tone || 'from-neutral-600 to-neutral-900'} font-mono text-[13px] text-white`}>
                      {item.tile}
                    </span>
                  ) : (
                    <span className="flex h-full w-full items-center justify-center rounded-[6px] bg-[var(--hover)] text-[16px]">{item.glyph}</span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-medium">{item.label}</span>
                  <span className={`block truncate text-[11.5px] ${i === active ? 'text-white/70' : 'text-[var(--dim)]'}`}>{item.kind}</span>
                </span>
                {i === active && <span className="text-[11px] opacity-70">↵</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
