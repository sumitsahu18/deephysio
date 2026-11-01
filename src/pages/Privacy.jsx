import { useSite } from '../context/SiteContext'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'

// Enquiry form ke consent checkbox ke liye zaroori (UK GDPR). Text Admin > Page content se.
export default function Privacy() {
  const { pages, settings } = useSite()
  const p = pages.privacy
  return (
    <>
      <PageHeader title={p.title} image={pages.about.headerImage} />
      <section className="bg-white py-16">
        <Reveal className="container-x max-w-3xl space-y-4 text-lg leading-relaxed text-ink/85">
          {p.body?.split('\n').filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
          <p>Contact: <a href={`mailto:${settings.email}`} className="text-pine-700 underline">{settings.email}</a></p>
        </Reveal>
      </section>
    </>
  )
}
