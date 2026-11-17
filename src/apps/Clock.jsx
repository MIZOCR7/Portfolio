import { useEffect, useRef, useState } from 'react'

const ZONES = [
  { city: 'Cairo', zone: 'Africa/Cairo', note: 'Home' },
  { city: 'London', zone: 'Europe/London', note: 'GMT' },
  { city: 'New York', zone: 'America/New_York', note: 'East Coast' },
  { city: 'Tokyo', zone: 'Asia/Tokyo', note: 'Japan' },
  { city: 'Dubai', zone: 'Asia/Dubai', note: 'Gulf' },
  { city: 'Paris', zone: 'Europe/Paris', note: 'Europe' },
]

const PRESETS = [1, 3, 5, 10, 25]

function clockParts(date, zone) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: zone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).formatToParts(date)
  const get = type => parts.find(part => part.type === type)?.value || ''
  return {
    time: `${get('hour')}:${get('minute')}`,
    seconds: get('second'),
    day: `${get('weekday')} ${get('day')} ${get('month')}`,
    offset: new Intl.DateTimeFormat('en-GB', { timeZone: zone, timeZoneName: 'shortOffset' })
      .formatToParts(date)
      .find(part => part.type === 'timeZoneName')?.value || '',
  }
}

function pad(value, size = 2) {
  return String(value).padStart(size, '0')
}

function stopwatchText(ms) {
  const total = Math.max(0, Math.floor(ms))
  const minutes = Math.floor(total / 60000)
  const seconds = Math.floor((total % 60000) / 1000)
  const hundredths = Math.floor((total % 1000) / 10)
  return { main: `${pad(minutes)}:${pad(seconds)}`, fraction: `.${pad(hundredths)}` }
}

