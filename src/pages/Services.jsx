import { servicesApi } from '../api/endpoints'
import useFetch from '../hooks/useFetch'
import PageHeader from '../components/PageHeader'
import ServiceCard from '../components/ServiceCard'
import Spinner from '../components/Spinner'

export default function Services() {
  const { data: services, loading, error } = useFetch(servicesApi.list)
  const sorted = [...(services || [])].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  return (
    <>
      <PageHeader
        eyebrow="Treatments"
        title="Treatments we offer"
        intro="Your physiotherapist will recommend options based on your assessment. Treatment is always explained and agreed with you first."
      />
      <section className="py-16">
        <div className="container-x">
          {loading && <Spinner />}
          {error && <p className="text-red-700">{error}</p>}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((s, i) => (
              <ServiceCard key={s._id} service={s} delay={(i % 3) * 60} />
            ))}
          </div>
          <p className="mt-10 max-w-3xl text-xs leading-relaxed text-muted">
            Individual results vary. Information on this website is general and is not a substitute for an assessment
            by a qualified healthcare professional.
          </p>
        </div>
      </section>
    </>
  )
}
