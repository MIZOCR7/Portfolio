import { useMemo, useState } from 'react'
import { CONFIG } from '../config'

const FILTERS = ['All', 'Award', 'Certification', 'Service']

export default function Certifications({ onView }) {
  const [filter, setFilter] = useState('All')
  const [open, setOpen] = useState(null)

  const items = useMemo(
    () => CONFIG.certificates.filter(c => filter === 'All' || c.category === filter),
    [filter]
  )

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none flex-wrap items-center gap-2 border-b border-[var(--line)] bg-[var(--win-2)] px-4 py-2.5">
        <img src="images/icons/preview.png" alt="" className="h-5 w-5 object-contain" />
        <h1 className="text-[13px] font-semibold">Certifications</h1>
        <div className="ml-auto flex gap-1">
          {FILTERS.map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded-[5px] px-2.5 py-1 text-[11px] font-medium ${
                filter === f ? 'bg-[var(--win)] shadow-sm' : 'text-[var(--dim)] hover:bg-[var(--hover)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-3 flex items-end justify-between px-1">
          <div>
            <h2 className="text-[18px] font-semibold tracking-[-0.015em]">Documents</h2>
            <p className="text-[11.5px] text-[var(--dim)]">
              Scans from Ziad’s own files. Click one to read it full size.
            </p>
          </div>
          <span className="text-[11.5px] text-[var(--dim)]">{items.length} documents</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(c => (
            <button
              key={c.title}
              type="button"
              onClick={() => {
                setOpen(c.title)
                onView({ src: c.image, title: c.title, meta: `${c.org} · ${c.year}`, note: c.note })
              }}
              className={`group rounded-[10px] border border-[var(--line)] bg-[var(--win-2)] p-2 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                open === c.title ? 'ring-1 ring-[#0a84ff]' : ''
              }`}
            >
              <span className="block h-[136px] overflow-hidden rounded-[6px] bg-white p-1.5 shadow-sm ring-1 ring-black/10">
                <img
                  src={c.image}
                  alt={`${c.title} certificate`}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="mt-2 block truncate text-[12.5px] font-semibold">{c.title}</span>
              <span className="block truncate text-[10.5px] text-[var(--dim)]">
                {c.year} · {c.org}
              </span>
              <span className="mt-1.5 inline-flex rounded-full bg-[var(--hover)] px-2 py-[1px] text-[9.5px] font-semibold uppercase tracking-[0.06em] text-[var(--dim)]">
                {c.category}
              </span>
            </button>
          ))}
        </div>
        {items.length === 0 && (
          <p className="py-12 text-center text-[13px] text-[var(--dim)]">No documents in this filter.</p>
        )}
      </div>
    </div>
  )
}
