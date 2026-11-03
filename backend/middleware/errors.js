import { ZodError } from 'zod'
import multer from 'multer'
import { config } from '../config.js'

export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

export function notFound(_req, _res, next) {
  next(new HttpError(404, 'Not found'))
}

// Ek jagah saare errors. Production mein andar ki details bahar nahi jaati.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  let status = err.status || err.statusCode || 500
  let message = err.message || 'Something went wrong.'

  if (err instanceof ZodError) {
    status = 400
    message = err.issues[0]?.message || 'Invalid data.'
  } else if (err instanceof multer.MulterError) {
    status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400
    message = err.code === 'LIMIT_FILE_SIZE' ? `Image is too large (max ${config.MAX_UPLOAD_MB} MB).` : 'Upload failed.'
  } else if (err?.code === 11000) {
    status = 409
    const field = Object.keys(err.keyValue || err.keyPattern || {})[0] || 'value'
    message = field === 'email' ? 'A user with this email already exists.' : field === 'slug' ? 'Another service already uses this page URL.' : `This ${field} is already in use.`
  } else if (err?.name === 'CastError') {
    status = 404
    message = 'Not found'
  } else if (err?.type === 'entity.too.large') {
    status = 413
    message = 'Request is too large.'
  } else if (err?.type === 'entity.parse.failed') {
    status = 400
    message = 'Invalid request.'
  }

  if (status >= 500) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, err)
    if (config.isProd) message = 'Something went wrong. Please try again.'
  }
  res.status(status).json({ message })
}
