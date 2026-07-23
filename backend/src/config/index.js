import dotenv from 'dotenv'

dotenv.config()

/**
 * Application Configuration
 * Centralized configuration for all environment variables
 */

export const config = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost/studyhub',
  DB_POOL_SIZE: parseInt(process.env.DB_POOL_SIZE, 10) || 20,
  DB_POOL_IDLE_TIMEOUT: parseInt(process.env.DB_POOL_IDLE_TIMEOUT, 10) || 30000,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // API
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000',

  // Session
  SESSION_TIMEOUT: parseInt(process.env.SESSION_TIMEOUT, 10) || 7 * 24 * 60 * 60 * 1000, // 7 days

  // Email (for future use)
  EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || 'sendgrid',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@studyhub.local',

  // Feature flags
  ENABLE_REGISTRATION: process.env.ENABLE_REGISTRATION !== 'false',
  ENABLE_PASSWORD_RESET: process.env.ENABLE_PASSWORD_RESET !== 'false',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
}

// Validate required environment variables in production
if (config.NODE_ENV === 'production') {
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET', 'CORS_ORIGIN']
  const missing = requiredVars.filter(v => !process.env[v])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

export default config
