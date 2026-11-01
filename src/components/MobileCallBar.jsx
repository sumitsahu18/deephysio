import { Link } from 'react-router-dom'
import { Phone, CalendarCheck } from 'lucide-react'
import { useSite } from '../context/SiteContext'

// PDF 2.2: "click-to-call mobile button" - phone par neeche fixed bar
export default function MobileCallBar() {
  const { settings } = useSite()
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 backdrop-blur lg:hidden">
      <div className="grid grid-cols-2 gap-3">
        <a href={`tel:${settings.phoneHref}`} className="btn-primary rounded-sm py-3">
          <Phone className="size-4" /> Call Now
        </a>
        <Link to="/contact#enquiry" className="btn-accent rounded-sm py-3">
          <CalendarCheck className="size-4" /> Enquire
        </Link>
      </div>
    </div>
  )
}
