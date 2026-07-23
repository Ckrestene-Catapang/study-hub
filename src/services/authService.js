import { apiClient } from "./apiClient"

/**
 * Authentication service - connects to real backend API
 */
export const authService = {
  /**
   * Register new user
   */
  async register(payload) {
    try {
      const response = await apiClient.post("/auth/register", {
        email: payload.email,
        password: payload.password,
        name: payload.name,
      })
      
      // Token is already stored by apiClient interceptor,
      // but we can ensure it's there
      if (response.data.data?.token) {
        window.localStorage.setItem("studyhub-token", response.data.data.token)
      }
      
      // Return user data + token for AuthContext
      return response.data.data
    } catch (error) {
      // Map error codes to user-friendly messages
      const errorCode = error.response?.data?.code || 'UNKNOWN_ERROR'
      const errorMessages = {
        EMAIL_EXISTS: 'This email is already registered',
        PASSWORD_WEAK: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
        INVALID_EMAIL: 'Please enter a valid email address',
        UNKNOWN_ERROR: 'Registration failed. Please try again.',
      }
      
      throw {
        error: errorMessages[errorCode] || error.response?.data?.error || 'Registration failed',
        code: errorCode,
        details: error.response?.data,
      }
    }
  },

  /**
   * Login user
   */
  async login({ email, password }) {
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      })
      
      // Token is already stored by apiClient interceptor
      if (response.data.data?.token) {
        window.localStorage.setItem("studyhub-token", response.data.data.token)
      }
      
      // Return user data + token for AuthContext
      return response.data.data
    } catch (error) {
      // Map error codes to user-friendly messages
      const errorCode = error.response?.data?.code || 'UNKNOWN_ERROR'
      const errorMessages = {
        INVALID_CREDENTIALS: 'Email or password is incorrect',
        USER_NOT_FOUND: 'Email or password is incorrect',
        ACCOUNT_LOCKED: 'Account is locked. Please reset your password.',
        UNKNOWN_ERROR: 'Login failed. Please try again.',
      }
      
      throw {
        error: errorMessages[errorCode] || error.response?.data?.error || 'Login failed',
        code: errorCode,
        details: error.response?.data,
      }
    }
  },

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get("/auth/me")
      return response.data.data?.user
    } catch (error) {
      throw error.response?.data || { error: "Failed to fetch user" }
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(payload) {
    try {
      const response = await apiClient.put("/auth/profile", payload)
      return response.data.data?.user
    } catch (error) {
      throw error.response?.data || { error: "Failed to update profile" }
    }
  },

  /**
   * Change password
   */
  async changePassword({ currentPassword, newPassword }) {
    try {
      const response = await apiClient.post("/auth/change-password", {
        currentPassword,
        newPassword,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: "Failed to change password" }
    }
  },

  /**
   * Request password reset
   */
  async forgotPassword({ email }) {
    try {
      const response = await apiClient.post("/auth/forgot-password", { email })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: "Failed to request password reset" }
    }
  },

  /**
   * Reset password with token
   */
  async resetPassword({ token, password }) {
    try {
      const response = await apiClient.post("/auth/reset-password", {
        token,
        password,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: "Failed to reset password" }
    }
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await apiClient.post("/auth/logout")
      window.localStorage.removeItem("studyhub-token")
      return { success: true }
    } catch (error) {
      // Still remove token even if request fails
      window.localStorage.removeItem("studyhub-token")
      return { success: true }
    }
  },
}
