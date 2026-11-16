import { useEffect, useMemo, useRef, useState } from 'react'
import { CONFIG } from '../config'

const TRACKS = CONFIG.music.tracks
const BY_ID = Object.fromEntries(TRACKS.map(t => [t.id, t]))

function fmt(value) {
  if (!Number.isFinite(value) || value < 0) return '0:00'
  const m = Math.floor(value / 60)
  const s = Math.floor(value % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function fillStyle(percent, color = '#fa2d48') {
  const p = Math.max(0, Math.min(100, percent))
  return {
    background: `linear-gradient(to right, ${color} 0%, ${color} ${p}%, rgba(120,120,128,0.28) ${p}%, rgba(120,120,128,0.28) 100%)`,
  }
}

function Glyph({ children, className = 'h-[15px] w-[15px]' }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const icons = {
  home: <Glyph><path d="M3 8.4 10 3l7 5.4V16a1 1 0 0 1-1 1h-4v-5H8v5H4a1 1 0 0 1-1-1Z" /></Glyph>,
  songs: <Glyph><path d="M8 15V5.2l6-1.1v8.9" /><circle cx="6.1" cy="15" r="1.9" /><circle cx="12.1" cy="13" r="1.9" /></Glyph>,
  albums: <Glyph><rect x="3" y="3" width="14" height="14" rx="3" /><circle cx="10" cy="10" r="2.7" /></Glyph>,
  playlist: <Glyph><path d="M3.5 5h9M3.5 8.5h9M3.5 12h5.5" /><path d="M15 9.2v6.1" /><circle cx="13.2" cy="15.4" r="1.7" /></Glyph>,
  search: <Glyph><circle cx="8.5" cy="8.5" r="4.8" /><path d="m12.2 12.2 4 4" /></Glyph>,
  play: <Glyph className="h-[15px] w-[15px]"><path d="M7 4.5v11l9-5.5Z" fill="currentColor" stroke="none" /></Glyph>,
  pause: <Glyph><rect x="5.5" y="4" width="3" height="12" rx="1" fill="currentColor" stroke="none" /><rect x="11.5" y="4" width="3" height="12" rx="1" fill="currentColor" stroke="none" /></Glyph>,
  prev: <Glyph><path d="M5 4v12" /><path d="M15 4 7.5 10 15 16Z" fill="currentColor" stroke="none" /></Glyph>,
  next: <Glyph><path d="M15 4v12" /><path d="M5 4l7.5 6L5 16Z" fill="currentColor" stroke="none" /></Glyph>,
  shuffle: <Glyph><path d="M3 5.5h3.2c4.7 0 4.9 9 9.6 9H18" /><path d="m15.5 3 2.5 2.5L15.5 8M15.5 12l2.5 2.5-2.5 2.5" /><path d="M3 14.5h3.2c1.5 0 2.6-.9 3.6-2.2M12.8 7.7c.8-.9 1.7-1.5 3-1.5H18" /></Glyph>,
  repeat: <Glyph><path d="M4 8.2A4.2 4.2 0 0 1 8.2 4H16" /><path d="m13.8 1.8 2.4 2.2-2.4 2.2M16 11.8A4.2 4.2 0 0 1 11.8 16H4" /><path d="m6.2 18.2-2.4-2.2 2.4-2.2" /></Glyph>,
  repeatOne: <Glyph><path d="M4 8.2A4.2 4.2 0 0 1 8.2 4H16" /><path d="m13.8 1.8 2.4 2.2-2.4 2.2M16 11.8A4.2 4.2 0 0 1 11.8 16H4" /><path d="m6.2 18.2-2.4-2.2 2.4-2.2" /><path d="M10 8.8h1.4v4" /></Glyph>,
  volume: <Glyph><path d="M3.5 7.5h3L10 4.5v11l-3.5-3h-3Z" /><path d="M12.7 7.2a4 4 0 0 1 0 5.6M14.8 5.2a7 7 0 0 1 0 9.6" /></Glyph>,
  muted: <Glyph><path d="M3.5 7.5h3L10 4.5v11l-3.5-3h-3Z" /><path d="m13 7.5 4 5M17 7.5l-4 5" /></Glyph>,
  heart: <Glyph><path d="M10 16.2S3.4 12.4 3.4 7.8a3.3 3.3 0 0 1 5.8-2.1l.8.9.8-.9a3.3 3.3 0 0 1 5.8 2.1c0 4.6-6.6 8.4-6.6 8.4Z" /></Glyph>,
  heartFill: <Glyph><path d="M10 16.2S3.4 12.4 3.4 7.8a3.3 3.3 0 0 1 5.8-2.1l.8.9.8-.9a3.3 3.3 0 0 1 5.8 2.1c0 4.6-6.6 8.4-6.6 8.4Z" fill="currentColor" /></Glyph>,
  queue: <Glyph><path d="M3.5 5h10M3.5 9h10M3.5 13h6" /><path d="M15.2 10.6v5.1" /><circle cx="13.8" cy="16" r="1.4" /></Glyph>,
  close: <Glyph><path d="m5 5 10 10M15 5 5 15" /></Glyph>,
  chevron: <Glyph className="h-2.5 w-2.5"><path d="m7 5 5 5-5 5" /></Glyph>,
}

function IconButton({ label, onClick, active, children, className = '', title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active === undefined ? undefined : active}
      title={title || label}
      className={`flex items-center justify-center rounded-[6px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#fa2d48]/60 ${
        active ? 'text-[#fa2d48]' : 'text-[#6e6e73] hover:text-[#1d1d1f] dark:text-[#a1a1a6] dark:hover:text-white'
      } ${className}`}
    >
      {children}
    </button>
  )
}

function Eq() {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
      <span className="w-[2px] animate-pulse rounded-full bg-[#fa2d48]" style={{ height: '55%' }} />
      <span className="w-[2px] animate-pulse rounded-full bg-[#fa2d48] [animation-delay:150ms]" style={{ height: '100%' }} />
      <span className="w-[2px] animate-pulse rounded-full bg-[#fa2d48] [animation-delay:300ms]" style={{ height: '70%' }} />
    </span>
  )
}

export default function Music() {
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.72)
  const [muted, setMuted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState('off')
  const [view, setView] = useState('listen')
  const [playlistId, setPlaylistId] = useState('desk-sessions')
  const [query, setQuery] = useState('')
  const [queueOpen, setQueueOpen] = useState(false)
  const [liked, setLiked] = useState(() => new Set())
  const [error, setError] = useState('')

  const audioRef = useRef(null)
  const playIntent = useRef(false)
  const track = TRACKS[current]
  const activePlaylist = CONFIG.music.playlists.find(p => p.id === playlistId) || CONFIG.music.playlists[0]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = muted ? 0 : volume
  }, [volume, muted])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    setTime(0)
    setDuration(0)
    setError('')
    audio.load()
    if (playIntent.current) {
      const started = audio.play()
      if (started?.catch) {
        started.catch(() => {
          setPlaying(false)
          setError('The browser blocked playback. Press play once to start.')
        })
      }
    }
  }, [current])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      playIntent.current = true
      const started = audio.play()
      if (started?.catch) {
        started.catch(() => {
          setPlaying(false)
          setError('The browser blocked playback. Press play once to start.')
        })
      }
    } else {
      audio.pause()
    }
  }

  const playTrack = id => {
    const index = TRACKS.findIndex(t => t.id === id)
    if (index < 0) return
    if (index === current) {
      togglePlay()
      return
    }
    playIntent.current = true
    setCurrent(index)
  }

  const goNext = () => {
    if (TRACKS.length === 1) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
      return
    }
    let next
    if (shuffle) {
      do {
        next = Math.floor(Math.random() * TRACKS.length)
      } while (next === current)
    } else {
      next = (current + 1) % TRACKS.length
    }
    playIntent.current = true
    setCurrent(next)
  }

  const goPrev = () => {
    const audio = audioRef.current
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
      setTime(0)
      return
    }
    playIntent.current = true
    setCurrent(prev => (prev - 1 + TRACKS.length) % TRACKS.length)
  }

  const onEnded = () => {
    if (repeat === 'one') {
      const audio = audioRef.current
      if (!audio) return
      audio.currentTime = 0
      audio.play()
      return
    }
    if (!shuffle && repeat === 'off' && current === TRACKS.length - 1) {
      setPlaying(false)
      setTime(0)
      return
    }
    goNext()
  }

  const cycleRepeat = () => {
    setRepeat(value => (value === 'off' ? 'all' : value === 'all' ? 'one' : 'off'))
  }

  const toggleLike = id => {
    setLiked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openPlaylist = id => {
    setPlaylistId(id)
    setView('playlist')
    setQuery('')
  }

  const playList = list => {
    if (!list.length) return
    if (list[0].id === track.id) {
      if (audioRef.current?.paused) togglePlay()
      return
    }
    playTrack(list[0].id)
  }

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return TRACKS.filter(t => `${t.title} ${t.artist} ${t.album}`.toLowerCase().includes(q))
  }, [query])

  const viewTracks = useMemo(() => {
    if (view === 'playlist') return activePlaylist.trackIds.map(id => BY_ID[id]).filter(Boolean)
    return TRACKS
  }, [view, activePlaylist])

  const mainTitle = searchResults
    ? 'Search'
    : view === 'songs'
      ? 'Songs'
      : view === 'albums'
        ? 'Albums'
        : view === 'playlist'
          ? activePlaylist.name
          : 'Listen Now'

  const mainSubtitle = searchResults
    ? `${searchResults.length} ${searchResults.length === 1 ? 'result' : 'results'} for “${query.trim()}”`
    : view === 'songs'
      ? `${TRACKS.length} songs · 2 minutes`
      : view === 'albums'
        ? 'Desk Sessions · three covers, one late-night record'
        : view === 'playlist'
          ? `Playlist · ${viewTracks.length} songs · ${fmt(viewTracks.length * 48)}`
          : 'Three original instrumentals, made on this desk.'

  const progress = duration ? (time / duration) * 100 : 0

  const renderTracks = list => {
    if (!list.length) {
      return (
        <div className="rounded-[10px] border border-dashed border-[var(--line)] px-5 py-10 text-center text-[12px] text-[var(--dim)]">
          Nothing here yet.
        </div>
      )
    }
    return (
      <div className="overflow-hidden rounded-[10px] border border-[var(--line)] bg-[var(--win)]/60">
        <div className="grid grid-cols-[26px_minmax(0,1fr)_50px_28px] items-center gap-2 border-b border-[var(--line)] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--dim)] sm:grid-cols-[26px_minmax(0,1.8fr)_minmax(0,1fr)_50px_28px]">
          <span className="text-center">#</span>
          <span>Title</span>
          <span className="hidden sm:block">Artist</span>
          <span className="text-right">Time</span>
          <span />
        </div>
        {list.map((item, index) => {
          const isCurrent = item.id === track.id
          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => playTrack(item.id)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  playTrack(item.id)
                }
              }}
              className={`group grid cursor-default grid-cols-[26px_minmax(0,1fr)_50px_28px] items-center gap-2 border-b border-[var(--line)] px-3 py-2 text-left outline-none last:border-b-0 hover:bg-black/[0.035] focus-visible:bg-black/[0.05] dark:hover:bg-white/[0.055] dark:focus-visible:bg-white/[0.07] sm:grid-cols-[26px_minmax(0,1.8fr)_minmax(0,1fr)_50px_28px] ${
                isCurrent ? 'bg-[#fa2d48]/[0.06]' : ''
              }`}
            >
              <span className="flex items-center justify-center text-[10.5px] tabular-nums text-[var(--dim)]">
                {isCurrent && playing ? <Eq /> : String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex min-w-0 items-center gap-2.5">
                <img
                  src={item.cover}
                  alt=""
                  className="h-8 w-8 flex-none rounded-[4px] object-cover shadow-sm"
                  loading="lazy"
                  draggable={false}
                />
                <span className="min-w-0">
                  <span className={`block truncate text-[12px] font-medium ${isCurrent ? 'text-[#fa2d48]' : ''}`}>
                    {item.title}
                  </span>
                  <span className="block truncate text-[10px] text-[var(--dim)] sm:hidden">{item.artist}</span>
                </span>
              </span>
              <span className="hidden truncate text-[11px] text-[var(--dim)] sm:block">{item.artist}</span>
              <span className="text-right text-[10px] tabular-nums text-[var(--dim)]">{item.duration}</span>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  toggleLike(item.id)
                }}
                onKeyDown={e => e.stopPropagation()}
                aria-label={liked.has(item.id) ? `Remove ${item.title} from favourites` : `Favourite ${item.title}`}
                className={`flex h-6 w-6 items-center justify-center rounded outline-none hover:bg-black/5 dark:hover:bg-white/10 ${
                  liked.has(item.id) ? 'text-[#fa2d48]' : 'text-[var(--dim)] opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
                }`}
              >
                {liked.has(item.id) ? icons.heartFill : icons.heart}
              </button>
            </div>
          )
        })}
      </div>
    )
  }

  const renderAlbumGrid = list => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
      {list.map(item => {
        const isCurrent = item.id === track.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => playTrack(item.id)}
            className="group min-w-0 text-left outline-none"
          >
            <span
              className={`relative block aspect-square overflow-hidden rounded-[9px] shadow-[0_10px_24px_rgba(0,0,0,0.18)] ring-offset-2 ring-offset-[var(--win)] transition-shadow group-hover:shadow-[0_16px_32px_rgba(0,0,0,0.25)] ${
                isCurrent ? 'ring-2 ring-[#fa2d48]' : ''
              }`}
            >
              <img
                src={item.cover}
                alt={`${item.title} cover`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.035]"
                loading="lazy"
                draggable={false}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="absolute bottom-2 right-2 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-[#fa2d48] text-white opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100">
                {isCurrent && playing ? icons.pause : icons.play}
              </span>
              {isCurrent ? (
                <span className="absolute left-2 top-2 rounded-[4px] bg-black/55 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
                  {playing ? 'Playing' : 'Paused'}
                </span>
              ) : null}
            </span>
            <span className="mt-2 block truncate text-[12px] font-medium">{item.title}</span>
            <span className="block truncate text-[10.5px] text-[var(--dim)]">Ziad Emad · 2026</span>
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="relative flex h-full flex-col bg-white text-[#1d1d1f] dark:bg-[#151517] dark:text-[#f5f5f7]">
      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={e => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={e => {
          setDuration(e.currentTarget.duration || 48)
          setTime(e.currentTarget.currentTime)
        }}
        onEnded={onEnded}
        onError={() => setError('This track could not be loaded. Try another one.')}
      />

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[190px] flex-none flex-col border-r border-[var(--line)] bg-[#f5f5f7] px-2 py-3 dark:bg-[#1b1b1e] sm:flex">
          <div className="mb-3 flex items-center gap-2 px-1.5">
            <img src="images/icons/music.png" alt="" className="h-7 w-7 object-contain drop-shadow-sm" />
            <span className="text-[13px] font-semibold">Music</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setView('listen')
              setQuery('')
            }}
            className={`flex items-center gap-2 rounded-[6px] px-2 py-[5px] text-left text-[12px] font-medium ${
              view === 'listen' && !searchResults ? 'bg-[#fa2d48]/10 text-[#fa2d48]' : 'hover:bg-black/[0.045] dark:hover:bg-white/[0.06]'
            }`}
          >
            {icons.home}
            Listen Now
          </button>

          <p className="mb-1 mt-4 px-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--dim)]">Library</p>
          <button
            type="button"
            onClick={() => {
              setView('songs')
              setQuery('')
            }}
            className={`flex items-center gap-2 rounded-[6px] px-2 py-[5px] text-left text-[12px] ${
              view === 'songs' && !searchResults ? 'bg-[#fa2d48]/10 text-[#fa2d48]' : 'hover:bg-black/[0.045] dark:hover:bg-white/[0.06]'
            }`}
          >
            {icons.songs}
            Songs
          </button>
          <button
            type="button"
            onClick={() => {
              setView('albums')
              setQuery('')
            }}
            className={`flex items-center gap-2 rounded-[6px] px-2 py-[5px] text-left text-[12px] ${
              view === 'albums' && !searchResults ? 'bg-[#fa2d48]/10 text-[#fa2d48]' : 'hover:bg-black/[0.045] dark:hover:bg-white/[0.06]'
            }`}
          >
            {icons.albums}
            Albums
          </button>

          <p className="mb-1 mt-4 px-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--dim)]">Playlists</p>
          {CONFIG.music.playlists.map(playlist => (
            <button
              key={playlist.id}
              type="button"
              onClick={() => openPlaylist(playlist.id)}
              className={`flex min-w-0 items-center gap-2 rounded-[6px] px-2 py-[5px] text-left text-[12px] ${
                view === 'playlist' && playlist.id === activePlaylist.id && !searchResults
                  ? 'bg-[#fa2d48]/10 text-[#fa2d48]'
                  : 'hover:bg-black/[0.045] dark:hover:bg-white/[0.06]'
              }`}
            >
              {icons.playlist}
              <span className="truncate">{playlist.name}</span>
            </button>
          ))}

          <div className="mt-auto rounded-[8px] border border-[var(--line)] bg-[var(--win)]/50 p-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--dim)]">Now playing</p>
            <p className="mt-1 truncate text-[11px] font-medium">{track.title}</p>
            <p className="truncate text-[9.5px] text-[var(--dim)]">Desk Sessions · original</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-[var(--line)] bg-white/90 px-4 py-2 backdrop-blur-xl dark:bg-[#151517]/90">
            <div className="flex min-w-0 items-center gap-1 text-[10.5px] text-[var(--dim)]">
              <span>Library</span>
              {icons.chevron}
              <span className="truncate font-medium text-[var(--fg)]">{mainTitle}</span>
            </div>
            <div className="relative ml-auto w-[158px] max-w-[52%]">
              <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[var(--dim)]">
                {icons.search}
              </span>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search music"
                className="h-[26px] w-full rounded-[6px] border border-[var(--line)] bg-[var(--win-2)] pl-7 pr-6 text-[11px] outline-none placeholder:text-[var(--dim)] focus:border-[#fa2d48]/55"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-1 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-[var(--dim)] hover:bg-black/5 dark:hover:bg-white/10"
                >
                  {icons.close}
                </button>
              ) : null}
            </div>
          </div>

          <div className="px-4 pb-7 pt-4 sm:px-5">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <h1 className="truncate text-[25px] font-bold tracking-[-0.035em] sm:text-[28px]">{mainTitle}</h1>
                <p className="mt-0.5 truncate text-[10.5px] text-[var(--dim)]">{mainSubtitle}</p>
              </div>
              {!searchResults && view !== 'listen' ? (
                <div className="hidden flex-none items-center gap-2 sm:flex">
                  <button
                    type="button"
                    onClick={() => playList(viewTracks)}
                    className="flex items-center gap-1.5 rounded-full bg-[#fa2d48] px-3 py-1.5 text-[10.5px] font-semibold text-white shadow-sm hover:brightness-105"
                  >
                    {icons.play}
                    Play
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShuffle(true)
                      playList(viewTracks)
                    }}
                    className="flex items-center gap-1.5 rounded-full border border-[var(--line)] px-3 py-1.5 text-[10.5px] font-medium hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  >
                    {icons.shuffle}
                    Shuffle
                  </button>
                </div>
              ) : null}
            </div>

            {error ? (
              <div className="mb-3 rounded-[8px] border border-[#fa2d48]/25 bg-[#fa2d48]/5 px-3 py-2 text-[10.5px] text-[#c81e3a] dark:text-[#ff8fa1]">
                {error}
              </div>
            ) : null}

            {searchResults ? (
              renderTracks(searchResults)
            ) : view === 'listen' ? (
              <>
                <section className="relative overflow-hidden rounded-[14px] bg-[#17171b] p-3.5 text-white shadow-[0_18px_36px_rgba(0,0,0,0.2)] sm:p-4">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-80"
                    style={{
                      background: `radial-gradient(75% 130% at 86% 12%, ${track.accent}55, transparent 58%), radial-gradient(55% 100% at 10% 100%, rgba(250,45,72,0.18), transparent 60%)`,
                    }}
                  />
                  <div className="relative flex items-end gap-3 sm:gap-4">
                    <img
                      src={TRACKS[0].cover}
                      alt="Desk Sessions cover"
                      className="h-[100px] w-[100px] flex-none rounded-[7px] object-cover shadow-[0_12px_26px_rgba(0,0,0,0.45)] sm:h-[146px] sm:w-[146px]"
                      draggable={false}
                    />
                    <div className="min-w-0 flex-1 pb-0.5">
                      <p className="text-[8.5px] font-semibold uppercase tracking-[0.2em] text-white/55">Featured playlist</p>
                      <h2 className="mt-1 truncate text-[23px] font-bold tracking-[-0.03em] sm:text-[28px]">Desk Sessions</h2>
                      <p className="mt-1 hidden max-w-[48ch] text-[10.5px] leading-relaxed text-white/60 sm:block">
                        {CONFIG.music.description}
                      </p>
                      <p className="mt-1.5 text-[9.5px] text-white/45">Ziad Emad · 3 songs · 2 minutes</p>
                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => playList(TRACKS)}
                          className="flex items-center gap-1.5 rounded-full bg-[#fa2d48] px-3.5 py-1.5 text-[10.5px] font-semibold text-white shadow-sm hover:brightness-105"
                        >
                          {icons.play}
                          Play
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShuffle(true)
                            playList(TRACKS)
                          }}
                          className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10.5px] font-medium text-white/85 backdrop-blur hover:bg-white/15"
                        >
                          {icons.shuffle}
                          Shuffle
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="mb-2 mt-5 flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold tracking-[-0.01em]">Made for Ziad</h2>
                  <button
                    type="button"
                    onClick={() => setView('albums')}
                    className="text-[10px] font-medium text-[#fa2d48] hover:underline"
                  >
                    See all
                  </button>
                </div>
                {renderAlbumGrid(TRACKS)}

                <div className="mb-2 mt-5 flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold tracking-[-0.01em]">Songs</h2>
                  <button
                    type="button"
                    onClick={() => setView('songs')}
                    className="text-[10px] font-medium text-[#fa2d48] hover:underline"
                  >
                    See all
                  </button>
                </div>
                {renderTracks(TRACKS)}
              </>
            ) : view === 'albums' ? (
              renderAlbumGrid(TRACKS)
            ) : view === 'playlist' ? (
              <>
                <div className="mb-4 flex items-end gap-3">
                  <img
                    src={viewTracks[0]?.cover || TRACKS[0].cover}
                    alt=""
                    className="h-[96px] w-[96px] rounded-[7px] object-cover shadow-[0_10px_24px_rgba(0,0,0,0.25)] sm:h-[118px] sm:w-[118px]"
                    draggable={false}
                  />
                  <div className="min-w-0 pb-0.5">
                    <p className="text-[8.5px] font-semibold uppercase tracking-[0.18em] text-[var(--dim)]">Playlist</p>
                    <h2 className="mt-0.5 truncate text-[22px] font-bold tracking-[-0.03em]">{activePlaylist.name}</h2>
                    <p className="mt-0.5 truncate text-[10px] text-[var(--dim)]">
                      Ziad Emad · {viewTracks.length} songs · {fmt(viewTracks.length * 48)}
                    </p>
                  </div>
                </div>
                {renderTracks(viewTracks)}
              </>
            ) : (
              renderTracks(viewTracks)
            )}
          </div>
        </main>
      </div>

      <div className="flex h-[86px] flex-none items-center gap-3 border-t border-[var(--line)] bg-[#fbfbfd]/95 px-3 backdrop-blur-xl dark:bg-[#1e1e21]/95 sm:gap-4 sm:px-4">
        <div className="flex min-w-0 items-center gap-2 sm:w-[224px]">
          <img
            src={track.cover}
            alt=""
            className="h-10 w-10 flex-none rounded-[5px] object-cover shadow-md sm:h-12 sm:w-12"
            draggable={false}
          />
          <div className="hidden min-w-0 flex-1 sm:block">
            <p className="truncate text-[11.5px] font-semibold leading-tight">{track.title}</p>
            <p className="truncate text-[9.5px] text-[var(--dim)]">{track.artist}</p>
          </div>
          <IconButton
            label={liked.has(track.id) ? 'Remove from favourites' : 'Favourite this song'}
            onClick={() => toggleLike(track.id)}
            active={liked.has(track.id)}
            className="hidden h-6 w-6 flex-none sm:flex"
          >
            {liked.has(track.id) ? icons.heartFill : icons.heart}
          </IconButton>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
          <div className="flex items-center gap-1 sm:gap-3">
            <IconButton label="Shuffle" onClick={() => setShuffle(v => !v)} active={shuffle} className="h-7 w-7">
              {icons.shuffle}
            </IconButton>
            <IconButton label="Previous track" onClick={goPrev} className="h-7 w-7">
              {icons.prev}
            </IconButton>
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? 'Pause' : 'Play'}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fa2d48] text-white shadow-[0_2px_7px_rgba(250,45,72,0.35)] transition hover:brightness-105 sm:h-9 sm:w-9"
            >
              {playing ? icons.pause : icons.play}
            </button>
            <IconButton label="Next track" onClick={goNext} className="h-7 w-7">
              {icons.next}
            </IconButton>
            <IconButton
              label={repeat === 'one' ? 'Repeat one' : repeat === 'all' ? 'Repeat all' : 'Repeat off'}
              onClick={cycleRepeat}
              active={repeat !== 'off'}
              className="h-7 w-7"
            >
              {repeat === 'one' ? icons.repeatOne : icons.repeat}
            </IconButton>
          </div>
          <div className="flex w-full max-w-[420px] items-center gap-2">
            <span className="w-7 text-right text-[8.5px] tabular-nums text-[var(--dim)]">{fmt(time)}</span>
            <input
              type="range"
              min="0"
              max={duration || 48}
              step="0.1"
              value={Math.min(time, duration || 48)}
              onChange={e => {
                const next = Number(e.target.value)
                if (audioRef.current) audioRef.current.currentTime = next
                setTime(next)
              }}
              aria-label="Playback position"
              className="music-range h-1 min-w-0 flex-1"
              style={fillStyle(progress)}
            />
            <span className="w-8 text-[8.5px] tabular-nums text-[var(--dim)]">-{fmt(Math.max(0, (duration || 48) - time))}</span>
          </div>
        </div>

        <div className="hidden flex-none items-center justify-end gap-1.5 md:flex md:w-[156px]">
          <IconButton
            label={muted ? 'Unmute' : 'Mute'}
            onClick={() => setMuted(v => !v)}
            className="h-6 w-6"
          >
            {muted || volume === 0 ? icons.muted : icons.volume}
          </IconButton>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={e => {
              setVolume(Number(e.target.value))
              setMuted(false)
            }}
            aria-label="Volume"
            className="music-range h-1 w-[62px]"
            style={fillStyle(muted ? 0 : volume * 100)}
          />
          <IconButton
            label="Up Next"
            onClick={() => setQueueOpen(v => !v)}
            active={queueOpen}
            className="ml-1 h-7 w-7"
          >
            {icons.queue}
          </IconButton>
        </div>
      </div>

      {queueOpen ? (
        <div className="absolute bottom-[92px] right-2 z-30 w-[280px] max-w-[calc(100%-16px)] overflow-hidden rounded-[11px] border border-black/10 bg-[#f7f7f9]/95 text-[#1d1d1f] shadow-[0_22px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl dark:border-white/15 dark:bg-[#252528]/95 dark:text-[#f5f5f7] sm:right-3">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-3 py-2">
            <div>
              <p className="text-[10.5px] font-semibold">Up Next</p>
              <p className="text-[8.5px] text-[var(--dim)]">Playing from Desk Sessions</p>
            </div>
            <IconButton label="Close Up Next" onClick={() => setQueueOpen(false)} className="h-6 w-6">
              {icons.close}
            </IconButton>
          </div>
          <div className="max-h-[230px] overflow-y-auto p-1.5">
            {TRACKS.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => playTrack(item.id)}
                className={`flex w-full items-center gap-2 rounded-[6px] px-2 py-1.5 text-left hover:bg-black/[0.05] dark:hover:bg-white/[0.07] ${
                  item.id === track.id ? 'bg-[#fa2d48]/10' : ''
                }`}
              >
                <span className="w-4 text-center text-[9px] text-[var(--dim)]">
                  {item.id === track.id && playing ? <Eq /> : ''}
                </span>
                <img src={item.cover} alt="" className="h-8 w-8 rounded-[4px] object-cover" loading="lazy" />
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-[10.5px] font-medium ${item.id === track.id ? 'text-[#fa2d48]' : ''}`}>
                    {item.title}
                  </span>
                  <span className="block truncate text-[8.5px] text-[var(--dim)]">{item.artist}</span>
                </span>
                <span className="text-[8.5px] tabular-nums text-[var(--dim)]">{item.duration}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
