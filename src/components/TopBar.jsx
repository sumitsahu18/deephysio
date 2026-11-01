import { Link } from 'react-router-dom'
import { Phone, Mail, CalendarCheck } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { FacebookIcon, InstagramIcon, WhatsAppIcon, whatsappLink } from './SocialIcons'

// Mingara jaisi blue top strip: Call | Email ....... [f] [ig] [wa] [Book / Enquire]
export default function TopBar() {
  const { settings } = useSite()
  const socials = [
    { href: settings.facebookUrl, label: 'Facebook', Icon: FacebookIcon },
    { href: settings.instagramUrl, label: 'Instagram', Icon: InstagramIcon },
    { href: whatsappLink(settings.whatsapp), label: 'WhatsApp', Icon: WhatsAppIcon },
  ].filter((s) => s.href)

  return (
    <div className="bg-pine-700 text-white">
      <div className="container-x flex min-h-14 items-center justify-between gap-4 py-2 sm:min-h-[68px]">
        <div className="flex items-center gap-5 text-sm sm:text-[17px]">
          <a href={`tel:${settings.phoneHref}`} className="flex items-center gap-2 transition hover:text-white/80">
            <Phone className="size-4 fill-current" /> <span>Call {settings.phone}</span>
          </a>
          <span className="hidden h-5 w-px bg-white/40 md:block" />
          <a href={`mailto:${settings.email}`} className="hidden items-center gap-2 transition hover:text-white/80 md:flex">
            <Mail className="size-4" /> {settings.email}
          </a>
        </div>

        <div className="flex items-center gap-2.5">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="hidden size-10 place-items-center rounded-sm bg-white text-pine-700 transition-colors duration-300 hover:bg-clay hover:text-white sm:grid"
            >
              <Icon className="size-5" />
            </a>
          ))}
          <Link
            to="/contact#enquiry"
            className="ml-1 flex shrink-0 items-center gap-2 whitespace-nowrap rounded-sm bg-clay px-4 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-clay-600 sm:px-7 sm:text-[17px]"
          >
            <CalendarCheck className="size-4" /> Book / Enquire
          </Link>
        </div>
      </div>
    </div>
  )
}
