import { Link } from 'react-router-dom'
import { Phone, CalendarCheck } from 'lucide-react'
import { useSite } from '../context/SiteContext'

// PDF 2.2: "click-to-call mobile button" - phone par neeche fixed glass bar
export default function MobileCallBar() {
  const { settings } = useSite()
  return (
    <div className="glass-dark fixed inset-x-0 bottom-0 z-40 border-x-0 border-b-0 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="grid grid-cols-2 gap-2 min-[400px]:gap-3">
        <a href={`tel:${settings.phoneHref}`} className="btn-glass px-3 py-3 whitespace-nowrap">
          <Phone className="size-4" /> Call Now
        </a>
        <Link to="/contact#enquiry" className="btn-white px-3 py-3 whitespace-nowrap">
          <CalendarCheck className="size-4" /> Enquire
        </Link>
      </div>
    </div>
  )
}
