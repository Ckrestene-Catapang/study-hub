import { apiClient } from "./apiClient"

/**
 * Room Service
 * Handles room API calls for Phase 2 implementation
 */

export const roomService = {
  /**
   * Create a new room
   */
  async createRoom(payload) {
    try {
      const response = await apiClient.post("/rooms", {
        name: payload.name,
        description: payload.description || "",
      })
      return response.data.data
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to create room",
        code: error.response?.data?.code || "CREATE_ROOM_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Get all rooms for current user
   */
  async getUserRooms() {
    try {
      const response = await apiClient.get("/rooms")
      return response.data.data || []
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to fetch rooms",
        code: error.response?.data?.code || "GET_ROOMS_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Get a specific room by ID
   */
  async getRoomById(roomId) {
    try {
      const response = await apiClient.get(`/rooms/${roomId}`)
      return response.data.data
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to fetch room",
        code: error.response?.data?.code || "GET_ROOM_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Update room details
   */
  async updateRoom(roomId, payload) {
    try {
      const response = await apiClient.put(`/rooms/${roomId}`, payload)
      return response.data.data
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to update room",
        code: error.response?.data?.code || "UPDATE_ROOM_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Delete a room
   */
  async deleteRoom(roomId) {
    try {
      await apiClient.delete(`/rooms/${roomId}`)
      return { success: true }
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to delete room",
        code: error.response?.data?.code || "DELETE_ROOM_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Join a room by invite code (alias for joinRoomByCode)
   */
  async joinRoom(code) {
    try {
      const response = await apiClient.post("/rooms/join", { code })
      return response.data.data
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to join room",
        code: error.response?.data?.code || "JOIN_ROOM_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Join a room by invite code
   */
  async joinRoomByCode(code) {
    try {
      const response = await apiClient.post("/rooms/join", { code })
      return response.data.data
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to join room",
        code: error.response?.data?.code || "JOIN_ROOM_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Get room members
   */
  async getRoomMembers(roomId) {
    try {
      const response = await apiClient.get(`/rooms/${roomId}/members`)
      return response.data.data || []
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to fetch room members",
        code: error.response?.data?.code || "GET_MEMBERS_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Add member to room
   */
  async addMemberToRoom(roomId, userId) {
    try {
      const response = await apiClient.post(`/rooms/${roomId}/members`, { userId })
      return response.data.data
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to add member",
        code: error.response?.data?.code || "ADD_MEMBER_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Remove member from room
   */
  async removeMemberFromRoom(roomId, userId) {
    try {
      await apiClient.delete(`/rooms/${roomId}/members/${userId}`)
      return { success: true }
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to remove member",
        code: error.response?.data?.code || "REMOVE_MEMBER_ERROR",
        details: error.response?.data,
      }
    }
  },

  /**
   * Leave a room
   */
  async leaveRoom(roomId) {
    try {
      await apiClient.post(`/rooms/${roomId}/leave`)
      return { success: true }
    } catch (error) {
      throw {
        error: error.response?.data?.error || "Failed to leave room",
        code: error.response?.data?.code || "LEAVE_ROOM_ERROR",
        details: error.response?.data,
      }
    }
  },
}
