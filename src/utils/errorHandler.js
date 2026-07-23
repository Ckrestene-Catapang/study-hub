/**
 * Frontend Error Handler Utility
 * Provides consistent error handling and user-friendly messages
 */

/**
 * Error code to user-friendly message mapping
 */
export const ERROR_MESSAGES = {
  // Authentication
  MISSING_TOKEN: 'You must be logged in to continue',
  INVALID_TOKEN: 'Your session has expired. Please log in again',
  EXPIRED_TOKEN: 'Your session has expired. Please log in again',
  INVALID_CREDENTIALS: 'Email or password is incorrect',
  EMAIL_EXISTS: 'This email is already registered',
  USER_NOT_FOUND: 'User not found',

  // Validation
  VALIDATION_ERROR: 'Please check your input and try again',
  INVALID_INPUT: 'Invalid input provided',

  // Resources
  NOT_FOUND: 'The resource you are looking for was not found',
  DUPLICATE_RESOURCE: 'This resource already exists',
  RESOURCE_CONFLICT: 'There was a conflict with your request',

  // Authorization
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FORBIDDEN: 'Access denied',

  // Network
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection',
  TIMEOUT_ERROR: 'Request timed out. Please try again',

  // Server
  INTERNAL_ERROR: 'Something went wrong. Please try again later',
  DATABASE_ERROR: 'Database error. Please try again later',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable. Please try again later',

  // Generic
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again',
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(code, defaultMessage = null) {
  return ERROR_MESSAGES[code] || defaultMessage || ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * Format error for display
 */
export function formatError(error) {
  // Handle Axios errors
  if (error.response) {
    const { status, data } = error.response
    const code = data?.code || `HTTP_${status}`
    const message = getErrorMessage(code, data?.error)

    return {
      message,
      code,
      status,
      details: data,
    }
  }

  // Handle network errors
  if (error.request && !error.response) {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      code: 'NETWORK_ERROR',
      status: 0,
    }
  }

  // Handle timeout errors
  if (error.code === 'ECONNABORTED') {
    return {
      message: ERROR_MESSAGES.TIMEOUT_ERROR,
      code: 'TIMEOUT_ERROR',
      status: 408,
    }
  }

  // Handle generic errors
  return {
    message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
    code: 'UNKNOWN_ERROR',
    status: null,
  }
}

/**
 * Log error to console with formatting (development only)
 */
export function logError(error, context = '') {
  if (process.env.NODE_ENV === 'development') {
    const contextStr = context ? ` [${context}]` : ''
    console.error(`[v0 Error]${contextStr}:`, error)
  }
}

/**
 * Show user-friendly notification
 */
export function showErrorNotification(error, onNotify = null) {
  const formatted = formatError(error)

  // Call notification callback if provided
  if (onNotify) {
    onNotify({
      type: 'error',
      message: formatted.message,
      code: formatted.code,
    })
  }

  logError(error, 'Error Notification')
}

/**
 * Handle API error in try-catch block
 * Usage:
 * try {
 *   await apiCall()
 * } catch (error) {
 *   const { message, code } = handleAPIError(error)
 *   setErrorMessage(message)
 * }
 */
export function handleAPIError(error) {
  const formatted = formatError(error)
  logError(error, 'API Error')
  return formatted
}

/**
 * Retry logic for failed requests
 */
export async function retryWithBackoff(
  fn,
  maxRetries = 3,
  baseDelay = 1000
) {
  let lastError

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Don't retry on client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error
      }

      // Calculate exponential backoff delay
      const delay = baseDelay * Math.pow(2, attempt)

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

export default {
  ERROR_MESSAGES,
  getErrorMessage,
  formatError,
  logError,
  showErrorNotification,
  handleAPIError,
  retryWithBackoff,
}
