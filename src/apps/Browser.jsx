import { useEffect, useRef, useState } from 'react'

const BOOKMARKS = [
  { label: 'Wikipedia', detail: 'The free encyclopedia', url: 'https://en.wikipedia.org/wiki/Main_Page', icon: 'https://www.google.com/s2/favicons?domain=wikipedia.org&sz=64', color: 'linear-gradient(145deg,#5b5b5b,#1f1f1f)', glyph: 'W' },
  { label: 'Commons', detail: 'Images and media', url: 'https://commons.wikimedia.org/wiki/Main_Page', icon: 'https://www.google.com/s2/favicons?domain=commons.wikimedia.org&sz=64', color: 'linear-gradient(145deg,#3b7a57,#1f4734)', glyph: 'C' },
  { label: 'Internet Archive', detail: 'Books, audio, the web', url: 'https://archive.org', icon: 'https://www.google.com/s2/favicons?domain=archive.org&sz=64', color: 'linear-gradient(145deg,#2c2c2c,#090909)', glyph: 'A' },
  { label: 'Gutenberg', detail: '70,000 free books', url: 'https://www.gutenberg.org', icon: 'https://www.google.com/s2/favicons?domain=gutenberg.org&sz=64', color: 'linear-gradient(145deg,#5d7c4a,#2f4226)', glyph: 'G' },
  { label: 'Bing', detail: 'Search and news', url: 'https://www.bing.com/search?q=design+engineering', icon: 'https://www.google.com/s2/favicons?domain=bing.com&sz=64', color: 'linear-gradient(145deg,#00a88f,#006b5b)', glyph: 'b' },
  { label: 'Hacker News', detail: 'What builders read', url: 'https://news.ycombinator.com/news', icon: 'https://www.google.com/s2/favicons?domain=ycombinator.com&sz=64', color: 'linear-gradient(145deg,#ff8b3d,#c2410c)', glyph: 'Y' },
]

function faviconUrl(host) {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`
}

function Favicon({ bookmark }) {
  const [broken, setBroken] = useState(false)
  return (
    <span
      className="relative flex h-9 w-9 flex-none items-center justify-center overflow-hidden rounded-[8px] bg-white shadow-sm ring-1 ring-black/5"
      style={broken ? { background: bookmark.color } : undefined}
    >
      {broken ? (
        <span className="text-[14px] font-bold text-white">{bookmark.glyph}</span>
      ) : (
        <img
          src={bookmark.icon}
          alt=""
          loading="lazy"
          className="h-5 w-5 object-contain"
          onError={() => setBroken(true)}
        />
      )}
    </span>
  )
}

const SEARCH_ENGINES = [
  {
    id: 'bing',
    label: 'Bing',
    note: 'Recommended',
    build: query => `https://www.bing.com/search?q=${encodeURIComponent(query)}&setlang=en`,
  },
  {
    id: 'wikipedia',
    label: 'Wikipedia',
    note: 'Reference',
    build: query => `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`,
  },
  {
    id: 'archive',
    label: 'Archive',
    note: 'Books & media',
    build: query => `https://archive.org/search?query=${encodeURIComponent(query)}`,
  },
]

