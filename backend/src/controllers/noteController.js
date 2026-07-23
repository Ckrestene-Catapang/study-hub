import { query } from '../db.js'
import { v4 as uuidv4 } from 'uuid'

/**
 * Get all notes for authenticated user
 */
export async function getNotes(req, res, next) {
  try {
    const userId = req.user.id

    const result = await query(
      `SELECT id, title, content, tags, room_id, created_at, updated_at
       FROM notes
       WHERE user_id = $1 AND status = 'active'
       ORDER BY updated_at DESC`,
      [userId]
    )

    res.json({
      success: true,
      data: result.rows.map((note) => ({
        ...note,
        tags: note.tags ? JSON.parse(note.tags) : [],
      })),
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get notes by room
 */
export async function getNotesByRoom(req, res, next) {
  try {
    const { roomId } = req.params
    const userId = req.user.id

    // Check if user is member of room
    const memberCheck = await query(
      'SELECT id FROM room_members WHERE room_id = $1 AND user_id = $2',
      [roomId, userId]
    )

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'Not a member of this room',
        code: 'NOT_MEMBER',
      })
    }

    const result = await query(
      `SELECT id, title, content, tags, user_id, created_at, updated_at
       FROM notes
       WHERE room_id = $1 AND status = 'active'
       ORDER BY updated_at DESC`,
      [roomId]
    )

    res.json({
      success: true,
      data: result.rows.map((note) => ({
        ...note,
        tags: note.tags ? JSON.parse(note.tags) : [],
      })),
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get single note
 */
export async function getNote(req, res, next) {
  try {
    const { noteId } = req.params
    const userId = req.user.id

    const result = await query(
      `SELECT id, title, content, tags, room_id, user_id, created_at, updated_at
       FROM notes
       WHERE id = $1 AND status = 'active'`,
      [noteId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
        code: 'NOT_FOUND',
      })
    }

    const note = result.rows[0]

    // Check if user owns note or is member of room
    if (note.user_id !== userId && note.room_id) {
      const memberCheck = await query(
        'SELECT id FROM room_members WHERE room_id = $1 AND user_id = $2',
        [note.room_id, userId]
      )

      if (memberCheck.rows.length === 0) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'FORBIDDEN',
        })
      }
    }

    res.json({
      success: true,
      data: {
        ...note,
        tags: note.tags ? JSON.parse(note.tags) : [],
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Create new note
 */
export async function createNote(req, res, next) {
  try {
    const { title, content, tags, roomId } = req.body
    const userId = req.user.id

    // Validate input
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required',
        code: 'VALIDATION_ERROR',
      })
    }

    // If room specified, check membership
    if (roomId) {
      const memberCheck = await query(
        'SELECT id FROM room_members WHERE room_id = $1 AND user_id = $2',
        [roomId, userId]
      )

      if (memberCheck.rows.length === 0) {
        return res.status(403).json({
          success: false,
          error: 'Not a member of this room',
          code: 'NOT_MEMBER',
        })
      }
    }

    const noteId = uuidv4()
    const result = await query(
      `INSERT INTO notes (id, user_id, room_id, title, content, tags, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, title, content, tags, room_id, created_at, updated_at`,
      [
        noteId,
        userId,
        roomId || null,
        title,
        content,
        JSON.stringify(tags || []),
        'active',
      ]
    )

    res.status(201).json({
      success: true,
      data: {
        ...result.rows[0],
        tags: JSON.parse(result.rows[0].tags),
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update note
 */
export async function updateNote(req, res, next) {
  try {
    const { noteId } = req.params
    const { title, content, tags } = req.body
    const userId = req.user.id

    // Check ownership
    const noteResult = await query(
      'SELECT user_id FROM notes WHERE id = $1 AND status = $2',
      [noteId, 'active']
    )

    if (noteResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
        code: 'NOT_FOUND',
      })
    }

    if (noteResult.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only the creator can edit this note',
        code: 'FORBIDDEN',
      })
    }

    const result = await query(
      `UPDATE notes
       SET title = $1, content = $2, tags = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND status = $5
       RETURNING id, title, content, tags, room_id, created_at, updated_at`,
      [title || undefined, content || undefined, JSON.stringify(tags || []), noteId, 'active']
    )

    res.json({
      success: true,
      data: {
        ...result.rows[0],
        tags: JSON.parse(result.rows[0].tags),
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete note (soft delete)
 */
export async function deleteNote(req, res, next) {
  try {
    const { noteId } = req.params
    const userId = req.user.id

    // Check ownership
    const noteResult = await query(
      'SELECT user_id FROM notes WHERE id = $1 AND status = $2',
      [noteId, 'active']
    )

    if (noteResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Note not found',
        code: 'NOT_FOUND',
      })
    }

    if (noteResult.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only the creator can delete this note',
        code: 'FORBIDDEN',
      })
    }

    await query(
      'UPDATE notes SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['deleted', noteId]
    )

    res.json({
      success: true,
      data: { id: noteId, deleted: true },
    })
  } catch (error) {
    next(error)
  }
}
