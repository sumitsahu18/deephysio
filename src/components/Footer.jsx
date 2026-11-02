import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { servicesApi } from '../api/endpoints'
import useFetch from '../hooks/useFetch'
import { FacebookIcon, InstagramIcon, WhatsAppIcon, whatsappLink, formatWhatsapp } from './SocialIcons'
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
  return <h3 className="font-glass text-base font-semibold tracking-wide text-white">{children}</h3>
}

const linkCls = 'inline-block text-white/65 transition-colors hover:text-aqua-300'

// Glass footer: Brand | Quick Links | Services | Contact, phir copyright
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
    <footer className="px-3 pb-[88px] min-[400px]:px-4 sm:px-6 lg:px-8 lg:pb-8">
      <div className="glass shell relative isolate overflow-hidden rounded-3xl">
        <div className="inner-glow opacity-60" />
        <div className="grid gap-10 p-7 sm:grid-cols-2 sm:p-10 lg:grid-cols-4">
          <div>
            <Logo light small />
            <p className="mt-4 text-sm leading-relaxed text-white/65">{settings.footerText || settings.address}</p>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-2.5">
                {socials.map(({ href, label, Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:border-white/50 hover:bg-white/20">
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <H>Quick Links</H>
            <ul className="mt-4 space-y-2.5 text-[15px]">
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
                  <Link to={to} className={linkCls}>{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <H>Services</H>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {sorted.map((s) => (
                <li key={s._id}>
                  <Link to={`/services/${s.slug}`} className={linkCls}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <H>Contact</H>
            <ul className="mt-4 space-y-3.5 text-sm text-white/70">
              <li>
                <a href={`tel:${settings.phoneHref}`} className="flex gap-3 hover:text-white"><Phone className="mt-0.5 size-4 shrink-0 text-aqua-300" /> {settings.phone}</a>
              </li>
              {settings.whatsapp && (
                <li>
                  <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noreferrer" className="flex gap-3 hover:text-white">
                    <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-aqua-300" /> WhatsApp {formatWhatsapp(settings.whatsapp)}
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${settings.email}`} className="flex gap-3 [overflow-wrap:anywhere] hover:text-white"><Mail className="mt-0.5 size-4 shrink-0 text-aqua-300" /> {settings.email}</a>
              </li>
              <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-aqua-300" /> <span className="break-words">{settings.address}</span></li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-aqua-300" />
                <span>{groupHours(settings.hours).map((t) => <span key={t} className="block">{t}</span>)}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 px-7 py-5 text-center text-xs text-white/50 sm:px-10">
          Copyright © {year} {settings.legalName}. All rights reserved. Company No. {settings.companyNumber}.
        </div>
      </div>
    </footer>
  )
}
