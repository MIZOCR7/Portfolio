const GROUPS = [
  {
    title: 'Desktop',
    items: [
      ['Double-click a folder', 'Open any of the six desktop folders'],
      ['Enter / Space', 'Open the selected item'],
      ['Arrow keys', 'Nudge the selected item'],
      ['Drag an item', 'Move it and remember the spot'],
      ['Tab', 'Move between folders, terminal and the dock'],
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
      ['⌘ T / Ctrl T', 'Open the AI Terminal'],
      ['⌘ 1 / Ctrl 1', 'Open Projects'],
      ['⌘ 2 / Ctrl 2', 'Open Mail'],
      ['F4', 'Launchpad'],
    ],
  },
  {
    title: 'AI Terminal',
    items: [
      ['/help', 'Commands and examples'],
      ['/live', 'Start a live conversation'],
      ['/exit', 'Leave live mode'],
      ['/clear or ⌘ L', 'Clear the screen'],
      ['Any question', 'Sent to the Gemini agent'],
    ],
  },
]

export default function Shortcuts() {
  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <h1 className="text-[20px] font-semibold tracking-[-0.02em]">Keyboard shortcuts</h1>
      <p className="mt-1 max-w-[58ch] text-[12.5px] leading-relaxed text-[var(--dim)]">
        The desktop is fully usable without a mouse. Every folder and window is reachable from
        Spotlight, and the AI Terminal opens with ⌘T.
      </p>

      <div className="mt-5 space-y-5">
        {GROUPS.map(group => (
          <section key={group.title}>
            <h2 className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--dim)]">
              {group.title}
            </h2>
            <dl className="overflow-hidden rounded-[8px] border border-[var(--line)]">
              {group.items.map(([k, v], i) => (
                <div
                  key={k}
                  className={`flex items-center justify-between gap-4 px-3.5 py-2 text-[12.5px] ${i % 2 ? 'bg-[var(--win-2)]' : ''}`}
                >
                  <dt className="font-mono text-[11.5px]">{k}</dt>
                  <dd className="text-right text-[var(--dim)]">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <p className="mt-5 rounded-[8px] bg-[var(--win-2)] p-3 text-[11.5px] leading-relaxed text-[var(--dim)]">
        Prefer calm? Control Centre (top-right of the menu bar) can turn off the dock zoom, or choose a
        different wallpaper. The site also honours your system’s “reduce motion” setting.
      </p>
    </div>
  )
}
