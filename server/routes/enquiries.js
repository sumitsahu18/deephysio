import { Router } from 'express'
import { Enquiry } from '../models/content.js'
import { enquirySchema, enquiryStatusSchema } from '../lib/schemas.js'
import { sendEnquiryEmail } from '../lib/mailer.js'
import { requireAuth, requirePerm } from '../middleware/auth.js'
import { enquiryLimiter } from '../middleware/security.js'
import { asyncH, HttpError } from '../middleware/errors.js'

const r = Router()

// Public contact form. Rate-limited + validated + honeypot. Save + clinic ko email.
r.post(
  '/',
  enquiryLimiter,
  asyncH(async (req, res) => {
    const { website, ...data } = enquirySchema.parse(req.body)
    if (website) return res.status(201).json({ ok: true }) // bot - chup-chaap ignore
    const enquiry = await Enquiry.create({ ...data, status: 'new' })
    try {
      if (await sendEnquiryEmail(enquiry)) {
        enquiry.emailed = true
        await enquiry.save()
      }
    } catch (err) {
      console.error('Enquiry email failed (saved in admin):', err.message)
    }
    res.status(201).json({ ok: true })
  }),
)

r.get('/', requireAuth, requirePerm('contact'), asyncH(async (_req, res) => res.json(await Enquiry.find().sort({ createdAt: -1 }))))

r.put(
  '/:id',
  requireAuth,
  requirePerm('contact'),
  asyncH(async (req, res) => {
    const item = await Enquiry.findByIdAndUpdate(req.params.id, { $set: enquiryStatusSchema.parse(req.body) }, { new: true })
    if (!item) throw new HttpError(404, 'Not found')
    res.json(item)
  }),
)

r.delete(
  '/:id',
  requireAuth,
  requirePerm('contact', 'delete'),
  asyncH(async (req, res) => {
    if (!(await Enquiry.findByIdAndDelete(req.params.id))) throw new HttpError(404, 'Not found')
    res.json({ ok: true })
  }),
)

export default r
