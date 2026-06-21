import { useEffect, useRef, useState } from 'react'
import ScrollCanvasSequence from './ScrollCanvasSequence'

const LINES = [
  { text: '$ whoami', delay: 200 },
  { text: 'ziad_emad_ahmed', delay: 700 },
  { text: '', delay: 1000 },
  { text: '$ cat skills.txt', delay: 1300 },
  { text: '> Machine Learning', delay: 1800 },
  { text: '> Deep Learning', delay: 2200 },
  { text: '> Neural Networks', delay: 2600 },
  { text: '> Python  |  PyTorch  |  TensorFlow', delay: 3000 },
  { text: '> LangChain  |  Transformers  |  CUDA', delay: 3400 },
  { text: '', delay: 3800 },
  { text: '$ status', delay: 4000 },
  { text: '[ ACTIVE ] — Open to collaborations', delay: 4600 },
]

interface AboutProps {
  handsImages: HTMLImageElement[]
}

export default function About({ handsImages }: AboutProps) {
  const [visibleLines, setVisibleLines] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const hasStartedRef = useRef(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedRef.current) {
          hasStartedRef.current = true
          LINES.forEach((line, i) => {
            const t = setTimeout(() => {
              setVisibleLines(i + 1)
            }, line.delay)
            timersRef.current.push(t)
          })
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(section)
    return () => {
      observer.disconnect()
      timersRef.current.forEach(clearTimeout)
    }
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-black py-28 md:py-36 px-5 sm:px-8 md:px-10 overflow-hidden"
      style={{ zIndex: 2 }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* LEFT — Terminal window */}
        <div
          className="rounded-xl overflow-hidden border border-white/10 relative z-10"
          style={{
            background: 'rgba(10,10,10,0.95)',
            boxShadow: '0 0 60px rgba(0,255,100,0.04), 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-4 text-[11px] text-white/25 font-mono tracking-widest">
              ziad@neural-lab ~ %
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-6 min-h-[320px] font-mono text-[13px] sm:text-[14px] leading-relaxed">
            {LINES.slice(0, visibleLines).map((line, i) => (
              <div key={i}>
                {line.text === '' ? (
                  <br />
                ) : (
                  <span
                    style={{
                      color: line.text.startsWith('$')
                        ? '#4ade80'
                        : line.text.startsWith('>')
                        ? '#e2e8f0'
                        : line.text.startsWith('[')
                        ? '#34d399'
                        : '#94a3b8',
                    }}
                  >
                    {line.text}
                  </span>
                )}
              </div>
            ))}
            {/* Blinking cursor at end */}
            {visibleLines < LINES.length && (
              <span
                className="inline-block w-[8px] h-[14px] bg-green-400 ml-[1px]"
                style={{ animation: 'blink 1s step-end infinite', verticalAlign: 'middle' }}
              />
            )}
          </div>
        </div>

        {/* RIGHT — Scroll Canvas Image Sequence */}
        <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
          
          <ScrollCanvasSequence 
            images={handsImages} 
            targetRef={sectionRef as React.RefObject<HTMLElement>} 
          />
          
          {/* Vignette to blend edges over the canvas */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none" />
        </div>

      </div>
    </section>
  )
}
