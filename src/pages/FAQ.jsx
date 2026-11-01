import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Phone, CalendarCheck } from 'lucide-react'
import { faqsApi } from '../api/endpoints'
import { useSite } from '../context/SiteContext'
import useFetch from '../hooks/useFetch'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import Reveal from '../components/Reveal'

// FAQ page - sawal/jawab Admin > FAQs se, heading/intro Admin > Page content > FAQ se
export default function FAQ() {
  const { pages, settings } = useSite()
  const p = pages.faq || {}
  const { data: faqs, loading, error } = useFetch(faqsApi.list)
  const sorted = [...(faqs || [])].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  const [open, setOpen] = useState(0)

  return (
    <>
      <PageHeader crumb="FAQ" title={p.title || 'Frequently Asked Questions'} intro={p.intro} image={p.headerImage} />

      <section className="bg-sand py-16 sm:py-20">
        <div className="container-x max-w-4xl">
          {loading && <Spinner />}
          {error && <p className="text-red-700">{error}</p>}
          {!loading && !sorted.length && <p className="text-center text-muted">No questions added yet.</p>}

          <div className="space-y-4">
            {sorted.map((f, i) => {
              const isOpen = open === i
              return (
                <Reveal key={f._id} delay={Math.min(i, 5) * 60}>
                  <div className={`overflow-hidden rounded-md border bg-white transition-colors duration-300 ${isOpen ? 'border-pine-500 shadow-md' : 'border-line'}`}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 p-5 text-left sm:px-6"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${f._id}`}
                    >
                      <span className="flex items-start gap-3">
                        <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-sm text-sm font-bold transition-colors ${isOpen ? 'bg-clay text-white' : 'bg-pine-50 text-pine-700'}`}>
                          Q
                        </span>
                        <span className="text-base font-bold text-ink sm:text-lg">{f.q}</span>
                      </span>
                      <ChevronDown className={`size-5 shrink-0 text-pine-700 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div id={`faq-${f._id}`} className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 pl-[3.75rem] leading-relaxed whitespace-pre-line text-muted sm:px-6 sm:pl-[4.25rem]">{f.a}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>

          <Reveal className="mt-12 rounded-md bg-pine-900 p-6 text-center text-white sm:p-10">
            <h2 className="text-2xl sm:text-3xl">{p.ctaTitle || 'Still have a question?'}</h2>
            {p.ctaText && <p className="mx-auto mt-3 max-w-xl text-white/80">{p.ctaText}</p>}
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <a href={`tel:${settings.phoneHref}`} className="btn-light rounded-sm px-7">
                <Phone className="size-4" /> Call {settings.phone}
              </a>
              <Link to="/contact#enquiry" className="btn-accent rounded-sm px-7">
                <CalendarCheck className="size-4" /> Book / Enquire
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
