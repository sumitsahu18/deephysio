import { useState } from 'react'
import { Trash2, Mail, Phone } from 'lucide-react'
import { enquiriesApi, getErrorMessage } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import useFetch from '../../hooks/useFetch'
import Spinner from '../../components/Spinner'

const STATUSES = ['new', 'contacted', 'booked', 'closed']

export default function Enquiries() {
  const { can } = useAuth()
  const { data, setData, loading, error } = useFetch(enquiriesApi.list)
  const [filter, setFilter] = useState('all')
  const [msg, setMsg] = useState('')

  async function changeStatus(id, status) {
    try {
      const updated = await enquiriesApi.update(id, { status })
      setData((list) => list.map((x) => (x._id === id ? updated : x)))
    } catch (e) {
      setMsg(getErrorMessage(e))
    }
  }

  async function remove(id) {
    if (!confirm('Delete this enquiry permanently?')) return
    try {
      await enquiriesApi.remove(id)
      setData((list) => list.filter((x) => x._id !== id))
    } catch (e) {
      setMsg(getErrorMessage(e))
    }
  }

  const list = (data || []).filter((e) => filter === 'all' || e.status === filter)

  return (
    <div>
      <h2 className="text-2xl font-semibold">Enquiries</h2>
      <p className="mt-1 text-sm text-muted">Messages sent from the website contact form. Delete them once they are no longer needed.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {['all', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${filter === s ? 'bg-pine-700' : 'border border-line bg-white hover:bg-sand'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {(error || msg) && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error || msg}</p>}

      {loading ? (
        <Spinner />
      ) : (
        <div className="mt-6 space-y-3">
          {list.map((e) => {
            // Purani enquiries mein 'contact' field tha (email ya phone), nayi mein email + phone alag
            const email = e.email || (e.contact?.includes('@') ? e.contact : '')
            const phone = e.phone || (e.contact && !e.contact.includes('@') ? e.contact : '')
            return (
              <div key={e._id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{e.name}</p>
                    <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                      {email && (
                        <a href={`mailto:${email}`} className="flex items-center gap-1.5 text-pine-700 hover:underline">
                          <Mail className="size-4" /> {email}
                        </a>
                      )}
                      {phone && (
                        <a href={`tel:${phone}`} className="flex items-center gap-1.5 text-pine-700 hover:underline">
                          <Phone className="size-4" /> {phone}
                        </a>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      Preferred contact time: {e.preferredTime} · {new Date(e.createdAt).toLocaleString('en-GB')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={e.status} onChange={(ev) => changeStatus(e._id, ev.target.value)} className="input w-auto py-2 capitalize">
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {can('delete') && (
                      <button onClick={() => remove(e._id)} className="grid size-10 place-items-center rounded-xl text-red-700 hover:bg-red-50" aria-label="Delete enquiry">
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-line rounded-xl bg-sand p-4 text-sm">{e.message}</p>
              </div>
            )
          })}
          {list.length === 0 && <p className="py-10 text-center text-muted">No enquiries here.</p>}
        </div>
      )}
    </div>
  )
}
