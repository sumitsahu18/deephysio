import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, CalendarCheck } from 'lucide-react'
import { servicesApi } from '../api/endpoints'
import useFetch from '../hooks/useFetch'
import Icon from '../components/Icon'
import Reveal from '../components/Reveal'
import Spinner from '../components/Spinner'

export default function ServiceDetail() {
  const { slug } = useParams()
  const { data: s, loading, error } = useFetch(() => servicesApi.get(slug), [slug])

  if (loading) return <Spinner />
  if (error || !s)
    return (
      <div className="container-x py-24 text-center">
        <p className="text-lg">Treatment not found.</p>
        <Link to="/services" className="btn-outline mt-6">Back to treatments</Link>
      </div>
    )

  return (
    <article>
      <section className="border-b border-line bg-sand">
        <div className="container-x py-12 sm:py-16">
          <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-medium text-pine-700">
            <ArrowLeft className="size-4" /> All treatments
          </Link>
          <Reveal className="mt-6 flex items-start gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-pine-700 text-white">
              <Icon name={s.icon} className="size-7" strokeWidth={1.75} />
            </span>
            <div>
              <h1 className="text-4xl font-semibold sm:text-5xl">{s.title}</h1>
              <p className="mt-3 text-lg text-muted">{s.summary}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x grid gap-10 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <h2 className="text-2xl font-semibold">What it involves</h2>
            <p className="mt-4 leading-relaxed text-ink/85">{s.body}</p>
            {s.helpsWith?.length > 0 && (
              <>
                <h2 className="mt-10 text-2xl font-semibold">May be used as part of care for</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {s.helpsWith.map((h) => (
                    <li key={h} className="flex gap-2.5 rounded-xl border border-line bg-white p-4 text-sm">
                      <Check className="size-5 shrink-0 text-pine-500" /> {h}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Reveal>

          <Reveal delay={120} className="card h-fit bg-pine-700 p-6 text-white">
            <CalendarCheck className="size-7 text-clay" />
            <h3 className="mt-4 text-xl font-semibold">Not sure if this is right for you?</h3>
            <p className="mt-2 text-sm text-white/80">Book an initial assessment and we will recommend the best approach.</p>
            <Link to="/contact" className="btn-light mt-6 w-full">Make an enquiry</Link>
          </Reveal>
        </div>
      </section>
    </article>
  )
}
