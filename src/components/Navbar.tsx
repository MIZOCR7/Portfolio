import { useState, useEffect } from 'react'
import { useScroll } from 'framer-motion'

const LINKS = ['About', 'Projects', 'Contact']

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    const handleScroll = (y: number) => {
      // If scrolled past the hero section (roughly 90vh)
      setIsScrolled(y > window.innerHeight * 0.9)
    }
    const unsub = scrollY.on('change', handleScroll)
    return () => unsub()
  }, [scrollY])

  return (
    <>
      {/* ── Fixed top navbar ───────────────────────────── */}
      <nav
        style={{ zIndex: 50, transition: 'color 0.3s ease' }}
        className={`fixed top-0 left-0 right-0 flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 ${
          isScrolled ? 'text-white' : 'text-black'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="text-[21px] sm:text-[26px] tracking-tight select-none"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Z.E.A.
          </a>
          <span
            className={`text-[14px] sm:text-[16px] select-none font-bold tracking-widest px-2 py-0.5 rounded-md transition-colors duration-300 ${
              isScrolled ? 'text-white/50 border border-white/20' : 'text-black/50 border border-black/20'
            }`}
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            AI
          </span>
        </div>

        {/* Desktop center nav links */}
        <div className="hidden md:flex items-center gap-1 text-[20px]">
          {LINKS.map((link, i) => (
            <span key={link} className="flex items-center">
              <a
                href={`#${link.toLowerCase()}`}
                className="hover:opacity-50 transition-opacity duration-200 px-1"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {link}
              </a>
              {i < LINKS.length - 1 && (
                <span className={`select-none transition-colors duration-300 ${isScrolled ? 'text-white/30' : 'text-black/30'}`}>,</span>
              )}
            </span>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <a
            href="mailto:ziad.1024087@stemoctober.moe.edu.eg"
            className="text-[20px] underline underline-offset-2 hover:opacity-50 transition-opacity duration-200"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Get in touch
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
          style={{ zIndex: 11, position: 'relative' }}
        >
          <span
            className={`bar-top block w-6 h-[2px] transition-colors duration-300 ${isScrolled || open ? 'bg-white' : 'bg-black'}`}
            style={{
              transform: open ? 'translateY(7px) rotate(45deg)' : 'none',
              transition: 'transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease',
            }}
          />
          <span
            className={`block w-6 h-[2px] transition-colors duration-300 ${isScrolled || open ? 'bg-white' : 'bg-black'}`}
            style={{
              opacity: open ? 0 : 1,
              transition: 'opacity 0.3s ease, background-color 0.3s ease',
            }}
          />
          <span
            className={`bar-bot block w-6 h-[2px] transition-colors duration-300 ${isScrolled || open ? 'bg-white' : 'bg-black'}`}
            style={{
              transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none',
              transition: 'transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease',
            }}
          />
        </button>
      </nav>

      {/* ── Mobile overlay ─────────────────────────────── */}
      <div
        className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-md flex flex-col justify-center px-8 gap-8"
        style={{
          zIndex: 40,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      >
        {LINKS.map(link => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            onClick={() => setOpen(false)}
            className="text-[36px] font-medium text-white hover:opacity-50 transition-opacity duration-200"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {link}
          </a>
        ))}
        <a
          href="mailto:ziad.1024087@stemoctober.moe.edu.eg"
          onClick={() => setOpen(false)}
          className="text-[32px] font-medium text-white underline underline-offset-2 hover:opacity-50 transition-opacity duration-200"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Get in touch
        </a>
      </div>
    </>
  )
}
