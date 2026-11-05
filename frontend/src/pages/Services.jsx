import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { servicesApi } from '../api/endpoints'
import { useSite } from '../context/SiteContext'
import useFetch from '../hooks/useFetch'
import PageHeader from '../components/PageHeader'
import ServiceCard from '../components/ServiceCard'
import PricingSection from '../components/PricingSection'
import PolicySection from '../components/PolicySection'
import Spinner from '../components/Spinner'
import Reveal from '../components/Reveal'

// SERVICES / TREATMENTS
// PDF 2.2 (3): structured service breakdown, describes care (UK CAP Code / ASA - no cure claims)
const TONES = ['glass', 'glass', 'aurora', 'glass', 'sunset', 'glass']

export default function Services() {
  const { pages } = useSite()
  const p = pages.services
  const { data: services, loading, error } = useFetch(servicesApi.list)
  const sorted = [...(services || [])].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  return (
    <>
      <PageHeader title={p.title} intro={p.intro} image={p.headerImage} />
      <section className="shell mt-10">
        {loading && <Spinner />}
        {error && <p className="text-coral-300">{error}</p>}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((s, i) => (
            <ServiceCard key={s._id} service={s} variant="photo" tone={TONES[i % TONES.length]} delay={(i % 3) * 100} />
          ))}
        </div>

        <PricingSection />
        <PolicySection />

        {p.disclaimer && (
          <Reveal anim="fade">
            <p className="glass-soft mx-auto mt-10 max-w-3xl rounded-2xl p-5 text-center text-sm leading-relaxed text-white/70">{p.disclaimer}</p>
          </Reveal>
        )}
        <Reveal className="mt-8 text-center">
          <Link to="/contact#enquiry" className="btn-white px-8 py-3.5 text-base">
            Book Appointment <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </section>
    </>
  )
}
