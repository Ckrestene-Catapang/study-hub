import { query } from '../db.js'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'

/**
 * Room Service
 * Handles room management logic (create, join, list, etc.)
 * TO BE IMPLEMENTED IN PHASE 2
 */

/**
 * Create a new room
 * @param {string} userId - Owner user ID
 * @param {object} data - Room data {name, description}
 * @returns {Promise<object>} Created room
 */
export async function createRoom(userId, data) {
  // Generate invite code
  const code = crypto.randomBytes(5).toString('hex').toUpperCase().slice(0, 10)
  
  const roomId = uuidv4()
  const result = await query(
    `INSERT INTO rooms (id, owner_id, name, description, code, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     RETURNING id, owner_id, name, description, code, status, created_at`,
    [roomId, userId, data.name, data.description, code]
  )

  // Add owner as member
  await addRoomMember(result.rows[0].id, userId, 'owner')

  return result.rows[0]
}

/**
 * Get room by ID
 * @param {string} roomId - Room ID
 * @returns {Promise<object>} Room data
 */
export async function getRoomById(roomId) {
  const result = await query(
    'SELECT * FROM rooms WHERE id = $1 AND status = $2',
    [roomId, 'active']
  )
  return result.rows[0] || null
}

/**
 * Get user's rooms
 * @param {string} userId - User ID
 * @returns {Promise<array>} List of rooms
 */
export async function getUserRooms(userId) {
  const result = await query(
    `SELECT r.* FROM rooms r
     JOIN room_members rm ON r.id = rm.room_id
     WHERE rm.user_id = $1 AND r.status = $2
     ORDER BY rm.joined_at DESC`,
    [userId, 'active']
  )
  return result.rows
}

/**
 * Add member to room
 * @param {string} roomId - Room ID
 * @param {string} userId - User ID
 * @param {string} role - Member role
 * @returns {Promise<void>}
 */
export async function addRoomMember(roomId, userId, role = 'student') {
  const memberId = uuidv4()
  await query(
    `INSERT INTO room_members (id, room_id, user_id, role, joined_at)
     VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
     ON CONFLICT (room_id, user_id) DO NOTHING`,
    [memberId, roomId, userId, role]
  )
}

/**
 * Get room members
 * @param {string} roomId - Room ID
 * @returns {Promise<array>} List of members with user details
 */
export async function getRoomMembers(roomId) {
  const result = await query(
    `SELECT rm.*, u.email, u.name, u.avatar_url FROM room_members rm
     JOIN users u ON rm.user_id = u.id
     WHERE rm.room_id = $1
     ORDER BY rm.joined_at ASC`,
    [roomId]
  )
  return result.rows
}

/**
 * Remove member from room
 * @param {string} roomId - Room ID
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export async function removeRoomMember(roomId, userId) {
  await query(
    'DELETE FROM room_members WHERE room_id = $1 AND user_id = $2',
    [roomId, userId]
  )
}

/**
 * Join room by code
 * @param {string} userId - User ID
 * @param {string} code - Room invite code
 * @returns {Promise<object>} Joined room
 */
export async function joinRoomByCode(userId, code) {
  const result = await query(
    'SELECT id FROM rooms WHERE code = $1 AND status = $2',
    [code, 'active']
  )

  if (result.rows.length === 0) {
    const err = new Error('Invalid room code')
    err.code = 'INVALID_ROOM_CODE'
    err.status = 404
    throw err
  }

  const roomId = result.rows[0].id
  await addRoomMember(roomId, userId, 'student')

  return getRoomById(roomId)
}

export default {
  createRoom,
  getRoomById,
  getUserRooms,
  addRoomMember,
  getRoomMembers,
  removeRoomMember,
  joinRoomByCode,
}
