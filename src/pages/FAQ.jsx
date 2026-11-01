import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { faqsApi } from '../api/endpoints'
import useFetch from '../hooks/useFetch'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'

export default function FAQ() {
  const { data: faqs, loading } = useFetch(faqsApi.list)
  const [open, setOpen] = useState(0)

  return (
    <>
      <PageHeader eyebrow="FAQ" title="Frequently asked questions" />
      <section className="py-16">
        <div className="container-x max-w-3xl">
          {loading ? (
            <Spinner />
          ) : (
            <div className="divide-y divide-line rounded-2xl border border-line bg-white">
              {faqs?.map((f, i) => {
                const isOpen = open === i
                return (
                  <div key={f._id}>
                    <button
                      className="flex w-full items-center justify-between gap-4 p-5 text-left font-medium"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                    >
                      {f.q}
                      <ChevronDown className={`size-5 shrink-0 text-pine-700 transition ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <p className="overflow-hidden px-5 text-sm leading-relaxed text-muted">
                        <span className="block pb-5">{f.a}</span>
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
