import { Router } from 'express'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import User from '../models/User.js'
import { userCreateSchema, userUpdateSchema } from '../lib/schemas.js'
import { revokeAll } from '../lib/tokens.js'
import { requireAuth, requirePerm } from '../middleware/auth.js'
import { asyncH, HttpError } from '../middleware/errors.js'

// Users & roles - SIRF ADMIN. Admin staff ke accounts banata hai (email + password), role deta hai, band karta hai.
const r = Router()
r.use(requireAuth, requirePerm('users'))

r.get('/', asyncH(async (_req, res) => res.json(await User.find().sort({ createdAt: 1 }))))

r.post(
  '/',
  asyncH(async (req, res) => {
    const { password, ...data } = userCreateSchema.parse(req.body)
    const user = await User.create({ ...data, passwordHash: await bcrypt.hash(password, 12) })
    res.status(201).json(user)
  }),
)

const activeAdmins = (exceptId) => User.countDocuments({ role: 'admin', active: true, _id: mongoose.trusted({ $ne: exceptId }) })

r.put(
  '/:id',
  asyncH(async (req, res) => {
    const data = userUpdateSchema.parse(req.body)
    const user = await User.findById(req.params.id).select('+tokenVersion')
    if (!user) throw new HttpError(404, 'User not found.')

    const isSelf = String(user._id) === String(req.user._id)
    const losingAdmin = user.role === 'admin' && ((data.role && data.role !== 'admin') || data.active === false)
    if (losingAdmin && isSelf) throw new HttpError(400, 'You cannot remove your own admin access or disable your own account.')
    if (losingAdmin && (await activeAdmins(user._id)) === 0) throw new HttpError(400, 'There must always be at least one active admin.')

    let securityChange = false
    if (data.password) {
      user.passwordHash = await bcrypt.hash(data.password, 12)
      securityChange = true
    }
    if (data.role && data.role !== user.role) securityChange = true
    if (data.active === false && user.active) securityChange = true
    for (const k of ['name', 'email', 'role', 'active']) if (data[k] !== undefined) user[k] = data[k]
    if (securityChange) user.tokenVersion += 1 // us user ke saare purane login khatam
    await user.save()
    if (securityChange) await revokeAll(user._id)
    res.json(user)
  }),
)

r.delete(
  '/:id',
  requirePerm('delete'),
  asyncH(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) throw new HttpError(404, 'User not found.')
    if (String(user._id) === String(req.user._id)) throw new HttpError(400, 'You cannot delete your own account.')
    if (user.role === 'admin' && user.active && (await activeAdmins(user._id)) === 0) throw new HttpError(400, 'There must always be at least one active admin.')
    await revokeAll(user._id)
    await user.deleteOne()
    res.json({ ok: true })
  }),
)

export default r
