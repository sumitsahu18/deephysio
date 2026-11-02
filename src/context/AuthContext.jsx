import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi } from '../api/endpoints'
<<<<<<< HEAD

const AuthContext = createContext(null)

import { ROLE_PERMISSIONS } from '../lib/permissions'

export { ROLE_PERMISSIONS }
=======
import { TOKEN_KEY } from '../api/axios'

const AuthContext = createContext(null)

// Roles (client brief: ONE admin dashboard, staff ko restricted content-editing):
//   admin  -> sab kuch: theme, general settings, users, delete
//   editor -> clinic staff: homepage, about & team, services, contact & enquiries, media.
//             Theme, general settings, users aur delete NAHI.
export const ROLE_PERMISSIONS = {
  admin: ['dashboard', 'homepage', 'about', 'services', 'contact', 'media', 'theme', 'settings', 'users', 'delete'],
  editor: ['dashboard', 'homepage', 'about', 'services', 'contact', 'media'],
}
>>>>>>> 7f723cae747664c324f371ef57f411b38bbad52e

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

<<<<<<< HEAD
  // App load par session check (cookie server ke paas hai, JS ko token nahi dikhta)
  useEffect(() => {
    let active = true
    authApi
      .me()
      .then((res) => active && setUser(res.user))
      .catch(() => active && setUser(null))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const { user } = await authApi.login({ email, password })
=======
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
>>>>>>> 7f723cae747664c324f371ef57f411b38bbad52e
    setUser(user)
    return user
  }, [])

<<<<<<< HEAD
  const logout = useCallback(async () => {
    await authApi.logout()
=======
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
>>>>>>> 7f723cae747664c324f371ef57f411b38bbad52e
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
