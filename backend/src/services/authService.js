import { query } from '../db.js'
import {
  hashPassword,
  verifyPassword,
  generateToken,
  hashToken,
  generateRandomToken,
} from '../utils/auth.js'
import { v4 as uuidv4 } from 'uuid'

/**
 * Authentication Service
 * Handles user authentication logic (register, login, password reset, etc.)
 */

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name
 * @returns {Promise<{user, token}>} Created user and JWT token
 */
export async function registerUser(email, password, name) {
  // Check if user already exists
  const existingUser = await query('SELECT id FROM users WHERE email = $1', [email])
  if (existingUser.rows.length > 0) {
    const err = new Error('Email already registered')
    err.code = 'EMAIL_EXISTS'
    err.status = 409
    throw err
  }

  // Hash password
  const passwordHash = await hashPassword(password)

  // Create user
  const userId = uuidv4()
  const result = await query(
    `INSERT INTO users (id, email, name, password_hash, created_at, updated_at)
     VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     RETURNING id, email, name, plan, created_at`,
    [userId, email, name, passwordHash]
  )

  const user = result.rows[0]

  // Generate token
  const token = generateToken(user.id, user.email)

  // Store session
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  await query(
    `INSERT INTO sessions (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [user.id, tokenHash, expiresAt]
  )

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      joinedAt: user.created_at,
    },
    token,
  }
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{user, token}>} User and JWT token
 */
export async function loginUser(email, password) {
  // Find user
  const result = await query(
    'SELECT id, email, name, password_hash, plan, avatar_url FROM users WHERE email = $1 AND status = $2',
    [email, 'active']
  )

  if (result.rows.length === 0) {
    const err = new Error('Invalid email or password')
    err.code = 'INVALID_CREDENTIALS'
    err.status = 401
    throw err
  }

  const user = result.rows[0]

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password_hash)
  if (!isValidPassword) {
    const err = new Error('Invalid email or password')
    err.code = 'INVALID_CREDENTIALS'
    err.status = 401
    throw err
  }

  // Update last login
  await query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id])

  // Generate token
  const token = generateToken(user.id, user.email)

  // Store session
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  await query(
    `INSERT INTO sessions (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [user.id, tokenHash, expiresAt]
  )

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      avatar_url: user.avatar_url,
    },
    token,
  }
}

/**
 * Get current user by ID
 * @param {string} userId - User ID
 * @returns {Promise<object>} User object
 */
export async function getCurrentUser(userId) {
  const result = await query(
    'SELECT id, email, name, plan, avatar_url, bio, status, created_at, last_login_at FROM users WHERE id = $1',
    [userId]
  )

  if (result.rows.length === 0) {
    const err = new Error('User not found')
    err.code = 'USER_NOT_FOUND'
    err.status = 404
    throw err
  }

  return result.rows[0]
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {object} updates - Profile updates
 * @returns {Promise<object>} Updated user
 */
export async function updateUserProfile(userId, updates) {
  const allowedFields = ['name', 'bio', 'avatar_url']
  const updateFields = Object.keys(updates).filter(key => allowedFields.includes(key))

  if (updateFields.length === 0) {
    return getCurrentUser(userId)
  }

  const setClause = updateFields.map((field, i) => `${field} = $${i + 1}`).join(', ')
  const values = updateFields.map(field => updates[field])
  values.push(userId)

  const result = await query(
    `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${updateFields.length + 1}
     RETURNING id, email, name, plan, avatar_url, bio, status, created_at, updated_at`,
    values
  )

  return result.rows[0]
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export async function changeUserPassword(userId, currentPassword, newPassword) {
  // Get user
  const result = await query('SELECT password_hash FROM users WHERE id = $1', [userId])

  if (result.rows.length === 0) {
    const err = new Error('User not found')
    err.code = 'USER_NOT_FOUND'
    err.status = 404
    throw err
  }

  // Verify current password
  const isValid = await verifyPassword(currentPassword, result.rows[0].password_hash)
  if (!isValid) {
    const err = new Error('Current password is incorrect')
    err.code = 'INVALID_PASSWORD'
    err.status = 401
    throw err
  }

  // Hash and save new password
  const passwordHash = await hashPassword(newPassword)
  await query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [
    passwordHash,
    userId,
  ])
}

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<string>} Reset token
 */
export async function requestPasswordReset(email) {
  // Find user
  const result = await query('SELECT id FROM users WHERE email = $1', [email])

  if (result.rows.length === 0) {
    // Don't reveal if email exists for security
    return null
  }

  const userId = result.rows[0].id

  // Generate reset token
  const token = generateRandomToken()
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour

  await query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  )

  return token
}

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<object>} Updated user
 */
export async function resetPassword(token, newPassword) {
  const tokenHash = hashToken(token)

  // Find valid token
  const result = await query(
    `SELECT user_id FROM password_reset_tokens
     WHERE token_hash = $1 AND expires_at > CURRENT_TIMESTAMP AND used_at IS NULL`,
    [tokenHash]
  )

  if (result.rows.length === 0) {
    const err = new Error('Invalid or expired reset token')
    err.code = 'INVALID_RESET_TOKEN'
    err.status = 400
    throw err
  }

  const userId = result.rows[0].user_id

  // Hash and save new password
  const passwordHash = await hashPassword(newPassword)
  await query('UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [
    passwordHash,
    userId,
  ])

  // Mark token as used
  await query('UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE token_hash = $1', [
    tokenHash,
  ])

  return getCurrentUser(userId)
}

/**
 * Logout user (revoke session)
 * @param {string} userId - User ID
 * @param {string} tokenHash - Token hash to revoke
 * @returns {Promise<void>}
 */
export async function logoutUser(userId, tokenHash) {
  await query(
    'UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND token_hash = $2',
    [userId, tokenHash]
  )
}
