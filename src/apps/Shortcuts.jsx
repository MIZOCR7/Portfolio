const GROUPS = [
  {
    title: 'Desktop',
    items: [
      ['Double-click a cover', 'Open that project'],
      ['Enter / Space', 'Open the selected cover'],
      ['Arrow keys', 'Nudge the selected cover'],
      ['Drag a cover', 'Move it and remember the spot'],
      ['Tab', 'Move between covers and the dock'],
    ],
  },
  {
    title: 'Windows',
    items: [
      ['Esc', 'Close the front window'],
      ['⌘ W / Ctrl W', 'Close the front window'],
      ['⌘ M / Ctrl M', 'Minimise the front window'],
      ['Double-click title bar', 'Zoom or restore'],
      ['Drag the title bar', 'Move the window'],
    ],
  },
  {
    title: 'Everywhere',
    items: [
      ['⌘ K / Ctrl K', 'Spotlight search'],
      ['⌘ Space', 'Spotlight search'],
      ['F4', 'Launchpad'],
      ['⌘ 1 / Ctrl 1', 'Open Work'],
      ['⌘ 2 / Ctrl 2', 'Open Mail'],
    ],
  },
]

export default function Shortcuts() {
  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <h1 className="text-[20px] font-semibold tracking-[-0.02em]">Keyboard shortcuts</h1>
      <p className="mt-1 max-w-[58ch] text-[12.5px] leading-relaxed text-[var(--dim)]">
        The desktop is fully usable without a mouse. Every window is reachable from Spotlight, and every cover
        opens with the keyboard.
      </p>

      <div className="mt-5 space-y-5">
        {GROUPS.map(group => (
          <section key={group.title}>
            <h2 className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--dim)]">{group.title}</h2>
            <dl className="overflow-hidden rounded-[8px] border border-[var(--line)]">
              {group.items.map(([k, v], i) => (
                <div key={k} className={`flex items-center justify-between gap-4 px-3.5 py-2 text-[12.5px] ${i % 2 ? 'bg-[var(--win-2)]' : ''}`}>
                  <dt className="font-mono text-[11.5px]">{k}</dt>
                  <dd className="text-right text-[var(--dim)]">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <p className="mt-5 rounded-[8px] bg-[var(--win-2)] p-3 text-[11.5px] leading-relaxed text-[var(--dim)]">
        Prefer calm? Control Centre (top-right of the menu bar) can turn off the dock zoom, or choose a different
        wallpaper. The site also honours your system’s “reduce motion” setting.
      </p>
    </div>
  )
}
