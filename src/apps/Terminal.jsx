import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { askAgent, checkAgent } from '../lib/agentClient'
import { answerLocally } from '../lib/localAgent'

const cmd = text => ({ text, kind: 'cmd' })
const out = text => ({ text, kind: 'out' })
const sys = text => ({ text, kind: 'sys' })
const ai = text => ({ text, kind: 'ai' })
const err = text => ({ text, kind: 'err' })

const WELCOME = [
  cmd('Last login: today on ttys001'),
  sys('Ziad AI is online. It reads this portfolio and answers in plain language.'),
  out(''),
  out('Try a question, or type /help for commands.'),
  out('Type /live to start a proper back-and-forth conversation.'),
  out(''),
]

const HELP = [
  out('ZIAD AI — COMMANDS'),
  out('  /help              this list'),
  out('  /live              start a live conversation with the agent'),
  out('  /exit              leave live mode'),
  out('  /clear             clear the terminal'),
  out(''),
  out('  whoami             the short version of Ziad'),
  out('  projects           list every project'),
  out('  open <project>     open a project window (e.g. open pipe)'),
  out('  folders            show the two desktop folders'),
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
]

export default function Terminal({ onOpenProject, onOpenApp, onOpenFolder, onLink }) {
  const [lines, setLines] = useState(WELCOME)
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [hIndex, setHIndex] = useState(-1)
  const [mode, setMode] = useState('command')
  const [thinking, setThinking] = useState(false)
  const [agent, setAgent] = useState(null)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)
  const convo = useRef([])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [lines, thinking])

  useEffect(() => {
    let alive = true
    checkAgent().then(status => {
      if (alive) setAgent(status)
    })
    return () => {
      alive = false
    }
  }, [])

  const push = (...next) => setLines(prev => [...prev, ...next])

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
    push(cmd(`${mode === 'live' ? 'you' : 'ziad@mac ~'} ${input}`))

    const lower = input.toLowerCase()
    const [command, ...rest] = lower.split(/\s+/)
    const arg = rest.join(' ')

    if (command === '/live') {
      if (mode === 'live') {
        push(sys('You are already in live mode. Ask anything, or /exit to go back to commands.'))
      } else {
        setMode('live')
        push(
          sys('Live conversation started. The agent knows Ziad’s projects, certificates, honors, experience and links.'),
          sys('Ask anything. /exit returns to the shell, /clear clears the screen.'),
          out('')
        )
      }
      return
    }

    if (command === '/exit' || command === 'exit') {
      if (mode === 'live') {
        setMode('command')
        push(sys('Left live mode. Back to the shell.'), out(''))
      } else {
        push(out('You are already in the shell. /live starts a conversation.'), out(''))
      }
      return
    }

    if (command === '/help' || command === 'help') {
      push(...HELP, out(''))
      return
    }

    if (command === '/clear' || command === 'clear') {
      setLines([])
      return
    }

    if (command === 'whoami' || command === '/whoami') {
      push(
        out(CONFIG.site.fullName),
        out(`${CONFIG.site.role} · ${CONFIG.site.location}`),
        out(`${CONFIG.site.status} · ${CONFIG.site.school}`),
        out(`${CONFIG.site.age} years old · ${CONFIG.site.languages}`),
        out(''),
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
        out(''),
      )
      return
    }

    if (command === 'folders' || command === 'ls') {
      push(
        out('Desktop folders:'),
        out('  Projects      seven builds, including Pipe Inspector and Pest Sentinel'),
        out('  About Me      story, certifications, honors, experience, skills, photos, résumé, contact'),
        out(''),
        out('Open them from the desktop, the dock, or Spotlight.'),
        out(''),
      )
      return
    }

    if (command === 'open' || command === '/open') {
      const project = CONFIG.projects.find(
        p => p.id === arg || p.title.toLowerCase() === arg
      )
      if (project) {
        push(out(`Opening ${project.title}…`), out(''))
        onOpenProject(project.id)
        return
      }
      if (arg === 'projects' || arg === 'about' || arg === 'about-me') {
        push(out(`Opening ${arg === 'projects' ? 'Projects' : 'About Me'}…`), out(''))
        onOpenFolder(arg === 'projects' ? 'projects' : 'about-me')
        return
      }
      push(out(arg ? `No project or folder named “${arg}”. Try “projects”.` : 'Usage: open <project-id>'), out(''))
      return
    }

    if (command === 'certs' || command === '/certs') {
      push(
        out(`${CONFIG.certificates.length} certifications and awards on file:`),
        ...CONFIG.certificates.map(c => out(`  • ${c.title} — ${c.org}, ${c.year}`)),
        out(''),
        out('Open About Me → Certifications to see the scans.'),
        out(''),
      )
      return
    }

    if (command === 'honors' || command === '/honors') {
      push(
        out('Honors:'),
        ...CONFIG.honors.map(h => out(`  • ${h.title} — ${h.org}, ${h.year}`)),
        out(''),
      )
      return
    }

    if (command === 'experience' || command === '/experience') {
      push(
        out('Experience, teaching and service:'),
        ...CONFIG.experience.map(x => out(`  • ${x.role} — ${x.org}, ${x.period}`)),
        out(''),
        out('Open About Me → Experience for the full descriptions.'),
        out(''),
      )
      return
    }

    if (command === 'skills' || command === '/skills') {
      push(
        ...CONFIG.tech.map(g => out(`${g.category.padEnd(10)} ${g.items.join(' · ')}`)),
        out(''),
        out(`Languages  ${CONFIG.site.languages}`),
        out(''),
      )
      return
    }

    if (command === 'contact' || command === '/contact') {
      push(
        out(`email      ${CONFIG.site.email}`),
        out(`instagram  ${CONFIG.site.instagram}  (${CONFIG.site.instagramHandle})`),
        out(`github     ${CONFIG.site.github}`),
        out(`linkedin   ${CONFIG.site.linkedin}`),
        out(''),
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

    /* Anything else is a question for the agent. */
    await ask(input)
  }

  const status = thinking
    ? 'thinking…'
    : agent === null
      ? 'connecting…'
      : agent.configured
        ? `Gemini · ${agent.model}`
        : 'local knowledge mode'

  return (
    <div className="flex h-full flex-col bg-[#121316] text-[#e8e8e8]">
      <div className="flex flex-none flex-wrap items-center gap-2 border-b border-white/10 bg-[#1a1c20] px-3 py-1.5">
        <span className={`h-[7px] w-[7px] rounded-full ${agent?.configured ? 'bg-[#30d158]' : 'bg-[#ff9f0a]'}`} />
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
          <button
            type="button"
            onClick={() => run('/live')}
            className={`rounded-[5px] px-2 py-1 font-mono text-[10.5px] font-semibold ${
              mode === 'live' ? 'bg-[#30d158]/20 text-[#7ee2a0]' : 'bg-[#0a84ff] text-white hover:brightness-110'
            }`}
          >
            /live
          </button>
          {mode === 'live' && (
            <button
              type="button"
              onClick={() => run('/exit')}
              className="rounded-[5px] px-2 py-1 font-mono text-[10.5px] text-white/55 hover:bg-white/10 hover:text-white"
            >
              exit
            </button>
          )}
        </div>
      </div>

      {mode === 'live' && (
        <div className="flex flex-none items-center gap-2 border-b border-[#30d158]/20 bg-[#30d158]/10 px-4 py-1">
          <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-[#30d158]" />
          <p className="font-mono text-[10px] text-[#8fe0aa]">
            live conversation · ask anything about Ziad · /exit to leave
          </p>
        </div>
      )}

      <div
        ref={bodyRef}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3 font-mono text-[12px] leading-[1.65]"
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
        {thinking && (
          <p className="mt-1 flex items-center gap-2 border-l-2 border-[#30d158]/50 pl-2.5 text-[#8fe0aa]">
            <span className="inline-flex gap-1">
              <span className="h-1 w-1 animate-bounce rounded-full bg-current" />
              <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:120ms]" />
              <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:240ms]" />
            </span>
            ziad-ai is thinking
          </p>
        )}

        <form
          onSubmit={e => {
            e.preventDefault()
            const text = value
            setValue('')
            run(text)
          }}
          className="mt-auto flex items-center gap-2 pt-2"
        >
          <span className={`whitespace-nowrap ${mode === 'live' ? 'text-[#8fe0aa]' : 'text-[#8be9a8]'}`}>
            {mode === 'live' ? 'you ›' : 'ziad@mac ~ %'}
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => {
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
                setLines([])
              }
            }}
            aria-label="Ask Ziad's AI agent or type a command"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            placeholder={mode === 'live' ? 'Ask anything about Ziad…' : 'Ask a question, or type /help'}
            className="w-full bg-transparent font-mono text-[12px] text-[#f2f2f2] caret-[#8be9a8] placeholder:text-white/30 focus:outline-none"
          />
        </form>
      </div>

      {lines.length <= WELCOME.length + 4 && !thinking && (
        <div className="flex flex-none flex-wrap gap-1.5 border-t border-white/10 px-3 py-2">
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
      )}

      <div className="flex flex-none items-center justify-between gap-3 border-t border-white/10 px-4 py-1.5 font-mono text-[10px] text-white/40">
        <span>zsh · ziad-ai · UTF-8</span>
        <span className="truncate">{agent?.configured ? 'Gemini · server-side key' : 'local profile fallback'}</span>
      </div>
    </div>
  )
}
