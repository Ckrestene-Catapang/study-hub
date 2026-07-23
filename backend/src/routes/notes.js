import express from 'express'
import * as noteController from '../controllers/noteController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

/**
 * Note endpoints
 */

// Get all user notes
router.get('/', requireAuth, noteController.getNotes)

// Get notes by room
router.get('/room/:roomId', requireAuth, noteController.getNotesByRoom)

// Create note
router.post('/', requireAuth, noteController.createNote)

// Get single note
router.get('/:noteId', requireAuth, noteController.getNote)

// Update note
router.put('/:noteId', requireAuth, noteController.updateNote)

// Delete note
router.delete('/:noteId', requireAuth, noteController.deleteNote)

export default router
