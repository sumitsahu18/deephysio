// DeePhysio backend: Express + MongoDB + JWT (httpOnly cookies)
//   npm run server  (development)    |   npm start  (production, PM2 se)
import { config } from './config.js'
import { connectDb } from './db.js'
import { createApp } from './app.js'
import { cleanupTokens } from './lib/tokens.js'
import { verifyMail } from './lib/mailer.js'
import mongoose from 'mongoose'
import { Enquiry } from './models/content.js'

async function dailyJobs() {
  try {
    await cleanupTokens()
    if (config.ENQUIRY_RETENTION_DAYS > 0) {
      const cutoff = new Date(Date.now() - config.ENQUIRY_RETENTION_DAYS * 864e5)
      const { deletedCount } = await Enquiry.deleteMany({ createdAt: mongoose.trusted({ $lt: cutoff }) })
      if (deletedCount) console.log(`🧹 Deleted ${deletedCount} enquiries older than ${config.ENQUIRY_RETENTION_DAYS} days (UK GDPR retention)`)
    }
  } catch (err) {
    console.error('Daily job failed:', err.message)
  }
}

await connectDb(config.MONGODB_URI)
await verifyMail()
const app = createApp()
const server = app.listen(config.PORT, () => console.log(`🚀 API running on http://localhost:${config.PORT}  (${config.NODE_ENV})`))

dailyJobs()
setInterval(dailyJobs, 12 * 60 * 60 * 1000).unref()

const shutdown = () => server.close(() => process.exit(0))
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
