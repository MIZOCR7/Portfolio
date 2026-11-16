import { useEffect, useMemo, useRef, useState } from 'react'
import { CONFIG } from '../config'

const LOCAL = CONFIG.music.tracks.map(track => ({
  ...track,
  local: true,
  sourceLabel: 'Desk Sessions',
  durationSeconds: 48,
  durationLabel: track.duration,
}))

const LOCAL_BY_ID = Object.fromEntries(LOCAL.map(track => [track.id, track]))

const PLAYLISTS = CONFIG.music.playlists.map(playlist => ({
  ...playlist,
  tracks: playlist.trackIds.map(id => LOCAL_BY_ID[id]).filter(Boolean),
}))

const FREE_CHIPS = ['jazz', 'classical', 'lofi', 'arabic', 'rock', 'electronic']

function fmt(value) {
  if (!Number.isFinite(value) || value < 0) return '0:00'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function fillStyle(percent, color = '#1ed760') {
  const p = Math.max(0, Math.min(100, percent))
  return {
    background: `linear-gradient(to right, ${color} 0%, ${color} ${p}%, rgba(255,255,255,0.18) ${p}%, rgba(255,255,255,0.18) 100%)`,
  }
}

function Icon({ name, className = 'h-4 w-4' }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className,
    'aria-hidden': true,
  }
  switch (name) {
    case 'home':
      return <svg {...common}><path d="M3 10.7 12 3l9 7.7V21h-6v-6H9v6H3Z" /></svg>
    case 'search':
      return <svg {...common}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>
    case 'library':
      return <svg {...common}><path d="M4 4v16M8 4v16M12 5v15M17 4l3 15" /></svg>
    case 'globe':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>
    case 'play':
      return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6L19 12Z" /></svg>
    case 'pause':
      return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
    case 'next':
      return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M5 5.5v13L15 12Z" /><path d="M17 5h2v14h-2Z" /></svg>
    case 'prev':
      return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M19 5.5v13L9 12Z" /><path d="M5 5h2v14H5Z" /></svg>
    case 'shuffle':
      return <svg {...common}><path d="M3 6h3.5c5.2 0 5.5 12 10.8 12H21" /><path d="m18 15 3 3-3 3M18 3l3 3-3 3" /><path d="M3 18h3.5c1.7 0 2.9-.9 4-2.2M14.5 8.2c1.1-1.4 2.2-2.2 4-2.2H21" /></svg>
    case 'repeat':
      return <svg {...common}><path d="M4 9a5 5 0 0 1 5-5h10" /><path d="m16 1 3 3-3 3M20 15a5 5 0 0 1-5 5H5" /><path d="m8 23-3-3 3-3" /></svg>
    case 'repeatOne':
      return <svg {...common}><path d="M4 9a5 5 0 0 1 5-5h10" /><path d="m16 1 3 3-3 3M20 15a5 5 0 0 1-5 5H5" /><path d="m8 23-3-3 3-3" /><path d="M11 9h1.4v6" /></svg>
    case 'heart':
      return <svg {...common}><path d="M12 20S3.5 15.2 3.5 9.2A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 8.5 2c0 6-8.5 10.8-8.5 10.8Z" /></svg>
    case 'heartFill':
      return <svg {...common} fill="currentColor"><path d="M12 20S3.5 15.2 3.5 9.2A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 8.5 2c0 6-8.5 10.8-8.5 10.8Z" /></svg>
    case 'volume':
      return <svg {...common}><path d="M4 9h3l4-3v12l-4-3H4Z" /><path d="M15 8.5a5 5 0 0 1 0 7M17.5 6a8 8 0 0 1 0 12" /></svg>
    case 'mute':
      return <svg {...common}><path d="M4 9h3l4-3v12l-4-3H4Z" /><path d="m16 9 4 6M20 9l-4 6" /></svg>
    case 'queue':
      return <svg {...common}><path d="M4 6h11M4 10h11M4 14h7" /><path d="M18 13v6" /><circle cx="16.5" cy="19" r="1.5" /></svg>
    case 'close':
      return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>
    case 'chevron':
      return <svg {...common}><path d="m9 5 7 7-7 7" /></svg>
    case 'youtube':
      return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="4" /><path d="M10 9.2v5.6l5-2.8Z" fill="#121212" /></svg>
    default:
      return null
  }
}

function Cover({ src, alt = '', className = '' }) {
  const [broken, setBroken] = useState(false)
  if (broken || !src) {
    return (
      <span className={`flex items-center justify-center bg-gradient-to-br from-[#2d2d2d] to-[#181818] text-white/30 ${className}`}>
        <Icon name="library" className="h-5 w-5" />
      </span>
    )
  }
  return <img src={src} alt={alt} loading="lazy" draggable={false} onError={() => setBroken(true)} className={className} />
}

