import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { config } from '../config.js'
import { HttpError } from './errors.js'

// Security headers (CSP, HSTS, nosniff, frame-ancestors...). Google Maps iframe + Unsplash/Google fonts allowed.
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
      'img-src': ["'self'", 'data:', 'blob:', 'https:'],
      'frame-src': ['https://www.google.com', 'https://maps.google.com'],
      'connect-src': ["'self'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'upgrade-insecure-requests': config.isProd ? [] : null,
    },
  },
  hsts: config.isProd ? { maxAge: 31536000, includeSubDomains: true } : false,
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
})

// CSRF: cookies SameSite=Strict hain. Upar se: data badalne wali har request mein custom header
// + Origin apni website ka hona chahiye. Doosri website ye header nahi bhej sakti (CORS rokta hai).
export function csrfGuard(req, _res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next()
  if (req.get('X-Requested-With') !== 'deephysio') return next(new HttpError(403, 'Request blocked.'))
  const origin = req.get('Origin')
  if (origin) {
    const isAllowed =
      config.origins.includes(origin) ||
      (() => {
        try {
          return new URL(origin).hostname.endsWith('.netlify.app')
        } catch {
          return false
        }
      })()
    if (!isAllowed) return next(new HttpError(403, 'Request blocked.'))
  }
  next()
}

const limiter = (windowMin, limit, message) =>
  rateLimit({ windowMs: windowMin * 60e3, limit, standardHeaders: 'draft-7', legacyHeaders: false, message: { message } })

export const loginLimiter = limiter(15, config.LOGIN_RATE_LIMIT, 'Too many sign-in attempts. Please wait 15 minutes and try again.')
export const enquiryLimiter = limiter(60, config.ENQUIRY_RATE_LIMIT, 'Too many enquiries from this connection. Please call us instead.')
export const apiLimiter = limiter(15, 600, 'Too many requests. Please slow down.')
export const uploadLimiter = limiter(15, 60, 'Too many uploads. Please wait a few minutes.')
