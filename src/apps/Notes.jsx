import { useState } from 'react'
import { CONFIG } from '../config'

export default function Notes() {
  const [active, setActive] = useState(CONFIG.notes[0].id)
  const note = CONFIG.notes.find(n => n.id === active) || CONFIG.notes[0]

  return (
    <div className="flex h-full flex-col md:flex-row">
      <div className="flex flex-none gap-1 overflow-x-auto border-b border-[var(--line)] bg-[#f7d774]/55 p-2 md:w-[220px] md:flex-col md:overflow-y-auto md:border-b-0 md:border-r md:p-2.5 dark:bg-[#3a3320]/70">
        <div className="hidden px-2 pb-1 pt-1 md:block">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-black/45 dark:text-white/45">iCloud</p>
        </div>
        {CONFIG.notes.map(n => (
          <button
            key={n.id}
            type="button"
            onClick={() => setActive(n.id)}
            aria-pressed={active === n.id}
            className={`min-w-[132px] rounded-[6px] px-2.5 py-2 text-left transition-colors md:min-w-0 ${
              active === n.id
                ? 'bg-white/85 text-black shadow-sm dark:bg-white/15 dark:text-white'
                : 'text-black/70 hover:bg-white/45 dark:text-white/65 dark:hover:bg-white/10'
            }`}
          >
            <span className="block truncate text-[12.5px] font-semibold">{n.title}</span>
            <span className="block truncate text-[11px] opacity-65">{n.preview}</span>
          </button>
        ))}
      </div>

      <article className="min-w-0 flex-1 overflow-y-auto px-6 py-6 sm:px-9">
        <p className="mb-1 text-center text-[10.5px] text-[var(--dim)]">Notes · {CONFIG.site.updated}</p>
        <h1 className="mb-3 text-center text-[19px] font-semibold tracking-[-0.01em]">{note.title}</h1>
        <div className="mx-auto max-w-[62ch] whitespace-pre-line text-[13.5px] leading-[1.75] text-[var(--fg)]/90">
          {note.body}
        </div>
      </article>
    </div>
  )
}
