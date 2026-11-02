import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi } from '../api/endpoints'
import { TOKEN_KEY } from '../api/axios'

const AuthContext = createContext(null)

// Roles (PDF 2.3 "Role Configuration"):
//   admin  -> sab kuch: users, site settings, delete
//   editor -> clinic staff: page copy, media, treatments, team, FAQs, clinic hours/contact, enquiries.
//             Users, site-wide settings aur delete NAHI kar sakta.
export const ROLE_PERMISSIONS = {
  admin: ['dashboard', 'pages', 'services', 'team', 'faqs', 'testimonials', 'clinic', 'enquiries', 'site', 'users', 'delete'],
  editor: ['dashboard', 'pages', 'services', 'team', 'faqs', 'testimonials', 'clinic', 'enquiries'],
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // App load par token check karo
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    authApi
      .me()
      .then((res) => setUser(res.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const { token, user } = await authApi.login({ email, password })
    localStorage.setItem(TOKEN_KEY, token)
    setUser(user)
    return user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const can = useCallback(
    (permission) => !!user && (ROLE_PERMISSIONS[user.role] || []).includes(permission),
    [user],
  )

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, can, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
