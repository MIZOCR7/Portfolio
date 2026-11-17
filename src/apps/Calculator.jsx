import { useEffect, useState } from 'react'

const KEYS = [
  { label: 'AC', kind: 'function', action: 'clear' },
  { label: '±', kind: 'function', action: 'sign' },
  { label: '%', kind: 'function', action: 'percent' },
  { label: '÷', kind: 'operator', action: 'divide' },
  { label: '7', kind: 'number', action: '7' },
  { label: '8', kind: 'number', action: '8' },
  { label: '9', kind: 'number', action: '9' },
  { label: '×', kind: 'operator', action: 'multiply' },
  { label: '4', kind: 'number', action: '4' },
  { label: '5', kind: 'number', action: '5' },
  { label: '6', kind: 'number', action: '6' },
  { label: '−', kind: 'operator', action: 'subtract' },
  { label: '1', kind: 'number', action: '1' },
  { label: '2', kind: 'number', action: '2' },
  { label: '3', kind: 'number', action: '3' },
  { label: '+', kind: 'operator', action: 'add' },
  { label: '0', kind: 'number', action: '0', wide: true },
  { label: '.', kind: 'number', action: 'decimal' },
  { label: '=', kind: 'operator', action: 'equals' },
]

const OP_SYMBOL = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
}

function calculate(left, right, operator) {
  switch (operator) {
    case 'add':
      return left + right
    case 'subtract':
      return left - right
    case 'multiply':
      return left * right
    case 'divide':
      return right === 0 ? NaN : left / right
    default:
      return right
  }
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return 'Error'
  if (Object.is(value, -0)) return '0'
  const rounded = Number(value.toPrecision(12))
  const text = String(rounded)
  if (text.length <= 14) return text
  return rounded.toExponential(6)
}

