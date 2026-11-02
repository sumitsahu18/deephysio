import User from '../models/User.js'
import { ACCESS_COOKIE, verifyAccess } from '../lib/tokens.js'
import { hasPermission } from '../../src/lib/permissions.js'
import { HttpError } from './errors.js'

// Login zaroori. Har request par DB se user check: band account / badla password / badla role -> turant logout.
export async function requireAuth(req, _res, next) {
  const token = req.cookies?.[ACCESS_COOKIE]
  if (!token) return next(new HttpError(401, 'Please sign in.'))
  let payload
  try {
    payload = verifyAccess(token)
  } catch {
    return next(new HttpError(401, 'Your session has expired. Please sign in again.'))
  }
  const user = await User.findById(payload.sub).select('+tokenVersion')
  if (!user || !user.active || user.tokenVersion !== payload.tv) return next(new HttpError(401, 'Please sign in again.'))
  req.user = user
  next()
}

// Role permission (src/lib/permissions.js) - UI mein chhupana kaafi nahi, server bhi mana karta hai
export const requirePerm =
  (...perms) =>
  (req, _res, next) => {
    if (!req.user) return next(new HttpError(401, 'Please sign in.'))
    const ok = perms.every((p) => hasPermission(req.user.role, p))
    return ok ? next() : next(new HttpError(403, 'You do not have permission to do this.'))
  }
