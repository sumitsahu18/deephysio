import { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Inbox, Stethoscope, Users, CircleHelp, Settings, UserCog, LogOut, Menu, X, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSite } from '../context/SiteContext'
import { USE_MOCK } from '../api/endpoints'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, perm: 'dashboard', end: true },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox, perm: 'enquiries' },
  { to: '/admin/services', label: 'Treatments', icon: Stethoscope, perm: 'services' },
  { to: '/admin/team', label: 'Team', icon: Users, perm: 'team' },
  { to: '/admin/faqs', label: 'FAQs', icon: CircleHelp, perm: 'faqs' },
  { to: '/admin/settings', label: 'Clinic settings', icon: Settings, perm: 'settings' },
  { to: '/admin/users', label: 'Users & roles', icon: UserCog, perm: 'users' },
]

export default function AdminLayout() {
  const { user, logout, can } = useAuth()
  const { settings } = useSite()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const Sidebar = (
    <aside className="flex h-full w-64 flex-col bg-pine-900 text-sand/80">
      <div className="flex h-16 items-center justify-between px-5">
        <Link to="/admin" className="font-display text-lg font-semibold text-white">
          {settings.clinicName} <span className="text-clay">admin</span>
        </Link>
        <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="size-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {nav
          .filter((n) => can(n.perm))
          .map(({ to, label, icon: I, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <I className="size-4.5" /> {label}
            </NavLink>
          ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <p className="text-sm font-semibold text-white">{user?.name}</p>
        <p className="text-xs capitalize text-sand/60">{user?.role}</p>
        <button
          onClick={() => {
            logout()
            navigate('/admin/login')
          }}
          className="mt-3 flex items-center gap-2 text-sm hover:text-white"
        >
          <LogOut className="size-4" /> Log out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen bg-[#f6f4ef]">
      <div className="sticky top-0 hidden h-screen lg:block">{Sidebar}</div>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="h-full">{Sidebar}</div>
          <button className="flex-1 bg-black/40" onClick={() => setOpen(false)} aria-label="Close menu" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-6" />
          </button>
          {USE_MOCK && (
            <span className="rounded-full bg-clay/20 px-3 py-1 text-xs font-semibold text-clay-600">
              Demo mode · data saved in this browser
            </span>
          )}
          <a href="/" target="_blank" rel="noreferrer" className="ml-auto flex items-center gap-1.5 text-sm font-medium text-pine-700">
            View site <ExternalLink className="size-4" />
          </a>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
