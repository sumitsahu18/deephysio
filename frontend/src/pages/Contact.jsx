import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, CheckCircle2, LoaderCircle, Send, Calendar, Stethoscope, AlertCircle, Info } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { enquiriesApi, getErrorMessage } from '../api/endpoints'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import ClinicLocationsSection from '../components/ClinicLocationsSection'
import { todayName } from '../utils/hours'
import { WhatsAppIcon, whatsappLink, formatWhatsapp } from '../components/SocialIcons'

const REASONS = [
  'Sports Injury',
  'Back/Neck Pain',
  'Post-Op',
  'Acupuncture',
  'Home Visit',
  'Other',
]

const TIME_OPTIONS = [
  'Morning (09:00 - 12:00)',
  'Afternoon (12:00 - 15:00)',
  'Late Afternoon (15:00 - 17:00)',
  'Flexible / Any time',
]

const empty = {
  name: '',
  email: '',
  phone: '',
  preferredDate: '',
  preferredTime: '',
  reason: '',
  message: '',
  consent: false,
  website: '',
}

const errCls = 'mt-1 text-xs font-semibold text-rose-300'

export default function Contact() {
  const { settings, pages } = useSite()
  const p = pages.contact
  const [searchParams] = useSearchParams()

  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [serverError, setServerError] = useState('')
  const [submittedDetails, setSubmittedDetails] = useState(null)
  const today = todayName()
  const minDate = new Date().toISOString().split('T')[0]

  // Pre-fill reason if arrived from a service or pricing card (e.g. ?reason=Acupuncture)
  useEffect(() => {
    const r = searchParams.get('reason') || searchParams.get('service')
    if (r) {
      if (/acupuncture/i.test(r)) setForm((f) => ({ ...f, reason: 'Acupuncture' }))
      else if (/sports/i.test(r)) setForm((f) => ({ ...f, reason: 'Sports Injury' }))
      else if (/back|neck|spine/i.test(r)) setForm((f) => ({ ...f, reason: 'Back/Neck Pain' }))
      else if (/post-?op|surgery|rehab/i.test(r)) setForm((f) => ({ ...f, reason: 'Post-Op' }))
      else if (/home/i.test(r)) setForm((f) => ({ ...f, reason: 'Home Visit' }))
      else setForm((f) => ({ ...f, reason: 'Other' }))
    }
  }, [searchParams])

  const set = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))

  function validate() {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Please enter your full name.'

    const email = form.email.trim()
    if (!email) {
      e.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Please enter a valid email address.'
    }

    const phone = form.phone.trim()
    if (!phone) {
      e.phone = 'Please enter your phone number.'
    } else if (!/^[+\d][\d\s()-]{7,}$/.test(phone)) {
      e.phone = 'Please enter a valid phone number (at least 7 digits).'
    }

    if (!form.reason) {
      e.reason = 'Please select a reason for your appointment.'
    }

    if (!form.preferredDate) {
      e.preferredDate = 'Please select your preferred appointment date.'
    } else if (new Date(form.preferredDate) < new Date(new Date().setHours(0, 0, 0, 0))) {
      e.preferredDate = 'Please select a date in the future.'
    }

    if (!form.preferredTime) {
      e.preferredTime = 'Please select your preferred appointment time.'
    }

    if (form.message.trim().length > 2000) {
      e.message = 'Please keep your message under 2000 characters.'
    }

    if (!form.consent) {
      e.consent = 'Please tick this box to consent to contact regarding your booking.'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (form.website) return // honeypot
    if (!validate()) return
    setStatus('sending')
    setServerError('')
    try {
      const { consent, website, ...payload } = form
      const clean = Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, String(v).trim()]))
      await enquiriesApi.create({ ...clean, status: 'new' })
      setSubmittedDetails({ ...clean })
      setStatus('sent')
      setForm(empty)
      setErrors({})
    } catch (error) {
      setServerError(getErrorMessage(error))
      setStatus('error')
    }
  }

  return (
    <>
      <PageHeader title={p.title} intro={p.intro} image={p.headerImage} />

      <section className="shell mt-10 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* BOOKING / ENQUIRY FORM */}
        <Reveal anim="left" id="enquiry" className="glass relative isolate scroll-mt-28 overflow-hidden rounded-3xl p-5 min-[400px]:p-6 sm:p-9 lg:col-span-3">
          <div className="inner-glow opacity-50" />
          {status === 'sent' && submittedDetails ? (
            <div className="py-10 text-center" role="status">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-aqua-400/20 text-aqua-300">
                <CheckCircle2 className="anim-zoom-in size-10" />
              </div>
              <h2 className="mt-5 font-glass text-2xl font-bold text-white sm:text-3xl">
                Appointment Request Received
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
                Thank you, <strong className="text-white">{submittedDetails.name}</strong>. We have received your booking enquiry for{' '}
                <strong className="text-aqua-300">{submittedDetails.reason}</strong> on{' '}
                <strong className="text-white">{submittedDetails.preferredDate}</strong> ({submittedDetails.preferredTime}).
              </p>

              {/* Explicit request vs confirmed appointment disclaimer */}
              <div className="mx-auto mt-6 max-w-md rounded-2xl border border-white/20 bg-white/10 p-4 text-xs leading-relaxed text-white/90 text-left">
                <p className="font-semibold text-aqua-300 flex items-center gap-1.5 mb-1">
                  <Info className="size-4 shrink-0" /> Important Booking Notice:
                </p>
                This submission is an appointment request. Our clinic reception will contact you by telephone or email within clinical hours to confirm therapist availability and finalize your appointment time slot.
              </div>

              <button
                type="button"
                className="btn-white mt-8 px-8 py-3 text-sm font-semibold"
                onClick={() => {
                  setStatus('idle')
                  setSubmittedDetails(null)
                }}
              >
                Send Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <div>
                <p className="eyebrow-glass">Request an Appointment</p>
                <h2 className="mt-2 font-glass text-3xl font-semibold text-white">{p.formTitle || 'Book a Treatment Session'}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-white/70">
                  Fill in your preferred date and treatment details below. We review all requests promptly.
                </p>
              </div>

              {/* 1. Personal & Contact Information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="label-glass">
                    Full Name <span className="text-coral-300">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="input-glass"
                    value={form.name}
                    onChange={set('name')}
                    autoComplete="name"
                    placeholder="e.g. John Smith"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className={errCls}>{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="label-glass">
                    Phone Number <span className="text-coral-300">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="input-glass"
                    value={form.phone}
                    onChange={set('phone')}
                    autoComplete="tel"
                    placeholder="e.g. 07737 610615"
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && <p className={errCls}>{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="label-glass">
                    Email Address <span className="text-coral-300">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="input-glass"
                    value={form.email}
                    onChange={set('email')}
                    autoComplete="email"
                    placeholder="e.g. john@example.com"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className={errCls}>{errors.email}</p>}
                </div>
              </div>

              {/* 2. Reason for Appointment & Scheduling */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <label htmlFor="reason" className="label-glass">
                    Reason for Appointment <span className="text-coral-300">*</span>
                  </label>
                  <select
                    id="reason"
                    className="input-glass font-medium"
                    value={form.reason}
                    onChange={set('reason')}
                    aria-invalid={!!errors.reason}
                  >
                    <option value="">Select reason for appointment...</option>
                    {REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  {errors.reason && <p className={errCls}>{errors.reason}</p>}
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="preferredDate" className="label-glass">
                    Preferred Date <span className="text-coral-300">*</span>
                  </label>
                  <input
                    id="preferredDate"
                    type="date"
                    min={minDate}
                    className="input-glass"
                    value={form.preferredDate}
                    onChange={set('preferredDate')}
                    aria-invalid={!!errors.preferredDate}
                  />
                  {errors.preferredDate && <p className={errCls}>{errors.preferredDate}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="preferredTime" className="label-glass">
                    Preferred Time <span className="text-coral-300">*</span>
                  </label>
                  <select
                    id="preferredTime"
                    className="input-glass font-medium"
                    value={form.preferredTime}
                    onChange={set('preferredTime')}
                    aria-invalid={!!errors.preferredTime}
                  >
                    <option value="">Select preferred time...</option>
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.preferredTime && <p className={errCls}>{errors.preferredTime}</p>}
                </div>
              </div>

              {/* 3. Optional Message / Condition Description */}
              <div>
                <label htmlFor="message" className="label-glass">
                  Message / Condition Description <span className="text-xs text-white/60 font-normal">(optional)</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="input-glass resize-y"
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Tell us briefly about your symptoms, previous treatments, or any specific requirements..."
                  aria-invalid={!!errors.message}
                />
                {errors.message && <p className={errCls}>{errors.message}</p>}
              </div>

              {/* Informative notice: Request vs instant confirmed */}
              <div className="rounded-2xl border border-white/20 bg-white/10 p-3.5 text-xs text-white/80 flex items-start gap-2.5">
                <Info className="size-4 shrink-0 text-aqua-300 mt-0.5" />
                <span>
                  <strong>Appointment Request Notice:</strong> Submitting this enquiry does not confirm your booking instantly. Our clinic reception will contact you to confirm available appointment times and therapist scheduling.
                </span>
              </div>

              {/* Honeypot for spam bots */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={set('website')}
                className="hidden"
                aria-hidden="true"
              />

              {/* Data Consent */}
              <label className="flex gap-3 text-xs leading-relaxed text-white/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={set('consent')}
                  className="mt-0.5 size-4 shrink-0 accent-aqua"
                />
                <span>
                  I agree to {settings.clinicName || 'DeePhysio'} processing my contact details to arrange and confirm my physiotherapy appointment, as detailed in the{' '}
                  <Link to="/privacy" className="font-semibold text-aqua-300 underline">
                    privacy policy
                  </Link>.
                </span>
              </label>
              {errors.consent && <p className={errCls}>{errors.consent}</p>}

              {serverError && (
                <div className="flex items-center gap-2 rounded-xl bg-coral/20 border border-coral-300/40 p-3 text-xs text-white">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-white w-full py-3.5 text-base font-semibold sm:w-auto sm:px-10"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? (
                  <>
                    <LoaderCircle className="size-5 animate-spin" />
                    <span>Submitting Request…</span>
                  </>
                ) : (
                  <>
                    <Send className="size-5" />
                    <span>Submit Booking Request</span>
                  </>
                )}
              </button>
            </form>
          )}
        </Reveal>

        {/* CLICK-TO-CALL + DETAILS + HOURS */}
        <div className="space-y-6 lg:col-span-2">
          <Reveal anim="right" className="grad-aurora space-y-5 rounded-3xl border border-white/25 p-7">
            <a
              href={`tel:${settings.phoneHref || settings.phone?.replace(/[^\d+]/g, '')}`}
              className="flex items-center gap-4 rounded-2xl border border-white/30 bg-white/15 p-4 transition-colors hover:bg-white/25"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-deep">
                <Phone className="size-5" />
              </span>
              <span>
                <span className="block text-sm text-white/85">Tap to call</span>
                <span className="block font-glass text-2xl font-semibold">{settings.phone}</span>
              </span>
            </a>

            {settings.whatsapp && (
              <a
                href={whatsappLink(settings.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 hover:underline text-white font-medium"
              >
                <WhatsAppIcon className="size-5 shrink-0" />
                <span>WhatsApp {formatWhatsapp(settings.whatsapp)}</span>
              </a>
            )}

            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-3 hover:underline text-white/90 break-all text-sm"
            >
              <Mail className="size-5 shrink-0" />
              <span>{settings.email}</span>
            </a>

            <p className="flex gap-3 text-sm text-white/90">
              <MapPin className="size-5 shrink-0" />
              <span>{settings.address}</span>
            </p>
          </Reveal>

          <Reveal anim="right" delay={120} className="glass rounded-3xl p-7">
            <h3 className="flex items-center gap-2 font-glass text-xl font-semibold">
              <Clock className="size-5 text-aqua-300" /> Opening Hours
            </h3>
            <ul className="mt-4 divide-y divide-white/10 text-[15px]">
              {settings.hours?.map((h) => {
                const isToday = h.day.toLowerCase() === today.toLowerCase()
                return (
                  <li
                    key={h.day}
                    className={`flex justify-between py-2.5 ${
                      isToday ? 'font-semibold text-aqua-300' : 'text-white/75'
                    }`}
                  >
                    <span>{h.day}{isToday && ' (Today)'}</span>
                    <span className={h.time === 'Closed' && !isToday ? 'text-white/45' : ''}>{h.time}</span>
                  </li>
                )
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* PRACTICE CLINIC LOCATIONS & INTERACTIVE MAPS */}
      <ClinicLocationsSection />
    </>
  )
}
