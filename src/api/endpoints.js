// Saari API calls ek jagah. Components sirf yahi functions use karte hain.
// VITE_USE_MOCK=true -> mockDb (localStorage), false -> asli Express backend.
//
// Backend banate waqt ye routes banane hain (Express + MongoDB + JWT):
//   POST   /api/auth/login        -> { token, user }
//   GET    /api/auth/me           -> { user }                          (JWT)
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

import api, { TOKEN_KEY } from './axios'
import { mock } from './mockDb'

export const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false'

const data = (p) => p.then((r) => r.data)

// ---------- Auth ----------
export const authApi = {
  login: (creds) => (USE_MOCK ? mock.login(creds) : data(api.post('/auth/login', creds))),
  me: () => (USE_MOCK ? mock.me(localStorage.getItem(TOKEN_KEY)) : data(api.get('/auth/me'))),
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
export const enquiriesApi = crud('enquiries')
export const usersApi = crud('users')

// ---------- Image upload ----------
// Mock: chhoti image browser mein data-URL ban ke save hoti hai.
// Backend: multipart upload -> /api/uploads -> { url }
export const MAX_MOCK_IMAGE_KB = 700
export async function uploadImage(file) {
  if (USE_MOCK) {
    if (file.size > MAX_MOCK_IMAGE_KB * 1024)
      throw new Error(`Demo mode: please use an image under ${MAX_MOCK_IMAGE_KB} KB, or paste an image URL.`)
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Could not read the file'))
      reader.readAsDataURL(file)
    })
  }
  const form = new FormData()
  form.append('image', file)
  const res = await api.post('/uploads', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  return res.data.url
}

export const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.'
