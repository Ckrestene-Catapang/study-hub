import { pool } from '../db.js'

/**
 * Database Query Helpers
 * Provides reusable query functions for common database operations
 */

/**
 * Get user by ID
 */
export async function getUserById(userId) {
  const result = await pool.query(
    'SELECT id, email, name, plan, avatar_url, bio, status, created_at, last_login_at FROM users WHERE id = $1',
    [userId]
  )
  return result.rows[0] || null
}

/**
 * Get user by email
 */
export async function getUserByEmail(email) {
  const result = await pool.query(
    'SELECT id, email, name, password_hash, plan, avatar_url, bio, status FROM users WHERE email = $1',
    [email]
  )
  return result.rows[0] || null
}

/**
 * Check if user exists
 */
export async function userExists(email) {
  const result = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  )
  return result.rows.length > 0
}

/**
 * Create transaction
 */
export async function beginTransaction() {
  const client = await pool.connect()
  await client.query('BEGIN')
  return client
}

/**
 * Commit transaction
 */
export async function commitTransaction(client) {
  await client.query('COMMIT')
  client.release()
}

/**
 * Rollback transaction
 */
export async function rollbackTransaction(client) {
  await client.query('ROLLBACK')
  client.release()
}

/**
 * Get paginated results
 * @param {string} query - SQL query with $1 and $2 placeholders for offset and limit
 * @param {array} params - Query parameters (excluding pagination)
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Items per page
 */
export async function getPaginated(sqlQuery, params, page = 1, pageSize = 20) {
  const offset = (page - 1) * pageSize

  // Get total count
  const countQuery = `SELECT COUNT(*) as total FROM (${sqlQuery}) as subquery`
  const countResult = await pool.query(countQuery, params)
  const total = parseInt(countResult.rows[0].total, 10)

  // Get paginated data
  const dataQuery = `${sqlQuery} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
  const dataResult = await pool.query(dataQuery, [...params, pageSize, offset])

  return {
    data: dataResult.rows,
    pagination: {
      page,
      pageSize,
      total,
      pages: Math.ceil(total / pageSize),
      hasMore: page * pageSize < total,
    },
  }
}

export default {
  getUserById,
  getUserByEmail,
  userExists,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  getPaginated,
}
