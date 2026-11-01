import { Link } from 'react-router-dom'
import { ShieldCheck, Award, ArrowRight, UserRound } from 'lucide-react'
import { teamApi } from '../api/endpoints'
import { useSite } from '../context/SiteContext'
import useFetch from '../hooks/useFetch'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Spinner from '../components/Spinner'
import { onImgError } from '../data/images'

// ABOUT & TEAM
// PDF 2.2 (2): "Highlighting professional qualifications, named practitioners,
//               and HCPC / Chartered Society of Physiotherapy (CSP) registration badges."

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
      <section className="bg-white py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal anim="left">
            <p className="text-sm font-bold tracking-[0.2em] text-clay uppercase">About us</p>
            <h2 className="mt-3 text-4xl text-pine-900">{p.bodyTitle}</h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
              {p.body?.split('\n').filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </Reveal>

          <Reveal anim="right" className="space-y-5">
            <h3 className="text-2xl text-pine-900">{p.credentialsTitle}</h3>
            {[
              { icon: ShieldCheck, badge: 'HCPC', title: 'Health & Care Professions Council', text: p.hcpcText },
              { icon: Award, badge: 'CSP', title: 'Chartered Society of Physiotherapy', text: p.cspText },
            ].map(({ icon: I, badge, title, text }) => (
              <div key={badge} className="flex gap-5 rounded-md border border-line bg-sand p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                <span className="grid size-16 shrink-0 place-items-center rounded-full bg-pine-700 text-white">
                  <I className="size-7" />
                </span>
                <div>
                  <p className="text-xs font-black tracking-[0.2em] text-clay">{badge} REGISTERED</p>
                  <p className="mt-1 text-lg font-bold text-pine-900">{title}</p>
                  <p className="mt-1.5 leading-relaxed text-muted">{text}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Named practitioners */}
      <section className="bg-sand py-20">
        <div className="container-x">
          <Reveal className="text-center">
            <p className="text-sm font-bold tracking-[0.2em] text-clay uppercase">Our team</p>
            <h2 className="mt-3 text-4xl text-pine-900 sm:text-5xl">{p.teamTitle}</h2>
            <span className="mx-auto mt-5 block h-1 w-16 rounded-full bg-clay" />
          </Reveal>

          {loading ? (
            <Spinner />
          ) : (
            <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {sortedTeam.map((m, i) => (
                <Reveal key={m._id} delay={i * 120} className="group overflow-hidden rounded-md bg-white shadow-[0_10px_35px_-18px_rgba(27,68,103,0.35)] transition duration-500 hover:-translate-y-2">
                  <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-pine-50">
                    <span className="grid size-28 place-items-center rounded-full bg-pine-700 text-4xl font-bold text-white">
                      {initials(m.name) || <UserRound className="size-10" />}
                    </span>
                    {m.photo && (
                      <img src={m.photo} alt={m.name} onError={onImgError} loading="lazy" className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl text-pine-900">{m.name}</h3>
                    <p className="mt-1 font-medium text-pine-700">{m.role}</p>
                    {m.qualifications && <p className="mt-1 text-sm text-muted">{m.qualifications}</p>}
                    {m.bio && <p className="mt-4 leading-relaxed text-ink/80">{m.bio}</p>}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {m.hcpc && (
                        <span className="inline-flex items-center gap-1.5 rounded-sm bg-pine-700 px-3 py-1.5 text-xs font-bold text-white">
                          <ShieldCheck className="size-3.5" /> HCPC {m.hcpc}
                        </span>
                      )}
                      {m.csp && (
                        <span className="inline-flex items-center gap-1.5 rounded-sm bg-clay px-3 py-1.5 text-xs font-bold text-white">
                          <Award className="size-3.5" /> MCSP
                        </span>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal className="mt-14 text-center">
            <Link to="/contact#enquiry" className="btn-primary rounded-sm px-10 py-4 text-base">
              Book / Enquire <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
