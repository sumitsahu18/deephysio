import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Phone, CalendarCheck, Lock, LayoutDashboard, ChevronDown } from 'lucide-react'
import { servicesApi } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import { useSite } from '../context/SiteContext'
import useFetch from '../hooks/useFetch'
import Logo from './Logo'

// PDF 2.2 Site Structure + FAQ
export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About & Team' },
  { to: '/services', label: 'Services', dropdown: true },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact Us' },
]

// Glass header - 3 saaf hisse, beech mein barabar jagah:
//   [Logo]        [ Home · About & Team · Services ▾ · FAQ · Contact ]        [Log In] [Book Appointment]
// Height FIXED (h-[72px] / h-20) -> scroll par kabhi nahi hilta.
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [subOpen, setSubOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { isAuthenticated } = useAuth()
  const { settings } = useSite()
  const { data: services } = useFetch(servicesApi.list)
  const sorted = [...(services || [])].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  useEffect(() => {
    setOpen(false)
    setSubOpen(false)
  }, [pathname])

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

  // Mobile menu khula ho to peeche ka page scroll na ho
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const staff = isAuthenticated ? { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard } : { to: '/admin/login', label: 'Log In', Icon: Lock }

  const pill = ({ isActive }) =>
    `flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 xl:px-4 ${
      isActive ? 'bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]' : 'text-white/75 hover:text-white'
    }`

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        scrolled || open ? 'border-white/12 bg-deep/60 backdrop-blur-xl' : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between gap-3 px-3 min-[360px]:px-4 sm:h-20 sm:gap-6 sm:px-6 lg:px-8">
        {/* 1) Logo */}
        <div className="min-w-0 shrink overflow-hidden">
          <span className="xl:hidden"><Logo light small /></span>
          <span className="hidden xl:block"><Logo light /></span>
        </div>

        {/* 2) Menu - ek glass pill mein, barabar gap */}
        <nav className="glass-soft hidden items-center gap-1 rounded-full p-1.5 lg:flex" aria-label="Main">
          {NAV.map((l) =>
            l.dropdown ? (
              <div key={l.to} className="group relative">
                <NavLink to={l.to} className={pill}>
                  {l.label} <ChevronDown className="size-3.5 transition-transform duration-300 group-hover:rotate-180" />
                </NavLink>
                <div className="invisible absolute top-full left-1/2 w-72 -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <ul className="overflow-hidden rounded-2xl border border-white/12 bg-deep/92 p-2 shadow-2xl backdrop-blur-2xl">
                    {sorted.map((s) => (
                      <li key={s._id}>
                        <Link to={`/services/${s.slug}`} className="block rounded-xl px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                          {s.title}
                        </Link>
                      </li>
                    ))}
                    <li className="border-t border-white/10 pt-1 mt-1">
                      <Link to="/services#pricing" className="block rounded-xl px-4 py-2 text-xs font-semibold text-aqua-300 transition-colors hover:bg-white/10 hover:text-white">
                        Treatment Fees & Pricing →
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={pill}>
                {l.label}
              </NavLink>
            ),
          )}
        </nav>

        {/* 3) Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link to={staff.to} className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:text-white sm:flex" title="Staff & Admin portal">
            <staff.Icon className="size-4" /> <span className="lg:hidden xl:inline">{staff.label}</span>
          </Link>
          {/* Chhoti screen par chhota button, taaki menu button kabhi bahar na kate */}
          <Link to="/contact#enquiry" className="btn-white size-10 px-0 py-0 whitespace-nowrap min-[360px]:size-auto min-[360px]:px-4 min-[360px]:py-2.5 sm:px-5" aria-label="Book Appointment">
            <CalendarCheck className="size-4 shrink-0" />
            <span className="hidden sm:inline">Book Appointment</span>
            <span className="hidden min-[360px]:inline sm:hidden">Book</span>
          </Link>
          <button
            className="grid size-10 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white min-[360px]:size-11 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu: header ke neeche slide-down glass panel (sidebar nahi) */}
      {/* (header par backdrop-blur hai, isliye 'fixed' yahan header ke andar band ho jata - absolute + h-dvh use kiya) */}
      {open && <button className="absolute inset-x-0 top-full -z-10 h-dvh bg-black/50 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu" tabIndex={-1} />}
      <div
        id="mobile-menu"
        className={`absolute inset-x-0 top-full px-3 pt-2 transition-[opacity,visibility,transform] duration-200 lg:hidden ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
        }`}
      >
        <div className="mx-auto max-h-[calc(100dvh-6rem)] max-w-xl overflow-y-auto rounded-3xl border border-white/12 bg-deep/95 p-3 shadow-2xl backdrop-blur-2xl">
          <ul>
            {NAV.map((l) => (
              <li key={l.to}>
                {l.dropdown ? (
                  <>
                    <div className="flex items-center">
                      <NavLink to={l.to} end className={({ isActive }) => `flex-1 rounded-2xl px-4 py-3.5 text-base font-medium ${isActive ? 'bg-white/12 text-white' : 'text-white/85'}`}>
                        {l.label}
                      </NavLink>
                      <button onClick={() => setSubOpen((v) => !v)} className="grid size-12 place-items-center rounded-2xl text-white/80" aria-expanded={subOpen} aria-label="Show all services">
                        <ChevronDown className={`size-5 transition-transform ${subOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    {subOpen && (
                      <ul className="mb-2 ml-4 border-l border-white/15 pl-3">
                        {sorted.map((s) => (
                          <li key={s._id}>
                            <Link to={`/services/${s.slug}`} className="block rounded-xl px-3 py-2.5 text-sm text-white/70">{s.title}</Link>
                          </li>
                        ))}
                        <li className="pt-1">
                          <Link to="/services#pricing" className="block rounded-xl px-3 py-2 text-xs font-semibold text-aqua-300">Treatment Fees & Pricing →</Link>
                        </li>
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => `block rounded-2xl px-4 py-3.5 text-base font-medium ${isActive ? 'bg-white/12 text-white' : 'text-white/85'}`}>
                    {l.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
            <a href={`tel:${settings.phoneHref}`} className="btn-glass px-3">
              <Phone className="size-4" /> Call us
            </a>
            <Link to={staff.to} className="btn-glass px-3">
              <staff.Icon className="size-4" /> {isAuthenticated ? 'Dashboard' : 'Staff Login'}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
