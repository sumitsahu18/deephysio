import { servicesApi, teamApi, faqsApi, testimonialsApi, usersApi } from '../../api/endpoints'
import { SERVICE_ICONS } from '../../components/Icon'
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
      intro="Admin: full access. Staff (Content Editor): can edit page text, images, services, team, contact details & hours, and view enquiries. Staff cannot change theme colours, general settings or users, and cannot delete anything."
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
              {u.role === 'admin' ? 'Admin' : 'Content Editor'}
            </span>
          ),
        },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'email', label: 'Email', required: true },
        { name: 'role', label: 'Role', type: 'select', options: ['editor', 'admin'], default: 'editor', help: 'editor = Staff / Content Editor (restricted)' },
        { name: 'password', label: 'Password', type: 'password', required: true },
      ]}
    />
  )
}
