import { useMemo, useState } from 'react'
import { CONFIG } from '../config'

const SIDEBAR = [
  { id: 'folder:projects', label: 'Projects', icon: 'images/icons/folder.png' },
  { id: 'folder:about-me', label: 'About Me', icon: 'images/icons/folder.png' },
  { id: 'certifications', label: 'Certifications', icon: 'images/icons/preview.png' },
  { id: 'honors', label: 'Honors', icon: 'images/icons/apps.png' },
  { id: 'notes', label: 'Notes', icon: 'images/icons/notes.png' },
  { id: 'photos', label: 'Photos', icon: 'images/icons/photos.png' },
  { id: 'terminal', label: 'AI Terminal', icon: 'images/icons/terminal.png' },
]

export default function Folder({
  folderId,
  mobile,
  onOpenProject,
  onOpenApp,
  onOpenFolder,
  onView,
  onLink,
}) {
  const folder = CONFIG.folders[folderId] || CONFIG.folders.projects
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')

  const items = useMemo(() => {
    return folder.items
      .map(item => {
        if (item.kind === 'project') {
          const project = CONFIG.projects.find(p => p.id === item.id)
          if (!project) return null
          return {
            ...item,
            label: project.title,
            meta: `${project.kind} · ${project.year}`,
            icon: 'images/icons/folder.png',
            project,
          }
        }
        return item
      })
      .filter(Boolean)
      .filter(item => {
        const q = query.trim().toLowerCase()
        return !q || `${item.label} ${item.meta || ''}`.toLowerCase().includes(q)
      })
  }, [folder, query])

  const run = item => {
    if (!item) return
    if (item.kind === 'project') return onOpenProject(item.id)
    if (item.kind === 'app') return onOpenApp(item.id)
    if (item.kind === 'viewer')
      return onView({ src: item.src, title: item.label, meta: item.meta })
    if (item.kind === 'link') return onLink(item.href)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none flex-wrap items-center gap-2 border-b border-[var(--line)] bg-[var(--win-2)] px-3 py-2">
        <div className="flex items-center gap-1 text-[var(--dim)]" aria-hidden="true">
          <span className="px-1 opacity-40">‹</span>
          <span className="px-1 opacity-40">›</span>
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <img src="images/icons/folder.png" alt="" className="h-5 w-5 object-contain" />
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-semibold leading-tight">{folder.title}</p>
            <p className="truncate text-[10px] leading-tight text-[var(--dim)]">
              {folder.items.length} items
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--win)] px-2 py-1">
          <svg width="12" height="12" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className="opacity-45">
            <circle cx="6.4" cy="6.4" r="4.4" />
            <path d="M9.8 9.8 13.4 13.4" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search"
            aria-label={`Search ${folder.title}`}
            className="w-[92px] bg-transparent text-[11.5px] placeholder:text-[var(--dim)] focus:outline-none sm:w-[130px]"
          />
        </div>
        <button
          type="button"
          onClick={() => onOpenApp('terminal')}
          className="flex items-center gap-1.5 rounded-[6px] bg-[#0a84ff] px-2.5 py-1 text-[11.5px] font-semibold text-white hover:brightness-110"
        >
          <img src="images/icons/terminal.png" alt="" className="h-3.5 w-3.5 object-contain" />
          Ask AI
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        {!mobile && (
          <aside className="w-[172px] flex-none overflow-y-auto border-r border-[var(--line)] bg-[var(--side)] p-2.5">
            <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--dim)]">
              Favourites
            </p>
            <ul className="space-y-[2px] text-[12.5px]">
              {SIDEBAR.map(item => {
                const active =
                  item.id === `folder:${folderId}` ||
                  (folderId === 'about-me' && item.id === `folder:about-me`)
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (item.id.startsWith('folder:')) onOpenFolder(item.id.slice(7))
                        else onOpenApp(item.id)
                      }}
                      className={`flex w-full items-center gap-2 rounded-[5px] px-2 py-[5px] text-left ${
                        active ? 'bg-[var(--hover)] font-medium' : 'hover:bg-[var(--hover)]'
                      }`}
                    >
                      <img src={item.icon} alt="" className="h-4 w-4 flex-none object-contain" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <p className="mt-4 px-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--dim)]">
              This Mac
            </p>
            <p className="px-2 py-1 text-[11px] leading-relaxed text-[var(--dim)]">
              Ziad’s Portfolio
              <br />
              200 GB available
            </p>
          </aside>
        )}

        <div className="min-w-0 flex-1 overflow-y-auto">
          <div className="flex items-end justify-between gap-4 px-5 pt-4">
            <div>
              <h1 className="text-[17px] font-semibold tracking-[-0.015em]">{folder.title}</h1>
              <p className="mt-0.5 max-w-[62ch] text-[11.5px] leading-relaxed text-[var(--dim)]">
                {folder.subtitle}
              </p>
            </div>
            <span className="hidden whitespace-nowrap text-[11px] text-[var(--dim)] sm:block">
              {items.length} items
            </span>
          </div>

          <div className="grid grid-cols-3 gap-x-2 gap-y-4 px-4 py-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {items.map(item => (
              <button
                key={`${item.kind}:${item.id}`}
                type="button"
                onClick={() => (mobile ? run(item) : setSelected(item.id))}
                onDoubleClick={() => run(item)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    run(item)
                  }
                }}
                className={`group flex flex-col items-center gap-1.5 rounded-[8px] p-2 text-center outline-none ${
                  selected === item.id ? 'bg-[#0a84ff]/15' : 'hover:bg-[var(--hover)]'
                } focus-visible:bg-[var(--hover)]`}
              >
                <span className="flex h-[54px] w-[54px] items-center justify-center">
                  <img
                    src={item.icon}
                    alt=""
                    className="h-full w-full object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.18)] transition-transform duration-200 group-hover:-translate-y-0.5"
                  />
                </span>
                <span
                  className={`max-w-[92px] truncate rounded-[4px] px-1 text-[11.5px] font-medium leading-tight ${
                    selected === item.id ? 'bg-[#0a84ff] text-white' : ''
                  }`}
                >
                  {item.label}
                </span>
                {item.meta && (
                  <span className="max-w-[96px] truncate text-[9.5px] leading-tight text-[var(--dim)]">
                    {item.meta}
                  </span>
                )}
              </button>
            ))}
          </div>

          {items.length === 0 && (
            <p className="px-6 py-12 text-center text-[12.5px] text-[var(--dim)]">
              Nothing matches “{query}”.
            </p>
          )}
          <p className="px-5 pb-4 text-[10.5px] text-[var(--dim)]">
            {mobile ? 'Tap an item to open it.' : 'Double-click an item to open it, or select it and press Enter.'}
          </p>
        </div>
      </div>
    </div>
  )
}
