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
      <Reveal className="shell glass mt-10 max-w-4xl space-y-4 rounded-3xl p-6 text-[17px] leading-relaxed text-white/80 sm:p-10">
        {p.body?.split('\n').filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
        <p>Contact: <a href={`mailto:${settings.email}`} className="text-aqua-300 underline">{settings.email}</a></p>
      </Reveal>
    </>
  )
}
