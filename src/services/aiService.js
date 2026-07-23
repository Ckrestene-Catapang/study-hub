import chat from "@/mock/chat.json"
import { mockResponse } from "./apiClient"

/** AI tutor data access. */
export const aiService = {
  // TODO: Replace with apiClient.get("/ai/history")
  getHistory() {
    return mockResponse(chat)
  },

  // TODO: Replace with apiClient.post("/ai/ask", { prompt }) — likely streamed.
  askAI(prompt) {
    const reply = {
      id: `msg_${Date.now()}`,
      role: "assistant",
      content: `Here's a helpful explanation about "${prompt}". (This is a mock response — connect the backend to get real AI answers.)`,
      createdAt: new Date().toISOString(),
    }
    return mockResponse(reply, 800)
  },
}
