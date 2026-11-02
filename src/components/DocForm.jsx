import { Save, LoaderCircle, CheckCircle2 } from 'lucide-react'
import MediaInput from './MediaInput'

// Schema se form banata hai. Field: { key: 'feature1.title', label, type: text|textarea|list|image, help }
// Dotted key nested object set/get karti hai.
export const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj)
export function setPath(obj, path, value) {
  const keys = path.split('.')
  const out = Array.isArray(obj) ? [...obj] : { ...obj }
  let cur = out
  keys.slice(0, -1).forEach((k) => {
    cur[k] = { ...(cur[k] || {}) }
    cur = cur[k]
  })
  cur[keys.at(-1)] = value
  return out
}

export function Field({ field, value, onChange }) {
  const id = field.key.replace(/\./g, '-')
  return (
    <div className={field.wide === false ? '' : 'sm:col-span-2'}>
      <label htmlFor={id} className="label">{field.label}</label>
      {field.type === 'image' ? (
        <MediaInput id={id} value={value} onChange={onChange} />
      ) : field.type === 'textarea' ? (
        <textarea id={id} rows={field.rows || 4} className="input" value={value || ''} onChange={(e) => onChange(e.target.value)} />
      ) : field.type === 'list' ? (
        <textarea
          id={id}
          rows={field.rows || 4}
          className="input"
          value={(value || []).join('\n')}
          onChange={(e) => onChange(e.target.value.split('\n'))}
        />
      ) : (
        <input id={id} className="input" value={value || ''} onChange={(e) => onChange(e.target.value)} />
      )}
      {field.help && <p className="mt-1 text-xs text-muted">{field.help}</p>}
    </div>
  )
}

// List fields mein khali lines save se pehle hata do
export function cleanLists(obj) {
  if (Array.isArray(obj)) return obj.map((v) => (typeof v === 'string' ? v.trim() : v)).filter((v) => v !== '')
  if (obj && typeof obj === 'object') return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, cleanLists(v)]))
  return obj
}

export function SaveBar({ saving, msg, label = 'Save changes' }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {msg?.text && (
        <p className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${msg.type === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>
          {msg.type === 'ok' && <CheckCircle2 className="size-4" />} {msg.text}
        </p>
      )}
      <button className="btn-primary" disabled={saving}>
        {saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />} {label}
      </button>
    </div>
  )
}
