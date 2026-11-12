export default function TurkishFlag({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 80"
      role="img"
      aria-label="Flag of Türkiye"
      preserveAspectRatio="none"
    >
      <rect width="120" height="80" fill="#E30A17" />
      <circle cx="44" cy="40" r="17" fill="#fff" />
      <circle cx="51" cy="40" r="13.6" fill="#E30A17" />
      <g fill="#fff" transform="translate(68 40)">
        <polygon points="0,-9.4 2.76,-2.9 9.4,-2.9 4.06,0.9 6.1,7.6 0,3.6 -6.1,7.6 -4.06,0.9 -9.4,-2.9 -2.76,-2.9" />
      </g>
    </svg>
  )
}
