import { useEffect, useRef, useCallback } from 'react'

interface CanvasSequenceProps {
  images: HTMLImageElement[]
}

const LERP = 0.05

export default function CanvasSequence({ images }: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const targetFrameRef = useRef(0)
  const currentFrameRef = useRef(0)
  const rafRef = useRef<number>(0)

  // Ensure canvas dynamically fits window
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }, [])

  // Draw a specific frame using object-fit: cover math
  const drawImage = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0) return

    const canvasWidth = canvas.width
    const canvasHeight = canvas.height

    const imgWidth = img.naturalWidth
    const imgHeight = img.naturalHeight

    // Calculate object-fit: cover ratios
    const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight)
    const x = (canvasWidth / 2) - (imgWidth / 2) * scale
    const y = (canvasHeight / 2) - (imgHeight / 2) * scale

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale)
  }, [])

  const tick = useCallback(() => {
    // Lerp logic
    currentFrameRef.current += (targetFrameRef.current - currentFrameRef.current) * LERP
    
    // Safety boundaries
    const maxFrame = Math.max(0, images.length - 1)
    if (isNaN(currentFrameRef.current)) currentFrameRef.current = 0
    currentFrameRef.current = Math.max(0, Math.min(currentFrameRef.current, maxFrame))

    // Determine which image to draw
    const frameIndex = Math.round(currentFrameRef.current)
    const img = images[frameIndex]
    
    if (img) {
      drawImage(img)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [images, drawImage])

  useEffect(() => {
    // Setup
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initial draw
    if (images.length > 0) {
      drawImage(images[0])
    }

    const onMouseMove = (e: MouseEvent) => {
      const maxFrame = Math.max(0, images.length - 1)
      let newTarget = (e.clientX / window.innerWidth) * maxFrame
      if (isNaN(newTarget)) newTarget = 0
      targetFrameRef.current = Math.max(0, Math.min(newTarget, maxFrame))
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [images, resizeCanvas, tick, drawImage])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
