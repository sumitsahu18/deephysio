import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { siteApi, clinicApi, pagesApi } from '../api/endpoints'
import { seedSite, seedClinic, seedPages } from '../data/seed'

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

  const settings = { ...site, ...clinic }

  return (
    <SiteContext.Provider value={{ settings, site, clinic, pages, setSite, setClinic, setPages, refresh }}>
      {children}
    </SiteContext.Provider>
  )
}

export const useSite = () => useContext(SiteContext)
