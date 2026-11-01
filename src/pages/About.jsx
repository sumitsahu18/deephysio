import { ShieldCheck, Award, Languages } from 'lucide-react'
import { teamApi } from '../api/endpoints'
import { useSite } from '../context/SiteContext'
import useFetch from '../hooks/useFetch'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import Spinner from '../components/Spinner'

function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
}

export default function About() {
  const { settings } = useSite()
  const { data: team, loading } = useFetch(teamApi.list)

  return (
    <>
      <PageHeader
        eyebrow="About & Team"
        title="Experienced, registered physiotherapists who take time to explain"
        intro={`${settings.clinicName} is an independent clinic in Smethwick. We focus on clear explanations, hands-on care and plans you can follow at home.`}
      />

      <section className="py-16">
        <div className="container-x grid gap-5 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'HCPC registered', text: 'Every practitioner is registered with the Health & Care Professions Council, the UK regulator.' },
            { icon: Award, title: 'Chartered (CSP)', text: 'Members of the Chartered Society of Physiotherapy, the professional body for UK physiotherapists.' },
            { icon: Languages, title: 'Multilingual care', text: `Consultations available in ${settings.languages?.join(', ')}.` },
          ].map(({ icon: I, title, text }, i) => (
            <Reveal key={title} delay={i * 80} className="card p-6">
              <I className="size-7 text-pine-700" strokeWidth={1.75} />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Meet the team</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Your physiotherapists</h2>
          </Reveal>

          {loading ? (
            <Spinner />
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {team?.map((m, i) => (
                <Reveal key={m._id} delay={i * 100} className="card flex flex-col gap-5 p-6 sm:flex-row">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} className="size-24 shrink-0 rounded-2xl object-cover" />
                  ) : (
                    <div className="grid size-24 shrink-0 place-items-center rounded-2xl bg-pine-50 font-display text-3xl text-pine-700">
                      {initials(m.name)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{m.name}</h3>
                    <p className="text-sm font-medium text-pine-700">{m.role}</p>
                    <p className="mt-1 text-sm text-muted">{m.qualifications}</p>
                    <p className="mt-3 text-sm leading-relaxed text-ink/80">{m.bio}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {m.hcpc && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-pine-50 px-3 py-1 text-xs font-semibold text-pine-700">
                          <ShieldCheck className="size-3.5" /> HCPC {m.hcpc}
                        </span>
                      )}
                      {m.csp && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink">
                          <Award className="size-3.5" /> MCSP
                        </span>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
