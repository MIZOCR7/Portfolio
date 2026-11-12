import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    let raf = 0

    const move = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
    }

    const over = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null
      const interactive = el?.closest('a, button, .media, .minor-row, .row')
      dot.classList.toggle('is-big', Boolean(interactive))
    }

    const loop = () => {
      x += (tx - x) * 0.16
      y += (ty - y) * 0.16
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
    }
  }, [])

  return <div ref={dotRef} className="cursor" aria-hidden="true" />
}
