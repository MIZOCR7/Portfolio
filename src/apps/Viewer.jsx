import Media from '../components/Media'

export default function Viewer({ item }) {
  return (
    <figure className="flex h-full flex-col bg-[#101114]">
      <div className="flex min-h-0 flex-1 items-center justify-center p-3">
        <Media
          src={item.src}
          alt={item.title}
          className="max-h-full max-w-full object-contain"
          fallback={<span className="p-10 text-[13px] text-white/55">This image could not be loaded.</span>}
        />
      </div>
      <figcaption className="flex-none border-t border-white/10 px-5 py-3 text-white">
        <p className="text-[13px] font-semibold">{item.title}</p>
        {item.meta && <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-white/50">{item.meta}</p>}
        {item.note && <p className="mt-1.5 max-w-[70ch] text-[11.5px] leading-relaxed text-white/65">{item.note}</p>}
      </figcaption>
    </figure>
  )
}
