import express from 'express'
import * as roomController from '../controllers/roomController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

/**
 * Protected routes - all require authentication
 */

// POST /api/rooms
router.post('/', requireAuth, roomController.createRoom)

// GET /api/rooms
router.get('/', requireAuth, roomController.getUserRooms)

// POST /api/rooms/join
router.post('/join', requireAuth, roomController.joinRoom)

// GET /api/rooms/:roomId
router.get('/:roomId', requireAuth, roomController.getRoom)

// GET /api/rooms/:roomId/members
router.get('/:roomId/members', requireAuth, roomController.getRoomMembers)

// DELETE /api/rooms/:roomId/members/:userId
router.delete('/:roomId/members/:userId', requireAuth, roomController.removeRoomMember)

// POST /api/rooms/:roomId/leave
router.post('/:roomId/leave', requireAuth, roomController.leaveRoom)

// DELETE /api/rooms/:roomId
router.delete('/:roomId', requireAuth, roomController.deleteRoom)

export default router
