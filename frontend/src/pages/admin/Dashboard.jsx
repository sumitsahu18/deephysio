import { Link } from 'react-router-dom'
import { ArrowRight, Inbox, Mail, Phone } from 'lucide-react'
import { enquiriesApi, servicesApi, teamApi, mediaApi } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import useFetch from '../../hooks/useFetch'
import Spinner from '../../components/Spinner'

// Simple home screen: kuch ginti + latest enquiries. Sections sidebar mein hain. Koi analytics nahi.
export default function Dashboard() {
  const { user } = useAuth()
  const { data, loading } = useFetch(() =>
    Promise.all([enquiriesApi.list(), servicesApi.list(), teamApi.list(), mediaApi.list()]).then(([enquiries, services, team, media]) => ({ enquiries, services, team, media })),
  )

  if (loading || !data) return <Spinner />
  const newCount = data.enquiries.filter((e) => e.status === 'new').length

  const stats = [
    { label: 'New enquiries', value: newCount, to: '/admin/contact?tab=enquiries' },
    { label: 'Services', value: data.services.length, to: '/admin/services' },
    { label: 'Team members', value: data.team.length, to: '/admin/about' },
    { label: 'Images in library', value: data.media.length, to: '/admin/media' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-glass text-3xl font-semibold">Hello, {user?.name?.split(' ')[0]}</h1>
          <p className="mt-1 text-muted">Everything on the website is managed from here - pick a section in the menu.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="card group p-5 transition-colors hover:border-pine-500">
            <p className="font-glass text-4xl font-semibold">{s.value}</p>
            <p className="mt-1 flex items-center justify-between text-sm text-muted">
              {s.label} <ArrowRight className="size-4" />
            </p>
          </Link>
        ))}
      </div>

      {/* Latest enquiries (sections sidebar mein hain, isliye yahan alag "manage" list nahi) */}
      <section className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><Inbox className="size-5 text-pine-700" /> Latest enquiries</h2>
          <Link to="/admin/contact?tab=enquiries" className="flex items-center gap-1 text-sm font-medium text-pine-700">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <ul className="divide-y divide-line">
          {data.enquiries.slice(0, 6).map((e) => {
            const email = e.email || (e.contact?.includes('@') ? e.contact : '')
            const phone = e.phone || (e.contact && !e.contact.includes('@') ? e.contact : '')
            return (
              <li key={e._id} className="grid gap-2 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4 sm:p-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="font-semibold">{e.name}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${e.status === 'new' ? 'bg-clay/20 text-clay-600' : 'bg-pine-50 text-pine-700'}`}>{e.status}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {email && <a href={`mailto:${email}`} className="flex min-w-0 items-center gap-1.5 text-pine-700 hover:underline"><Mail className="size-4 shrink-0" /> <span className="[overflow-wrap:anywhere]">{email}</span></a>}
                    {phone && <a href={`tel:${phone}`} className="flex items-center gap-1.5 text-pine-700 hover:underline"><Phone className="size-4 shrink-0" /> {phone}</a>}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{e.message}</p>
                </div>
                <p className="text-xs text-muted sm:text-right">
                  {new Date(e.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  {e.preferredTime && <span className="block">Prefers: {e.preferredTime}</span>}
                </p>
              </li>
            )
          })}
          {data.enquiries.length === 0 && <li className="p-6 text-sm text-muted">No enquiries yet. New messages from the contact form will appear here.</li>}
        </ul>
      </section>
    </div>
  )
}
