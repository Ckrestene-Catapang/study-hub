import { query } from '../db.js'
import { v4 as uuidv4 } from 'uuid'

/**
 * Note Service
 * Handles note management logic (create, read, update, delete)
 * TO BE IMPLEMENTED IN PHASE 3
 */

export async function createNote(userId, data) {
  const noteId = uuidv4()
  const result = await query(
    `INSERT INTO notes (id, room_id, user_id, title, content, tags, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     RETURNING *`,
    [noteId, data.room_id, userId, data.title, data.content, data.tags || []]
  )
  return result.rows[0]
}

export async function getNoteById(noteId) {
  const result = await query('SELECT * FROM notes WHERE id = $1', [noteId])
  return result.rows[0] || null
}

export async function getNotesByRoom(roomId) {
  const result = await query(
    `SELECT * FROM notes WHERE room_id = $1 ORDER BY updated_at DESC`,
    [roomId]
  )
  return result.rows
}

export async function getNotesByUser(userId) {
  const result = await query(
    `SELECT * FROM notes WHERE user_id = $1 ORDER BY updated_at DESC`,
    [userId]
  )
  return result.rows
}

export async function updateNote(noteId, userId, data) {
  const result = await query(
    `UPDATE notes SET title = $1, content = $2, tags = $3, updated_at = CURRENT_TIMESTAMP
     WHERE id = $4 AND user_id = $5
     RETURNING *`,
    [data.title, data.content, data.tags || [], noteId, userId]
  )
  return result.rows[0] || null
}

export async function deleteNote(noteId, userId) {
  await query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [noteId, userId])
}

export async function pinNote(noteId) {
  const result = await query(
    'UPDATE notes SET is_pinned = true WHERE id = $1 RETURNING *',
    [noteId]
  )
  return result.rows[0]
}

export async function unpinNote(noteId) {
  const result = await query(
    'UPDATE notes SET is_pinned = false WHERE id = $1 RETURNING *',
    [noteId]
  )
  return result.rows[0]
}

export default {
  createNote,
  getNoteById,
  getNotesByRoom,
  getNotesByUser,
  updateNote,
  deleteNote,
  pinNote,
  unpinNote,
}
