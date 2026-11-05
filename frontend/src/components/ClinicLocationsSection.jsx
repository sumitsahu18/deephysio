import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Navigation, ExternalLink, Globe2, Building2, CheckCircle2 } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import Reveal from './Reveal'

export default function ClinicLocationsSection({ id = 'locations', className = '' }) {
  const { locations, settings } = useSite()

  const activeLocations = (locations || [])
    .filter((loc) => loc.active !== false)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

  // Fallback if no locations in DB
  const displayList = activeLocations.length > 0 ? activeLocations : [
    {
      _id: 'default',
      name: settings.clinicName ? `${settings.clinicName} Clinic` : 'DeePhysio Smethwick',
      address: settings.address || '7 Frank Road, Smethwick, Birmingham',
      postcode: 'B67 7NR',
      phone: settings.phone || '077 3761 0615',
      email: settings.email || 'deephysioclinic@gmail.com',
      hours: 'Monday–Friday: 09:00–17:00\nSaturday: 09:00–15:00\nSunday: Closed',
      mapUrl: settings.mapEmbedUrl || 'https://www.google.com/maps?q=7+Frank+Road,+Smethwick,+Birmingham+B67+7NR&output=embed',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=7+Frank+Road,+Smethwick,+Birmingham+B67+7NR',
      active: true,
      order: 1,
    },
  ]

  const [activeTab, setActiveTab] = useState(0)
  const isMulti = displayList.length > 1
  const selected = isMulti ? displayList[activeTab] || displayList[0] : displayList[0]

  const formatHours = (hoursStr) => {
    if (!hoursStr) return []
    return hoursStr.split('\n').map((l) => l.trim()).filter(Boolean)
  }

  const cleanPhone = (p = '') => p.replace(/[^\d+]/g, '')

  const languages = settings.languages?.length
    ? settings.languages
    : ['English', 'Hindi', 'Gujarati', 'Punjabi']

  return (
    <section id={id} className={`shell scroll-mt-24 mt-16 space-y-8 ${className}`} aria-label="Clinic Locations">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <span className="eyebrow inline-flex items-center gap-1.5 rounded-full border border-pine-100 bg-pine-50/70 px-3.5 py-1 text-xs font-semibold text-pine-700">
          <Building2 className="size-3.5" /> Practice Location
        </span>
        <h2 className="mt-3 font-glass text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
          {isMulti ? 'Our Clinic Locations' : 'Visit Our Practice Clinic'}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
          Conveniently accessible clinic with on-site clinical facilities, free parking, and appointments available within 24 hours.
        </p>

        {/* Multi-location selector tabs if more than one location exists */}
        {isMulti && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {displayList.map((loc, idx) => (
              <button
                key={loc._id || idx}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  activeTab === idx
                    ? 'bg-pine-700 text-white shadow-sm'
                    : 'border border-line bg-white/80 text-ink/75 hover:bg-sand/60'
                }`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Location Presentation */}
      <Reveal className="glass glow-hover overflow-hidden rounded-3xl border border-line bg-white/95 p-6 shadow-xs sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Details Column */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-pine-200 bg-pine-50 px-3 py-1 text-xs font-semibold text-pine-800">
                  <CheckCircle2 className="size-3.5 text-pine-600" /> Active Clinic Practice
                </span>
                {selected.postcode && (
                  <span className="rounded-lg border border-line bg-sand/30 px-2.5 py-1 font-mono text-xs font-bold text-pine-900">
                    {selected.postcode}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-glass text-2xl font-bold text-ink sm:text-3xl">
                  {selected.name}
                </h3>
                <p className="mt-2 flex items-start gap-2.5 text-sm leading-relaxed text-ink/90 sm:text-base">
                  <MapPin className="size-5 shrink-0 text-pine-700 mt-0.5" />
                  <span>
                    {selected.address}
                    {selected.postcode && !selected.address.includes(selected.postcode) ? `, ${selected.postcode}` : ''}
                  </span>
                </p>
              </div>

              {/* Direct Contact Links */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {selected.phone && (
                  <a
                    href={`tel:${cleanPhone(selected.phone)}`}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-sand/30 p-3.5 transition-colors hover:border-pine-300 hover:bg-sand/60"
                  >
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-pine-100/80 text-pine-700">
                      <Phone className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[11px] font-semibold text-muted uppercase">Phone</span>
                      <span className="block truncate text-sm font-bold text-ink">{selected.phone}</span>
                    </div>
                  </a>
                )}

                {selected.email && (
                  <a
                    href={`mailto:${selected.email}`}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-sand/30 p-3.5 transition-colors hover:border-pine-300 hover:bg-sand/60"
                  >
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-pine-100/80 text-pine-700">
                      <Mail className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[11px] font-semibold text-muted uppercase">Email</span>
                      <span className="block truncate text-sm font-bold text-ink">{selected.email}</span>
                    </div>
                  </a>
                )}
              </div>

              {/* Opening Hours */}
              {selected.hours && (
                <div className="rounded-2xl border border-line bg-sand/20 p-4">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pine-900 mb-2.5">
                    <Clock className="size-4 text-pine-700" /> Opening Hours
                  </p>
                  <ul className="space-y-1.5 text-xs text-ink/85 sm:text-sm">
                    {formatHours(selected.hours).map((h, i) => (
                      <li key={i} className="flex items-center justify-between border-b border-line/40 pb-1 last:border-b-0 last:pb-0">
                        <span className="font-medium text-ink">{h.split(':')[0]}</span>
                        <span className="font-semibold text-pine-800">{h.split(':').slice(1).join(':')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Languages Supported */}
              <div className="rounded-2xl border border-line/70 bg-white p-3.5 text-xs">
                <div className="flex items-center gap-2 text-pine-800 font-semibold mb-1.5">
                  <Globe2 className="size-3.5 text-pine-600" /> Consultations Available In:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {languages.map((lang) => (
                    <span
                      key={lang}
                      className="rounded-md border border-line bg-sand/30 px-2 py-0.5 text-[11px] font-medium text-ink"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {selected.directionsUrl ? (
                <a
                  href={selected.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary py-3 px-5 text-sm"
                >
                  <Navigation className="size-4" /> Get Directions
                </a>
              ) : (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    selected.address + (selected.postcode ? ` ${selected.postcode}` : '')
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary py-3 px-5 text-sm"
                >
                  <Navigation className="size-4" /> Get Directions
                </a>
              )}

              <Link
                to="/contact#enquiry"
                className="btn-outline py-3 px-5 text-sm font-semibold"
              >
                Book Appointment
              </Link>
            </div>
          </div>

          {/* Map Column */}
          <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-line bg-sand/30 shadow-inner sm:min-h-[380px] lg:col-span-6 lg:min-h-full">
            {selected.mapUrl ? (
              <iframe
                title={`Interactive Map for ${selected.name}`}
                src={selected.mapUrl}
                className="h-full min-h-[320px] w-full border-0 lg:min-h-[440px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center p-6 text-center text-muted">
                <MapPin className="size-10 text-pine-400 mb-2" />
                <p className="font-semibold text-ink">Map View Unavailable</p>
                <p className="mt-1 text-xs">A Google Maps embed link has not been configured for this location.</p>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

