import { Link, useParams } from 'react-router-dom'
import { Check, CalendarCheck, Phone, ArrowRight, ShieldCheck } from 'lucide-react'
import { servicesApi } from '../api/endpoints'
import { useSite } from '../context/SiteContext'
import useFetch from '../hooks/useFetch'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Spinner from '../components/Spinner'
import { onImgError } from '../data/images'

// Har treatment ka page (live site ke same URLs: /services/manipulation ...)
export default function ServiceDetail() {
  const { slug } = useParams()
  const { settings, pages } = useSite()
  const { data: s, loading, error } = useFetch(() => servicesApi.get(slug), [slug])
  const { data: all } = useFetch(servicesApi.list)
  const others = [...(all || [])].filter((x) => x.slug !== slug).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  if (loading) return <Spinner />
  if (error || !s)
    return (
      <div className="shell glass mt-6 rounded-3xl py-20 text-center">
        <p className="text-lg">Service not found.</p>
        <Link to="/services" className="btn-white mt-6">Back to services</Link>
      </div>
    )

  return (
    <article>
      <PageHeader crumb={`Services / ${s.title}`} title={s.title} intro={s.summary} image={s.image} />

      <section className="shell mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {s.provider && (
            <Reveal className="flex items-center gap-3 rounded-2xl border border-pine-200 bg-pine-50/90 p-4 shadow-xs">
              <ShieldCheck className="size-5 shrink-0 text-pine-700" />
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-pine-600">Qualified Practitioner</p>
                <p className="text-sm font-semibold text-pine-900">{s.provider}</p>
              </div>
            </Reveal>
          )}

          <Reveal className="glass rounded-3xl p-5 min-[400px]:p-6 sm:p-9">
            <h2 className="font-glass text-2xl font-semibold">What it involves</h2>
            <div className="mt-4 space-y-4 text-[17px] leading-relaxed text-white/80">
              {s.body?.split('\n').filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </Reveal>
          {s.helpsWith?.length > 0 && (
            <Reveal className="glass rounded-3xl p-5 min-[400px]:p-6 sm:p-9">
              <h2 className="font-glass text-2xl font-semibold">May form part of care for</h2>
              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {s.helpsWith.map((h) => (
                  <li key={h} className="flex gap-3 rounded-2xl border border-white/12 bg-white/8 p-4 text-white/90">
                    <Check className="size-5 shrink-0 text-aqua-300" /> {h}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
          {pages.services.disclaimer && <p className="px-2 text-sm leading-relaxed text-white/55">{pages.services.disclaimer}</p>}
        </div>

        <aside className="space-y-6">
          <Reveal anim="right" className="grad-aurora relative overflow-hidden rounded-3xl border border-white/25 p-7">
            <CalendarCheck className="size-9 text-white" />
            <h3 className="mt-4 font-glass text-2xl font-semibold">Book an appointment</h3>
            <p className="mt-2 text-white/90">Send us an enquiry or give us a call and we will arrange a time that suits you.</p>
            <Link to={`/contact?reason=${encodeURIComponent(s.title)}#enquiry`} className="btn-white mt-6 w-full">Book / Enquire</Link>
            <a href={`tel:${settings.phoneHref}`} className="btn-glass mt-3 w-full">
              <Phone className="size-4" /> {settings.phone}
            </a>
          </Reveal>

          {others.length > 0 && (
            <Reveal anim="right" delay={120} className="glass rounded-3xl p-7">
              <h3 className="font-glass text-xl font-semibold">Other services</h3>
              <ul className="mt-3 divide-y divide-white/10">
                {others.map((o) => (
                  <li key={o._id}>
                    <Link to={`/services/${o.slug}`} className="group flex items-center justify-between py-3 font-medium text-white/80 transition-colors hover:text-aqua-300">
                      {o.title} <ArrowRight className="size-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {s.image && (
            <Reveal anim="zoom" className="overflow-hidden rounded-3xl border border-white/15">
              <img src={s.image} alt={s.title} onError={onImgError} loading="lazy" className="aspect-[4/3] w-full object-cover" />
            </Reveal>
          )}
        </aside>
      </section>
    </article>
  )
}
