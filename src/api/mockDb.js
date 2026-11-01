// Fake backend: jab tak Express/MongoDB nahi bana, data browser ke localStorage mein rehta hai.
// Isse admin panel mein kiya change public site par turant dikhta hai.
import { seedSettings, seedServices, seedTeam, seedFaqs, seedEnquiries, seedUsers } from '../data/seed'

const KEY = 'dp_mock_db_v1'
const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms))
const uid = () => Math.random().toString(36).slice(2, 10)

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  const fresh = {
    settings: seedSettings,
    services: seedServices,
    team: seedTeam,
    faqs: seedFaqs,
    enquiries: seedEnquiries,
    users: seedUsers,
  }
  save(fresh)
  return fresh
}

function save(db) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db))
  } catch {
    /* ignore */
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
    const db = load()
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!user || user.password !== password) fail(401, 'Invalid email or password')
    return { token: makeToken(user), user: publicUser(user) }
  },
  async me(token) {
    await wait(100)
    const p = decodeToken(token)
    if (!p || p.exp < Date.now()) fail(401, 'Session expired')
    const user = load().users.find((u) => u._id === p.id)
    if (!user) fail(401, 'User not found')
    return { user: publicUser(user) }
  },

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
    return item
  },
  async update(collection, id, data) {
    await wait()
    const db = load()
    db[collection] = db[collection].map((x) => (x._id === id ? { ...x, ...data } : x))
    save(db)
    return db[collection].find((x) => x._id === id)
  },
  async remove(collection, id) {
    await wait()
    const db = load()
    db[collection] = db[collection].filter((x) => x._id !== id)
    save(db)
    return { ok: true }
  },

  async getSettings() {
    await wait(100)
    return load().settings
  },
  async updateSettings(data) {
    await wait()
    const db = load()
    db.settings = { ...db.settings, ...data }
    save(db)
    return db.settings
  },

  reset() {
    localStorage.removeItem(KEY)
  },
}
