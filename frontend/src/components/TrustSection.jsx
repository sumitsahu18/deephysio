import { Clock, UserCheck, Car, ShieldCheck, Award, HeartPulse, CheckCircle2 } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import Reveal from './Reveal'

export function TrustBadgeIcon({ name = 'Clock', className = 'size-5' }) {
  switch (name) {
    case 'Clock':
      return <Clock className={className} />
    case 'UserCheck':
      return <UserCheck className={className} />
    case 'Car':
      return <Car className={className} />
    case 'ShieldCheck':
      return <ShieldCheck className={className} />
    case 'Award':
      return <Award className={className} />
    case 'HeartPulse':
      return <HeartPulse className={className} />
    default:
      return <CheckCircle2 className={className} />
  }
}

export default function TrustSection() {
  const { accreditations, trustBadges } = useSite()

  const activeBadges = (trustBadges || [])
    .filter((b) => b.active !== false)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  const activeAccreditations = (accreditations || [])
    .filter((a) => a.active !== false)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  return (
    <section className="shell mt-6 space-y-6" aria-label="Trust & Accreditations">
      {/* 1. Micro-Trust Badges / USPs */}
      {activeBadges.length > 0 && (
        <Reveal anim="fade" className="glass glow-hover rounded-2xl border border-line bg-white/80 p-3 sm:p-4 backdrop-blur-md shadow-xs">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 sm:divide-x sm:divide-line/70">
            {activeBadges.map((badge, idx) => (
              <div
                key={badge._id || badge.message}
                className={`flex items-center gap-3.5 px-3 py-2 ${idx > 0 ? 'sm:pl-6' : ''}`}
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-pine-100 bg-pine-50/80 text-pine-700 shadow-xs">
                  <TrustBadgeIcon name={badge.icon} className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold tracking-tight text-ink sm:text-[14.5px]">
                    {badge.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {/* 2. Homepage Trust & Accreditation Strip */}
      {activeAccreditations.length > 0 && (
        <div className="rounded-3xl border border-line bg-gradient-to-b from-white/90 to-sand/40 p-6 sm:p-8 backdrop-blur-md shadow-xs">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow inline-flex items-center gap-1.5 rounded-full border border-pine-100 bg-pine-50/70 px-3 py-1 text-[11px] font-semibold text-pine-700">
              <ShieldCheck className="size-3.5 text-pine-600" /> Professional Standards
            </span>
            <h2 className="mt-2.5 font-glass text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Accredited & Regulated Practice
            </h2>
            <p className="mt-1 text-xs text-muted sm:text-sm">
              Our practitioners are registered with and regulated by recognised UK healthcare bodies.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {activeAccreditations.map((item, idx) => (
              <Reveal
                key={item._id || item.name}
                delay={idx * 80}
                className="group flex flex-col justify-between rounded-2xl border border-line bg-white/95 p-5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-pine-300 hover:shadow-md"
              >
                <div>
                  <div className="flex h-14 items-center justify-start">
                    {item.logoUrl ? (
                      <img
                        src={item.logoUrl}
                        alt={`${item.name} logo`}
                        className="max-h-12 max-w-[160px] object-contain transition-transform duration-200 group-hover:scale-102"
                      />
                    ) : (
                      /* Professional text-based placeholder (when client has not uploaded official image) */
                      <div className="inline-flex items-center gap-2 rounded-lg border border-line bg-pine-50/90 px-3 py-1.5 shadow-xs">
                        <ShieldCheck className="size-4 text-pine-700" />
                        <span className="font-mono text-sm font-bold tracking-wider text-pine-900">
                          {item.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="mt-3 text-base font-semibold text-ink">
                    {item.name}
                    {item.fullName && item.fullName !== item.name && (
                      <span className="block text-xs font-normal text-muted mt-0.5 leading-snug">
                        {item.fullName}
                      </span>
                    )}
                  </h3>

                  {item.description && (
                    <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-1.5 border-t border-line/60 pt-3 text-[11px] font-medium text-pine-700">
                  <CheckCircle2 className="size-3.5" />
                  <span>Verified Registration</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

