import * as roomService from '../services/roomService.js'
import { handleError } from '../utils/errorHandler.js'

/**
 * Create a new room
 * POST /api/rooms
 */
export async function createRoom(req, res) {
  try {
    const { name, description } = req.body
    const userId = req.user.id

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Room name is required and must be a non-empty string',
        code: 'INVALID_ROOM_NAME',
      })
    }

    if (name.length > 255) {
      return res.status(400).json({
        success: false,
        error: 'Room name must be 255 characters or less',
        code: 'ROOM_NAME_TOO_LONG',
      })
    }

    if (description && description.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Room description must be 1000 characters or less',
        code: 'ROOM_DESCRIPTION_TOO_LONG',
      })
    }

    const room = await roomService.createRoom(userId, { name, description })

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room,
    })
  } catch (error) {
    handleError(error, res)
  }
}

/**
 * Get all rooms for authenticated user
 * GET /api/rooms
 */
export async function getUserRooms(req, res) {
  try {
    const userId = req.user.id
    const rooms = await roomService.getUserRooms(userId)

    res.json({
      success: true,
      data: rooms,
    })
  } catch (error) {
    handleError(error, res)
  }
}

/**
 * Get specific room by ID
 * GET /api/rooms/:roomId
 */
export async function getRoom(req, res) {
  try {
    const { roomId } = req.params
    const room = await roomService.getRoomById(roomId)

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found',
        code: 'ROOM_NOT_FOUND',
      })
    }

    // Check if user is member (optional: enforce in future)
    res.json({
      success: true,
      data: room,
    })
  } catch (error) {
    handleError(error, res)
  }
}

/**
 * Get room members
 * GET /api/rooms/:roomId/members
 */
export async function getRoomMembers(req, res) {
  try {
    const { roomId } = req.params
    const members = await roomService.getRoomMembers(roomId)

    res.json({
      success: true,
      data: members,
    })
  } catch (error) {
    handleError(error, res)
  }
}

/**
 * Join room by code
 * POST /api/rooms/join
 */
export async function joinRoom(req, res) {
  try {
    const { code } = req.body
    const userId = req.user.id

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid room code',
        code: 'INVALID_ROOM_CODE',
      })
    }

    const room = await roomService.joinRoomByCode(userId, code.toUpperCase())

    res.status(200).json({
      success: true,
      message: 'Successfully joined room',
      data: room,
    })
  } catch (error) {
    if (error.code === 'INVALID_ROOM_CODE') {
      return res.status(404).json({
        success: false,
        error: 'Room not found or invalid code',
        code: error.code,
      })
    }
    handleError(error, res)
  }
}

/**
 * Remove member from room
 * DELETE /api/rooms/:roomId/members/:userId
 */
export async function removeRoomMember(req, res) {
  try {
    const { roomId, userId } = req.params
    const currentUserId = req.user.id

    // Get room to check if user is owner
    const room = await roomService.getRoomById(roomId)
    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found',
        code: 'ROOM_NOT_FOUND',
      })
    }

    // Only room owner can remove members
    if (room.owner_id !== currentUserId) {
      return res.status(403).json({
        success: false,
        error: 'Only room owner can remove members',
        code: 'UNAUTHORIZED',
      })
    }

    // Prevent removing owner
    if (userId === room.owner_id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot remove room owner',
        code: 'CANNOT_REMOVE_OWNER',
      })
    }

    await roomService.removeRoomMember(roomId, userId)

    res.json({
      success: true,
      message: 'Member removed successfully',
    })
  } catch (error) {
    handleError(error, res)
  }
}

/**
 * Leave room
 * POST /api/rooms/:roomId/leave
 */
export async function leaveRoom(req, res) {
  try {
    const { roomId } = req.params
    const userId = req.user.id

    // Get room to check if user is owner
    const room = await roomService.getRoomById(roomId)
    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found',
        code: 'ROOM_NOT_FOUND',
      })
    }

    // Owner cannot leave
    if (room.owner_id === userId) {
      return res.status(400).json({
        success: false,
        error: 'Room owner cannot leave their room',
        code: 'OWNER_CANNOT_LEAVE',
      })
    }

    await roomService.removeRoomMember(roomId, userId)

    res.json({
      success: true,
      message: 'Successfully left room',
    })
  } catch (error) {
    handleError(error, res)
  }
}

/**
 * Delete room (owner only)
 * DELETE /api/rooms/:roomId
 */
export async function deleteRoom(req, res) {
  try {
    const { roomId } = req.params
    const userId = req.user.id

    // Get room to verify ownership
    const room = await roomService.getRoomById(roomId)
    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found',
        code: 'ROOM_NOT_FOUND',
      })
    }

    // Only owner can delete
    if (room.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only room owner can delete the room',
        code: 'UNAUTHORIZED',
      })
    }

    // Delete room (soft delete by marking as inactive)
    const { query } = await import('../db.js')
    await query(
      'UPDATE rooms SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['deleted', roomId]
    )

    res.json({
      success: true,
      message: 'Room deleted successfully',
    })
  } catch (error) {
    handleError(error, res)
  }
}

export default {
  createRoom,
  getUserRooms,
  getRoom,
  getRoomMembers,
  joinRoom,
  removeRoomMember,
  leaveRoom,
  deleteRoom,
}
