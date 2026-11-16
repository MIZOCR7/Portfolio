import { useCallback, useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { askAgent, checkAgent } from '../lib/agentClient'
import { answerLocally } from '../lib/localAgent'
import { checkLive, LiveSession } from '../lib/liveAgent'
import LiveWave from '../components/LiveWave'

const cmd = text => ({ text, kind: 'cmd' })
const out = text => ({ text, kind: 'out' })
const sys = text => ({ text, kind: 'sys' })
const ai = text => ({ text, kind: 'ai' })
const err = text => ({ text, kind: 'err' })

const LIVE_IDLE = {
  status: 'idle',
  error: null,
  code: null,
  model: null,
  voice: null,
  turns: [],
  userDraft: '',
  aiDraft: '',
  startedAt: 0,
  notice: '',
}

const WELCOME = [
  cmd('Last login: today on ttys001'),
  sys('Ziad AI is online. It reads this portfolio and answers in plain language.'),
  out(''),
  out('Try a question, or type /help for commands.'),
  out('Type /live to talk to it out loud with Gemini Live.'),
  out(''),
]

const HELP = [
  out('ZIAD AI — COMMANDS'),
  out('  /help              this list'),
  out('  /live              start a Gemini Live voice call (mic + speaker)'),
  out('  /exit              end the live call and return to the shell'),
  out('  /clear             clear the terminal or the live transcript'),
  out(''),
  out('  whoami             the short version of Ziad'),
  out('  projects           list every project'),
  out('  open <project>     open a project window (e.g. open pipe)'),
  out('  folders            show the six desktop folders'),
  out('  certs              list certifications'),
  out('  honors             list awards and recognition'),
  out('  experience         roles, teaching and service'),
  out('  skills             toolkit and languages'),
  out('  contact            email, Instagram, GitHub, LinkedIn'),
  out('  instagram          open @zes79586'),
  out('  resume             open the printable résumé'),
  out('  notes / photos     open those windows'),
  out('  date               current date and time'),
  out(''),
  out('Anything else you type is sent to the Gemini agent, which knows this whole portfolio.'),
  out('In a live call you can speak naturally or type to the agent; it answers with its voice.'),
  out(''),
]

const LIVE_LABEL = {
  idle: 'ready',
  connecting: 'connecting',
  listening: 'listening',
  speaking: 'speaking',
  ended: 'ended',
  error: 'attention',
}

function formatElapsed(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function MicIcon({ className = 'h-3 w-3' }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <rect x="5.4" y="1.6" width="5.2" height="8.1" rx="2.6" />
      <path d="M3.4 7.6a4.6 4.6 0 0 0 9.2 0M8 12.2v2.2M5.9 14.4h4.2" />
    </svg>
  )
}

export default function Terminal({ onOpenProject, onOpenApp, onOpenFolder, onLink }) {
  const [lines, setLines] = useState(WELCOME)
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [hIndex, setHIndex] = useState(-1)
  const [mode, setMode] = useState('command')
  const [thinking, setThinking] = useState(false)
  const [agent, setAgent] = useState(null)
  const [liveInfo, setLiveInfo] = useState(null)
  const [live, setLive] = useState(LIVE_IDLE)
  const [tick, setTick] = useState(0)

  const bodyRef = useRef(null)
  const liveBodyRef = useRef(null)
  const inputRef = useRef(null)
  const convo = useRef([])
  const liveRef = useRef(null)
  const liveStatusRef = useRef('idle')
  const levelsRef = useRef({ mic: 0, output: 0 })
  const userDraft = useRef('')
  const aiDraft = useRef('')
  const liveNotice = useRef('')

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [lines, thinking])

  useEffect(() => {
    const el = liveBodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [live.turns.length, live.userDraft, live.aiDraft, live.status])

  useEffect(() => {
    if (mode !== 'live' || !live.startedAt) return
    const id = window.setInterval(() => setTick(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [mode, live.startedAt])

  useEffect(() => {
    inputRef.current?.focus()
  }, [mode])

  useEffect(() => {
    let alive = true
    checkAgent().then(status => {
      if (alive) setAgent(status)
    })
    checkLive().then(status => {
      if (alive) setLiveInfo(status)
    })
    return () => {
      alive = false
      liveRef.current?.stop()
      liveRef.current = null
    }
  }, [])

  const push = (...next) => setLines(prev => [...prev, ...next])

  const setLiveStatus = useCallback(status => {
    if (liveStatusRef.current === status) return
    liveStatusRef.current = status
    setLive(prev => ({ ...prev, status }))
  }, [])

  const commitTurn = useCallback(() => {
    const user = userDraft.current.trim()
    const reply = aiDraft.current.trim()
    userDraft.current = ''
    aiDraft.current = ''
    if (!user && !reply) return
    setLive(prev => ({
      ...prev,
      turns: [...prev.turns, { user, ai: reply }].slice(-40),
      userDraft: '',
      aiDraft: '',
    }))
  }, [])

  const handleLiveEvent = useCallback(
    event => {
      switch (event.type) {
        case 'ready':
          liveStatusRef.current = 'listening'
          setLive(prev => ({
            ...prev,
            status: 'listening',
            model: event.model || prev.model,
            voice: event.voice || prev.voice,
            startedAt: prev.startedAt || Date.now(),
          }))
          break
        case 'speaking':
          setLiveStatus('speaking')
          break
        case 'user':
          userDraft.current += event.text
          setLive(prev => ({ ...prev, userDraft: userDraft.current }))
          break
        case 'assistant':
          aiDraft.current += event.text
          setLive(prev => ({ ...prev, aiDraft: aiDraft.current, status: 'speaking' }))
          liveStatusRef.current = 'speaking'
          break
        case 'interrupted':
          commitTurn()
          setLiveStatus('listening')
          break
        case 'turn-complete':
          commitTurn()
          setLiveStatus('listening')
          break
        case 'ending':
          liveStatusRef.current = 'ended'
          setLive(prev => ({ ...prev, status: 'ended', notice: 'The Live session is ending after its time limit.' }))
          break
        case 'closed': {
          liveRef.current = null
          if (liveStatusRef.current === 'ended') break
          const clean = event.code === 1000
          liveStatusRef.current = clean ? 'ended' : 'error'
          setLive(prev => ({
            ...prev,
            status: clean ? 'ended' : 'error',
            error: clean ? null : 'The live audio connection closed. Start a new call.',
            notice: '',
          }))
          break
        }
        case 'error':
          liveRef.current = null
          liveStatusRef.current = 'error'
          setLive(prev => ({
            ...prev,
            status: 'error',
            error: event.message || 'The live call failed.',
          }))
          break
        default:
          break
      }
    },
    [commitTurn, setLiveStatus]
  )

  const startLive = useCallback(async () => {
    liveRef.current?.stop()
    liveRef.current = null
    userDraft.current = ''
    aiDraft.current = ''
    liveNotice.current = ''
    levelsRef.current = { mic: 0, output: 0 }
    liveStatusRef.current = 'connecting'
    setMode('live')
    setLive({
      ...LIVE_IDLE,
      status: 'connecting',
      startedAt: Date.now(),
      model: liveInfo?.model || null,
      voice: liveInfo?.voice || null,
    })

    const session = new LiveSession({
      onEvent: handleLiveEvent,
      onLevel: levels => {
        levelsRef.current = levels
      },
    })
    liveRef.current = session

    try {
      await session.start()
      if (liveRef.current === session && liveStatusRef.current === 'connecting') {
        setLiveStatus('listening')
      }
    } catch (error) {
      if (liveRef.current === session) liveRef.current = null
      liveStatusRef.current = 'error'
      setLive(prev => ({
        ...prev,
        status: 'error',
        error: error.message || 'The live call could not start.',
        code: error.code || 'live_error',
      }))
    }
  }, [handleLiveEvent, liveInfo, setLiveStatus])

  const stopLive = useCallback(() => {
    const session = liveRef.current
    liveRef.current = null
    session?.stop()
    liveStatusRef.current = 'idle'
    levelsRef.current = { mic: 0, output: 0 }
    setMode('command')
    setLive({ ...LIVE_IDLE })
    setLines(prev => [...prev, sys('Live call ended. Back to the shell.'), out('')])
  }, [])

  const ask = async text => {
    setThinking(true)
    const snapshot = convo.current.slice(-8)
    try {
      const answer = await askAgent(text, snapshot)
      convo.current = [...snapshot, { role: 'user', text }, { role: 'model', text: answer }].slice(-8)
      push(ai(answer), out(''))
    } catch (error) {
      if (error.code === 'missing_key') {
        push(
          sys('The live Gemini agent is not configured on this deployment — answering from the local profile instead.'),
          ai(answerLocally(text)),
          out('')
        )
      } else if (error.code === 'rate_limited') {
        push(err(error.message), out(''))
      } else {
        push(err(`${error.message} Falling back to the local profile.`), ai(answerLocally(text)), out(''))
      }
    } finally {
      setThinking(false)
    }
  }

  const run = async raw => {
    const input = raw.trim()
    if (!input) return
    setHistory(h => [...h, input])
    setHIndex(-1)

    const lower = input.toLowerCase()
    const [command, ...rest] = lower.split(/\s+/)
    const arg = rest.join(' ')

    if (command === '/live') {
      if (mode === 'live') {
        if (live.status === 'error' || live.status === 'ended') await startLive()
        return
      }
      push(cmd(`ziad@mac ~ ${input}`))
      await startLive()
      return
    }

    if (command === '/exit' || command === 'exit') {
      if (mode === 'live') {
        push(cmd(`you › ${input}`))
        stopLive()
      } else {
        push(out('You are already in the shell. /live starts a voice call.'), out(''))
      }
      return
    }

    if (command === '/clear' || command === 'clear') {
      if (mode === 'live') {
        setLive(prev => ({ ...prev, turns: [], userDraft: '', aiDraft: '' }))
      } else {
        setLines([])
      }
      return
    }

    if (mode === 'live') {
      if (input.startsWith('/')) {
        setLive(prev => ({
          ...prev,
          notice: 'In a live call, speak or type a question. /clear clears the transcript, /exit ends the call.',
        }))
        return
      }
      try {
        liveRef.current?.sendText(input)
        userDraft.current = userDraft.current ? `${userDraft.current} ${input}` : input
        setLive(prev => ({ ...prev, userDraft: userDraft.current, notice: '' }))
      } catch (error) {
        setLive(prev => ({ ...prev, notice: error.message || 'The live agent is still connecting.' }))
      }
      return
    }

    push(cmd(`ziad@mac ~ ${input}`))

    if (command === '/help' || command === 'help') {
      push(...HELP, out(''))
      return
    }

    if (command === 'whoami' || command === '/whoami') {
      push(
        out(CONFIG.site.fullName),
        out(`${CONFIG.site.role} · ${CONFIG.site.location}`),
        out(`${CONFIG.site.status} · ${CONFIG.site.school}`),
        out(`${CONFIG.site.age} years old · ${CONFIG.site.languages}`),
        out('')
      )
      return
    }

    if (command === 'projects' || command === '/projects') {
      push(
        out('Projects:'),
        ...CONFIG.projects.map(
          (p, i) => out(`  ${String(i + 1).padStart(2, '0')}  ${p.id.padEnd(9)} ${p.title} — ${p.kind}`)
        ),
        out(''),
        out('Open one with: open pipe · open pest · open sprout'),
        out('')
      )
      return
    }

    if (command === 'folders' || command === 'ls') {
      push(
        out('Desktop folders:'),
        ...Object.entries(CONFIG.folders).map(([, folder]) =>
          out(`  ${folder.title.padEnd(14)} ${folder.items.length} items`)
        ),
        out(''),
        out('Open them from the desktop, the dock, or Spotlight.'),
        out('')
      )
      return
    }

    if (command === 'open' || command === '/open') {
      const project = CONFIG.projects.find(p => p.id === arg || p.title.toLowerCase() === arg)
      if (project) {
        push(out(`Opening ${project.title}…`), out(''))
        onOpenProject(project.id)
        return
      }
      const folderId = Object.keys(CONFIG.folders).find(
        id =>
          id === arg ||
          CONFIG.folders[id].title.toLowerCase() === arg ||
          (id === 'about-me' && arg === 'about')
      )
      if (folderId) {
        push(out(`Opening ${CONFIG.folders[folderId].title}…`), out(''))
        onOpenFolder(folderId)
        return
      }
      push(
        out(
          arg
            ? `No project or folder named “${arg}”. Try “projects”, “achievements” or “studio”.`
            : 'Usage: open <project-id or folder>'
        ),
        out('')
      )
      return
    }

    if (command === 'certs' || command === '/certs') {
      push(
        out(`${CONFIG.certificates.length} certifications and awards on file:`),
        ...CONFIG.certificates.map(c => out(`  • ${c.title} — ${c.org}, ${c.year}`)),
        out(''),
        out('Open Achievements → Certifications to see the scans.'),
        out('')
      )
      return
    }

    if (command === 'honors' || command === '/honors') {
      push(
        out('Honors:'),
        ...CONFIG.honors.map(h => out(`  • ${h.title} — ${h.org}, ${h.year}`)),
        out('')
      )
      return
    }

    if (command === 'experience' || command === '/experience') {
      push(
        out('Experience, teaching and service:'),
        ...CONFIG.experience.map(x => out(`  • ${x.role} — ${x.org}, ${x.period}`)),
        out(''),
        out('Open Experience for the full descriptions.'),
        out('')
      )
      return
    }

    if (command === 'skills' || command === '/skills') {
      push(
        ...CONFIG.tech.map(g => out(`${g.category.padEnd(10)} ${g.items.join(' · ')}`)),
        out(''),
        out(`Languages  ${CONFIG.site.languages}`),
        out('')
      )
      return
    }

    if (command === 'contact' || command === '/contact') {
      push(
        out(`email      ${CONFIG.site.email}`),
        out(`instagram  ${CONFIG.site.instagram}  (${CONFIG.site.instagramHandle})`),
        out(`github     ${CONFIG.site.github}`),
        out(`linkedin   ${CONFIG.site.linkedin}`),
        out('')
      )
      return
    }

    if (command === 'instagram' || command === '/instagram') {
      push(out(`Opening ${CONFIG.site.instagramHandle}…`), out(''))
      onLink(CONFIG.site.instagram)
      return
    }

    if (command === 'resume' || command === '/resume') {
      push(out('Opening the printable résumé…'), out(''))
      onOpenApp('resume')
      return
    }

    if (command === 'notes' || command === '/notes') {
      push(out('Opening Notes…'), out(''))
      onOpenApp('notes')
      return
    }

    if (command === 'photos' || command === '/photos') {
      push(out('Opening Photos…'), out(''))
      onOpenApp('photos')
      return
    }

    if (command === 'date' || command === '/date') {
      push(out(new Date().toLocaleString('en-GB', { timeZone: CONFIG.site.timezone })), out(''))
      return
    }

    if (command === 'sudo') {
      push(out('Nice try. This desktop has no root — only a portfolio.'), out(''))
      return
    }

    await ask(input)
  }

  const configuredLive = liveInfo?.configured !== false
  const status =
    mode === 'live'
      ? `live · ${LIVE_LABEL[live.status] || 'ready'}`
      : thinking
        ? 'thinking…'
        : agent === null
          ? 'connecting…'
          : agent.configured
            ? `Gemini · ${agent.model}`
            : 'local knowledge mode'

  const dot =
    mode === 'live'
      ? live.status === 'listening' || live.status === 'speaking'
        ? 'bg-[#30d158]'
        : live.status === 'error'
          ? 'bg-[#ff453a]'
          : live.status === 'ended'
            ? 'bg-white/35'
            : 'bg-[#ff9f0a]'
      : agent?.configured
        ? 'bg-[#30d158]'
        : 'bg-[#ff9f0a]'

  const elapsed = live.startedAt ? Math.max(0, Math.floor(((tick || Date.now()) - live.startedAt) / 1000)) : 0
  const liveModel = live.model || liveInfo?.model || 'gemini-3.8-live'
  const liveVoice = live.voice || liveInfo?.voice || 'Charon'
  const liveActive = live.status === 'listening' || live.status === 'speaking' || live.status === 'connecting'
  const headline =
    live.status === 'connecting'
      ? 'Opening a live line…'
      : live.status === 'speaking'
        ? 'Ziad AI is speaking'
        : live.status === 'listening'
          ? 'Go ahead — I’m listening'
          : live.status === 'ended'
            ? 'Live call ended'
            : live.status === 'error'
              ? 'The live call stopped'
              : 'Gemini Live'

  return (
    <div className="flex h-full flex-col bg-[#121316] text-[#e8e8e8]">
      <div className="flex flex-none flex-wrap items-center gap-2 border-b border-white/10 bg-[#1a1c20] px-3 py-1.5">
        <span className={`h-[7px] w-[7px] rounded-full ${dot}`} />
        <span className="font-mono text-[10.5px] font-semibold tracking-[0.02em] text-white/80">ziad-ai</span>
        <span className="rounded-full bg-white/5 px-2 py-[1px] font-mono text-[9.5px] text-white/45">{status}</span>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => run('/help')}
            className="rounded-[5px] px-2 py-1 font-mono text-[10.5px] text-white/55 hover:bg-white/10 hover:text-white"
          >
            /help
          </button>
          {mode === 'live' ? (
            <button
              type="button"
              onClick={liveActive ? stopLive : startLive}
              className={`flex items-center gap-1.5 rounded-[5px] px-2 py-1 font-mono text-[10.5px] font-semibold ${
                liveActive
                  ? 'bg-[#ff453a]/15 text-[#ff9f9a] hover:bg-[#ff453a]/25'
                  : 'bg-[#30d158] text-[#082014] hover:brightness-110'
              }`}
            >
              {liveActive ? 'end call' : 'new call'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => run('/live')}
              className="flex items-center gap-1.5 rounded-[5px] bg-[#30d158] px-2 py-1 font-mono text-[10.5px] font-semibold text-[#082014] hover:brightness-110"
            >
              <MicIcon />
              /live
            </button>
          )}
        </div>
      </div>

      {mode === 'live' ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#0c0f10]">
          <div className="flex flex-none items-start justify-between gap-3 px-4 pt-3">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-[#30d158]/80">
                <span className={`h-1.5 w-1.5 rounded-full ${liveActive ? 'animate-pulse bg-[#30d158]' : 'bg-white/30'}`} />
                Gemini Live
              </p>
              <h3 className="mt-1 text-[18px] font-semibold leading-tight tracking-[-0.02em] text-white">{headline}</h3>
              <p className="mt-1 truncate font-mono text-[9.5px] text-white/40">
                {liveModel} · voice {liveVoice}
                {live.startedAt ? ` · ${formatElapsed(elapsed)}` : ''}
              </p>
            </div>
            <div className="flex flex-none items-center gap-1.5">
              {live.status === 'ended' || live.status === 'error' ? (
                <button
                  type="button"
                  onClick={startLive}
                  className="rounded-[6px] border border-[#30d158]/40 bg-[#30d158]/15 px-2.5 py-1.5 font-mono text-[10px] font-semibold text-[#9be7b4] hover:bg-[#30d158]/25"
                >
                  new call
                </button>
              ) : null}
              <button
                type="button"
                onClick={stopLive}
                className="rounded-[6px] border border-white/15 px-2.5 py-1.5 font-mono text-[10px] text-white/55 hover:bg-white/10 hover:text-white"
              >
                shell
              </button>
            </div>
          </div>

          <div className="relative mx-4 mt-2 flex-none overflow-hidden rounded-[12px] border border-[#30d158]/25 bg-[linear-gradient(180deg,#08120d,#080b0e)] shadow-[inset_0_0_50px_rgba(48,209,88,0.06)]">
            <LiveWave levels={levelsRef} active={liveActive} speaking={live.status === 'speaking'} />
            <div className="pointer-events-none absolute inset-x-3 bottom-1.5 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.16em] text-white/30">
              <span className={live.status === 'listening' ? 'text-[#8fe0aa]/70' : ''}>◉ mic in</span>
              <span>16 kHz → 24 kHz</span>
              <span>{live.status === 'speaking' ? 'voice out' : 'live scope'}</span>
            </div>
          </div>

          <div ref={liveBodyRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            {live.turns.map((turn, i) => (
              <div key={i} className="mb-3.5">
                {turn.user ? (
                  <div className="mb-1.5">
                    <p className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#8fe0aa]/65">you</p>
                    <p className="whitespace-pre-wrap text-[12.5px] leading-[1.6] text-white/80">{turn.user}</p>
                  </div>
                ) : null}
                {turn.ai ? (
                  <div className="border-l-2 border-[#30d158]/50 pl-2.5">
                    <p className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#8ab4f8]/65">ziad ai</p>
                    <p className="whitespace-pre-wrap text-[12.5px] leading-[1.65] text-[#f0f0f0]">{turn.ai}</p>
                  </div>
                ) : null}
              </div>
            ))}

            {live.userDraft || live.aiDraft || live.status === 'speaking' ? (
              <div className="mb-3.5">
                {live.userDraft ? (
                  <div className="mb-1.5">
                    <p className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#8fe0aa]/65">you</p>
                    <p className="whitespace-pre-wrap text-[12.5px] leading-[1.6] text-white/85">{live.userDraft}</p>
                  </div>
                ) : null}
                {live.aiDraft ? (
                  <div className="border-l-2 border-[#30d158]/50 pl-2.5">
                    <p className="mb-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#8ab4f8]/65">ziad ai</p>
                    <p className="whitespace-pre-wrap text-[12.5px] leading-[1.65] text-[#f0f0f0]">{live.aiDraft}</p>
                  </div>
                ) : live.status === 'speaking' ? (
                  <span className="inline-flex items-center gap-1 border-l-2 border-[#30d158]/50 py-1 pl-2.5 text-[#8fe0aa]">
                    <span className="h-1 w-1 animate-bounce rounded-full bg-current" />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:120ms]" />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:240ms]" />
                  </span>
                ) : null}
              </div>
            ) : null}

            {!live.turns.length && !live.userDraft && !live.aiDraft && live.status === 'connecting' ? (
              <div className="flex h-full min-h-[130px] flex-col items-center justify-center gap-2 text-center">
                <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#30d158]/25 border-t-[#30d158]" />
                <p className="font-mono text-[10.5px] text-[#8fe0aa]/80">Opening the microphone and the live line…</p>
              </div>
            ) : null}

            {!live.turns.length && !live.userDraft && !live.aiDraft && live.status === 'listening' ? (
              <div className="flex h-full min-h-[130px] flex-col items-center justify-center gap-2 px-3 text-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#30d158]/30 bg-[#30d158]/10 text-[#8fe0aa]">
                  <MicIcon className="h-4 w-4" />
                </span>
                <p className="text-[13px] font-medium text-white/85">Talk to Ziad’s AI</p>
                <p className="max-w-[38ch] text-[11px] leading-relaxed text-white/45">
                  Ask about Pipe Inspector, his certificates, teaching, or how to reach him. Speak naturally.
                </p>
                <p className="font-mono text-[9px] text-white/25">headphones make the conversation cleaner</p>
              </div>
            ) : null}

            {live.error ? (
              <div className="mt-2 rounded-[9px] border border-[#ff453a]/25 bg-[#ff453a]/8 px-3 py-2.5">
                <p className="font-mono text-[10px] leading-relaxed text-[#ff9f9a]">{live.error}</p>
                <button
                  type="button"
                  onClick={startLive}
                  className="mt-2 rounded-[5px] border border-[#ff9f9a]/35 px-2 py-1 font-mono text-[10px] text-[#ffd0cc] hover:bg-[#ff453a]/15"
                >
                  try the call again
                </button>
              </div>
            ) : null}

            {live.notice ? <p className="mt-2 font-mono text-[9.5px] leading-relaxed text-[#ffd60a]/65">{live.notice}</p> : null}
          </div>
        </div>
      ) : (
        <div
          ref={bodyRef}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-3 font-mono text-[12px] leading-[1.65]"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => (
            <p
              key={i}
              className={
                line.kind === 'cmd'
                  ? 'whitespace-pre-wrap text-[#8be9a8]'
                  : line.kind === 'sys'
                    ? 'whitespace-pre-wrap text-[#8ab4f8]'
                    : line.kind === 'ai'
                      ? 'mt-1 whitespace-pre-wrap border-l-2 border-[#30d158]/50 pl-2.5 text-[#f0f0f0]'
                      : line.kind === 'err'
                        ? 'whitespace-pre-wrap text-[#ff9f9a]'
                        : 'whitespace-pre-wrap text-[#d8d8d8]/85'
              }
            >
              {line.text || '\u00A0'}
            </p>
          ))}
          {thinking ? (
            <p className="mt-1 flex items-center gap-2 border-l-2 border-[#30d158]/50 pl-2.5 text-[#8fe0aa]">
              <span className="inline-flex gap-1">
                <span className="h-1 w-1 animate-bounce rounded-full bg-current" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:120ms]" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:240ms]" />
              </span>
              ziad-ai is thinking
            </p>
          ) : null}
        </div>
      )}

      <form
        onSubmit={e => {
          e.preventDefault()
          const text = value
          setValue('')
          run(text)
        }}
        className="flex flex-none items-center gap-2 border-t border-white/10 bg-[#121316] px-4 py-2"
      >
        <span className={`whitespace-nowrap ${mode === 'live' ? 'text-[#8fe0aa]' : 'text-[#8be9a8]'}`}>
          {mode === 'live' ? 'you ›' : 'ziad@mac ~ %'}
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              const text = value
              setValue('')
              run(text)
              return
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault()
              const i = hIndex < 0 ? history.length - 1 : Math.max(0, hIndex - 1)
              setHIndex(i)
              setValue(history[i] || '')
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              if (hIndex < 0) return
              const i = hIndex + 1
              if (i >= history.length) {
                setHIndex(-1)
                setValue('')
              } else {
                setHIndex(i)
                setValue(history[i])
              }
            }
            if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault()
              if (mode === 'live') setLive(prev => ({ ...prev, turns: [], userDraft: '', aiDraft: '' }))
              else setLines([])
            }
          }}
          aria-label="Ask Ziad's AI agent, type a command, or talk in a live call"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          placeholder={
            mode === 'live'
              ? live.status === 'connecting'
                ? 'Connecting the live line…'
                : 'Speak naturally, or type to the live agent…'
              : 'Ask a question, or type /help'
          }
          className="w-full bg-transparent font-mono text-[12px] text-[#f2f2f2] caret-[#8be9a8] placeholder:text-white/30 focus:outline-none"
        />
      </form>

      {mode === 'command' && lines.length <= WELCOME.length + 4 && !thinking ? (
        <div className="flex flex-none flex-wrap gap-1.5 border-t border-white/10 px-3 py-2">
          <button
            type="button"
            onClick={() => run('/live')}
            className="flex items-center gap-1.5 rounded-full border border-[#30d158]/45 bg-[#30d158]/15 px-2.5 py-1 font-mono text-[10px] font-semibold text-[#9be7b4] hover:bg-[#30d158]/25"
          >
            <MicIcon className="h-2.5 w-2.5" />
            Talk live
          </button>
          {CONFIG.agent.starters.map(q => (
            <button
              key={q}
              type="button"
              onClick={() => run(q)}
              className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-white/60 hover:border-[#0a84ff]/60 hover:text-white"
            >
              {q}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex flex-none items-center justify-between gap-3 border-t border-white/10 px-4 py-1.5 font-mono text-[10px] text-white/40">
        <span className="truncate">
          {mode === 'live' ? 'gemini live · 16 kHz in / 24 kHz out' : 'zsh · ziad-ai · UTF-8'}
        </span>
        <span className="truncate text-right">
          {mode === 'live'
            ? `voice ${liveVoice}${configuredLive ? '' : ' · not configured'}`
            : agent?.configured
              ? 'Gemini · server-side key'
              : 'local profile fallback'}
        </span>
      </div>
    </div>
  )
}
