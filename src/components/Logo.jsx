import { Link } from 'react-router-dom'

// Dotted-ring logo (Mingara jaisa style, lekin DeePhysio ka apna). Client ka asli logo aaye to
// yahan <img src="/logo.png" /> laga dena.
function Mark({ className = '', light = false }) {
  const dots = Array.from({ length: 22 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 26 + Math.PI * 0.62
    const r = 26
    return { x: 32 + Math.cos(a) * r, y: 32 + Math.sin(a) * r, s: 1.6 + (i % 7) * 0.45, o: 0.45 + (i % 5) * 0.12 }
  })
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.s} fill={i % 3 ? '#336c9b' : '#1fa3c6'} opacity={d.o} />
      ))}
      <path d="M24 20v24h6a12 12 0 0 0 0-24z" fill="none" stroke={light ? '#ffffff' : '#1b4467'} strokeWidth="4" strokeLinejoin="round" />
    </svg>
  )
}

export default function Logo({ light = false, to = '/', small = false }) {
  return (
    <Link to={to} className="flex min-w-0 items-center gap-2" aria-label="DeePhysio home">
      <Mark light={light} className={`shrink-0 ${small ? 'size-11' : 'size-14 sm:size-16'}`} />
      <span className="leading-none whitespace-nowrap">
        <span className={`block tracking-tight ${small ? 'text-xl' : 'text-2xl sm:text-[1.75rem]'} ${light ? 'text-white' : 'text-ink'}`}>
          dee<span className={`font-bold ${light ? 'text-white' : 'text-pine-700'}`}>physio</span>
        </span>
        <span className={`mt-1 block font-medium uppercase ${small ? 'text-[8px] tracking-[0.18em]' : 'text-[9px] tracking-[0.22em] sm:text-[10px]'} ${light ? 'text-white/70' : 'text-muted'}`}>
          Physiotherapy clinic
        </span>
      </span>
    </Link>
  )
}
