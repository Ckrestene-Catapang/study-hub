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
 * Register a new user
 */
export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email])
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered',
        code: 'EMAIL_EXISTS',
      })
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

    // Store token in localStorage key
    const tokenStorageKey = 'studyhub-token'

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          joinedAt: user.created_at,
        },
        token,
        storageKey: tokenStorageKey, // For frontend localStorage
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Login user
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    // Find user
    const result = await query(
      'SELECT id, email, name, password_hash, plan, avatar_url FROM users WHERE email = $1 AND status = $2',
      [email, 'active']
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      })
    }

    const user = result.rows[0]

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      })
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

    const tokenStorageKey = 'studyhub-token'

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          avatar: user.avatar_url,
        },
        token,
        storageKey: tokenStorageKey,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUser(req, res, next) {
  try {
    const { userId } = req.user

    const result = await query(
      'SELECT id, email, name, avatar_url, bio, plan, created_at FROM users WHERE id = $1',
      [userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      })
    }

    const user = result.rows[0]

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar_url,
          bio: user.bio,
          plan: user.plan,
          joinedAt: user.created_at,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update user profile
 */
export async function updateProfile(req, res, next) {
  try {
    const { userId } = req.user
    const { name, bio } = req.body

    const result = await query(
      `UPDATE users 
       SET name = COALESCE($2, name),
           bio = COALESCE($3, bio),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, email, name, avatar_url, bio, plan`,
      [userId, name || null, bio || null]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      })
    }

    const user = result.rows[0]

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar_url,
          bio: user.bio,
          plan: user.plan,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Change password
 */
export async function changePassword(req, res, next) {
  try {
    const { userId } = req.user
    const { currentPassword, newPassword } = req.body

    // Get current password hash
    const result = await query('SELECT password_hash FROM users WHERE id = $1', [userId])

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      })
    }

    const user = result.rows[0]

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect',
        code: 'INVALID_PASSWORD',
      })
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    // Update password
    await query(
      'UPDATE users SET password_hash = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId, newPasswordHash]
    )

    // Revoke all existing sessions for security
    await query(
      'UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND revoked_at IS NULL',
      [userId]
    )

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Request password reset
 */
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body

    // Find user
    const result = await query('SELECT id FROM users WHERE email = $1', [email])

    // Always return success for security (don't reveal if email exists)
    if (result.rows.length === 0) {
      return res.json({
        success: true,
        message: 'If an account exists, password reset email has been sent',
      })
    }

    const user = result.rows[0]

    // Generate reset token
    const resetToken = generateRandomToken()
    const tokenHash = hashToken(resetToken)
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour

    await query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, tokenHash, expiresAt]
    )

    // TODO: Send email with reset link
    // For now, just return the token (in production, only send via email)
    console.log(`[AUTH] Password reset token for ${email}: ${resetToken}`)

    res.json({
      success: true,
      message: 'Password reset email sent',
      // Remove in production - only for testing
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body

    // Find and verify token
    const tokenHash = hashToken(token)
    const result = await query(
      `SELECT user_id FROM password_reset_tokens 
       WHERE token_hash = $1 AND expires_at > CURRENT_TIMESTAMP AND used_at IS NULL`,
      [tokenHash]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token',
        code: 'INVALID_TOKEN',
      })
    }

    const { user_id } = result.rows[0]

    // Hash new password
    const passwordHash = await hashPassword(password)

    // Update password
    await query(
      'UPDATE users SET password_hash = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user_id, passwordHash]
    )

    // Mark token as used
    await query(
      'UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE token_hash = $1',
      [tokenHash]
    )

    res.json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.',
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Logout (revoke session)
 */
export async function logout(req, res, next) {
  try {
    const { userId } = req.user

    // Revoke current session
    await query(
      'UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND revoked_at IS NULL',
      [userId]
    )

    res.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    next(error)
  }
}

export default {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  logout,
}
