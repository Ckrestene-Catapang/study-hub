import express from 'express'
import * as authController from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from '../middleware/validation.js'

const router = express.Router()

/**
 * Public Routes
 */

// POST /api/auth/register
router.post('/register', registerValidation, authController.register)

// POST /api/auth/login
router.post('/login', loginValidation, authController.login)

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword)

// POST /api/auth/reset-password
router.post('/reset-password', resetPasswordValidation, authController.resetPassword)

/**
 * Protected Routes (requires authentication)
 */

// GET /api/auth/me
router.get('/me', requireAuth, authController.getCurrentUser)

// PUT /api/auth/profile
router.put('/profile', requireAuth, updateProfileValidation, authController.updateProfile)

// POST /api/auth/change-password
router.post('/change-password', requireAuth, changePasswordValidation, authController.changePassword)

// POST /api/auth/logout
router.post('/logout', requireAuth, authController.logout)

export default router
