import { servicesApi, teamApi, faqsApi, testimonialsApi, accreditationsApi, trustBadgesApi, pricingApi, insurersApi, locationsApi, usersApi } from '../../api/endpoints'
import { SERVICE_ICONS } from '../../components/Icon'
import { TrustBadgeIcon } from '../../components/TrustSection'
import CrudPage from '../../components/CrudPage'

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export function AdminServices() {
  // slug khali ho to title se bana do
  const api = {
    ...servicesApi,
    create: (b) => servicesApi.create({ ...b, slug: b.slug || slugify(b.title) }),
    update: (id, b) => servicesApi.update(id, { ...b, slug: b.slug || slugify(b.title) }),
  }
  return (
    <CrudPage
      title="Services & Treatments"
      intro="Describe the care you provide. Avoid promising cures or guaranteed results (UK CAP Code / ASA)."
      api={api}
      sortBy="order"
      newLabel="Add service"
      columns={[
        { key: 'order', label: '#' },
        {
          key: 'title',
          label: 'Service',
          render: (s) => (
            <span className="flex items-center gap-3">
              {s.image && <img src={s.image} alt="" className="size-10 rounded-md object-cover" />}
              <span className="font-medium">{s.title}</span>
            </span>
          ),
        },
        { key: 'summary', label: 'Summary', render: (s) => <span className="text-muted">{s.summary}</span> },
      ]}
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'slug', label: 'Page URL', help: 'Leave blank to create it from the title, e.g. exercise-therapy' },
        { name: 'summary', label: 'Short summary (shown on cards)', required: true },
        { name: 'provider', label: 'Provider / Qualification Note', help: 'e.g. Performed by an AACP-registered Chartered Physiotherapist' },
        { name: 'body', label: 'Full description', type: 'textarea', help: 'Leave an empty line between paragraphs.' },
        { name: 'helpsWith', label: '“May form part of care for” list (one per line)', type: 'list' },
        { name: 'image', label: 'Photo', type: 'image' },
        { name: 'icon', label: 'Icon (shown if there is no photo)', type: 'select', options: Object.keys(SERVICE_ICONS), default: 'HeartPulse' },
        { name: 'order', label: 'Display order', type: 'number', default: 10 },
      ]}
    />
  )
}

export function AdminTeam() {
  return (
    <CrudPage
      title="Team"
      intro="Named practitioners shown on the About & Team page, with HCPC / CSP badges."
      api={teamApi}
      sortBy="order"
      newLabel="Add practitioner"
      columns={[
        {
          key: 'name',
          label: 'Name',
          render: (m) => (
            <span className="flex items-center gap-3">
              {m.photo && <img src={m.photo} alt="" className="size-10 rounded-full object-cover" />}
              <span className="font-medium">{m.name}</span>
            </span>
          ),
        },
        { key: 'role', label: 'Role' },
        { key: 'hcpc', label: 'HCPC no.' },
        { key: 'csp', label: 'CSP', render: (m) => (m.csp ? 'Yes' : '—') },
      ]}
      fields={[
        { name: 'name', label: 'Full name', required: true },
        { name: 'role', label: 'Role / job title', required: true },
        { name: 'qualifications', label: 'Qualifications' },
        { name: 'hcpc', label: 'HCPC registration number' },
        { name: 'csp', label: 'Member of the Chartered Society of Physiotherapy (MCSP)', type: 'checkbox' },
        { name: 'photo', label: 'Photo', type: 'image' },
        { name: 'bio', label: 'Short bio', type: 'textarea' },
        { name: 'order', label: 'Display order', type: 'number', default: 10 },
      ]}
    />
  )
}

export function AdminFaqs() {
  return (
    <CrudPage
      title="FAQs"
      intro="Questions and answers shown on the FAQ page. Keep answers short and general - no medical advice or guaranteed results."
      api={faqsApi}
      sortBy="order"
      newLabel="Add question"
      columns={[
        { key: 'order', label: '#' },
        { key: 'q', label: 'Question', render: (f) => <span className="font-medium">{f.q}</span> },
        { key: 'a', label: 'Answer', render: (f) => <span className="line-clamp-2 text-muted">{f.a}</span> },
      ]}
      fields={[
        { name: 'q', label: 'Question', required: true },
        { name: 'a', label: 'Answer', type: 'textarea', required: true },
        { name: 'order', label: 'Display order', type: 'number', default: 10 },
      ]}
    />
  )
}

