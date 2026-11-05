import mongoose from 'mongoose'
import { jsonClean } from '../db.js'

const opts = { timestamps: true }
const make = (name, def) => {
  const s = new mongoose.Schema(def, opts)
  s.set('toJSON', jsonClean)
  return mongoose.model(name, s)
}

export const Service = make('Service', {
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  summary: { type: String, default: '' },
  body: { type: String, default: '' },
  provider: { type: String, default: '' },
  helpsWith: { type: [String], default: [] },
  image: { type: String, default: '' },
  icon: { type: String, default: 'HeartPulse' },
  order: { type: Number, default: 10 },
})

export const TeamMember = make('TeamMember', {
  name: { type: String, required: true, trim: true },
  role: { type: String, default: '' },
  qualifications: { type: String, default: '' },
  hcpc: { type: String, default: '' },
  csp: { type: Boolean, default: false },
  photo: { type: String, default: '' },
  bio: { type: String, default: '' },
  order: { type: Number, default: 10 },
})

export const Faq = make('Faq', {
  q: { type: String, required: true },
  a: { type: String, required: true },
  order: { type: Number, default: 10 },
})

export const Testimonial = make('Testimonial', {
  name: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, default: 5 },
  source: { type: String, default: '' },
  photo: { type: String, default: '' },
  order: { type: Number, default: 10 },
})

export const Media = make('Media', {
  url: { type: String, required: true, unique: true },
  file: { type: String, required: true }, // disk par file ka naam
  name: { type: String, default: '' },
  size: Number,
  width: Number,
  height: Number,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

// PDF 2.4 Data Minimisation: sirf ye fields. Koi medical / diagnosis field nahi.
export const Enquiry = make('Enquiry', {
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  preferredDate: { type: String, default: '', trim: true },
  preferredTime: { type: String, default: 'Flexible / Any time', trim: true },
  reason: { type: String, default: 'Other', trim: true },
  message: { type: String, default: '', trim: true },
  status: { type: String, enum: ['new', 'contacted', 'scheduled', 'booked', 'closed'], default: 'new' },
  emailed: { type: Boolean, default: false },
})

export const Accreditation = make('Accreditation', {
  name: { type: String, required: true, trim: true },
  fullName: { type: String, default: '', trim: true },
  logoUrl: { type: String, default: '' },
  description: { type: String, default: '' },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 10 },
})

export const TrustBadge = make('TrustBadge', {
  message: { type: String, required: true, trim: true },
  icon: { type: String, default: 'Clock' },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 10 },
})

export const Pricing = make('Pricing', {
  name: { type: String, required: true, trim: true },
  duration: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, enum: ['clinic', 'home_visit'], default: 'clinic' },
  notes: { type: String, default: '', trim: true },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 10 },
})

export const Insurer = make('Insurer', {
  name: { type: String, required: true, trim: true },
  logoUrl: { type: String, default: '' },
  notes: { type: String, default: '', trim: true },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 10 },
})

export const Location = make('Location', {
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  postcode: { type: String, default: '', trim: true },
  phone: { type: String, default: '', trim: true },
  email: { type: String, default: '', trim: true },
  hours: { type: String, default: '', trim: true },
  mapUrl: { type: String, default: '', trim: true },
  directionsUrl: { type: String, default: '', trim: true },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 10 },
})

