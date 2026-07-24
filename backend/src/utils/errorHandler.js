/**
 * Error Handler Utility
 * Provides consistent error handling and formatting across the backend
 */

/**
 * Standardized error codes
 */
export const ERROR_CODES = {
  // Authentication
  MISSING_TOKEN: 'MISSING_TOKEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Resources
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE_RESOURCE: 'DUPLICATE_RESOURCE',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',

  // Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',

  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
}

/**
 * HTTP Status codes mapped to error codes
 */
export const ERROR_STATUS = {
  MISSING_TOKEN: 401,
  INVALID_TOKEN: 401,
  EXPIRED_TOKEN: 401,
  INVALID_CREDENTIALS: 401,
  EMAIL_EXISTS: 409,
  USER_NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
  INVALID_INPUT: 400,
  NOT_FOUND: 404,
  DUPLICATE_RESOURCE: 409,
  RESOURCE_CONFLICT: 409,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_ERROR: 500,
  DATABASE_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
}




/**
 * Custom AppError class
 */
export class AppError extends Error {
  constructor(message, code = ERROR_CODES.INTERNAL_ERROR, statusCode = null) {
    super(message)
    this.code = code
    this.statusCode = statusCode || ERROR_STATUS[code] || 500
    this.timestamp = new Date().toISOString()
  }
}

/**
 * Format error response
 */
export function formatErrorResponse(error) {
  const isAppError = error instanceof AppError

  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    code: isAppError ? error.code : ERROR_CODES.INTERNAL_ERROR,
    timestamp: isAppError ? error.timestamp : new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  }
}

/**
 * Log error to console with formatting
 */
export function logError(error, context = '') {
  const timestamp = new Date().toISOString()
  const contextStr = context ? ` [${context}]` : ''

  if (error instanceof AppError) {
    console.error(`[ERROR]${contextStr} ${timestamp}:`, {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    })
  } else {
    console.error(`[ERROR]${contextStr} ${timestamp}:`, {
      message: error.message,
      stack: error.stack,
    })
  }
}


export function handleError(error, res) {
  logError(error)

  if (error instanceof AppError) {
    return res.status(error.statusCode).json(formatErrorResponse(error))
  }

  return res.status(500).json(formatErrorResponse(error))
}


/**
 * Handle validation errors from express-validator
 */
export function handleValidationErrors(errors) {
  const formattedErrors = errors.array().map((err) => ({
    field: err.param,
    message: err.msg,
  }))

  throw new AppError(
    'Validation failed',
    ERROR_CODES.VALIDATION_ERROR,
    400
  )
}

/**
 * Create standardized success response
 */
export function successResponse(data = null, message = 'Success') {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  }
}

export default {
  AppError,
  ERROR_CODES,
  ERROR_STATUS,
  formatErrorResponse,
  logError,
  handleError,
  handleValidationErrors,
  successResponse,
}