function Key({ item, onClick, active }) {
  const base =
    'flex h-full min-h-[42px] w-full items-center rounded-[13px] text-[21px] font-medium leading-none transition-all duration-100 active:scale-[0.96] select-none'
  const style =
    item.kind === 'operator'
      ? item.action === 'equals'
        ? 'bg-[#ff9f0a] text-white shadow-[0_6px_20px_rgba(255,159,10,0.28)] hover:bg-[#ffb340]'
        : `bg-[#ff9f0a] text-white hover:bg-[#ffb340] ${active ? 'ring-2 ring-white/45 ring-offset-2 ring-offset-[#1c1c1e]' : ''}`
      : item.kind === 'function'
        ? 'bg-[#a5a5a5] text-black hover:bg-[#b8b8b8] dark:bg-[#5c5c5e] dark:text-white dark:hover:bg-[#6c6c6e]'
        : 'bg-[#333336] text-white hover:bg-[#414144]'
  return (
    <button
      type="button"
      onClick={() => onClick(item.action)}
      className={`${base} ${style} ${item.wide ? 'col-span-2 justify-start pl-[30px]' : 'justify-center'}`}
      aria-label={item.label}
    >
      {item.label}
    </button>
  )
}

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [stored, setStored] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waiting, setWaiting] = useState(false)
  const [equation, setEquation] = useState('')

  function inputDigit(digit) {
    setEquation('')
    if (waiting || display === '0' || display === 'Error') {
      setDisplay(digit)
      setWaiting(false)
      return
    }
    if (display.replace(/[-.]/g, '').length >= 12) return
    setDisplay(current => `${current}${digit}`)
  }

  function inputDecimal() {
    if (waiting || display === 'Error') {
      setDisplay('0.')
      setWaiting(false)
      return
    }
    if (!display.includes('.')) setDisplay(current => `${current}.`)
  }

  function chooseOperator(nextOperator) {
    const input = Number(display)
    if (operator && stored !== null && !waiting) {
      const result = calculate(stored, input, operator)
      if (!Number.isFinite(result)) {
        setDisplay('Error')
        setStored(null)
        setOperator(null)
        setWaiting(true)
        setEquation('')
        return
      }
      setStored(result)
      setDisplay(formatNumber(result))
      setEquation(`${formatNumber(result)} ${OP_SYMBOL[nextOperator]}`)
    } else {
      setStored(input)
      setEquation(`${formatNumber(input)} ${OP_SYMBOL[nextOperator]}`)
    }
    setOperator(nextOperator)
    setWaiting(true)
  }

  function equals() {
    if (operator === null || stored === null) return
    const input = Number(display)
    const result = calculate(stored, input, operator)
    setEquation(`${formatNumber(stored)} ${OP_SYMBOL[operator]} ${formatNumber(input)} =`)
    setDisplay(formatNumber(result))
    setStored(null)
    setOperator(null)
    setWaiting(true)
  }

  function clear() {
    setDisplay('0')
    setStored(null)
    setOperator(null)
    setWaiting(false)
    setEquation('')
  }

  function toggleSign() {
    if (display === '0' || display === 'Error') return
    setDisplay(current => (current.startsWith('-') ? current.slice(1) : `-${current}`))
  }

  function percent() {
    const value = Number(display)
    if (!Number.isFinite(value)) return
    const result = operator && stored !== null ? (stored * value) / 100 : value / 100
    setDisplay(formatNumber(result))
    setWaiting(false)
  }

  function backspace() {
    if (waiting || display === 'Error') {
      clear()
      return
    }
    setDisplay(current => {
      if (current.length <= 1 || (current.length === 2 && current.startsWith('-'))) return '0'
      return current.slice(0, -1)
    })
  }

  function handleAction(action) {
    if (/^\d$/.test(action)) {
      inputDigit(action)
      return
    }
    switch (action) {
      case 'decimal':
        inputDecimal()
        break
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        chooseOperator(action)
        break
      case 'equals':
        equals()
        break
      case 'clear':
        clear()
        break
      case 'sign':
        toggleSign()
        break
      case 'percent':
        percent()
        break
      default:
        break
    }
  }

  useEffect(() => {
    const onKeyDown = event => {
      const key = event.key
      if (/^\d$/.test(key)) {
        event.preventDefault()
        inputDigit(key)
        return
      }
      const map = {
        '.': 'decimal',
        ',': 'decimal',
        '+': 'add',
        '-': 'subtract',
        '*': 'multiply',
        x: 'multiply',
        X: 'multiply',
        '/': 'divide',
        Enter: 'equals',
        '=': 'equals',
        Escape: 'clear',
        c: 'clear',
        C: 'clear',
        '%': 'percent',
      }
      if (key === 'Backspace') {
        event.preventDefault()
        backspace()
        return
      }
      if (map[key]) {
        event.preventDefault()
        handleAction(map[key])
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const activeOperator = operator && waiting ? operator : null
  const fontSize = display.length > 11 ? 'text-[36px]' : display.length > 8 ? 'text-[44px]' : 'text-[54px]'

  return (
    <div className="flex h-full flex-col bg-[#1c1c1e] text-white">
      <div className="flex flex-none items-end justify-end px-4 pb-3 pt-5 sm:px-5">
        <div className="flex min-w-0 flex-1 flex-col items-end">
          <p className="h-4 max-w-full truncate text-[12px] tabular-nums text-white/35">{equation || '\u00a0'}</p>
          <p
            aria-live="polite"
            className={`mt-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-light leading-none tracking-[-0.045em] tabular-nums ${fontSize}`}
          >
            {display}
          </p>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-4 grid-rows-5 gap-[7px] px-3 pb-3 pt-1 sm:gap-2 sm:px-4 sm:pb-4">
        {KEYS.map(item => {
          const isActive = activeOperator && item.action === activeOperator
          return (
            <Key key={item.label} item={item} active={isActive} onClick={handleAction} />
          )
        })}
      </div>
    </div>
  )
}
