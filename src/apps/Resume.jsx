import { CONFIG } from '../config'

const Section = ({ title, children }) => (
  <section className="mt-5">
    <h2 className="mb-2 border-b border-[var(--line)] pb-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--dim)]">{title}</h2>
    {children}
  </section>
)

export default function Resume() {
  const { site } = CONFIG
  return (
    <div className="h-full overflow-y-auto bg-[var(--win-2)]">
      <div className="flex flex-none items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--win)] px-4 py-2">
        <p className="text-[11.5px] text-[var(--dim)]">One page · updated {site.updated}</p>
        <div className="flex items-center gap-2">
          <a
            href={`mailto:${site.email}?subject=R%C3%A9sum%C3%A9%20request`}
            className="rounded-[6px] px-2.5 py-1 text-[11.5px] font-medium text-[var(--dim)] hover:bg-[var(--hover)]"
          >
            Email
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-[6px] bg-[#0a84ff] px-3 py-1 text-[11.5px] font-medium text-white hover:brightness-110"
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      <article className="resume-print mx-auto my-4 max-w-[720px] bg-white px-8 py-8 text-[#1a1a1a] shadow-sm sm:px-10 sm:py-9">
        <header className="border-b-2 border-[#1a1a1a] pb-3">
          <h1 className="text-[26px] font-bold tracking-[-0.02em]">{site.fullName}</h1>
          <p className="text-[12.5px] font-medium text-[#444]">{site.role} · {site.location}</p>
          <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-[#555]">
            <a href={`mailto:${site.email}`} className="underline decoration-[#bbb] underline-offset-2">{site.email}</a>
            <a href={site.github} className="underline decoration-[#bbb] underline-offset-2">github.com/MIZOCR7</a>
            <a href={site.linkedin} className="underline decoration-[#bbb] underline-offset-2">linkedin.com/in/ziad-emad</a>
          </p>
        </header>

        <Section title="Profile">
          <p className="text-[11.5px] leading-[1.6] text-[#333]">
            Grade 12 student at STEM High School for Boys building computer vision that has to work outside a
            notebook — a rover that finds corrosion inside pipes, a pest-detection system for farms, and a
            greenhouse that reports on itself. ISEF Egypt finalist 2026.
          </p>
        </Section>

        <Section title="Education">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-[12.5px] font-semibold">STEM High School for Boys — 6th of October</h3>
            <span className="font-mono text-[10.5px] text-[#666]">2023—2026</span>
          </div>
          <p className="mt-0.5 text-[11.5px] leading-[1.55] text-[#444]">
            Admitted at 15 — 98% on the entrance exam, ranked 245 of roughly 40,000 candidates. Focus on
            computer science, embedded systems and applied mathematics.
          </p>
        </Section>

        <Section title="Selected projects">
          {CONFIG.projects.slice(0, 5).map(p => (
            <div key={p.id} className="mb-2.5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[12.5px] font-semibold">
                  {p.title} <span className="font-normal text-[#555]">— {p.role}</span>
                </h3>
                <span className="whitespace-nowrap font-mono text-[10.5px] text-[#666]">{p.year}</span>
              </div>
              <p className="mt-0.5 text-[11.5px] leading-[1.5] text-[#444]">{p.summary}</p>
            </div>
          ))}
        </Section>

        <Section title="Experience & leadership">
          <div className="space-y-2">
            {CONFIG.about.timeline.slice(2).map(item => (
              <div key={item.what}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[12px] font-semibold">{item.what}</h3>
                  <span className="whitespace-nowrap font-mono text-[10.5px] text-[#666]">{item.year}</span>
                </div>
                <p className="text-[11.5px] leading-[1.5] text-[#444]">{item.sub}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Honours">
          <ul className="list-disc space-y-0.5 pl-4 text-[11.5px] leading-[1.5] text-[#333]">
            <li>ISEF-affiliated Egypt Science & Engineering Fair — national finalist, 2026</li>
            <li>ICPC Egyptian Teens — 31st place, online qualification, 2026</li>
            <li>NASA Space Apps Challenge — “Galactic Problem Solver”, 2025</li>
            <li>IBM Machine Learning — professional certificate, 2025</li>
            <li>Physics Brawl Online — team place 324, category C, 2024</li>
          </ul>
        </Section>

        <Section title="Skills">
          <p className="text-[11.5px] leading-[1.6] text-[#333]">
            <strong>Modelling:</strong> Python, PyTorch, Ultralytics YOLO, OpenCV, NumPy, RAG and embeddings.
            <br />
            <strong>Robotics:</strong> C++, Arduino, ESP32, motor drivers, sensors, drone platforms.
            <br />
            <strong>Software:</strong> React, TypeScript, HTML/CSS, Node, Git, Vercel.
            <br />
            <strong>Languages:</strong> Arabic (native), English (fluent).
          </p>
        </Section>

        <p className="mt-6 border-t border-[#ddd] pt-2 text-[9.5px] text-[#777]">
          A PDF copy is available on request — {site.email}. This page can be printed with “Save as PDF”.
        </p>
      </article>
    </div>
  )
}
