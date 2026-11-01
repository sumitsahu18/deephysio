import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, Lock, LayoutDashboard } from 'lucide-react'
import { servicesApi } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import useFetch from '../hooks/useFetch'
import Logo from './Logo'

// PDF 2.2 Site Structure + FAQ: Home | About & Team | Services | FAQ | Contact  ...  [Staff Login]
// Mingara style: white header, logo left, bold dark menu, Services dropdown
const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About & Team' },
  { to: '/services', label: 'Services', dropdown: true },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact Us' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [subOpen, setSubOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { isAuthenticated } = useAuth()
  const { data: services } = useFetch(servicesApi.list)
  const sorted = [...(services || [])].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  useEffect(() => {
    setOpen(false)
    setSubOpen(false)
  }, [pathname])

  // Mobile menu khula ho to peeche ka page scroll na ho
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Header ki HEIGHT kabhi nahi badalti (pehle 118px -> 80px shrink hota tha, usi se page
  // jhatke khata tha). Scroll par sirf shadow aati hai. rAF se smooth.
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 10)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    `nav-underline flex items-center gap-1 px-2.5 py-2 text-[16px] font-bold transition-colors xl:px-4 xl:text-[17px] ${
      isActive ? 'active text-pine-700' : 'text-ink hover:text-pine-700'
    }`

  const staff = isAuthenticated
    ? { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard }
    : { to: '/admin/login', label: 'Staff Login', Icon: Lock }

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-none'}`}>
      <nav className="container-x flex h-20 items-center justify-between gap-4 sm:h-24" aria-label="Main">
        <div className="shrink-0">
          <Logo />
        </div>

        <div className="hidden items-center gap-2 lg:flex xl:gap-4">
          <ul className="flex items-center">
            {links.map((l) =>
              l.dropdown ? (
                <li key={l.to} className="group relative">
                  <NavLink to={l.to} className={linkClass}>
                    {l.label} <ChevronDown className="size-4 transition-transform duration-300 group-hover:rotate-180" />
                  </NavLink>
                  <div className="invisible absolute top-full left-0 w-72 pt-3 opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <ul className="overflow-hidden rounded-md border-t-4 border-clay bg-white py-2 shadow-xl">
                      {sorted.map((s) => (
                        <li key={s._id}>
                          <Link
                            to={`/services/${s.slug}`}
                            className="block px-5 py-2.5 text-[15px] font-medium text-ink transition-colors hover:bg-pine-50 hover:text-pine-700"
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

          {/* Header ke last mein: Staff / Admin login */}
          <Link
            to={staff.to}
            className="flex shrink-0 items-center gap-2 rounded-sm border-2 border-pine-700 px-4 py-2 text-[15px] font-bold whitespace-nowrap text-pine-700 transition-colors duration-200 hover:bg-pine-700 hover:text-white"
            title="Staff & Admin portal"
          >
            <staff.Icon className="size-4" /> {staff.label}
          </Link>
        </div>

        <button
          className="grid size-12 shrink-0 place-items-center rounded-md text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="size-7" /> : <Menu className="size-7" />}
        </button>
      </nav>

      {/* Menu khula ho to header ke neeche ka page dim + tap karke band */}
      {open && <button className="absolute inset-x-0 top-full h-dvh bg-ink/30 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu" tabIndex={-1} />}

      {/* Mobile menu: header ke NEECHE overlay (absolute) - page content ko dhakka nahi deta */}
      <div
        id="mobile-menu"
        className={`absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-line bg-white shadow-xl transition-[opacity,visibility] duration-200 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <ul className="container-x py-3">
          {links.map((l) => (
            <li key={l.to} className="border-b border-line/70">
              {l.dropdown ? (
                <>
                  <button onClick={() => setSubOpen((v) => !v)} className="flex w-full items-center justify-between py-3.5 text-base font-bold" aria-expanded={subOpen}>
                    {l.label} <ChevronDown className={`size-5 transition-transform ${subOpen ? 'rotate-180' : ''}`} />
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
          <li className="pt-4 pb-2">
            <Link
              to={staff.to}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-sm border-2 border-pine-700 text-base font-bold text-pine-700 active:bg-pine-50"
            >
              <staff.Icon className="size-4" /> {isAuthenticated ? 'Go to Dashboard' : 'Staff / Admin Login'}
            </Link>
          </li>
        </ul>
      </div>

    </header>
  )
}
