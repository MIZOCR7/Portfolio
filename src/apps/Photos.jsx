import { useState } from 'react'
import { CONFIG } from '../config'

export default function Photos({ onView }) {
  const [active, setActive] = useState('All')

  const items = CONFIG.photos

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none items-center gap-3 border-b border-[var(--line)] bg-[var(--win-2)] px-4 py-2.5">
        <h1 className="text-[13px] font-semibold">Images</h1>
        <div className="ml-auto flex gap-1">
          {['All', 'Builds', 'Contests'].map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              aria-pressed={active === tab}
              className={`rounded-[5px] px-2.5 py-1 text-[11.5px] ${active === tab ? 'bg-[var(--win)] shadow-sm' : 'text-[var(--dim)] hover:bg-[var(--hover)]'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mb-3 flex items-end justify-between px-1">
          <div>
            <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
              {active === 'All' ? 'Library' : active === 'Builds' ? 'Builds' : 'Contests'}
            </h2>
            <p className="text-[11.5px] text-[var(--dim)]">
              {active === 'Builds'
                ? 'Prototypes mid-failure, wiring revisions, night tests.'
                : active === 'Contests'
                  ? 'The contest floor and the walk back.'
                  : 'Everything from the workshop, the field and the contest floor.'}
            </p>
          </div>
          <span className="text-[11.5px] text-[var(--dim)]">
            {active === 'All' ? items.length : active === 'Builds' ? items.filter(p => /sprout|pest|pipe/i.test(p.meta)).length : items.filter(p => /contest|ICPC/i.test(p.meta)).length} photos
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {(active === 'All'
            ? items
            : active === 'Builds'
              ? items.filter(p => /sprout|pest|pipe/i.test(p.meta))
              : items.filter(p => /contest|ICPC/i.test(p.meta))
          ).map(photo => (
            <button
              key={photo.src}
              type="button"
              onClick={() => onView({ src: photo.src, title: photo.title, meta: photo.meta })}
              data-cursor="zoom"
              className="group relative overflow-hidden rounded-[7px] bg-[var(--hover)] text-left ring-1 ring-black/5 focus-visible:ring-[#0a84ff] dark:ring-white/10"
            >
              <span className="block aspect-[4/3] overflow-hidden">
                <img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
              </span>
              <span className="absolute inset-x-0 bottom-0 translate-y-1 bg-gradient-to-t from-black/75 to-transparent px-2.5 pb-2 pt-7 text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="block truncate text-[11.5px] font-semibold">{photo.title}</span>
                <span className="block truncate text-[10px] text-white/70">{photo.meta}</span>
              </span>
            </button>
          ))}
        </div>

        {active !== 'All' && (active === 'Builds' ? items.filter(p => /sprout|pest|pipe/i.test(p.meta)) : items.filter(p => /contest|ICPC/i.test(p.meta))).length === 0 && (
          <p className="py-12 text-center text-[13px] text-[var(--dim)]">No photographs in this album yet.</p>
        )}
      </div>
    </div>
  )
}
