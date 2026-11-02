import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { WhatsAppIcon, whatsappLink, formatWhatsapp } from './SocialIcons'

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
        className={`glass grid size-11 place-items-center rounded-full text-white transition-opacity duration-300 hover:bg-white/25 ${
          showTop ? 'opacity-100' : 'pointer-events-none opacity-0'
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
          aria-label={`Chat with us on WhatsApp ${formatWhatsapp(settings.whatsapp)}`}
          title={`WhatsApp ${formatWhatsapp(settings.whatsapp)}`}
          className="pulse grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-colors duration-300 hover:bg-[#1ebe5a]"
        >
          <WhatsAppIcon className="size-7" />
        </a>
      )}
    </div>
  )
}
