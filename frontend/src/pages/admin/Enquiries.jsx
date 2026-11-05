import { useState, useMemo } from 'react'
import { Trash2, Mail, Phone, Calendar, Clock, Search, Stethoscope, AlertCircle, CheckCircle2 } from 'lucide-react'
import { enquiriesApi, getErrorMessage } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import useFetch from '../../hooks/useFetch'
import Spinner from '../../components/Spinner'

const STATUSES = ['new', 'contacted', 'scheduled', 'closed']

const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  scheduled: 'Scheduled',
  booked: 'Scheduled',
  closed: 'Closed',
}

const STATUS_STYLES = {
  new: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  contacted: 'bg-sky-50 text-sky-800 border-sky-200',
  scheduled: 'bg-amber-50 text-amber-800 border-amber-200',
  booked: 'bg-amber-50 text-amber-800 border-amber-200',
  closed: 'bg-slate-100 text-slate-700 border-slate-200',
}

export default function Enquiries() {
  const { can } = useAuth()
  const { data, setData, loading, error } = useFetch(enquiriesApi.list)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [msg, setMsg] = useState('')

  async function changeStatus(id, status) {
    try {
      const updated = await enquiriesApi.update(id, { status })
      setData((list) => list.map((x) => (x._id === id ? updated : x)))
      setMsg('')
    } catch (e) {
      setMsg(getErrorMessage(e))
    }
  }

  async function remove(id) {
    if (!confirm('Permanently delete this enquiry record?')) return
    try {
      await enquiriesApi.remove(id)
      setData((list) => list.filter((x) => x._id !== id))
      setMsg('')
    } catch (e) {
      setMsg(getErrorMessage(e))
    }
  }

  const rawList = data || []

  // Counts for filter pills
  const counts = useMemo(() => {
    const c = { all: rawList.length, new: 0, contacted: 0, scheduled: 0, closed: 0 }
    rawList.forEach((e) => {
      const s = e.status === 'booked' ? 'scheduled' : e.status
      if (c[s] !== undefined) c[s]++
    })
    return c
  }, [rawList])

  // Filtered & searched list
  const list = useMemo(() => {
    return rawList.filter((e) => {
      const currentStatus = e.status === 'booked' ? 'scheduled' : e.status
      if (filter !== 'all' && currentStatus !== filter) return false
      if (!search.trim()) return true
      const q = search.toLowerCase()
      return (
        e.name?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.phone?.toLowerCase().includes(q) ||
        e.reason?.toLowerCase().includes(q) ||
        e.message?.toLowerCase().includes(q) ||
        e.preferredDate?.toLowerCase().includes(q)
      )
    })
  }, [rawList, filter, search])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Booking Enquiries</h2>
          <p className="mt-1 text-sm text-muted">
            Manage appointment requests and patient enquiries submitted through the website.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {['all', ...STATUSES].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                filter === s
                  ? 'bg-pine-700 text-white shadow-xs'
                  : 'border border-line bg-white text-ink/75 hover:bg-sand'
              }`}
            >
              <span>{s === 'all' ? 'All' : STATUS_LABELS[s]}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  filter === s ? 'bg-white/20 text-white' : 'bg-sand text-muted'
                }`}
              >
                {counts[s] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 py-1.5 text-xs"
          />
        </div>
      </div>

      {(error || msg) && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error || msg}</span>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <div className="space-y-4">
          {list.map((e) => {
            const email = e.email || (e.contact?.includes('@') ? e.contact : '')
            const phone = e.phone || (e.contact && !e.contact.includes('@') ? e.contact : '')
            const statusKey = e.status === 'booked' ? 'scheduled' : e.status

            return (
              <div
                key={e._id}
                className="card border border-line bg-white p-5 shadow-xs transition-shadow hover:shadow-sm sm:p-6"
              >
                {/* Header row: Patient Name, Reason badge, Status selector */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-glass text-lg font-bold text-ink">{e.name}</h3>
                      {e.reason && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-pine-200 bg-pine-50 px-2.5 py-0.5 text-xs font-semibold text-pine-800">
                          <Stethoscope className="size-3 text-pine-600" /> {e.reason}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                          STATUS_STYLES[statusKey] || STATUS_STYLES.new
                        }`}
                      >
                        {STATUS_LABELS[statusKey] || statusKey}
                      </span>
                    </div>

                    <p className="text-xs text-muted">
                      Received: {new Date(e.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>

                  {/* Actions: Status Dropdown + Delete */}
                  <div className="flex items-center gap-2">
                    <label htmlFor={`status-${e._id}`} className="sr-only">
                      Change Status
                    </label>
                    <select
                      id={`status-${e._id}`}
                      value={statusKey}
                      onChange={(ev) => changeStatus(e._id, ev.target.value)}
                      className="input w-auto py-1.5 px-3 text-xs font-medium capitalize"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>

                    {can('delete') && (
                      <button
                        type="button"
                        onClick={() => remove(e._id)}
                        className="grid size-8 place-items-center rounded-lg border border-line text-red-700 hover:bg-red-50 hover:border-red-200 transition-colors"
                        title="Delete enquiry record"
                        aria-label="Delete enquiry"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Body Details: Contact & Appointment Preferences */}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Contact Info */}
                  <div className="space-y-1 text-xs">
                    <span className="font-semibold uppercase tracking-wider text-muted">Contact Info</span>
                    <div className="space-y-1 pt-1">
                      {phone && (
                        <a
                          href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                          className="flex items-center gap-1.5 font-medium text-pine-700 hover:underline"
                        >
                          <Phone className="size-3.5" /> {phone}
                        </a>
                      )}
                      {email && (
                        <a
                          href={`mailto:${email}`}
                          className="flex items-center gap-1.5 font-medium text-pine-700 hover:underline break-all"
                        >
                          <Mail className="size-3.5 shrink-0" /> {email}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Preferred Date */}
                  <div className="space-y-1 text-xs">
                    <span className="font-semibold uppercase tracking-wider text-muted">Preferred Date</span>
                    <div className="flex items-center gap-1.5 pt-1 font-medium text-ink">
                      <Calendar className="size-3.5 text-pine-600" />
                      <span>{e.preferredDate || 'Flexible / As soon as possible'}</span>
                    </div>
                  </div>

                  {/* Preferred Time */}
                  <div className="space-y-1 text-xs">
                    <span className="font-semibold uppercase tracking-wider text-muted">Preferred Time</span>
                    <div className="flex items-center gap-1.5 pt-1 font-medium text-ink">
                      <Clock className="size-3.5 text-pine-600" />
                      <span>{e.preferredTime || 'Any time'}</span>
                    </div>
                  </div>

                  {/* Reason / Category */}
                  <div className="space-y-1 text-xs">
                    <span className="font-semibold uppercase tracking-wider text-muted">Reason / Condition</span>
                    <div className="pt-1 font-medium text-ink">
                      {e.reason || 'General Physiotherapy'}
                    </div>
                  </div>
                </div>

                {/* Message Box */}
                <div className="mt-4 rounded-xl border border-line bg-sand/30 p-3.5 text-xs sm:text-sm text-ink/90">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
                    Patient Notes / Condition Description:
                  </span>
                  <p className="whitespace-pre-line leading-relaxed">
                    {e.message?.trim() ? e.message : <em className="text-muted">(No additional message provided)</em>}
                  </p>
                </div>
              </div>
            )
          })}

          {list.length === 0 && (
            <div className="card p-10 text-center text-muted">
              <p className="text-base font-semibold text-ink">No enquiries found</p>
              <p className="mt-1 text-xs">
                {search ? `No records matched your search query "${search}".` : 'There are currently no enquiries in this filter.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
