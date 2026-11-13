import { useState } from 'react'
import { PROFILE } from '../data'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="contact section--ink" id="contact">
      <div className="wrap">
        <p className="mono" style={{ marginBottom: 26 }}>
          09 — Contact
        </p>

        <h2 className="contact-title reveal-mask">
          <span className="line">
            <span>Let&apos;s talk</span>
          </span>
          <span className="line">
            <span>
              about <em>something.</em>
            </span>
          </span>
        </h2>

        <a className="contact-mail" href={`mailto:${PROFILE.email}`}>
          {PROFILE.email}
        </a>

        <div className="contact-actions no-print">
          <a className="btn btn--solid" href={`mailto:${PROFILE.email}`}>
            Write to me <i>→</i>
          </a>
          <button className="btn" type="button" onClick={copy}>
            {copied ? 'Copied ✓' : 'Copy address'}
          </button>
          <button className="btn" type="button" onClick={() => window.print()}>
            One-page résumé ↓
          </button>
        </div>

        <div className="socials">
          <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
            <span className="k">GitHub</span> /MIZOCR7 <i>↗</i>
          </a>
          <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
            <span className="k">LinkedIn</span> /ziad-emad <i>↗</i>
          </a>
          <a href={`mailto:${PROFILE.email}`}>
            <span className="k">Reply</span> usually within a day
          </a>
        </div>

        <div className="footer">
          <span>© 2026 {PROFILE.fullName}</span>
          <span>Designed &amp; built by hand</span>
          <span>Ctrl / ⌘ + P for a one-page PDF</span>
        </div>
      </div>
    </section>
  )
}
