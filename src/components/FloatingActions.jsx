import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { WhatsAppIcon, whatsappLink } from './SocialIcons'

// WhatsApp chat (client ke order form se) + Scroll to Top (Mingara mein hai)
export default function FloatingActions() {
  const { settings } = useSite()
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const wa = whatsappLink(settings.whatsapp)

  return (
    <div className="fixed right-4 bottom-24 z-40 flex flex-col items-end gap-3 lg:bottom-6">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`grid size-11 place-items-center rounded-sm bg-pine-700 text-white shadow-md transition duration-300 hover:bg-clay ${
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
        aria-label="Scroll to top"
        tabIndex={showTop ? 0 : -1}
      >
        <ArrowUp className="size-5" />
      </button>
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="pulse grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition duration-300 hover:scale-110"
        >
          <WhatsAppIcon className="size-7" />
        </a>
      )}
    </div>
  )
}
