import { Link } from 'react-router-dom'
import { Inbox, Stethoscope, Users, CircleHelp, ArrowRight } from 'lucide-react'
import { enquiriesApi, servicesApi, teamApi, faqsApi } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import useFetch from '../../hooks/useFetch'
import Spinner from '../../components/Spinner'

export default function Dashboard() {
  const { user } = useAuth()
  const { data, loading } = useFetch(() =>
    Promise.all([enquiriesApi.list(), servicesApi.list(), teamApi.list(), faqsApi.list()]).then(
      ([enquiries, services, team, faqs]) => ({ enquiries, services, team, faqs }),
    ),
  )

  if (loading || !data) return <Spinner />
  const newCount = data.enquiries.filter((e) => e.status === 'new').length

  const stats = [
    { label: 'New enquiries', value: newCount, icon: Inbox, to: '/admin/enquiries' },
    { label: 'Treatments', value: data.services.length, icon: Stethoscope, to: '/admin/services' },
    { label: 'Team members', value: data.team.length, icon: Users, to: '/admin/team' },
    { label: 'FAQs', value: data.faqs.length, icon: CircleHelp, to: '/admin/faqs' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-semibold">Hello, {user?.name?.split(' ')[0]}</h1>
      <p className="mt-1 text-muted">Here is what is happening on your website.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: I, to }) => (
          <Link key={label} to={to} className="card group p-5 transition hover:border-pine-500">
            <div className="flex items-center justify-between">
              <I className="size-5 text-pine-700" />
              <ArrowRight className="size-4 text-muted transition group-hover:translate-x-1" />
            </div>
            <p className="mt-4 font-display text-4xl font-semibold">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>

      <div className="card mt-8">
        <div className="flex items-center justify-between border-b border-line p-5">
          <h2 className="text-lg font-semibold">Latest enquiries</h2>
          <Link to="/admin/enquiries" className="text-sm font-medium text-pine-700">View all</Link>
        </div>
        <ul className="divide-y divide-line">
          {data.enquiries.slice(0, 5).map((e) => (
            <li key={e._id} className="flex items-start justify-between gap-4 p-5">
              <div className="min-w-0">
                <p className="font-medium">{e.name}</p>
                <p className="truncate text-sm text-muted">{e.message}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${e.status === 'new' ? 'bg-clay/20 text-clay-600' : 'bg-pine-50 text-pine-700'}`}>
                {e.status}
              </span>
            </li>
          ))}
          {data.enquiries.length === 0 && <li className="p-5 text-sm text-muted">No enquiries yet.</li>}
        </ul>
      </div>
    </div>
  )
}
