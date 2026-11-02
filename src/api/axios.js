import axios from 'axios'

<<<<<<< HEAD
// Login JWT httpOnly cookies mein hai (server set karta hai) - JavaScript token ko dekhta/rakhta hi nahi.
// withCredentials: cookies saath jayein. X-Requested-With: server ka CSRF check.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'deephysio' },
})

// Access token (15 min) expire ho to chup-chaap refresh karke request dobara. Refresh bhi fail -> login page.
let refreshing = null
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {}
    const isAuthCall = /\/auth\/(login|refresh|logout)/.test(original.url || '')
    if (error.response?.status === 401 && !original._retried && !isAuthCall) {
      original._retried = true
      try {
        refreshing = refreshing || api.post('/auth/refresh').finally(() => (refreshing = null))
        await refreshing
        return api(original)
      } catch {
        const p = window.location.pathname
        if (p.startsWith('/admin') && p !== '/admin/login') window.location.href = '/admin/login'
=======
export const TOKEN_KEY = 'dp_token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Har request ke saath JWT token bhejo: Authorization: Bearer <token>
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Token expire ya invalid ho to logout karke login page par bhejo
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
>>>>>>> 7f723cae747664c324f371ef57f411b38bbad52e
      }
    }
    return Promise.reject(error)
  },
)

export default api
