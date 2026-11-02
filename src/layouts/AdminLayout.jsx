import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Inbox,
  Stethoscope,
  Users,
  CircleHelp,
  MessageSquareQuote,
  FileText,
  Building2,
  Settings,
  UserCog,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { USE_MOCK } from '../api/endpoints'
import Logo from '../components/Logo'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, perm: 'dashboard', end: true },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox, perm: 'enquiries' },
  { to: '/admin/pages', label: 'Page content', icon: FileText, perm: 'pages' },
  { to: '/admin/services', label: 'Services', icon: Stethoscope, perm: 'services' },
  { to: '/admin/team', label: 'Team', icon: Users, perm: 'team' },
  { to: '/admin/faqs', label: 'FAQs', icon: CircleHelp, perm: 'faqs' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote, perm: 'testimonials' },
  { to: '/admin/clinic', label: 'Clinic details & hours', icon: Building2, perm: 'clinic' },
  { to: '/admin/site', label: 'Site settings', icon: Settings, perm: 'site' },
  { to: '/admin/users', label: 'Users & roles', icon: UserCog, perm: 'users' },
]

const roleLabel = (r) => (r === 'admin' ? 'Admin' : 'Staff · Content Editor')

export default function AdminLayout() {
  const { user, logout, can } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  function doLogout() {
    logout()
    navigate('/admin/login')
  }

  const Sidebar = (
    <aside className="flex h-full w-72 max-w-[85vw] flex-col bg-pine-900 text-white/75 lg:w-64">
      <div className="flex h-20 items-center justify-between gap-2 border-b border-white/10 px-4">
        <Logo light small to="/admin" />
        <button className="grid size-10 place-items-center rounded-lg text-white lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="size-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav
          .filter((n) => can(n.perm))
          .map(({ to, label, icon: I, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/12 text-white shadow-[inset_3px_0_0_var(--color-clay)]' : 'hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <I className="size-4.5 shrink-0" /> {label}
            </NavLink>
          ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-clay font-bold text-white">
            {user?.name?.[0] || 'U'}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
            <p className="truncate text-xs text-white/60">{roleLabel(user?.role)}</p>
          </div>
        </div>
        <button onClick={doLogout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
          <LogOut className="size-4" /> Log out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-dvh bg-[#f2f6fa]">
      <div className="sticky top-0 hidden h-dvh shrink-0 lg:block">{Sidebar}</div>

      {/* Mobile sidebar drawer */}
      <div className={`fixed inset-0 z-50 flex transition-[visibility] lg:hidden ${open ? 'visible' : 'invisible'}`} aria-hidden={!open}>
        <div className={`h-full transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>{Sidebar}</div>
        <button className={`flex-1 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} aria-label="Close menu" tabIndex={-1} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/95 px-4 backdrop-blur sm:px-6">
          <button className="grid size-10 place-items-center rounded-lg lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-6" />
          </button>
          {USE_MOCK && (
            <span className="hidden rounded-full bg-clay/15 px-3 py-1 text-xs font-semibold text-clay-600 md:inline-block">
              Demo mode · data saved in this browser
            </span>
          )}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <span className="hidden rounded-full bg-pine-50 px-3 py-1 text-xs font-semibold text-pine-700 sm:inline-block">
              {user?.role === 'admin' ? 'Admin' : 'Staff'}
            </span>
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-pine-700 hover:text-pine-900">
              <span className="hidden sm:inline">View site</span> <ExternalLink className="size-4" />
            </a>
            <span className="h-5 w-px bg-line" />
            <button
              onClick={doLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
            >
              <LogOut className="size-3.5" /> Logout
            </button>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
