import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { servicesApi } from '../api/endpoints'
import useFetch from '../hooks/useFetch'
import { FacebookIcon, InstagramIcon, WhatsAppIcon, whatsappLink } from './SocialIcons'
import Logo from './Logo'

// [Mon..Fri same time] -> 'Mon–Fri: 09:00 - 17:00'
function groupHours(hours = []) {
  const out = []
  hours.forEach((h) => {
    const last = out[out.length - 1]
    if (last && last.time === h.time) last.to = h.day
    else out.push({ from: h.day, to: h.day, time: h.time })
  })
  return out.map((g) => `${g.from.slice(0, 3)}${g.to !== g.from ? '–' + g.to.slice(0, 3) : ''}: ${g.time}`)
}

function H({ children }) {
  return (
    <h3 className="relative pb-3 text-lg font-bold text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-10 after:bg-clay">
      {children}
    </h3>
  )
}

// Mingara footer: Quick Links | Services | Contact Info | Follow Us, phir copyright bar
export default function Footer() {
  const { settings } = useSite()
  const { data: services } = useFetch(servicesApi.list)
  const sorted = [...(services || [])].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  const year = new Date().getFullYear()
  const socials = [
    { href: settings.facebookUrl, label: 'Facebook', Icon: FacebookIcon },
    { href: settings.instagramUrl, label: 'Instagram', Icon: InstagramIcon },
    { href: whatsappLink(settings.whatsapp), label: 'WhatsApp', Icon: WhatsAppIcon },
  ].filter((s) => s.href)

  return (
    <footer className="overflow-hidden bg-pine-900 pb-[76px] text-white/75 lg:pb-0">
      <div className="container-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <H>Quick Links</H>
          <ul className="mt-5 space-y-2.5 text-[15px]">
            {[
              ['/', 'Home'],
              ['/about', 'About & Team'],
              ['/services', 'Services & Treatments'],
              ['/faq', 'FAQ'],
              ['/contact', 'Contact & Booking Enquiry'],
              ['/privacy', 'Privacy Policy'],
              ['/admin/login', 'Staff Login'],
            ].map(([to, l]) => (
              <li key={to}>
                <Link to={to} className="inline-block transition-colors hover:text-white">{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <H>Services</H>
          <ul className="mt-5 space-y-2.5 text-[15px]">
            {sorted.map((s) => (
              <li key={s._id}>
                <Link to={`/services/${s.slug}`} className="inline-block transition-colors hover:text-white">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <H>Contact Info</H>
          <ul className="mt-5 space-y-4 text-[15px]">
            <li className="flex gap-3 break-words"><MapPin className="mt-0.5 size-5 shrink-0 text-clay" /> {settings.address}</li>
            <li>
              <a href={`tel:${settings.phoneHref}`} className="flex gap-3 hover:text-white"><Phone className="mt-0.5 size-5 shrink-0 text-clay" /> {settings.phone}</a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="flex gap-3 break-all hover:text-white"><Mail className="mt-0.5 size-5 shrink-0 text-clay" /> {settings.email}</a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-clay" />
              <span>{groupHours(settings.hours).map((t) => <span key={t} className="block">{t}</span>)}</span>
            </li>
          </ul>
        </div>

        <div>
          <H>Follow Us</H>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-11 place-items-center rounded-sm bg-white/10 text-white transition-colors duration-300 hover:bg-clay">
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          )}
          <div className="mt-8">
            <Logo light />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#163a59]">
        <p className="container-x py-5 text-center text-sm text-white/60">
          Copyright © {year} {settings.legalName}. All rights reserved. Company No. {settings.companyNumber}.
        </p>
      </div>
    </footer>
  )
}
