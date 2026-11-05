import { Shield, CreditCard, Banknote, Landmark, Clock, AlertCircle, FileCheck, CheckCircle2 } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import Reveal from './Reveal'

export default function PolicySection({ id = 'policies', className = '' }) {
  const { insurers, pages } = useSite()
  const p = pages?.services || {}

  const activeInsurers = (insurers || [])
    .filter((ins) => ins.active !== false)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  const insuranceTitle = p.insuranceTitle || 'Private Medical Insurance'
  const insuranceText =
    p.insuranceText ||
    'DeePhysio works with major private medical insurance providers, including Bupa, AXA Health, Aviva and Vitality.'
  const insurancePreAuth =
    p.insurancePreAuth ||
    'Patients must obtain pre-authorisation from their insurance provider before booking if they want direct clinic billing. Patients should confirm their individual policy coverage before treatment.'

  const paymentTitle = p.paymentTitle || 'Payment Information'
  const paymentMethods = p.paymentMethods?.length
    ? p.paymentMethods
    : ['Cash accepted', 'Bank transfer accepted', 'Self-pay patients must pay after each session']
  const paymentInstructions =
    p.paymentInstructions ||
    'We accept cash and direct bank transfer. Self-pay patients must pay after each session. Invoices and receipts are provided for all treatments.'

  const cancellationTitle = p.cancellationTitle || 'Cancellation & Rescheduling Policy'
  const cancellationPolicy =
    p.cancellationPolicy ||
    "At least 24 hours' notice is required for cancellations or rescheduling. Late cancellations or changes may incur a fee."

  return (
    <section id={id} className={`shell scroll-mt-24 mt-16 space-y-8 ${className}`} aria-label="Insurance, Payment and Cancellation Policies">
      {/* Section Overview Header */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="eyebrow inline-flex items-center gap-1.5 rounded-full border border-pine-100 bg-pine-50/70 px-3.5 py-1 text-xs font-semibold text-pine-700">
          <FileCheck className="size-3.5" /> Patient Guidance & Policies
        </span>
        <h2 className="mt-3 font-glass text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
          Insurance, Payment & Booking Policies
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
          Transparent clinical policies to ensure a seamless experience for self-funding and insured patients alike.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 1. Private Medical Insurance Panel */}
        <Reveal
          id="insurance"
          className="glass glow-hover flex flex-col justify-between rounded-3xl border border-line bg-white/95 p-6 sm:p-8 shadow-xs"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl border border-pine-100 bg-pine-50/90 text-pine-700 shadow-xs">
                <Shield className="size-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-pine-600">Insurance Cover</span>
                <h3 className="font-glass text-xl font-bold text-ink">{insuranceTitle}</h3>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink/90">
              {insuranceText}
            </p>

            {/* Insurers Logo / Placeholder Strip */}
            {activeInsurers.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                {activeInsurers.map((ins) => (
                  <div
                    key={ins._id || ins.name}
                    className="flex h-12 items-center justify-center rounded-xl border border-line bg-sand/40 px-3 py-1.5 text-center transition-colors hover:border-pine-300"
                    title={ins.name}
                  >
                    {ins.logoUrl ? (
                      <img
                        src={ins.logoUrl}
                        alt={`${ins.name} logo`}
                        className="max-h-7 max-w-[90px] object-contain"
                      />
                    ) : (
                      <span className="font-mono text-xs font-bold tracking-wider text-pine-900">
                        {ins.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pre-authorisation requirement note */}
            <div className="mt-5 rounded-2xl border border-pine-100 bg-pine-50/70 p-4 text-xs leading-relaxed text-pine-900">
              <p className="font-semibold text-pine-950 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="size-3.5 text-pine-700" /> Pre-authorisation Notice:
              </p>
              {insurancePreAuth}
            </div>
          </div>

          <div className="mt-6 border-t border-line/60 pt-3 text-[11px] text-muted">
            Direct billing available upon presentation of approved pre-authorisation code.
          </div>
        </Reveal>

        {/* 2. Payment Methods Panel */}
        <Reveal
          id="payment"
          delay={100}
          className="glass glow-hover flex flex-col justify-between rounded-3xl border border-line bg-white/95 p-6 sm:p-8 shadow-xs"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl border border-pine-100 bg-pine-50/90 text-pine-700 shadow-xs">
                <CreditCard className="size-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-pine-600">Settling Fees</span>
                <h3 className="font-glass text-xl font-bold text-ink">{paymentTitle}</h3>
              </div>
            </div>

            {/* Accepted Methods List */}
            <ul className="mt-5 space-y-2.5">
              {paymentMethods.map((m, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 rounded-xl border border-line bg-sand/30 p-3 text-sm font-semibold text-ink"
                >
                  <div className="grid size-7 place-items-center rounded-lg bg-pine-100/70 text-pine-700 shrink-0">
                    {/cash/i.test(m) ? (
                      <Banknote className="size-4" />
                    ) : /bank|transfer/i.test(m) ? (
                      <Landmark className="size-4" />
                    ) : (
                      <CheckCircle2 className="size-4" />
                    )}
                  </div>
                  <span>{m}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-xs leading-relaxed text-muted">
              {paymentInstructions}
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-line bg-white p-3.5 text-xs text-muted flex items-center gap-2">
            <CheckCircle2 className="size-4 text-pine-600 shrink-0" />
            <span>Official itemised receipts supplied for self-pay reimbursements.</span>
          </div>
        </Reveal>

        {/* 3. Cancellation & Rescheduling Policy Panel */}
        <Reveal
          id="cancellation"
          delay={200}
          className="glass glow-hover flex flex-col justify-between rounded-3xl border border-line bg-white/95 p-6 sm:p-8 shadow-xs"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-800 shadow-xs">
                <Clock className="size-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-amber-700">Notice Required</span>
                <h3 className="font-glass text-xl font-bold text-ink">{cancellationTitle}</h3>
              </div>
            </div>

            {/* Exact Policy Statement */}
            <div className="mt-5 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/80 to-sand/40 p-5 shadow-xs">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="size-5 shrink-0 text-amber-600 mt-0.5" />
                <p className="text-sm font-semibold leading-relaxed text-amber-950">
                  “{cancellationPolicy}”
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted">
              We understand that emergencies and unforeseen events occur. If you are unable to attend your scheduled session, please contact our reception via phone or WhatsApp as early as possible so that your appointment slot can be reallocated to another patient in need.
            </p>
          </div>

          <div className="mt-6 border-t border-line/60 pt-3 text-[11px] text-muted flex items-center justify-between">
            <span>To reschedule or cancel:</span>
            <span className="font-semibold text-pine-700">Call 07737 610615</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

