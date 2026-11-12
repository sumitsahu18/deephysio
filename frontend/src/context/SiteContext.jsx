import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { siteApi, clinicApi, pagesApi, accreditationsApi, trustBadgesApi, pricingApi, insurersApi, locationsApi } from '../api/endpoints'
import { seedSite, seedClinic, seedPages, seedAccreditations, seedTrustBadges, seedPricing, seedInsurers, seedLocations, DEFAULT_THEME } from '../data/seed'

// Theme Settings ke colour -> CSS variables (index.css ki saari classes inhi se bani hain)
const THEME_VARS = {
  primary: '--color-aqua',
  secondary: '--color-violet',
  accent: '--color-coral',
  background: '--color-deep',
  button: '--color-btn',
  buttonText: '--color-btn-text',
  text: '--color-text',
}

const CACHE_SITE_KEY = 'dp_site_cache_v1'
const CACHE_CLINIC_KEY = 'dp_clinic_cache_v1'

function getCached(key, fallback) {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null
    if (raw) return { ...fallback, ...JSON.parse(raw) }
  } catch {}
  return fallback
}

// Purana dark theme (jo pehle default tha) database / browser mein save ho to naya light theme lagao.
// Admin ne khud jo custom rang chune hain wo waise hi rehte hain.
const OLD_DARK_DEFAULT = { background: '#072e37', text: '#ffffff' }
export function normalizeTheme(theme) {
  const t = theme || {}
  const isOldDark =
    String(t.background || '').toLowerCase() === OLD_DARK_DEFAULT.background &&
    String(t.text || '').toLowerCase() === OLD_DARK_DEFAULT.text
  return isOldDark ? { ...DEFAULT_THEME } : { ...DEFAULT_THEME, ...t }
}

export function applyTheme(theme, el = document.documentElement) {
  const t = normalizeTheme(theme)
  Object.entries(THEME_VARS).forEach(([k, v]) => {
    if (/^#[0-9a-f]{3,8}$/i.test(t[k] || '')) el.style.setProperty(v, t[k])
  })
}

// Initial theme apply from cache (instant, no flash)
if (typeof document !== 'undefined') {
  try {
    const initial = getCached(CACHE_SITE_KEY, seedSite)
    if (initial?.theme) applyTheme(initial.theme)
  } catch {}
}

// Poori public site ka content API se aata hai - koi text component mein hardcode nahi.
//   settings = site (admin) + clinic (reception) details, ek object mein
//   pages    = har page ka headline / paragraph / image
const SiteContext = createContext(null)

export function SiteProvider({ children }) {
  const [site, setSiteState] = useState(() => getCached(CACHE_SITE_KEY, seedSite))
  const [clinic, setClinicState] = useState(() => getCached(CACHE_CLINIC_KEY, seedClinic))
  const [loaded, setLoaded] = useState(() => {
    try {
      return typeof window !== 'undefined' && !!localStorage.getItem(CACHE_SITE_KEY)
    } catch {
      return false
    }
  })
  const [pages, setPages] = useState(seedPages)
  const [accreditations, setAccreditations] = useState(seedAccreditations)
  const [trustBadges, setTrustBadges] = useState(seedTrustBadges)
  const [pricing, setPricing] = useState(seedPricing)
  const [insurers, setInsurers] = useState(seedInsurers)
  const [locations, setLocations] = useState(seedLocations)

  const setSite = useCallback((value) => {
    setSiteState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value
      try {
        localStorage.setItem(CACHE_SITE_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const setClinic = useCallback((value) => {
    setClinicState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value
      try {
        localStorage.setItem(CACHE_CLINIC_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const refresh = useCallback(() => {
    siteApi
      .get()
      .then((data) => {
        setSite(data)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
    clinicApi
      .get()
      .then(setClinic)
      .catch(() => {})
    pagesApi.get().then(setPages).catch(() => {})
    accreditationsApi.list().then(setAccreditations).catch(() => {})
    trustBadgesApi.list().then(setTrustBadges).catch(() => {})
    pricingApi.list().then(setPricing).catch(() => {})
    insurersApi.list().then(setInsurers).catch(() => {})
    locationsApi.list().then(setLocations).catch(() => {})
  }, [setSite, setClinic])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    applyTheme(site.theme)
  }, [site.theme])

  const settings = { ...site, ...clinic }

  return (
    <SiteContext.Provider
      value={{
        settings,
        site,
        clinic,
        loaded,
        pages,
        accreditations,
        trustBadges,
        pricing,
        insurers,
        locations,
        setSite,
        setClinic,
        setPages,
        setAccreditations,
        setTrustBadges,
        setPricing,
        setInsurers,
        setLocations,
        refresh,
      }}
    >
      {children}
    </SiteContext.Provider>
  )
}

export const useSite = () => useContext(SiteContext)
