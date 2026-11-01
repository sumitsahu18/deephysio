import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { settingsApi } from '../api/endpoints'
import { seedSettings } from '../data/seed'

// Clinic ki settings (phone, email, hours, address) API se aati hain,
// isliye koi bhi detail component mein hardcode nahi hai.
const SiteContext = createContext({ settings: seedSettings, refresh: () => {} })

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(seedSettings)

  const refresh = useCallback(() => {
    settingsApi
      .get()
      .then(setSettings)
      .catch(() => {})
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return <SiteContext.Provider value={{ settings, setSettings, refresh }}>{children}</SiteContext.Provider>
}

export const useSite = () => useContext(SiteContext)
