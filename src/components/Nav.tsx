import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Wall', href: '#recognition' },
  { label: 'Archive', href: '#archive' },
  { label: 'METU', href: '#metu' },
  { label: 'Journey', href: '#journey', optional: true },
]

export default function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 14)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the menu whenever the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 861px)')
    const onChange = () => setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className={solid || open ? 'nav is-solid' : 'nav'}>
        <div className="wrap nav-inner">
          <a className="brand" href="#top" aria-label="Ziad Emad — back to top">
            Ziad Emad <span>AI</span>
          </a>

          <nav className="nav-links" aria-label="Sections">
            {LINKS.map(l => (
              <a key={l.href} href={l.href} className={l.optional ? 'is-optional' : undefined}>
                {l.label}
              </a>
            ))}
            <a href="#contact">Contact</a>
          </nav>

          <button className="nav-cta" type="button" onClick={() => window.print()}>
            PDF <i>↓</i>
          </button>

          <button
            className="nav-burger"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(v => !v)}
          >
            <span>{open ? 'Close' : 'Menu'}</span>
            <i aria-hidden="true">{open ? '✕' : '≡'}</i>
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={open ? 'menu is-open' : 'menu'} hidden={!open}>
        <nav aria-label="Sections, mobile">
          {[...LINKS, { label: 'Contact', href: '#contact' }].map((l, i) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              {l.label}
            </a>
          ))}
        </nav>
        <button className="btn" type="button" onClick={() => window.print()}>
          One-page PDF ↓
        </button>
      </div>
    </>
  )
}
