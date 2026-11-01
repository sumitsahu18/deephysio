import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { servicesApi } from '../api/endpoints'
import useFetch from '../hooks/useFetch'
import Logo from './Logo'

// PDF 2.2 Site Structure: Home | About & Team | Services / Treatments | Contact & Booking Enquiry
// Mingara style: white header, logo left, bold dark menu, Services dropdown
const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About & Team' },
  { to: '/services', label: 'Services', dropdown: true },
  { to: '/contact', label: 'Contact Us' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [subOpen, setSubOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { data: services } = useFetch(servicesApi.list)
  const sorted = [...(services || [])].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  useEffect(() => {
    setOpen(false)
    setSubOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    `nav-underline flex items-center gap-1 px-3 py-2 text-[17px] font-bold transition xl:px-5 ${
      isActive ? 'active text-pine-700' : 'text-ink hover:text-pine-700'
    }`

  return (
    <header className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      {/* Scroll par header chhota ho jata hai (Mingara sticky header jaisa) */}
      <nav className={`container-x flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-20' : 'h-24 sm:h-[118px]'}`} aria-label="Main">
        <Logo />

        <ul className="hidden items-center lg:flex">
          {links.map((l) =>
            l.dropdown ? (
              <li key={l.to} className="group relative">
                <NavLink to={l.to} className={linkClass}>
                  {l.label} <ChevronDown className="size-4 transition duration-300 group-hover:rotate-180" />
                </NavLink>
                <div className="invisible absolute top-full left-0 w-72 translate-y-3 pt-3 opacity-0 transition duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <ul className="overflow-hidden rounded-md border-t-4 border-clay bg-white py-2 shadow-xl">
                    {sorted.map((s) => (
                      <li key={s._id}>
                        <Link
                          to={`/services/${s.slug}`}
                          className="block px-5 py-2.5 text-[15px] font-medium text-ink transition hover:bg-pine-50 hover:pl-7 hover:text-pine-700"
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ) : (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === '/'} className={linkClass}>
                  {l.label}
                </NavLink>
              </li>
            ),
          )}
        </ul>

        <button
          className="grid size-12 place-items-center rounded-md text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="size-7" /> : <Menu className="size-7" />}
        </button>
      </nav>

      {/* Mobile menu (slide down) */}
      <div className={`grid border-t border-line bg-white transition-all duration-300 lg:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr] border-t-0'}`}>
        <div className="overflow-hidden">
          <ul className="container-x py-3">
            {links.map((l) => (
              <li key={l.to} className="border-b border-line/70 last:border-0">
                {l.dropdown ? (
                  <>
                    <button onClick={() => setSubOpen((v) => !v)} className="flex w-full items-center justify-between py-3.5 text-base font-bold" aria-expanded={subOpen}>
                      {l.label} <ChevronDown className={`size-5 transition ${subOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {subOpen && (
                      <ul className="pb-3 pl-3">
                        <li>
                          <Link to="/services" className="block py-2 text-sm font-semibold text-pine-700">All services</Link>
                        </li>
                        {sorted.map((s) => (
                          <li key={s._id}>
                            <Link to={`/services/${s.slug}`} className="block py-2 text-sm text-ink">{s.title}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => `block py-3.5 text-base font-bold ${isActive ? 'text-pine-700' : 'text-ink'}`}>
                    {l.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
