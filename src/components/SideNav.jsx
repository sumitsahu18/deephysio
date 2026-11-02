import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Home, Users, Stethoscope, CircleHelp, Mail, ChevronDown, Lock, LayoutDashboard, Phone, Clock, ShieldCheck } from 'lucide-react'
import { servicesApi } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import { useSite } from '../context/SiteContext'
import useFetch from '../hooks/useFetch'
import { hoursFor, isOpenNow } from '../utils/hours'
import Logo from './Logo'

// PDF 2.2 Site Structure + FAQ. Desktop par left glass sidebar, mobile par drawer - dono yahi use karte hain.
export const NAV = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/about', label: 'About & Team', icon: Users },
  { to: '/services', label: 'Services', icon: Stethoscope, dropdown: true },
  { to: '/faq', label: 'FAQ', icon: CircleHelp },
  { to: '/contact', label: 'Contact Us', icon: Mail },
]

export default function SideNav({ onNavigate }) {
  const { pathname } = useLocation()
  const { isAuthenticated } = useAuth()
  const { settings } = useSite()
  const { data: services } = useFetch(servicesApi.list)
  const sorted = [...(services || [])].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  const [subOpen, setSubOpen] = useState(pathname.startsWith('/services'))
  const open = isOpenNow(settings.hours)
  const today = hoursFor(settings.hours)

  const item = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_24px_-6px_rgba(45,212,191,0.6)]'
        : 'text-white/70 hover:bg-white/8 hover:text-white'
    }`

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-20 shrink-0 items-center px-5">
        <Logo light small />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label="Main">
        <ul className="space-y-1">
          {NAV.map(({ to, label, icon: I, dropdown }) => (
            <li key={to}>
              {dropdown ? (
                <>
                  <div className="flex items-center">
                    <NavLink to={to} end onClick={onNavigate} className={(s) => `${item(s)} flex-1`}>
                      <I className="size-[18px] shrink-0" /> {label}
                    </NavLink>
                    <button
                      type="button"
                      onClick={() => setSubOpen((v) => !v)}
                      className="ml-1 grid size-10 place-items-center rounded-xl text-white/70 hover:bg-white/8 hover:text-white"
                      aria-expanded={subOpen}
                      aria-label="Show all services"
                    >
                      <ChevronDown className={`size-4 transition-transform duration-300 ${subOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  <div className={`grid transition-[grid-template-rows] duration-300 ${subOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <ul className="ml-5 overflow-hidden border-l border-white/15 pl-3">
                      {sorted.map((s) => (
                        <li key={s._id}>
                          <NavLink
                            to={`/services/${s.slug}`}
                            onClick={onNavigate}
                            className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? 'text-aqua-300' : 'text-white/60 hover:text-white'}`}
                          >
                            {s.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <NavLink to={to} end={to === '/'} onClick={onNavigate} className={item}>
                  <I className="size-[18px] shrink-0" /> {label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        {/* Aaj ka status card */}
        <div className="glass-soft mt-6 rounded-2xl p-4">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-white/60 uppercase">
            <Clock className="size-3.5" /> Today
          </p>
          <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-white">
            <span className={`size-2 rounded-full ${open ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-white/40'}`} />
            {open ? 'Open now' : 'Closed now'} · {today?.time || '—'}
          </p>
          <a href={`tel:${settings.phoneHref}`} onClick={onNavigate} className="mt-3 flex items-center gap-2 text-sm text-aqua-300 hover:text-white">
            <Phone className="size-4" /> {settings.phone}
          </a>
          <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-white/55">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0" /> HCPC registered physiotherapists
          </p>
        </div>
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        <Link
          to={isAuthenticated ? '/admin' : '/admin/login'}
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:bg-white/15 hover:text-white"
        >
          {isAuthenticated ? <LayoutDashboard className="size-4" /> : <Lock className="size-4" />}
          {isAuthenticated ? 'Dashboard' : 'Staff Login'}
        </Link>
      </div>
    </div>
  )
}
