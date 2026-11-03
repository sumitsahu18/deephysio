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

      <section className="shell mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {loading && <Spinner />}
          {error && <p className="text-coral-300">{error}</p>}
          {!loading && !sorted.length && <p className="text-white/70">No questions added yet.</p>}

          {sorted.map((f, i) => {
            const isOpen = open === i
            return (
              <Reveal key={f._id} delay={Math.min(i, 5) * 60}>
                <div className={`glass overflow-hidden rounded-2xl transition-[border-color,box-shadow] duration-300 ${isOpen ? 'border-white/40 shadow-[0_0_34px_-8px_rgba(45,212,191,0.55)]' : ''}`}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 p-5 text-left sm:px-6"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${f._id}`}
                  >
                    <span className="flex items-start gap-3">
                      <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors ${isOpen ? 'bg-white text-deep' : 'bg-white/15 text-white'}`}>
                        Q
                      </span>
                      <span className="font-glass text-base font-semibold sm:text-lg">{f.q}</span>
                    </span>
                    <ChevronDown className={`size-5 shrink-0 text-aqua-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div id={`faq-${f._id}`} className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 pl-[3.75rem] leading-relaxed whitespace-pre-line text-white/75 sm:px-6 sm:pl-[4.25rem]">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal anim="right" className="h-fit lg:sticky lg:top-28">
          <div className="grad-sunset rounded-3xl border border-white/25 p-7">
            <h2 className="font-glass text-2xl font-semibold">{p.ctaTitle || 'Still have a question?'}</h2>
            {p.ctaText && <p className="mt-3 text-white/90">{p.ctaText}</p>}
            <div className="mt-6 flex flex-col gap-3">
              <a href={`tel:${settings.phoneHref}`} className="btn-white">
                <Phone className="size-4" /> Call {settings.phone}
              </a>
              <Link to="/contact#enquiry" className="btn-glass">
                <CalendarCheck className="size-4" /> Book / Enquire
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
