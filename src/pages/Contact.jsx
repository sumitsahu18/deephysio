import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, CheckCircle2, LoaderCircle, Send } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { enquiriesApi, getErrorMessage } from '../api/endpoints'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { todayName } from '../utils/hours'

// CONTACT & BOOKING ENQUIRY
// PDF 2.2 (4): "Integrated enquiry form, click-to-call mobile button, practice opening hours,
//               and embedded Google Maps."
// PDF 2.4 Data Minimisation: SIRF Name, Email/Phone, Preferred Contact Time, Message.
//   Medical dropdown / pain-scale slider NAHI (special-category health data ban jata hai).
// PDF 2.4 Enquiry Delivery: backend clinic email par authenticated SMTP se bhejega.
const empty = { name: '', contact: '', preferredTime: 'Any time', message: '', consent: false, website: '' }

export default function Contact() {
  const { settings, pages } = useSite()
  const p = pages.contact
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [serverError, setServerError] = useState('')
  const today = todayName()

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  function validate() {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Please enter your name.'
    const c = form.contact.trim()
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)
    const isPhone = /^[+\d][\d\s()-]{7,}$/.test(c)
    if (!isEmail && !isPhone) e.contact = 'Please enter a valid email address or phone number.'
    if (form.message.trim().length < 5) e.message = 'Please add a short message.'
    if (!form.consent) e.consent = 'Please tick this box so we can contact you.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (form.website) return // honeypot: bots hidden field bhar dete hain
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
      <PageHeader title={p.title} intro={p.intro} image={p.headerImage} />

      <section className="bg-sand py-20">
        <div className="container-x grid gap-8 lg:grid-cols-5">
          {/* ENQUIRY FORM */}
          <Reveal anim="left" id="enquiry" className="scroll-mt-28 rounded-md bg-white p-6 shadow-[0_20px_50px_-30px_rgba(27,68,103,0.45)] sm:p-10 lg:col-span-3">
            {status === 'sent' ? (
              <div className="py-12 text-center" role="status">
                <CheckCircle2 className="anim-zoom-in mx-auto size-16 text-emerald-600" />
                <h2 className="mt-5 text-3xl text-pine-900">{p.successTitle}</h2>
                <p className="mt-3 text-lg text-muted">{p.successText}</p>
                <button className="btn-outline mt-8 rounded-sm" onClick={() => setStatus('idle')}>Send another enquiry</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                <div>
                  <h2 className="text-3xl text-pine-900">{p.formTitle}</h2>
                  <span className="mt-4 block h-1 w-14 rounded-full bg-clay" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="label">Name <span className="text-red-700">*</span></label>
                    <input id="name" className="input rounded-sm" value={form.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} />
                    {errors.name && <p className="mt-1 text-sm text-red-700">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact" className="label">Email or phone <span className="text-red-700">*</span></label>
                    <input id="contact" className="input rounded-sm" value={form.contact} onChange={set('contact')} aria-invalid={!!errors.contact} />
                    {errors.contact && <p className="mt-1 text-sm text-red-700">{errors.contact}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="preferredTime" className="label">Preferred contact time</label>
                  <select id="preferredTime" className="input rounded-sm" value={form.preferredTime} onChange={set('preferredTime')}>
                    <option>Any time</option>
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="label">Message <span className="text-red-700">*</span></label>
                  <textarea id="message" rows={5} className="input resize-y rounded-sm" value={form.message} onChange={set('message')} placeholder={p.messageHint} aria-invalid={!!errors.message} />
                  {errors.message && <p className="mt-1 text-sm text-red-700">{errors.message}</p>}
                </div>

                {/* Honeypot (spam se bachne ke liye, user ko dikhta nahi) */}
                <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} className="hidden" aria-hidden="true" />

                <label className="flex gap-3 text-sm text-ink/80">
                  <input type="checkbox" checked={form.consent} onChange={set('consent')} className="mt-0.5 size-4 accent-pine-700" />
                  <span>
                    I agree to {settings.clinicName} using these details to respond to my enquiry, as described in the{' '}
                    <Link to="/privacy" className="font-medium text-pine-700 underline">privacy policy</Link>.
                  </span>
                </label>
                {errors.consent && <p className="-mt-3 text-sm text-red-700">{errors.consent}</p>}

                {serverError && <p className="rounded-sm bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}

                <button type="submit" className="btn-primary w-full rounded-sm py-4 text-base sm:w-auto sm:px-12" disabled={status === 'sending'}>
                  {status === 'sending' ? <LoaderCircle className="size-5 animate-spin" /> : <Send className="size-5" />}
                  {status === 'sending' ? 'Sending…' : 'Send Enquiry'}
                </button>
              </form>
            )}
          </Reveal>

          {/* CLICK-TO-CALL + DETAILS + HOURS */}
          <div className="space-y-6 lg:col-span-2">
            <Reveal anim="right" className="space-y-5 rounded-md bg-pine-700 p-7 text-white">
              <a href={`tel:${settings.phoneHref}`} className="flex items-center gap-4 rounded-sm bg-clay p-5 transition duration-300 hover:-translate-y-0.5 hover:bg-clay-600 hover:shadow-lg">
                <span className="grid size-12 place-items-center rounded-full bg-white/20"><Phone className="size-6" /></span>
                <span>
                  <span className="block text-sm text-white/85">Tap to call</span>
                  <span className="block text-2xl font-bold">{settings.phone}</span>
                </span>
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-3 hover:underline">
                <Mail className="size-5 shrink-0 text-[#8fe3f5]" /> <span className="break-all">{settings.email}</span>
              </a>
              <p className="flex gap-3">
                <MapPin className="size-5 shrink-0 text-[#8fe3f5]" /> {settings.address}
              </p>
            </Reveal>

            <Reveal anim="right" delay={120} className="rounded-md bg-white p-7 shadow-[0_20px_50px_-30px_rgba(27,68,103,0.45)]">
              <h3 className="flex items-center gap-2 text-2xl text-pine-900"><Clock className="size-6 text-pine-700" /> Opening Hours</h3>
              <ul className="mt-5 divide-y divide-line text-[15px]">
                {settings.hours?.map((h) => {
                  const isToday = h.day.toLowerCase() === today.toLowerCase()
                  return (
                    <li key={h.day} className={`flex justify-between py-2.5 ${isToday ? 'font-bold text-pine-700' : ''}`}>
                      <span>{h.day}{isToday && ' (Today)'}</span>
                      <span className={h.time === 'Closed' && !isToday ? 'text-muted' : ''}>{h.time}</span>
                    </li>
                  )
                })}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* EMBEDDED GOOGLE MAP */}
        <Reveal anim="zoom" className="container-x mt-10">
          <div className="overflow-hidden rounded-md border border-line bg-white shadow-sm">
            <iframe title={`Map showing ${settings.clinicName}`} src={settings.mapEmbedUrl} className="h-80 w-full sm:h-[420px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </Reveal>
      </section>
    </>
  )
}
