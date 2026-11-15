import { CONFIG } from '../config'

const EXTRA = [
  {
    category: 'Working with people',
    items: ['Teaching', 'Peer tutoring', 'Team contests', 'Leading a small team', 'Explaining technical work'],
  },
  {
    category: 'Languages',
    items: ['Arabic — native', 'English — fluent'],
  },
]

export default function Skills({ onOpenApp }) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b border-[var(--line)] bg-[var(--win-2)] px-6 py-4">
        <div className="flex items-center gap-3">
          <img src="images/icons/terminal.png" alt="" className="h-9 w-9 object-contain" />
          <div>
            <h1 className="text-[20px] font-semibold tracking-[-0.02em]">Skills</h1>
            <p className="text-[11.5px] text-[var(--dim)]">What I actually use, not a wall of logos.</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenApp('terminal')}
            className="ml-auto rounded-[6px] bg-[#0a84ff] px-3 py-1 text-[11.5px] font-semibold text-white hover:brightness-110"
          >
            Ask the agent
          </button>
        </div>
      </div>

      <div className="grid gap-3 px-6 py-5 sm:grid-cols-2">
        {[...CONFIG.tech, ...EXTRA].map(group => (
          <section key={group.category} className="rounded-[10px] border border-[var(--line)] p-4">
            <h2 className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--dim)]">
              {group.category}
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {group.items.map(item => (
                <span
                  key={item}
                  className="rounded-full border border-[var(--line)] bg-[var(--win-2)] px-2.5 py-1 text-[11.5px]"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="px-6 pb-6">
        <p className="rounded-[9px] bg-[var(--win-2)] p-3 text-[11.5px] leading-relaxed text-[var(--dim)]">
          The honest version: strongest in Python and computer vision, comfortable in C++/Arduino and
          React, and still learning something every time a project leaves the bench.
        </p>
      </div>
    </div>
  )
}
