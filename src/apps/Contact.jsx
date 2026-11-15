import { useState } from 'react'
import { CONFIG } from '../config'

export default function Contact({ onCopy }) {
  const [copied, setCopied] = useState(false)
  const { site } = CONFIG

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      onCopy?.('Email address copied')
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      onCopy?.('Copy blocked by the browser — use the mail link')
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[var(--line)] bg-[var(--win-2)] px-6 py-5">
        <div className="flex items-center gap-4">
          <img src="images/icons/mail.png" alt="" className="h-[58px] w-[58px] object-contain drop-shadow" />
          <div>
            <h1 className="text-[20px] font-semibold tracking-[-0.02em]">Get in touch</h1>
            <p className="text-[12.5px] text-[var(--dim)]">For research, internships or a project that needs eyes.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto px-6 py-5">
        <div className="rounded-[10px] border border-[var(--line)] bg-[var(--win-2)] p-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--dim)]">Email</p>
          <p className="mt-1 break-all font-mono text-[14px]">{site.email}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={`mailto:${site.email}?subject=Hello%20Ziad`}
              className="rounded-[7px] bg-[#0a84ff] px-3.5 py-1.5 text-[12.5px] font-medium text-white hover:brightness-110"
            >
              Open in Mail
            </a>
            <button
              type="button"
              onClick={copy}
              className="rounded-[7px] border border-[var(--line)] bg-[var(--win)] px-3.5 py-1.5 text-[12.5px] font-medium hover:bg-[var(--hover)]"
            >
              {copied ? 'Copied ✓' : 'Copy address'}
            </button>
          </div>
          <p className="mt-2 text-[11px] text-[var(--dim)]">
            No contact form, no inbox on this site — the link opens your own mail app.
          </p>
        </div>

        <div className="grid gap-2">
          {CONFIG.socials
            .filter(s => s.href !== `mailto:${site.email}`)
            .map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-[9px] border border-[var(--line)] p-3 transition-colors hover:bg-[var(--hover)]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-[7px]" style={{ backgroundColor: s.color }}>
                  <img src={s.icon} alt="" className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-semibold">{s.label}</span>
                  <span className="block truncate text-[11px] text-[var(--dim)]">{s.handle}</span>
                </span>
                <span className="text-[12px] text-[var(--dim)]">↗</span>
              </a>
            ))}
        </div>

        <p className="pb-2 text-[11px] leading-relaxed text-[var(--dim)]">
          Based in {site.location}. A PDF résumé is available on request; the Résumé window prints a current one-page copy.
        </p>
      </div>
    </div>
  )
}
