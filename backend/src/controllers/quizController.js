import { query } from '../db.js'
import { v4 as uuidv4 } from 'uuid'

/**
 * Get all quizzes for authenticated user
 */
export async function getQuizzes(req, res, next) {
  try {
    const userId = req.user.id

    const result = await query(
      `SELECT id, title, description, is_published, room_id, created_at, updated_at
       FROM quizzes
       WHERE user_id = $1 AND status = 'active'
       ORDER BY updated_at DESC`,
      [userId]
    )

    res.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get quizzes by room
 */
export async function getQuizzesByRoom(req, res, next) {
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
      `SELECT id, title, description, user_id, is_published, created_at, updated_at
       FROM quizzes
       WHERE room_id = $1 AND status = 'active' AND is_published = true
       ORDER BY updated_at DESC`,
      [roomId]
    )

    res.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get single quiz with questions
 */
export async function getQuiz(req, res, next) {
  try {
    const { quizId } = req.params
    const userId = req.user.id

    const result = await query(
      `SELECT id, title, description, user_id, room_id, is_published, created_at, updated_at
       FROM quizzes
       WHERE id = $1 AND status = 'active'`,
      [quizId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        code: 'NOT_FOUND',
      })
    }

    const quiz = result.rows[0]

    // Check permissions
    const isOwner = quiz.user_id === userId
    const isMember = quiz.room_id
      ? (await query('SELECT id FROM room_members WHERE room_id = $1 AND user_id = $2', [
          quiz.room_id,
          userId,
        ])).rows.length > 0
      : false

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        code: 'FORBIDDEN',
      })
    }

    // Get questions
    const questionsResult = await query(
      `SELECT id, question, question_type, correct_answer, points, order_num
       FROM quiz_questions
       WHERE quiz_id = $1
       ORDER BY order_num ASC`,
      [quizId]
    )

    res.json({
      success: true,
      data: {
        ...quiz,
        questions: questionsResult.rows,
        questionCount: questionsResult.rows.length,
        totalPoints: questionsResult.rows.reduce((sum, q) => sum + (q.points || 0), 0),
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Create new quiz
 */
export async function createQuiz(req, res, next) {
  try {
    const { title, description, roomId, isPublished } = req.body
    const userId = req.user.id

    // Validate input
    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required',
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

    const quizId = uuidv4()
    const result = await query(
      `INSERT INTO quizzes (id, user_id, room_id, title, description, is_published, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, title, description, room_id, is_published, created_at, updated_at`,
      [quizId, userId, roomId || null, title, description || '', isPublished || false, 'active']
    )

    res.status(201).json({
      success: true,
      data: {
        ...result.rows[0],
        questions: [],
        questionCount: 0,
        totalPoints: 0,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update quiz
 */
export async function updateQuiz(req, res, next) {
  try {
    const { quizId } = req.params
    const { title, description, isPublished } = req.body
    const userId = req.user.id

    // Check ownership
    const quizResult = await query(
      'SELECT user_id FROM quizzes WHERE id = $1 AND status = $2',
      [quizId, 'active']
    )

    if (quizResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        code: 'NOT_FOUND',
      })
    }

    if (quizResult.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only the creator can edit this quiz',
        code: 'FORBIDDEN',
      })
    }

    const result = await query(
      `UPDATE quizzes
       SET title = $1, description = $2, is_published = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND status = $5
       RETURNING id, title, description, room_id, is_published, created_at, updated_at`,
      [title || undefined, description || undefined, isPublished || false, quizId, 'active']
    )

    res.json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete quiz (soft delete)
 */
export async function deleteQuiz(req, res, next) {
  try {
    const { quizId } = req.params
    const userId = req.user.id

    // Check ownership
    const quizResult = await query(
      'SELECT user_id FROM quizzes WHERE id = $1 AND status = $2',
      [quizId, 'active']
    )

    if (quizResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        code: 'NOT_FOUND',
      })
    }

    if (quizResult.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only the creator can delete this quiz',
        code: 'FORBIDDEN',
      })
    }

    await query(
      'UPDATE quizzes SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['deleted', quizId]
    )

    res.json({
      success: true,
      data: { id: quizId, deleted: true },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Add question to quiz
 */
export async function addQuestion(req, res, next) {
  try {
    const { quizId } = req.params
    const { question, questionType, correctAnswer, points } = req.body
    const userId = req.user.id

    // Check ownership
    const quizResult = await query(
      'SELECT user_id FROM quizzes WHERE id = $1 AND status = $2',
      [quizId, 'active']
    )

    if (quizResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        code: 'NOT_FOUND',
      })
    }

    if (quizResult.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only the creator can edit this quiz',
        code: 'FORBIDDEN',
      })
    }

    // Get next order number
    const orderResult = await query(
      'SELECT MAX(order_num) as max_order FROM quiz_questions WHERE quiz_id = $1',
      [quizId]
    )
    const nextOrder = (orderResult.rows[0]?.max_order || 0) + 1

    const questionId = uuidv4()
    const result = await query(
      `INSERT INTO quiz_questions (id, quiz_id, question, question_type, correct_answer, points, order_num, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
       RETURNING id, question, question_type, correct_answer, points, order_num`,
      [questionId, quizId, question, questionType, correctAnswer, points || 1, nextOrder]
    )

    res.status(201).json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get quiz questions
 */
export async function getQuestions(req, res, next) {
  try {
    const { quizId } = req.params

    const result = await query(
      `SELECT id, question, question_type, correct_answer, points, order_num
       FROM quiz_questions
       WHERE quiz_id = $1
       ORDER BY order_num ASC`,
      [quizId]
    )

    res.json({
      success: true,
      data: result.rows,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update question
 */
export async function updateQuestion(req, res, next) {
  try {
    const { questionId } = req.params
    const { question, questionType, correctAnswer, points } = req.body
    const userId = req.user.id

    // Check ownership through quiz
    const qResult = await query(
      `SELECT q.id, quiz.user_id FROM quiz_questions q
       JOIN quizzes quiz ON q.quiz_id = quiz.id
       WHERE q.id = $1`,
      [questionId]
    )

    if (qResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Question not found',
        code: 'NOT_FOUND',
      })
    }

    if (qResult.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only the creator can edit this question',
        code: 'FORBIDDEN',
      })
    }

    const result = await query(
      `UPDATE quiz_questions
       SET question = $1, question_type = $2, correct_answer = $3, points = $4
       WHERE id = $5
       RETURNING id, question, question_type, correct_answer, points, order_num`,
      [question, questionType, correctAnswer, points, questionId]
    )

    res.json({
      success: true,
      data: result.rows[0],
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete question
 */
export async function deleteQuestion(req, res, next) {
  try {
    const { questionId } = req.params
    const userId = req.user.id

    // Check ownership
    const qResult = await query(
      `SELECT q.id, quiz.user_id FROM quiz_questions q
       JOIN quizzes quiz ON q.quiz_id = quiz.id
       WHERE q.id = $1`,
      [questionId]
    )

    if (qResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Question not found',
        code: 'NOT_FOUND',
      })
    }

    if (qResult.rows[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Only the creator can delete this question',
        code: 'FORBIDDEN',
      })
    }

    await query('DELETE FROM quiz_questions WHERE id = $1', [questionId])

    res.json({
      success: true,
      data: { id: questionId, deleted: true },
    })
  } catch (error) {
    next(error)
  }
}
