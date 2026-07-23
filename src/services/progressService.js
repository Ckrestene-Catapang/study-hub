import progress from "@/mock/progress.json"
import { mockResponse } from "./apiClient"

/** Progress / analytics data access. */
export const progressService = {
  // TODO: Replace with apiClient.get("/progress")
  getProgress() {
    return mockResponse(progress)
  },
}
