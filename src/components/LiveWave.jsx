import { useEffect, useRef } from 'react'

/* A terminal-native audio scope. It reads the smoothed mic/output levels from
   a ref so the animation never causes a React render. */
export default function LiveWave({ levels, active, speaking }) {
  const ref = useRef(null)
  const history = useRef(new Array(72).fill(0))

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let phase = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = time => {
      frame = requestAnimationFrame(draw)
      if (!width || !height) resize()
      phase = time / 1000
      ctx.clearRect(0, 0, width, height)

      const mic = active ? levels.current?.mic || 0 : 0
      const output = active ? levels.current?.output || 0 : 0
      const energy = Math.min(1, mic * 0.95 + output * 1.35)
      history.current.push(energy)
      if (history.current.length > 72) history.current.shift()

      const mid = height / 2
      const accent = speaking ? [126, 226, 160] : [48, 209, 88]
      const cool = [10, 132, 255]

      // faint instrument grid
      ctx.strokeStyle = 'rgba(126, 226, 160, 0.09)'
      ctx.lineWidth = 1
      for (let i = 1; i < 4; i += 1) {
        const y = (height / 4) * i
        ctx.beginPath()
        ctx.moveTo(0, y + 0.5)
        ctx.lineTo(width, y + 0.5)
        ctx.stroke()
      }
      for (let i = 1; i < 8; i += 1) {
        const x = (width / 8) * i
        ctx.beginPath()
        ctx.moveTo(x + 0.5, 0)
        ctx.lineTo(x + 0.5, height)
        ctx.stroke()
      }

      // centre line
      ctx.strokeStyle = 'rgba(126, 226, 160, 0.22)'
      ctx.beginPath()
      ctx.moveTo(0, mid)
      ctx.lineTo(width, mid)
      ctx.stroke()

      // mirrored bars
      const count = Math.max(34, Math.min(76, Math.round(width / 9)))
      const gap = 2
      const barWidth = Math.max(1.6, width / count - gap)
      const idle = active ? 0.035 : 0.014
      ctx.shadowBlur = speaking ? 10 : 5
      for (let i = 0; i < count; i += 1) {
        const p = count === 1 ? 0.5 : i / (count - 1)
        const shape = Math.pow(Math.sin(p * Math.PI), 0.72)
        const wobble =
          Math.sin(phase * 2.4 + i * 0.48) * 0.035 +
          Math.sin(phase * 1.3 - i * 0.21) * 0.025
        const level = Math.max(0.012, energy * shape + idle + wobble * shape)
        const bar = Math.max(1.4, level * height * 0.78)
        const x = (width / count) * i + gap / 2
        const mix = Math.min(1, level * 2.4)
        const r = Math.round(accent[0] * (1 - mix) + cool[0] * mix)
        const g = Math.round(accent[1] * (1 - mix) + cool[1] * mix)
        const b = Math.round(accent[2] * (1 - mix) + cool[2] * mix)
        const alpha = 0.55 + Math.min(0.45, level * 3)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.55)`
        const radius = Math.min(barWidth / 2, 2.4)
        if (typeof ctx.roundRect === 'function') {
          ctx.beginPath()
          ctx.roundRect(x, mid - bar / 2, barWidth, bar, radius)
          ctx.fill()
        } else {
          ctx.fillRect(x, mid - bar / 2, barWidth, bar)
        }
      }
      ctx.shadowBlur = 0

      // trailing signal line
      ctx.beginPath()
      const trail = history.current
      for (let i = 0; i < trail.length; i += 1) {
        const p = i / (trail.length - 1)
        const x = p * width
        const y =
          mid -
          Math.sin(p * Math.PI * 3 + phase * 2.2) * (trail[i] * height * 0.3) -
          (trail[i] - 0.05) * height * 0.15
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = speaking ? 'rgba(126, 226, 160, 0.6)' : 'rgba(48, 209, 88, 0.42)'
      ctx.lineWidth = 1.4
      ctx.stroke()

      // scanning head
      const head = ((phase * 0.16) % 1) * width
      ctx.fillStyle = speaking ? '#8fe0aa' : '#30d158'
      ctx.beginPath()
      ctx.arc(head, mid, 2.1, 0, Math.PI * 2)
      ctx.fill()
    }

    resize()
    frame = requestAnimationFrame(draw)
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    observer?.observe(canvas)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [active, levels, speaking])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="block h-[88px] w-full"
    />
  )
}
