import { apiClient } from "./apiClient"
import flashcards from "@/mock/flashcards.json"
import { mockResponse } from "./apiClient"

/**
 * Flashcard Service
 * Handles flashcard and study progress API calls
 * TO BE IMPLEMENTED IN PHASE 4
 */

export const flashcardService = {
  /**
   * Create a new flashcard
   */
  async createFlashcard(payload) {
    try {
      const response = await apiClient.post("/flashcards", {
        front: payload.front,
        back: payload.back,
        room_id: payload.roomId,
        tags: payload.tags || [],
      })
      return response.data.data
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to create flashcard",
        code: error.response?.data?.code || "CREATE_FLASHCARD_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Get flashcards for a room
   */
  async getFlashcardsByRoom(roomId) {
    try {
      const response = await apiClient.get(`/rooms/${roomId}/flashcards`)
      return response.data.data || []
    } catch (error) {
      // Fallback to mock during development
      return mockResponse(flashcards.filter((f) => f.subjectId === roomId))
    }
  },

  /**
   * Get all flashcards (fallback to mock)
   */
  getFlashcards() {
    return mockResponse(flashcards)
  },

  /**
   * Get flashcards by subject (legacy method)
   */
  getFlashcardsBySubject(subjectId) {
    return mockResponse(flashcards.filter((f) => f.subjectId === subjectId))
  },

  /**
   * Get a specific flashcard
   */
  async getFlashcardById(cardId) {
    try {
      const response = await apiClient.get(`/flashcards/${cardId}`)
      return response.data.data
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to fetch flashcard",
        code: error.response?.data?.code || "GET_FLASHCARD_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Update a flashcard
   */
  async updateFlashcard(cardId, payload) {
    try {
      const response = await apiClient.put(`/flashcards/${cardId}`, {
        front: payload.front,
        back: payload.back,
        tags: payload.tags || [],
      })
      return response.data.data
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to update flashcard",
        code: error.response?.data?.code || "UPDATE_FLASHCARD_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Delete a flashcard
   */
  async deleteFlashcard(cardId) {
    try {
      await apiClient.delete(`/flashcards/${cardId}`)
      return { success: true }
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to delete flashcard",
        code: error.response?.data?.code || "DELETE_FLASHCARD_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Update mastery level for a flashcard
   */
  async updateMasteryLevel(cardId, level) {
    try {
      const response = await apiClient.post(`/flashcards/${cardId}/progress`, {
        mastery_level: Math.min(5, Math.max(0, level)),
      })
      return response.data.data
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to update mastery level",
        code: error.response?.data?.code || "UPDATE_MASTERY_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Get user's study progress
   */
  async getStudyProgress(roomId = null) {
    try {
      let url = "/flashcards/progress"
      if (roomId) {
        url += `?roomId=${roomId}`
      }
      const response = await apiClient.get(url)
      return response.data.data || []
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to fetch progress",
        code: error.response?.data?.code || "GET_PROGRESS_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Get cards due for review
   */
  async getDueCards(roomId) {
    try {
      const response = await apiClient.get(`/rooms/${roomId}/flashcards/due`)
      return response.data.data || []
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to fetch due cards",
        code: error.response?.data?.code || "GET_DUE_CARDS_ERROR",
        details: error.response?.data,
      }
    }
  },
}
