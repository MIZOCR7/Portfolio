const TOOLS = [
  'PYTORCH',
  'CUDA',
  'HUGGING FACE',
  'LLM ORCHESTRATION',
  'RAG PIPELINES',
  'LANGCHAIN',
  'VLLM',
  'TRANSFORMERS',
  'NEURAL ARCHITECTURE',
  'MLOPS',
  'VECTOR DATABASES',
  'AGENTIC LOOPS',
]

export default function Marquee() {
  return (
    <section className="relative w-full bg-black border-y border-white/5 py-6 overflow-hidden">
      {/* Top fade */}
      <div className="marquee-wrapper">
        <div className="flex items-center animate-marquee whitespace-nowrap will-change-transform">
          {/* Render twice to create seamless loop */}
          {[0, 1].map(n => (
            <span key={n} className="inline-flex items-center shrink-0">
              {TOOLS.map((tool, i) => (
                <span key={i} className="inline-flex items-center">
                  <span className="text-[11px] md:text-xs tracking-[0.4em] text-gray-500 uppercase font-inter font-medium px-1">
                    {tool}
                  </span>
                  <span className="text-gray-700 mx-4 text-xs font-inter">//</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
