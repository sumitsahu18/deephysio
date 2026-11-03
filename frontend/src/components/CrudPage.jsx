import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Save, LoaderCircle } from 'lucide-react'
import { getErrorMessage } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import useFetch from '../hooks/useFetch'
import Spinner from './Spinner'
import MediaInput from './MediaInput'

// Reusable list + add/edit modal. Har admin page sirf "fields" config deta hai.
// field types: text | textarea | number | select | checkbox | list (ek line = ek item) | password | image
function toForm(fields, item = {}) {
  const f = {}
  fields.forEach((fd) => {
    const v = item[fd.name]
    if (fd.type === 'list') f[fd.name] = (v || []).join('\n')
    else if (fd.type === 'checkbox') f[fd.name] = !!(v ?? fd.default)
    else if (fd.type === 'password') f[fd.name] = ''
    else f[fd.name] = v ?? fd.default ?? ''
  })
  return f
}

function fromForm(fields, form) {
  const out = {}
  fields.forEach((fd) => {
    const v = form[fd.name]
    if (fd.type === 'list') out[fd.name] = v.split('\n').map((s) => s.trim()).filter(Boolean)
    else if (fd.type === 'number') out[fd.name] = Number(v) || 0
    else if (fd.type === 'password') {
      if (v) out[fd.name] = v
    } else out[fd.name] = v
  })
  return out
}

export default function CrudPage({ title, intro, api, fields, columns, sortBy, newLabel = 'Add new' }) {
  const { can } = useAuth()
  const { data, setData, loading, error } = useFetch(api.list)
  const [editing, setEditing] = useState(null) // null | 'new' | item
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const open = (item) => {
    setEditing(item)
    setForm(toForm(fields, item === 'new' ? {} : item))
    setMsg('')
  }

  async function save(e) {
    e.preventDefault()
    const missing = fields.find((f) => f.required && !String(form[f.name] ?? '').trim() && !(f.type === 'password' && editing !== 'new'))
    if (missing) return setMsg(`${missing.label} is required.`)
    setSaving(true)
    try {
      const body = fromForm(fields, form)
      if (editing === 'new') {
        const created = await api.create(body)
        setData((list) => [created, ...(list || [])])
      } else {
        const updated = await api.update(editing._id, body)
        setData((list) => list.map((x) => (x._id === editing._id ? updated : x)))
      }
      setEditing(null)
    } catch (err) {
      setMsg(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function remove(item) {
    if (!confirm('Delete this item permanently?')) return
    try {
      await api.remove(item._id)
      setData((list) => list.filter((x) => x._id !== item._id))
    } catch (err) {
      setMsg(getErrorMessage(err))
    }
  }

  const list = [...(data || [])]
  if (sortBy) list.sort((a, b) => (a[sortBy] ?? 99) - (b[sortBy] ?? 99))

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          {intro && <p className="mt-1 max-w-3xl text-sm text-muted">{intro}</p>}
        </div>
        <button className="btn-primary w-full sm:w-auto" onClick={() => open('new')}>
          <Plus className="size-4" /> {newLabel}
        </button>
      </div>

      {(error || (msg && !editing)) && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error || msg}</p>}

      {loading ? (
        <Spinner />
      ) : (
        <>
        {/* Mobile: har item ek card (table side-scroll nahi karni padti) */}
        <ul className="mt-6 space-y-3 md:hidden">
          {list.map((item) => (
            <li key={item._id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 text-sm">{columns.find((c) => c.key !== 'order')?.render?.(item) ?? item[columns.find((c) => c.key !== 'order')?.key]}</div>
                <div className="flex shrink-0">
                  <button onClick={() => open(item)} className="inline-grid size-9 place-items-center rounded-lg text-pine-700 hover:bg-pine-50" aria-label="Edit">
                    <Pencil className="size-4" />
                  </button>
                  {can('delete') && (
                    <button onClick={() => remove(item)} className="inline-grid size-9 place-items-center rounded-lg text-red-700 hover:bg-red-50" aria-label="Delete">
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              </div>
              <dl className="mt-2 space-y-1 text-sm">
                {columns
                  .filter((c) => c.key !== 'order' && c !== columns.find((x) => x.key !== 'order'))
                  .map((c) => (
                    <div key={c.key} className="flex min-w-0 gap-2">
                      <dt className="shrink-0 text-muted">{c.label}:</dt>
                      <dd className="min-w-0 [overflow-wrap:anywhere]">{c.render ? c.render(item) : item[c.key]}</dd>
                    </div>
                  ))}
              </dl>
            </li>
          ))}
          {list.length === 0 && <li className="card p-6 text-center text-sm text-muted">Nothing here yet.</li>}
        </ul>

        <div className="card mt-6 hidden overflow-x-auto md:block">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-line bg-sand text-xs uppercase tracking-wide text-muted">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="px-5 py-3 font-semibold">{c.label}</th>
                ))}
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((item) => (
                <tr key={item._id} className="transition-colors hover:bg-sand">
                  {columns.map((c) => (
                    <td key={c.key} className="px-5 py-4 align-top">
                      {c.render ? c.render(item) : item[c.key]}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-5 py-4 text-right">
                    <button onClick={() => open(item)} className="inline-grid size-9 place-items-center rounded-lg text-pine-700 hover:bg-pine-50" aria-label="Edit">
                      <Pencil className="size-4" />
                    </button>
                    {can('delete') && (
                      <button onClick={() => remove(item)} className="inline-grid size-9 place-items-center rounded-lg text-red-700 hover:bg-red-50" aria-label="Delete">
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-5 py-10 text-center text-muted">Nothing here yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </>
      )}

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
          <form onSubmit={save} className="glass-dark max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl p-6 sm:rounded-3xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{editing === 'new' ? newLabel : 'Edit'}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="grid size-9 place-items-center rounded-full bg-white/10 hover:bg-white/20">
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {fields.map((f) => (
                <div key={f.name}>
                  {f.type === 'checkbox' ? (
                    <label className="flex items-center gap-3 text-sm font-medium">
                      <input type="checkbox" className="size-4 accent-pine-700" checked={!!form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })} />
                      {f.label}
                    </label>
                  ) : (
                    <>
                      <label className="label" htmlFor={f.name}>
                        {f.label} {f.required && <span className="text-red-700">*</span>}
                      </label>
                      {f.type === 'textarea' || f.type === 'list' ? (
                        <textarea id={f.name} rows={f.type === 'list' ? 4 : 5} className="input" value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                      ) : f.type === 'image' ? (
                        <MediaInput id={f.name} value={form[f.name]} onChange={(v) => setForm({ ...form, [f.name]: v })} />
                      ) : f.type === 'select' ? (
                        <select id={f.name} className="input" value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                          {f.options.map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id={f.name}
                          type={f.type === 'number' ? 'number' : f.type === 'password' ? 'password' : 'text'}
                          className="input"
                          value={form[f.name]}
                          placeholder={f.type === 'password' && editing !== 'new' ? 'Leave blank to keep current password' : ''}
                          onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                        />
                      )}
                      {f.help && <p className="mt-1 text-xs text-muted">{f.help}</p>}
                    </>
                  )}
                </div>
              ))}
            </div>

            {msg && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{msg}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="btn-outline" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-primary" disabled={saving}>
                {saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />} Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
