import { Link } from 'react-router-dom'
import { ShieldCheck, Award, ArrowRight, UserRound } from 'lucide-react'
import { teamApi } from '../api/endpoints'
import { useSite } from '../context/SiteContext'
import useFetch from '../hooks/useFetch'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import Spinner from '../components/Spinner'
import { onImgError } from '../data/images'

// ABOUT & TEAM
// PDF 2.2 (2): professional qualifications, named practitioners, HCPC / CSP registration badges.

function initials(name = '') {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('')
}

export default function About() {
  const { pages } = useSite()
  const p = pages.about
  const { data: team, loading } = useFetch(teamApi.list)
  const sortedTeam = [...(team || [])].sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  return (
    <>
      <PageHeader title={p.title} intro={p.intro} image={p.headerImage} />

      {/* Our approach + credential badges */}
      <section className="shell mt-10 grid gap-6 lg:grid-cols-5">
        <Reveal anim="left" className="glass rounded-3xl p-6 sm:p-9 lg:col-span-3">
          <p className="eyebrow-glass">About us</p>
          <h2 className="mt-2 font-glass text-3xl font-semibold">{p.bodyTitle}</h2>
          <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-white/80">
            {p.body?.split('\n').filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
          </div>
        </Reveal>

        <Reveal anim="right" className="space-y-5 lg:col-span-2">
          <h3 className="px-1 font-glass text-xl font-semibold">{p.credentialsTitle}</h3>
          {[
            { icon: ShieldCheck, badge: 'HCPC', title: 'Health & Care Professions Council', text: p.hcpcText, tone: 'grad-lagoon' },
            { icon: Award, badge: 'CSP', title: 'Chartered Society of Physiotherapy', text: p.cspText, tone: 'grad-aurora' },
          ].map(({ icon: I, badge, title, text, tone }) => (
            <div key={badge} className={`${tone} glow-hover flex gap-4 rounded-3xl border border-white/20 p-6`}>
              <span className="grid size-14 shrink-0 place-items-center rounded-full border border-white/40 bg-white/20">
                <I className="size-6" />
              </span>
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] text-white/80">{badge} REGISTERED</p>
                <p className="mt-1 font-glass text-lg font-semibold">{title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/90">{text}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Named practitioners */}
      <section className="shell mt-16">
        <SectionTitle eyebrow="Our team" title={p.teamTitle} />
        {loading ? (
          <Spinner />
        ) : (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {sortedTeam.map((m, i) => (
              <Reveal key={m._id} delay={(i % 3) * 100} className="glass glow-hover group overflow-hidden rounded-3xl">
                <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-white/5">
                  <span className="grid size-24 place-items-center rounded-full border-2 border-white/30 bg-white/10 font-glass text-3xl font-semibold">
                    {initials(m.name) || <UserRound className="size-10" />}
                  </span>
                  {m.photo && (
                    <img src={m.photo} alt={m.name} onError={onImgError} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-glass text-xl font-semibold">{m.name}</h3>
                  <p className="mt-0.5 font-medium text-aqua-300">{m.role}</p>
                  {m.qualifications && <p className="mt-1 text-sm text-white/60">{m.qualifications}</p>}
                  {m.bio && <p className="mt-4 leading-relaxed text-white/80">{m.bio}</p>}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {m.hcpc && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                        <ShieldCheck className="size-3.5 text-aqua-300" /> HCPC {m.hcpc}
                      </span>
                    )}
                    {m.csp && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold">
                        <Award className="size-3.5 text-violet-300" /> MCSP
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="mt-10 text-center">
          <Link to="/contact#enquiry" className="btn-white px-8 py-3.5 text-base">
            Book Appointment <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </section>
    </>
  )
}
