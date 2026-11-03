// Saari settings .env se. Galat / missing value par server start hi nahi hota (fail fast).
import 'dotenv/config'
import path from 'node:path'
import { z } from 'zod'

const bool = (def) => z.enum(['true', 'false']).default(def).transform((v) => v === 'true')

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  // JWT: do alag secrets (kam se kam 32 characters). Generate: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  ACCESS_TOKEN_MINUTES: z.coerce.number().int().min(5).max(60).default(15),
  REFRESH_TOKEN_DAYS: z.coerce.number().int().min(1).max(30).default(7),

  // Website ka address (CORS + CSRF check). Comma separated: https://deephysio.co.uk,https://www.deephysio.co.uk
  CLIENT_ORIGINS: z.string().default('http://localhost:5173'),
  COOKIE_SECURE: bool('false'), // production (HTTPS) mein true
  TRUST_PROXY: bool('false'), // Nginx ke peeche true

  UPLOAD_DIR: z.string().default('uploads'),
  MAX_UPLOAD_MB: z.coerce.number().min(1).max(20).default(5),

  // Enquiry email (authenticated SMTP - PDF 2.4)
  SMTP_HOST: z.string().default(''),
  SMTP_PORT: z.coerce.number().int().default(587),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  MAIL_FROM: z.string().default(''),
  CLINIC_NOTIFICATION_EMAIL: z.string().default(''),

  // UK GDPR: itne din purani enquiries apne aap delete (0 = kabhi nahi)
  ENQUIRY_RETENTION_DAYS: z.coerce.number().int().min(0).default(365),

  // Production mein Express hi built website (dist/) bhi serve kare
  SERVE_CLIENT: bool('false'),
  CLIENT_DIST: z.string().default('../frontend/dist'), // built website ka folder (SERVE_CLIENT=true par)

  // Brute-force / spam se bachav (production defaults theek hain)
  LOGIN_RATE_LIMIT: z.coerce.number().int().min(1).default(10), // har IP, 15 min mein
  ENQUIRY_RATE_LIMIT: z.coerce.number().int().min(1).default(5), // har IP, 1 ghante mein
})

const parsed = schema.safeParse(process.env)
if (!parsed.success) {
  console.error('\n❌ .env mein galti hai:')
  parsed.error.issues.forEach((i) => console.error(`   - ${i.path.join('.')}: ${i.message}`))
  console.error('   .env.example dekho.\n')
  process.exit(1)
}

const env = parsed.data
export const config = {
  ...env,
  isProd: env.NODE_ENV === 'production',
  origins: env.CLIENT_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean),
  uploadDir: path.resolve(env.UPLOAD_DIR),
  clientDist: path.resolve(env.CLIENT_DIST),
  maxUploadBytes: env.MAX_UPLOAD_MB * 1024 * 1024,
}

if (config.isProd && !config.COOKIE_SECURE) {
  console.warn('⚠️  Production mein COOKIE_SECURE=true rakho (HTTPS).')
}
