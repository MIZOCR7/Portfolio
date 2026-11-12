import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Capstone', href: '#capstone', optional: true },
  { label: 'Ankara', href: '#ankara' },
  { label: 'Toolkit', href: '#toolkit', optional: true },
  { label: 'Résumé', href: '#resume', optional: true },
]

export default function Nav() {
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 14)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={solid ? 'nav is-solid' : 'nav'}>
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
      </div>
    </header>
  )
}
