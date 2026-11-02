import mongoose from 'mongoose'

// Query mein user ka bheja "$gt" jaisa operator data maana jaye, operator nahi (NoSQL injection se bachav)
mongoose.set('sanitizeFilter', true)
mongoose.set('strictQuery', true)

export async function connectDb(uri) {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
  console.log('✅ MongoDB connected')
  return mongoose.connection
}

// API response mein __v na jaye
export const jsonClean = {
  versionKey: false,
  transform: (_doc, ret) => {
    delete ret.__v
    return ret
  },
}
