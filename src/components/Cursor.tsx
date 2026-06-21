import { useEffect, useRef } from 'react'

/**
 * Custom floating ring cursor with 0.15 inertia using requestAnimationFrame.
 * Built as a pure SVG circle that trails the mouse smoothly.
 */
export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const raf = useRef<number>(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      // Linear interpolation — 0.15 inertia factor
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x - 20}px, ${pos.current.y - 20}px)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.current.x - 3}px, ${mouse.current.y - 3}px)`
      }

      raf.current = requestAnimationFrame(animate)
    }

    raf.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      {/* Ring — trails with inertia */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999] will-change-transform"
        style={{ willChange: 'transform' }}
      >
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="rgba(200,200,210,0.7)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Dot — snaps instantly to cursor */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full bg-white pointer-events-none z-[9999] will-change-transform"
        style={{ willChange: 'transform' }}
      />
    </>
  )
}
