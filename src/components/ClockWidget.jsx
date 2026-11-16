import { CONFIG } from '../config'

export default function ClockWidget({ clock }) {
  return (
    <aside
      aria-label="Clock and current focus"
      className="pointer-events-none absolute right-4 top-10 z-[5] hidden w-[220px] select-none rounded-[20px] border border-white/25 bg-black/25 p-4 text-white shadow-[0_20px_45px_rgba(0,0,0,0.28)] backdrop-blur-2xl min-[1024px]:block"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">{CONFIG.site.location.split(',')[0]}</p>
      <p className="mt-1 text-[46px] font-semibold leading-none tracking-[-0.04em] tabular-nums">{clock.time}</p>
      <p className="mt-1.5 text-[13px] font-medium text-white/85">{clock.long}</p>
      <div className="my-3 h-px bg-white/20" />
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/55">Now</p>
      <p className="mt-1 text-[13px] font-medium leading-snug">Building Pipe Inspector — a rover that finds corrosion inside pipes.</p>
    </aside>
  )
}
