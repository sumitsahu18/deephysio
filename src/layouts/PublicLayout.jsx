import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import GlassBackground from '../components/GlassBackground'
import SideNav from '../components/SideNav'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MobileCallBar from '../components/MobileCallBar'
import FloatingActions from '../components/FloatingActions'

// FLUID GLASSMORPHISM layout:
//   [fixed background: clinic photo + chalte gradients]
//   [left glass sidebar (desktop)] [ glass top bar / page content / footer ]
export default function PublicLayout() {
  const { pathname, hash } = useLocation()

  // Naya page -> top par. "#enquiry" jaisa hash ho to us section par scroll.
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  // Public site par page ka base colour dark (mobile overscroll par safed na dikhe). Admin par wapas normal.
  useEffect(() => {
    const el = document.body // body ka colour canvas tak jata hai (html par lagate to body safed paint hoti)
    const prev = el.style.backgroundColor
    el.style.backgroundColor = '#072e37'
    return () => {
      el.style.backgroundColor = prev
    }
  }, [])

  return (
    <div className="relative min-h-screen font-sans text-white">
      <GlassBackground />

      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] btn-white">
        Skip to content
      </a>

      {/* Desktop sidebar (fixed -> scroll par nahi hilta) */}
      <aside className="glass-dark fixed inset-y-0 left-0 z-40 hidden w-64 border-y-0 border-l-0 lg:block">
        <SideNav />
      </aside>

      {/* overflow-x-clip: animations page ko screen se chauda na karein (side mein hilna band).
          'clip' (hidden nahi) taaki sticky header kaam karta rahe. */}
      <div className="flex min-h-screen flex-col overflow-x-clip lg:pl-64">
        <Navbar />
        <main id="main" className="flex-1 px-4 pb-10 sm:px-6 lg:px-8">
          <Outlet />
        </main>
        <Footer />
      </div>

      <MobileCallBar />
      <FloatingActions />
    </div>
  )
}
