// Password bhool gaye? .env ke ADMIN_EMAIL wale user ka password .env ke ADMIN_PASSWORD par reset.
//   npm run reset-admin      (backend folder mein)
// Lock bhi hat jata hai, account active + admin ho jata hai, purane saare login band.
// Kaam hone ke baad .env se ADMIN_PASSWORD hata do.
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { config } from '../config.js'
import { connectDb } from '../db.js'
import { password as passwordRule } from '../lib/schemas.js'
import User from '../models/User.js'
import { revokeAll } from '../lib/tokens.js'

const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
const pass = process.env.ADMIN_PASSWORD || ''
if (!email || !passwordRule.safeParse(pass).success) {
  console.error('\n❌ .env mein ADMIN_EMAIL aur ADMIN_PASSWORD (min 10 chars, letters + numbers) daalo.\n')
  process.exit(1)
}

await connectDb(config.MONGODB_URI)
const user = await User.findOne({ email }).select('+tokenVersion')
if (!user) {
  console.error(`❌ No user with email ${email}. (Naya admin banana ho to: npm run seed)`)
} else {
  user.passwordHash = await bcrypt.hash(pass, 12)
  user.active = true
  user.role = 'admin'
  user.failedLogins = 0
  user.lockUntil = undefined
  user.tokenVersion = (user.tokenVersion || 0) + 1
  await user.save()
  await revokeAll(user._id)
  console.log(`✅ Password reset for ${email}. Ab .env se ADMIN_PASSWORD hata do.`)
}
await mongoose.disconnect()
