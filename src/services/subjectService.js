import subjects from "@/mock/subjects.json"
import { mockResponse } from "./apiClient"

/**
 * Subject data access. Returns mock data today; swap bodies for API calls later.
 */
export const subjectService = {
  // TODO: Replace with apiClient.get("/subjects")
  getSubjects() {
    return mockResponse(subjects)
  },

  // TODO: Replace with apiClient.get(`/subjects/${id}`)
  getSubjectById(id) {
    return mockResponse(subjects.find((s) => s.id === id) || null)
  },

  /**
   * Search subjects by name or description
   */
  searchSubjects(query) {
    const lowercaseQuery = query.toLowerCase()
    const filtered = subjects.filter((subject) =>
      subject.name.toLowerCase().includes(lowercaseQuery) ||
      subject.description.toLowerCase().includes(lowercaseQuery)
    )
    return mockResponse(filtered)
  },

  /**
   * Filter subjects by progress range
   */
  filterByProgress(filterType) {
    if (filterType === "all") return mockResponse(subjects)

    const ranges = {
      beginner: [0, 33],
      intermediate: [34, 66],
      advanced: [67, 100],
    }

    const [min, max] = ranges[filterType] || [0, 100]
    const filtered = subjects.filter(
      (s) => s.progress >= min && s.progress <= max
    )
    return mockResponse(filtered)
  },

  /**
   * Sort subjects by various criteria
   */
  sortSubjects(subjects, sortType) {
    const sorted = [...subjects]

    switch (sortType) {
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name))
      case "progress-high":
        return sorted.sort((a, b) => b.progress - a.progress)
      case "progress-low":
        return sorted.sort((a, b) => a.progress - b.progress)
      case "recent":
        return sorted.sort(
          (a, b) =>
            new Date(b.lastStudied) - new Date(a.lastStudied)
        )
      case "notes":
        return sorted.sort((a, b) => b.notesCount - a.notesCount)
      default:
        return sorted
    }
  },
}
