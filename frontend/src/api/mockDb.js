// Fake backend: jab tak Express/MongoDB nahi bana, data browser ke localStorage mein rehta hai.
// Admin panel mein kiya change public site par turant dikhta hai.
import { seedSite, seedClinic, seedPages, seedServices, seedTeam, seedFaqs, seedTestimonials, seedMedia, seedEnquiries, seedUsers } from '../data/seed'

const KEY = 'dp_mock_db_v4'
const wait = (ms = 200) => new Promise((r) => setTimeout(r, ms))
const uid = () => Math.random().toString(36).slice(2, 10)

// Saved data mein naye seed keys bhi aa jaayein (deep merge, saved values jeet-ti hain)
function merge(seed, saved) {
  if (Array.isArray(seed) || typeof seed !== 'object' || seed === null) return saved ?? seed
  const out = { ...seed }
  Object.keys(saved || {}).forEach((k) => {
    out[k] = k in seed ? merge(seed[k], saved[k]) : saved[k]
  })
  return out
}

const SEED = () => ({
  site: seedSite,
  clinic: seedClinic,
  pages: seedPages,
  services: seedServices,
  team: seedTeam,
  faqs: seedFaqs,
  testimonials: seedTestimonials,
  media: seedMedia,
  enquiries: seedEnquiries,
  users: seedUsers,
})

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const db = JSON.parse(raw)
      db.site = merge(seedSite, db.site)
      db.clinic = merge(seedClinic, db.clinic)
      db.pages = merge(seedPages, db.pages)
      // Purane saved data mein naya collection (jaise faqs) na ho to seed se bhar do
      Object.entries(SEED()).forEach(([k, v]) => {
        if (!(k in db)) db[k] = v
      })
      return db
    }
  } catch {
    /* ignore */
  }
  const fresh = SEED()
  save(fresh)
  return fresh
}

function save(db) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db))
  } catch {
    const err = new Error('Storage is full. Use a smaller image or an image URL.')
    err.response = { status: 413, data: { message: err.message } }
    throw err
  }
}

function fail(status, message) {
  const err = new Error(message)
  err.response = { status, data: { message } }
  throw err
}

// Fake JWT: header.payload.signature (sirf demo, verify nahi hota)
function makeToken(user) {
  const payload = { id: user._id, role: user.role, name: user.name, exp: Date.now() + 1000 * 60 * 60 * 8 }
  return `mock.${btoa(JSON.stringify(payload))}.sig`
}

export function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

const publicUser = ({ password, ...u }) => u

export const mock = {
  async login({ email, password }) {
    await wait()
    const user = load().users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!user || user.password !== password) fail(401, 'Incorrect email or password.')
    if (user.active === false) fail(403, 'This account has been disabled. Please contact the clinic admin.')
    return { token: makeToken(user), user: publicUser(user) }
  },
  async changePassword(token, { currentPassword, newPassword }) {
    await wait()
    const p = decodeToken(token)
    const db = load()
    const user = db.users.find((u) => u._id === p?.id)
    if (!user) fail(401, 'Please sign in again.')
    if (user.password !== currentPassword) fail(400, 'Your current password is not correct.')
    if (!newPassword || newPassword.length < 10) fail(400, 'Password must be at least 10 characters')
    user.password = newPassword
    save(db)
    return { ok: true }
  },
  async me(token) {
    await wait(80)
    const p = decodeToken(token)
    if (!p || p.exp < Date.now()) fail(401, 'Session expired')
    const user = load().users.find((u) => u._id === p.id)
    if (!user) fail(401, 'User not found')
    return { user: publicUser(user) }
  },

  // Singleton documents: site | clinic | pages
  async getDoc(name) {
    await wait(60)
    return load()[name]
  },
  async updateDoc(name, data) {
    await wait()
    const db = load()
    db[name] = { ...db[name], ...data }
    save(db)
    return db[name]
  },

  // Collections: services | team | faqs | testimonials | media | enquiries | users
  async list(collection) {
    await wait()
    const items = load()[collection]
    return collection === 'users' ? items.map(publicUser) : items
  },
  async get(collection, id) {
    await wait()
    const item = load()[collection].find((x) => x._id === id || x.slug === id)
    if (!item) fail(404, 'Not found')
    return item
  },
  async create(collection, data) {
    await wait()
    const db = load()
    const item = { _id: uid(), createdAt: new Date().toISOString(), ...data }
    db[collection] = [item, ...db[collection]]
    save(db)
    return collection === 'users' ? publicUser(item) : item
  },
  async update(collection, id, data) {
    await wait()
    const db = load()
    db[collection] = db[collection].map((x) => (x._id === id ? { ...x, ...data } : x))
    save(db)
    const item = db[collection].find((x) => x._id === id)
    return collection === 'users' ? publicUser(item) : item
  },
  async remove(collection, id) {
    await wait()
    const db = load()
    db[collection] = db[collection].filter((x) => x._id !== id)
    save(db)
    return { ok: true }
  },

  reset() {
    localStorage.removeItem(KEY)
  },
}
