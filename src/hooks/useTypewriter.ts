import { useState, useEffect } from 'react'

interface UseTypewriterOptions {
  text: string
  speed?: number       // ms per character
  startDelay?: number  // ms before starting
}

interface TypewriterResult {
  displayed: string
  done: boolean
}

export function useTypewriter({
  text,
  speed = 38,
  startDelay = 600,
}: UseTypewriterOptions): TypewriterResult {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Reset when text changes
    setDisplayed('')
    setDone(false)

    let idx = 0
    let interval: ReturnType<typeof setInterval>

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        idx++
        setDisplayed(text.slice(0, idx))
        if (idx >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [text, speed, startDelay])

  return { displayed, done }
}
