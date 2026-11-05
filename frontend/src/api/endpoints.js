// Saari API calls ek jagah. Components sirf yahi functions use karte hain.
// VITE_USE_MOCK=true -> mockDb (localStorage), false -> asli Express backend.
//
// Backend banate waqt ye routes banane hain (Express + MongoDB + JWT):
//   POST   /api/auth/login        -> { user } + httpOnly cookies (access 15 min, refresh 7 din)
//   POST   /api/auth/refresh      -> naye cookies (rotation)
//   POST   /api/auth/logout
//   GET    /api/auth/me           -> { user }                          (JWT cookie)
//   POST   /api/auth/change-password { currentPassword, newPassword }
//   (Backend: server/ folder - routes server/routes/*.js)
//
//   GET    /api/site              -> site settings                     (public)
//   PUT    /api/site              -> site settings                     (admin)
//   GET    /api/clinic            -> phone, email, address, hours...   (public)
//   PUT    /api/clinic            -> clinic details                    (admin, editor)
//   GET    /api/pages             -> all page content                  (public)
//   PUT    /api/pages             -> page content                      (admin, editor)
//
//   GET    /api/services          -> [services]                        (public)
//   GET    /api/services/:slug    -> service                           (public)
//   POST   /api/services          -> service                           (admin, editor)
//   PUT    /api/services/:id      -> service                           (admin, editor)
//   DELETE /api/services/:id      -> { ok }                            (admin)
//   GET/POST/PUT/DELETE /api/team ...                                  (same pattern)
//   GET/POST/PUT/DELETE /api/testimonials ...                          (GET public, POST/PUT admin+editor, DELETE admin)
//   GET/POST/PUT/DELETE /api/faqs ...                                  (GET public, POST/PUT admin+editor, DELETE admin)
//
//   POST   /api/enquiries         -> enquiry  (public, rate-limited, emailed to clinic via SMTP)
//   GET    /api/enquiries         -> [enquiries]                       (admin, editor)
//   PUT    /api/enquiries/:id     -> enquiry                           (admin, editor)
//   DELETE /api/enquiries/:id     -> { ok }                            (admin)
//
//   GET/POST/PUT/DELETE /api/users ...                                 (admin only)
//   POST   /api/uploads           -> { url }  (multer; image upload)   (admin, editor)
//                                    sirf jpg/png/webp, max 5 MB, random filename, media collection mein entry
//   GET    /api/media             -> [ { _id, url, name, size } ]      (admin, editor)
//   DELETE /api/media/:id         -> { ok }  file bhi delete            (admin)

import api from './axios'
import { mock } from './mockDb'

export const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false'

const data = (p) => p.then((r) => r.data)

// ---------- Auth ----------
// Real: JWT httpOnly cookies (server). Mock (demo): token browser mein, sirf demo ke liye.
const MOCK_TOKEN = 'dp_mock_token'
export const authApi = {
  login: async (creds) => {
    if (!USE_MOCK) return data(api.post('/auth/login', creds))
    const { token, user } = await mock.login(creds)
    localStorage.setItem(MOCK_TOKEN, token)
    return { user }
  },
  me: () => (USE_MOCK ? mock.me(localStorage.getItem(MOCK_TOKEN)) : data(api.get('/auth/me'))),
  logout: async () => {
    if (USE_MOCK) return localStorage.removeItem(MOCK_TOKEN)
    await api.post('/auth/logout').catch(() => {})
  },
  changePassword: (body) =>
    USE_MOCK ? mock.changePassword(localStorage.getItem(MOCK_TOKEN), body) : data(api.post('/auth/change-password', body)),
}

// ---------- Singleton documents ----------
function doc(name) {
  return {
    get: () => (USE_MOCK ? mock.getDoc(name) : data(api.get(`/${name}`))),
    update: (body) => (USE_MOCK ? mock.updateDoc(name, body) : data(api.put(`/${name}`, body))),
  }
}
export const siteApi = doc('site')
export const clinicApi = doc('clinic')
export const pagesApi = doc('pages')

// ---------- Collections (CRUD) ----------
function crud(collection) {
  return {
    list: () => (USE_MOCK ? mock.list(collection) : data(api.get(`/${collection}`))),
    get: (id) => (USE_MOCK ? mock.get(collection, id) : data(api.get(`/${collection}/${id}`))),
    create: (body) => (USE_MOCK ? mock.create(collection, body) : data(api.post(`/${collection}`, body))),
    update: (id, body) => (USE_MOCK ? mock.update(collection, id, body) : data(api.put(`/${collection}/${id}`, body))),
    remove: (id) => (USE_MOCK ? mock.remove(collection, id) : data(api.delete(`/${collection}/${id}`))),
  }
}
export const servicesApi = crud('services')
export const teamApi = crud('team')
export const faqsApi = crud('faqs')
export const testimonialsApi = crud('testimonials')
export const accreditationsApi = crud('accreditations')
export const trustBadgesApi = crud('trust-badges')
export const pricingApi = crud('pricing')
export const insurersApi = crud('insurers')
export const locationsApi = crud('locations')
export const mediaApi = crud('media')
export const enquiriesApi = crud('enquiries')
export const usersApi = crud('users')

// ---------- Image upload ----------
// Mock: image browser mein hi chhoti (max 1600px, JPEG) karke data-URL banti hai + Media library mein entry.
// Backend: multipart upload -> /api/uploads -> { url } (server khud media entry banata hai)
export const MAX_UPLOAD_MB = 8
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

async function compress(file, maxSide = 1600, quality = 0.82) {
  const bmp = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bmp.width * scale)
  canvas.height = Math.round(bmp.height * scale)
  canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height)
  bmp.close?.()
  return canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality)
}

export async function uploadImage(file) {
  if (!ALLOWED.includes(file.type)) throw new Error('Please choose a JPG, PNG, WebP or GIF image.')
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) throw new Error(`Please use an image under ${MAX_UPLOAD_MB} MB.`)
  if (USE_MOCK) {
    const url = await compress(file)
    await mock.create('media', { url, name: file.name, size: Math.round((url.length * 3) / 4) })
    return url
  }
  const form = new FormData()
  form.append('image', file)
  const res = await api.post('/uploads', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  return res.data.url
}

export const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.'
