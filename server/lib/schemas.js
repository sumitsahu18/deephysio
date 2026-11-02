// Har API input ka validation (zod). Jo field yahan nahi hai wo apne aap hat jati hai (mass-assignment se bachav).
import { z } from 'zod'
import { ROLES } from '../../src/lib/permissions.js'

const text = (max = 500) => z.string().trim().max(max)
const reqText = (max = 500, label = 'This field') => z.string().trim().min(1, `${label} is required`).max(max)
const order = z.coerce.number().int().min(-999).max(9999)

// Image: khali, apni upload (/uploads/...) ya https link. data:/javascript: URL allowed nahi.
export const imageUrl = z
  .string()
  .trim()
  .max(2000)
  .refine((v) => v === '' || /^\/uploads\/[\w.-]+$/.test(v) || /^https:\/\/[^\s"'<>]+$/.test(v), 'Image must be an uploaded image or an https:// link')

const httpsUrlOrEmpty = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === '' || /^https:\/\/[^\s"'<>]+$/.test(v), 'Must be an https:// link')

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Colour must look like #2dd4bf')

// ---------- Singleton documents ----------
export const siteSchema = z
  .object({
    clinicName: text(80),
    legalName: text(120),
    companyNumber: text(30),
    footerText: text(300),
    logoUrl: imageUrl,
    facebookUrl: httpsUrlOrEmpty,
    instagramUrl: httpsUrlOrEmpty,
    whatsapp: z.string().trim().max(20).regex(/^\d*$/, 'WhatsApp: digits only, with country code'),
    theme: z
      .object({ primary: hex, secondary: hex, accent: hex, background: hex, button: hex, buttonText: hex, text: hex })
      .partial(),
  })
  .partial()

export const clinicSchema = z
  .object({
    phone: text(40),
    phoneHref: z.string().trim().max(20).regex(/^\+?\d*$/, 'Click-to-call number: digits with optional +'),
    email: z.union([z.literal(''), z.string().trim().email('Enter a valid email').max(160)]),
    address: text(300),
    mapEmbedUrl: z
      .string()
      .trim()
      .max(2000)
      .refine((v) => v === '' || /^https:\/\/(www\.)?google\.[a-z.]+\/maps/.test(v), 'Must be a Google Maps link (https://www.google.com/maps...)'),
    languages: z.array(text(40)).max(20),
    hours: z.array(z.object({ day: text(30), time: text(40) })).max(14),
  })
  .partial()

// Page content: sirf jaane-pehchaane pages; andar text / list / chhota nested object (feature1.title)
const leaf = z.union([z.string().max(8000), z.array(z.string().max(500)).max(50), z.boolean(), z.number()])
const pageValue = z.record(z.string().max(60), z.union([leaf, z.record(z.string().max(60), leaf)]))
export const PAGE_KEYS = ['home', 'about', 'services', 'contact', 'faq', 'privacy']
export const pagesSchema = z.object(Object.fromEntries(PAGE_KEYS.map((k) => [k, pageValue]))).partial()

// Page ke andar image fields bhi safe URL hon
export function checkPageImages(pages) {
  const walk = (obj, path) => {
    for (const [k, v] of Object.entries(obj || {})) {
      if (v && typeof v === 'object' && !Array.isArray(v)) walk(v, `${path}.${k}`)
      else if (/image$/i.test(k) && typeof v === 'string' && !imageUrl.safeParse(v).success) return `${path}.${k}`
    }
    return null
  }
  for (const [k, v] of Object.entries(pages)) {
    const bad = walk(v, k)
    if (bad) return bad
  }
  return null
}

// ---------- Collections ----------
const SERVICE_ICONS = ['Hand', 'Move', 'Dumbbell', 'Zap', 'ArrowUpDown', 'ScanLine', 'HeartPulse']

export const serviceSchema = z.object({
  title: reqText(120, 'Title'),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Page URL: lowercase letters, numbers and dashes only'),
  summary: text(300),
  body: text(8000),
  helpsWith: z.array(text(200)).max(30),
  image: imageUrl,
  icon: z.enum(SERVICE_ICONS),
  order,
})

export const teamSchema = z.object({
  name: reqText(80, 'Name'),
  role: text(120),
  qualifications: text(300),
  hcpc: text(30),
  csp: z.boolean(),
  photo: imageUrl,
  bio: text(2000),
  order,
})

export const faqSchema = z.object({ q: reqText(300, 'Question'), a: reqText(3000, 'Answer'), order })

export const testimonialSchema = z.object({
  name: reqText(80, 'Name'),
  text: reqText(2000, 'Review text'),
  rating: z.coerce.number().int().min(0).max(5),
  source: text(120),
  photo: imageUrl,
  order,
})

// ---------- Enquiry (public form) ----------
const phoneRe = /^[+\d][\d\s()-]{7,19}$/
export const enquirySchema = z
  .object({
    name: z.string().trim().min(2, 'Please enter your name.').max(100),
    email: z.union([z.literal(''), z.string().trim().email('Please enter a valid email address.').max(160)]).default(''),
    phone: z.union([z.literal(''), z.string().trim().regex(phoneRe, 'Please enter a valid phone number.')]).default(''),
    preferredTime: z.enum(['Any time', 'Morning', 'Afternoon', 'Evening']).default('Any time'),
    message: z.string().trim().min(5, 'Please add a short message.').max(2000, 'Please keep your message under 2000 characters.'),
    website: z.string().max(0).optional(), // honeypot - insaan isse khali chhodta hai
  })
  .refine((d) => d.email || d.phone, { message: 'Please give us an email address or a phone number.', path: ['email'] })

export const enquiryStatusSchema = z.object({ status: z.enum(['new', 'contacted', 'booked', 'closed']) })

// ---------- Users & auth ----------
export const password = z
  .string()
  .min(10, 'Password must be at least 10 characters')
  .max(128)
  .refine((v) => /[a-zA-Z]/.test(v) && /\d/.test(v), 'Password must contain letters and numbers')

export const userCreateSchema = z.object({
  name: reqText(80, 'Name'),
  email: z.string().trim().toLowerCase().email('Enter a valid email').max(160),
  role: z.enum(ROLES),
  password,
  active: z.boolean().default(true),
})

export const userUpdateSchema = z
  .object({
    name: reqText(80, 'Name'),
    email: z.string().trim().toLowerCase().email('Enter a valid email').max(160),
    role: z.enum(ROLES),
    password: z.union([z.literal(''), password]),
    active: z.boolean(),
  })
  .partial()

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email').max(160),
  password: z.string().min(1, 'Enter your password').max(128),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Enter your current password').max(128),
  newPassword: password,
})
