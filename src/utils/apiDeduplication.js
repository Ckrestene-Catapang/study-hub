/**
 * Request Deduplication Utility
 * Prevents duplicate API calls from being made simultaneously
 * Uses request key (method + URL) to identify duplicates
 */

const pendingRequests = new Map()

/**
 * Generate a cache key from request parameters
 * @param {string} method HTTP method
 * @param {string} url Request URL
 * @param {object} config Additional config (for POST/PUT body)
 * @returns {string} Cache key
 */
function generateKey(method, url, config = {}) {
  const body = config.data ? JSON.stringify(config.data) : ''
  return `${method}:${url}:${body}`
}

/**
 * Wrap an API call with deduplication logic
 * If an identical request is already in flight, return the existing promise
 * Otherwise, execute the request and cache the promise
 *
 * @param {string} method HTTP method
 * @param {string} url Request URL
 * @param {Function} apiFn Function that makes the actual API call
 * @param {object} config Optional config with data
 * @returns {Promise} Result from API
 */
export async function dedupedApiCall(method, url, apiFn, config = {}) {
  const key = generateKey(method, url, config)

  // If this request is already in flight, return the existing promise
  if (pendingRequests.has(key)) {
    console.debug('[Dedup] Reusing in-flight request for:', key)
    return pendingRequests.get(key)
  }

  // Make the request and cache the promise
  const promise = apiFn()
    .then((result) => {
      // Remove from pending on success
      pendingRequests.delete(key)
      return result
    })
    .catch((error) => {
      // Remove from pending on error
      pendingRequests.delete(key)
      throw error
    })

  pendingRequests.set(key, promise)
  return promise
}

/**
 * Clear all pending requests (useful for testing or explicit cleanup)
 */
export function clearPendingRequests() {
  pendingRequests.clear()
  console.debug('[Dedup] Cleared all pending requests')
}

/**
 * Get count of currently pending requests (for debugging)
 */
export function getPendingRequestCount() {
  return pendingRequests.size
}

/**
 * List all pending request keys (for debugging)
 */
export function getPendingRequestKeys() {
  return Array.from(pendingRequests.keys())
}
