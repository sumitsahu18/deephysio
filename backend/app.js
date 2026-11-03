import path from 'node:path'
import fs from 'node:fs'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from './config.js'
import { securityHeaders, csrfGuard, apiLimiter } from './middleware/security.js'
import { errorHandler, notFound } from './middleware/errors.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import contentRoutes from './routes/content.js'
import enquiryRoutes from './routes/enquiries.js'
import mediaRoutes from './routes/media.js'

export function createApp() {
  const app = express()
  app.disable('x-powered-by')
  if (config.TRUST_PROXY) app.set('trust proxy', 1) // Nginx ke peeche asli IP (rate-limit ke liye)

  app.use(securityHeaders)
  app.use(cors({ origin: config.origins, credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'X-Requested-With'] }))
  app.use(express.json({ limit: '300kb' }))
  app.use(cookieParser())

  // Upload ki hui images - sirf files, koi folder listing / script nahi
  app.use(
    '/uploads',
    express.static(config.uploadDir, {
      index: false,
      dotfiles: 'deny',
      maxAge: '30d',
      immutable: true,
      setHeaders: (res) => {
        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'")
      },
    }),
  )

  const api = express.Router()
  api.use(apiLimiter, csrfGuard)
  api.get('/health', (_req, res) => res.json({ ok: true }))
  api.use('/auth', authRoutes)
  api.use('/users', userRoutes)
  api.use('/enquiries', enquiryRoutes)
  api.use('/', mediaRoutes)
  api.use('/', contentRoutes)
  api.use(notFound)
  app.use('/api', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    next()
  }, api)

  // Production: built website (frontend: npm run build -> frontend/dist) bhi yahi server de
  const dist = config.clientDist
  if (config.SERVE_CLIENT && fs.existsSync(dist)) {
    app.use(express.static(dist, { index: false, maxAge: '7d' }))
    app.get('/{*splat}', (req, res, next) => (req.path.startsWith('/uploads') ? next() : res.sendFile(path.join(dist, 'index.html'))))
  }

  app.use(errorHandler)
  return app
}
