import { Link } from 'react-router-dom'
import { Clock, Building2, Home, ArrowRight, ShieldCheck, MapPin, ReceiptText } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import Reveal from './Reveal'

export default function PricingSection({ id = 'pricing', className = '' }) {
  const { pricing } = useSite()

  const list = (pricing || [])
    .filter((p) => p.active !== false)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  if (!list.length) return null

  return (
    <section id={id} className={`shell scroll-mt-24 mt-16 ${className}`} aria-label="Treatment Fees & Pricing">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="eyebrow inline-flex items-center gap-1.5 rounded-full border border-pine-100 bg-pine-50/70 px-3.5 py-1 text-xs font-semibold text-pine-700">
          <ReceiptText className="size-3.5" /> Transparent Pricing
        </span>
        <h2 className="mt-3 font-glass text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
          Treatment Fees & Session Breakdown
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
          Clear, straightforward pricing with no hidden charges. Appointments available within 24 hours with self-referrals welcome.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((plan, idx) => {
          const isHomeVisit = plan.category === 'home_visit' || /home visit/i.test(plan.name)

          return (
            <Reveal
              key={plan._id || plan.name}
              delay={idx * 80}
              className="glass glow-hover group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-white/95 p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-pine-300 hover:shadow-lg sm:p-7"
            >
              <div>
                {/* Category Pill */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide ${
                      isHomeVisit
                        ? 'border-sky-200 bg-sky-50 text-sky-800'
                        : 'border-pine-200 bg-pine-50 text-pine-800'
                    }`}
                  >
                    {isHomeVisit ? <Home className="size-3.5" /> : <Building2 className="size-3.5" />}
                    {isHomeVisit ? 'Home Visit' : 'Clinic Appointment'}
                  </span>
                </div>

                {/* Plan Name */}
                <h3 className="mt-4 font-glass text-lg font-bold tracking-tight text-ink sm:text-xl sm:min-h-[56px] flex items-center">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mt-4 flex items-baseline gap-1.5 border-b border-line/60 pb-4">
                  <span className="font-glass text-4xl sm:text-5xl font-extrabold tracking-tight text-ink">
                    £{plan.price}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">GBP</span>
                </div>

                {/* Duration */}
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-pine-700">
                  <Clock className="size-4 shrink-0 text-pine-600" />
                  <span>Duration: {plan.duration}</span>
                </div>

                {/* Notes */}
                {plan.notes && (
                  <p className="mt-3 text-xs sm:text-[13px] leading-relaxed text-muted min-h-[44px]">
                    {plan.notes}
                  </p>
                )}

                {/* Home Visit Specific Radius Clarity */}
                {isHomeVisit && (
                  <div className="mt-3 flex items-center gap-1.5 rounded-xl border border-sky-100 bg-sky-50/70 px-3 py-2 text-[11.5px] font-medium text-sky-800">
                    <MapPin className="size-3.5 shrink-0 text-sky-600" />
                    <span>
                      {/extended/i.test(plan.name) || (plan.price >= 130)
                        ? 'Over a 10-mile radius from clinic'
                        : 'Up to a 10-mile radius from clinic'}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-2">
                <Link
                  to={`/contact?reason=${encodeURIComponent(isHomeVisit ? 'Home Visit' : 'Back/Neck Pain')}#enquiry`}
                  className="btn-primary w-full py-2.5 text-center text-sm font-semibold justify-center shadow-xs"
                >
                  Book Appointment <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          )
        })}
      </div>

      {/* Reassurance Footer Banner */}
      <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-line bg-gradient-to-r from-pine-50/70 via-white to-sky-50/70 p-4 text-center sm:flex-row sm:text-left sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-pine-100/70 text-pine-700">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-ink sm:text-sm">
              Hands-on therapy, personalized recovery plan & progress review included
            </p>
            <p className="text-[11px] text-muted">
              No GP referral required. Flexible appointment slots available Monday through Saturday.
            </p>
          </div>
        </div>
        <Link to="/contact#enquiry" className="btn-outline shrink-0 py-1.5 px-4 text-xs font-semibold">
          Check Availability
        </Link>
      </div>
    </section>
  )
}

