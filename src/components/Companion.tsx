import { useCallback, useRef, useState } from 'react'
import { useLive } from '../hooks/useLive'

function Avatar({ level }: { level: number }) {
  return (
    <svg className="ava" viewBox="0 0 200 200" style={{ '--level': level } as React.CSSProperties}>
      <defs>
        <linearGradient id="avaBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0d9c6" />
          <stop offset="1" stopColor="#d9b79c" />
        </linearGradient>
        <linearGradient id="avaSkin" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#e9bb98" />
          <stop offset="1" stopColor="#d79a74" />
        </linearGradient>
        <linearGradient id="avaHair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2c1f1a" />
          <stop offset="1" stopColor="#160f0c" />
        </linearGradient>
        <radialGradient id="avaGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#a9481f" stopOpacity="0.35" />
          <stop offset="1" stopColor="#a9481f" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="100" fill="url(#avaBg)" />
      <circle className="ava-glow" cx="100" cy="112" r="86" fill="url(#avaGlow)" />

      {/* shoulders */}
      <path d="M36 200c4-32 28-50 64-50s60 18 64 50z" fill="#1d1b18" />
      <path d="M86 152h28v18c0 6-28 6-28 0z" fill="#d79a74" />

      {/* hair behind */}
      <path
        d="M100 34c-34 0-52 24-52 52 0 18 4 34 4 52 0 10-2 18-6 26h28c-4-10-6-22-6-34 0-16 4-26 10-32 8-8 18-10 22-10s14 2 22 10c6 6 10 16 10 32 0 12-2 24-6 34h28c-4-8-6-16-6-26 0-18 4-34 4-52 0-28-18-52-52-52z"
        fill="url(#avaHair)"
      />

      {/* face */}
      <ellipse cx="100" cy="100" rx="36" ry="42" fill="url(#avaSkin)" />

      {/* fringe, swept from a middle part */}
      <path
        d="M61 94c0-27 17-43 39-43s39 16 39 43c-6-11-13-18-21-20-4 7-11 11-18 11s-14-4-18-11c-8 2-15 9-21 20z"
        fill="url(#avaHair)"
      />
      <path d="M100 54c-2 8-2 16 0 22" stroke="rgba(255,255,255,0.12)" strokeWidth="3" fill="none" />

      {/* brows */}
      <path className="ava-brow" d="M76 84c5-3 11-3 15 0" />
      <path className="ava-brow" d="M109 84c5-3 11-3 15 0" />

      {/* eyes */}
      <g className="ava-blink">
        <ellipse cx="84" cy="95" rx="7.2" ry="8" fill="#fffaf4" />
        <ellipse cx="116" cy="95" rx="7.2" ry="8" fill="#fffaf4" />
        <circle cx="85.5" cy="96" r="4.1" fill="#3a2418" />
        <circle cx="114.5" cy="96" r="4.1" fill="#3a2418" />
        <circle cx="87" cy="94" r="1.3" fill="#fff" />
        <circle cx="113" cy="94" r="1.3" fill="#fff" />
      </g>

      {/* nose + cheeks */}
      <path className="ava-nose" d="M100 101c2 5 1 8-2 9" />
      <ellipse cx="76" cy="111" rx="7" ry="4" fill="#c87a5c" opacity="0.32" />
      <ellipse cx="124" cy="111" rx="7" ry="4" fill="#c87a5c" opacity="0.32" />

      {/* mouth — opens with the voice level */}
      <g className="ava-mouth">
        <path className="ava-lip-top" d="M91 118c4-2 14-2 18 0" />
        <path className="ava-lip-bottom" d="M91 118c5 8 13 8 18 0" />
      </g>

      {/* earrings */}
      <circle cx="63" cy="107" r="2.6" fill="#d8a54a" />
      <circle cx="137" cy="107" r="2.6" fill="#d8a54a" />
    </svg>
  )
}

export default function Companion() {
  const [open, setOpen] = useState(false)
  const levelRef = useRef(0)
  const [level, setLevel] = useState(0)
  const rafRef = useRef(0)

  const onLevel = useCallback((value: number) => {
    levelRef.current = value
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      setLevel(Math.round(levelRef.current * 100) / 100)
    })
  }, [])

  const { status, error, start, stop } = useLive({ onLevel })
  const live = status === 'ready'

  return (
    <>
      <button
        type="button"
        className="ada-launch"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close the assistant' : 'Talk to Ada, the assistant'}
      >
        <span className="ada-launch-dot" data-live={live} />
        <span className="ada-launch-text">Ask Ada</span>
      </button>

      {open && (
        <div className="ada" role="dialog" aria-label="Ada, the portfolio assistant">
          <header className="ada-head">
            <div>
              <p className="ada-name">Ada</p>
              <p className="ada-role">voice guide · Gemini Live</p>
            </div>
            <button type="button" className="ada-close" onClick={() => setOpen(false)} aria-label="Close">
              ✕
            </button>
          </header>

          <div className="ada-stage">
            <Avatar level={level} />
            <div className="ada-rings" data-live={live} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>

          <p className="ada-status">
            {status === 'idle' && 'Tap the mic and ask me anything about Ziad’s work.'}
            {status === 'connecting' && 'Opening the line…'}
            {status === 'ready' && 'Listening — speak normally, in English, Arabic or Turkish.'}
            {status === 'error' && (error ?? 'Something went wrong.')}
          </p>

          <div className="ada-controls">
            {status === 'idle' || status === 'error' ? (
              <button type="button" className="ada-mic" onClick={start}>
                <span className="ada-mic-icon" aria-hidden="true">
                  ●
                </span>
                Start talking
              </button>
            ) : (
              <button type="button" className="ada-mic ada-mic--stop" onClick={stop}>
                <span className="ada-mic-icon" aria-hidden="true">
                  ■
                </span>
                End session
              </button>
            )}
          </div>

          <p className="ada-foot">
            Voice requires a microphone and a Gemini key on the server. Ada answers about Ziad’s capstone,
            awards and plans.
          </p>
        </div>
      )}
    </>
  )
}
