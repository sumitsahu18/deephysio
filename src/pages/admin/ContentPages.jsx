import { servicesApi, teamApi, faqsApi, usersApi } from '../../api/endpoints'
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
      title="Treatments"
      intro="Describe care, avoid medical claims (UK CAP Code / ASA)."
      api={api}
      sortBy="order"
      newLabel="Add treatment"
      columns={[
        { key: 'order', label: '#' },
        { key: 'title', label: 'Title', render: (s) => <span className="font-medium">{s.title}</span> },
        { key: 'summary', label: 'Summary', render: (s) => <span className="text-muted">{s.summary}</span> },
      ]}
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'slug', label: 'URL slug', help: 'Leave blank to generate from the title, e.g. manual-therapy' },
        { name: 'summary', label: 'Short summary', required: true },
        { name: 'body', label: 'Full description', type: 'textarea' },
        { name: 'helpsWith', label: 'May be used for (one per line)', type: 'list' },
        { name: 'icon', label: 'Icon', type: 'select', options: Object.keys(SERVICE_ICONS), default: 'HeartPulse' },
        { name: 'order', label: 'Display order', type: 'number', default: 10 },
      ]}
    />
  )
}

export function AdminTeam() {
  return (
    <CrudPage
      title="Team"
      intro="Practitioners shown on the About & Team page."
      api={teamApi}
      newLabel="Add team member"
      columns={[
        { key: 'name', label: 'Name', render: (m) => <span className="font-medium">{m.name}</span> },
        { key: 'role', label: 'Role' },
        { key: 'hcpc', label: 'HCPC no.' },
      ]}
      fields={[
        { name: 'name', label: 'Full name', required: true },
        { name: 'role', label: 'Role / title', required: true },
        { name: 'qualifications', label: 'Qualifications' },
        { name: 'hcpc', label: 'HCPC registration number' },
        { name: 'csp', label: 'Member of the Chartered Society of Physiotherapy (MCSP)', type: 'checkbox' },
        { name: 'photo', label: 'Photo URL', help: 'Image upload backend ke saath add hoga' },
        { name: 'bio', label: 'Short bio', type: 'textarea' },
      ]}
    />
  )
}

export function AdminFaqs() {
  return (
    <CrudPage
      title="FAQs"
      api={faqsApi}
      newLabel="Add question"
      columns={[
        { key: 'q', label: 'Question', render: (f) => <span className="font-medium">{f.q}</span> },
        { key: 'a', label: 'Answer', render: (f) => <span className="text-muted">{f.a}</span> },
      ]}
      fields={[
        { name: 'q', label: 'Question', required: true },
        { name: 'a', label: 'Answer', type: 'textarea', required: true },
      ]}
    />
  )
}

export function AdminUsers() {
  return (
    <CrudPage
      title="Users & roles"
      intro="Admin: full access. Editor: can edit content and view enquiries, but not settings, users or deletions."
      api={usersApi}
      newLabel="Add user"
      columns={[
        { key: 'name', label: 'Name', render: (u) => <span className="font-medium">{u.name}</span> },
        { key: 'email', label: 'Email' },
        {
          key: 'role',
          label: 'Role',
          render: (u) => (
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${u.role === 'admin' ? 'bg-pine-700 text-white' : 'bg-pine-50 text-pine-700'}`}>
              {u.role}
            </span>
          ),
        },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'email', label: 'Email', required: true },
        { name: 'role', label: 'Role', type: 'select', options: ['editor', 'admin'], default: 'editor' },
        { name: 'password', label: 'Password', type: 'password', required: true },
      ]}
    />
  )
}
