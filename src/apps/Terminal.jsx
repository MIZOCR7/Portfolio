import { useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'

const WELCOME = [
  'Last login: today on ttys001',
  "Type `help` to see what this terminal can do.",
  '',
]

export default function Terminal({ onOpenProject, onOpenApp }) {
  const [lines, setLines] = useState(WELCOME)
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [hIndex, setHIndex] = useState(-1)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [lines])

  const out = (next, clear = false) => {
    setLines(prev => (clear ? next : [...prev, ...next]))
  }

  const run = raw => {
    const input = raw.trim()
    if (!input) return
    setHistory(h => [...h, input])
    setHIndex(-1)
    const [cmd, ...rest] = input.split(/\s+/)
    const arg = rest.join(' ')
    const next = [`ziad@mac ~ % ${input}`]

    switch (cmd.toLowerCase()) {
      case 'help':
        next.push(
          'Available commands:',
          '  whoami            who is behind this desktop',
          '  projects          list projects',
          '  open <project>    open a project window',
          '  work              open the Work window',
          '  contact           email and profiles',
          '  social            open the social window',
          '  resume            open the résumé',
          '  date              current date and time',
          '  clear             clear the terminal'
        )
        break
      case 'whoami':
        next.push(
          `${CONFIG.site.fullName}`,
          `${CONFIG.site.role} · ${CONFIG.site.location}`,
          `${CONFIG.site.status} · ${CONFIG.site.school}`
        )
        break
      case 'projects':
        next.push(
          ...CONFIG.projects.map((p, i) => `  ${String(i + 1).padStart(2, '0')}  ${p.id.padEnd(10)} ${p.title} — ${p.kind}`)
        )
        break
      case 'ls':
        next.push('Applications   Desktop   Documents   Downloads   Projects   Résumé')
        break
      case 'open': {
        const project = CONFIG.projects.find(p => p.id === arg.toLowerCase() || p.title.toLowerCase() === arg.toLowerCase())
        if (project) {
          next.push(`Opening ${project.title}…`)
          onOpenProject(project.id)
        } else {
          next.push(arg ? `No project named “${arg}”. Try \`projects\`.` : 'Usage: open <project-id>')
        }
        break
      }
      case 'work':
        next.push('Opening Work…')
        onOpenApp('work')
        break
      case 'contact':
        next.push(`email     ${CONFIG.site.email}`, `github    ${CONFIG.site.github}`, `linkedin  ${CONFIG.site.linkedin}`)
        break
      case 'social':
        next.push('Opening Social…')
        onOpenApp('social')
        break
      case 'resume':
        next.push('Opening Résumé…')
        onOpenApp('resume')
        break
      case 'date':
        next.push(new Date().toLocaleString('en-GB', { timeZone: CONFIG.site.timezone }))
        break
      case 'clear':
        out([], true)
        return
      case 'sudo':
        next.push('Nice try. This desktop has no root — only a portfolio.')
        break
      default:
        next.push(`zsh: command not found: ${cmd}. Try \`help\`.`)
    }
    next.push('')
    out(next)
  }

  return (
    <div className="flex h-full flex-col bg-[#161719] text-[#e8e8e8]">
      <div
        ref={bodyRef}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-3 font-mono text-[12px] leading-[1.65]"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <p key={i} className={line.startsWith('ziad@mac') ? 'text-[#8be9a8]' : 'text-[#d8d8d8]/90'}>
            {line || '\u00A0'}
          </p>
        ))}
        <form
          onSubmit={e => {
            e.preventDefault()
            run(value)
            setValue('')
          }}
          className="flex items-center gap-2"
        >
          <span className="whitespace-nowrap text-[#8be9a8]">ziad@mac ~ %</span>
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
            }}
            aria-label="Terminal command"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            className="w-full bg-transparent font-mono text-[12px] text-[#f2f2f2] caret-[#8be9a8] focus:outline-none"
          />
        </form>
      </div>
      <div className="flex-none border-t border-white/10 px-4 py-1.5 font-mono text-[10.5px] text-white/45">
        zsh · {CONFIG.site.location} · UTF-8
      </div>
    </div>
  )
}
