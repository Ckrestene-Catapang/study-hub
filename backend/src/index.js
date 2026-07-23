import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/auth.js'
import authRoutes from './routes/auth.js'
import roomRoutes from './routes/rooms.js'
import noteRoutes from './routes/notes.js'
import quizRoutes from './routes/quizzes.js'
import { initializeDatabase } from './db.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

/**
 * Middleware
 */
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/notes', noteRoutes)
app.use('/api/quizzes', quizRoutes)

// TODO: Add more route groups as we implement modules
// app.use('/api/flashcards', flashcardRoutes)

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    code: 'NOT_FOUND',
    path: req.path,
  })
})

/**
 * Error handling
 */
app.use(errorHandler)

/**
 * Initialize and start server
 */
async function start() {
  try {
    // Initialize database
    console.log('[SERVER] Initializing database...')
    await initializeDatabase()

    // Start server
    app.listen(PORT, () => {
      console.log(`[SERVER] Running on http://localhost:${PORT}`)
      console.log(`[SERVER] API Base URL: http://localhost:${PORT}/api`)
      console.log(`[SERVER] CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`)
      console.log(`[SERVER] Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('[SERVER] Failed to start:', error)
    process.exit(1)
  }
}

start()

export default app