function normalize(value, engineId = 'bing') {
  const raw = value.trim()
  if (!raw) return ''
  if (/^(javascript|data|file|vbscript|about):/i.test(raw)) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  if (/^[\w-]+(\.[\w-]+)+([/:?#].*)?$/.test(raw) && !/\s/.test(raw)) return `https://${raw}`
  const engine = SEARCH_ENGINES.find(item => item.id === engineId) || SEARCH_ENGINES[0]
  return engine.build(raw)
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function Arrow({ direction, className = 'h-3.5 w-3.5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {direction === 'back' ? <path d="m14.5 6-6 6 6 6" /> : <path d="m9.5 6 6 6-6 6" />}
    </svg>
  )
}

export default function Browser() {
  const [history, setHistory] = useState([])
  const [index, setIndex] = useState(-1)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [frameKey, setFrameKey] = useState(0)
  const [notice, setNotice] = useState('')
  const [engine, setEngine] = useState(() => {
    try {
      return localStorage.getItem('ziad-search-engine') || 'bing'
    } catch {
      return 'bing'
    }
  })
  const loadTimer = useRef(0)

  const current = index >= 0 ? history[index] : null
  const activeEngine = SEARCH_ENGINES.find(item => item.id === engine) || SEARCH_ENGINES[0]
  const canBack = index >= 0
  const canForward = index < history.length - 1

  useEffect(() => {
    setDraft(current?.url || '')
    setNotice('')
    if (!current) {
      setLoading(false)
      return
    }
    setLoading(true)
    window.clearTimeout(loadTimer.current)
    loadTimer.current = window.setTimeout(() => setLoading(false), 9000)
    return () => window.clearTimeout(loadTimer.current)
  }, [current?.url, frameKey])

  const chooseEngine = id => {
    setEngine(id)
    try {
      localStorage.setItem('ziad-search-engine', id)
    } catch {
      /* storage can be unavailable */
    }
  }

  const go = raw => {
    const url = normalize(raw, engine)
    if (!url) {
      setNotice('That address is not allowed inside the browser.')
      return
    }
    const next = history.slice(0, index + 1).concat({ url })
    setHistory(next)
    setIndex(next.length - 1)
    setDraft(url)
    setLoading(true)
    setNotice('')
  }

  const back = () => {
    if (!canBack) return
    setIndex(value => value - 1)
    setLoading(index > 0)
  }

  const forward = () => {
    if (!canForward) return
    setIndex(value => value + 1)
    setLoading(true)
  }

  const home = () => {
    setIndex(-1)
    setDraft('')
    setNotice('')
    setLoading(false)
  }

  const reload = () => {
    if (!current) return
    setFrameKey(value => value + 1)
  }

  const openExternal = () => {
    if (!current) return
    window.open(current.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex h-full flex-col bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#1c1c1e] dark:text-white">
      <div className="flex flex-none items-center gap-1.5 border-b border-black/10 bg-[#e9e9ed] px-2 py-2 dark:border-white/10 dark:bg-[#2c2c2e] sm:gap-2 sm:px-3">
        <div className="flex flex-none items-center gap-0.5">
          <button
            type="button"
            onClick={back}
            disabled={!canBack}
            aria-label="Back"
            className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[#4c4c50] hover:bg-black/[0.07] disabled:opacity-25 dark:text-white/75 dark:hover:bg-white/10"
          >
            <Arrow direction="back" />
          </button>
          <button
            type="button"
            onClick={forward}
            disabled={!canForward}
            aria-label="Forward"
            className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[#4c4c50] hover:bg-black/[0.07] disabled:opacity-25 dark:text-white/75 dark:hover:bg-white/10"
          >
            <Arrow direction="forward" />
          </button>
          <button
            type="button"
            onClick={reload}
            disabled={!current}
            aria-label="Reload page"
            className="flex h-7 w-7 items-center justify-center rounded-[6px] text-[#4c4c50] hover:bg-black/[0.07] disabled:opacity-25 dark:text-white/75 dark:hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M20 11a8 8 0 1 0-2.3 6.5" />
              <path d="M20 4v7h-7" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={event => {
            event.preventDefault()
            go(draft)
          }}
          className="min-w-0 flex-1"
        >
          <label className="flex h-8 min-w-0 items-center gap-1.5 rounded-[7px] border border-black/10 bg-white px-2.5 shadow-[inset_0_1px_1px_rgba(0,0,0,0.04)] focus-within:border-[#0a84ff]/60 focus-within:ring-2 focus-within:ring-[#0a84ff]/15 dark:border-white/15 dark:bg-[#1c1c1e]">
            {current ? (
              <img
                src={faviconUrl(hostOf(current.url))}
                alt=""
                className="h-3.5 w-3.5 flex-none rounded-[2px] object-contain"
                onError={event => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 flex-none text-[#4c4c50]/55 dark:text-white/45" aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m15.5 15.5 5 5" strokeLinecap="round" />
              </svg>
            )}
            <input
              value={draft}
              onChange={event => setDraft(event.target.value)}
              placeholder={`Search ${activeEngine.label} or enter a website`}
              aria-label="Address and search"
              spellCheck="false"
              autoCapitalize="off"
              className="min-w-0 flex-1 bg-transparent text-[11.5px] outline-none placeholder:text-[#4c4c50]/45 dark:placeholder:text-white/35"
            />
          </label>
        </form>

        <button
          type="button"
          onClick={home}
          aria-label="Start page"
          className="flex h-7 w-7 flex-none items-center justify-center rounded-[6px] text-[#4c4c50] hover:bg-black/[0.07] dark:text-white/75 dark:hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="m3 10.7 9-7.7 9 7.7V21h-6v-6H9v6H3Z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={openExternal}
          disabled={!current}
          aria-label="Open page in a new tab"
          title="Open in a new tab"
          className="flex h-7 w-7 flex-none items-center justify-center rounded-[6px] text-[#4c4c50] hover:bg-black/[0.07] disabled:opacity-25 dark:text-white/75 dark:hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M14 4h6v6M20 4l-8 8" />
            <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
          </svg>
        </button>
      </div>

      <div className="relative flex-none">
        <div className={`h-[2px] overflow-hidden transition-opacity ${loading ? 'opacity-100' : 'opacity-0'}`}>
          <span className="block h-full w-1/3 animate-pulse bg-[#0a84ff]" />
        </div>
      </div>

      {current ? (
        <>
          <div className="min-h-0 flex-1 bg-white dark:bg-black">
            <iframe
              key={`${current.url}:${frameKey}`}
              src={current.url}
              title={`${hostOf(current.url)} — Safari`}
              referrerPolicy="no-referrer"
              allow="autoplay; clipboard-read; clipboard-write; fullscreen"
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false)
                setNotice('That page refused to load inside the browser.')
              }}
              className="h-full w-full border-0 bg-white"
            />
          </div>
          <div className="flex flex-none flex-wrap items-center gap-x-2 gap-y-0.5 border-t border-black/10 bg-[#e9e9ed] px-3 py-1 text-[9px] text-[#4c4c50]/65 dark:border-white/10 dark:bg-[#2c2c2e] dark:text-white/45">
            <span className="truncate font-medium">{hostOf(current.url)}</span>
            <span className="opacity-50">·</span>
            <span className="truncate">Some sites block being embedded.</span>
            <button type="button" onClick={openExternal} className="ml-auto font-semibold text-[#0a84ff] hover:underline">
              Open in a tab ↗
            </button>
          </div>
        </>
      ) : (
        <div className="relative min-h-0 flex-1 overflow-y-auto bg-[#f5f5f7] dark:bg-[#1c1c1e]">
          <div
            className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[#7cc7ff]/35 blur-3xl dark:bg-[#0a84ff]/20"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-[#ffb7d5]/30 blur-3xl dark:bg-[#bf5af2]/15"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-[760px] px-5 pb-10 pt-8 sm:px-8 sm:pt-12">
            <div className="text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#3d9bff] to-[#0066cc] text-white shadow-[0_12px_28px_rgba(0,102,204,0.28)]">
                <svg viewBox="0 0 64 64" className="h-9 w-9" fill="none" aria-hidden="true">
                  <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="2.5" opacity=".85" />
                  <path d="M32 14v36M14 32h36" stroke="currentColor" strokeWidth="1.6" opacity=".55" />
                  <path d="M32 8v48M8 32h48" stroke="currentColor" strokeWidth="1" opacity=".25" />
                  <path d="m40 19-8 20-8-4 16-16Z" fill="currentColor" />
                  <path d="m40 19-8 20" stroke="#0a5cb8" strokeWidth="1.2" />
                </svg>
              </span>
              <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#4c4c50]/45 dark:text-white/35">Safari · in the portfolio</p>
              <h1 className="mt-1 text-[29px] font-semibold tracking-[-0.045em] sm:text-[34px]">The web, inside the Mac.</h1>
              <p className="mx-auto mt-2 max-w-[44ch] text-[12px] leading-relaxed text-[#4c4c50]/65 dark:text-white/50">
                Search anything, open a favourite, and keep browsing without leaving the desk.
              </p>
            </div>

            <form
              onSubmit={event => {
                event.preventDefault()
                go(draft)
              }}
              className="mx-auto mt-6 flex max-w-[590px] items-center gap-2"
            >
              <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-[11px] border border-black/10 bg-white px-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.05)] focus-within:border-[#0a84ff]/60 focus-within:ring-3 focus-within:ring-[#0a84ff]/10 dark:border-white/15 dark:bg-[#2c2c2e]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 flex-none text-[#4c4c50]/45 dark:text-white/35" aria-hidden="true">
                  <circle cx="10.5" cy="10.5" r="6.5" />
                  <path d="m15.5 15.5 5 5" strokeLinecap="round" />
                </svg>
                <input
                  value={draft}
                  onChange={event => setDraft(event.target.value)}
                  placeholder={`Search ${activeEngine.label} or type a URL`}
                  aria-label="Search the web"
                  spellCheck="false"
                  autoCapitalize="off"
                  className="min-w-0 flex-1 bg-transparent text-[12px] outline-none placeholder:text-[#4c4c50]/40 dark:placeholder:text-white/30"
                />
              </label>
              <button type="submit" className="h-11 flex-none rounded-[11px] bg-[#0a84ff] px-4 text-[11.5px] font-semibold text-white shadow-[0_4px_12px_rgba(10,132,255,0.25)] hover:brightness-105">
                Go
              </button>
            </form>

            <div className="mx-auto mt-3 flex max-w-[590px] flex-wrap items-center gap-1.5">
              <span className="mr-0.5 text-[9.5px] font-semibold uppercase tracking-[0.13em] text-[#4c4c50]/40 dark:text-white/30">Search with</span>
              {SEARCH_ENGINES.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseEngine(item.id)}
                  aria-pressed={engine === item.id}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition ${
                    engine === item.id
                      ? 'bg-[#0a84ff] text-white shadow-sm'
                      : 'bg-black/[0.055] text-[#4c4c50]/65 hover:bg-black/[0.09] dark:bg-white/10 dark:text-white/55 dark:hover:bg-white/15'
                  }`}
                  title={item.id === 'bing' ? 'Bing works reliably inside this browser' : item.note}
                >
                  {item.label}
                </button>
              ))}
              <span className="ml-auto text-[9px] text-[#4c4c50]/35 dark:text-white/25">
                {engine === 'bing' ? 'Bing works in-app' : activeEngine.note}
              </span>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <h2 className="text-[13px] font-semibold tracking-[-0.01em]">Favourites</h2>
              <span className="text-[10px] text-[#4c4c50]/40 dark:text-white/30">A few places that work well inside the Mac</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {BOOKMARKS.map(bookmark => (
                <button
                  key={bookmark.label}
                  type="button"
                  onClick={() => go(bookmark.url)}
                  className="group flex min-w-0 items-center gap-2.5 rounded-[10px] border border-black/[0.07] bg-white p-2.5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-[#2c2c2e]"
                >
                  <Favicon bookmark={bookmark} />
                  <span className="min-w-0">
                    <span className="block truncate text-[11.5px] font-semibold">{bookmark.label}</span>
                    <span className="block truncate text-[9.5px] text-[#4c4c50]/50 dark:text-white/40">{bookmark.detail}</span>
                  </span>
                </button>
              ))}
            </div>

            <div data-cursor="help" className="mt-7 flex items-start gap-2.5 rounded-[10px] border border-black/[0.06] bg-white/70 p-3 text-[10.5px] leading-relaxed text-[#4c4c50]/65 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/45">
              <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#0a84ff]/10 text-[#0a84ff]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
                </svg>
              </span>
              <p>
                Some companies (GitHub, YouTube, banks) refuse to appear inside another app. If a page stays blank, use{' '}
                <span className="font-semibold text-[#1d1d1f] dark:text-white">Open in a tab</span> in the toolbar.
              </p>
            </div>
          </div>
        </div>
      )}

      {notice ? (
        <div className="flex flex-none items-center justify-between gap-3 border-t border-[#ff453a]/20 bg-[#ff453a]/10 px-3 py-1.5 text-[10px] text-[#c0392b] dark:text-[#ff9a94]">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} className="font-semibold hover:underline">Dismiss</button>
        </div>
      ) : null}
    </div>
  )
}
