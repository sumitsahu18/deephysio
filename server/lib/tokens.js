// JWT login: access token (15 min) + refresh token (7 din), dono httpOnly cookies mein.
// JavaScript inhe padh nahi sakta -> XSS se token chori nahi hota. SameSite=Strict -> doosri site se request mein nahi jaate.
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import mongoose from 'mongoose'
import RefreshToken from '../models/RefreshToken.js'

export const ACCESS_COOKIE = 'dp_at'
export const REFRESH_COOKIE = 'dp_rt'

const base = () => ({ httpOnly: true, secure: config.COOKIE_SECURE, sameSite: 'strict' })
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex')

export function signAccess(user) {
  return jwt.sign({ sub: String(user._id), role: user.role, tv: user.tokenVersion ?? 0 }, config.JWT_ACCESS_SECRET, {
    algorithm: 'HS256',
    expiresIn: `${config.ACCESS_TOKEN_MINUTES}m`,
    issuer: 'deephysio',
    audience: 'deephysio-admin',
  })
}

export function verifyAccess(token) {
  return jwt.verify(token, config.JWT_ACCESS_SECRET, { algorithms: ['HS256'], issuer: 'deephysio', audience: 'deephysio-admin' })
}

// Naya refresh token: random value + JWT ke andar user id. DB mein sirf hash.
async function newRefresh(user, userAgent) {
  const raw = crypto.randomBytes(48).toString('base64url')
  const expiresAt = new Date(Date.now() + config.REFRESH_TOKEN_DAYS * 864e5)
  await RefreshToken.create({ user: user._id, hash: sha256(raw), expiresAt, userAgent: String(userAgent || '').slice(0, 300) })
  const token = jwt.sign({ sub: String(user._id), r: raw }, config.JWT_REFRESH_SECRET, {
    algorithm: 'HS256',
    expiresIn: `${config.REFRESH_TOKEN_DAYS}d`,
    issuer: 'deephysio',
  })
  return { token, expiresAt }
}

export async function issueTokens(res, user, userAgent) {
  const access = signAccess(user)
  const { token, expiresAt } = await newRefresh(user, userAgent)
  res.cookie(ACCESS_COOKIE, access, { ...base(), path: '/api', maxAge: config.ACCESS_TOKEN_MINUTES * 60e3 })
  res.cookie(REFRESH_COOKIE, token, { ...base(), path: '/api/auth', expires: expiresAt })
}

export function clearTokens(res) {
  res.clearCookie(ACCESS_COOKIE, { ...base(), path: '/api' })
  res.clearCookie(REFRESH_COOKIE, { ...base(), path: '/api/auth' })
}

// Refresh token check + rotation. Returns userId ya null.
export async function useRefresh(token) {
  let payload
  try {
    payload = jwt.verify(token, config.JWT_REFRESH_SECRET, { algorithms: ['HS256'], issuer: 'deephysio' })
  } catch {
    return null
  }
  const doc = await RefreshToken.findOne({ hash: sha256(payload.r) })
  if (!doc || String(doc.user) !== payload.sub) return null
  if (doc.revokedAt) {
    // Ek baar use ho chuka token dobara aaya -> chori ka shak -> is user ke SAARE tokens band
    await revokeAll(doc.user)
    return null
  }
  if (doc.expiresAt < new Date()) return null
  doc.revokedAt = new Date()
  await doc.save()
  return payload.sub
}

export async function revokeRefresh(token) {
  try {
    const payload = jwt.verify(token, config.JWT_REFRESH_SECRET, { algorithms: ['HS256'], issuer: 'deephysio' })
    await RefreshToken.updateOne({ hash: sha256(payload.r), revokedAt: null }, { $set: { revokedAt: new Date() } })
  } catch {
    /* already invalid */
  }
}

export const revokeAll = (userId) => RefreshToken.updateMany({ user: userId, revokedAt: null }, { $set: { revokedAt: new Date() } })

// Purane / expired token records saaf
export const cleanupTokens = () => RefreshToken.deleteMany({ expiresAt: mongoose.trusted({ $lt: new Date(Date.now() - 864e5) }) })
