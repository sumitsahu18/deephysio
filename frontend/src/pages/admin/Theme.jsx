import { useEffect, useState } from 'react'
import { RotateCcw, CalendarCheck, ArrowUpRight } from 'lucide-react'
import { siteApi, getErrorMessage } from '../../api/endpoints'
import { useSite, applyTheme, normalizeTheme } from '../../context/SiteContext'
import { DEFAULT_THEME } from '../../data/seed'
import { SaveBar } from '../../components/DocForm'

// Theme Settings (sirf Admin). Har colour ek CSS variable hai - save karte hi poori website par lag jata hai.
const FIELDS = [
  { key: 'primary', label: 'Primary colour', help: 'Links, small headings and icons.' },
  { key: 'secondary', label: 'Secondary colour', help: 'Soft panels behind photos and the light coloured cards.' },
  { key: 'accent', label: 'Accent colour', help: 'Highlight cards, e.g. the yellow service card.' },
  { key: 'button', label: 'Button colour', help: 'Main buttons like “Book Appointment”.' },
  { key: 'buttonText', label: 'Button text colour', help: 'Text on the main buttons.' },
  { key: 'background', label: 'Background colour', help: 'The page background colour.' },
  { key: 'text', label: 'Text colour', help: 'Main text on the website. Keep it dark on a light background.' },
]
const HEX = /^#([0-9a-f]{6})$/i

export default function Theme() {
  const { site, setSite } = useSite()
  const [form, setForm] = useState(normalizeTheme(site.theme))
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({})

  useEffect(() => {
    setForm(normalizeTheme(site.theme))
  }, [site.theme])

  // Bina save kiye page chhoda to saved theme wapas
  useEffect(() => () => applyTheme(site.theme), [site.theme])

  const set = (k, v) => {
    const next = { ...form, [k]: v }
    setForm(next)
    if (HEX.test(v)) applyTheme(next) // live preview (save tak sirf aapko dikhta hai)
  }

  async function save(e) {
    e.preventDefault()
    const bad = FIELDS.find((f) => !HEX.test(form[f.key] || ''))
    if (bad) return setMsg({ type: 'err', text: `${bad.label}: use a colour like #fde047` })
    setSaving(true)
    setMsg({})
    try {
      const updated = await siteApi.update({ theme: form })
      setSite(updated)
      setMsg({ type: 'ok', text: 'Saved. New colours are live on the website.' })
    } catch (err) {
      setMsg({ type: 'err', text: getErrorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  function reset() {
    setForm({ ...DEFAULT_THEME })
    applyTheme(DEFAULT_THEME)
    setMsg({ type: 'ok', text: 'Default colours loaded. Click “Save changes” to keep them.' })
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div>
        <h1 className="font-glass text-3xl font-semibold">Theme Settings</h1>
        <p className="mt-1 text-muted">Admin only. Pick the website colours - changes preview here straight away and go live when you save.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="card space-y-4 p-5 sm:p-6 lg:col-span-3">
          {FIELDS.map((f) => (
            <div key={f.key} className="flex items-center gap-4">
              <input
                type="color"
                value={HEX.test(form[f.key]) ? form[f.key] : '#000000'}
                onChange={(e) => set(f.key, e.target.value)}
                className="size-12 shrink-0 cursor-pointer rounded-xl border border-line bg-transparent p-1"
                aria-label={f.label}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-sm font-semibold" htmlFor={`hex-${f.key}`}>{f.label}</label>
                  <input
                    id={`hex-${f.key}`}
                    value={form[f.key] || ''}
                    onChange={(e) => set(f.key, e.target.value.trim())}
                    className="input w-28 py-1.5 font-mono text-xs uppercase"
                    maxLength={7}
                  />
                </div>
                <p className="mt-0.5 text-xs text-muted">{f.help}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Live preview - wahi classes jo website par hain */}
        <section className="space-y-4 lg:col-span-2">
          <p className="text-sm font-semibold text-muted">Preview</p>
          <div className="glass relative isolate overflow-hidden rounded-3xl p-6">
            <div className="inner-glow" />
            <p className="eyebrow-glass">Welcome to DeePhysio</p>
            <p className="mt-2 font-glass text-2xl font-bold uppercase">From pain to progress</p>
            <p className="mt-2 text-sm text-white/80">This is how text and buttons will look.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="btn-white px-4 py-2"><CalendarCheck className="size-4" /> Book Appointment</span>
              <span className="btn-glass px-4 py-2">Call us</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grad-aurora rounded-2xl border border-white/25 p-4 text-sm font-semibold">Gradient card <ArrowUpRight className="inline size-4" /></div>
            <div className="grad-sunset rounded-2xl border border-white/25 p-4 text-sm font-semibold">Accent card <ArrowUpRight className="inline size-4" /></div>
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 z-10 flex items-center justify-between gap-2 rounded-2xl border border-line bg-deep/70 px-3 py-3 backdrop-blur-xl sm:px-4">
        <button type="button" onClick={reset} className="btn-outline shrink-0 px-3 py-2 sm:px-5">
          <RotateCcw className="size-4" /> <span className="hidden min-[400px]:inline">Reset to default</span><span className="min-[400px]:hidden">Reset</span>
        </button>
        <SaveBar saving={saving} msg={msg} />
      </div>
    </form>
  )
}