export function AdminTestimonials() {
  return (
    <CrudPage
      title="Testimonials"
      intro="Patient reviews shown on the Home page. Only add genuine reviews you have permission to use (for example from Google), and do not edit their meaning (UK CAP Code / ASA). If the list is empty the section is hidden."
      api={testimonialsApi}
      sortBy="order"
      newLabel="Add testimonial"
      columns={[
        { key: 'name', label: 'Name', render: (t) => <span className="font-medium">{t.name}</span> },
        { key: 'text', label: 'Review', render: (t) => <span className="line-clamp-2 text-muted">{t.text}</span> },
        { key: 'rating', label: 'Stars', render: (t) => '★'.repeat(Math.max(0, Math.min(5, t.rating || 0))) || '—' },
      ]}
      fields={[
        { name: 'name', label: 'Patient name (or initials)', required: true },
        { name: 'text', label: 'Review text', type: 'textarea', required: true },
        { name: 'rating', label: 'Star rating (1-5)', type: 'number', default: 5 },
        { name: 'source', label: 'Source / date', help: 'e.g. Google review, March 2026' },
        { name: 'photo', label: 'Photo (optional)', type: 'image' },
        { name: 'order', label: 'Display order', type: 'number', default: 10 },
      ]}
    />
  )
}

export function AdminUsers() {
  return (
    <CrudPage
      title="Users & roles"
      intro="One sign-in page for everyone. Create an account with the person's email and a password, then tell them privately. Admin: full access. Staff (Content Editor): can edit page text, images, services, team, contact details & hours and view enquiries - cannot change theme, general settings or users, and cannot delete anything."
      api={usersApi}
      newLabel="Add user"
      columns={[
        { key: 'name', label: 'Name', render: (u) => <span className="font-medium">{u.name}</span> },
        { key: 'email', label: 'Email' },
        {
          key: 'role',
          label: 'Role',
          render: (u) => (
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.role === 'admin' ? 'bg-pine-700 text-white' : 'bg-pine-50 text-pine-700'}`}>
              {u.role === 'admin' ? 'Admin' : 'Staff'}
            </span>
          ),
        },
        {
          key: 'active',
          label: 'Status',
          render: (u) => (u.active === false ? <span className="text-red-700">Disabled</span> : <span className="text-muted">Active</span>),
        },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'email', label: 'Email (used to sign in)', required: true },
        { name: 'role', label: 'Role', type: 'select', options: ['editor', 'admin'], default: 'editor', help: 'editor = Staff / Content Editor (restricted). admin = full access.' },
        { name: 'password', label: 'Password', type: 'password', required: true, help: 'At least 10 characters with letters and numbers. When editing, leave blank to keep the current password, or type a new one to reset it.' },
        { name: 'active', label: 'Account active (untick to block sign-in immediately)', type: 'checkbox', default: true },
      ]}
    />
  )
}

export function AdminAccreditations() {
  return (
    <CrudPage
      title="Accreditations & Professional Registrations"
      intro="Official professional bodies (e.g. HCPC, CSP, AACP) displayed on the homepage trust strip and global footer. Upload approved official logos or leave blank to display an elegant text badge placeholder."
      api={accreditationsApi}
      sortBy="order"
      newLabel="Add accreditation"
      columns={[
        { key: 'order', label: '#' },
        {
          key: 'name',
          label: 'Organisation',
          render: (a) => (
            <span className="flex items-center gap-3">
              {a.logoUrl ? (
                <img src={a.logoUrl} alt={a.name} className="h-9 w-14 rounded border border-line bg-white object-contain p-1" />
              ) : (
                <span className="grid h-9 w-14 place-items-center rounded border border-line bg-pine-50 font-mono text-xs font-bold text-pine-800">
                  {a.name}
                </span>
              )}
              <div>
                <p className="font-medium text-ink">{a.name}</p>
                {a.fullName && <p className="text-xs text-muted">{a.fullName}</p>}
              </div>
            </span>
          ),
        },
        { key: 'description', label: 'Description', render: (a) => <span className="line-clamp-2 text-muted">{a.description || '—'}</span> },
        {
          key: 'active',
          label: 'Status',
          render: (a) =>
            a.active !== false ? (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                Active
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                Hidden
              </span>
            ),
        },
      ]}
      fields={[
        { name: 'name', label: 'Organisation Acronym / Short Name (e.g. HCPC)', required: true },
        { name: 'fullName', label: 'Full Organisation Name (e.g. Health & Care Professions Council)' },
        { name: 'logoUrl', label: 'Official Logo (leave blank for text-based placeholder)', type: 'image' },
        { name: 'description', label: 'Description / Purpose', type: 'textarea' },
        { name: 'active', label: 'Active (shown on website)', type: 'checkbox', default: true },
        { name: 'order', label: 'Display order (1, 2, 3...)', type: 'number', default: 10 },
      ]}
    />
  )
}

export function AdminTrustBadges() {
  return (
    <CrudPage
      title="Micro-Trust Badges / USPs"
      intro="Highlight clinic key selling points directly under the Hero (e.g. 24h appointments, self-referral, free parking)."
      api={trustBadgesApi}
      sortBy="order"
      newLabel="Add trust badge"
      columns={[
        { key: 'order', label: '#' },
        {
          key: 'message',
          label: 'Message',
          render: (b) => (
            <span className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-lg border border-pine-100 bg-pine-50 text-pine-700">
                <TrustBadgeIcon name={b.icon} className="size-4" />
              </span>
              <span className="font-medium text-ink">{b.message}</span>
            </span>
          ),
        },
        { key: 'icon', label: 'Icon' },
        {
          key: 'active',
          label: 'Status',
          render: (b) =>
            b.active !== false ? (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                Active
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                Hidden
              </span>
            ),
        },
      ]}
      fields={[
        { name: 'message', label: 'Statement / Promise', required: true, help: 'Exact client wording e.g. Appointments available within 24 hours' },
        {
          name: 'icon',
          label: 'Icon',
          type: 'select',
          options: ['Clock', 'UserCheck', 'Car', 'ShieldCheck', 'Award', 'HeartPulse'],
          default: 'Clock',
        },
        { name: 'active', label: 'Active (shown on website)', type: 'checkbox', default: true },
        { name: 'order', label: 'Display order (1, 2, 3...)', type: 'number', default: 10 },
      ]}
    />
  )
}

export function AdminPricing() {
  return (
    <CrudPage
      title="Pricing & Session Breakdown"
      intro="Manage clinic treatment fees, appointment durations and home visit radius charges. Stored in GBP (£) with live updates on the public website."
      api={pricingApi}
      sortBy="order"
      newLabel="Add pricing plan"
      columns={[
        { key: 'order', label: '#' },
        {
          key: 'name',
          label: 'Plan / Treatment',
          render: (p) => (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-ink">{p.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    p.category === 'home_visit'
                      ? 'border border-sky-200 bg-sky-50 text-sky-800'
                      : 'border border-pine-200 bg-pine-50 text-pine-800'
                  }`}
                >
                  {p.category === 'home_visit' ? 'Home Visit' : 'In-Clinic'}
                </span>
              </div>
              {p.notes && <p className="mt-0.5 text-xs text-muted line-clamp-1">{p.notes}</p>}
            </div>
          ),
        },
        { key: 'duration', label: 'Duration' },
        {
          key: 'price',
          label: 'Price (GBP)',
          render: (p) => <span className="font-mono font-bold text-ink">£{p.price}</span>,
        },
        {
          key: 'active',
          label: 'Status',
          render: (p) =>
            p.active !== false ? (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                Active
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                Hidden
              </span>
            ),
        },
      ]}
      fields={[
        { name: 'name', label: 'Plan / Treatment Name', required: true, help: 'e.g. Initial Assessment & Treatment, Follow-up Appointment' },
        { name: 'duration', label: 'Session Duration', required: true, help: 'e.g. 45 minutes, 30 minutes' },
        { name: 'price', label: 'Price in GBP (£)', type: 'number', required: true, help: 'Numeric amount (e.g. 50, 45, 80, 130)' },
        {
          name: 'category',
          label: 'Service Category',
          type: 'select',
          options: ['clinic', 'home_visit'],
          default: 'clinic',
          help: 'clinic = In-Clinic Appointment, home_visit = Home Visit Care',
        },
        { name: 'notes', label: 'Notes & Distance Coverage', type: 'textarea', help: 'e.g. Full history, physical assessment, and first treatment plan. / Up to a 10-mile radius from clinic.' },
        { name: 'active', label: 'Active (shown on public website)', type: 'checkbox', default: true },
        { name: 'order', label: 'Display order (1, 2, 3...)', type: 'number', default: 10 },
      ]}
    />
  )
}

