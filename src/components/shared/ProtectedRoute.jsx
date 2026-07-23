import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Loading } from "../ui/Loading"
import { ROUTES } from "../../constants/routes"

export function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading label="Loading your workspace" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  }

  return children
}
