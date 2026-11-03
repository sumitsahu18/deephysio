import { Router } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { loginSchema, changePasswordSchema } from '../lib/schemas.js'
import { issueTokens, clearTokens, useRefresh, revokeRefresh, revokeAll, REFRESH_COOKIE } from '../lib/tokens.js'
import { requireAuth } from '../middleware/auth.js'
import { loginLimiter } from '../middleware/security.js'
import { asyncH, HttpError } from '../middleware/errors.js'

const r = Router()
const MAX_FAILS = 5
const LOCK_MIN = 15
// User na mile tab bhi bcrypt chalao -> response time se pata na chale ki email exist karta hai ya nahi
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password-123', 12)

// POST /api/auth/login  { email, password }  -> cookies + { user }
r.post(
  '/login',
  loginLimiter,
  asyncH(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body)
    const user = await User.findOne({ email }).select('+passwordHash +tokenVersion +failedLogins +lockUntil')
    const fail = () => new HttpError(401, 'Incorrect email or password.')

    if (!user) {
      await bcrypt.compare(password, DUMMY_HASH)
      throw fail()
    }
    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new HttpError(429, `Too many wrong passwords. This account is locked for ${LOCK_MIN} minutes.`)
    }
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      user.failedLogins = (user.failedLogins || 0) + 1
      if (user.failedLogins >= MAX_FAILS) {
        user.lockUntil = new Date(Date.now() + LOCK_MIN * 60e3)
        user.failedLogins = 0
      }
      await user.save()
      throw fail()
    }
    if (!user.active) throw new HttpError(403, 'This account has been disabled. Please contact the clinic admin.')

    user.failedLogins = 0
    user.lockUntil = undefined
    user.lastLoginAt = new Date()
    await user.save()
    await issueTokens(res, user, req.get('User-Agent'))
    res.json({ user: user.toJSON() })
  }),
)

// POST /api/auth/refresh -> naya access + refresh token (rotation)
r.post(
  '/refresh',
  asyncH(async (req, res) => {
    const userId = await useRefresh(req.cookies?.[REFRESH_COOKIE])
    const user = userId && (await User.findById(userId).select('+tokenVersion'))
    if (!user || !user.active) {
      clearTokens(res)
      throw new HttpError(401, 'Please sign in again.')
    }
    await issueTokens(res, user, req.get('User-Agent'))
    res.json({ user: user.toJSON() })
  }),
)

// POST /api/auth/logout
r.post(
  '/logout',
  asyncH(async (req, res) => {
    await revokeRefresh(req.cookies?.[REFRESH_COOKIE])
    clearTokens(res)
    res.json({ ok: true })
  }),
)

// GET /api/auth/me
r.get('/me', requireAuth, (req, res) => res.json({ user: req.user.toJSON() }))

// POST /api/auth/change-password  { currentPassword, newPassword } - har user apna
r.post(
  '/change-password',
  requireAuth,
  asyncH(async (req, res) => {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body)
    const user = await User.findById(req.user._id).select('+passwordHash +tokenVersion')
    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) throw new HttpError(400, 'Your current password is not correct.')
    if (currentPassword === newPassword) throw new HttpError(400, 'Please choose a different password.')
    user.passwordHash = await bcrypt.hash(newPassword, 12)
    user.tokenVersion += 1 // baaki devices se logout
    await user.save()
    await revokeAll(user._id)
    await issueTokens(res, user, req.get('User-Agent')) // is device par login bana rahe
    res.json({ ok: true })
  }),
)

export default r
