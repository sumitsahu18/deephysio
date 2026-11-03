import mongoose from 'mongoose'

// Single documents: key = 'site' (logo, theme, social...), 'clinic' (phone, hours...), 'pages' (sab page text)
const schema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, enum: ['site', 'clinic', 'pages'] },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false },
)

export default mongoose.model('Setting', schema)
