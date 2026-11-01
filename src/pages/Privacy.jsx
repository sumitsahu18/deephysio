import { useSite } from '../context/SiteContext'
import PageHeader from '../components/PageHeader'

// Placeholder - client se asli privacy policy text lena (UK GDPR compliant)
export default function Privacy() {
  const { settings } = useSite()
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy policy" />
      <section className="py-16">
        <div className="container-x max-w-3xl space-y-4 leading-relaxed text-ink/85">
          <p>
            This is placeholder text. {settings.legalName} should supply its own privacy policy covering how enquiry
            details are collected, stored, used and deleted under UK GDPR.
          </p>
          <p>
            Our enquiry form only collects your name, contact details, preferred contact time and message, which are used
            solely to respond to your enquiry.
          </p>
          <p>Contact: {settings.email}</p>
        </div>
      </section>
    </>
  )
}
