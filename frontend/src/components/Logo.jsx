import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'

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
      <path d="M24 20v24h6a12 12 0 0 0 0-24z" fill="none" style={{ stroke: light ? 'var(--color-text)' : '#1b4467' }} strokeWidth="4" strokeLinejoin="round" />
    </svg>
  )
}

// Admin > General Settings > Logo se upload kiya logo ho to wahi dikhega, warna ye default logo.
export default function Logo({ light = false, to = '/', small = false }) {
  const site = useSite()
  const logoUrl = site?.settings?.logoUrl
  const name = site?.settings?.clinicName || 'DeePhysio'

  if (logoUrl)
    return (
      <Link to={to} className="flex min-w-0 items-center" aria-label={`${name} home`}>
        <img
          src={logoUrl}
          alt={name}
          className={`w-auto object-contain object-left ${small ? 'h-9 max-w-[140px] min-[360px]:h-11 min-[360px]:max-w-[170px]' : 'h-12 max-w-[200px] sm:h-14 sm:max-w-[240px]'}`}
        />
      </Link>
    )

  return (
    <Link to={to} className="flex min-w-0 items-center gap-2" aria-label={`${name} home`}>
      <Mark light={light} className={`shrink-0 ${small ? 'size-9 min-[360px]:size-11' : 'size-14 sm:size-16'}`} />
      <span className="leading-none whitespace-nowrap">
        <span className={`block tracking-tight ${small ? 'text-lg min-[360px]:text-xl' : 'text-2xl sm:text-[1.75rem]'} ${light ? 'text-white' : 'text-ink'}`}>
          dee<span className={`font-bold ${light ? 'text-white' : 'text-pine-700'}`}>physio</span>
        </span>
        <span className={`mt-1 font-medium uppercase ${small ? 'hidden text-[8px] tracking-[0.18em] min-[380px]:block' : 'block text-[9px] tracking-[0.22em] sm:text-[10px]'} ${light ? 'text-white/70' : 'text-muted'}`}>
          Physiotherapy clinic
        </span>
      </span>
    </Link>
  )
}
