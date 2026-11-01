import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, CheckCircle2, LoaderCircle, ExternalLink } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { enquiriesApi, getErrorMessage } from '../api/endpoints'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'

// RFP rule: sirf zaroori details (Name, Email/Phone, Preferred time, Message).
// Medical dropdown / pain slider NAHI lagana (UK GDPR special-category data).
const empty = { name: '', contact: '', preferredTime: 'Any time', message: '', consent: false, website: '' }

export default function Contact() {
  const { settings } = useSite()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [serverError, setServerError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  function validate() {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Please enter your name.'
    const c = form.contact.trim()
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)
    const isPhone = /^[+\d][\d\s()-]{7,}$/.test(c)
    if (!isEmail && !isPhone) e.contact = 'Please enter a valid email or phone number.'
    if (form.message.trim().length < 5) e.message = 'Please add a short message.'
    if (!form.consent) e.consent = 'Please agree so we can contact you.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (form.website) return // honeypot: bots ye hidden field bhar dete hain
    if (!validate()) return
    setStatus('sending')
    setServerError('')
    try {
      const { consent, website, ...payload } = form
      await enquiriesApi.create({ ...payload, status: 'new' })
      setStatus('sent')
      setForm(empty)
    } catch (err) {
      setServerError(getErrorMessage(err))
      setStatus('error')
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact & booking"
        title="Get in touch"
        intro="Send us a quick enquiry and we will contact you to arrange your appointment. Prefer to talk? Give us a call."
      />

      <section className="py-16">
        <div className="container-x grid gap-10 lg:grid-cols-5">
          {/* FORM */}
          <Reveal className="card p-6 sm:p-8 lg:col-span-3">
            {status === 'sent' ? (
              <div className="py-10 text-center" role="status">
                <CheckCircle2 className="mx-auto size-14 text-pine-500" />
                <h2 className="mt-4 text-2xl font-semibold">Thank you, we have received your enquiry</h2>
                <p className="mt-2 text-muted">We aim to reply within one working day.</p>
                <button className="btn-outline mt-6" onClick={() => setStatus('idle')}>
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                <h2 className="text-2xl font-semibold">Enquiry form</h2>

                <div>
                  <label htmlFor="name" className="label">Full name</label>
                  <input id="name" className="input" value={form.name} onChange={set('name')} autoComplete="name" />
                  {errors.name && <p className="mt-1 text-sm text-red-700">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="contact" className="label">Email or phone</label>
                  <input id="contact" className="input" value={form.contact} onChange={set('contact')} placeholder="So we can get back to you" />
                  {errors.contact && <p className="mt-1 text-sm text-red-700">{errors.contact}</p>}
                </div>

                <div>
                  <label htmlFor="preferredTime" className="label">Preferred contact time</label>
                  <select id="preferredTime" className="input" value={form.preferredTime} onChange={set('preferredTime')}>
                    <option>Any time</option>
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="label">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="input resize-y"
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Briefly tell us how we can help. Please don't include detailed medical information."
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-700">{errors.message}</p>}
                </div>

                {/* Honeypot (spam se bachne ke liye, user ko dikhta nahi) */}
                <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} className="hidden" aria-hidden="true" />

                <label className="flex gap-3 text-sm text-ink/80">
                  <input type="checkbox" checked={form.consent} onChange={set('consent')} className="mt-0.5 size-4 accent-pine-700" />
                  <span>
                    I agree to {settings.clinicName} using these details to respond to my enquiry, as described in the{' '}
                    <a href="/privacy" className="font-medium text-pine-700 underline">privacy policy</a>.
                  </span>
                </label>
                {errors.consent && <p className="-mt-3 text-sm text-red-700">{errors.consent}</p>}

                {serverError && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}

                <button type="submit" className="btn-primary w-full py-3.5 text-base sm:w-auto" disabled={status === 'sending'}>
                  {status === 'sending' && <LoaderCircle className="size-4 animate-spin" />}
                  {status === 'sending' ? 'Sending…' : 'Send enquiry'}
                </button>
              </form>
            )}
          </Reveal>

          {/* DETAILS */}
          <Reveal delay={120} className="space-y-5 lg:col-span-2">
            <div className="card space-y-4 p-6">
              <a href={`tel:${settings.phoneHref}`} className="flex items-center gap-3 rounded-xl bg-pine-700 p-4 text-white transition hover:bg-pine-900">
                <Phone className="size-5" />
                <div>
                  <p className="text-xs text-white/70">Call us</p>
                  <p className="font-semibold">{settings.phone}</p>
                </div>
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-sm">
                <Mail className="size-5 shrink-0 text-pine-700" /> <span className="break-all">{settings.email}</span>
              </a>
              <p className="flex gap-3 text-sm">
                <MapPin className="size-5 shrink-0 text-pine-700" /> {settings.address}
              </p>
              {settings.bookingUrl && (
                <a href={settings.bookingUrl} target="_blank" rel="noreferrer" className="btn-outline w-full">
                  Patient portal <ExternalLink className="size-4" />
                </a>
              )}
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-2">
                <Clock className="size-5 text-pine-700" />
                <h3 className="text-lg font-semibold">Opening hours</h3>
              </div>
              <ul className="mt-4 space-y-1.5 text-sm">
                {settings.hours?.map((h) => (
                  <li key={h.day} className="flex justify-between">
                    <span>{h.day}</span>
                    <span className="text-muted">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* MAP */}
        <Reveal className="container-x mt-10">
          <div className="overflow-hidden rounded-2xl border border-line">
            <iframe
              title={`Map showing ${settings.clinicName}`}
              src={settings.mapEmbedUrl}
              className="h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </section>
    </>
  )
}
