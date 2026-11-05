import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import PageContent from './PageContent'
import Enquiries from './Enquiries'
import ClinicDetails from './ClinicDetails'
import SiteSettings from './SiteSettings'
import {
  AdminServices,
  AdminTeam,
  AdminFaqs,
  AdminTestimonials,
  AdminUsers,
  AdminAccreditations,
  AdminTrustBadges,
  AdminPricing,
  AdminInsurers,
  AdminLocations,
} from './ContentPages'

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
      intro="Hero text, trust & accreditations, testimonials, FAQ and other page texts."
      tabs={[
        { key: 'home', label: 'Homepage', el: <PageContent page="home" /> },
        { key: 'accreditations', label: 'Accreditations', el: <AdminAccreditations /> },
        { key: 'trust', label: 'Trust Badges / USPs', el: <AdminTrustBadges /> },
        { key: 'testimonials', label: 'Testimonials', el: <AdminTestimonials /> },
        { key: 'faq', label: 'FAQ', el: <AdminFaqs /> },
        { key: 'faq-page', label: 'FAQ page text', el: <PageContent page="faq" /> },
        { key: 'privacy', label: 'Privacy Policy', el: <PageContent page="privacy" /> },
      ]}
    />
  )
}

export function TrustSectionAdmin() {
  return (
    <Section
      title="Trust & Accreditations"
      intro="Manage professional registrations (HCPC, CSP, AACP) and micro-trust statements (24h appointments, self-referral, free parking)."
      tabs={[
        { key: 'accreditations', label: 'Accreditations (HCPC, CSP, AACP)', el: <AdminAccreditations /> },
        { key: 'trust', label: 'Micro-Trust Badges / USPs', el: <AdminTrustBadges /> },
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
      title="Services & Treatments"
      intro="Add, edit or remove treatments, session pricing, private medical insurers, and clinic policies."
      tabs={[
        { key: 'list', label: 'Services', el: <AdminServices /> },
        { key: 'pricing', label: 'Pricing & Fees', el: <AdminPricing /> },
        { key: 'insurers', label: 'Private Medical Insurers', el: <AdminInsurers /> },
        { key: 'page', label: 'Services & Policy Texts', el: <PageContent page="services" /> },
      ]}
    />
  )
}

export function PricingSectionAdmin() {
  return (
    <Section
      title="Pricing, Insurers & Policies"
      intro="Manage treatment fees, appointment durations, private medical insurers, and payment / cancellation policies."
      tabs={[
        { key: 'pricing', label: 'Pricing Plans', el: <AdminPricing /> },
        { key: 'insurers', label: 'Private Medical Insurers', el: <AdminInsurers /> },
        { key: 'policies', label: 'Payment & Cancellation Policies', el: <PageContent page="services" /> },
      ]}
    />
  )
}

export function LocationsSectionAdmin() {
  return (
    <Section
      title="Clinic Locations"
      intro="Manage practice locations and clinic branches. Active locations appear on the Contact page and Footer with their address, contact details, opening hours, directions links, and interactive Google maps."
      tabs={[
        { key: 'locations', label: 'Practice Locations', el: <AdminLocations /> },
      ]}
    />
  )
}

export function ContactSection() {
  return (
    <Section
      title="Contact, Locations & Enquiries"
      intro="Manage clinic locations, website enquiries, contact details, opening hours and Google Map."
      tabs={[
        { key: 'locations', label: 'Clinic Locations', el: <AdminLocations /> },
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
