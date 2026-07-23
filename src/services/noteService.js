import { apiClient } from "./apiClient"

/**
 * Notes Service (v1.0.3)
 * Fully API-driven without mock fallbacks
 * All data comes from real backend
 */
export const noteService = {
  /**
   * Get all notes for authenticated user
   */
  async getNotes() {
    try {
      const response = await apiClient.get("/notes")
      return response.data.data || []
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to fetch notes",
        code: error.response?.data?.code || "FETCH_NOTES_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Get notes by room
   */
  async getNotesByRoom(roomId) {
    try {
      const response = await apiClient.get(`/notes/room/${roomId}`)
      return response.data.data || []
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to fetch room notes",
        code: error.response?.data?.code || "FETCH_ROOM_NOTES_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Get a single note
   */
  async getNoteById(id) {
    try {
      const response = await apiClient.get(`/notes/${id}`)
      return response.data.data
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to fetch note",
        code: error.response?.data?.code || "FETCH_NOTE_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Create a new note
   */
  async createNote(payload) {
    try {
      const response = await apiClient.post("/notes", {
        title: payload.title,
        content: payload.content,
        roomId: payload.roomId,
        tags: payload.tags || [],
      })
      return response.data.data
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to create note",
        code: error.response?.data?.code || "CREATE_NOTE_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Update a note
   */
  async updateNote(noteId, payload) {
    try {
      const response = await apiClient.put(`/notes/${noteId}`, {
        title: payload.title,
        content: payload.content,
        tags: payload.tags || [],
      })
      return response.data.data
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to update note",
        code: error.response?.data?.code || "UPDATE_NOTE_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Delete a note
   */
  async deleteNote(noteId) {
    try {
      await apiClient.delete(`/notes/${noteId}`)
      return { success: true }
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to delete note",
        code: error.response?.data?.code || "DELETE_NOTE_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Client-side search - searches array of notes
   */
  searchNotes(notesList, query) {
    if (!query || !notesList) return notesList
    const lowercaseQuery = query.toLowerCase()
    return notesList.filter(
      (note) =>
        note.title?.toLowerCase().includes(lowercaseQuery) ||
        note.content?.toLowerCase().includes(lowercaseQuery) ||
        note.tags?.some((tag) => tag?.toLowerCase().includes(lowercaseQuery))
    )
  },

  /**
   * Client-side sort
   */
  sortNotes(notesList, sortType) {
    if (!notesList) return []
    const sorted = [...notesList]

    switch (sortType) {
      case "title-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      case "title-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title))
      case "date-recent":
        return sorted.sort((a, b) =>
          new Date(b.updated_at) - new Date(a.updated_at)
        )
      case "date-oldest":
        return sorted.sort((a, b) =>
          new Date(a.updated_at) - new Date(b.updated_at)
        )
      default:
        return sorted
    }
  },
}
