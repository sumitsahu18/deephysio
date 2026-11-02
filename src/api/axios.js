import axios from 'axios'

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
      }
    }
    return Promise.reject(error)
  },
)

export default api
