export default function Love() {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#160b12] text-white">
      <div
        className="absolute inset-[-20%] scale-110 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, rgba(255, 91, 137, 0.62), transparent 34%), radial-gradient(circle at 72% 72%, rgba(255, 45, 85, 0.48), transparent 36%), radial-gradient(circle at 50% 50%, rgba(122, 24, 66, 0.6), transparent 55%)',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#160b12]/35 backdrop-blur-3xl" aria-hidden="true" />
      <div className="relative mx-5 w-full max-w-[430px] overflow-hidden rounded-[22px] border border-white/15 bg-white/[0.07] px-7 py-9 text-center shadow-[0_30px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" aria-hidden="true" />
        <img
          src="images/icons/love.svg"
          alt=""
          className="mx-auto h-20 w-20 drop-shadow-[0_12px_26px_rgba(255,45,85,0.35)]"
          draggable={false}
        />
        <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/45">Private · kept under wraps</p>
        <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.05em]">Coming soon.</h1>
        <p className="mx-auto mt-2 max-w-[32ch] text-[11.5px] leading-relaxed text-white/55">
          Something made with love is still being put together. This one is for someone special — no peeking yet.
        </p>
        <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/15 px-3 py-1.5 text-[9.5px] font-medium text-white/55">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3 w-3" aria-hidden="true">
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          Locked for now
        </div>
      </div>
    </div>
  )
}
