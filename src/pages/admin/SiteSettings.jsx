import { useEffect, useState } from 'react'
import { siteApi, getErrorMessage } from '../../api/endpoints'
import { useSite } from '../../context/SiteContext'
import { SaveBar } from '../../components/DocForm'
import MediaInput from '../../components/MediaInput'
import Logo from '../../components/Logo'

// Site-wide settings - SIRF ADMIN (PDF 2.3: editor "site-wide settings" nahi badal sakta)
export default function SiteSettings() {
  const { site, setSite } = useSite()
  const [form, setForm] = useState(site)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({})

  useEffect(() => {
    setForm(site)
  }, [site])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setMsg({})
    try {
      const updated = await siteApi.update({ ...form, whatsapp: (form.whatsapp || '').replace(/\D/g, '') })
      setSite(updated)
      setMsg({ type: 'ok', text: 'Saved.' })
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
          <h2 className="text-2xl font-semibold">Site settings</h2>
          <p className="mt-1 text-muted">Admin only. Logo, business name, company details, footer text and social media links.</p>
        </div>
        <SaveBar saving={saving} msg={msg} />
      </div>

      <section className="card grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        <h2 className="text-lg font-semibold sm:col-span-2">Business</h2>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="logoUrl">Logo</label>
          <MediaInput id="logoUrl" fit="contain" value={form.logoUrl || ''} onChange={(v) => setForm({ ...form, logoUrl: v })} />
          <p className="mt-2 text-xs text-muted">
            Shown in the header, footer, admin and login page. Best: PNG with a transparent background, light-coloured
            (the website background is dark), wide shape. Remove it to go back to the default logo. Click “Save changes” after choosing.
          </p>
          <div className="mt-3 inline-flex rounded-xl border border-line bg-deep/60 px-4 py-3">
            <span className="pointer-events-none" title="Current logo (updates after you save)">
              <Logo light small to="#" />
            </span>
          </div>
        </div>
        {input('clinicName', 'Clinic name (shown in the hero and logo)')}
        {input('legalName', 'Registered company name')}
        {input('companyNumber', 'Company number')}
        <div className="sm:col-span-2">
          <label className="label" htmlFor="footerText">Footer text (short line under the logo)</label>
          <textarea id="footerText" rows={2} className="input" value={form.footerText || ''} onChange={set('footerText')} />
        </div>
      </section>

      <section className="card grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        <h2 className="text-lg font-semibold sm:col-span-2">Social media & WhatsApp</h2>
        {input('facebookUrl', 'Facebook page link')}
        {input('instagramUrl', 'Instagram link')}
        {input('whatsapp', 'WhatsApp number', 'With country code, e.g. 447737610615')}
        <p className="text-xs text-muted sm:col-span-2">Leave a field empty to hide that icon on the website.</p>
      </section>
    </form>
  )
}
