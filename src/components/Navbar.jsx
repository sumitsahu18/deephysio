import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { useSite } from '../context/SiteContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About & Team' },
  { to: '/services', label: 'Treatments' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

export function Logo({ name }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label={`${name} home`}>
      <span className="grid size-9 place-items-center rounded-xl bg-pine-700 font-display text-lg font-semibold text-sand">
        D
      </span>
      <span className="font-display text-xl font-semibold text-ink">{name}</span>
    </Link>
  )
}

export default function Navbar() {
  const { settings } = useSite()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition ${
        scrolled ? 'border-b border-line bg-cream/90 backdrop-blur' : 'bg-cream'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between sm:h-20" aria-label="Main">
        <Logo name={settings.clinicName} />

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-pine-50 text-pine-700' : 'text-ink/80 hover:text-pine-700'
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={`tel:${settings.phoneHref}`} className="flex items-center gap-2 text-sm font-semibold text-pine-700">
            <Phone className="size-4" /> {settings.phone}
          </a>
          <Link to="/contact" className="btn-primary">
            Book / Enquire
          </Link>
        </div>

        <button
          className="grid size-11 place-items-center rounded-full text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`overflow-hidden border-t border-line bg-cream transition-all lg:hidden ${open ? 'max-h-96' : 'max-h-0 border-t-0'}`}>
        <ul className="container-x flex flex-col py-3">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-3 text-base font-medium ${isActive ? 'bg-pine-50 text-pine-700' : 'text-ink'}`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
          <li className="pt-2">
            <Link to="/contact" className="btn-primary w-full">
              Book / Enquire
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}
