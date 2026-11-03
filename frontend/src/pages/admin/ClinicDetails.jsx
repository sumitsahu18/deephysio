import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { clinicApi, getErrorMessage } from '../../api/endpoints'
import { useSite } from '../../context/SiteContext'
import { SaveBar } from '../../components/DocForm'

// PDF 1: "day-to-day text, hours, and contact information must be easily manageable by our
// reception and administrative staff" -> Content Editor bhi ye page edit kar sakta hai.
export default function ClinicDetails() {
  const { clinic, setClinic } = useSite()
  const [form, setForm] = useState(clinic)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({})

  useEffect(() => {
    setForm(clinic)
  }, [clinic])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const setHour = (i, field, value) => setForm({ ...form, hours: form.hours.map((h, idx) => (idx === i ? { ...h, [field]: value } : h)) })

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setMsg({})
    try {
      // Phone numbers General Settings (Admin) se badalte hain - yahan se nahi bheje jaate
      const { phone: _p, phoneHref: _ph, ...rest } = form
      const body = {
        ...rest,
        languages: (typeof form.languages === 'string' ? form.languages.split(',') : form.languages).map((s) => s.trim()).filter(Boolean),
        hours: form.hours.filter((h) => h.day.trim()),
      }
      const updated = await clinicApi.update(body)
      setClinic(updated)
      setMsg({ type: 'ok', text: 'Saved. Changes are live on the website.' })
    } catch (err) {
      setMsg({ type: 'err', text: getErrorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  const input = (k, label, help) => (
    <div>
      <label className="label" htmlFor={k}>{label}</label>
      <input id={k} className="input" value={form[k] || ''} onChange={set(k)} />
      {help && <p className="mt-1 text-xs text-muted">{help}</p>}
    </div>
  )

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Clinic details</h2>
          <p className="mt-1 text-muted">Email, address, opening hours and map used across the whole website. (Phone & WhatsApp numbers: General Settings, admin only.)</p>
        </div>
        <SaveBar saving={saving} msg={msg} />
      </div>

      <section className="card grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        <h2 className="text-lg font-semibold sm:col-span-2">Contact information</h2>
        {input('email', 'Email address')}
        <div>
          <label className="label" htmlFor="languages">Languages spoken (comma separated)</label>
          <input id="languages" className="input" value={Array.isArray(form.languages) ? form.languages.join(', ') : form.languages || ''} onChange={set('languages')} />
        </div>
        <div className="sm:col-span-2">{input('address', 'Clinic address')}</div>
        <div className="sm:col-span-2">
          {input('mapEmbedUrl', 'Google Maps embed link', 'Google Maps > Share > Embed a map > copy the src="…" link')}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-semibold">Opening hours</h2>
        <p className="mt-1 text-xs text-muted">Use the format 09:00 - 17:00 so the “Open now” label works, or type Closed.</p>
        <div className="mt-4 space-y-2">
          {form.hours?.map((h, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input className="input" value={h.day} onChange={(e) => setHour(i, 'day', e.target.value)} aria-label="Day" />
              <input className="input" value={h.time} onChange={(e) => setHour(i, 'time', e.target.value)} aria-label="Hours" />
              <button type="button" onClick={() => setForm({ ...form, hours: form.hours.filter((_, idx) => idx !== i) })} className="grid size-11 place-items-center rounded-xl text-red-700 hover:bg-red-50" aria-label="Remove row">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setForm({ ...form, hours: [...(form.hours || []), { day: '', time: '' }] })} className="btn-outline mt-3 py-2">
          <Plus className="size-4" /> Add row
        </button>
      </section>
    </form>
  )
}
