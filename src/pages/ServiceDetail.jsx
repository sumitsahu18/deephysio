import { Link, useParams } from 'react-router-dom'
import { Check, CalendarCheck, Phone, ArrowRight } from 'lucide-react'
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
      <div className="container-x py-24 text-center">
        <p className="text-lg">Service not found.</p>
        <Link to="/services" className="btn-outline mt-6">Back to services</Link>
      </div>
    )

  return (
    <article>
      <PageHeader crumb={`Services / ${s.title}`} title={s.title} intro={s.summary} image={s.image} />

      <section className="bg-white py-20">
        <div className="container-x grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {s.image && (
              <Reveal anim="zoom" className="mb-10 overflow-hidden rounded-md">
                <img src={s.image} alt={s.title} onError={onImgError} className="aspect-[16/9] w-full object-cover" />
              </Reveal>
            )}
            <Reveal>
              <h2 className="text-3xl text-pine-900">What it involves</h2>
              <div className="mt-4 space-y-4 text-lg leading-relaxed text-ink/85">
                {s.body?.split('\n').filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </Reveal>
            {s.helpsWith?.length > 0 && (
              <Reveal className="mt-10">
                <h2 className="text-3xl text-pine-900">May form part of care for</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {s.helpsWith.map((h) => (
                    <li key={h} className="flex gap-3 rounded-md border border-line bg-sand p-4">
                      <Check className="size-5 shrink-0 text-clay" /> {h}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
            {pages.services.disclaimer && <p className="mt-10 text-sm leading-relaxed text-muted">{pages.services.disclaimer}</p>}
          </div>

          <aside className="space-y-6">
            <Reveal anim="right" className="rounded-md bg-pine-700 p-7 text-white">
              <CalendarCheck className="size-9 text-[#8fe3f5]" />
              <h3 className="mt-4 text-2xl">Book an appointment</h3>
              <p className="mt-2 text-white/80">Send us an enquiry or give us a call and we will arrange a time that suits you.</p>
              <Link to="/contact#enquiry" className="btn-accent mt-6 w-full rounded-sm">Book / Enquire</Link>
              <a href={`tel:${settings.phoneHref}`} className="btn mt-3 w-full rounded-sm border border-white/60 text-white hover:bg-white hover:text-pine-700">
                <Phone className="size-4" /> {settings.phone}
              </a>
            </Reveal>

            {others.length > 0 && (
              <Reveal anim="right" delay={120} className="rounded-md border border-line p-7">
                <h3 className="text-xl text-pine-900">Other services</h3>
                <ul className="mt-4 divide-y divide-line">
                  {others.map((o) => (
                    <li key={o._id}>
                      <Link to={`/services/${o.slug}`} className="group flex items-center justify-between py-3 font-medium text-ink hover:text-pine-700">
                        {o.title} <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </aside>
        </div>
      </section>
    </article>
  )
}
