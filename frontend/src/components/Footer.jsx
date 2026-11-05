import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Globe2 } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { servicesApi } from '../api/endpoints'
import useFetch from '../hooks/useFetch'
import { FacebookIcon, InstagramIcon, YouTubeIcon, TwitterXIcon, WhatsAppIcon, whatsappLink, formatWhatsapp } from './SocialIcons'
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
  const { settings, accreditations, locations } = useSite()
  const { data: services } = useFetch(servicesApi.list)
  const sorted = [...(services || [])].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  const activeAccreditations = (accreditations || [])
    .filter((a) => a.active !== false)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  const activeLocations = (locations || [])
    .filter((loc) => loc.active !== false)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  const year = new Date().getFullYear()

  const socials = [
    { href: settings.facebookUrl, label: 'Facebook', Icon: FacebookIcon },
    { href: settings.instagramUrl, label: 'Instagram', Icon: InstagramIcon },
    { href: settings.youtubeUrl, label: 'YouTube', Icon: YouTubeIcon },
    { href: settings.twitterUrl, label: 'Twitter / X', Icon: TwitterXIcon },
    { href: whatsappLink(settings.whatsapp), label: 'WhatsApp', Icon: WhatsAppIcon },
  ].filter((s) => s.href)

  const languagesList = settings.languages?.length
    ? settings.languages.join(', ')
    : 'English, Hindi, Gujarati, Punjabi'

  return (
    <footer className="px-3 pb-[88px] min-[400px]:px-4 sm:px-6 lg:px-8 lg:pb-8">
      <div className="glass shell relative isolate overflow-hidden rounded-3xl">
        <div className="inner-glow opacity-60" />
        <div className="grid gap-10 p-7 sm:grid-cols-2 sm:p-10 lg:grid-cols-4">
          <div>
            <Logo light small />
            <p className="mt-4 text-sm leading-relaxed text-white/65">{settings.footerText || settings.address}</p>
            {socials.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2.5">
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
            <H>Clinic Locations & Contact</H>
            <ul className="mt-4 space-y-3.5 text-sm text-white/70">
              {activeLocations.length > 0 ? (
                activeLocations.map((loc) => (
                  <li key={loc._id || loc.name} className="flex gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-aqua-300" />
                    <span className="break-words">
                      <strong className="block text-white font-medium">{loc.name}</strong>
                      {loc.address}{loc.postcode && !loc.address.includes(loc.postcode) ? `, ${loc.postcode}` : ''}
                    </span>
                  </li>
                ))
              ) : (
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-aqua-300" />
                  <span className="break-words">{settings.address}</span>
                </li>
              )}

              <li>
                <a href={`tel:${settings.phoneHref || settings.phone}`} className="flex gap-3 hover:text-white">
                  <Phone className="mt-0.5 size-4 shrink-0 text-aqua-300" /> {settings.phone}
                </a>
              </li>
              {settings.whatsapp && (
                <li>
                  <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noreferrer" className="flex gap-3 hover:text-white">
                    <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-aqua-300" /> WhatsApp {formatWhatsapp(settings.whatsapp)}
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${settings.email}`} className="flex gap-3 [overflow-wrap:anywhere] hover:text-white">
                  <Mail className="mt-0.5 size-4 shrink-0 text-aqua-300" /> {settings.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-aqua-300" />
                <span>{groupHours(settings.hours).map((t) => <span key={t} className="block">{t}</span>)}</span>
              </li>
              <li className="flex gap-3 text-xs text-white/60 pt-1">
                <Globe2 className="mt-0.5 size-3.5 shrink-0 text-aqua-300/80" />
                <span>Languages: {languagesList}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Global Accreditation Strip (HCPC, CSP, AACP) */}
        {activeAccreditations.length > 0 && (
          <div className="border-t border-white/10 px-7 py-5 sm:px-10">
            <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
              <div className="text-center lg:text-left">
                <p className="font-glass text-xs font-semibold tracking-wider uppercase text-pine-700">
                  Accreditations & Professional Standards
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  Practitioners registered with and regulated by UK professional bodies
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {activeAccreditations.map((a) => (
                  <div
                    key={a._id || a.name}
                    className="flex items-center gap-2.5 rounded-xl border border-line bg-white/80 px-3.5 py-1.5 shadow-xs transition-colors hover:border-pine-300"
                  >
                    {a.logoUrl ? (
                      <img src={a.logoUrl} alt={`${a.name} logo`} className="h-6 w-auto max-w-[85px] object-contain" />
                    ) : (
                      <span className="rounded bg-pine-50 px-2 py-0.5 font-mono text-xs font-bold text-pine-800">
                        {a.name}
                      </span>
                    )}
                    <span className="text-xs font-medium text-ink">
                      {a.fullName ? <span className="hidden sm:inline">{a.fullName}</span> : null}
                      <span className={a.fullName ? 'sm:hidden' : ''}>{a.name}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-white/10 px-7 py-5 text-center text-xs text-white/50 sm:px-10">
          Copyright © {year} {settings.legalName}. All rights reserved. Company No. {settings.companyNumber}.
        </div>
      </div>
    </footer>
  )
}
