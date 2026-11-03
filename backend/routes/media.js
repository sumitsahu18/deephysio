import { Router } from 'express'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import multer from 'multer'
import sharp from 'sharp'
import { config } from '../config.js'
import Setting from '../models/Setting.js'
import { Media, Service, TeamMember, Testimonial } from '../models/content.js'
import { requireAuth, requirePerm } from '../middleware/auth.js'
import { uploadLimiter } from '../middleware/security.js'
import { asyncH, HttpError } from '../middleware/errors.js'

const r = Router()
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// Memory mein lo, check karo, phir naya clean file likho (original kabhi disk par nahi jaata)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxUploadBytes, files: 1, fields: 5 },
  fileFilter: (_req, file, cb) => cb(ALLOWED_MIME.includes(file.mimetype) ? null : new HttpError(400, 'Please choose a JPG, PNG, WebP or GIF image.'), true),
})

// POST /api/uploads  (field: image) -> { url }
r.post(
  '/uploads',
  requireAuth,
  requirePerm('media'),
  uploadLimiter,
  upload.single('image'),
  asyncH(async (req, res) => {
    if (!req.file) throw new HttpError(400, 'No image received.')
    let img
    try {
      // Asli image hai ya nahi - file ke andar ka data padh ke (sirf extension par bharosa nahi)
      img = sharp(req.file.buffer, { limitInputPixels: 50_000_000, failOn: 'error' })
      const meta = await img.metadata()
      if (!['jpeg', 'png', 'webp', 'gif'].includes(meta.format)) throw new Error('format')
    } catch {
      throw new HttpError(400, 'This file is not a valid image.')
    }
    // Dobara banao: EXIF/GPS data aur chhupa hua code hat jata hai; size max 2000px
    const keepPng = req.file.mimetype === 'image/png' || req.file.mimetype === 'image/gif'
    const pipeline = img.rotate().resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
    const out = keepPng ? await pipeline.png({ compressionLevel: 9 }).toBuffer({ resolveWithObject: true }) : await pipeline.webp({ quality: 82 }).toBuffer({ resolveWithObject: true })
    const file = `${crypto.randomUUID()}.${keepPng ? 'png' : 'webp'}`
    await fs.mkdir(config.uploadDir, { recursive: true })
    await fs.writeFile(path.join(config.uploadDir, file), out.data, { flag: 'wx' })
    const name = path.basename(req.file.originalname || 'image').replace(/[^\w.\- ]+/g, '').slice(0, 80) || 'image'
    const media = await Media.create({ url: `/uploads/${file}`, file, name, size: out.info.size, width: out.info.width, height: out.info.height, uploadedBy: req.user._id })
    res.status(201).json({ url: media.url, media })
  }),
)

r.get('/media', requireAuth, requirePerm('media'), asyncH(async (_req, res) => res.json(await Media.find().sort({ createdAt: -1 }))))

// Image kahin use ho rahi hai? (logo, page photos, services, team, testimonials)
async function isUsed(url) {
  const settings = await Setting.find().lean()
  if (settings.some((s) => JSON.stringify(s.data || {}).includes(url))) return true
  const [a, b, c] = await Promise.all([Service.exists({ image: url }), TeamMember.exists({ photo: url }), Testimonial.exists({ photo: url })])
  return !!(a || b || c)
}

r.delete(
  '/media/:id',
  requireAuth,
  requirePerm('media', 'delete'),
  asyncH(async (req, res) => {
    const media = await Media.findById(req.params.id)
    if (!media) throw new HttpError(404, 'Not found')
    if (await isUsed(media.url)) throw new HttpError(409, 'This image is used on the website. Replace it there first, then delete it.')
    await fs.unlink(path.join(config.uploadDir, path.basename(media.file))).catch(() => {})
    await media.deleteOne()
    res.json({ ok: true })
  }),
)

export default r
