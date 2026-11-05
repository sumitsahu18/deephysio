import { Router } from 'express'
import mongoose from 'mongoose'
import Setting from '../models/Setting.js'
import { Service, TeamMember, Faq, Testimonial, Accreditation, TrustBadge, Pricing, Insurer, Location } from '../models/content.js'
import {
  siteSchema,
  clinicSchema,
  pagesSchema,
  checkPageImages,
  serviceSchema,
  teamSchema,
  faqSchema,
  testimonialSchema,
  accreditationSchema,
  trustBadgeSchema,
  pricingSchema,
  insurerSchema,
  locationSchema,
} from '../lib/schemas.js'
import { requireAuth, requirePerm } from '../middleware/auth.js'
import { hasPermission, PAGE_PERMISSION } from '../lib/permissions.js'
import { asyncH, HttpError } from '../middleware/errors.js'

const r = Router()

// ---------- Single documents: /site /clinic /pages (GET public, PUT protected) ----------
async function getDoc(key) {
  const doc = await Setting.findOne({ key }).lean()
  return doc?.data || {}
}
async function saveDoc(key, patch) {
  const current = await getDoc(key)
  const data = { ...current, ...patch }
  await Setting.findOneAndUpdate({ key }, { $set: { data } }, { upsert: true })
  return data
}

for (const key of ['site', 'clinic', 'pages']) {
  r.get(`/${key}`, asyncH(async (_req, res) => res.json(await getDoc(key))))
}

// Site: logo/naam/social = General Settings (admin), theme = Theme Settings (admin)
r.put(
  '/site',
  requireAuth,
  asyncH(async (req, res) => {
    const data = siteSchema.parse(req.body)
    const { theme, ...rest } = data
    if (theme && !hasPermission(req.user.role, 'theme')) throw new HttpError(403, 'Only an admin can change the theme colours.')
    if (Object.keys(rest).length && !hasPermission(req.user.role, 'settings')) throw new HttpError(403, 'Only an admin can change general settings.')
    if (theme) data.theme = { ...((await getDoc('site')).theme || {}), ...theme }
    res.json(await saveDoc('site', data))
  }),
)

// Clinic: phone, email, address, hours, map - staff bhi (PDF: reception hours/contact khud badle)
// Phone numbers (phone, phoneHref) General Settings ka hissa hain -> sirf Admin.
r.put(
  '/clinic',
  requireAuth,
  requirePerm('contact'),
  asyncH(async (req, res) => {
    const data = clinicSchema.parse(req.body)
    if (!hasPermission(req.user.role, 'settings')) {
      const current = await getDoc('clinic')
      for (const k of ['phone', 'phoneHref']) {
        if (data[k] === undefined || data[k] === current[k]) delete data[k]
        else throw new HttpError(403, 'Only an admin can change the phone number.')
      }
    }
    res.json(await saveDoc('clinic', data))
  }),
)

// Pages: har page apne section ke permission se
r.put(
  '/pages',
  requireAuth,
  asyncH(async (req, res) => {
    const data = pagesSchema.parse(req.body)
    for (const k of Object.keys(data)) {
      if (!hasPermission(req.user.role, PAGE_PERMISSION[k])) throw new HttpError(403, 'You do not have permission to edit this page.')
    }
    const bad = checkPageImages(data)
    if (bad) throw new HttpError(400, `Invalid image link (${bad}). Use an uploaded image or an https:// link.`)
    res.json(await saveDoc('pages', data))
  }),
)

// ---------- Collections: GET public, add/edit = section permission, delete = sirf admin ----------
function collection(path, Model, schema, perm, { bySlug = false } = {}) {
  r.get(`/${path}`, asyncH(async (_req, res) => res.json(await Model.find().sort({ order: 1, createdAt: 1 }))))

  r.get(
    `/${path}/:id`,
    asyncH(async (req, res) => {
      const { id } = req.params
      const item = mongoose.isValidObjectId(id) ? await Model.findById(id) : bySlug ? await Model.findOne({ slug: String(id).toLowerCase() }) : null
      if (!item) throw new HttpError(404, 'Not found')
      res.json(item)
    }),
  )

  r.post(
    `/${path}`,
    requireAuth,
    requirePerm(perm),
    asyncH(async (req, res) => res.status(201).json(await Model.create(schema.parse(req.body)))),
  )

  r.put(
    `/${path}/:id`,
    requireAuth,
    requirePerm(perm),
    asyncH(async (req, res) => {
      const data = schema.partial().parse(req.body)
      const item = await Model.findByIdAndUpdate(req.params.id, { $set: data }, { new: true, runValidators: true })
      if (!item) throw new HttpError(404, 'Not found')
      res.json(item)
    }),
  )

  r.delete(
    `/${path}/:id`,
    requireAuth,
    requirePerm(perm, 'delete'),
    asyncH(async (req, res) => {
      const item = await Model.findByIdAndDelete(req.params.id)
      if (!item) throw new HttpError(404, 'Not found')
      res.json({ ok: true })
    }),
  )
}

collection('services', Service, serviceSchema, 'services', { bySlug: true })
collection('team', TeamMember, teamSchema, 'about')
collection('faqs', Faq, faqSchema, 'homepage')
collection('testimonials', Testimonial, testimonialSchema, 'homepage')
collection('accreditations', Accreditation, accreditationSchema, 'homepage')
collection('trust-badges', TrustBadge, trustBadgeSchema, 'homepage')
collection('pricing', Pricing, pricingSchema, 'services')
collection('insurers', Insurer, insurerSchema, 'services')
collection('locations', Location, locationSchema, 'contact')

export default r
