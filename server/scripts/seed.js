// Database mein starting content + pehla Admin.
//   npm run seed            -> jo khali hai wahi bharo (existing data safe)
//   npm run seed -- --reset -> website content dobara (users ko nahi chhuta)
// Admin: .env mein ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD (min 10, letters + numbers). Code mein koi default password nahi.
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { config } from '../config.js'
import { connectDb } from '../db.js'
import { password as passwordRule } from '../lib/schemas.js'
import User from '../models/User.js'
import Setting from '../models/Setting.js'
import { Service, TeamMember, Faq, Testimonial } from '../models/content.js'
import { seedSite, seedClinic, seedPages, seedServices, seedTeam, seedFaqs, seedTestimonials } from '../../src/data/seed.js'

const reset = process.argv.includes('--reset')
const strip = (list) => list.map(({ _id, ...rest }) => rest)

await connectDb(config.MONGODB_URI)

for (const [key, data] of [['site', seedSite], ['clinic', seedClinic], ['pages', seedPages]]) {
  if (reset || !(await Setting.exists({ key }))) {
    await Setting.findOneAndUpdate({ key }, { $set: { data } }, { upsert: true })
    console.log(`  ✓ ${key}`)
  }
}
for (const [Model, list, name] of [
  [Service, seedServices, 'services'],
  [TeamMember, seedTeam, 'team'],
  [Faq, seedFaqs, 'faqs'],
  [Testimonial, seedTestimonials, 'testimonials'],
]) {
  if (reset) await Model.deleteMany({})
  if (!(await Model.estimatedDocumentCount())) {
    await Model.insertMany(strip(list))
    console.log(`  ✓ ${name} (${list.length})`)
  }
}

if (!(await User.exists({ role: 'admin' }))) {
  const { ADMIN_NAME = 'Clinic Admin', ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
  const ok = ADMIN_EMAIL && passwordRule.safeParse(ADMIN_PASSWORD || '').success
  if (!ok) {
    console.error('\n❌ No admin yet. Set ADMIN_EMAIL and ADMIN_PASSWORD (min 10 chars, letters + numbers) in .env, then run npm run seed again.\n')
  } else {
    await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL.toLowerCase(), role: 'admin', passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12) })
    console.log(`  ✓ Admin created: ${ADMIN_EMAIL}  (ab .env se ADMIN_PASSWORD hata do)`)
  }
}

console.log('✅ Seed done')
await mongoose.disconnect()
