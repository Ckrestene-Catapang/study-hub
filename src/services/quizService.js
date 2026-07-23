import { apiClient } from "./apiClient"

/**
 * Quiz Service (v1.0.3)
 * Fully API-driven without mock fallbacks
 * All data comes from real backend
 */
export const quizService = {
  /**
   * Get all quizzes for authenticated user
   */
  async getQuizzes() {
    try {
      const response = await apiClient.get("/quizzes")
      return response.data.data || []
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to fetch quizzes",
        code: error.response?.data?.code || "FETCH_QUIZZES_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Get quizzes by room
   */
  async getQuizzesByRoom(roomId) {
    try {
      const response = await apiClient.get(`/quizzes/room/${roomId}`)
      return response.data.data || []
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to fetch room quizzes",
        code: error.response?.data?.code || "FETCH_ROOM_QUIZZES_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Get a specific quiz with questions
   */
  async getQuizById(id) {
    try {
      const response = await apiClient.get(`/quizzes/${id}`)
      return response.data.data
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to fetch quiz",
        code: error.response?.data?.code || "FETCH_QUIZ_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Create a new quiz
   */
  async createQuiz(payload) {
    try {
      const response = await apiClient.post("/quizzes", {
        title: payload.title,
        description: payload.description,
        roomId: payload.roomId,
        isPublished: payload.isPublished || false,
      })
      return response.data.data
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to create quiz",
        code: error.response?.data?.code || "CREATE_QUIZ_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Update a quiz
   */
  async updateQuiz(quizId, payload) {
    try {
      const response = await apiClient.put(`/quizzes/${quizId}`, {
        title: payload.title,
        description: payload.description,
        isPublished: payload.isPublished,
      })
      return response.data.data
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to update quiz",
        code: error.response?.data?.code || "UPDATE_QUIZ_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Delete a quiz
   */
  async deleteQuiz(quizId) {
    try {
      await apiClient.delete(`/quizzes/${quizId}`)
      return { success: true }
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to delete quiz",
        code: error.response?.data?.code || "DELETE_QUIZ_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Add question to quiz
   */
  async addQuestion(quizId, payload) {
    try {
      const response = await apiClient.post(`/quizzes/${quizId}/questions`, {
        question: payload.question,
        questionType: payload.questionType,
        correctAnswer: payload.correctAnswer,
        points: payload.points || 1,
      })
      return response.data.data
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to add question",
        code: error.response?.data?.code || "ADD_QUESTION_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Update a question
   */
  async updateQuestion(questionId, payload) {
    try {
      const response = await apiClient.put(`/quizzes/questions/${questionId}`, {
        question: payload.question,
        questionType: payload.questionType,
        correctAnswer: payload.correctAnswer,
        points: payload.points,
      })
      return response.data.data
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to update question",
        code: error.response?.data?.code || "UPDATE_QUESTION_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Delete a question
   */
  async deleteQuestion(questionId) {
    try {
      await apiClient.delete(`/quizzes/questions/${questionId}`)
      return { success: true }
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to delete question",
        code: error.response?.data?.code || "DELETE_QUESTION_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Get quiz questions
   */
  async getQuestions(quizId) {
    try {
      const response = await apiClient.get(`/quizzes/${quizId}/questions`)
      return response.data.data || []
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to fetch questions",
        code: error.response?.data?.code || "GET_QUESTIONS_ERROR",
        details: error.response?.data,
      }
    }
  },
}
