import { verifyToken, extractToken } from '../utils/auth.js'
import { AppError, ERROR_CODES, formatErrorResponse, logError } from '../utils/errorHandler.js'

/**
 * Middleware to check if user is authenticated
 */
export function requireAuth(req, res, next) {
  const token = extractToken(req.headers.authorization)

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Missing authentication token',
      code: ERROR_CODES.MISSING_TOKEN,
    })
  }

  const decoded = verifyToken(token)

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
      code: ERROR_CODES.INVALID_TOKEN,
    })
  }

  // Attach user info to request
  req.user = decoded
  next()
}

/**
 * Optional authentication middleware - doesn't fail if no token
 */
export function optionalAuth(req, res, next) {
  const token = extractToken(req.headers.authorization)

  if (token) {
    const decoded = verifyToken(token)
    if (decoded) {
      req.user = decoded
    }
  }

  next()
}

/**
 * Error handling middleware - must have 4 parameters (err, req, res, next) to be recognized as error handler
 */
export function errorHandler(err, req, res, next) {
  logError(err, req.path)

  // AppError from our code
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(formatErrorResponse(err))
  }

  // Handle database constraint errors
  if (err.code === '23505') {
    // Unique constraint violation
    return res.status(409).json({
      success: false,
      error: 'Resource already exists',
      code: ERROR_CODES.DUPLICATE_RESOURCE,
      timestamp: new Date().toISOString(),
    })
  }

  if (err.code === '23503') {
    // Foreign key constraint violation
    return res.status(400).json({
      success: false,
      error: 'Invalid reference to related resource',
      code: ERROR_CODES.INVALID_INPUT,
      timestamp: new Date().toISOString(),
    })
  }

  // Handle validation errors
  if (err.status === 400 || err.code === 'BAD_REQUEST') {
    return res.status(400).json({
      success: false,
      error: err.message || 'Validation error',
      code: ERROR_CODES.VALIDATION_ERROR,
      errors: err.errors || [],
      timestamp: new Date().toISOString(),
    })
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
      code: ERROR_CODES.INVALID_TOKEN,
      timestamp: new Date().toISOString(),
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token has expired',
      code: ERROR_CODES.EXPIRED_TOKEN,
      timestamp: new Date().toISOString(),
    })
  }

  // Generic error
  const statusCode = err.statusCode || err.status || 500
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error',
    code: err.code || ERROR_CODES.INTERNAL_ERROR,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export default {
  requireAuth,
  optionalAuth,
  errorHandler,
}
