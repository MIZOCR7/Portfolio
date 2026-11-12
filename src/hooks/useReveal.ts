import { useEffect } from 'react'

/**
 * Adds `.is-in` to every `.reveal` element once it scrolls into view.
 * Falls back to showing everything when the observer is missing or the
 * visitor asked for reduced motion.
 */
export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (els.length === 0) return

    if (reduced || typeof IntersectionObserver === 'undefined') {
      els.forEach(el => el.classList.add('is-in'))
      return
    }

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
    )

    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}
