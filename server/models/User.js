import mongoose from 'mongoose'
import { ROLES } from '../../src/lib/permissions.js'

// Admin / Staff login. Password sirf bcrypt hash ke roop mein save hota hai.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 160 },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: 'editor' },
    active: { type: Boolean, default: true },
    // Password / role badle ya account band ho -> tokenVersion badhta hai -> purane saare login khatam
    tokenVersion: { type: Number, default: 0, select: false },
    failedLogins: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, select: false },
    lastLoginAt: Date,
  },
  { timestamps: true },
)

userSchema.set('toJSON', {
  versionKey: false,
  transform: (_d, r) => {
    delete r.passwordHash
    delete r.tokenVersion
    delete r.failedLogins
    delete r.lockUntil
    return r
  },
})

export default mongoose.model('User', userSchema)
