// Enquiry email clinic ko - authenticated SMTP (PDF 2.4: spam folder se bachne ke liye).
// Domain par SPF + DKIM records lagane zaroori (README dekho).
import nodemailer from 'nodemailer'
import { config } from '../config.js'

let transport = null
if (config.SMTP_HOST) {
  transport = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_PORT === 465,
    requireTLS: config.SMTP_PORT !== 465,
    auth: config.SMTP_USER ? { user: config.SMTP_USER, pass: config.SMTP_PASS } : undefined,
  })
}

export const mailEnabled = () => !!(transport && config.CLINIC_NOTIFICATION_EMAIL)

// Sirf plain text - koi HTML nahi (form ka text email mein code ban ke na chale)
export async function sendEnquiryEmail(e) {
  if (!mailEnabled()) return false
  const lines = [
    'New enquiry from the website',
    '',
    `Name: ${e.name}`,
    `Email: ${e.email || '-'}`,
    `Phone: ${e.phone || '-'}`,
    `Preferred contact time: ${e.preferredTime}`,
    '',
    'Message:',
    e.message,
    '',
    `Received: ${new Date(e.createdAt).toLocaleString('en-GB', { timeZone: 'Europe/London' })}`,
    'View all enquiries in the website admin: Contact & Enquiries.',
  ]
  await transport.sendMail({
    from: config.MAIL_FROM || config.SMTP_USER,
    to: config.CLINIC_NOTIFICATION_EMAIL,
    replyTo: e.email || undefined,
    subject: `Website enquiry: ${e.name.replace(/[\r\n]+/g, ' ').slice(0, 60)}`,
    text: lines.join('\n'),
  })
  return true
}

export async function verifyMail() {
  if (!transport) return console.log('✉️  SMTP not set - enquiries are saved in the admin only (no email).')
  try {
    await transport.verify()
    console.log('✉️  SMTP ready')
  } catch (err) {
    console.warn('⚠️  SMTP login failed:', err.message)
  }
}
