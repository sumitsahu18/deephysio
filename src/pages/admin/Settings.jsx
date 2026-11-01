import { useEffect, useState } from 'react'
import { Save, LoaderCircle, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import { settingsApi, getErrorMessage } from '../../api/endpoints'
import { useSite } from '../../context/SiteContext'

// Clinic details jo poori site par dikhte hain (zero hardcoding policy)
export default function Settings() {
  const { settings, setSettings } = useSite()
  const [form, setForm] = useState(settings)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  useEffect(() => setForm(settings), [settings])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const setRow = (key, i, field, value) =>
    setForm({ ...form, [key]: form[key].map((r, idx) => (idx === i ? { ...r, [field]: value } : r)) })
  const addRow = (key, row) => setForm({ ...form, [key]: [...(form[key] || []), row] })
  const delRow = (key, i) => setForm({ ...form, [key]: form[key].filter((_, idx) => idx !== i) })

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setMsg({ type: '', text: '' })
    try {
      const body = {
        ...form,
        languages: typeof form.languages === 'string' ? form.languages.split(',').map((s) => s.trim()).filter(Boolean) : form.languages,
        conditions: typeof form.conditions === 'string' ? form.conditions.split('\n').map((s) => s.trim()).filter(Boolean) : form.conditions,
      }
      const updated = await settingsApi.update(body)
      setSettings(updated)
      setMsg({ type: 'ok', text: 'Saved. Changes are live on the website.' })
    } catch (err) {
      setMsg({ type: 'err', text: getErrorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  const Field = ({ k, label, textarea }) => (
    <div>
      <label className="label" htmlFor={k}>{label}</label>
      {textarea ? (
        <textarea id={k} rows={3} className="input" value={form[k] || ''} onChange={set(k)} />
      ) : (
        <input id={k} className="input" value={form[k] || ''} onChange={set(k)} />
      )}
    </div>
  )

  return (
    <form onSubmit={save} className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Clinic settings</h1>
          <p className="mt-1 text-muted">Contact details, hours and homepage text used across the site.</p>
        </div>
        <button className="btn-primary" disabled={saving}>
          {saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />} Save changes
        </button>
      </div>

      {msg.text && (
        <p className={`flex items-center gap-2 rounded-xl p-3 text-sm ${msg.type === 'ok' ? 'bg-pine-50 text-pine-700' : 'bg-red-50 text-red-700'}`}>
          {msg.type === 'ok' && <CheckCircle2 className="size-4" />} {msg.text}
        </p>
      )}

      <section className="card space-y-4 p-6">
        <h2 className="text-lg font-semibold">Homepage</h2>
        {Field({ k: 'heroTitle', label: 'Hero headline' })}
        {Field({ k: 'heroSubtitle', label: 'Hero text', textarea: true })}
        {Field({ k: 'tagline', label: 'Footer tagline' })}
        <div>
          <label className="label" htmlFor="conditions">Conditions shown as tags (one per line)</label>
          <textarea
            id="conditions"
            rows={4}
            className="input"
            value={Array.isArray(form.conditions) ? form.conditions.join('\n') : form.conditions || ''}
            onChange={set('conditions')}
          />
        </div>
      </section>

      <section className="card grid gap-4 p-6 sm:grid-cols-2">
        <h2 className="text-lg font-semibold sm:col-span-2">Contact details</h2>
        {Field({ k: 'clinicName', label: 'Clinic name' })}
        {Field({ k: 'legalName', label: 'Legal company name' })}
        {Field({ k: 'phone', label: 'Phone (displayed)' })}
        {Field({ k: 'phoneHref', label: 'Phone for click-to-call (e.g. +447737610615)' })}
        {Field({ k: 'email', label: 'Email' })}
        {Field({ k: 'companyNumber', label: 'Company number' })}
        <div className="sm:col-span-2">{Field({ k: 'address', label: 'Address' })}</div>
        <div className="sm:col-span-2">{Field({ k: 'mapEmbedUrl', label: 'Google Maps embed URL' })}</div>
        <div className="sm:col-span-2">{Field({ k: 'bookingUrl', label: 'Patient portal / booking URL' })}</div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="languages">Languages (comma separated)</label>
          <input
            id="languages"
            className="input"
            value={Array.isArray(form.languages) ? form.languages.join(', ') : form.languages || ''}
            onChange={set('languages')}
          />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-semibold">Opening hours</h2>
        <div className="mt-4 space-y-2">
          {form.hours?.map((h, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input className="input" value={h.day} onChange={(e) => setRow('hours', i, 'day', e.target.value)} aria-label="Day" />
              <input className="input" value={h.time} onChange={(e) => setRow('hours', i, 'time', e.target.value)} aria-label="Time" />
              <button type="button" onClick={() => delRow('hours', i)} className="grid size-11 place-items-center rounded-xl text-red-700 hover:bg-red-50" aria-label="Remove">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => addRow('hours', { day: '', time: '' })} className="btn-outline mt-3 py-2">
          <Plus className="size-4" /> Add row
        </button>
      </section>

      <section className="card p-6">
        <h2 className="text-lg font-semibold">Pricing</h2>
        <div className="mt-4 space-y-2">
          {form.pricing?.map((p, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[2fr_1fr_1fr_auto]">
              <input className="input" value={p.name} onChange={(e) => setRow('pricing', i, 'name', e.target.value)} placeholder="Name" aria-label="Name" />
              <input className="input" value={p.duration} onChange={(e) => setRow('pricing', i, 'duration', e.target.value)} placeholder="Duration" aria-label="Duration" />
              <input className="input" value={p.price} onChange={(e) => setRow('pricing', i, 'price', e.target.value)} placeholder="Price" aria-label="Price" />
              <button type="button" onClick={() => delRow('pricing', i)} className="grid size-11 place-items-center rounded-xl text-red-700 hover:bg-red-50" aria-label="Remove">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => addRow('pricing', { name: '', duration: '', price: '' })} className="btn-outline mt-3 py-2">
          <Plus className="size-4" /> Add price
        </button>
      </section>
    </form>
  )
}
