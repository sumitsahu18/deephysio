import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { servicesApi } from '../api/endpoints'
import { useSite } from '../context/SiteContext'
import useFetch from '../hooks/useFetch'
import PageHeader from '../components/PageHeader'
import ServiceCard from '../components/ServiceCard'
import Spinner from '../components/Spinner'
import Reveal from '../components/Reveal'

// SERVICES / TREATMENTS
// PDF 2.2 (3): "Clear, structured service breakdown written to describe care rather than
//               make unsubstantiated medical claims (UK CAP Code / ASA)."
export default function Services() {
  const { pages } = useSite()
  const p = pages.services
  const { data: services, loading, error } = useFetch(servicesApi.list)
  const sorted = [...(services || [])].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  return (
    <>
      <PageHeader title={p.title} intro={p.intro} image={p.headerImage} />
      <section className="bg-sand py-20">
        <div className="container-x">
          {loading && <Spinner />}
          {error && <p className="text-red-700">{error}</p>}
          <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((s, i) => (
              <ServiceCard key={s._id} service={s} index={i} delay={(i % 3) * 120} />
            ))}
          </div>
          {p.disclaimer && (
            <Reveal anim="fade">
              <p className="mx-auto mt-14 max-w-3xl text-center text-sm leading-relaxed text-muted">{p.disclaimer}</p>
            </Reveal>
          )}
          <Reveal className="mt-8 text-center">
            <Link to="/contact#enquiry" className="btn-primary rounded-sm px-10 py-4 text-base">
              Book / Enquire <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
