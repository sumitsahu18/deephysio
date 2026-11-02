import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Phone, CalendarCheck, Lock, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSite } from '../context/SiteContext'
import { FacebookIcon, InstagramIcon, WhatsAppIcon, whatsappLink } from './SocialIcons'
import SideNav, { NAV } from './SideNav'
import Logo from './Logo'

// Glass top bar (image jaisa): Home · Services · ... · Log In · [Book Appointment]
// Height FIXED (h-16 / h-20) -> scroll par kabhi nahi hilta. Scroll par sirf glass thoda gehra hota hai.
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { isAuthenticated } = useAuth()
  const { settings } = useSite()

  useEffect(() => setOpen(false), [pathname])

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

  // Drawer khula ho to peeche ka page scroll na ho
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

  const socials = [
    { href: settings.facebookUrl, label: 'Facebook', Icon: FacebookIcon },
    { href: settings.instagramUrl, label: 'Instagram', Icon: InstagramIcon },
    { href: whatsappLink(settings.whatsapp), label: 'WhatsApp', Icon: WhatsAppIcon },
  ].filter((s) => s.href)

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300 ${
          scrolled ? 'border-white/15 bg-deep/55 backdrop-blur-xl' : 'border-transparent bg-transparent'
        }`}
      >
        <div className="flex h-16 items-center gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
          {/* Mobile / tablet: logo (desktop par sidebar mein hai) */}
          <div className="min-w-0 lg:hidden">
            <Logo light small />
          </div>

          {/* Desktop quick links (image jaisa) */}
          <nav className="hidden items-center gap-1 xl:flex" aria-label="Quick links">
            {NAV.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-white/12 text-white' : 'text-white/70 hover:text-white'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <a href={`tel:${settings.phoneHref}`} className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white/85 transition-colors hover:text-white md:flex">
              <Phone className="size-4 text-aqua-300" /> {settings.phone}
            </a>
            <div className="hidden items-center gap-1.5 lg:flex">
              {socials.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:border-white/40 hover:bg-white/15 hover:text-white">
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
            <Link
              to={isAuthenticated ? '/admin' : '/admin/login'}
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-white/85 transition-colors hover:text-white sm:flex"
            >
              {isAuthenticated ? <LayoutDashboard className="size-4" /> : <Lock className="size-4" />}
              {isAuthenticated ? 'Dashboard' : 'Log In'}
            </Link>
            <Link to="/contact#enquiry" className="btn-white px-4 py-2.5 whitespace-nowrap sm:px-5">
              <CalendarCheck className="size-4" /> <span className="hidden min-[400px]:inline">Book Appointment</span><span className="min-[400px]:hidden">Book</span>
            </Link>
            <button
              className="grid size-11 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white lg:hidden"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-drawer"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer (left se slide) - wahi SideNav jo desktop sidebar mein hai */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? 'visible' : 'invisible'}`} aria-hidden={!open}>
        <button
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          tabIndex={-1}
        />
        <aside
          id="mobile-drawer"
          className={`glass-dark absolute inset-y-0 left-0 w-[300px] max-w-[85vw] rounded-r-3xl transition-transform duration-300 ease-out ${open ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <button onClick={() => setOpen(false)} className="absolute top-5 right-4 z-10 grid size-10 place-items-center rounded-full bg-white/10 text-white" aria-label="Close menu">
            <X className="size-5" />
          </button>
          <SideNav onNavigate={() => setOpen(false)} />
        </aside>
      </div>
    </>
  )
}
