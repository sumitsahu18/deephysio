import { Link } from 'react-router-dom'
import { Phone, MapPin, Clock, Info, ArrowRight, ShieldCheck, Languages, CalendarCheck, Check } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { servicesApi } from '../api/endpoints'
import useFetch from '../hooks/useFetch'
import Reveal from '../components/Reveal'
import ServiceCard from '../components/ServiceCard'
import Spinner from '../components/Spinner'
import { onImgError } from '../data/images'
import { todayName, isOpenNow } from '../utils/hours'

// HOMEPAGE
// PDF 2.2 (1): "Clean hero section stating conditions treated, practitioner credentials,
//               and clear calls-to-action (Book / Enquire)."
// Layout: mingaramed.com.au ka first page - photo hero -> info panel -> band -> services -> feature blocks
// Saara text Admin > Page content > Home se aata hai (Zero Hardcoding).

function Hero({ p, settings }) {
  return (
    <section className="relative isolate flex min-h-[600px] items-center overflow-hidden bg-pine-900 sm:min-h-[700px] lg:min-h-[calc(100vh-186px)]">
      {p.heroImage && (
        <img src={p.heroImage} alt="" onError={onImgError} fetchPriority="high" className="hero-zoom absolute inset-0 -z-20 size-full object-cover object-center" />
      )}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(51,108,155,0.82)_0%,rgba(80,120,170,0.6)_55%,rgba(110,140,190,0.45)_100%)]" />

      <div className="container-x pt-16 pb-28 text-center text-white sm:pb-36">
        <p className="anim-fade-down text-2xl font-bold tracking-[0.14em] sm:text-4xl">{p.welcome}</p>
        <h1 className="anim-zoom-in mt-3 text-6xl leading-none font-bold tracking-tight [animation-delay:200ms] sm:mt-5 sm:text-8xl lg:text-[8rem]">
          {settings.clinicName}
        </h1>
        <p className="anim-fade-up mt-5 text-2xl leading-tight font-bold [animation-delay:400ms] sm:mt-7 sm:text-4xl lg:text-5xl">{p.tagline}</p>
        <p className="anim-fade-up mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/90 [animation-delay:550ms] sm:text-lg">{p.intro}</p>

        {/* Conditions treated (PDF) */}
        {p.conditions?.length > 0 && (
          <div className="anim-fade-up mt-7 [animation-delay:700ms]">
            <p className="text-xs font-bold tracking-[0.2em] text-white/75 uppercase">{p.conditionsTitle}</p>
            <ul className="mx-auto mt-3 flex max-w-4xl flex-wrap justify-center gap-2">
              {p.conditions.map((c) => (
                <li key={c} className="rounded-sm border border-white/35 bg-white/10 px-3.5 py-1.5 text-sm backdrop-blur-sm sm:text-[15px]">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Practitioner credentials (PDF) */}
        {p.credentials?.length > 0 && (
          <ul className="anim-fade-up mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium [animation-delay:800ms] sm:text-base">
            {p.credentials.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-[#8fe3f5]" /> {c}
              </li>
            ))}
          </ul>
        )}

        {/* CTAs: Book / Enquire (PDF) */}
        <div className="anim-fade-up mt-9 flex flex-col justify-center gap-3 [animation-delay:950ms] sm:flex-row">
          <Link to="/contact#enquiry" className="btn-accent rounded-sm px-10 py-4 text-lg">
            <CalendarCheck className="size-5" /> Book / Enquire
          </Link>
          <a href={`tel:${settings.phoneHref}`} className="btn rounded-sm border-2 border-white px-10 py-4 text-lg text-white hover:-translate-y-0.5 hover:bg-white hover:text-pine-700">
            <Phone className="size-5" /> Call {settings.phone}
          </a>
        </div>
      </div>
    </section>
  )
}

function InfoPanel({ p, settings }) {
  const today = todayName()
  const open = isOpenNow(settings.hours)
  return (
    <section className="relative z-10 bg-sand pb-16">
      <div className="container-x">
        <Reveal anim="up" className="-mt-14 grid overflow-hidden rounded-md bg-white shadow-[0_25px_60px_-30px_rgba(27,68,103,0.45)] sm:-mt-20 lg:grid-cols-3">
          {/* Contact */}
          <div className="space-y-6 bg-pine-700 p-8 text-white sm:p-10">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold tracking-wider text-white/75 uppercase"><Phone className="size-4" /> Telephone</p>
              <a href={`tel:${settings.phoneHref}`} className="mt-2 block text-3xl font-bold hover:underline">{settings.phone}</a>
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold tracking-wider text-white/75 uppercase"><MapPin className="size-4" /> Address</p>
              <p className="mt-2 text-lg leading-snug">{settings.address}</p>
            </div>
            {settings.languages?.length > 0 && (
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold tracking-wider text-white/75 uppercase"><Languages className="size-4" /> Languages</p>
                <p className="mt-2 text-lg">{settings.languages.join(', ')}</p>
              </div>
            )}
          </div>

          {/* Notice */}
          <div className="flex flex-col justify-between gap-6 border-b border-line p-8 sm:p-10 lg:border-r lg:border-b-0">
            <div>
              <h2 className="text-2xl text-pine-900">{p.noticeTitle}</h2>
              <p className="mt-4 flex gap-3 leading-relaxed text-muted">
                <Info className="mt-1 size-5 shrink-0 text-clay" /> {p.notice}
              </p>
              <ul className="mt-6 space-y-3 text-sm font-medium">
                {p.credentials?.map((c) => (
                  <li key={c} className="flex items-center gap-2"><Check className="size-5 text-pine-700" /> {c}</li>
                ))}
              </ul>
            </div>
            <Link to="/contact#enquiry" className="btn-primary self-start rounded-sm px-8">
              Book / Enquire <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Opening hours (Today highlight - Mingara jaisa) */}
          <div className="p-8 sm:p-10">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-xl whitespace-nowrap text-pine-900 sm:text-2xl lg:text-xl xl:text-2xl">
                <Clock className="size-6 shrink-0 text-pine-700" /> Opening Hours
              </h2>
              <span className={`shrink-0 rounded-sm px-2.5 py-1 text-xs font-bold whitespace-nowrap ${open ? 'bg-emerald-100 text-emerald-800' : 'bg-sand text-muted'}`}>
                {open ? 'OPEN NOW' : 'CLOSED NOW'}
              </span>
            </div>
            <ul className="mt-5 divide-y divide-line text-[15px]">
              {settings.hours?.map((h) => {
                const isToday = h.day.toLowerCase() === today.toLowerCase()
                return (
                  <li key={h.day} className={`flex justify-between py-2.5 ${isToday ? 'font-bold text-pine-700' : ''}`}>
                    <span>{h.day}{isToday && ' (Today)'}</span>
                    <span className={h.time === 'Closed' && !isToday ? 'text-muted' : ''}>{h.time}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Band({ p }) {
  return (
    <section className="relative isolate overflow-hidden bg-pine-900">
      {p.bandImage && <img src={p.bandImage} alt="" onError={onImgError} loading="lazy" className="absolute inset-0 -z-20 size-full object-cover" />}
      <div className="absolute inset-0 -z-10 bg-pine-900/80" />
      <div className="container-x py-20 text-center text-white sm:py-24">
        <Reveal anim="zoom">
          <h2 className="text-3xl sm:text-5xl">{p.bandTitle}</h2>
        </Reveal>
        <Reveal anim="up" delay={150}>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">{p.bandText}</p>
          <Link to="/contact#enquiry" className="btn-accent mt-9 rounded-sm px-12 py-4 text-lg">
            Send an Enquiry
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function Services({ p }) {
  const { data: services, loading } = useFetch(servicesApi.list)
  const sorted = [...(services || [])].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-x">
        <Reveal className="text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-clay uppercase">{p.servicesEyebrow}</p>
          <h2 className="mt-3 text-4xl text-pine-900 sm:text-5xl">{p.servicesTitle}</h2>
          <span className="mx-auto mt-5 block h-1 w-16 rounded-full bg-clay" />
        </Reveal>
        {loading ? (
          <Spinner />
        ) : (
          <div className="mt-16 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {sorted.slice(0, 4).map((s, i) => (
              <ServiceCard key={s._id} service={s} index={i} delay={i * 120} />
            ))}
          </div>
        )}
        <Reveal className="mt-12 text-center">
          <Link to="/services" className="btn-primary rounded-sm px-10 py-4 text-base">
            View All Services <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function FeatureBlock({ f, to, reverse }) {
  if (!f) return null
  return (
    <div className={`grid items-stretch lg:grid-cols-2 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <div className="group relative min-h-72 overflow-hidden bg-pine-700 lg:min-h-[480px]">
        {f.image && (
          <img src={f.image} alt="" onError={onImgError} loading="lazy" className="absolute inset-0 size-full object-cover transition duration-[1.2s] group-hover:scale-105" />
        )}
      </div>
      <div className="flex flex-col justify-center bg-sand px-6 py-14 sm:px-12 lg:px-16">
        <Reveal anim={reverse ? 'left' : 'right'}>
          <p className="text-sm font-bold tracking-[0.2em] text-clay uppercase">{f.eyebrow}</p>
          <h2 className="mt-3 text-4xl text-pine-900">{f.title}</h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{f.text}</p>
          <Link to={to} className="btn-primary mt-8 rounded-sm px-8 py-3.5">
            {f.cta} <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </div>
  )
}

export default function Home() {
  const { settings, pages } = useSite()
  const p = pages.home
  return (
    <>
      <Hero p={p} settings={settings} />
      <InfoPanel p={p} settings={settings} />
      <Band p={p} />
      <Services p={p} />
      <section>
        <FeatureBlock f={p.feature1} to="/about" />
        <FeatureBlock f={p.feature2} to="/contact#enquiry" reverse />
      </section>
    </>
  )
}
