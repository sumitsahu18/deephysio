import { useEffect, useState } from 'react'
import { siteApi, clinicApi, getErrorMessage } from '../../api/endpoints'
import { useSite } from '../../context/SiteContext'
import { SaveBar } from '../../components/DocForm'
import MediaInput from '../../components/MediaInput'
import Logo from '../../components/Logo'
import { formatWhatsapp } from '../../components/SocialIcons'

// Site-wide settings - SIRF ADMIN (PDF 2.3: editor "site-wide settings" nahi badal sakta)
export default function SiteSettings() {
  const { site, setSite, clinic, setClinic } = useSite()
  const [form, setForm] = useState(site)
  // Phone numbers clinic document mein save hote hain, lekin yahan (General Settings) se badalte hain - sirf Admin
  const [phone, setPhone] = useState({ phone: clinic.phone || '', phoneHref: clinic.phoneHref || '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({})

  useEffect(() => {
    setForm(site)
  }, [site])

  useEffect(() => {
    setPhone({ phone: clinic.phone || '', phoneHref: clinic.phoneHref || '' })
  }, [clinic.phone, clinic.phoneHref])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setMsg({})
    try {
      const phoneHref = phone.phoneHref.replace(/[^\d+]/g, '')
      if (phoneHref && !/^\+\d{8,15}$/.test(phoneHref)) throw new Error('Phone for click-to-call must start with + and the country code, e.g. +447737610615')
      const updated = await siteApi.update({ ...form, whatsapp: (form.whatsapp || '').replace(/\D/g, '') })
      setSite(updated)
      if (phone.phone !== (clinic.phone || '') || phoneHref !== (clinic.phoneHref || '')) {
        setClinic(await clinicApi.update({ phone: phone.phone.trim(), phoneHref }))
      }
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
          <h2 className="text-2xl font-semibold">Site settings</h2>
          <p className="mt-1 text-muted">Admin only. Logo, business details, phone & WhatsApp numbers, footer text and social media links.</p>
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
        <h2 className="text-lg font-semibold sm:col-span-2">Phone & WhatsApp</h2>
        <p className="-mt-2 text-xs text-muted sm:col-span-2">
          Use the clinic's own numbers with the clinic's country code (UK = 44), wherever the person calling is.
        </p>
        <div>
          <label className="label" htmlFor="phone">Phone number (as displayed)</label>
          <input id="phone" className="input" value={phone.phone} onChange={(e) => setPhone({ ...phone, phone: e.target.value })} />
          <p className="mt-1 text-xs text-muted">How it looks on the website, e.g. 07737 610615</p>
        </div>
        <div>
          <label className="label" htmlFor="phoneHref">Phone for click-to-call</label>
          <input id="phoneHref" className="input" value={phone.phoneHref} onChange={(e) => setPhone({ ...phone, phoneHref: e.target.value })} />
          <p className="mt-1 text-xs text-muted">
            Dialled when someone taps “Call”. Same number with + and country code, no 0 and no spaces, e.g. +447737610615
          </p>
        </div>
        <div className="sm:col-span-2 sm:max-w-[calc(50%-0.5rem)]">
          {input('whatsapp', 'WhatsApp number', 'With country code, no + or spaces, e.g. 447737610615')}
          {form.whatsapp && (
            <p className="mt-1 text-xs text-muted">
              Shown on the website as <strong className="text-ink">{formatWhatsapp(form.whatsapp)}</strong> (Home, Contact page, footer and the green WhatsApp button). Leave empty to hide it everywhere.
            </p>
          )}
        </div>
      </section>

      <section className="card grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        <h2 className="text-lg font-semibold sm:col-span-2">Social media</h2>
        {input('facebookUrl', 'Facebook page link')}
        {input('instagramUrl', 'Instagram link')}
        <p className="text-xs text-muted sm:col-span-2">Leave a field empty to hide that icon on the website.</p>
      </section>
    </form>
  )
}
