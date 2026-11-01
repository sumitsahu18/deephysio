import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MobileCallBar from '../components/MobileCallBar'
import FloatingActions from '../components/FloatingActions'

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

  return (
    /* overflow-x-clip: scroll animations (slide-left/right) page ko screen se chauda na karein -
    // isi wajah se mobile par poora page + header + footer side mein hilta tha.
    // 'clip' (hidden nahi) taaki sticky header kaam karta rahe. */
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 btn-primary">
        Skip to content
      </a>
      <TopBar />
      <Navbar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <MobileCallBar />
      <FloatingActions />
    </div>
  )
}
