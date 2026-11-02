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
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  preferredTime: { type: String, default: 'Any time' },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'contacted', 'booked', 'closed'], default: 'new' },
  emailed: { type: Boolean, default: false },
})
