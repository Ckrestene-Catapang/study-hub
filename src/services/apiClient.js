import axios from "axios"

/**
 * Pre-configured Axios instance for backend API.
 *
 * Automatically handles:
 * - Base URL configuration
 * - JWT token attachment
 * - Error handling with retry logic
 * - Request/Response logging
 * - Network failure recovery
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
})

// Attach auth token to every request
apiClient.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("studyhub-token")
      : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Retry logic: exponential backoff for transient failures
const retryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
}

function isRetryableError(error) {
  // Retry on network errors, timeouts, and 5xx server errors
  if (!error.response) return true // Network error or timeout
  const status = error.response.status
  return status === 408 || status === 429 || (status >= 500 && status < 600)
}

async function retryWithBackoff(fn, attempt = 0) {
  try {
    return await fn()
  } catch (error) {
    if (!isRetryableError(error) || attempt >= retryConfig.maxRetries) {
      throw error
    }

    const delayMs = Math.min(
      retryConfig.initialDelayMs * Math.pow(retryConfig.backoffMultiplier, attempt),
      retryConfig.maxDelayMs
    )

    // Add jitter to prevent thundering herd
    const jitterMs = Math.random() * delayMs * 0.1
    await new Promise((resolve) => setTimeout(resolve, delayMs + jitterMs))

    return retryWithBackoff(fn, attempt + 1)
  }
}

// Handle responses and errors
apiClient.interceptors.response.use(
  (response) => {
    // Backend returns { success, data, error }
    // Pass through the response as-is for consistent handling
    return response
  },
  (error) => {
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Unauthorized - clear token and logout
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("studyhub-token")
        window.localStorage.removeItem("studyhub-user")
      }
      // User should be redirected to login by auth guard
    }

    // Enhanced logging for debugging
    if (error.response) {
      console.error(
        `[API Error] ${error.response.status}:`,
        error.response.data
      )
    } else if (error.request) {
      console.error(
        `[API Error] No response - backend may be offline:`,
        error.message
      )
    } else {
      console.error(`[API Error]`, error.message)
    }

    return Promise.reject(error)
  }
)

/**
 * Wrap an API call with automatic retry logic for transient failures
 */
export async function apiCallWithRetry(fn) {
  return retryWithBackoff(fn)
}

/**
 * Simulate network latency so the UI exercises real loading states.
 * Used only for mock services during development.
 * @template T
 * @param {T} data
 * @param {number} [delay]
 * @returns {Promise<T>}
 */
export function mockResponse(data, delay = 500) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(data)), delay)
  })
}
