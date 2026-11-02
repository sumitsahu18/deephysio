import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import GlassBackground from '../components/GlassBackground'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MobileCallBar from '../components/MobileCallBar'
import FloatingActions from '../components/FloatingActions'

// FLUID GLASSMORPHISM layout (sidebar nahi - full width):
//   [fixed background: clinic photo + chalte gradients]
//   [ glass header / page content / footer ]
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
    el.style.backgroundColor = 'var(--color-deep)'
    return () => {
      el.style.backgroundColor = prev
    }
  }, [])

  return (
    <div className="theme-glass relative min-h-screen font-sans text-white">
      <GlassBackground />

      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] btn-white">
        Skip to content
      </a>

      {/* overflow-x-clip: animations page ko screen se chauda na karein (side mein hilna band).
          'clip' (hidden nahi) taaki sticky header kaam karta rahe. */}
      <div className="flex min-h-screen flex-col overflow-x-clip">
        <Navbar />
        <main id="main" className="flex-1 px-3 pt-2 pb-10 min-[400px]:px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
        <Footer />
      </div>

      <MobileCallBar />
      <FloatingActions />
    </div>
  )
}
