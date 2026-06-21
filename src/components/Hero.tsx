import { useState } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import Magnetic from './Magnetic'

const TYPEWRITER_TEXT =
  'Building intelligent systems and neural architectures. Welcome to my digital workspace.'

const WHITE_PILLS = [
  { label: 'View Projects', href: '#projects' },
  { label: 'Read Research', href: '#about' },
  { label: 'GitHub', href: 'https://github.com/ZIZO17z' },
]

const EMAIL = 'ziad.1024087@stemoctober.moe.edu.eg'

function CopyIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect x="3" y="0" width="8" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
      <rect x="0" y="3" width="8" height="8" rx="1.2" fill="transparent" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  )
}

export default function Hero() {
  const { displayed, done } = useTypewriter({
    text: TYPEWRITER_TEXT,
    speed: 38,
    startDelay: 600,
  })

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* silently fail */
    }
  }

  const pillBase =
    'inline-flex items-center justify-center rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.35em] whitespace-nowrap transition-colors duration-200 select-none font-medium'

  return (
    <section
      id="hero"
      className="relative h-screen flex flex-col justify-end md:justify-center pb-12 md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden"
      style={{ zIndex: 1 }}
    >
      <div className="relative max-w-2xl" style={{ zIndex: 10 }}>

        {/* 1. Blurred intro label */}
        <p
          className="mb-5 sm:mb-6 pointer-events-none select-none"
          style={{
            fontSize: 'clamp(16px, 3.5vw, 24px)',
            lineHeight: 1.35,
            fontWeight: 400,
            color: '#000',
            filter: 'blur(4px)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Initializing environment...
          <br />
          Ziad Emad Ahmed // AI Engineer
        </p>

        {/* 2. Typewriter text */}
        <p
          className="mb-6 sm:mb-7"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.38,
            fontWeight: 400,
            color: '#000',
            minHeight: '60px',
            fontFamily: 'var(--font-body)',
          }}
        >
          {displayed}
          {!done && <span className="typewriter-cursor" />}
        </p>

        {/* 3. Action pills */}
        <div className="pills-appear flex flex-wrap gap-2 sm:gap-3">
          {/* White pills */}
          {WHITE_PILLS.map(({ label, href }) => (
            <Magnetic key={label}>
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`${pillBase} bg-white text-black border border-black/15 hover:bg-black hover:text-white`}
              >
                {label}
              </a>
            </Magnetic>
          ))}

          {/* Copy-email outline pill */}
          <Magnetic>
            <button
              onClick={handleCopy}
              className={`${pillBase} text-white bg-transparent border border-white hover:bg-white hover:text-black gap-2 sm:gap-3`}
              title="Copy email address"
            >
              <span>
                {copied ? (
                  'Copied!'
                ) : (
                  <>
                    Email:{' '}
                    <span className="underline underline-offset-1">
                      ziad.1024087@stemoctober...
                    </span>
                  </>
                )}
              </span>
              {!copied && <CopyIcon />}
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
