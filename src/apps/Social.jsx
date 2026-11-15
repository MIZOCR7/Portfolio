import { CONFIG } from '../config'

export default function Social({ onLink }) {
  const { site } = CONFIG
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none items-center gap-2 border-b border-[var(--line)] bg-[var(--win-2)] px-3 py-2">
        <div className="flex gap-1 text-[var(--dim)]" aria-hidden="true">
          <span className="px-1">‹</span>
          <span className="px-1 opacity-40">›</span>
        </div>
        <div className="flex flex-1 items-center justify-center gap-1.5 rounded-[6px] border border-[var(--line)] bg-[var(--win)] px-2 py-[5px]">
          <svg width="9" height="11" viewBox="0 0 9 11" fill="currentColor" aria-hidden="true" className="opacity-55">
            <path d="M4.5 0a2.4 2.4 0 0 0-2.4 2.4v1.2H1.4A1.4 1.4 0 0 0 0 5v4.2A1.4 1.4 0 0 0 1.4 10.5h6.2A1.4 1.4 0 0 0 9 9.2V5a1.4 1.4 0 0 0-1.4-1.4H6.9V2.4A2.4 2.4 0 0 0 4.5 0Zm0 1.2c.7 0 1.2.5 1.2 1.2v1.2H3.3V2.4c0-.7.5-1.2 1.2-1.2Z" />
          </svg>
          <span className="truncate text-[11.5px] text-[var(--dim)]">ziad-emad — links</span>
        </div>
        <span className="text-[13px] text-[var(--dim)]" aria-hidden="true">＋</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="border-b border-[var(--line)] bg-[var(--win-2)]/60 px-6 py-6">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[var(--dim)]">Elsewhere</p>
          <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.025em]">Find me online</h1>
          <p className="mt-1 max-w-[52ch] text-[12.5px] leading-relaxed text-[var(--dim)]">
            Repositories, the professional profile, and the fastest way to reach me. Every link opens in a new tab.
          </p>
        </div>

        <div className="grid gap-3 p-6 sm:grid-cols-2">
          {CONFIG.socials.map(s => (
            <button
              key={s.label}
              type="button"
              onClick={() => onLink(s.href)}
              className="group flex items-center gap-3 rounded-[11px] border border-[var(--line)] bg-[var(--win-2)] p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[9px] shadow-sm" style={{ backgroundColor: s.color }}>
                <img src={s.icon} alt="" className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold">{s.label}</span>
                <span className="block truncate text-[11.5px] text-[var(--dim)]">{s.handle}</span>
              </span>
              <span className="text-[12px] text-[var(--dim)] transition-transform group-hover:translate-x-0.5">↗</span>
            </button>
          ))}

          <div className="rounded-[11px] border border-dashed border-[var(--line)] p-4 text-[11.5px] leading-relaxed text-[var(--dim)]">
            <p className="mb-1 font-semibold text-[var(--fg)]">Also on file</p>
            NASA Space Apps · The Earth Prize · IBM Machine Learning · Schoolhouse peer tutoring. Certificates live in Work → Awards.
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="rounded-[11px] bg-[var(--win-2)] p-4">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--dim)]">Location</p>
            <p className="mt-1 text-[12.5px]">{site.location}</p>
            <p className="text-[11.5px] text-[var(--dim)]">{site.school}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
