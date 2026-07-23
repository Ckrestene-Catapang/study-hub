// Central route path definitions. Import these instead of hardcoding strings.
export const ROUTES = {
  LANDING: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/app",
  ROOMS: "/app/rooms",
  ROOM: "/app/rooms/:roomId",
  SUBJECTS: "/app/subjects",
  SUBJECT: "/app/subjects/:subjectId",
  NOTES: "/app/notes",
  FLASHCARDS: "/app/flashcards",
  QUIZ: "/app/quiz",
  PROGRESS: "/app/progress",
  AI_TUTOR: "/app/ai-tutor",
  SETTINGS: "/app/settings",
  PROFILE: "/app/profile",
}

/** Build a room detail path. */
export const roomPath = (roomId) => `/app/rooms/${roomId}`

/** Build a subject detail path. */
export const subjectPath = (subjectId) => `/app/subjects/${subjectId}`
