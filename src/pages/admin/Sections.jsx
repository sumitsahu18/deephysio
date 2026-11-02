import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import PageContent from './PageContent'
import Enquiries from './Enquiries'
import ClinicDetails from './ClinicDetails'
import SiteSettings from './SiteSettings'
import { AdminServices, AdminTeam, AdminFaqs, AdminTestimonials, AdminUsers } from './ContentPages'

// ONE admin dashboard: har sidebar item ek "section" hai, andar simple tabs.
// Tab URL mein (?tab=...) rehta hai, taaki refresh / link par wahi tab khule.
function Section({ title, intro, tabs }) {
  const { can } = useAuth()
  const [params, setParams] = useSearchParams()
  const visible = tabs.filter((t) => !t.perm || can(t.perm))
  const active = visible.find((t) => t.key === params.get('tab')) || visible[0]

  return (
    <div>
      <h1 className="font-glass text-3xl font-semibold">{title}</h1>
      {intro && <p className="mt-1 text-muted">{intro}</p>}

      {visible.length > 1 && (
        <div className="glass-soft mt-6 flex max-w-full flex-wrap gap-1 rounded-2xl p-1.5 sm:inline-flex sm:rounded-full" role="tablist">
          {visible.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={active.key === t.key}
              onClick={() => setParams({ tab: t.key }, { replace: true })}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                active.key === t.key ? 'bg-pine-700' : 'text-white/75 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6" key={active.key}>
        {active.el}
      </div>
    </div>
  )
}

export function HomepageSection() {
  return (
    <Section
      title="Homepage & Pages"
      intro="Hero text, conditions treated, buttons, photos and the other page texts."
      tabs={[
        { key: 'home', label: 'Homepage', el: <PageContent page="home" /> },
        { key: 'testimonials', label: 'Testimonials', el: <AdminTestimonials /> },
        { key: 'faq', label: 'FAQ', el: <AdminFaqs /> },
        { key: 'faq-page', label: 'FAQ page text', el: <PageContent page="faq" /> },
        { key: 'privacy', label: 'Privacy Policy', el: <PageContent page="privacy" /> },
      ]}
    />
  )
}

export function AboutSection() {
  return (
    <Section
      title="About & Team"
      intro="Clinic introduction, HCPC / CSP text and practitioner profiles."
      tabs={[
        { key: 'team', label: 'Team members', el: <AdminTeam /> },
        { key: 'about', label: 'About page text', el: <PageContent page="about" /> },
      ]}
    />
  )
}

export function ServicesSection() {
  return (
    <Section
      title="Services"
      intro="Add, edit or remove treatments. Describe the care - avoid promising cures or guaranteed results."
      tabs={[
        { key: 'list', label: 'Services', el: <AdminServices /> },
        { key: 'page', label: 'Services page text', el: <PageContent page="services" /> },
      ]}
    />
  )
}

export function ContactSection() {
  return (
    <Section
      title="Contact & Enquiries"
      intro="Website enquiries, email, address, opening hours and Google Map."
      tabs={[
        { key: 'enquiries', label: 'Enquiries', el: <Enquiries /> },
        { key: 'details', label: 'Contact details & hours', el: <ClinicDetails /> },
        { key: 'page', label: 'Contact page text', el: <PageContent page="contact" /> },
      ]}
    />
  )
}

export function GeneralSection() {
  return (
    <Section
      title="General Settings"
      intro="Admin only. Business details, footer, social links and who can log in."
      tabs={[
        { key: 'site', label: 'Site details', el: <SiteSettings /> },
        { key: 'users', label: 'Users & roles', perm: 'users', el: <AdminUsers /> },
      ]}
    />
  )
}
