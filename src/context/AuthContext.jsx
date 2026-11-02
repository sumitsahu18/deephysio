import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi } from '../api/endpoints'

const AuthContext = createContext(null)

import { ROLE_PERMISSIONS } from '../lib/permissions'

export { ROLE_PERMISSIONS }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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
    setUser(user)
    return user
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
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
