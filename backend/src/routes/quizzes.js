import express from 'express'
import * as quizController from '../controllers/quizController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

/**
 * Quiz endpoints
 */

// Get all user quizzes
router.get('/', requireAuth, quizController.getQuizzes)

// Get quizzes by room
router.get('/room/:roomId', requireAuth, quizController.getQuizzesByRoom)

// Create quiz
router.post('/', requireAuth, quizController.createQuiz)

// Get single quiz with questions
router.get('/:quizId', requireAuth, quizController.getQuiz)

// Update quiz
router.put('/:quizId', requireAuth, quizController.updateQuiz)

// Delete quiz
router.delete('/:quizId', requireAuth, quizController.deleteQuiz)

/**
 * Quiz questions
 */

// Add question to quiz
router.post('/:quizId/questions', requireAuth, quizController.addQuestion)

// Get quiz questions
router.get('/:quizId/questions', requireAuth, quizController.getQuestions)

// Update question
router.put('/questions/:questionId', requireAuth, quizController.updateQuestion)

// Delete question
router.delete('/questions/:questionId', requireAuth, quizController.deleteQuestion)

export default router
