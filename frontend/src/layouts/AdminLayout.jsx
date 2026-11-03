import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, House, Users, Stethoscope, Inbox, Images, Palette, Settings, LogOut, Menu, X, Eye } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { USE_MOCK } from '../api/endpoints'
import GlassBackground from '../components/GlassBackground'
import Logo from '../components/Logo'

// ONE centralized admin dashboard (client brief ka suggested sidebar)
export const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, perm: 'dashboard', end: true },
  { to: '/admin/homepage', label: 'Homepage & Pages', icon: House, perm: 'homepage' },
  { to: '/admin/about', label: 'About & Team', icon: Users, perm: 'about' },
  { to: '/admin/services', label: 'Services', icon: Stethoscope, perm: 'services' },
  { to: '/admin/contact', label: 'Contact & Enquiries', icon: Inbox, perm: 'contact' },
  { to: '/admin/media', label: 'Media / Images', icon: Images, perm: 'media' },
  { to: '/admin/theme', label: 'Theme Settings', icon: Palette, perm: 'theme' },
  { to: '/admin/settings', label: 'General Settings', icon: Settings, perm: 'settings' },
]

const roleLabel = (r) => (r === 'admin' ? 'Admin' : 'Staff · Content Editor')

export default function AdminLayout() {
  const { user, logout, can } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  // Admin bhi glass theme mein - page ka base colour dark
  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = 'var(--color-deep)'
    return () => {
      document.body.style.backgroundColor = prev
    }
  }, [])

  async function doLogout() {
    await logout() // server par session band + cookies saaf, phir login page
    navigate('/admin/login', { replace: true })
  }

  const Sidebar = (
    <aside className="glass-dark flex h-full w-72 max-w-[85vw] flex-col border-y-0 border-l-0 lg:w-64">
      <div className="flex h-20 items-center justify-between gap-2 px-4">
        <Logo light small to="/admin" />
        <button className="grid size-10 place-items-center rounded-full bg-white/10 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="size-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3" aria-label="Admin">
        {ADMIN_NAV.filter((n) => can(n.perm)).map(({ to, label, icon: I, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_22px_-8px_var(--color-aqua)]'
                  : 'text-white/70 hover:bg-white/8 hover:text-white'
              }`
            }
          >
            <I className="size-[18px] shrink-0" /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <NavLink to="/admin/account" className={({ isActive }) => `-m-2 flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/8 ${isActive ? 'bg-white/10' : ''}`} title="My account - change password">
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/30 bg-white/15 font-semibold">{user?.name?.[0] || 'U'}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-white/60">{roleLabel(user?.role)} · My account</p>
          </div>
        </NavLink>
        <button onClick={doLogout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-2 text-sm font-medium transition-colors hover:bg-white/15">
          <LogOut className="size-4" /> Log out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="theme-glass admin-glass relative flex min-h-dvh text-white">
      <GlassBackground />

      <div className="sticky top-0 z-30 hidden h-dvh shrink-0 lg:block">{Sidebar}</div>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 flex lg:hidden ${open ? 'visible' : 'invisible'}`} aria-hidden={!open}>
        <div className={`h-full transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>{Sidebar}</div>
        <button className={`flex-1 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} aria-label="Close menu" tabIndex={-1} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/10 bg-deep/55 px-4 backdrop-blur-xl sm:px-6">
          <button className="grid size-10 place-items-center rounded-full border border-white/20 bg-white/10 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <div className="min-w-0 overflow-hidden lg:hidden">
            <Logo light small to="/admin" />
          </div>
          {USE_MOCK && (
            <span className="hidden rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 md:inline-block">
              Demo mode · data saved in this browser
            </span>
          )}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <span className="hidden rounded-full bg-white/10 px-3 py-1 text-xs font-semibold sm:inline-block">{user?.role === 'admin' ? 'Admin' : 'Staff'}</span>
            <a href="/" target="_blank" rel="noreferrer" className="btn-white shrink-0 px-3 py-2 text-xs sm:px-4 sm:text-sm" aria-label="Preview website" title="Open the website in a new tab to check your changes">
              <Eye className="size-4" /> <span className="hidden sm:inline">Preview website</span>
            </a>
            <button onClick={doLogout} className="grid size-9 place-items-center rounded-full border border-white/20 bg-white/10 transition-colors hover:bg-white/20" aria-label="Log out" title="Log out">
              <LogOut className="size-4" />
            </button>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
