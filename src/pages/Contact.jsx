import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, CheckCircle2, LoaderCircle, Send } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { enquiriesApi, getErrorMessage } from '../api/endpoints'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { todayName } from '../utils/hours'

// CONTACT & BOOKING ENQUIRY
// PDF 2.2 (4): enquiry form, click-to-call, opening hours, embedded Google Map.
// PDF 2.4 Data Minimisation: SIRF Name, Email/Phone, Preferred Contact Time, Message.
// PDF 2.4 Enquiry Delivery: backend clinic email par authenticated SMTP se bhejega.
const empty = { name: '', contact: '', preferredTime: 'Any time', message: '', consent: false, website: '' }
const err = 'mt-1 text-sm text-coral-300'

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
    } catch (error) {
      setServerError(getErrorMessage(error))
      setStatus('error')
    }
  }

  return (
    <>
      <PageHeader title={p.title} intro={p.intro} image={p.headerImage} />

      <section className="shell mt-10 grid gap-6 lg:grid-cols-5">
        {/* ENQUIRY FORM */}
        <Reveal anim="left" id="enquiry" className="glass relative isolate scroll-mt-28 overflow-hidden rounded-3xl p-6 sm:p-9 lg:col-span-3">
          <div className="inner-glow opacity-50" />
          {status === 'sent' ? (
            <div className="py-12 text-center" role="status">
              <CheckCircle2 className="anim-zoom-in mx-auto size-16 text-aqua-300" />
              <h2 className="mt-5 font-glass text-3xl font-semibold">{p.successTitle}</h2>
              <p className="mt-3 text-lg text-white/75">{p.successText}</p>
              <button className="btn-glass mt-8" onClick={() => setStatus('idle')}>Send another enquiry</button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <div>
                <p className="eyebrow-glass">Book an appointment</p>
                <h2 className="mt-2 font-glass text-3xl font-semibold">{p.formTitle}</h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="label-glass">Name <span className="text-coral-300">*</span></label>
                  <input id="name" className="input-glass" value={form.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} />
                  {errors.name && <p className={err}>{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="contact" className="label-glass">Email or phone <span className="text-coral-300">*</span></label>
                  <input id="contact" className="input-glass" value={form.contact} onChange={set('contact')} aria-invalid={!!errors.contact} />
                  {errors.contact && <p className={err}>{errors.contact}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="preferredTime" className="label-glass">Preferred contact time</label>
                <select id="preferredTime" className="input-glass" value={form.preferredTime} onChange={set('preferredTime')}>
                  <option>Any time</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="label-glass">Message <span className="text-coral-300">*</span></label>
                <textarea id="message" rows={5} className="input-glass resize-y" value={form.message} onChange={set('message')} placeholder={p.messageHint} aria-invalid={!!errors.message} />
                {errors.message && <p className={err}>{errors.message}</p>}
              </div>

              {/* Honeypot (spam se bachne ke liye, user ko dikhta nahi) */}
              <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} className="hidden" aria-hidden="true" />

              <label className="flex gap-3 text-sm text-white/80">
                <input type="checkbox" checked={form.consent} onChange={set('consent')} className="mt-0.5 size-4 shrink-0 accent-teal-400" />
                <span>
                  I agree to {settings.clinicName} using these details to respond to my enquiry, as described in the{' '}
                  <Link to="/privacy" className="font-medium text-aqua-300 underline">privacy policy</Link>.
                </span>
              </label>
              {errors.consent && <p className={`-mt-3 ${err}`}>{errors.consent}</p>}

              {serverError && <p className="rounded-xl bg-coral/20 p-3 text-sm text-white">{serverError}</p>}

              <button type="submit" className="btn-white w-full py-4 text-base sm:w-auto sm:px-12" disabled={status === 'sending'}>
                {status === 'sending' ? <LoaderCircle className="size-5 animate-spin" /> : <Send className="size-5" />}
                {status === 'sending' ? 'Sending…' : 'Send Enquiry'}
              </button>
            </form>
          )}
        </Reveal>

        {/* CLICK-TO-CALL + DETAILS + HOURS */}
        <div className="space-y-6 lg:col-span-2">
          <Reveal anim="right" className="grad-aurora space-y-5 rounded-3xl border border-white/25 p-7">
            <a href={`tel:${settings.phoneHref}`} className="flex items-center gap-4 rounded-2xl border border-white/30 bg-white/15 p-4 transition-colors hover:bg-white/25">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-deep"><Phone className="size-5" /></span>
              <span>
                <span className="block text-sm text-white/85">Tap to call</span>
                <span className="block font-glass text-2xl font-semibold">{settings.phone}</span>
              </span>
            </a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-3 hover:underline">
              <Mail className="size-5 shrink-0" /> <span className="break-all">{settings.email}</span>
            </a>
            <p className="flex gap-3">
              <MapPin className="size-5 shrink-0" /> {settings.address}
            </p>
          </Reveal>

          <Reveal anim="right" delay={120} className="glass rounded-3xl p-7">
            <h3 className="flex items-center gap-2 font-glass text-xl font-semibold"><Clock className="size-5 text-aqua-300" /> Opening Hours</h3>
            <ul className="mt-4 divide-y divide-white/10 text-[15px]">
              {settings.hours?.map((h) => {
                const isToday = h.day.toLowerCase() === today.toLowerCase()
                return (
                  <li key={h.day} className={`flex justify-between py-2.5 ${isToday ? 'font-semibold text-aqua-300' : 'text-white/75'}`}>
                    <span>{h.day}{isToday && ' (Today)'}</span>
                    <span className={h.time === 'Closed' && !isToday ? 'text-white/45' : ''}>{h.time}</span>
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* EMBEDDED GOOGLE MAP */}
      <Reveal anim="zoom" className="shell mt-6">
        <div className="glass overflow-hidden rounded-3xl p-2">
          <iframe title={`Map showing ${settings.clinicName}`} src={settings.mapEmbedUrl} className="h-80 w-full rounded-2xl sm:h-[420px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </Reveal>
    </>
  )
}
