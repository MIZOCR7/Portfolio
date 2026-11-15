import { useCallback, useEffect, useRef, useState } from 'react'

export function useMedia(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

export function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })
  const set = useCallback(
    next => {
      setValue(prev => {
        const result = typeof next === 'function' ? next(prev) : next
        try {
          window.localStorage.setItem(key, JSON.stringify(result))
        } catch {
          /* private mode */
        }
        return result
      })
    },
    [key]
  )
  return [value, set]
}

export function useViewport() {
  const [size, setSize] = useState({
    w: typeof window !== 'undefined' ? window.innerWidth : 1440,
    h: typeof window !== 'undefined' ? window.innerHeight : 900,
  })
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    onResize()
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])
  return size
}

export function useClock(timezone) {
  const format = useCallback(() => {
    const now = new Date()
    return {
      time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: timezone }),
      day: now.toLocaleDateString('en-GB', { weekday: 'short', timeZone: timezone }),
      date: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: timezone }),
      long: now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: timezone }),
      iso: now.toISOString(),
    }
  }, [timezone])
  const [clock, setClock] = useState(format)
  useEffect(() => {
    let timer = 0
    const tick = () => {
      if (!document.hidden) setClock(format())
    }
    const start = () => {
      window.clearInterval(timer)
      tick()
      if (!document.hidden) timer = window.setInterval(tick, 20000)
    }
    start()
    document.addEventListener('visibilitychange', start)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', start)
    }
  }, [format])
  return clock
}

export function useMotionPreference() {
  return useMedia('(prefers-reduced-motion: reduce)')
}

/* Keeps focus inside a window and returns it to the launcher when the window closes. */
export function useDialogFocus(open, ref, openerRef) {
  const lastFocused = useRef(null)
  useEffect(() => {
    if (!open) return
    lastFocused.current = document.activeElement
    const el = ref.current
    if (el) {
      window.requestAnimationFrame(() => {
        const target = el.querySelector('[data-autofocus]') || el
        target.focus?.({ preventScroll: true })
      })
    }
    const onKey = e => {
      if (e.key !== 'Tab' || !ref.current) return
      const nodes = ref.current.querySelectorAll(
        'a[href], button:not([disabled]), input, textarea, select, video[controls], [tabindex]:not([tabindex="-1"])'
      )
      const list = Array.from(nodes).filter(n => n.offsetParent !== null)
      if (!list.length) return
      const first = list[0]
      const last = list[list.length - 1]
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      const target = openerRef?.current || lastFocused.current
      if (target && document.contains(target)) target.focus?.({ preventScroll: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
}
