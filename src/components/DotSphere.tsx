import { useEffect, useRef } from 'react'

type Point = { x: number; y: number; z: number }

export default function DotSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const COUNT = 700
    const points: Point[] = []

    // Fibonacci sphere — evenly spread points on a 3D sphere.
    for (let i = 0; i < COUNT; i++) {
      const k = i + 0.5
      const phi = Math.acos(1 - (2 * k) / COUNT)
      const theta = Math.PI * (1 + Math.sqrt(5)) * k
      points.push({
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi),
      })
    }

    let width = 0
    let height = 0
    let raf = 0
    let spin = 0
    let pointerX = 0
    let pointerY = 0
    let tiltX = 0
    let tiltY = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onPointer = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth - 0.5) * 1.1
      pointerY = (e.clientY / window.innerHeight - 0.5) * 0.8
    }

    const draw = () => {
      spin += reduce ? 0 : 0.0022
      tiltY += (pointerX - tiltY) * 0.045
      tiltX += (pointerY - tiltX) * 0.045

      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2
      const radius = Math.min(width, height) * 0.44
      const ry = spin + tiltY
      const rx = -0.22 + tiltX
      const cosY = Math.cos(ry)
      const sinY = Math.sin(ry)
      const cosX = Math.cos(rx)
      const sinX = Math.sin(rx)

      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        const x1 = p.x * cosY - p.z * sinY
        const z1 = p.x * sinY + p.z * cosY
        const y2 = p.y * cosX - z1 * sinX
        const z2 = p.y * sinX + z1 * cosX

        const perspective = 2.4 / (2.4 - z2 * 0.65)
        const sx = cx + x1 * radius * perspective
        const sy = cy + y2 * radius * perspective
        const depth = (z2 + 1) / 2
        const size = 0.5 + depth * 1.5
        const alpha = 0.05 + depth * 0.42

        ctx.beginPath()
        ctx.fillStyle =
          depth > 0.76
            ? `rgba(169, 72, 31, ${alpha * 1.05})`
            : `rgba(19, 18, 15, ${alpha * 0.62})`
        ctx.arc(sx, sy, size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = () => {
      draw()
      raf = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer, { passive: true })

    if (reduce) {
      draw()
    } else {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (!raf) raf = requestAnimationFrame(loop)
          } else if (raf) {
            cancelAnimationFrame(raf)
            raf = 0
          }
        },
        { threshold: 0 }
      )
      io.observe(canvas)
      raf = requestAnimationFrame(loop)

      return () => {
        io.disconnect()
        cancelAnimationFrame(raf)
        window.removeEventListener('resize', resize)
        window.removeEventListener('pointermove', onPointer)
      }
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return <canvas ref={canvasRef} className="sphere" aria-hidden="true" />
}
