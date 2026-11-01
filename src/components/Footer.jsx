import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useSite } from '../context/SiteContext'

export default function Footer() {
  const { settings } = useSite()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-pine-900 pb-24 text-sand/80 lg:pb-0">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <p className="font-display text-2xl font-semibold text-white">{settings.clinicName}</p>
          <p className="mt-3 text-sm leading-relaxed">{settings.tagline}</p>
          <p className="mt-4 text-xs text-sand/60">Languages: {settings.languages?.join(', ')}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Visit us</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-clay" /> {settings.address}
            </li>
            <li>
              <a href={`tel:${settings.phoneHref}`} className="flex gap-2.5 hover:text-white">
                <Phone className="mt-0.5 size-4 shrink-0 text-clay" /> {settings.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="flex gap-2.5 break-all hover:text-white">
                <Mail className="mt-0.5 size-4 shrink-0 text-clay" /> {settings.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Opening hours</p>
          <ul className="mt-4 space-y-1.5 text-sm">
            {settings.hours?.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day}</span>
                <span className="text-sand/60">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">About & Team</Link></li>
            <li><Link to="/services" className="hover:text-white">Treatments</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="container-x py-5 text-xs text-sand/50">
          © {year} {settings.legalName}. Company number {settings.companyNumber}.
        </p>
      </div>
    </footer>
  )
}
