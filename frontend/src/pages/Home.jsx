import { Link } from 'react-router-dom'
import { Phone, MapPin, Clock, Info, ArrowRight, ShieldCheck, Languages, CalendarCheck, Star, Quote, ArrowUpRight } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { servicesApi, testimonialsApi } from '../api/endpoints'
import useFetch from '../hooks/useFetch'
import Reveal from '../components/Reveal'
import ServiceCard from '../components/ServiceCard'
import SectionTitle from '../components/SectionTitle'
import Spinner from '../components/Spinner'
import { WhatsAppIcon, whatsappLink, formatWhatsapp } from '../components/SocialIcons'
import { onImgError } from '../data/images'
import { todayName, isOpenNow } from '../utils/hours'

// HOMEPAGE - Fluid Glassmorphism (HR ka Style 2)
// PDF 2.2 (1): hero mein conditions treated, practitioner credentials, Book / Enquire CTAs.
// Saara text Admin > Page content > Home se aata hai (Zero Hardcoding).

function Hero({ p, settings }) {
  return (
    <section className="shell pt-2">
      <div className="relative isolate overflow-hidden rounded-3xl border border-white/10">
        {p.heroImage && (
          <img src={p.heroImage} alt="" onError={onImgError} fetchPriority="high" className="hero-zoom absolute inset-0 -z-20 size-full object-cover object-center" />
        )}
        <div className="absolute inset-0 -z-10 photo-fade" />

        <div className="flex min-h-[520px] items-center p-2.5 min-[400px]:p-4 sm:min-h-[560px] sm:p-8 lg:min-h-[600px] lg:p-12">
          <div className="glass relative isolate w-full max-w-2xl overflow-hidden rounded-[1.25rem] p-5 min-[400px]:p-6 sm:rounded-3xl sm:p-10">
            <div className="inner-glow" />
            <p className="anim-fade-down eyebrow-glass">{p.welcome} {settings.clinicName}</p>
            <h1 className="anim-fade-up mt-3 font-glass text-[clamp(1.55rem,8vw,2.1rem)] leading-[1.05] font-bold tracking-tight uppercase [overflow-wrap:anywhere] hyphens-auto [animation-delay:120ms] sm:text-5xl lg:text-[3.4rem]">
              {p.tagline}
            </h1>
            <p className="anim-fade-up mt-5 max-w-xl text-base leading-relaxed text-white/85 [animation-delay:240ms] sm:text-lg">{p.intro}</p>

            {p.conditions?.length > 0 && (
              <div className="anim-fade-up mt-6 [animation-delay:360ms]">
                <p className="text-[11px] font-semibold tracking-[0.2em] text-white/60 uppercase">{p.conditionsTitle}</p>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {p.conditions.map((c) => (
                    <li key={c} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[13px] text-white/90 sm:text-sm">{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {p.credentials?.length > 0 && (
              <ul className="anim-fade-up mt-5 flex flex-col gap-2 text-sm text-white/85 [animation-delay:440ms] sm:flex-row sm:flex-wrap sm:gap-x-5">
                {p.credentials.map((c) => (
                  <li key={c} className="flex items-center gap-2">
                    <ShieldCheck className="size-4 shrink-0 text-aqua-300" /> {c}
                  </li>
                ))}
              </ul>
            )}

            <div className="anim-fade-up mt-8 flex flex-col gap-3 [animation-delay:520ms] sm:flex-row">
              <Link to="/contact#enquiry" className="btn-white px-7 py-3.5 text-base">
                <CalendarCheck className="size-5" /> Book Appointment
              </Link>
              <a href={`tel:${settings.phoneHref}`} className="btn-glass px-7 py-3.5 text-base">
                <Phone className="size-5" /> Call {settings.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function InfoCards({ p, settings }) {
  const today = todayName()
  const open = isOpenNow(settings.hours)
  return (
    <section className="shell mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* Contact */}
      <Reveal className="grad-lagoon glow-hover relative isolate overflow-hidden rounded-3xl border border-white/20 p-7">
        <div className="space-y-5">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-white/70 uppercase"><Phone className="size-4" /> Telephone</p>
            <a href={`tel:${settings.phoneHref}`} className="mt-1.5 block font-glass text-3xl font-semibold hover:underline">{settings.phone}</a>
          </div>
          {settings.whatsapp && (
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-white/70 uppercase"><WhatsAppIcon className="size-4" /> WhatsApp</p>
              <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noreferrer" className="mt-1.5 block text-lg font-semibold hover:underline">{formatWhatsapp(settings.whatsapp)}</a>
            </div>
          )}
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-white/70 uppercase"><MapPin className="size-4" /> Address</p>
            <p className="mt-1.5 leading-snug text-white/90">{settings.address}</p>
          </div>
          {settings.languages?.length > 0 && (
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-white/70 uppercase"><Languages className="size-4" /> Languages</p>
              <p className="mt-1.5 text-white/90">{settings.languages.join(', ')}</p>
            </div>
          )}
        </div>
      </Reveal>

      {/* Notice */}
      <Reveal delay={100} className="glass glow-hover flex flex-col justify-between gap-6 rounded-3xl p-7">
        <div>
          <h2 className="font-glass text-xl font-semibold">{p.noticeTitle}</h2>
          <p className="mt-3 flex gap-3 leading-relaxed text-white/75">
            <Info className="mt-1 size-5 shrink-0 text-coral-300" /> {p.notice}
          </p>
        </div>
        <Link to="/contact#enquiry" className="btn-glass self-start">
          Book / Enquire <ArrowRight className="size-4" />
        </Link>
      </Reveal>

      {/* Opening hours */}
      <Reveal delay={200} className="glass glow-hover rounded-3xl p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-glass text-xl font-semibold">
            <Clock className="size-5 text-aqua-300" /> Opening Hours
          </h2>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${open ? 'bg-emerald-100 text-emerald-800' : 'bg-white/10 text-white/70'}`}>
            {open ? 'OPEN NOW' : 'CLOSED NOW'}
          </span>
        </div>
        <ul className="mt-4 divide-y divide-white/10 text-sm">
          {settings.hours?.map((h) => {
            const isToday = h.day.toLowerCase() === today.toLowerCase()
            return (
              <li key={h.day} className={`flex justify-between py-2 ${isToday ? 'font-semibold text-aqua-300' : 'text-white/75'}`}>
                <span>{h.day}{isToday && ' (Today)'}</span>
                <span className={h.time === 'Closed' && !isToday ? 'text-white/45' : ''}>{h.time}</span>
              </li>
            )
          })}
        </ul>
      </Reveal>
    </section>
  )
}

// Image jaisa bento grid: [bada aurora card][glass] / [glass][glass][coral]
function Services({ p }) {
  const { data: services, loading } = useFetch(servicesApi.list)
  const sorted = [...(services || [])].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  const layout = [
    { tone: 'aurora', cls: 'md:col-span-2', cta: 'Book now' },
    { tone: 'glass', cls: '' },
    { tone: 'glass', cls: '' },
    { tone: 'glass', cls: '' },
    { tone: 'sunset', cls: 'md:col-span-2 lg:col-span-1', cta: 'Book now' },
  ]
  return (
    <section className="shell mt-16">
      <SectionTitle eyebrow={p.servicesEyebrow} title={p.servicesTitle}>
        <Link to="/services" className="btn-glass px-5 py-2.5">
          View all services <ArrowRight className="size-4" />
        </Link>
      </SectionTitle>
      {loading ? (
        <Spinner className="text-white/70" />
      ) : (
        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sorted.slice(0, 5).map((s, i) => (
            <ServiceCard key={s._id} service={s} tone={layout[i].tone} className={layout[i].cls} cta={layout[i].cta} delay={(i % 3) * 100} />
          ))}
        </div>
      )}
    </section>
  )
}

function Band({ p }) {
  return (
    <section className="shell mt-16">
      <Reveal anim="zoom" className="relative isolate overflow-hidden rounded-3xl border border-white/15">
        {p.bandImage && <img src={p.bandImage} alt="" onError={onImgError} loading="lazy" className="absolute inset-0 -z-20 size-full object-cover" />}
        <div className="grad-aurora absolute inset-0 -z-10 opacity-80" />
        <div className="flex flex-col items-start gap-6 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-glass text-3xl font-bold tracking-tight uppercase sm:text-4xl">{p.bandTitle}</h2>
            <p className="mt-3 text-lg text-white/90">{p.bandText}</p>
          </div>
          <Link to="/contact#enquiry" className="btn-white shrink-0 px-8 py-4 text-base">
            Send an Enquiry <ArrowUpRight className="size-5" />
          </Link>
        </div>
      </Reveal>
    </section>
  )
}

function Features({ p }) {
  const items = [
    { f: p.feature1, to: '/about' },
    { f: p.feature2, to: '/contact#enquiry' },
  ].filter((x) => x.f)
  return (
    <section className="shell mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
      {items.map(({ f, to }, i) => (
        <Reveal key={to} delay={i * 120} className="glass glow-hover group flex flex-col overflow-hidden rounded-3xl">
          <div className="relative aspect-[16/9] overflow-hidden bg-white/5">
            {f.image && <img src={f.image} alt="" onError={onImgError} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />}
            <div className="absolute inset-0 bg-gradient-to-t from-deep/60 to-transparent" />
          </div>
          <div className="flex flex-1 flex-col p-7">
            <p className="eyebrow-glass">{f.eyebrow}</p>
            <h2 className="mt-2 font-glass text-2xl font-semibold">{f.title}</h2>
            <p className="mt-3 flex-1 leading-relaxed text-white/75">{f.text}</p>
            <Link to={to} className="btn-glass mt-6 self-start">
              {f.cta} <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      ))}
    </section>
  )
}

function initials(name = '') {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

function Testimonials({ p }) {
  const { data } = useFetch(testimonialsApi.list)
  const list = [...(data || [])].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  if (!list.length) return null // koi review nahi -> section chhupa do
  return (
    <section className="shell mt-16">
      <SectionTitle eyebrow="Kind words" title={p.testimonialsTitle || 'Patient Testimonials'} />
      <div className={`mt-7 grid gap-5 ${list.length > 1 ? 'md:grid-cols-2' : ''}`}>
        {list.map((t, i) => (
          <Reveal key={t._id} delay={(i % 2) * 120} className="glass glow-hover relative isolate overflow-hidden rounded-3xl p-5 min-[400px]:p-6 sm:p-8">
            <div className="inner-glow opacity-70" />
            <Quote className="absolute top-6 right-6 size-10 text-white/15" />
            <div className="flex items-start gap-4">
              <span className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-white/40 bg-white/15 font-glass text-lg font-semibold">
                {initials(t.name)}
                {t.photo && <img src={t.photo} alt="" onError={onImgError} className="absolute inset-0 size-full object-cover" />}
              </span>
              <div className="min-w-0">
                <p className="font-glass text-lg font-semibold">{t.name}</p>
                {t.rating > 0 && (
                  <p className="mt-0.5 flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, k) => (
                      <Star key={k} className={`size-4 ${k < t.rating ? 'fill-amber-400 text-amber-500' : 'text-white/30'}`} />
                    ))}
                  </p>
                )}
              </div>
            </div>
            <blockquote className="mt-4 leading-relaxed text-white/85">“{t.text}”</blockquote>
            {t.source && <p className="mt-4 text-xs font-medium tracking-wide text-white/50 uppercase">{t.source}</p>}
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const { settings, pages } = useSite()
  const p = pages.home
  return (
    <>
      <Hero p={p} settings={settings} />
      <InfoCards p={p} settings={settings} />
      <Services p={p} />
      <Band p={p} />
      <Features p={p} />
      <Testimonials p={p} />
    </>
  )
}
