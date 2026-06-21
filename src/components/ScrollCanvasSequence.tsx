import { useEffect, useRef, useCallback } from 'react'
import { useInView, useMotionValue, animate } from 'framer-motion'

interface ScrollCanvasSequenceProps {
  images: HTMLImageElement[]
  targetRef: React.RefObject<HTMLElement>
}

const LERP = 0.15

export default function ScrollCanvasSequence({ images, targetRef }: ScrollCanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentFrameRef = useRef(0)
  const rafRef = useRef<number>(0)

  // Trigger animation when the section comes into view
  const isInView = useInView(targetRef, { margin: "-20% 0px -20% 0px" })
  const targetFrame = useMotionValue(0)

  useEffect(() => {
    if (isInView && images.length > 0) {
      // Play full animation over 5 seconds
      const controls = animate(targetFrame, images.length - 1, {
        duration: 5,
        ease: "easeInOut",
      })
      return controls.stop
    } else {
      // Rewind smoothly when out of view
      const controls = animate(targetFrame, 0, {
        duration: 2,
        ease: "easeOut",
      })
      return controls.stop
    }
  }, [isInView, images.length, targetFrame])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (parent) {
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }
  }, [])

  const drawImage = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !img || !img.complete || img.naturalWidth === 0) return

    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    const imgWidth = img.naturalWidth
    const imgHeight = img.naturalHeight

    const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight)
    const x = (canvasWidth / 2) - (imgWidth / 2) * scale
    const y = (canvasHeight / 2) - (imgHeight / 2) * scale

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale)
  }, [])

  const tick = useCallback(() => {
    const tFrame = targetFrame.get() || 0

    currentFrameRef.current += (tFrame - currentFrameRef.current) * LERP

    if (isNaN(currentFrameRef.current)) currentFrameRef.current = 0

    const frameIndex = Math.round(currentFrameRef.current)
    const img = images[frameIndex]

    if (img) {
      drawImage(img)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [images, drawImage, targetFrame])

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    if (images.length > 0) {
      drawImage(images[0])
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [images, resizeCanvas, tick, drawImage])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-80"
      style={{
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
