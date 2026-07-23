import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { authService } from "../services"

const AuthContext = createContext(undefined)

const STORAGE_KEY = "studyhub-user"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  // Restore a previously logged-in session (real auth with JWT).
  useEffect(() => {
    try {
      // Check for stored user data
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      // ignore malformed storage
    } finally {
      setInitializing(false)
    }
  }, [])

  function persist(data) {
    // data can be: { user, token } or null
    if (data && data.token && data.user) {
      // Store JWT token separately for API requests
      window.localStorage.setItem('studyhub-token', data.token)
      // Store user data for display
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user))
      setUser(data.user)
    } else {
      // Clear everything on logout
      window.localStorage.removeItem('studyhub-token')
      window.localStorage.removeItem(STORAGE_KEY)
      setUser(null)
    }
  }

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAuthenticated: Boolean(user),
      async login(credentials) {
        const loggedIn = await authService.login(credentials)
        persist(loggedIn)
        return loggedIn
      },
      async register(details) {
        const created = await authService.register(details)
        persist(created)
        return created
      },
      async logout() {
        await authService.logout()
        persist(null)
      },
    }),
    [user, initializing],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
