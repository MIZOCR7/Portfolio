import { useEffect, useMemo, useState } from 'react'

const CHIPS = ['lofi hip hop', 'Amr Diab', 'Egyptian pop', 'jazz', 'classical music', 'live session']

function Thumb({ video }) {
  const [broken, setBroken] = useState(false)
  return (
    <span className="relative block aspect-video overflow-hidden rounded-[10px] bg-[#242424]">
      {broken ? (
        <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2b2b2b] to-[#171717] text-[24px] text-white/30">
          ▶
        </span>
      ) : (
        <img
          src={video.thumbnail}
          alt=""
          loading="lazy"
          onError={() => setBroken(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.035]"
          draggable={false}
        />
      )}
      {video.duration ? (
        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-semibold text-white">
          {video.duration}
        </span>
      ) : null}
    </span>
  )
}

export default function YouTube() {
  const [query, setQuery] = useState('lofi hip hop')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [source, setSource] = useState('')

  const search = async value => {
    const term = (value ?? query).trim()
    if (!term) return
    setQuery(term)
    setLoading(true)
    setError('')
    setSelected(null)
    try {
      const res = await fetch(`/api/youtube?q=${encodeURIComponent(term)}&limit=18`, {
        headers: { Accept: 'application/json' },
      })
      let data = null
      try {
        data = await res.json()
      } catch {
        /* non-JSON response */
      }
      if (!res.ok) throw new Error(data?.message || 'YouTube search is unavailable right now.')
      setResults(data?.items || [])
      setSource(data?.configured ? 'YouTube Data API' : 'YouTube')
    } catch (err) {
      setResults([])
      setError(err.message || 'YouTube search failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    search('lofi hip hop')
    // The first search fills the window; users can search anything after that.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const featured = useMemo(() => selected || results[0], [selected, results])

  return (
    <div className="flex h-full flex-col bg-[#0d0d0d] text-white">
      <header className="flex flex-none flex-wrap items-center gap-3 border-b border-white/10 px-3 py-2.5 sm:px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-11 items-center justify-center rounded-[7px] bg-[#ff0033] shadow-[0_2px_8px_rgba(255,0,51,0.35)]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M8 5.4v13.2L19 12Z" />
            </svg>
          </span>
          <span className="text-[17px] font-semibold tracking-[-0.055em]">YouTube</span>
        </div>

        <form
          onSubmit={e => {
            e.preventDefault()
            search(query)
          }}
          className="order-3 flex min-w-0 flex-1 items-center gap-1.5 sm:order-none sm:max-w-[500px]"
        >
          <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full border border-white/15 bg-[#181818] px-3 focus-within:border-white/35">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="flex-none text-white/50">
              <circle cx="8.5" cy="8.5" r="5" />
              <path d="m12.2 12.2 4 4" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search YouTube"
              aria-label="Search YouTube"
              className="min-w-0 flex-1 bg-transparent text-[12px] text-white outline-none placeholder:text-white/40"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear YouTube search"
                className="text-[15px] leading-none text-white/40 hover:text-white"
              >
                ×
              </button>
            ) : null}
          </label>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="h-9 flex-none rounded-full bg-white/10 px-3 text-[11.5px] font-semibold text-white hover:bg-white/15 disabled:opacity-40"
          >
            Search
          </button>
        </form>

        <a
          href="https://www.youtube.com"
          target="_blank"
          rel="noreferrer"
          className="ml-auto hidden items-center gap-1 text-[10.5px] text-white/45 hover:text-white sm:flex"
        >
          Open YouTube ↗
        </a>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[176px] flex-none flex-col border-r border-white/10 bg-[#090909] p-3 sm:flex">
          <p className="px-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">Browse</p>
          <button
            type="button"
            onClick={() => search('lofi hip hop')}
            className="mt-1 flex items-center gap-2 rounded-[7px] px-2 py-2 text-left text-[12px] font-medium text-white/90 hover:bg-white/[0.07]"
          >
            <span className="text-[15px]">⌂</span> Home
          </button>
          <button
            type="button"
            onClick={() => document.querySelector('input[aria-label="Search YouTube"]')?.focus()}
            className="flex items-center gap-2 rounded-[7px] px-2 py-2 text-left text-[12px] text-white/65 hover:bg-white/[0.07] hover:text-white"
          >
            <span className="text-[15px]">⌕</span> Search
          </button>
          <div className="my-3 h-px bg-white/10" />
          <p className="px-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">Try a search</p>
          <div className="mt-1.5 flex flex-col items-start gap-1">
            {CHIPS.map(chip => (
              <button
                key={chip}
                type="button"
                onClick={() => search(chip)}
                className="max-w-full truncate rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-left text-[10.5px] text-white/60 hover:border-white/25 hover:text-white"
              >
                {chip}
              </button>
            ))}
          </div>
          <div className="mt-auto rounded-[8px] border border-white/10 bg-white/[0.04] p-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/35">Source</p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-white/55">
              {source || 'YouTube'} · playback stays inside YouTube’s embedded player.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto px-3 pb-7 pt-4 sm:px-5">
          {selected ? (
            <section className="mb-4 overflow-hidden rounded-[12px] border border-white/10 bg-black shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
              <div className="aspect-video w-full">
                <iframe
                  key={selected.id}
                  src={`https://www.youtube.com/embed/${selected.id}?autoplay=1&rel=0`}
                  title={selected.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
              <div className="flex items-start justify-between gap-3 px-3 py-2.5">
                <div className="min-w-0">
                  <h2 className="line-clamp-2 text-[13px] font-semibold leading-snug">{selected.title}</h2>
                  <p className="mt-0.5 text-[10.5px] text-white/45">
                    {selected.author}
                    {selected.views ? ` · ${selected.views}` : ''}
                  </p>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${selected.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-none rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-medium text-white/65 hover:border-white/35 hover:text-white"
                >
                  Open ↗
                </a>
              </div>
            </section>
          ) : (
            <section className="mb-4 rounded-[12px] border border-white/10 bg-gradient-to-br from-[#241010] via-[#161616] to-[#101010] p-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40">Watch anything</p>
              <h1 className="mt-1 max-w-[34ch] text-[22px] font-semibold leading-tight tracking-[-0.03em] sm:text-[26px]">
                Search YouTube from the desktop.
              </h1>
              <p className="mt-1.5 max-w-[54ch] text-[11px] leading-relaxed text-white/55">
                Music, live sets, lectures and everything else. Results play in YouTube’s official embedded player, so the channel keeps the view.
              </p>
            </section>
          )}

          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-[13px] font-semibold">
              {loading ? 'Searching…' : selected ? 'More results' : 'Results'}
            </h2>
            {!loading && results.length ? <span className="text-[10px] text-white/35">{results.length} videos</span> : null}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video rounded-[10px] bg-white/[0.07]" />
                  <div className="mt-2 h-3 w-4/5 rounded bg-white/[0.07]" />
                  <div className="mt-1.5 h-2.5 w-1/2 rounded bg-white/[0.05]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[10px] border border-[#ff4e45]/25 bg-[#ff4e45]/[0.06] px-4 py-5 text-[11.5px] leading-relaxed text-[#ff9b94]">
              {error}
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`}
                target="_blank"
                rel="noreferrer"
                className="ml-1 font-semibold underline"
              >
                Search on YouTube ↗
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map(video => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => setSelected(video)}
                  className="group min-w-0 text-left outline-none"
                >
                  <Thumb video={video} />
                  <span className="mt-2 line-clamp-2 block text-[12px] font-semibold leading-snug text-white/90 group-hover:text-white">
                    {video.title}
                  </span>
                  <span className="mt-1 block truncate text-[10.5px] text-white/40">{video.author}</span>
                  <span className="mt-0.5 block truncate text-[9.5px] text-white/30">
                    {[video.views, video.published].filter(Boolean).join(' · ') || 'YouTube'}
                  </span>
                </button>
              ))}
            </div>
          )}

          {!loading && !error && !results.length ? (
            <div className="rounded-[10px] border border-dashed border-white/15 px-5 py-12 text-center text-[11.5px] text-white/40">
              Search for a song, artist, channel or idea.
            </div>
          ) : null}

          {featured && selected ? (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {CHIPS.map(chip => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => search(chip)}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] text-white/55 hover:text-white"
                >
                  {chip}
                </button>
              ))}
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}
