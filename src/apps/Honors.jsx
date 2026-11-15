import { CONFIG } from '../config'

export default function Honors({ onView }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none items-center gap-2 border-b border-[var(--line)] bg-[var(--win-2)] px-4 py-2.5">
        <img src="images/icons/apps.png" alt="" className="h-5 w-5 object-contain" />
        <h1 className="text-[13px] font-semibold">Honors</h1>
        <span className="ml-auto text-[11.5px] text-[var(--dim)]">{CONFIG.honors.length} entries</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4 px-1">
          <h2 className="text-[18px] font-semibold tracking-[-0.015em]">Awards & recognition</h2>
          <p className="max-w-[68ch] text-[11.5px] leading-relaxed text-[var(--dim)]">
            Results, roles and service — each with the document behind it where one exists.
          </p>
        </div>

        <ol className="space-y-2">
          {CONFIG.honors.map((h, i) => (
            <li key={h.title}>
              <div className="flex items-start gap-3 rounded-[9px] border border-[var(--line)] bg-[var(--win-2)] p-3">
                <span className="mt-0.5 w-6 flex-none font-mono text-[10.5px] text-[var(--dim)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {h.evidence ? (
                  <button
                    type="button"
                    onClick={() =>
                      onView({
                        src: h.evidence,
                        title: h.title,
                        meta: `${h.org} · ${h.year}`,
                        note: h.detail,
                      })
                    }
                    className="h-[58px] w-[76px] flex-none overflow-hidden rounded-[5px] bg-white p-1 ring-1 ring-black/10 transition hover:ring-[#0a84ff]"
                    aria-label={`View evidence for ${h.title}`}
                  >
                    <img src={h.evidence} alt="" loading="lazy" className="h-full w-full object-contain" />
                  </button>
                ) : (
                  <span className="flex h-[58px] w-[76px] flex-none items-center justify-center rounded-[5px] border border-dashed border-[var(--line)] text-[9px] text-[var(--dim)]">
                    on file
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h3 className="text-[13px] font-semibold">{h.title}</h3>
                    <span className="font-mono text-[10px] text-[var(--dim)]">{h.year}</span>
                  </div>
                  <p className="text-[11px] font-medium text-[var(--dim)]">{h.org}</p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--fg)]/75">{h.detail}</p>
                </div>
                {h.evidence && <span className="self-center text-[11px] text-[var(--dim)]">↗</span>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
