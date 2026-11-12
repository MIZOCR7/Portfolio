import { useEffect, useRef } from 'react'

/** Tilts an element in 3D toward the pointer. No-ops on touch and reduced motion. */
export function useTilt<T extends HTMLElement>(strength = 7) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let px = 0
    let py = 0

    const apply = () => {
      raf = 0
      el.style.transform = `perspective(1200px) rotateX(${(-py * strength).toFixed(2)}deg) rotateY(${(
        px * strength
      ).toFixed(2)}deg)`
    }

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      px = (e.clientX - r.left) / r.width - 0.5
      py = (e.clientY - r.top) / r.height - 0.5
      el.classList.add('tilt-on')
      if (!raf) raf = requestAnimationFrame(apply)
    }

    const reset = () => {
      el.classList.remove('tilt-on')
      el.style.transform = ''
    }

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', reset)

    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', reset)
    }
  }, [strength])

  return ref
}
