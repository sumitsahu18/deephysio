import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { siteApi, clinicApi, pagesApi } from '../api/endpoints'
import { seedSite, seedClinic, seedPages, DEFAULT_THEME } from '../data/seed'

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

// Poori public site ka content API se aata hai - koi text component mein hardcode nahi.
//   settings = site (admin) + clinic (reception) details, ek object mein
//   pages    = har page ka headline / paragraph / image
const SiteContext = createContext(null)

export function SiteProvider({ children }) {
  const [site, setSite] = useState(seedSite)
  const [clinic, setClinic] = useState(seedClinic)
  const [pages, setPages] = useState(seedPages)

  const refresh = useCallback(() => {
    siteApi.get().then(setSite).catch(() => {})
    clinicApi.get().then(setClinic).catch(() => {})
    pagesApi.get().then(setPages).catch(() => {})
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    applyTheme(site.theme)
  }, [site.theme])

  const settings = { ...site, ...clinic }

  return (
    <SiteContext.Provider value={{ settings, site, clinic, pages, setSite, setClinic, setPages, refresh }}>
      {children}
    </SiteContext.Provider>
  )
}

export const useSite = () => useContext(SiteContext)
