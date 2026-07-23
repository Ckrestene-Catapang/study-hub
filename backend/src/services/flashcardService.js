import { query } from '../db.js'
import { v4 as uuidv4 } from 'uuid'

/**
 * Flashcard Service
 * Handles flashcard and study logic
 * TO BE IMPLEMENTED IN PHASE 4
 */

export async function createFlashcard(userId, data) {
  const cardId = uuidv4()
  const result = await query(
    `INSERT INTO flashcards (id, room_id, user_id, front, back, tags, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     RETURNING *`,
    [cardId, data.room_id, userId, data.front, data.back, data.tags || []]
  )
  return result.rows[0]
}

export async function getFlashcardById(cardId) {
  const result = await query('SELECT * FROM flashcards WHERE id = $1', [cardId])
  return result.rows[0] || null
}

export async function getFlashcardsByRoom(roomId) {
  const result = await query(
    `SELECT * FROM flashcards WHERE room_id = $1 ORDER BY created_at DESC`,
    [roomId]
  )
  return result.rows
}

export async function getFlashcardsByUser(userId) {
  const result = await query(
    `SELECT * FROM flashcards WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  )
  return result.rows
}

export async function updateFlashcard(cardId, userId, data) {
  const result = await query(
    `UPDATE flashcards SET front = $1, back = $2, tags = $3, updated_at = CURRENT_TIMESTAMP
     WHERE id = $4 AND user_id = $5
     RETURNING *`,
    [data.front, data.back, data.tags || [], cardId, userId]
  )
  return result.rows[0] || null
}

export async function deleteFlashcard(cardId, userId) {
  await query('DELETE FROM flashcards WHERE id = $1 AND user_id = $2', [cardId, userId])
}

export async function updateMasteryLevel(cardId, userId, level) {
  const result = await query(
    `INSERT INTO flashcard_progress (flashcard_id, user_id, mastery_level, review_count, last_reviewed_at, created_at, updated_at)
     VALUES ($1, $2, $3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     ON CONFLICT (flashcard_id, user_id) DO UPDATE SET 
       mastery_level = $3, 
       review_count = flashcard_progress.review_count + 1,
       last_reviewed_at = CURRENT_TIMESTAMP,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [cardId, userId, Math.min(5, Math.max(0, level))]
  )
  return result.rows[0]
}

export async function getUserFlashcardProgress(userId, roomId = null) {
  let queryStr = `SELECT fp.*, f.front, f.back, f.room_id FROM flashcard_progress fp
                  JOIN flashcards f ON fp.flashcard_id = f.id
                  WHERE fp.user_id = $1`
  const params = [userId]

  if (roomId) {
    queryStr += ` AND f.room_id = $2`
    params.push(roomId)
  }

  queryStr += ` ORDER BY fp.last_reviewed_at ASC`

  const result = await query(queryStr, params)
  return result.rows
}

export default {
  createFlashcard,
  getFlashcardById,
  getFlashcardsByRoom,
  getFlashcardsByUser,
  updateFlashcard,
  deleteFlashcard,
  updateMasteryLevel,
  getUserFlashcardProgress,
}
