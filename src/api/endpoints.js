// Saari API calls ek jagah. Components sirf yahi functions use karte hain.
// VITE_USE_MOCK=true -> mockDb (localStorage), false -> asli Express backend.
//
// Backend banate waqt ye routes banane hain (Express):
//   POST   /api/auth/login            -> { token, user }
//   GET    /api/auth/me               -> { user }               (JWT required)
//   GET    /api/settings              -> settings               (public)
//   PUT    /api/settings              -> settings               (admin)
//   GET    /api/services              -> [services]             (public)
//   GET    /api/services/:slug        -> service                (public)
//   POST   /api/services              -> service                (admin, editor)
//   PUT    /api/services/:id          -> service                (admin, editor)
//   DELETE /api/services/:id          -> { ok }                 (admin)
//   GET/POST/PUT/DELETE /api/team ... (same pattern)
//   GET/POST/PUT/DELETE /api/faqs ... (same pattern)
//   POST   /api/enquiries             -> enquiry                (public, rate-limited)
//   GET    /api/enquiries             -> [enquiries]            (admin, editor)
//   PUT    /api/enquiries/:id         -> enquiry                (admin, editor)
//   DELETE /api/enquiries/:id         -> { ok }                 (admin)
//   GET/POST/PUT/DELETE /api/users ...                          (admin only)

import api, { TOKEN_KEY } from './axios'
import { mock } from './mockDb'

export const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false'

const data = (p) => p.then((r) => r.data)

// ---------- Auth ----------
export const authApi = {
  login: (creds) => (USE_MOCK ? mock.login(creds) : data(api.post('/auth/login', creds))),
  me: () => (USE_MOCK ? mock.me(localStorage.getItem(TOKEN_KEY)) : data(api.get('/auth/me'))),
}

// ---------- Settings (phone, email, hours etc. - kuch bhi hardcode nahi) ----------
export const settingsApi = {
  get: () => (USE_MOCK ? mock.getSettings() : data(api.get('/settings'))),
  update: (body) => (USE_MOCK ? mock.updateSettings(body) : data(api.put('/settings', body))),
}

// ---------- Generic CRUD helper ----------
function crud(collection) {
  return {
    list: () => (USE_MOCK ? mock.list(collection) : data(api.get(`/${collection}`))),
    get: (id) => (USE_MOCK ? mock.get(collection, id) : data(api.get(`/${collection}/${id}`))),
    create: (body) => (USE_MOCK ? mock.create(collection, body) : data(api.post(`/${collection}`, body))),
    update: (id, body) =>
      USE_MOCK ? mock.update(collection, id, body) : data(api.put(`/${collection}/${id}`, body)),
    remove: (id) => (USE_MOCK ? mock.remove(collection, id) : data(api.delete(`/${collection}/${id}`))),
  }
}

export const servicesApi = crud('services')
export const teamApi = crud('team')
export const faqsApi = crud('faqs')
export const enquiriesApi = crud('enquiries')
export const usersApi = crud('users')

export const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.'
