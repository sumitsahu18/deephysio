import mongoose from 'mongoose'

// Refresh token ka sirf SHA-256 hash save hota hai (DB leak ho to bhi token kaam ka nahi).
// Har refresh par naya token (rotation). Purana token dobara aaya = chori -> us user ke saare tokens band.
const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    hash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revokedAt: Date,
    userAgent: { type: String, maxlength: 300 },
  },
  { timestamps: true },
)

export default mongoose.model('RefreshToken', schema)