export function AdminInsurers() {
  return (
    <CrudPage
      title="Private Medical Insurers"
      intro="Manage accepted private medical insurers shown on the Services & Treatments page. Patients must obtain pre-authorisation before booking for direct clinic billing. Verified logos can be uploaded via the Media Library or entered as URLs; if no logo is uploaded, a clean typographic badge is displayed."
      api={insurersApi}
      sortBy="order"
      newLabel="Add insurer"
      columns={[
        { key: 'order', label: '#' },
        {
          key: 'name',
          label: 'Insurer',
          render: (ins) => (
            <div className="flex items-center gap-3">
              {ins.logoUrl ? (
                <img src={ins.logoUrl} alt="" className="h-8 max-w-[80px] rounded object-contain bg-sand/30 p-1" />
              ) : (
                <span className="grid size-8 place-items-center rounded bg-pine-50 text-xs font-bold text-pine-800">
                  {ins.name.substring(0, 3).toUpperCase()}
                </span>
              )}
              <div>
                <span className="font-medium text-ink">{ins.name}</span>
                {ins.notes && <p className="text-xs text-muted line-clamp-1">{ins.notes}</p>}
              </div>
            </div>
          ),
        },
        {
          key: 'active',
          label: 'Status',
          render: (ins) =>
            ins.active !== false ? (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                Active
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                Hidden
              </span>
            ),
        },
      ]}
      fields={[
        { name: 'name', label: 'Insurer Name', required: true, help: 'e.g. Bupa, AXA Health, Aviva, Vitality' },
        { name: 'logoUrl', label: 'Official Logo URL / Upload', type: 'image', help: 'Upload official logo or leave blank to display verified insurer name' },
        { name: 'notes', label: 'Internal / Patient Notes', type: 'textarea', help: 'e.g. Recognized provider; requires valid pre-authorisation number' },
        { name: 'active', label: 'Active (shown on public website)', type: 'checkbox', default: true },
        { name: 'order', label: 'Display order (1, 2, 3...)', type: 'number', default: 10 },
      ]}
    />
  )
}

