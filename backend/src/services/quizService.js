import { query } from '../db.js'
import { v4 as uuidv4 } from 'uuid'

/**
 * Quiz Service
 * Handles quiz management and submission logic
 * TO BE IMPLEMENTED IN PHASE 5
 */

export async function createQuiz(userId, data) {
  const quizId = uuidv4()
  const result = await query(
    `INSERT INTO quizzes (id, room_id, creator_id, title, description, time_limit, shuffle_questions, show_answers, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     RETURNING *`,
    [
      quizId,
      data.room_id,
      userId,
      data.title,
      data.description,
      data.time_limit,
      data.shuffle_questions || false,
      data.show_answers !== false,
    ]
  )
  return result.rows[0]
}

export async function getQuizById(quizId) {
  const result = await query('SELECT * FROM quizzes WHERE id = $1', [quizId])
  return result.rows[0] || null
}

export async function getQuizzesByRoom(roomId) {
  const result = await query(
    `SELECT * FROM quizzes WHERE room_id = $1 AND status = $2 ORDER BY created_at DESC`,
    [roomId, 'active']
  )
  return result.rows
}

export async function addQuizQuestion(quizId, data) {
  const questionId = uuidv4()
  const result = await query(
    `INSERT INTO quiz_questions (id, quiz_id, question, question_type, options, correct_answer, points, order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      questionId,
      quizId,
      data.question,
      data.question_type,
      data.options || [],
      data.correct_answer,
      data.points || 1,
      data.order,
    ]
  )
  return result.rows[0]
}

export async function getQuizQuestions(quizId) {
  const result = await query(
    `SELECT * FROM quiz_questions WHERE quiz_id = $1 ORDER BY order ASC`,
    [quizId]
  )
  return result.rows
}

export async function submitQuizAnswer(submissionId, questionId, answer) {
  // Store individual answer (implementation depends on schema)
  // For now, just return success
  return { success: true }
}

export async function createSubmission(quizId, userId) {
  const submissionId = uuidv4()
  const result = await query(
    `INSERT INTO quiz_submissions (id, quiz_id, user_id, submitted_at)
     VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
     RETURNING *`,
    [submissionId, quizId, userId]
  )
  return result.rows[0]
}

export async function getSubmission(submissionId) {
  const result = await query(
    'SELECT * FROM quiz_submissions WHERE id = $1',
    [submissionId]
  )
  return result.rows[0] || null
}

export async function getUserSubmissions(userId, quizId) {
  const result = await query(
    `SELECT * FROM quiz_submissions WHERE user_id = $1 AND quiz_id = $2 ORDER BY submitted_at DESC`,
    [userId, quizId]
  )
  return result.rows
}

export async function updateSubmissionScore(submissionId, score, totalPoints, timeTaken) {
  const result = await query(
    `UPDATE quiz_submissions SET score = $1, total_points = $2, time_taken = $3
     WHERE id = $4
     RETURNING *`,
    [score, totalPoints, timeTaken, submissionId]
  )
  return result.rows[0]
}

export default {
  createQuiz,
  getQuizById,
  getQuizzesByRoom,
  addQuizQuestion,
  getQuizQuestions,
  submitQuizAnswer,
  createSubmission,
  getSubmission,
  getUserSubmissions,
  updateSubmissionScore,
}
