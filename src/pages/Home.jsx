import { Link } from 'react-router-dom'
import { ArrowRight, Phone, ShieldCheck, Award, Languages, Check, Clock, MapPin } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { servicesApi } from '../api/endpoints'
import useFetch from '../hooks/useFetch'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import ServiceCard from '../components/ServiceCard'
import Spinner from '../components/Spinner'

const steps = [
  { n: '01', title: 'Assessment', text: 'We listen to your history and goals, then carry out a thorough physical assessment.' },
  { n: '02', title: 'Clear plan', text: 'We explain what we found in plain language and agree a treatment plan together.' },
  { n: '03', title: 'Treatment & progress', text: 'Hands-on care plus exercises you can do at home, reviewed as you improve.' },
]

function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-sm sm:max-w-md">
      <div className="absolute inset-0 rounded-[2.5rem] bg-pine-700" />
      <div className="absolute inset-x-6 top-6 bottom-24 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,#2f7d73,transparent_60%),radial-gradient(circle_at_80%_90%,#e8a87c55,transparent_55%)]" />
      {/* Abstract spine illustration - photo aane par yahan clinic ki image lagani hai */}
      <svg viewBox="0 0 200 260" className="absolute inset-x-10 top-10 h-[60%] text-sand/80" aria-hidden="true">
        {[...Array(9)].map((_, i) => (
          <rect key={i} x={78 - Math.sin(i / 2) * 10} y={18 + i * 25} width="44" height="16" rx="8" fill="currentColor" opacity={0.35 + i * 0.07} />
        ))}
        <path d="M100 10 C 80 80, 120 160, 100 250" stroke="#e8a87c" strokeWidth="2" fill="none" strokeDasharray="4 6" />
      </svg>
      <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-pine-50 text-pine-700">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">HCPC registered</p>
            <p className="text-xs text-muted">Chartered Society of Physiotherapy members</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const { settings } = useSite()
  const { data: services, loading } = useFetch(servicesApi.list)

  return (
    <>
      {/* HERO */}
      <section className="overflow-hidden">
        <div className="container-x grid items-center gap-12 pt-8 pb-16 sm:pt-12 lg:grid-cols-2 lg:pb-24">
          <div>
            <Reveal>
              <p className="eyebrow">Physiotherapy clinic · Smethwick, Birmingham</p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
                {settings.heroTitle}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{settings.heroSubtitle}</p>
            </Reveal>

            <Reveal delay={120} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact" className="btn-primary px-7 py-3.5 text-base">
                Book an assessment <ArrowRight className="size-4" />
              </Link>
              <a href={`tel:${settings.phoneHref}`} className="btn-outline px-7 py-3.5 text-base">
                <Phone className="size-4" /> {settings.phone}
              </a>
            </Reveal>

            <Reveal delay={220} as="ul" className="mt-8 flex flex-wrap gap-2">
              {settings.conditions?.map((c) => (
                <li key={c} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-ink/80">
                  {c}
                </li>
              ))}
            </Reveal>
          </div>

          <Reveal delay={150}>
            <HeroVisual />
          </Reveal>
        </div>
      </section>

      {/* CREDENTIALS STRIP */}
      <section className="border-y border-line bg-sand">
        <div className="container-x grid gap-6 py-8 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'HCPC registered', text: 'All practitioners are registered with the Health & Care Professions Council.' },
            { icon: Award, title: 'CSP members', text: 'Members of the Chartered Society of Physiotherapy.' },
            { icon: Languages, title: 'We speak your language', text: settings.languages?.join(', ') },
          ].map(({ icon: I, title, text }, i) => (
            <Reveal key={title} delay={i * 80} className="flex gap-3">
              <I className="mt-0.5 size-6 shrink-0 text-pine-700" strokeWidth={1.75} />
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Treatments"
              title="Care that fits your body and your goals"
              intro="Every plan starts with a proper assessment. These are some of the approaches we may use."
            />
            <Link to="/services" className="btn-outline shrink-0">
              All treatments <ArrowRight className="size-4" />
            </Link>
          </div>
          {loading ? (
            <Spinner />
          ) : (
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services?.slice(0, 6).map((s, i) => (
                <ServiceCard key={s._id} service={s} delay={i * 60} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="bg-pine-900 py-20 text-sand">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">How we work</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Clear communication at every step
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 100} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="font-display text-4xl text-clay">{s.n}</p>
                <h3 className="mt-4 text-xl font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sand/70">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING + HOURS */}
      <section className="py-20">
        <div className="container-x grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <SectionHeading eyebrow="Fees" title="Simple, transparent pricing" />
            <Reveal className="card mt-8 divide-y divide-line">
              {settings.pricing?.map((p) => (
                <div key={p.name} className="flex items-center justify-between gap-4 p-5">
                  <div className="flex gap-3">
                    <Check className="mt-0.5 size-5 shrink-0 text-pine-500" />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-muted">{p.duration}</p>
                    </div>
                  </div>
                  <p className="font-display text-2xl font-semibold text-pine-700">{p.price}</p>
                </div>
              ))}
            </Reveal>
          </div>

          <Reveal delay={120} className="card self-start bg-sand p-6 lg:col-span-2">
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-pine-700" />
              <h3 className="text-xl font-semibold">Opening hours</h3>
            </div>
            <ul className="mt-5 space-y-2 text-sm">
              {settings.hours?.map((h) => (
                <li key={h.day} className="flex justify-between border-b border-line/70 pb-2 last:border-0">
                  <span>{h.day}</span>
                  <span className={h.time === 'Closed' ? 'text-muted' : 'font-medium'}>{h.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 flex gap-2 text-sm text-muted">
              <MapPin className="mt-0.5 size-4 shrink-0 text-pine-700" /> {settings.address}
            </p>
            <Link to="/contact" className="btn-primary mt-6 w-full">
              Get directions & enquire
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Reveal className="container-x">
          <div className="relative overflow-hidden rounded-[2rem] bg-clay px-6 py-12 text-center sm:px-12">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold text-pine-900 sm:text-4xl">
              Ready to take the first step?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-pine-900/80">
              Send us a quick enquiry and we will get back to you to arrange a time that suits you.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/contact" className="btn bg-pine-900 text-white hover:bg-pine-700">
                Make an enquiry
              </Link>
              <a href={`tel:${settings.phoneHref}`} className="btn-light">
                <Phone className="size-4" /> Call {settings.phone}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