function IconButton({ label, onClick, active, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active === undefined ? undefined : active}
      title={label}
      className={`flex items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#1ed760]/70 ${
        active ? 'text-[#1ed760]' : 'text-white/55 hover:text-white'
      } ${className}`}
    >
      {children}
    </button>
  )
}

export default function Music({ onOpenApp }) {
  const [view, setView] = useState('home')
  const [active, setActive] = useState(LOCAL[0])
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.72)
  const [muted, setMuted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState('off')
  const [liked, setLiked] = useState(() => new Set())
  const [queue, setQueue] = useState(LOCAL)
  const [queueOpen, setQueueOpen] = useState(false)
  const [activePlaylist, setActivePlaylist] = useState(PLAYLISTS[0])
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  const [archiveQuery, setArchiveQuery] = useState('jazz')
  const [archiveResults, setArchiveResults] = useState([])
  const [archiveLoading, setArchiveLoading] = useState(false)
  const [archiveError, setArchiveError] = useState('')
  const [resolving, setResolving] = useState(null)

  const audioRef = useRef(null)
  const wantPlay = useRef(false)

  const localResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return LOCAL.filter(track => `${track.title} ${track.artist} ${track.album}`.toLowerCase().includes(q))
  }, [query])

  const playlistTracks = activePlaylist?.tracks || LOCAL

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
    if (wantPlay.current) {
      const started = audio.play()
      if (started?.catch) {
        started.catch(() => {
          setPlaying(false)
          setError('The browser blocked playback. Press play once to start.')
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active.src])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      wantPlay.current = true
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

  const playLocal = (track, list = LOCAL) => {
    if (!track) return
    setQueue(list)
    setError('')
    if (active.src === track.src) {
      if (audioRef.current?.paused) toggle()
      return
    }
    wantPlay.current = true
    setActive(track)
  }

  const nextTrack = () => {
    if (!active.local) {
      nextArchive()
      return
    }
    const list = queue.length ? queue : LOCAL
    let index = list.findIndex(track => track.id === active.id)
    if (index < 0) index = 0
    if (shuffle) {
      let next = index
      while (list.length > 1 && next === index) next = Math.floor(Math.random() * list.length)
      index = next
    } else {
      index = (index + 1) % list.length
    }
    wantPlay.current = true
    setActive(list[index])
  }

  const previousTrack = () => {
    const audio = audioRef.current
    if (active.local && audio && audio.currentTime > 3) {
      audio.currentTime = 0
      setTime(0)
      return
    }
    if (!active.local) {
      previousArchive()
      return
    }
    const list = queue.length ? queue : LOCAL
    let index = list.findIndex(track => track.id === active.id)
    if (index < 0) index = 0
    index = (index - 1 + list.length) % list.length
    wantPlay.current = true
    setActive(list[index])
  }

  const endTrack = () => {
    if (repeat === 'one') {
      const audio = audioRef.current
      if (!audio) return
      audio.currentTime = 0
      audio.play()
      return
    }
    if (!active.local && !archiveResults.length) {
      setPlaying(false)
      return
    }
    nextTrack()
  }

  const cycleRepeat = () => setRepeat(value => (value === 'off' ? 'all' : value === 'all' ? 'one' : 'off'))

  const toggleLike = id => {
    setLiked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openPlaylist = playlist => {
    setActivePlaylist(playlist)
    setView('playlist')
    setQuery('')
  }

  const playPlaylist = playlist => {
    if (!playlist.tracks.length) return
    setActivePlaylist(playlist)
    setQueue(playlist.tracks)
    wantPlay.current = true
    setActive(playlist.tracks[0])
  }

  const openYouTube = () => {
    if (onOpenApp) onOpenApp('youtube')
    else window.open('https://www.youtube.com', '_blank', 'noopener,noreferrer')
  }

  const searchArchive = async value => {
    const term = (value ?? archiveQuery).trim()
    if (!term) return
    setArchiveQuery(term)
    setView('free')
    setArchiveLoading(true)
    setArchiveError('')
    try {
      const params = new URLSearchParams()
      params.set('q', `${term} AND mediatype:audio AND format:(MP3) AND collection:(audio_music)`)
      for (const field of ['identifier', 'title', 'creator', 'year', 'downloads']) params.append('fl[]', field)
      params.append('sort[]', 'downloads desc')
      params.set('rows', '18')
      params.set('page', '1')
      params.set('output', 'json')
      const res = await fetch(`https://archive.org/advancedsearch.php?${params.toString()}`)
      if (!res.ok) throw new Error('The Internet Archive search is unavailable right now.')
      const data = await res.json()
      const docs = data?.response?.docs || []
      setArchiveResults(
        docs
          .filter(doc => doc?.identifier)
          .map(doc => ({
            identifier: doc.identifier,
            title: doc.title || 'Untitled recording',
            creator: Array.isArray(doc.creator) ? doc.creator.join(', ') : doc.creator || 'Internet Archive',
            year: doc.year || '',
            cover: `https://archive.org/services/img/${encodeURIComponent(doc.identifier)}`,
            source: 'Internet Archive',
          }))
      )
      if (!docs.length) setArchiveError('No free recordings matched that search.')
    } catch (err) {
      setArchiveResults([])
      setArchiveError(err.message || 'Could not search the Internet Archive.')
    } finally {
      setArchiveLoading(false)
    }
  }

  const openFree = () => {
    setView('free')
    setQuery('')
    if (!archiveResults.length && !archiveLoading) searchArchive('jazz')
  }

  const playArchive = async item => {
    if (!item?.identifier || resolving) return
    setResolving(item.identifier)
    setArchiveError('')
    try {
      const res = await fetch(`https://archive.org/metadata/${encodeURIComponent(item.identifier)}`)
      if (!res.ok) throw new Error('That recording could not be opened.')
      const meta = await res.json()
      const files = (meta.files || []).filter(file => /\.(mp3|ogg|m4a|flac)$/i.test(file.name || ''))
      const file =
        files.find(f => /vbr mp3/i.test(f.format || '')) ||
        files.find(f => /\.mp3$/i.test(f.name || '')) ||
        files[0]
      if (!file) throw new Error('That recording has no playable audio file.')
      const src = `https://archive.org/download/${encodeURIComponent(item.identifier)}/${encodeURIComponent(file.name)}`
      const seconds = Number(file.length)
      wantPlay.current = true
      setActive({
        id: `archive:${item.identifier}:${file.name}`,
        title: item.title,
        artist: item.creator,
        album: 'Internet Archive',
        cover: item.cover,
        src,
        local: false,
        identifier: item.identifier,
        sourceLabel: 'Internet Archive · free',
        durationLabel: Number.isFinite(seconds) ? fmt(seconds) : '',
        durationSeconds: Number.isFinite(seconds) ? seconds : 0,
      })
    } catch (err) {
      setArchiveError(err.message || 'That recording could not be played.')
    } finally {
      setResolving(null)
    }
  }

  const nextArchive = () => {
    if (!archiveResults.length) return
    const index = archiveResults.findIndex(item => item.identifier === active.identifier)
    const next = archiveResults[(index + 1) % archiveResults.length]
    if (next) playArchive(next)
  }

  const previousArchive = () => {
    if (!archiveResults.length) return
    const index = archiveResults.findIndex(item => item.identifier === active.identifier)
    const previous = archiveResults[(index - 1 + archiveResults.length) % archiveResults.length]
    if (previous) playArchive(previous)
  }

  const title =
    localResults ? 'Search' : view === 'songs' ? 'Songs' : view === 'albums' ? 'Albums' : view === 'playlist' ? activePlaylist.name : view === 'free' ? 'Free Music' : 'Good evening'

  const subtitle =
    localResults
      ? `${localResults.length} ${localResults.length === 1 ? 'result' : 'results'} for “${query.trim()}”`
      : view === 'songs'
        ? `${LOCAL.length} songs · ${Math.round((LOCAL.length * 48) / 60)} minutes`
        : view === 'albums'
          ? 'Desk Sessions · the full record'
          : view === 'playlist'
            ? `${playlistTracks.length} songs · ${fmt(playlistTracks.length * 48)}`
            : view === 'free'
              ? 'Public-domain and Creative Commons audio from the Internet Archive.'
              : 'Your desk sessions, free recordings and YouTube, in one place.'

  const progress = duration ? (time / duration) * 100 : 0
  const playerDuration = duration || active.durationSeconds || 48

  const renderTrackTable = list => (
    <div className="overflow-hidden rounded-[10px] border border-white/[0.06] bg-white/[0.025]">
      <div className="grid grid-cols-[24px_minmax(0,1fr)_58px_32px] items-center gap-2 border-b border-white/[0.07] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/35 sm:grid-cols-[24px_minmax(0,1.7fr)_minmax(0,1fr)_58px_32px]">
        <span className="text-center">#</span>
        <span>Title</span>
        <span className="hidden sm:block">Album</span>
        <span className="text-right">Time</span>
        <span />
      </div>
      {list.map((item, index) => {
        const current = active.local && active.id === item.id
        return (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            onClick={() => playLocal(item, list)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                playLocal(item, list)
              }
            }}
            className={`group grid cursor-default grid-cols-[24px_minmax(0,1fr)_58px_32px] items-center gap-2 border-b border-white/[0.045] px-3 py-2 text-left outline-none last:border-0 hover:bg-white/[0.06] sm:grid-cols-[24px_minmax(0,1.7fr)_minmax(0,1fr)_58px_32px] ${
              current ? 'bg-white/[0.06]' : ''
            }`}
          >
            <span className={`flex items-center justify-center text-[10px] tabular-nums ${current ? 'text-[#1ed760]' : 'text-white/35'}`}>
              {current && playing ? (
                <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
                  <span className="h-1/2 w-[2px] animate-pulse rounded-full bg-[#1ed760]" />
                  <span className="h-full w-[2px] animate-pulse rounded-full bg-[#1ed760] [animation-delay:120ms]" />
                  <span className="h-2/3 w-[2px] animate-pulse rounded-full bg-[#1ed760] [animation-delay:240ms]" />
                </span>
              ) : (
                String(index + 1).padStart(2, '0')
              )}
            </span>
            <span className="flex min-w-0 items-center gap-2.5">
              <Cover src={item.cover} className="h-9 w-9 flex-none rounded-[4px] object-cover" />
              <span className="min-w-0">
                <span className={`block truncate text-[11.5px] font-medium ${current ? 'text-[#1ed760]' : 'text-white/90'}`}>{item.title}</span>
                <span className="block truncate text-[10px] text-white/40">{item.artist}</span>
              </span>
            </span>
            <span className="hidden truncate text-[10.5px] text-white/40 sm:block">{item.album}</span>
            <span className="text-right text-[10px] tabular-nums text-white/35">{item.durationLabel}</span>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation()
                toggleLike(item.id)
              }}
              onKeyDown={e => e.stopPropagation()}
              aria-label={liked.has(item.id) ? `Remove ${item.title} from favourites` : `Favourite ${item.title}`}
              className={`flex h-6 w-6 items-center justify-center rounded-full outline-none hover:bg-white/10 ${
                liked.has(item.id) ? 'text-[#1ed760]' : 'text-white/35 opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
              }`}
            >
              <Icon name={liked.has(item.id) ? 'heartFill' : 'heart'} className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )

  const renderAlbumCards = list => (
    <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
      {list.map(item => {
        const current = active.local && active.id === item.id
        return (
          <button key={item.id} type="button" onClick={() => playLocal(item)} className="group min-w-0 text-left outline-none">
            <span className="relative block aspect-square overflow-hidden rounded-[8px] bg-white/[0.04] shadow-[0_10px_24px_rgba(0,0,0,0.25)]">
              <Cover src={item.cover} alt={`${item.title} cover`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="absolute bottom-2 right-2 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-[#1ed760] text-black opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100">
                <Icon name={current && playing ? 'pause' : 'play'} className="h-4 w-4" />
              </span>
            </span>
            <span className="mt-2 block truncate text-[11.5px] font-semibold text-white/90">{item.title}</span>
            <span className="block truncate text-[10px] text-white/40">{item.artist}</span>
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="flex h-full flex-col bg-[#121212] text-white">
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[216px] flex-none flex-col gap-2 p-2 sm:flex">
          <div className="rounded-[12px] bg-[#090909] p-4">
            <div className="flex items-center gap-2.5">
              <img src="images/icons/music.png" alt="" className="h-7 w-7 object-contain" />
              <div>
                <p className="text-[13px] font-semibold leading-tight">Music</p>
                <p className="text-[8.5px] uppercase tracking-[0.14em] text-white/35">desk sessions + web</p>
              </div>
            </div>
            <nav className="mt-4 space-y-1">
              <button type="button" onClick={() => { setView('home'); setQuery('') }} className={`flex w-full items-center gap-2.5 rounded-[6px] px-2 py-1.5 text-left text-[11.5px] font-medium ${view === 'home' ? 'text-white' : 'text-white/55 hover:text-white'}`}>
                <Icon name="home" /> Home
              </button>
              <button type="button" onClick={() => { setView('songs'); setQuery('') }} className={`flex w-full items-center gap-2.5 rounded-[6px] px-2 py-1.5 text-left text-[11.5px] font-medium ${view === 'songs' || view === 'albums' ? 'text-white' : 'text-white/55 hover:text-white'}`}>
                <Icon name="search" /> Browse
              </button>
              <button type="button" onClick={openFree} className={`flex w-full items-center gap-2.5 rounded-[6px] px-2 py-1.5 text-left text-[11.5px] font-medium ${view === 'free' ? 'text-white' : 'text-white/55 hover:text-white'}`}>
                <Icon name="globe" /> Free Music
              </button>
              <button type="button" onClick={openYouTube} className="flex w-full items-center gap-2.5 rounded-[6px] px-2 py-1.5 text-left text-[11.5px] font-medium text-white/55 hover:text-white">
                <Icon name="youtube" /> YouTube
              </button>
            </nav>
          </div>

          <div className="flex-1 overflow-y-auto rounded-[12px] bg-[#090909] p-3">
            <div className="flex items-center gap-2 px-1 text-white/55">
              <Icon name="library" />
              <span className="text-[11.5px] font-semibold">Your Library</span>
            </div>
            <p className="mb-2 mt-5 px-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">Playlists</p>
            {PLAYLISTS.map(playlist => (
              <button key={playlist.id} type="button" onClick={() => openPlaylist(playlist)} className={`flex w-full items-center gap-2 rounded-[6px] px-1.5 py-1.5 text-left text-[11.5px] ${view === 'playlist' && activePlaylist.id === playlist.id ? 'bg-white/[0.08] text-white' : 'text-white/55 hover:bg-white/[0.05] hover:text-white'}`}>
                <Cover src={playlist.tracks[0]?.cover} className="h-9 w-9 flex-none rounded-[4px] object-cover" />
                <span className="min-w-0">
                  <span className="block truncate font-medium">{playlist.name}</span>
                  <span className="block truncate text-[9.5px] text-white/35">{playlist.tracks.length} songs</span>
                </span>
              </button>
            ))}
            <p className="mb-2 mt-5 px-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">Sources</p>
            <button type="button" onClick={openFree} className="flex w-full items-center gap-2 rounded-[6px] px-1.5 py-1.5 text-left text-[11.5px] text-white/55 hover:bg-white/[0.05] hover:text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-[#173c2a] text-[#1ed760]"><Icon name="globe" /></span>
              Internet Archive
            </button>
            <button type="button" onClick={openYouTube} className="mt-1 flex w-full items-center gap-2 rounded-[6px] px-1.5 py-1.5 text-left text-[11.5px] text-white/55 hover:bg-white/[0.05] hover:text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-[4px] bg-[#3a1418] text-[#ff4d5a]"><Icon name="youtube" /></span>
              YouTube
            </button>
            <p className="mt-5 px-1 text-[9px] leading-relaxed text-white/25">
              Free music is streamed from the Internet Archive. YouTube opens in its official player.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto bg-gradient-to-b from-[#1b1b1b] via-[#151515] to-[#121212]">
          <header className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-white/[0.06] bg-[#121212]/90 px-3 py-2 backdrop-blur-xl sm:px-5">
            <div className="flex items-center gap-1.5 sm:hidden">
              <img src="images/icons/music.png" alt="" className="h-6 w-6 object-contain" />
              <button type="button" onClick={() => setView('home')} className={`rounded-full px-2 py-1 text-[10px] ${view === 'home' ? 'bg-white/15 text-white' : 'text-white/50'}`}>Home</button>
              <button type="button" onClick={openFree} className={`rounded-full px-2 py-1 text-[10px] ${view === 'free' ? 'bg-white/15 text-white' : 'text-white/50'}`}>Free</button>
              <button type="button" onClick={openYouTube} className="rounded-full px-2 py-1 text-[10px] text-white/50">YouTube</button>
            </div>
            <div className="hidden items-center gap-1 text-[10px] text-white/35 sm:flex">
              <span>Library</span>
              <Icon name="chevron" className="h-2.5 w-2.5" />
              <span className="font-medium text-white/70">{title}</span>
            </div>
            <div className="relative ml-auto w-[190px] max-w-[48%]">
              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-white/35"><Icon name="search" className="h-3.5 w-3.5" /></span>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search your library"
                aria-label="Search music library"
                className="h-8 w-full rounded-full border border-white/10 bg-white/[0.06] pl-8 pr-3 text-[11px] text-white outline-none placeholder:text-white/35 focus:border-white/25"
              />
              {query ? (
                <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 text-white/35 hover:text-white">
                  <Icon name="close" className="h-3 w-3" />
                </button>
              ) : null}
            </div>
          </header>

          <div className="px-4 pb-8 pt-4 sm:px-6">
            <div className="mb-4">
              <h1 className="truncate text-[26px] font-bold tracking-[-0.045em] sm:text-[32px]">{title}</h1>
              <p className="mt-1 truncate text-[11px] text-white/40">{subtitle}</p>
            </div>

            {error ? <div className="mb-3 rounded-[8px] border border-[#ff4d5a]/25 bg-[#ff4d5a]/[0.08] px-3 py-2 text-[11px] text-[#ff9aa2]">{error}</div> : null}

            {localResults ? (
              renderTrackTable(localResults)
            ) : view === 'home' ? (
              <>
                <section className="relative overflow-hidden rounded-[14px] border border-white/[0.08] bg-gradient-to-br from-[#1d4d33] via-[#173426] to-[#121212] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:p-5">
                  <div className="relative flex items-end gap-4">
                    <Cover src={LOCAL[0].cover} alt="Desk Sessions" className="h-[112px] w-[112px] flex-none rounded-[8px] object-cover shadow-2xl sm:h-[154px] sm:w-[154px]" />
                    <div className="min-w-0 pb-1">
                      <p className="text-[8.5px] font-semibold uppercase tracking-[0.2em] text-white/45">Featured playlist</p>
                      <h2 className="mt-1 truncate text-[24px] font-bold tracking-[-0.045em] sm:text-[30px]">Desk Sessions</h2>
                      <p className="mt-1 hidden max-w-[48ch] text-[10.5px] leading-relaxed text-white/55 sm:block">{CONFIG.music.description}</p>
                      <p className="mt-1.5 text-[9.5px] text-white/40">Ziad Emad · {LOCAL.length} songs · {Math.round((LOCAL.length * 48) / 60)} minutes</p>
                      <div className="mt-3 flex items-center gap-2">
                        <button type="button" onClick={() => playPlaylist(PLAYLISTS[0])} className="flex h-9 items-center gap-1.5 rounded-full bg-[#1ed760] px-4 text-[11px] font-bold text-black hover:brightness-110">
                          <Icon name="play" className="h-3.5 w-3.5" /> Play
                        </button>
                        <button type="button" onClick={() => setView('playlist')} className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-medium text-white/80 hover:bg-white/15">Open playlist</button>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={openFree} className="group flex min-h-[92px] items-center gap-3 rounded-[10px] border border-white/[0.08] bg-gradient-to-br from-[#173c2a] to-[#18231d] p-3 text-left transition hover:border-[#1ed760]/30">
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[8px] bg-[#1ed760]/15 text-[#1ed760]"><Icon name="globe" className="h-5 w-5" /></span>
                    <span className="min-w-0">
                      <span className="block text-[12px] font-semibold">Explore Free Music</span>
                      <span className="mt-0.5 block text-[10px] leading-relaxed text-white/45">Jazz, classical, Arabic and more from the Internet Archive.</span>
                    </span>
                    <Icon name="chevron" className="ml-auto h-4 w-4 flex-none text-white/30 group-hover:text-white/60" />
                  </button>
                  <button type="button" onClick={openYouTube} className="group flex min-h-[92px] items-center gap-3 rounded-[10px] border border-white/[0.08] bg-gradient-to-br from-[#3a1418] to-[#251416] p-3 text-left transition hover:border-[#ff4d5a]/30">
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[8px] bg-[#ff0033]/15 text-[#ff4d5a]"><Icon name="youtube" className="h-5 w-5" /></span>
                    <span className="min-w-0">
                      <span className="block text-[12px] font-semibold">YouTube</span>
                      <span className="mt-0.5 block text-[10px] leading-relaxed text-white/45">Search anything and play it in YouTube’s official player.</span>
                    </span>
                    <Icon name="chevron" className="ml-auto h-4 w-4 flex-none text-white/30 group-hover:text-white/60" />
                  </button>
                </div>

                <div className="mb-3 mt-6 flex items-end justify-between">
                  <div>
                    <h2 className="text-[17px] font-bold tracking-[-0.025em]">Made for Ziad</h2>
                    <p className="mt-0.5 text-[10px] text-white/35">The Desk Sessions record</p>
                  </div>
                  <button type="button" onClick={() => setView('albums')} className="text-[10.5px] font-semibold text-white/45 hover:text-white">See all</button>
                </div>
                {renderAlbumCards(LOCAL)}
                <div className="mb-3 mt-7 flex items-end justify-between">
                  <h2 className="text-[17px] font-bold tracking-[-0.025em]">Songs</h2>
                  <button type="button" onClick={() => setView('songs')} className="text-[10.5px] font-semibold text-white/45 hover:text-white">See all</button>
                </div>
                {renderTrackTable(LOCAL)}
              </>
            ) : view === 'free' ? (
              <>
                <div className="mb-4 flex flex-wrap items-center gap-2 rounded-[10px] border border-white/[0.08] bg-white/[0.03] p-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[8px] bg-[#1ed760]/15 text-[#1ed760]"><Icon name="globe" /></span>
                  <form
                    onSubmit={e => {
                      e.preventDefault()
                      searchArchive(archiveQuery)
                    }}
                    className="flex min-w-[180px] flex-1 items-center gap-2"
                  >
                    <input
                      value={archiveQuery}
                      onChange={e => setArchiveQuery(e.target.value)}
                      placeholder="Search millions of free recordings"
                      aria-label="Search Internet Archive music"
                      className="h-8 min-w-0 flex-1 rounded-full border border-white/10 bg-[#121212] px-3 text-[11px] text-white outline-none placeholder:text-white/35 focus:border-[#1ed760]/40"
                    />
                    <button type="submit" disabled={archiveLoading} className="h-8 flex-none rounded-full bg-[#1ed760] px-3.5 text-[10.5px] font-bold text-black hover:brightness-110 disabled:opacity-50">
                      {archiveLoading ? 'Searching…' : 'Search'}
                    </button>
                  </form>
                </div>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {FREE_CHIPS.map(chip => (
                    <button key={chip} type="button" onClick={() => searchArchive(chip)} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] capitalize text-white/55 hover:border-white/25 hover:text-white">
                      {chip}
                    </button>
                  ))}
                </div>
                {archiveError ? <div className="mb-3 rounded-[8px] border border-[#ff4d5a]/25 bg-[#ff4d5a]/[0.08] px-3 py-2 text-[11px] text-[#ff9aa2]">{archiveError}</div> : null}
                {archiveLoading ? (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="aspect-square rounded-[8px] bg-white/[0.06]" />
                        <div className="mt-2 h-3 w-4/5 rounded bg-white/[0.06]" />
                        <div className="mt-1.5 h-2.5 w-1/2 rounded bg-white/[0.04]" />
                      </div>
                    ))}
                  </div>
                ) : archiveResults.length ? (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
                    {archiveResults.map(item => (
                      <button key={item.identifier} type="button" onClick={() => playArchive(item)} className="group min-w-0 text-left outline-none">
                        <span className="relative block aspect-square overflow-hidden rounded-[8px] bg-white/[0.04] shadow-[0_10px_24px_rgba(0,0,0,0.25)]">
                          <Cover src={item.cover} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
                          <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                          <span className="absolute bottom-2 right-2 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-[#1ed760] text-black opacity-0 shadow-xl transition-all group-hover:translate-y-0 group-hover:opacity-100">
                            {resolving === item.identifier ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-black/30 border-t-black" /> : <Icon name="play" className="h-4 w-4" />}
                          </span>
                        </span>
                        <span className="mt-2 line-clamp-2 block text-[11px] font-semibold leading-snug text-white/90">{item.title}</span>
                        <span className="block truncate text-[10px] text-white/40">{item.creator}{item.year ? ` · ${item.year}` : ''}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[10px] border border-dashed border-white/15 px-5 py-14 text-center">
                    <p className="text-[12px] text-white/50">Search the Internet Archive’s free audio collection.</p>
                    <p className="mt-1 text-[10px] text-white/30">Try “jazz”, “classical”, “arabic” or “lofi”.</p>
                  </div>
                )}
              </>
            ) : view === 'albums' ? (
              renderAlbumCards(LOCAL)
            ) : view === 'playlist' ? (
              <>
                <div className="mb-5 flex items-end gap-4">
                  <Cover src={playlistTracks[0]?.cover || LOCAL[0].cover} alt="" className="h-[112px] w-[112px] rounded-[8px] object-cover shadow-2xl sm:h-[142px] sm:w-[142px]" />
                  <div className="min-w-0 pb-1">
                    <p className="text-[8.5px] font-semibold uppercase tracking-[0.18em] text-white/40">Playlist</p>
                    <h2 className="mt-1 truncate text-[25px] font-bold tracking-[-0.04em]">{activePlaylist.name}</h2>
                    <p className="mt-1 text-[10px] text-white/40">Ziad Emad · {playlistTracks.length} songs · {fmt(playlistTracks.length * 48)}</p>
                    <button type="button" onClick={() => playPlaylist(activePlaylist)} className="mt-3 flex h-9 items-center gap-1.5 rounded-full bg-[#1ed760] px-4 text-[11px] font-bold text-black hover:brightness-110">
                      <Icon name="play" className="h-3.5 w-3.5" /> Play
                    </button>
                  </div>
                </div>
                {renderTrackTable(playlistTracks)}
              </>
            ) : (
              renderTrackTable(LOCAL)
            )}
          </div>
        </main>
      </div>

      <div className="flex h-[88px] flex-none items-center gap-2 border-t border-white/[0.08] bg-[#181818] px-2.5 sm:gap-4 sm:px-4">
        <div className="flex min-w-0 items-center gap-2 sm:w-[220px]">
          <Cover src={active.cover} alt="" className="h-11 w-11 flex-none rounded-[5px] object-cover shadow-md" />
          <div className="hidden min-w-0 flex-1 sm:block">
            <p className="truncate text-[11.5px] font-semibold">{active.title}</p>
            <p className="truncate text-[9.5px] text-white/40">{active.artist} · {active.sourceLabel}</p>
          </div>
          {active.local ? (
            <IconButton label={liked.has(active.id) ? 'Remove from favourites' : 'Favourite this song'} onClick={() => toggleLike(active.id)} active={liked.has(active.id)} className="hidden h-6 w-6 flex-none sm:flex">
              <Icon name={liked.has(active.id) ? 'heartFill' : 'heart'} className="h-3.5 w-3.5" />
            </IconButton>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
          <div className="flex items-center gap-1 sm:gap-3">
            <IconButton label="Shuffle" onClick={() => setShuffle(v => !v)} active={shuffle} className="h-7 w-7"><Icon name="shuffle" className="h-3.5 w-3.5" /></IconButton>
            <IconButton label="Previous track" onClick={previousTrack} className="h-7 w-7"><Icon name="prev" className="h-3.5 w-3.5" /></IconButton>
            <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:scale-105">
              <Icon name={playing ? 'pause' : 'play'} className="h-4 w-4" />
            </button>
            <IconButton label="Next track" onClick={nextTrack} className="h-7 w-7"><Icon name="next" className="h-3.5 w-3.5" /></IconButton>
            <IconButton label={repeat === 'one' ? 'Repeat one' : repeat === 'all' ? 'Repeat all' : 'Repeat off'} onClick={cycleRepeat} active={repeat !== 'off'} className="h-7 w-7">
              <Icon name={repeat === 'one' ? 'repeatOne' : 'repeat'} className="h-3.5 w-3.5" />
            </IconButton>
          </div>
          <div className="flex w-full max-w-[440px] items-center gap-2">
            <span className="w-7 text-right text-[8.5px] tabular-nums text-white/35">{fmt(time)}</span>
            <input
              type="range"
              min="0"
              max={playerDuration}
              step="0.1"
              value={Math.min(time, playerDuration)}
              onChange={e => {
                const next = Number(e.target.value)
                if (audioRef.current) audioRef.current.currentTime = next
                setTime(next)
              }}
              aria-label="Playback position"
              className="music-range h-1 min-w-0 flex-1"
              style={fillStyle(progress)}
            />
            <span className="w-8 text-[8.5px] tabular-nums text-white/35">-{fmt(Math.max(0, playerDuration - time))}</span>
          </div>
        </div>

        <div className="hidden flex-none items-center justify-end gap-1.5 md:flex md:w-[150px]">
          <IconButton label={muted ? 'Unmute' : 'Mute'} onClick={() => setMuted(v => !v)} className="h-6 w-6">
            <Icon name={muted || volume === 0 ? 'mute' : 'volume'} className="h-3.5 w-3.5" />
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
          <IconButton label="Queue" onClick={() => setQueueOpen(v => !v)} active={queueOpen} className="ml-1 h-7 w-7"><Icon name="queue" /></IconButton>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={active.src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={e => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={e => {
          setDuration(e.currentTarget.duration || active.durationSeconds || 48)
          setTime(e.currentTarget.currentTime)
        }}
        onEnded={endTrack}
        onError={() => setError(active.local ? 'This track could not be loaded. Try another one.' : 'That Internet Archive recording could not be streamed.')}
      />

      {queueOpen ? (
        <div className="absolute bottom-[96px] right-2 z-30 w-[292px] max-w-[calc(100%-16px)] overflow-hidden rounded-[10px] border border-white/10 bg-[#202020]/95 text-white shadow-2xl backdrop-blur-2xl sm:right-3">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
            <div>
              <p className="text-[11px] font-semibold">Queue</p>
              <p className="text-[9px] text-white/35">{active.sourceLabel}</p>
            </div>
            <IconButton label="Close queue" onClick={() => setQueueOpen(false)} className="h-6 w-6"><Icon name="close" className="h-3.5 w-3.5" /></IconButton>
          </div>
          <div className="max-h-[220px] overflow-y-auto p-1.5">
            {queue.map(item => (
              <button key={item.id} type="button" onClick={() => playLocal(item, queue)} className={`flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left hover:bg-white/[0.07] ${active.id === item.id ? 'bg-white/[0.07]' : ''}`}>
                <Cover src={item.cover} className="h-8 w-8 rounded-[4px] object-cover" />
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-[10.5px] font-medium ${active.id === item.id ? 'text-[#1ed760]' : 'text-white/85'}`}>{item.title}</span>
                  <span className="block truncate text-[9px] text-white/35">{item.artist}</span>
                </span>
                <span className="text-[9px] tabular-nums text-white/30">{item.durationLabel}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