function timerText(totalSeconds) {
  const safe = Math.max(0, totalSeconds)
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`
}

function TabIcon({ tab }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: 'h-4 w-4',
    'aria-hidden': true,
  }
  if (tab === 'world') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </svg>
    )
  }
  if (tab === 'stopwatch') {
    return (
      <svg {...common}>
        <circle cx="12" cy="13.5" r="7.5" />
        <path d="M12 13.5V9M9 2h6M12 2v2M18.5 6.5l1.4-1.4" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4.5l3 2M9 2h6" />
    </svg>
  )
}

export default function Clock() {
  const [tab, setTab] = useState('world')
  const [now, setNow] = useState(() => new Date())

  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const startedAt = useRef(0)
  const baseElapsed = useRef(0)

  const [timerTotal, setTimerTotal] = useState(300)
  const [remaining, setRemaining] = useState(300)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerDone, setTimerDone] = useState(false)
  const timerEnd = useRef(0)
  const audio = useRef(null)

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!running) return undefined
    const id = window.setInterval(() => {
      setElapsed(baseElapsed.current + (Date.now() - startedAt.current))
    }, 31)
    return () => window.clearInterval(id)
  }, [running])

  useEffect(() => {
    if (!timerRunning) return undefined
    const tick = () => {
      const left = Math.max(0, Math.ceil((timerEnd.current - Date.now()) / 1000))
      setRemaining(left)
      if (left <= 0) {
        setTimerRunning(false)
        setTimerDone(true)
        playChime()
      }
    }
    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [timerRunning])

  function primeAudio() {
    try {
      if (!audio.current) {
        const Ctx = window.AudioContext || window.webkitAudioContext
        if (Ctx) audio.current = new Ctx()
      }
      audio.current?.resume?.()
    } catch {
      audio.current = null
    }
  }

  function playChime() {
    const context = audio.current
    if (!context) return
    const notes = [880, 1108.73, 1318.51]
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      const start = context.currentTime + index * 0.16
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.16, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(start)
      oscillator.stop(start + 0.6)
    })
  }

  function startStopwatch() {
    if (running) {
      baseElapsed.current = elapsed
      setRunning(false)
      return
    }
    startedAt.current = Date.now()
    baseElapsed.current = elapsed
    setRunning(true)
  }

  function resetStopwatch() {
    setRunning(false)
    setElapsed(0)
    baseElapsed.current = 0
    setLaps([])
  }

  function addLap() {
    if (elapsed <= 0) return
    setLaps(current => [{ id: Date.now(), total: elapsed }, ...current].slice(0, 20))
  }

  function setTimer(minutes) {
    setTimerRunning(false)
    setTimerDone(false)
    setTimerTotal(minutes * 60)
    setRemaining(minutes * 60)
  }

  function startTimer() {
    if (remaining <= 0) {
      setRemaining(timerTotal)
      timerEnd.current = Date.now() + timerTotal * 1000
    } else {
      timerEnd.current = Date.now() + remaining * 1000
    }
    setTimerDone(false)
    primeAudio()
    setTimerRunning(true)
  }

  function pauseTimer() {
    setTimerRunning(false)
  }

  function resetTimer() {
    setTimerRunning(false)
    setTimerDone(false)
    setRemaining(timerTotal)
  }

  const stopwatch = stopwatchText(elapsed)
  const progress = timerTotal > 0 ? ((timerTotal - remaining) / timerTotal) * 100 : 0

  return (
    <div className="flex h-full flex-col bg-[#f2f2f7] text-[#1c1c1e] dark:bg-[#1c1c1e] dark:text-white">
      <div className="flex items-center justify-between gap-3 border-b border-black/5 px-4 py-3 dark:border-white/10">
        <div className="inline-flex rounded-[10px] bg-black/[0.055] p-0.5 dark:bg-white/10">
          {[
            ['world', 'World Clock'],
            ['stopwatch', 'Stopwatch'],
            ['timer', 'Timer'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-pressed={tab === id}
              className={`flex items-center gap-1.5 rounded-[8px] px-2.5 py-1.5 text-[11.5px] font-semibold transition-all ${
                tab === id
                  ? 'bg-white text-black shadow-sm dark:bg-[#3a3a3c] dark:text-white'
                  : 'text-black/55 hover:text-black/80 dark:text-white/55 dark:hover:text-white/85'
              }`}
            >
              <TabIcon tab={id} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
        <p className="text-[10.5px] font-medium text-black/40 dark:text-white/40">Clock</p>
      </div>

      {tab === 'world' && (
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto max-w-[620px]">
            <div className="mb-5 rounded-[18px] bg-gradient-to-br from-[#0b1220] via-[#172554] to-[#7c2d12] px-6 py-6 text-white shadow-lg shadow-black/10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">Local time · Cairo</p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-[58px] font-light leading-none tracking-[-0.06em] tabular-nums">
                  {clockParts(now, 'Africa/Cairo').time}
                </span>
                <span className="pb-2 text-[18px] font-light text-white/55 tabular-nums">
                  {clockParts(now, 'Africa/Cairo').seconds}
                </span>
              </div>
              <p className="mt-2 text-[12.5px] text-white/65">
                {clockParts(now, 'Africa/Cairo').day} · {clockParts(now, 'Africa/Cairo').offset}
              </p>
            </div>

            <div className="overflow-hidden rounded-[14px] bg-white shadow-sm dark:bg-[#2c2c2e]">
              {ZONES.map((zone, index) => {
                const local = clockParts(now, zone.zone)
                return (
                  <div
                    key={zone.city}
                    className={`flex items-center justify-between gap-4 px-4 py-3 ${
                      index > 0 ? 'border-t border-black/[0.055] dark:border-white/[0.07]' : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold">{zone.city}</p>
                      <p className="text-[10.5px] text-black/45 dark:text-white/45">
                        {local.day} · {zone.note}
                      </p>
                    </div>
                    <div className="flex items-baseline gap-1.5 tabular-nums">
                      <span className="text-[20px] font-light tracking-[-0.02em]">{local.time}</span>
                      <span className="text-[11px] text-black/40 dark:text-white/40">{local.seconds}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'stopwatch' && (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col">
            <div className="rounded-[20px] bg-white px-5 py-8 text-center shadow-sm dark:bg-[#2c2c2e]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35 dark:text-white/35">
                Stopwatch
              </p>
              <p className="mt-3 text-[52px] font-extralight leading-none tracking-[-0.06em] tabular-nums sm:text-[66px]">
                {stopwatch.main}
                <span className="text-[26px] text-black/40 dark:text-white/40">{stopwatch.fraction}</span>
              </p>
              <div className="mt-7 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={resetStopwatch}
                  className="h-12 w-12 rounded-full bg-black/[0.06] text-[13px] font-semibold text-black/65 transition-transform active:scale-95 dark:bg-white/10 dark:text-white/70"
                  aria-label="Reset stopwatch"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={startStopwatch}
                  className={`h-16 w-16 rounded-full text-[14px] font-semibold text-white shadow-lg transition-transform active:scale-95 ${
                    running ? 'bg-[#ff453a] shadow-red-500/20' : 'bg-[#34c759] shadow-green-500/20'
                  }`}
                >
                  {running ? 'Stop' : elapsed > 0 ? 'Resume' : 'Start'}
                </button>
                <button
                  type="button"
                  onClick={addLap}
                  disabled={elapsed <= 0}
                  className="h-12 w-12 rounded-full bg-black/[0.06] text-[13px] font-semibold text-black/65 transition-transform active:scale-95 disabled:opacity-35 dark:bg-white/10 dark:text-white/70"
                  aria-label="Record lap"
                >
                  Lap
                </button>
              </div>
            </div>

            {laps.length > 0 && (
              <div className="mt-4 overflow-hidden rounded-[14px] bg-white shadow-sm dark:bg-[#2c2c2e]">
                {laps.map((lap, index) => (
                  <div
                    key={lap.id}
                    className={`flex items-center justify-between px-4 py-2.5 text-[12.5px] ${
                      index > 0 ? 'border-t border-black/[0.055] dark:border-white/[0.07]' : ''
                    }`}
                  >
                    <span className="text-black/45 dark:text-white/45">Lap {laps.length - index}</span>
                    <span className="font-medium tabular-nums">
                      {stopwatchText(lap.total).main}
                      <span className="text-black/40 dark:text-white/40">{stopwatchText(lap.total).fraction}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'timer' && (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col">
            <div className="rounded-[20px] bg-white px-5 py-6 text-center shadow-sm dark:bg-[#2c2c2e]">
              <div
                className="mx-auto flex h-[188px] w-[188px] items-center justify-center rounded-full p-[7px] transition-colors sm:h-[210px] sm:w-[210px]"
                style={{
                  background: `conic-gradient(#ff9f0a ${Math.max(0, Math.min(100, progress))}%, rgba(127,127,127,0.16) 0)`,
                }}
              >
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white dark:bg-[#2c2c2e]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35 dark:text-white/35">
                    {timerDone ? 'Time is up' : timerRunning ? 'Counting down' : 'Timer'}
                  </p>
                  <p
                    className={`mt-1 text-[44px] font-extralight leading-none tracking-[-0.05em] tabular-nums sm:text-[50px] ${
                      timerDone ? 'animate-pulse text-[#ff453a]' : ''
                    }`}
                  >
                    {timerText(remaining)}
                  </p>
                  <p className="mt-1 text-[10.5px] text-black/40 dark:text-white/40">
                    of {timerText(timerTotal)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={resetTimer}
                  className="rounded-[9px] bg-black/[0.06] px-3.5 py-2 text-[12px] font-semibold text-black/60 transition-transform active:scale-95 dark:bg-white/10 dark:text-white/65"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={timerRunning ? pauseTimer : startTimer}
                  className={`rounded-[9px] px-5 py-2 text-[12px] font-semibold text-white shadow-sm transition-transform active:scale-95 ${
                    timerRunning ? 'bg-[#ff9f0a]' : 'bg-[#34c759]'
                  }`}
                >
                  {timerRunning ? 'Pause' : timerDone ? 'Again' : 'Start'}
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-[14px] bg-white p-3 shadow-sm dark:bg-[#2c2c2e]">
              <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/35 dark:text-white/35">
                Quick presets
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {PRESETS.map(minutes => (
                  <button
                    key={minutes}
                    type="button"
                    onClick={() => setTimer(minutes)}
                    className={`rounded-[8px] px-1 py-2 text-[12px] font-semibold tabular-nums transition-colors ${
                      timerTotal === minutes * 60 && !timerRunning
                        ? 'bg-[#ff9f0a] text-white'
                        : 'bg-black/[0.055] text-black/65 hover:bg-black/[0.09] dark:bg-white/10 dark:text-white/65 dark:hover:bg-white/15'
                    }`}
                  >
                    {minutes}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