export function AdminLocations() {
  return (
    <CrudPage
      title="Clinic Locations"
      intro="Manage practice locations and clinic branches. Active locations appear on the Contact page with direct contact links, formatted opening hours, directions links, and interactive Google maps. Delete is restricted to Administrators only."
      api={locationsApi}
      sortBy="order"
      newLabel="Add location"
      columns={[
        { key: 'order', label: '#' },
        {
          key: 'name',
          label: 'Location / Clinic',
          render: (loc) => (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-ink">{loc.name}</span>
                {loc.postcode && (
                  <span className="rounded border border-line bg-sand/40 px-1.5 py-0.5 font-mono text-[11px] text-muted">
                    {loc.postcode}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted line-clamp-1">{loc.address}</p>
            </div>
          ),
        },
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
        {
          key: 'active',
          label: 'Status',
          render: (loc) =>
            loc.active !== false ? (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                Active
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                Hidden
              </span>
            ),
        },
      ]}
      fields={[
        { name: 'name', label: 'Location / Clinic Name', required: true, help: 'e.g. DeePhysio Smethwick' },
        { name: 'address', label: 'Full Address', required: true, help: 'e.g. 7 Frank Road, Smethwick, Birmingham' },
        { name: 'postcode', label: 'Postcode', help: 'e.g. B67 7NR' },
        { name: 'phone', label: 'Phone Number', help: 'e.g. 077 3761 0615' },
        { name: 'email', label: 'Email Address', help: 'e.g. deephysioclinic@gmail.com' },
        {
          name: 'hours',
          label: 'Opening Hours',
          type: 'textarea',
          help: 'One schedule per line, e.g.\nMonday–Friday: 09:00–17:00\nSaturday: 09:00–15:00\nSunday: Closed',
        },
        {
          name: 'mapUrl',
          label: 'Google Maps Embed URL',
          help: 'https://www.google.com/maps?q=...&output=embed',
        },
        {
          name: 'directionsUrl',
          label: 'Get Directions URL',
          help: 'https://www.google.com/maps/dir/?api=1&destination=...',
        },
        { name: 'active', label: 'Active (shown on public website)', type: 'checkbox', default: true },
        { name: 'order', label: 'Display order (1, 2, 3...)', type: 'number', default: 10 },
      ]}
    />
  )
}
